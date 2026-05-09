import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import OnboardingProgress from "../../components/OnboardingProgress";
import DailyTiming from "../../components/DailyTiming";
import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";



const CommitToGrowing = () => {

    const { setOnboardingState } = useContext(UserContext);

    const [days, setDays] = useState({
        7: true,
        14: false,
        30: false,
        50: false,
    });

    const defaultDays = {
        7: false,
        14: false,
        30: false,
        50: false,
    };

    return <SafeAreaView className="bg-[#F7F7F7] h-full">
        <ScrollView contentContainerStyle={{ height: "100%" }}>
            <View className="w-full px-[20px] mt-[20px]">
                <OnboardingProgress />
            </View>
            <View className="w-full mt-[77px] mb-[48px] items-center">
                <Text className="font-bold text-[#000000] max-w-[229px] text-[24px] text-center leading-[27px] font-cygrebold">
                    Commit to growing !
                </Text>
            </View>
            <View className="items-center flex-1 mx-[23px]">
                <DailyTiming
                    times={"7-day strike"}
                    level="Promising"
                    styles={"mb-[14px]"}
                    selected={days[7]}
                    onPress={() => {
                        setDays((_) => ({...defaultDays, 7: true}))
                        setOnboardingState(prev => ({...prev, dayStrike: 7}))
                    }}
                />
                <DailyTiming
                    times={"14-day strike"}
                    level="Determined"
                    styles={"mb-[14px]"}
                    selected={days[14]} 
                    onPress={() => {
                        setDays((_) => ({...defaultDays, 14: true}))
                        setOnboardingState(prev => ({...prev, dayStrike: 14}))
                    }}
                />
                <DailyTiming
                    times={"30-day strike"}
                    level="Impressive"
                    styles={"mb-[14px]"}
                    selected={days[30]} 
                    onPress={() => {
                        setDays((_) => ({...defaultDays, 30: true}))
                        setOnboardingState(prev => ({...prev, dayStrike: 30}))
                    }}
                />
                <DailyTiming
                    times={"50-day strike"}
                    level="Unstoppable"
                    selected={days[50]} 
                    onPress={() => {
                        setDays((_) => ({...defaultDays, 50: true}))
                        setOnboardingState(prev => ({...prev, dayStrike: 50}))
                    }}
                />
            </View>
            <TouchableOpacity
                onPress={() => router.push('/keep-strike')}
                className="bg-primary max-w-[313px] w-full self-center mb-[30px] items-center justify-center max-h-[52px] h-full rounded-[47px]">
                <Text className="text-[#FEFEFC] text-[18px] leading-[22px] font-semibold">Continue</Text>
            </TouchableOpacity>
        </ScrollView>
        <StatusBar backgroundColor='#F7F7F7' style='dark' />
    </SafeAreaView>
}


export default CommitToGrowing;