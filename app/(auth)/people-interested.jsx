import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import OnboardingProgress from "../../components/OnboardingProgress";
import { StatusBar } from 'expo-status-bar';
import { images } from "../../constants";


const PeopleInterested = () => {

    return <SafeAreaView className="bg-[#F7F7F7] h-full">
            <View className="w-full px-[20px] mt-[20px]">
                <OnboardingProgress stage1={100} stage2={50} />
            </View>
            <View className="w-full my-[65px] mb-[44px] items-center">
                <Text className="font-bold text-[#000000] max-w-[349px] text-[24px] text-center leading-[28px] px-[70px] font-cygrebold">
                    What people are your inspiration?
                </Text>
            </View>

{/*             Potentially fetching these from API */}

            
            <ScrollView
                className="flex-[3]"
                horizontal={false}
                showsVerticalScrollIndicator={true}
            >
            <View className="flex-row justify-center max-h-[80%] gap-[20px]">
                <View className="gap-[9px]">
                    <BlockImage
                        src={images.celebrity}
                        name={'Oprah Winfrey'}
                        styles={'mb-[19px]'}
                    />
                    <BlockImage
                        src={images.celebrity}
                        name={'Oprah Winfrey'}
                        styles={'mb-[19px]'}
                    />
                    <BlockImage
                        src={images.celebrity}
                        name={'Oprah Winfrey'}
                    />
                </View>
                <View className="gap-[9px]">
                    <BlockImage
                        src={images.celebrity}
                        name={'Oprah Winfrey'}
                        styles={'mb-[19px]'}
                    />
                    <BlockImage
                        src={images.celebrity}
                        name={'Oprah Winfrey'}
                        styles={'mb-[19px]'}
                    />
                    <BlockImage
                        src={images.celebrity}
                        name={'Oprah Winfrey'}
                    />
                </View>
                <View className="gap-[9px]">
                    <BlockImage
                        src={images.celebrity}
                        name={'Oprah Winfrey'}
                        styles={'mb-[19px]'}
                    />
                    <BlockImage
                        src={images.celebrity}
                        name={'Oprah Winfrey'}
                        styles={'mb-[19px]'}
                    />
                    <BlockImage
                        src={images.celebrity}
                        name={'Oprah Winfrey'}
                    />
                </View>
            </View>
            </ScrollView>
            <View className="w-full flex-[1.5] justify-center items-center">
                <TouchableOpacity
                    onPress={() => router.push('/books-interested')}
                    className="bg-[#6592E3] max-w-[313px] w-full self-center mb-[11px] items-center justify-center max-h-[52px] h-full rounded-[47px]">
                    <Text className="text-[#FEFEFC] text-[18px] leading-[22px] font-semibold">Continue</Text>
                </TouchableOpacity>

                <TouchableOpacity className="border border-[#000000] self-center bg-transparent items-center justify-center max-w-[313px] w-full max-h-[52px] h-full rounded-[47px]">
                    <Text className="text-[#000000] text-[18px] leading-[22px] font-semibold">Skip For Now</Text>
                </TouchableOpacity>
            </View>
        <StatusBar backgroundColor='#F7F7F7' style='dark' />
    </SafeAreaView>
}


const BlockImage = ({ src, name, styles }) => {
    return <View className={`max-w-[120px] max-h-[120px] w-full ${styles}`}>
            <TouchableOpacity className="w-full h-full">
                <Image source={src} className="rounded-[19px] mb-[8px]" />
                <Text className="font-cygrebold leading-[16.8px] text-center text-sm">{name}</Text>
            </TouchableOpacity>
        </View>
}


export default PeopleInterested;