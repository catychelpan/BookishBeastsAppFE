import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { useContext, useEffect, useState } from "react";
import { router } from "expo-router";
import OnboardingProgress from "../../components/OnboardingProgress";
import { StatusBar } from 'expo-status-bar';
import { UserContext } from "../../context/UserContext";
import { icons } from "../../constants";
import axios from '../../network/axios';
import {
    PersonalGrowthIcon,
    SocialConnectionIcon,
    CreativityImaginationIcon,
    PersonalDevelopmentIcon,
    InspirationMotivationIcon,
    AcademicPurposeIcon,
    HealthyLifestyleIcon,
    EntertainmentPurposeIcon
 } from "../../components/Svg";

const iconMap = {
    1: PersonalGrowthIcon,
    2: SocialConnectionIcon,
    3: CreativityImaginationIcon,
    4: PersonalDevelopmentIcon,
    5: InspirationMotivationIcon,
    6: AcademicPurposeIcon,
    7: HealthyLifestyleIcon,
    8: EntertainmentPurposeIcon
};

const ReasonForReading = () => {

    const { setOnboardingState, onboardingState } = useContext(UserContext);

    const [reasons, setReasons] = useState([]);
    const [chosenReasons, setChosenReasons] = useState([]);

    const handleCaptureState = (id) => {
        if (chosenReasons.some(a => a === id)) {
            setChosenReasons(prev => prev.filter(a => a !== id))
        } else {
            setChosenReasons(prev => [...prev, id])
        }
    }

    const fetchReasons = async () => {
        try {
            const { data } = await axios.get('books/reading-purposes');
            setReasons(data);
        } catch(error) {
            console.log(error)
        }
    }

    const handleContinue = () => {
        setOnboardingState(prev => ({...prev, readingPurposes: chosenReasons}))
        router.push('what-a-taste')   
    }

    useEffect(() => {
        fetchReasons();
    }, []);

    const getIconById = (id) => {
        
        return iconMap[id] || icons.social; // default to social icon if id not found
    };

    return <SafeAreaView className="bg-[#F7F7F7] h-full">

            <View className="w-full px-[20px] mt-[20px]">
                <OnboardingProgress stage1={100} stage2={85} />
            </View>
            <View className="w-full mt-[65px] mb-[27px] items-center">
                <Text className="font-bold text-[#000000] max-w-[349px] text-[24px] text-center leading-[28px] px-[60px] font-cygrebold">
                    What is your reason for reading?
                </Text>
            </View>

            <ScrollView className="flex-[3]" contentContainerStyle={{marginHorizontal: 5}}>
                <View className="items-center">
                    { reasons.map(item => (
                        <ReasonBlock
                            icon={getIconById(item.id)}
                            styles={'mb-[14px] self-center'}
                            text={item.name}
                            handleCapture={handleCaptureState}
                            id={item.id}
                            key={item.id}
                            isSelected={chosenReasons.some(a => a === item.id)}
                        />
                    )) }
                </View> 
            </ScrollView>
        <View className="w-full justify-center items-center max-h-[200px] flex-1">
            <TouchableOpacity
                onPress={handleContinue}
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


const ReasonBlock = ({ icon: Icon, id, text, styles, handleCapture, isSelected }) => {


    return <TouchableOpacity
            onPress={() => handleCapture(id)}
            className={`max-w-[348px] border flex-row items-center rounded-[15px] ${isSelected ? 'border-[#6592E3]' : 'border-[#8A8A8A]'} py-4 max-h-[60px] px-8 ${styles}`}>
{/*             <Image source={src} className="max-h-[40] max-w-[40px] self-center mr-9" resizeMethod="cover" /> */}
                <Icon fill={isSelected ? '#6592E3' : '#000'} />
            <View className="w-60 ml-3">
                <Text className={`font-bold font-cygrebold ${isSelected ? 'text-[#6592E3]' : 'text-[#000]'} leading-[19.2px]  flex-wrap`}>{text}</Text>
            </View>
        </TouchableOpacity>
}


export default ReasonForReading;