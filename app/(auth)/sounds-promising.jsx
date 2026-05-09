import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import OnboardingProgress from "../../components/OnboardingProgress";
import { images } from "../../constants";

const SoundsPromising = () => {

    return <SafeAreaView className="bg-[#F7F7F7] h-full">
        <ScrollView contentContainerStyle={{ height: "100%" }}>
            <View className="w-full h-full">
                <View className="w-full px-[20px] mt-[20px]">
                    <OnboardingProgress stage1={100} />
                </View>
                <View className="w-full mt-[77px] mb-[48px] items-center">
                    <Text className="text-[#000] max-w-[165px] text-[24px] text-center leading-[28px] font-cygrebold">
                        Sounds really promising!
                    </Text>
                </View>
                <View className="items-center mb-6">
                    <Image source={images.onboardingMonster2} width={437} height={437} className="rounded-full" />
                </View>
                <View className="flex-1 px-[62px]">
                    <Text className="text-[#000] text-center leading-[19.2px] font-cygreregular">Let’s try to know you better and prepare your personal reading plan!</Text>
                </View>
                <View className="flex-1 w-full">
                    <TouchableOpacity
                        onPress={() => router.push('/topics-interested')}
                        className="bg-[#6592E3] flex-1 max-w-[313px] w-full self-center mb-[30px] items-center justify-center max-h-[52px] h-full rounded-[47px]">
                        <Text className="text-[#FEFEFC] text-[18px] leading-[22px] font-semibold">Continue</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
        <StatusBar backgroundColor='#F7F7F7' style='dark' />
    </SafeAreaView>
}

export default SoundsPromising;