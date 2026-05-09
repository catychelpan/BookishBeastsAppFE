import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import OnboardingProgress from "../../components/OnboardingProgress";
import React, { useContext, useState } from 'react';
import SliderCounter from "../../components/SliderCounter";
import { images } from "../../constants";
import { UserContext } from "../../context/UserContext";


//Eyes icon looks kinda wacky; should consider rendering them as svg instead of png

const SetBooks = () => {


    const { setOnboardingState, onboardingState } = useContext(UserContext);

    const [value, setValue] = useState(onboardingState?.booksAmountGoal ?? 13);

    const handleContinue = () => {
        setOnboardingState((prev) => ({ ...prev, booksAmountGoal: value }))
        router.push('/sounds-promising')
    }

    return <SafeAreaView className="bg-[#F7F7F7] h-full">
        <ScrollView contentContainerStyle={{ height: "100%" }}>
            <View className="w-full px-[20px] mt-[20px]">
                <OnboardingProgress stage1={84}/>
            </View>
            <View className="w-full mt-[77px] mb-[48px] items-center">
                <Text className="font-bold text-[#000000] max-w-[349px] text-[24px] text-center leading-[28px] px-[40px] font-cygrebold">
                    How many books you want to read this year?
                </Text>
            </View>
            <View className="mx-[22px] flex-1">
                <View className="max-w-[348px] h-[160px] bg-[#FFFFFF] border-[.8px] rounded-[15px] border-[#8A8A8A]">
                    <SliderCounter
                      value={value}
                      setValue={setValue} 
                    />
                </View>
                <View className="mt-[18px] flex-row rounded-[15px] bg-[#1C1C1C] px-[20px] items-center w-full h-[90px]">
                    <Image source={images.eyes} />
                    <Text className="text-[14px] leading-[17px] font-cygreregular text-[#fff] ml-[15px] pr-[10px] max-w-[224px] w-full">{`You would need to read ${Math.floor(value / 12)}-${Math.ceil(value / 12)} books per month to achieve it.`}</Text>
                </View>
            </View>
            
            <TouchableOpacity
                onPress={handleContinue}
                className="bg-[#6592E3] max-w-[313px] w-full self-center mb-[11px] items-center justify-center max-h-[52px] h-full rounded-[47px]">
                <Text className="text-[#FEFEFC] text-[18px] leading-[22px] font-semibold">Continue</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => router.push('/sounds-promising')}
                className="border border-[#000000] mb-[28px] self-center bg-transparent items-center justify-center max-w-[313px] w-full max-h-[52px] h-full rounded-[47px]">
                <Text className="text-[#000000] text-[18px] leading-[22px] font-semibold">Skip For Now</Text>
            </TouchableOpacity>
        </ScrollView>
        <StatusBar backgroundColor='#F7F7F7' style='dark' />
    </SafeAreaView>

}



export default SetBooks;