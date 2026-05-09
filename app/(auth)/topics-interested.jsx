import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import OnboardingProgress from "../../components/OnboardingProgress";
import { StatusBar } from 'expo-status-bar';
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import axios from '../../network/axios';


const TopicsInterested = () => {

    const { setOnboardingState } = useContext(UserContext);

    const [interests, setInterests] = useState([]);
    const [chosenInterests, setChosenInterests] = useState([]);

    const fetchInterests = async () => {
        try {
            const { data } = await axios.get('books/interest-areas');
            setInterests(data);
        } catch(error) {
            console.log(error);
        }
    }

    const handleCaptureOnboardingState = (id) => {
        if (chosenInterests.some(a => a === id)) {
            setChosenInterests(prev => prev.filter(a => a !== id))
        } else {
            setChosenInterests(prev => [...prev, id])
        }
    }

    const handleContinue = () => {
        setOnboardingState(prev => ({...prev, interestAreas: chosenInterests}))
        router.push('/books-interested')
    }

    useEffect(() => {
        if (interests.length === 0)
            fetchInterests();
    }, []);

    return <SafeAreaView className="bg-[#F7F7F7] h-full">
            <View className="w-full px-[20px] mt-5">
                <OnboardingProgress stage1={100} stage2={25} />
            </View>
            <View className="w-full my-12 items-center">
                <Text className="font-bold text-[#000000] w-full text-[24px] text-center leading-[28px] px-16 font-cygrebold">
                    Choose areas you are interested in:
                </Text>
            </View>

        <FlatList
            className="flex-[3]"
            data={interests}
            keyExtractor={(item) => item.id}
            numColumns={3} // Adjust based on your desired layout
            columnWrapperStyle={{ justifyContent: 'center' }}
            renderItem={({ item }) => (
                <Block
                    name={item.name}
                    handleCaptureOnboardingState={handleCaptureOnboardingState}
                    isSelected={chosenInterests.some(a => a === item.id)}
                    id={item.id}
                />
            )}
        />

            <View className="w-full justify-center items-center max-h-[200px]">
                <TouchableOpacity
                    onPress={handleContinue}
                    className="bg-[#6592E3] max-w-[313px] w-full self-center mb-[11px] items-center justify-center max-h-[52px] h-full rounded-[47px]">
                    <Text className="text-[#FEFEFC] text-[18px] leading-[22px] font-semibold">Continue</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push('/books-interested')}
                    className="border border-[#000000] mb-[28px] self-center bg-transparent items-center justify-center max-w-[313px] w-full max-h-[52px] h-full rounded-[47px]">
                    <Text className="text-[#000000] text-[18px] leading-[22px] font-semibold">Skip For Now</Text>
                </TouchableOpacity>
            </View>
        <StatusBar backgroundColor='#F7F7F7' style='dark' />
    </SafeAreaView>
}



const Block = ({ name, styles, id, handleCaptureOnboardingState, isSelected }) => {

    return <TouchableOpacity
            onPress={() => {
                handleCaptureOnboardingState(id)
            }}
            className={`border-[0.9px] m-[5px] border-[#8A8A8A] items-center justify-center w-[111px] min-h-[62px] max-h-[62px] rounded-[8px] ${isSelected ? 'border-[#6592E3]' : ''} ${styles}`}>
        <Text className={`font-cygresemibold text-center text-[16px] ${isSelected ? 'text-[#6592E3]' : 'text-[#000]'} px-[10px]`}>{name}</Text>
    </TouchableOpacity>
}


export default TopicsInterested;