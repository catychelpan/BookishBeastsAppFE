import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from "expo-router";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import axios from '../../network/axios';


const Commitment = () => {

    const { onboardingState: {
            name,
            booksAmountGoal,
            minutesPerDay,
            interestAreas,
            readingPurposes,
            booksSelected,
            dayStrike,
            isNotificationsEnabled,
            neverForget: { hour, minute, timeFormat, timeZoneId }
         } } = useContext(UserContext);

    const handleSavePreferences = async () => {
        try {
            await axios.post('users/preferences', {
                dailyReminderAt: { hour, minute, timeFormat, timeZoneId },
                bookAmountGoalInYear: booksAmountGoal,
                timeLengthInMinutes: minutesPerDay,
                streakLengthInDays: dayStrike,
                interestAreaIds: interestAreas,
                readingPurposeIds: readingPurposes,
                booksSelectedIds: booksSelected,
                isNotificationsEnabled: isNotificationsEnabled,
                hasCompletedOnboarding: true
            });
            router.push('/preparing-plan')
        } catch(error) {
            console.log(error);
        }
    }

    return <SafeAreaView className="bg-[rgb(247,247,247)] h-full">
            <View className="px-[15px] mx-[20px] self-center mt-6 py-[14px] bg-[#FFFFFF] border border-[#8A8A8A] mb-4 rounded-[15px]">
                <Text className="text-[#000] text-[22px] font-bold font-cygrebold leading-[26.4px]">Commitment  Pact</Text>
                <Text className="text-[#000] font-cygreregular leading-[19.2px] mt-[16px]">I, {name ?? "Name"}, commit to making reading a meaningful part of my life. I promise to carve out time for books, whether it’s a few pages a day or long sessions lost in stories.</Text>
                <Text className="text-[#000] font-cygreregular leading-[19.2px] mt-3">
                    Through this pact, I embrace reading not just as a habit, but as a path to growth, relaxation, and discovery.
                </Text>
            </View>
            <View className="w-full mx-[20px]">
                <View className="w-full flex-row mb-[15px]">
                    <View className="bg-[#6592E3] items-center mr-3 flex-[.45] justify-center rounded-[14px] px-[28px] py-[23px]">
                        <Text className="text-[50px] text-[#fff] font-bold leading-[60px]">{booksAmountGoal}</Text>
                        <Text className="text-[#fff] font-bold font-cygrebold">books in 2025</Text>
                    </View>
                    <View className="bg-black items-center justify-center flex-[.40] rounded-[14px] px-[34px] py-[23px]">
                        <Text className="text-[50px] text-[#fff] font-bold leading-[60px]">{minutesPerDay}</Text>
                        <Text className="text-[#fff] font-bold font-cygrebold text-center">minutes/day</Text>
                        <Text className="text-[#fff] font-bold font-cygrebold text-center">on reading</Text>
                    </View>
                </View>
            </View>
                <View className="max-w-[353px] mx-[20px] self-center border max-h-[88px] rounded-[15px] border-[#8A8A8A] bg-[#fff] p-4">
                    <Text className="text-[#000] font-bold font-cygrebold leading-[19.2px]">To explore books on topics: Mindset, Biology, Art, Habits, Self-Help, History.</Text>
                </View>
                
            <View className="w-full items-center justify-center h-full flex-1">
                <Text className="text-[#000] font-cygrebold my-4">Tap To Commit</Text>
                <TouchableOpacity
                    onPress={handleSavePreferences}
                    className="bg-[#6592E3] justify-center rounded-full items-center max-w-[110px] w-full h-full  max-h-[110px]">
                    <MaterialIcons 
                        name={'fingerprint'} 
                        size={76} 
                        color="#FFFFFF" 
                    />
                </TouchableOpacity>
            </View>
        <StatusBar backgroundColor='#F7F7F7' style='auto' />
    </SafeAreaView>
}


export default Commitment;