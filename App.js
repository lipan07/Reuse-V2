import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './components/AppNavigator';
import { AlertNotificationRoot } from 'react-native-alert-notification';

const HomeScreen = () => {
    return (
        <AlertNotificationRoot>
            <NavigationContainer>
                <AppNavigator />
            </NavigationContainer>
        </AlertNotificationRoot>
    );
};
export default HomeScreen;