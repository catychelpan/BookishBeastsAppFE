import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from '@expo/vector-icons';
import axios from '../../network/axios';
import { useEffect, useState } from "react";
import { formatInTimeZone } from 'date-fns-tz';

const formatReadingSession = (finishedAt) => {
  // Get the user's current timezone
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const formattedDate = formatInTimeZone(
    new Date(finishedAt),
    userTimeZone,
    'dd.MM.yyyy'
  );
  
  const formattedTime = formatInTimeZone(
    new Date(finishedAt),
    userTimeZone,
    'HH:mm'
  );
  
  return {
    date: formattedDate,
    time: formattedTime,
    combined: `${formattedDate} ${formattedTime}`
  };
};

// Format time in seconds to HH:MM:SS
const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const Sessions = () => {

    const { id } = useLocalSearchParams();

    const [sessions, setSessions] = useState([]);   

    const fetchAllSessions = async () => {
        try {
            const { data } = await axios.get(`users/sessions/${id}`);
            console.log(data)
            setSessions(data);
        } catch (error) {
            console.log('Error fetching sessions:', error);
        }   
    };

    useEffect(() => {
        fetchAllSessions();
    }, []);

    return (
        <SafeAreaView className="bg-[#F7F7F7] h-full">
            <View className="max-h-[60px] justify-between items-center flex-row h-full mx-5 mb-7">
                <View className="flex-row items-center justify-between mt-2">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="flex-1 mr-5 max-w-[44px] w-full items-center justify-center rounded-[10px]">
                            <MaterialIcons name="close" size={24} color="black" />
                    </TouchableOpacity>
                    <Text className="text-black font-cygrebold text-[22px] font-bold">All Sessions</Text>
                </View>
            </View>
            <FlatList
                data={sessions}
                keyExtractor={(item) => item.id} 
                renderItem={({ item }) => ( <SessionBlock
                    key={item.id}
                    duringInSeconds={item.durationInSeconds}
                    finishedAtPages={item.endPage}
                    pagesRead={item.pagesRead}
                    finishedAt={item.endTime}
                /> )}
                contentContainerStyle={{ padding: 20 }}
                ItemSeparatorComponent={() => <View className="h-[20px]" />}
            />
        </SafeAreaView>
    );
}


export const SessionBlock = ({ duringInSeconds, onPress, finishedAtPages, pagesRead = 0, finishedAt }) => {

    const { date, time } = formatReadingSession(finishedAt);

    return (
        <View
            //onPress={onPress}
            className="bg-[#1C1C1C] rounded-[20px] p-5">
            <View className="flex-row justify-end mb-4">
                <View className="flex-row">
                    <View className="bg-primary rounded-[20px] mr-2 py-1.5 px-2.5">
                        <Text className="text-white font-cygrebold text-[14px]">{date}</Text>
                    </View>
                    <View className="bg-[#EEEEEE] rounded-[20px] py-1.5 px-2.5">
                        <Text className="text-[#1C1C1C] text-[14px] font-cygrebold">{time}</Text>
                    </View>
                </View>
            </View>

            <View className="flex-row gap-4">
                <View className="bg-[#EEEEEE] flex-1 rounded-[20px] items-center p-4">
                    <View>
                        <Text className="text-[40px] font-cygrebold text-[#1C1C1C] text-center">{pagesRead}</Text>
                        <Text className="text-[#1C1C1C] font-cygresemibold">pages read</Text>
                    </View>
                    <Text className="text-[#1C1C1C] font-cygreregular text-[14px]">finished at {finishedAtPages}</Text>
                </View>
                <View className="bg-[#EEEEEE] flex-1 rounded-[20px] items-center justify-start p-4">
                    <View>
                        <Text className="text-[#1C1C1C] font-cygresemibold text-[16px]">Time</Text>
                    </View>
                    <Text className="font-cygrebold text-[24px] text-[#1C1C1C] mt-2">{formatTime(duringInSeconds)}</Text>
                </View>
            </View>
        </View>
    );

}


export default Sessions;