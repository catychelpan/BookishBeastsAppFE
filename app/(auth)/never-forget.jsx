import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, TouchableOpacity, Alert, Linking, Switch } from "react-native";
import { router } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import OnboardingProgress from "../../components/OnboardingProgress";
import WheelPicker from '@quidone/react-native-wheel-picker';
import { useState, useEffect, useContext } from "react";
import * as Notifications from 'expo-notifications';
import { UserContext } from "../../context/UserContext";

const getTimeZoneId = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
  // Returns: "America/New_York", "Europe/Berlin", "Asia/Tokyo", etc.
};


const NeverForget = () => {

    const [hasNotificationPermission, setNotificationPermission] = useState(false);

    const { setOnboardingState } = useContext(UserContext);

    const handleNotificationTogglePermission = async () => {
        const currentPermissions = await Notifications.getPermissionsAsync();
        if (!currentPermissions.granted) {
            const newPermissions = await Notifications.requestPermissionsAsync();
            setNotificationPermission(newPermissions.granted);
            setOnboardingState((prev) => ({
                ...prev,
                isNotificationsEnabled: newPermissions.granted
            }));
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
                { text: "Open Settings", onPress: () => Linking.openSettings() }
            ]
        );
    };

    useEffect(() => {
        const checkPermissions = async () => {
            const permissions = await Notifications.getPermissionsAsync();
            setNotificationPermission(permissions.granted);
            setOnboardingState((prev) => ({
                ...prev,
                isNotificationsEnabled: permissions.granted
            }));
        };
        
        checkPermissions();

    }, []);

    // 00:00 is kinda tricky 
    const hours = [...Array(12).keys()].map((_, val) => ({
        value: val,
        label: val,
    }));

    const minutes = [...Array(60).keys()].map((_, val) => ({
        value: val,
        label: val < 10 ? val.toString().padStart(2,'0') : val.toString(),
    }));

    const timeFormat = [...['AM', 'PM']].map((val, idx) => ({
        value: val,
        label: val,
    }));

    useEffect(() => {
        //fetch existing time preferences
    }, []);

    const [hour, setHour] = useState(2);

    const [minute, setMinute] = useState(0);

    const [timeFormats, setTimeFormats] = useState("PM");

    const handleContninue = () => {
        setOnboardingState((prev) => ({
            ...prev,
            neverForget: {
                hour: hour,
                minute: minute, 
                timeFormat: timeFormats,
                timeZoneId: getTimeZoneId()
            }
        }));
        router.push('/set-books')
    }

    return <SafeAreaView className="bg-[#F7F7F7] h-full">
        <ScrollView contentContainerStyle={{ height: "100%" }}>
            <View className="w-full px-[20px] mt-[20px]">
                <OnboardingProgress stage1={56} />
            </View>
            <View className="w-full mt-[50px] mb-[38px] items-center">
                <Text className="font-bold max-w-[165px] text-[24px] text-center leading-[27px] font-cygrebold">
                    Never Forget
                </Text>
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
            <View className="items-center relative gap-x-2 flex-row justify-center max-h-[250px] py-5 border border-[#8A8A8A] rounded-[15px] mx-[23px]">
                <WheelPicker
                    value={hour}
                    onValueChanged={(v) => setHour(v.item.label)}
                    data={hours}
                    width={50}
                    
                />
                <WheelPicker
                    data={minutes}
                    value={minute}
                    onValueChanged={(v) => setMinute(v.item.label)}
                    width={50}
                />
                <WheelPicker
                    value={timeFormats}
                    onValueChanged={(v) => setTimeFormats(v.item.value)}
                    data={timeFormat}
                    width={50}
                />
            </View>
            <View className="w-full flex-1 justify-end">
            <TouchableOpacity
                onPress={handleContninue}
                className="bg-[#6592E3] max-w-[313px] w-full self-center mb-[11px] items-center justify-center max-h-[52px] h-full rounded-[47px]">
                <Text className="text-[#FEFEFC] text-[18px] leading-[22px] font-semibold">Continue</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => router.push('/set-books')}
                className="border border-[#000000] mb-[28px] self-center bg-transparent items-center justify-center max-w-[313px] w-full max-h-[52px] h-full rounded-[47px]">
                <Text className="text-[#000000] text-[18px] leading-[22px] font-semibold">Skip For Now</Text>
            </TouchableOpacity>
            </View>
        </ScrollView>
        <StatusBar backgroundColor='#F7F7F7' style='dark' />
    </SafeAreaView>

}



//gotta figure out how 

export default NeverForget;