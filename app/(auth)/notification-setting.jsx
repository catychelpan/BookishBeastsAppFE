import {
    View,
    Text,
    TouchableOpacity,
    Switch,
    Alert,
    StatusBar,
    Linking,
    Platform
} from "react-native";
import Constants from 'expo-constants';

import { useEffect, useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Notifications from 'expo-notifications';
import ImageHandler from "../../components/ImageHandler";


const NotificationSetting = () => {

    const [hasNotificationPermission, setNotificationPermission] = useState(false);

    const handleNotificationTogglePermission = async () => {
        const currentPermissions = await Notifications.getPermissionsAsync();
        if (!currentPermissions.granted) {
            const newPermissions = await Notifications.requestPermissionsAsync();
            setNotificationPermission(newPermissions.granted);
        } else {
            showDisableAlert();
        }
    }

    const showDisableAlert = () => {
        Alert.alert(
            "Disable Notifications",
            "To disable notifications, please go to Settings > Bookish > Notifications and turn them off.",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Open Settings", onPress: () => openNotificationSettings() }
            ]
        );
    };

    useEffect(() => {
        const checkPermissions = async () => {
            const permissions = await Notifications.getPermissionsAsync();
            setNotificationPermission(permissions.granted);
        };
        
        checkPermissions();

    }, []);

    const openNotificationSettings = () => {
        if (Platform.OS === 'android') {
            Linking.sendIntent('android.settings.APP_NOTIFICATION_SETTINGS', [
            { key: 'android.provider.extra.APP_PACKAGE', value: Constants.expoConfig?.android?.package },
            ]);
        } else {
            Linking.openSettings();
        }
    };


    return <SafeAreaView className="bg-[#F7F7F7] h-full">
        <View className="max-h-[60px] items-center flex-row h-full mx-5 mb-5">
            <TouchableOpacity
                className="mr-5"
                onPress={() => router.back()}>
                <ImageHandler source={require('../../assets/images/left_arrow.png')} />
            </TouchableOpacity>
            <Text className="text-black text-[24px] font-cygrebold max-w-[90%]">Notifications</Text>
        </View>
        <View className="border-[2px] mb-[45px] py-[15px] justify-end max-w-[90%] w-[348px] h-full flex-1 border-[#6592E3] max-h-[80px] bg-white self-center rounded-[13px]">
            <View className="flex flex-row justify-center px-[20px] items-center">
                <View className="flex-1">
                    <Text className="text-[#000000] text-[18px] font-bold font-cygrebold leading-[21.6px]">Stay on track</Text>
                    <Text className="text-[#000000] text-[14px] leading-[20px] font-cygreregular">Never miss your daily reading goal!</Text>
                </View>
                <Switch
                    size="medium"
                    thumbColor="#ffffff" 
                    trackColor={{
                        true: '#6592E3',
                        false: '#767577'    
                    }}
                    initialValue={hasNotificationPermission}
                    value={hasNotificationPermission}
                    containerStyles={'flex-[.2]'}
                    onValueChange={handleNotificationTogglePermission}
                />
            </View>
        </View>
        <StatusBar backgroundColor='#F7F7F7' style='auto' />
    </SafeAreaView>

}


export default NotificationSetting;