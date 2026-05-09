import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert,
    TextInput,
    Switch,
    Linking
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import * as Notifications from 'expo-notifications';
import WheelPicker from '@quidone/react-native-wheel-picker';
import axios from '../../network/axios';

const timeZoneId = Intl.DateTimeFormat().resolvedOptions().timeZone;


const DailyGoal = () => {
    
    const [goal, setGoal] = useState('Pages');

    const handleGoalTypePage = () => setGoal('Pages');

    const handleGoalTypeTime = () => setGoal('Time');

    const handleHourInputChange = (value) => {
        if (goal === 'Pages') {
            setPagesGoal(value);
        } else {
            setMinutesGoal(value);
        }
    }

    const hours = [...Array(12).keys()].map((_, val) => ({
        value: val,
        label: val,
    }));

    const minutes = [...Array(60).keys()].map((_, val) => ({
        value: val,
        label: val < 10 ? val.toString().padStart(2,'0') : val.toString(),
    }));

    const timeFormats = [...['AM', 'PM']].map((val, idx) => ({
        value: val,
        label: val,
    }));

    const [hour, setHour] = useState(2);

    const [minute, setMinute] = useState(0);

    const [timeFormat, setTimeFormat] = useState("AM");

    const pagesInputRef = useRef(null);

    const [pagesGoal, setPagesGoal] = useState(null);

    const [minutesGoal, setMinutesGoal] = useState(null);

    const [hasNotificationPermission, setNotificationPermission] = useState(false);

    const [errors, setErrors] = useState({
        pagesGoal: '',
        minutesGoal: ''
    });

    const updateUserPreferences = async () => {
        if (goal === 'Pages' && (!pagesGoal || pagesGoal == 0)) {
            setErrors((prev) => ({
                ...prev,
                pagesGoal: 'Invalid pages goal'
            }));
            return;
        }
        if (goal === 'Time' && (!minutesGoal || minutesGoal == 0)) {
            setErrors((prev) => ({
                ...prev,
                minutesGoal: 'invalid minutes goal'
            }));
            return;
        }
        const bodyGoal = goal === 'Pages' ?
            { pagesRead: pagesGoal, 
                dailyReminderAt: { hour, minute, timeFormat, timeZoneId },
            } : { timeLengthInMinutes: minutesGoal,
                dailyReminderAt: { hour, minute, timeFormat, timeZoneId },
            };
        try {
            await axios.post('users/preferences', bodyGoal);
            if (goal === 'Pages') {
                setMinutesGoal(null);
            } else {
                setPagesGoal(null);
            }
            setErrors({
                pagesGoal: '',
                minutesGoal: ''
            });
            pagesInputRef?.current?.blur();
        } catch(error) {
            console.log(error);
        }
    }

    const handleSave = async () => {
        await updateUserPreferences();
    }

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
                { text: "Open Settings", onPress: () => Linking.openSettings() }
            ]
        );
    };

    const handleReset = () => {
        setGoal('Pages');
        //pagesInputRef.current?.clear();
        //minutesInputRef.current?.clear();
        setPagesGoal(null);
        setMinutesGoal(null);
    }

    const fetchGoals = async () => {
        try {
            const { data } = await axios.get('users/goals');
            if (data.timeLengthInMinutes) {
                setGoal('Time');
                //minutesInputRef?.current?.setValue(data.timeLengthInMinutes);
                setMinutesGoal(data.timeLengthInMinutes);
            } else {
                setGoal('Pages');
                //pagesInputRef?.current?.setValue(data.pagesRead);
                setPagesGoal(data.pagesReadGoal);
            }
            console.log(data)
        } catch(error) {
            console.log(error)
        }
    }

    useLayoutEffect(() => {
        fetchGoals();
    }, []);

    useEffect(() => {
        const checkPermissions = async () => {
            const permissions = await Notifications.getPermissionsAsync();
            setNotificationPermission(permissions.granted);
        };
        
        checkPermissions();
    }, [])

    return <SafeAreaView className="bg-[#F7F7F7] h-full">
        <View className="max-h-[60px] justify-between items-center flex-row h-full mx-5 mb-8">
            <TouchableOpacity
                className="mr-4"
                onPress={() => router.back()}>
                <MaterialIcons name="close" size={24} color="black" />
            </TouchableOpacity>
            <Text className="text-black font-cygrebold flex-1 text-[24px]">Daily Goal</Text>
            <TouchableOpacity
                onPress={handleSave}
                className="bg-primary flex-1 mt-2.5 max-w-[110px] w-full items-center justify-center max-h-[48px] h-full rounded-[30px]">
                <Text className="text-[#FEFEFC] text-[18px] leading-[22px] font-semibold">Save</Text>
            </TouchableOpacity>
        </View>
        <ScrollView>
            <View className="mx-5 mb-4">
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-[#121F16] text-[18px] font-cygrebold">Type of goal</Text>
                    <View className="flex-row">
                        <Text className="underline underline-offset-3 mr-2 text-black font-cygrebold">Reset</Text>
                        <TouchableOpacity
                            onPress={handleReset}
                            className="rounded-full bg-[#000] p-1">
                            <MaterialIcons name='close' color={'#fff'} size={14} />
                        </TouchableOpacity>
                    </View>
                </View>
                <Text className="text-[12px] font-cygreregular mb-4 max-w-[80%]">*Only one type of goal is possible to set at a time. Please, choose either by pages or by time.</Text>
                <View className="flex-row">
                    <GoalType goal={'Pages'} selected={goal == 'Pages'} onPress={handleGoalTypePage} />
                    <GoalType goal={'Time'} selected={goal === 'Time'} onPress={handleGoalTypeTime} />
                </View>
            </View>
            <View className="mx-5 flex-row">
                <View className="flex-1 max-w-[155px] mb-7">
                    <Text className='text-[#121F16] text-[14px] font-cygreregular mb-1.5'>{goal === 'Pages' ? 'Pages' : 'Minutes'}</Text>
                    <View className="border-[.5px] border-[#8A8A8A] rounded-[15px] max-w-[155px]">
                        <TextInput
                            value={goal === 'Pages' ? pagesGoal?.toString() : minutesGoal?.toString()}
                            ref={pagesInputRef}
                            keyboardType='numeric'
                            onChangeText={handleHourInputChange}
                            className="px-5 py-3 text-black leading-[19.2px] font-cygreregular" 
                        />
                    </View>
                    { errors[goal === 'Pages' ? 'pagesGoal' : 'minutesGoal'] && <Text className='font-cygrebold max-h-[20px] text-[12px] text-red'>{errors[goal === 'Pages' ? 'pagesGoal' : 'minutesGoal']}</Text> }
                </View>
            </View>
            <View className="mx-5 mb-5">
                <Text className="text-[#121F16] text-[18px] font-cygrebold mb-2">Set reminder</Text>
                    <View className="border-[2px] border-[#6592E3] bg-white rounded-[13px] max-h-[72px] py-2">
                        <View className="flex-row justify-between items-center p-3">
                            <View className="justify-center flex-1">
                                <Text className="text-secondary text-[18px] font-bold font-cygrebold leading-[21.6px]">Enable Notifications</Text>
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
            </View>

            <View className="items-center relative gap-x-5 flex-row justify-center max-h-[250px] border border-[#8A8A8A] rounded-[15px] mx-5 mb-7">
                <WheelPicker
                    style={{position: 'relative' }}
                    value={hour}
                    onValueChanged={(v) => setHour(v.item.label)}
                    data={hours}
                    width={40}
                />
                <WheelPicker
                    data={minutes}
                    value={minute}
                    onValueChanged={(v) => setMinute(v.item.label)}
                    width={40}
                />
                <WheelPicker
                    data={timeFormats}
                    value={timeFormat}
                    onValueChanged={(v) => setTimeFormat(v.item.value)}
                    width={40}
                />
            </View>
        </ScrollView>
    </SafeAreaView>
}

const GoalType = ({ goal, selected, onPress }) => {
    return <TouchableOpacity onPress={onPress} className={`${selected ? 'bg-primary' : 'bg-[#fff]'}  py-2 px-3 max-h-[40px] w-[124px] mr-1.5 border-[.5px] border-[#8A8A8A] rounded-[8px] justify-between items-center`}>
        <Text className={`${selected ? 'text-white' : 'text-black'} text-[14px] text-center leading-[20px] font-cygrebold`}>{goal}</Text>
    </TouchableOpacity>
}


export default DailyGoal;