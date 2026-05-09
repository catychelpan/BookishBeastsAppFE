import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Alert,
    Switch,
    Linking,
} from "react-native";
import { useContext, useEffect, useState, useRef } from "react";
import { Feather } from "@expo/vector-icons";

import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { MaterialIcons } from '@expo/vector-icons';
import FormField from "../../components/FormField";
import Entypo from '@expo/vector-icons/Entypo';
import WheelPicker from '@quidone/react-native-wheel-picker';
import * as Notifications from 'expo-notifications';
import RadioButton from "../../components/RadioButton";
import axios from '../../network/axios';
import { UserContext } from "../../context/UserContext";


const OFFSETS = {
    LIGHT: [2, 7, 21, 45, 90, 180],
    STANDARD: [1, 6, 14, 30, 66, 150, 360],
    INTENSIVE: [1, 3, 7, 15, 35, 90, 240],
    CRAM: [1, 2, 4, 7, 14, 30]
}

const MODES = {
    'Light': 0,
    'Standard': 1,
    'Intensive': 2,
    'Cram': 3
}

const getRepetitionMode = (modeName) => {
    console.log(modeName, MODES[modeName]);
    return MODES[modeName]
}

const AddRepetitionGroup = () => {

    const [hasNotificationPermission, setNotificationPermission] = useState(false);

    const { repetitionGroup: { quotes, notes }, setRepetitionGroup } = useContext(UserContext);

    const hours = [...Array(12).keys()].map((index, val) => ({
        value: val + 1,
        label: val + 1,
    }));

    const minutes = [...Array(60).keys()].map((index, val) => ({
        value: val < 10 ? val.toString().padStart(2,'0') : val.toString(),
        label: val < 10 ? val.toString().padStart(2,'0') : val.toString(),
    }));

    const timeFormat = [...['AM', 'PM']].map((val, idx) => ({
        value: val,
        label: val,
    }));

    const [selectedOption, setSelectedOption] = useState('Light');

    const [hour, setHour] = useState(0);

    const inputRef = useRef(null);

    const [minute, setMinute] = useState(0);

    const [timeFormats, setTimeFormats] = useState("AM");

    const [groupName, setGroupName] = useState('');

    const [errors, setErrors] = useState({
        groupName: ''
    });

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

    const [offset, setOffset] = useState(OFFSETS.LIGHT);

    const handleSelectQuotesRedirect = () => {
        router.push('select-quotes-many');
    }

    const handleSelectNotesRedirect = () => {
        router.push('select-notes-many')
    }

    const handleLightMode = () => {
        setOffset(OFFSETS.LIGHT)
        setSelectedOption("Light");
    };

    const handleStandardMode = () => {
        setOffset(OFFSETS.STANDARD);
        setSelectedOption("Standard")
    };

    const handleIntensiveMode = () => {
        setOffset(OFFSETS.INTENSIVE);
        setSelectedOption("Intensive");
    };

    const handleCramMode = () => {
        setOffset(OFFSETS.CRAM);
        setSelectedOption("Cram");
    }

    const getNoteIds = () => notes.map(item => item.id);

    const getQuoteIds = () => quotes.map(item => item.id);

    const handleSave = async () => {
        try {
            if (!groupName) {
                setErrors(prev => ({...prev, groupName: 'Group name cannot be empty'}));
                return;
            }
            await axios.post('users/repetition-group', {
                name: groupName,
                quoteIds: getQuoteIds(),
                noteIds: getNoteIds(),
                //scheduledTimes: generateTimestamps(),
                //timeZoneId: Intl.DateTimeFormat().resolvedOptions().timeZone
                mode: getRepetitionMode(selectedOption),
                time: {
                    hour: hour,
                    minute: minute,
                    timeZoneId: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    timeFormat: timeFormats
                }
            });
            router.replace('repetition');
        } catch(error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const checkPermissions = async () => {
            const permissions = await Notifications.getPermissionsAsync();
            setNotificationPermission(permissions.granted);
        };
        
        checkPermissions();

    }, []);


    useEffect(() => {
        inputRef?.current?.focus();
        return () => setRepetitionGroup({ quotes: [], notes: [] })
    }, []);



    return (
        <SafeAreaView className="bg-[#F7F7F7] h-full flex-1">
            <View className="max-h-[60px] justify-between items-center flex-row h-full mx-5 mb-7">
                <TouchableOpacity
                    className="mr-4"
                    onPress={() => router.back()}>
                    <MaterialIcons name="close" size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-black font-cygrebold flex-1 text-[22px] font-bold">Create Group</Text>
                <TouchableOpacity
                    onPress={handleSave}
                    className="bg-primary flex-1 mt-2.5 max-w-[110px] w-full items-center justify-center max-h-[48px] h-full rounded-[30px]">
                    <Text className="text-[#FEFEFC] text-[18px] leading-[22px] font-semibold">Save</Text>
                </TouchableOpacity>
            </View>
            <ScrollView>
                <View className="px-4 mb-10">
                    <FormField
                        inputRef={inputRef}
                        title={'Name'}
                        value={groupName}
                        handleChangeText={(e) => setGroupName(e)}
                        placeholder={'Enter name for this group'}
                        placeholderTextColor={'#8A8A8A'}
                        textInputContainerStyles={'rounded-[15px]'}
                        error={errors?.groupName}
                        errorText={errors?.groupName}
                    />
                </View>
                { quotes.length === 0 ? (
                    <View className="px-4 max-h-[160px] mb-5">
                        <Text className="text-[#1C1C1C] text-[20px] font-cygrebold leading-[24px] mb-4">Add Quotes to repeat</Text>
                        <TouchableOpacity
                            onPress={handleSelectQuotesRedirect}
                            className="bg-[#1C1C1C] max-h-[116px] h-full items-center justify-center rounded-[20px]"> 
                            <View className="justify-center items-center">
                                <Entypo name="plus" size={54} color="white" />
                                <Text className="text-white font-cygreregular text-center">Add Quotes</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                ) : <ScrollView 
                        showsHorizontalScrollIndicator={false}
                        className="mx-4 max-h-[250px] mb-5"
                        contentInsetAdjustmentBehavior="automatic"
                        initialNumToRender={10}
                        horizontal>
                            <View className="flex-1">
                                <TouchableOpacity
                                    onPress={handleSelectQuotesRedirect}
                                    className="w-[97px] bg-[#1C1C1C] items-center justify-center max-h-[97px] h-full rounded-[20px] mr-3">
                                    <Text className="text-white text-[50px] pb-3">+</Text>
                                </TouchableOpacity>
                            </View>
                            { quotes.map(item =>
                                <Quote
                                    key={item.id}
                                    id={item.id}
                                    book={item.book}
                                    text={item.text}
                                    showRadioButton={false}
                                    onDeleteButtonPress={() => handleQuoteDelete(item.id)}
                                    containerStyles={'mr-4 max-w-[361px] w-full flex-1'}
                            />) }
                    </ScrollView>
                }
                { notes.length === 0 ? (
                    <View className="px-4 max-h-[160px] mb-14">
                        <Text className="text-[#1C1C1C] text-[20px] font-cygrebold leading-[24px] mb-4">Add Notes to repeat</Text>
                        <TouchableOpacity
                            onPress={handleSelectNotesRedirect}
                            className="bg-[#1C1C1C] max-h-[116px] h-full items-center justify-center rounded-[20px]"> 
                            <View className="justify-center items-center">
                                <Entypo name="plus" size={54} color="white" />
                                <Text className="text-white font-cygreregular text-center">Add Notes</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <ScrollView 
                        showsHorizontalScrollIndicator={false}
                        className="mx-4 max-h-[250px] mb-5"
                        contentInsetAdjustmentBehavior="automatic"
                        initialNumToRender={10}
                        horizontal>
                            <View className="flex-1">
                                <TouchableOpacity
                                    onPress={handleSelectNotesRedirect}
                                    className="w-[97px] bg-[#1C1C1C] items-center justify-center max-h-[97px] h-full rounded-[20px] mr-3">
                                    <Text className="text-white text-[50px] pb-3">+</Text>
                                </TouchableOpacity>
                            </View>
                            { notes.map(item =>
                                <Note
                                    key={item.id}
                                    id={item.id}
                                    createdAt={item.createdAt}
                                    icon={item.noteTypeIcon}
                                    typeName={item.noteTypeName}
                                    color={item.noteTypeColor}
                                    content={item.text}
                                    showRadioButton={false}
                                    //onDeleteButtonPress={() => handleNote(item.id)}
                                    containerStyles={'mr-4 max-w-[361px] w-full flex-1'}
                            />) }
                    </ScrollView>
                ) }
                <View className="px-4 max-h-[160px] mb-2.5">
                    <Text className="text-[#1C1C1C] text-[20px] font-cygrebold leading-[24px] mb-4">Get Notified</Text>
                    <View className="border-[2px] border-[#6592E3] bg-white rounded-[13px]">
                        <View className="flex-row justify-between items-center p-5">
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
                <View className="px-4 max-h-[50px] mb-12">
                    <Text className="text-black font-cygreregular leading-[19.2px]">Reviewing your notes at systematic intervals: firstly after 1 day, then 3 days, 1 week, 2 weeks etc.</Text>
                </View>
                <View className="px-4 max-h-[50px]">
                    <Text className="text-[#1C1C1C] text-[20px] font-cygrebold leading-[24px]">Repetition Mode</Text>
                </View>
                <View className="px-4 max-h-[450px] mb-7">
                    <OptionRow
                        isSelected={selectedOption === 'Light'}
                        name={'Light'}
                        desc={'Minimal commitment for soft recall'}
                        intervalDesc={'0, 2, 7, 21, 45, 90, 180'}
                        setIsSelected={handleLightMode}
                    />
                    <OptionRow
                        isSelected={selectedOption === 'Standard'}
                        name={'Standard'}
                        desc={'Balanced, long-term memory'}
                        intervalDesc={'0, 1, 6, 14, 30, 66, 150, 360'}
                        setIsSelected={handleStandardMode}
                    />
                    <OptionRow
                        isSelected={selectedOption === 'Intensive'}
                        name={'Intensive'}
                        desc={'Quicker ramp-up with tighter intervals'}
                        intervalDesc={'0, 1, 3, 7, 15, 35, 90, 240'}
                        setIsSelected={handleIntensiveMode}
                    />
                    <OptionRow
                        isSelected={selectedOption === 'Cram'}
                        name={'Cram it in'}
                        desc={'High-frequency reviews to force memory before an exam/talk'}
                        intervalDesc={'0, 1, 2, 4, 7, 14, 30'}
                        setIsSelected={handleCramMode}
                    />
                </View>
                <View className="mx-5 mb-5">
                    <Text className="text-[#1C1C1C] text-[20px] font-cygrebold leading-[24px]">Select Time for Reminders</Text>
                </View>
                <View className="items-center flex-1 relative gap-x-6 flex-row justify-center max-h-[250px] border border-[#8A8A8A] rounded-[15px] mx-4 mb-7">
                    <WheelPicker
                        value={hour}
                        onValueChanged={(v) => setHour(v.item.value)}
                        data={hours}
                        width={50}
                    />
                    <WheelPicker
                        data={minutes}
                        value={minute}
                        onValueChanged={(v) => setMinute(v.item.value)}
                        width={50}
                    />
                    <WheelPicker
                        value={timeFormats}
                        onValueChanged={(v) => setTimeFormats(v.item.value)}
                        data={timeFormat}
                        width={50}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}


export default AddRepetitionGroup;


const OptionRow = ({ isSelected, setIsSelected, name, desc, intervalDesc }) => {
    return (
        <>
            <OptionCard
                isSelected={isSelected}
                setIsSelected={setIsSelected} 
                name={name}
                desc={desc}
            />
            { isSelected ? (
                <View className="flex-row items-center mt-2">
                    <Text className="text-primary font-cygrebold">Reviews on Day: </Text>
                    <Text className="text-primary font-cygreregular">{intervalDesc}</Text>
                </View>
            ) : <></> }
        </>
    )
}

const OptionCard = ({ isSelected, name, desc, setIsSelected, containerStyles }) => {

    //unknown rounding
    return <View
        className={`max-h-[88px] mt-4 w-full h-full items-center bg-[#ffffff] flex-row justify-between rounded-[15px] border ${isSelected ? 'border-[#6592E3] border-[2px]' : 'border-[#1C1C1C]'} px-[30px] ${containerStyles} `}>
            <View className="max-w-[80%]">
                <Text className={`font-semibold text-[18px] leading-[21px] font-cygrebold ${isSelected ? 'text-[#6592E3]' : 'text-[#1C1C1C]' }`}>{name}</Text>
                <Text className={`leading-[21px] ${isSelected ? 'text-[#6592E3]' : 'text-[#1C1C1C]' }`}>{desc}</Text>
            </View>
        <RadioButton
            size={42}
            selected={isSelected}
            onPress={setIsSelected}
        />
    </View>
}

const Note = ({ id, content, typeName, onDeleteButtonPress, color, icon, createdAt, containerStyles }) => {

    const confirmDelete = () => {
        Alert.alert(
            "Delete Note",
            "Are you sure you want to delete this note? This action cannot be undone.",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                { 
                    text: "Delete", 
                    onPress: async () => {
                        await onDeleteButtonPress(id);
                    },
                    style: "destructive" // This will make it red on iOS
                }
            ]
        );
    }

    return (
        <View className={`flex-row flex-1 w-full max-w-[361px] ${containerStyles}`}>
            <View className="w-full max-h-[267px] h-full border-[.5px] rounded-[20px] p-5">
                <View className="flex-row items-center mb-4">
                    <View
                        style={{backgroundColor: color}}
                        className="p-2 rounded-[13px] max-h-[40px] h-full flex-row items-center justify-center mr-2.5">
                        <Text className="text-[12px] mr-0.5">{icon}</Text>
                        <Text className="text-sm text-[#fff] font-cygresemibold leading-[16.8px]" numberOfLines={1} ellipsizeMode="tail">{typeName}</Text>
                    </View>
                    <View className="p-2 bg-[#EEEEEE] rounded-[13px] max-h-[40px] h-full items-center justify-center">
                        <Text className="text-sm text-black font-cygresemibold leading-[16.8px] text-center">{new Date(createdAt)?.toLocaleDateString('de-DE') ?? '30.09.2024'}</Text>
                    </View>
                    <View className="flex-1 items-end">
                        <TouchableOpacity
                            onPress={confirmDelete}
                            className="bg-black rounded-full p-2 ">
                                <MaterialIcons name="delete" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View className="rounded-[8px] bg-[#EEEEEE] pt-3 px-4 max-w-[327px] max-h-[130px] h-full w-full">
                    <Text className="text-black font-cygreregular leading-[19.2px] font-medium">
                        {content}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const Quote = ({ id, text, book, onDeleteButtonPress, containerStyles }) => {

    const confirmDelete = () => {
        Alert.alert(
            "Delete Quote",
            "Are you sure you want to delete this quote? This action cannot be undone.",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                { 
                    text: "Delete", 
                    onPress: async () => {
                        await onDeleteButtonPress(id);
                    },
                    style: "destructive" // This will make it red on iOS
                }
            ]
        );
    }

    return (
        <View className={`flex-row flex-1 w-full max-w-[361px] ${containerStyles}`}>
            <View className="w-full max-h-[267px] h-full border-[.5px] rounded-[20px] p-5">
                <View className="flex-row items-center mb-4">
                    <View className="p-2 bg-black flex-row rounded-[13px] max-h-[40px] h-full items-center justify-center">
                        <Feather name="book" size={16} color="white" />
                        <Text className="text-sm text-white ml-1 font-cygresemibold text-center leading-[16.8px]"
                            numberOfLines={1}
                            ellipsizeMode="trail">{book}</Text>
                    </View>
                    <View className="flex-1 items-end">
                        <TouchableOpacity
                            onPress={confirmDelete}
                            className="bg-black rounded-full p-2 ">
                                <MaterialIcons name="delete" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View className="rounded-[8px] bg-[#EEEEEE] pt-3 px-4 max-w-[327px] max-h-[130px] h-full w-full">
                    <Text className="text-black font-cygreregular leading-[19.2px] font-medium">
                        {text}
                    </Text>
                </View>
            </View>
        </View>
    )
}