import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import OnboardingProgress from "../../components/OnboardingProgress";
import { StatusBar } from 'expo-status-bar';
import { images } from "../../constants";


const KeepStrike = () => {

    return <SafeAreaView className="bg-[#F7F7F7] h-full">
            <View className="w-full px-[20px] mt-[20px]">
                <OnboardingProgress stage1={16} />
            </View>
            <View className="w-full mt-12 mb-[5px] items-center flex-[.1]">
                <Text className="font-bold text-[24px] mb-[20px] text-center leading-[27px] font-cygrebold">
                    Keep the strike !
                </Text>
                <Text className="leading-[19.2px] text-center font-cygreregular max-w-[269px] w-full px-8">
                    And get a new Bookish Beast to your collection.
                </Text>
            </View>
            <View className="flex-row items-start justify-between mt-2 flex-1">
                <View className="gap-[16px] relative top-8 mr-4">
                    <View className="relative">
                        <Image source={images.monster1} width={139} height={166} />
                        <Image source={images.question} width={45} height={77} className="absolute top-14 left-6" />
                    </View>
                    <View className="relative">
                        <Image source={images.monster2} width={139} height={166} />
                        <Image source={images.question} width={45} height={77} className="absolute top-14 left-6" />
                    </View>
                </View>
                <View className="gap-[16px] self-center mb-2 mr-4">
                    <View className="relative">
                        <Image source={images.monster3} width={139} height={166} />
                        <Image source={images.question} width={45} height={77} className="absolute top-14 left-12" />
                    </View>
                    <View className="relative">
                        <Image source={images.monster4} width={139} height={166} />
                        <Image source={images.question} width={45} height={77} className="absolute top-14 left-12" />
                    </View>
                </View>
                <View className="space-y-[16px]">
                    <View className="relative">
                        <Image source={images.monster5} width={139} height={166} />
                        <Image source={images.question} width={45} height={77} className="absolute top-14 left-12" />
                    </View>
                    <View className="relative">
                        <Image source={images.monster6} width={139} height={166} />
                        <Image source={images.question} width={45} height={77} className="absolute top-14 left-12" />
                    </View>
                </View>
            </View>
            <View className="w-full flex-[.2]">
                <TouchableOpacity
                    onPress={() => router.push('/set-strike')}
                    className="bg-[#6592E3] max-w-[313px] w-full self-center mb-[30px] items-center justify-center max-h-[52px] h-full rounded-[47px]">
                    <Text className="text-[#FEFEFC] text-[18px] leading-[22px] font-semibold">Continue</Text>
                </TouchableOpacity>
            </View>
        <StatusBar backgroundColor='#F7F7F7' style='dark' />
        </SafeAreaView>
}

export default KeepStrike;