import Echo from 'laravel-echo';
import AsyncStorage from '@react-native-async-storage/async-storage';

let echoInstance = null;
let connectionAttempts = 0;
const MAX_CONNECTION_ATTEMPTS = 5;

const getWebSocketImplementation = () => {
  // Use native browser WebSocket if available
  if (typeof WebSocket !== 'undefined') {
    return WebSocket;
  }
  
  // For React Native, use ws package
  try {
    return require('ws');
  } catch (error) {
    throw new Error('WebSocket implementation not found. For React Native, install ws package: npm install ws');
  }
};

const initializeEcho = async () => {
  if (echoInstance && echoInstance.connector?.socketId) {
    return echoInstance;
  }

  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Validate environment variables
    const requiredEnvVars = ['REVERB_APP_KEY', 'REVERB_HOST', 'BASE_URL'];
    requiredEnvVars.forEach(varName => {
      if (!process.env[varName]) {
        throw new Error(`Missing required environment variable: ${varName}`);
      }
    });

    const host = process.env.REVERB_HOST;
    const port = parseInt(process.env.REVERB_PORT, 10) || 8080;
    const scheme = process.env.REVERB_SCHEME === 'https' ? 'https' : 'http';
    const useTLS = scheme === 'https';

    echoInstance = new Echo({
      broadcaster: 'reverb',
      key: process.env.REVERB_APP_KEY,
      wsHost: host,
      wsPort: port,
      forceTLS: useTLS,
      enabledTransports: ['ws', 'wss'],
      disableStats: true,
      authEndpoint: `${process.env.BASE_URL}/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      },
      // Provide the proper WebSocket implementation
      client: getWebSocketImplementation(),
    });

    setupConnectionMonitoring(echoInstance);
    connectionAttempts = 0;

    return echoInstance;
  } catch (error) {
    console.error('Echo initialization error:', error);
    if (connectionAttempts < MAX_CONNECTION_ATTEMPTS) {
      connectionAttempts++;
      await new Promise(resolve => setTimeout(resolve, 1000 * connectionAttempts));
      return initializeEcho();
    }
    throw error;
  }
};


const setupConnectionMonitoring = (echo) => {
  const socket = echo.connector?.connection;

  if (!socket) {
    console.warn('Socket connection not available');
    return;
  }

  // Connection events
  socket.on('connecting', () => {
    console.log('🟡 Connecting to Reverb...');
  });

  socket.on('connected', () => {
    console.log('🟢 Successfully connected to Reverb');
    connectionAttempts = 0;
  });

  socket.on('disconnected', () => {
    console.log('🔴 Disconnected from Reverb');
    attemptReconnect(echo);
  });

  socket.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
    attemptReconnect(echo);
  });

  // Ping/pong monitoring
  let pingInterval;
  let pongTimeout;

  const startPingPong = () => {
    pingInterval = setInterval(() => {
      socket.send(JSON.stringify({ event: 'ping' }));
      pongTimeout = setTimeout(() => {
        console.warn('No pong received - connection may be stale');
        socket.close();
      }, 5000);
    }, 25000);

    socket.on('message', (data) => {
      try {
        const message = JSON.parse(data);
        if (message.event === 'pong') {
          clearTimeout(pongTimeout);
        }
      } catch (e) {
        console.debug('Non-JSON message received:', data);
      }
    });
  };

  socket.on('connected', startPingPong);
  socket.on('disconnected', () => {
    clearInterval(pingInterval);
    clearTimeout(pongTimeout);
  });
};

const attemptReconnect = (echo) => {
  if (connectionAttempts >= MAX_CONNECTION_ATTEMPTS) {
    console.error('Max reconnection attempts reached');
    return;
  }

  connectionAttempts++;
  const delay = Math.min(1000 * connectionAttempts, 10000); // Exponential backoff max 10s

  console.log(`Retrying connection in ${delay}ms (attempt ${connectionAttempts}/${MAX_CONNECTION_ATTEMPTS})`);

  setTimeout(() => {
    echo.connector.connect();
  }, delay);
};

export { initializeEcho };