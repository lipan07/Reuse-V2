// service/echo.js
import Echo from 'laravel-echo';
import Pusher from 'pusher-js/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

window.Pusher = Pusher;

export const createEcho = async () => {
  const token = await AsyncStorage.getItem('authToken');

  return new Echo({
    broadcaster: 'reverb',
    key: 'hfp2qfd7f31x7jft19r4',
    cluster: 'mt1', 
    wsHost: 'big-brain.co.in',
    wsPort: 8080,
    wssPort: 8080,
    forceTLS: false,
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
    authEndpoint: 'https://big-brain.co.in/broadcasting/auth',
    auth: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  });
};
