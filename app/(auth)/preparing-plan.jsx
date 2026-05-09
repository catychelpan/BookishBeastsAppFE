import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { router } from "expo-router";
import images from "../../constants/images";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";


const PreparingPlan = () => {

    const { user } = useContext(UserContext);

    const handleRedirect = () => {
        if (user?.isPremiumUser) {
            router.push('(tabs)/home');
        } else {
            router.push('/special-offer');
        }
    }

    return <SafeAreaView className="bg-[#F7F7F7] h-full">

            <View className="w-full mt-[91px] mb-[60px] items-center px-[32px]">
                <Text className="font-bold text-[#000000] max-w-[349px] text-[24px] text-center leading-[28px] font-cygrebold">
                    Preparing your personal reading experience...
                </Text>
            </View>

            <View className="px-[30px] w-full flex-1">

                <View className="flex-row max-h-[30px] w-full justify-between items-center mb-[18px]">
                    <Text className="text-[18px] font-cygreregular leadnig-[21.6px] flex-[.5]">Goals</Text>
                    <View className="flex-[.5] justify-center relative">
                        <Text className="text-[12px] absolute right-0 leading-[14.4px] bottom-4 font-cygreregular text-right">100%</Text>
                        <View className="max-w-[176px] max-h-[12px] h-full w-full relative bg-[#E8E8E9] rounded-[13px]">
                            <View className="absolute bg-[#6592E3] w-full h-full rounded-[13px]"></View>
                        </View>
                    </View>
                </View>

                <View className="flex-row max-h-[30px] w-full justify-between items-center mb-[18px]">
                    <Text className="text-[18px] font-cygreregular leadnig-[21.6px] flex-[.5]">Interests</Text>
                    <View className="flex-[.5] justify-center relative">
                        <Text className="text-[12px] absolute right-0 leading-[14.4px] bottom-4 font-cygreregular text-right">64%</Text>
                        <View className="max-w-[176px] max-h-[12px] h-full w-full relative bg-[#E8E8E9] rounded-[13px]">
                            <View className="absolute bg-[#6592E3] w-[64%] h-full rounded-[13px]"></View>
                        </View>
                    </View>
                </View>

                <View className="flex-row max-h-[30px] w-full justify-between items-center">
                    <Text className="text-[18px] font-cygreregular leadnig-[21.6px] flex-[.5]">Growth Areas</Text>
                    <View className="flex-[.5] justify-center relative">
                        <Text className="text-[12px] absolute right-0 leading-[14.4px] bottom-4 font-cygreregular text-right">0%</Text>
                        <View className="max-w-[176px] max-h-[12px] h-full w-full relative bg-[#E8E8E9] rounded-[13px]">
                            <View className="absolute bg-[#6592E3] w-0 h-full rounded-[13px]"></View>
                        </View>
                    </View>
                </View>
            </View>

            <View className="max-w-[333px] px-[24px] flex-row items-center max-h-[115px] mt-[51px] w-full h-full justify-between self-center bg-[#1C1C1C] rounded-[15px]">
                <Text className="font-bold max-w-[109px] text-center text-[22px] leading-[21.12px] font-cygrebold text-white">Your Plan is ready </Text>
                <Image source={images.plan} />
            </View>

            <View className="w-full flex-[1.5] justify-center items-center px-[30px]">
                <TouchableOpacity
                    onPress={handleRedirect}
                    className="bg-[#6592E3] w-full self-center mb-[11px] items-center justify-center max-h-[52px] h-full rounded-[47px]">
                    <Text className="text-[#FEFEFC] text-[18px] leading-[22px] font-semibold">Save Plan and Continue</Text>
                </TouchableOpacity>
            </View>
            <StatusBar backgroundColor='#F7F7F7' style='dark' />
    </SafeAreaView>
}


export default PreparingPlan;