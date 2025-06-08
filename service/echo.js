import Echo from 'laravel-echo';
import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REVERB_HOST, REVERB_PORT, REVERB_SCHEME } from '@env'; // or use Config from 'react-native-config'

const baseURL = REVERB_HOST;
const port = REVERB_PORT;

export const createEcho = async () => {
    const token = await AsyncStorage.getItem('authToken');
    const echo = new Echo({
        broadcaster: 'socket.io',
        host: `${baseURL}:${port}`,
        client: io,
        transports: ['websocket'],
        auth: {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    });
    echo.connector.socket.on('connect', () => {
        console.log('Echo socket connected');
    });
    echo.connector.socket.on('connect_error', (err) => {
        console.log('Echo socket connect_error:', err);
    });
    echo.connector.socket.on('disconnect', (reason) => {
        console.log('Echo socket disconnected:', reason);
    });
    return echo;
};