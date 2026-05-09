import {
    View,
    Text,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from '@expo/vector-icons';
import axios from '../../network/axios';
import Feather from '@expo/vector-icons/Feather';

const statusName = {
    0: 'To Read',
    1: 'Reading',
    2: 'Finished',
    3: 'Gave Up',
    4: 'Paused',
}

const getTimeZoneId = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
  // Returns: "America/New_York", "Europe/Berlin", "Asia/Tokyo", etc.
};

const SaveSession = () => {

    const {
        id,
        endPage,
        pagesTotal,
        pagesRead,
        timeSpent,
        status,
        timeSpentInSeconds
    } = useLocalSearchParams();


    const saveSession = async () => {
        try {
            await axios.post('users/sessions', {
                endPage: endPage,
                sessionLengthInSeconds: timeSpentInSeconds,
                bookId: id,
                timeZoneId: getTimeZoneId(),
                pagesRead: pagesRead
            });
            router.replace({ pathname: 'saved-book', params: { id: id } });
        } catch(error) {
            console.log('Error saving session:', error);
        }
    }

    return (
        <SafeAreaView className="bg-[#F7F7F7] h-full">
            <View className="max-h-[60px] justify-between items-center flex-row h-full mx-5 mb-7">
                <View className="flex-row items-center justify-between mt-2">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="flex-1 mr-5 max-w-[44px] w-full items-center justify-center rounded-[10px]">
                            <MaterialIcons name="close" size={24} color="black" />
                    </TouchableOpacity>
                    <Text className="text-black font-cygrebold text-[22px] font-bold">Save session</Text>
                </View>
                <TouchableOpacity
                    onPress={saveSession}
                    className="bg-primary rounded-[30px] flex-1 mt-2.5 max-w-[110px] w-full items-center justify-center max-h-[48px] h-full py-2 px-4">
                        <Text className="leading-[19.2px] text-[#fff] font-cygrebold">Save</Text>
                </TouchableOpacity>
            </View>

            <View className="mx-5 flex-row mb-8">
                <View className="bg-[#E6E6E6] rounded-[20px] py-2 px-3 mr-2.5">
                    <Text className="text-[#1C1C1C] text-[14px] font-cygrebold">{new Date().toLocaleDateString()}</Text>
                </View>
                <View className="bg-primary rounded-[20px] py-2 px-3">
                    <Text className="text-white text-[14px] font-cygrebold">{new Date().toLocaleTimeString()}</Text>
                </View>
            </View>
            <View className="mx-5 rounded-[15px]">
                <View className="flex-row items-center border-[.5px] border-[#8A8A8A] rounded-[15px] pl-6 py-4 mb-4">
                    <MaterialIcons name="timer" size={32} color="black" />
                    <View className="ml-5">
                        <Text className="font-cygreregular text-[14px] text-[#1C1C1C]">Reading Time</Text>
                        <Text className="text-[#1C1C1C] text-[18px] font-cygrebold">{timeSpent}</Text>
                    </View>
                </View>

                <View className="flex-row items-center border-[.5px] border-[#8A8A8A] rounded-[15px] pl-6 py-4 mb-4">
                    <MaterialIcons name="bookmark" size={32} color="black" />
                    <View className="ml-5">
                        <Text className="font-cygreregular text-[14px] text-[#1C1C1C]">Finished At</Text>
                        <Text className="text-[#1C1C1C] text-[18px] font-cygrebold">p. {endPage}/{pagesTotal}</Text>
                    </View>
                </View>

                <View className="flex-row items-center border-[.5px] border-[#8A8A8A] rounded-[15px] pl-6 py-4">
                    <Feather name="loader" size={32} color="black" />
                    <View className="ml-5">
                        <Text className="font-cygreregular text-[14px] text-[#1C1C1C]">Status</Text>
                        <Text className="text-[#1C1C1C] text-[18px] font-cygrebold">{statusName[status]}</Text>
                    </View>
                </View>
            </View>
            
        </SafeAreaView>
    );

}


export default SaveSession;