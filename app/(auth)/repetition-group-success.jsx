import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from "expo-router";
import images from "../../constants/images";
import { ChainIcon, RepettitionSuccessIcon } from "../../components/Svg";

const RepetitionGroupSuccess = () => {

    const { scorred, total } = useLocalSearchParams();

    return <SafeAreaView className="bg-[#F7F7F7] h-full">

            <View className="w-full mb-[40px] items-center">
                <Text className="font-bold text-[#000000] max-w-[349px] text-[24px] text-center leading-[28px] font-cygrebold">
                    That Was Impressive !
                </Text>
            </View>

            <View className="items-center rounded-[30px] border-[#8A8A8A] border-[1px] max-w-[187px] self-center px-4 py-3 mb-4">
                <View className="flex-row">
                    <Text className="items-centere justify-center text-[14px] font-cygrebold">
                        {`${scorred}/${total} `}
                    </Text>
                    <Text className="text-[14px] font-cygreregular">
                        cards were
                    </Text>
                </View>
                <Text className="text-[14px] font-cygreregular">repeated successfully.</Text>
            </View>

            <View className="px-[30px] w-full flex-[1] items-center">
                <ChainIcon />
            </View>

            <View className="mx-4 rounded-[15px] bg-black flex-row p-4 items-center">
                <View className="self-end">
                    <RepettitionSuccessIcon />
                </View>

                <Text className="text-white text-[14px] ml-4 font-cygreregular max-w-[207px]">
                    You are on the right path! Keep practicing to strengthen this connection and ensure the info won’t be forgotten in 5 mins 
                </Text>

            </View>

            <View className="w-full flex-[1.5] justify-center items-center px-[30px]">
                <TouchableOpacity
                    onPress={() => router.push('repetition')}
                    className="bg-[#6592E3] w-full self-center mb-[11px] items-center justify-center max-h-[52px] h-full rounded-[47px]">
                    <Text className="text-[#FEFEFC] text-[18px] leading-[22px] font-semibold">Back To Groups</Text>
                </TouchableOpacity>
            </View>
    </SafeAreaView>
}


export default RepetitionGroupSuccess;