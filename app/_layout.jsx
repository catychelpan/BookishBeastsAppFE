import { useEffect, useState } from 'react'
import { Stack, SplashScreen, useRouter } from 'expo-router'
import * as Notifications from 'expo-notifications';
import { useFonts } from 'expo-font';
import { UserProvider } from '../context/UserContext';
import axios from '../network/axios';
import { StripeProvider } from '@stripe/stripe-react-native';

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowList: true
  }),
});

const RootLayout = () => {
    const router = useRouter();
    const [publishableKey, setPublishableKey] = useState('');
    
    const [fontsLoaded, error] = useFonts({
        "Cygre-Bold": require("../assets/fonts/Cygre-Bold.ttf"),
        "Cygre-Regular": require("../assets/fonts/Cygre-Regular.ttf"),
        "Cygre-SemiBold": require("../assets/fonts/Cygre-SemiBold.ttf"),
        "Inter": require("../assets/fonts/Inter_24pt-Bold.ttf"),
        "Roboto": require("../assets/fonts/Roboto-Regular.ttf"),
        "Roboto-Black": require("../assets/fonts/Roboto-Black.ttf")
    });

    const fetchPublishableKey = async () => {
        try {
            const { data } = await axios.get('stripe/keys');
            setPublishableKey(data.publishableKey);
        } catch (error) {
            console.error('Error fetching publishable key:', error);
        }
    };

    const handleNavigation = (data) => {
        if (!data?.path) return;
        const { path, ...params } = data;
        router.push({
            pathname: path,
            params: params,
        });
    };

    useEffect(() => {
        fetchPublishableKey();
    }, []);

    useEffect(() => {
        // Handle notification tap (background/quit state)
        const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
            const data = response.notification.request.content.data;
            handleNavigation(data);
        });

        // Check if app was opened from notification (quit state)
        Notifications.getLastNotificationResponse()?.then((response) => {
            if (response) {
                const data = response.notification.request.content.data;
                handleNavigation(data);
            }
        });

        return () => {
            subscription.remove();
        };
    }, []);

    useEffect(() => {
        if (error) throw error;
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, error]);

    if (!fontsLoaded && !error) {
        return null;
    }

    return (
        <StripeProvider
            publishableKey={publishableKey}
            merchantIdentifier='merchant.com.readneverforget.app'
            urlScheme='test-scheme'
        >
            <UserProvider>
                <Stack>
                    <Stack.Screen name="index" options={{ headerShown: false }} />
                    <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                </Stack>
            </UserProvider>
        </StripeProvider>
    );
}

export default RootLayout