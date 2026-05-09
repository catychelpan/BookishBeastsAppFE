import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Alert,
    Switch,
    Linking,
    AppState,
    TextInput,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import { useContext, useEffect, useState, useRef } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from '@expo/vector-icons';
import WheelPicker from '@quidone/react-native-wheel-picker';
import { PrimaryButton } from "../../components/CustomButton";
import axios from '../../network/axios';
import { UserContext } from "../../context/UserContext";
import { QuoteIcon, NoteIcon } from '../../components/Svg';
import ImageHandler from "../../components/ImageHandler";
import BookBottomDrawer from "../../components/BottomDrawer";

const TIMER_STORAGE_KEY = '@reading_timer_target';

const Countdown = () => {

    const hours = [...Array(24).keys()].map((_, val) => ({
        value: val,
        label: val < 10 ? val.toString().padStart(2,'0') : val.toString(),
    }));

    const minutes = [...Array(60).keys()].map((_, val) => ({
        value: val,
        label: val < 10 ? val.toString().padStart(2,'0') : val.toString(),
    }));

    const [hour, setHour] = useState(0);
    const [minute, setMinute] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isSetCountdownDrawerOpen, setIsSetCountdownDrawerOpen] = useState(false);    
    const [book, setBook] = useState(null);
    
    // Timer state - stores remaining time in seconds
    const [remainingTime, setRemainingTime] = useState(0);
    const [targetTime, setTargetTime] = useState(null);
    const [originalCountdownTime, setOriginalCountdownTime] = useState(0); // Track original time for calculating time spent
    const [endPage, setEndPage] = useState(false);
    const [isPagesReadDrawerOpen, setIsPagesReadDrawerOpen] = useState(false);
    const inputRef = useRef(null);  
    
    const appState = useRef(AppState.currentState);

    const { id } = useLocalSearchParams();

    // Format time in seconds to HH:MM:SS
    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Save timer state to AsyncStorage
    const saveTimerState = async (target) => {
        try {
            if (target) {
                await AsyncStorage.setItem(TIMER_STORAGE_KEY, target.toString());
            } else {
                await AsyncStorage.removeItem(TIMER_STORAGE_KEY);
            }
        } catch (error) {
            console.error('Error saving timer state:', error);
        }
    };

    // Load timer state from AsyncStorage
    const loadTimerState = async () => {
        try {
            const savedTarget = await AsyncStorage.getItem(TIMER_STORAGE_KEY);
            if (savedTarget) {
                const target = parseInt(savedTarget, 10);
                const now = Date.now();
                const remaining = Math.max(0, Math.floor((target - now) / 1000));
                
                if (remaining > 0) {
                    setTargetTime(target);
                    setRemainingTime(remaining);
                    setIsRunning(true);
                } else {
                    // Timer expired while app was closed
                    await AsyncStorage.removeItem(TIMER_STORAGE_KEY);
                    Alert.alert('Time\'s up! 🎉', 'Your countdown has finished.');
                }
            }
        } catch (error) {
            console.error('Error loading timer state:', error);
        }
    };

    // Calculate remaining time based on target
    const updateRemainingTime = () => {
        if (targetTime) {
            const now = Date.now();
            const remaining = Math.max(0, Math.floor((targetTime - now) / 1000));
            setRemainingTime(remaining);
            
            if (remaining === 0) {
                handleTimerComplete();
            }
            
            return remaining;
        }
        return remainingTime;
    };

    // Handle app state changes
    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                // App came to foreground - recalculate time
                updateRemainingTime();
            }
            
            appState.current = nextAppState;
        });
        
        return () => subscription?.remove();
    }, [targetTime]);

    // Countdown effect
    useEffect(() => {
        let interval = null;
        
        if (isRunning && remainingTime > 0) {
            interval = setInterval(() => {
                const remaining = updateRemainingTime();
                
                if (remaining <= 0) {
                    clearInterval(interval);
                }
            }, 1000);
        } else if (!isRunning && interval) {
            clearInterval(interval);
        }
        
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRunning, remainingTime, targetTime]);

    const handleTimerComplete = async () => {
        setIsRunning(false);
        setRemainingTime(0);
        setTargetTime(null);
        await saveTimerState(null);
    };

    const handleToggle = async () => {
        if (remainingTime === 0) {
            Alert.alert('Set Time', 'Please set a countdown time first.');
            return;
        }
        
        if (!isRunning) {
            // Starting timer
            const now = Date.now();
            const target = now + (remainingTime * 1000);
            setTargetTime(target);
            setIsRunning(true);
        } else {
            // Pausing timer
            setIsRunning(false);
            setTargetTime(null);
        }
        await saveTimerState(isRunning ? null : targetTime);
    }

    const handleAddNote = () => {
        router.push({ pathname: 'create-note', params: { id: book.id }})
    }

    const handleAddQuote = () => {
        router.push({ pathname: 'create-quote', params: { id: book.id }})
    }

    const handleToggleCountdownDrawer = () => {
        setIsSetCountdownDrawerOpen(!isSetCountdownDrawerOpen);
    }

    const handleTogglePagesReadDrawer = () => {
        setIsPagesReadDrawerOpen(!isPagesReadDrawerOpen);
        if (!isSetCountdownDrawerOpen) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 400) //necessary to give time for the drawer to open and then focus
        }
    }

    const handleInputChange = (text) => {
        setEndPage(text);
    }

    const handleSavePageCount = () => {
        // Calculate time spent: original countdown time minus remaining time
        const timeSpentInSeconds = originalCountdownTime - remainingTime;
        
        setEndPage(inputRef.current.value);
        setIsPagesReadDrawerOpen(false);
        router.push({ pathname: 'save-session', params: {
            id: book.id, 
            endPage: endPage, 
            pagesTotal: book.pageCount,
            pagesRead: Math.max(endPage - book?.currentPage, 0),
            timeSpent: formatTime(timeSpentInSeconds),
            timeSpentInSeconds: timeSpentInSeconds,
            status: book?.status
        }});
    }

    const handleSetCountdown = () => {
        const totalSeconds = (hour * 3600) + (minute * 60);
        
        if (totalSeconds === 0) {
            Alert.alert('Invalid Time', 'Please select a time greater than 0.');
            return;
        }
        
        setRemainingTime(totalSeconds);
        setOriginalCountdownTime(totalSeconds); // Store the original countdown time
        setIsRunning(false);
        setTargetTime(null);
        setIsSetCountdownDrawerOpen(false);
    };

    const fetchBook = async () => {
        try {
            const { data } = await axios.get(`/users/book/${id}`);
            setBook(data)
        }
        catch(error) {
            console.log(error);
        }
    }

    const getProgress = (totalPages, currentPage) => {
        return Math.round(currentPage / totalPages * 100).toString();
    }

    useEffect(() => {
        fetchBook();
        loadTimerState(); // Load saved timer state on mount
    }, [])

    const {
        title,
        author,
        currentPage,
        pageCount,
        imageUrl,
    } = book || {};

    return (
        <SafeAreaView className="bg-[#F7F7F7] h-full flex-1">
            <View className="max-h-[60px] justify-between items-center flex-row h-full mx-5 mb-7">
                <View className="flex-row items-center mt-2">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="flex-1 mr-2 max-w-[44px] w-full items-center justify-center rounded-[10px]">
                            <MaterialIcons name="close" size={24} color="black" />
                    </TouchableOpacity>
                    <Text className="text-black font-cygrebold text-[22px] font-bold">Reading Timer</Text>
                </View>
                <TouchableOpacity
                    onPress={handleTogglePagesReadDrawer}
                    className="bg-primary rounded-[30px] flex-1 mt-2.5 max-w-[110px] w-full items-center justify-center max-h-[48px] h-full py-2 px-4">
                        <Text className="leading-[19.2px] text-[#fff] font-cygrebold">Save</Text>
                </TouchableOpacity>
            </View>
            <ScrollView className="flex-1">
                <View className="items-center justify-center mb-12">
                    <Text className="text-[#1C1C1C] font-cygreregular text-[55px] text-center">
                        {formatTime(remainingTime)}
                    </Text>
                    <Text className="text-[#575757] text-[18px] font-cygreregular text-center">
                        { isRunning ? 'In Progress' : 'Paused'}
                    </Text>
                </View>
                <View className="items-center mb-11">
                    <View className="bg-[#D5E3FC] rounded-full w-[130px] h-[130px] relative items-center justify-center">
                        <TouchableOpacity onPress={handleToggle} className="absolute bg-primary w-[103px] h-[103px] rounded-full items-center justify-center">
                            { isRunning ? (
                                <MaterialIcons name="pause" size={59} color="white" />
                            ) : (
                                <MaterialIcons name="play-arrow" size={59} color="white" />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
                <View className="items-center mx-11">
                    <TouchableOpacity
                        onPress={handleToggleCountdownDrawer}
                        className="border w-full border-[#8A8A8A] rounded-[15px] items-center justify-center flex-row py-3">
                        <MaterialIcons name="hourglass-bottom" size={28} color="black" />
                        <Text className="text-[#1C1C1C] text-[18px] font-cygrebold ml-1">Set Countdown</Text>
                    </TouchableOpacity>
                </View>
                <View className="mx-11 justify-center mt-3">
                    <View className="flex-row justify-center gap-1">
                        <TouchableOpacity onPress={handleAddNote} className="bg-[#1C1C1C] flex-row justify-center items-center p-4 flex-1 rounded-[15px]">
                            <NoteIcon />
                            <Text className="text-white ml-2.5 font-cygrebold text-[14px]">Add Note</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleAddQuote} className="bg-[#1C1C1C] flex-row justify-center items-center p-4 flex-1 rounded-[15px]">
                            <QuoteIcon />
                            <Text className="text-white ml-2.5 font-cygrebold text-[14px]">Add Quote</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View className="items-center mx-5 mt-5 flex-1">
                    <BookProgressCard
                        author={author}
                        name={title}
                        progress={getProgress(pageCount, currentPage)}
                        imageUrl={imageUrl}
                        containerStyles={'mb-4 border-[#8A8A8A]'}
                        //tag={book?.bookCollections?.length > 0 && book?.bookCollections[0]?.name}
                    />
                </View>
                <BookBottomDrawer
                    height="50%"
                    isBottomSheetOpen={isSetCountdownDrawerOpen}
                    setIsBottomSheetOpen={setIsSetCountdownDrawerOpen}>
                        <Text className="text-black font-cygrebold text-[22px] mb-7">Set Countdown:</Text>
                    <View className="items-center flex-1 gap-x-1 relative flex-row justify-center rounded-[15px] mx-4 mb-7">
                        <WheelPicker
                            value={hour}
                            onValueChanged={(v) => setHour(v.item.value)}
                            data={hours}
                            width={60}
                        />
                        <Text className="text-[#1C1C1C] text-[24px] font-cygrebold mx-1">:</Text>
                        <WheelPicker
                            data={minutes}
                            value={minute}
                            onValueChanged={(v) => setMinute(v.item.value)}
                            width={60}
                        />
                    </View>
                    <TouchableOpacity 
                        onPress={handleSetCountdown}
                        className="bg-[#1C1C1C] rounded-[30px] flex-1 w-full items-center justify-center max-h-[48px] h-full py-2 px-4">
                        <Text className="text-white text-[18px] font-cygrebold text-center justify-center items-center">Save</Text>
                    </TouchableOpacity>
                </BookBottomDrawer>
                <BookBottomDrawer
                    isBottomSheetOpen={isPagesReadDrawerOpen}
                    setIsBottomSheetOpen={setIsPagesReadDrawerOpen}>
                        <Text className="text-black font-cygrebold text-[22px] mb-7">At what page you are now?</Text>
                        <View className="items-center flex-1 gap-x-1 relative flex-row justify-center rounded-[15px] mx-4 mb-7">
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            className="border-[.5px] border-[#8A8A8A] rounded-[15px] max-w-[200px] w-full mb-7">
                                <TextInput
                                    inputMode="numeric"
                                    //autoFocus={true}
                                    keyboardType="numeric"
                                    ref={inputRef}
                                    onChangeText={handleInputChange}
                                    className="px-10 py-3 text-center text-black leading-[19.2px] font-cygreregular" 
                                />
                            </KeyboardAvoidingView>
                        </View>
                    <TouchableOpacity 
                        onPress={handleSavePageCount}
                        className="bg-primary rounded-[30px] flex-1 w-full items-center justify-center max-h-[48px] h-full py-2 px-4">
                        <Text className="text-white text-[18px] font-cygrebold text-center justify-center items-center">Save</Text>
                    </TouchableOpacity>
                </BookBottomDrawer>
            </ScrollView>
        </SafeAreaView>
    );
}

const BookProgressCard = ({ name, author, progress, tag, imageUrl, containerStyles }) => {
    return <TouchableOpacity
                className={`h-[172px] w-full flex-row border px-3 py-3 rounded-[15px] ${containerStyles}`}>
                <ImageHandler
                    source={imageUrl}
                    className="max-w-[99px] max-h-[141px] w-full h-full mr-4"
                    width={99}
                    height={141}
                />
                <View className="w-full flex-1">
                    <Text className="text-black text-[18px] font-cygrebold leading-[21.6px] max-w-[200px]" numberOfLines={1} ellipsizeMode='tail'>{name}</Text>
                    <Text className="text-black text-sm font-cygreregular leading-[16.8px] max-w-[210px]">{author}</Text>
                    <Text className="text-primary text-right text-[12px] leading-[14.4px] mt-2 mr-2">{`${progress}%`}</Text>
                    <View className="relative max-w-[195px] w-full max-h-[13px] h-full bg-[#EEEEEE] mb-7 rounded-[15px]">
                        <View className={`absolute h-full bg-primary rounded-[15px]`} style={{ width: `${progress}%` }}></View>
                    </View>
                { tag ? (
                    <View className="bg-primary rounded-[5px] self-start flex-1 max-h-[28px] py-1 px-2 items-center justify-center">
                        <Text className="text-[14px] leading-[16.8px] font-cygreregular text-[#fff] text-center">{tag}</Text>
                    </View>
                ) : <></> }
                </View>
    </TouchableOpacity>
}


export default Countdown;