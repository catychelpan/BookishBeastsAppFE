import {
    TextInput,
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView
} from "react-native";

import { useEffect, useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import axios from "../../network/axios";

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




const ManageRecommendations = () => {

    const [reasons, setReasons] = useState([]);
    const [chosenReasons, setChosenReasons] = useState([]);

    const fetchReasons = async () => {
        try {
            const { data } = await axios.get('books/reading-purposes');
            setReasons(data);
        } catch(error) {
            console.log(error)
        }
    }

    const fetchPreferences = async () => {
        try {
            const { data } = await axios.get('users/preferences');
            setChosenReasons(data);
        } catch(error) {
            console.log(error)
        }
    }

    const getIconById = (id) => {
        
        return iconMap[id] || icons.social; // default to social icon if id not found
    };

    const handleCaptureState = (id) => {
        if (chosenReasons.some(a => a === id)) {
            setChosenReasons(prev => prev.filter(a => a !== id))
        } else {
            setChosenReasons(prev => [...prev, id])
        }
    }

    const handleSave = async () => {

        try {
            await axios.post('users/preferences', {
                readingPurposeIds: chosenReasons,
            });
            router.push('profile')
        } catch(error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchReasons();
        fetchPreferences();
    }, []);

    return <SafeAreaView className="bg-[#F7F7F7] h-full flex-1">
        <View className="max-h-[60px] items-center flex-row h-full mx-5 mb-5">
            <TouchableOpacity
                className="mr-5"
                onPress={() => router.back()}>
                <Image source={require('../../assets/images/left_arrow.png')} />
            </TouchableOpacity>
            <Text className="text-black text-[24px] font-cygrebold max-w-[90%]">Manage Recommendations</Text>
        </View>
        <ScrollView className="flex-[3]" contentContainerStyle={{marginHorizontal: 5}}>
            <View className="mx-5 mb-8">
                <TextInput
                    readOnly
                    value="Update your goals selection to get new book recommendations!"
                    multiline
                    textAlign="left"
                    textAlignVertical="top"
                    className="text-black border py-4 font-cygresemibold leading-[19.2px] rounded-[15px] border-[#8A8A8A] px-4 w-full h-[223px]"
                />
            </View>
            <View className="items-center mx-5">
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
        <View className="py-8">
            <TouchableOpacity
                onPress={handleSave}
                className="bg-[#6592E3] max-w-[313px] w-full self-center mb-[11px] items-center justify-center h-[52px] rounded-[47px]">
                <Text className="text-[#FEFEFC] text-[18px] leading-[22px] font-semibold">Continue</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
}

const ReasonBlock = ({ icon: Icon, id, text, styles, handleCapture, isSelected }) => {


    return <TouchableOpacity
            onPress={() => handleCapture(id)}
            className={`max-w-[348px] border flex-row items-center rounded-[15px] ${isSelected ? 'border-[#6592E3]' : 'border-[#8A8A8A]'} py-4 max-h-[60px] px-8 ${styles}`}>
                <Icon fill={isSelected ? '#6592E3' : '#000'} />
            <View className="w-60 ml-3">
                <Text className={`font-bold font-cygrebold ${isSelected ? 'text-[#6592E3]' : 'text-[#000]'} leading-[19.2px]  flex-wrap`}>{text}</Text>
            </View>
        </TouchableOpacity>
}


export default ManageRecommendations;