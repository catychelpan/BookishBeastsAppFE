import { useLocalSearchParams } from "expo-router";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { MaterialIcons } from '@expo/vector-icons';
import { router } from "expo-router";
import CardSwipe from "../../components/CardSwipe";
import axios from '../../network/axios';
import { PrimaryButton } from "../../components/CustomButton";



const RepetitionGroup = () => {

    const { groupName, groupId } = useLocalSearchParams();

    //const [progress, setProgress] = useState(30);

    const [cardCount, setCardCount] = useState(0);

    const [currentIndex, setCurrentIndex] = useState(0);

    const [groups, setGroups] = useState([{ title: '' }]);

    //const [isBottomDrawerOpen, setIsBottomDrawerOpen] = useState(false);

    const progress = ((currentIndex + 1) / cardCount) * 100;

    const handleSwipeLeft = () => {
        setCurrentIndex((prev) => (prev + 1) % cardCount);
    };

    const handleSwipeRight = () => {
        setCurrentIndex((prev) => prev > 0 ? (prev - 1) : cardCount - 1);
    };

    const handleDeleteRepetitionGroup = async () => {
        Alert.alert(
            "Delete This Group",
            "Are you sure you want to delete this repetition group? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete",
                    onPress: async () => await deleteRepetitionGroup(),
                    style: "destructive"
                }
            ]
        );
    }

    const deleteRepetitionGroup = async () => {
        try {
            await axios.delete(`users/repetition-group/${groupId}`);
            router.replace('(tabs)/repetition');
        } catch(error) {
            console.log(error);
        }
    }

    const fetchGroupNotesAndQuotes = async () => {
        try {
            const { data } = await axios.get(`users/repetition-group/${groupId}`);
            setCardCount(data.length);
            setGroups(data.map(item => ({ id: item.id, title: item.bookName, description: item.text })));
        } catch(error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchGroupNotesAndQuotes();
    }, []);

    return <SafeAreaView className="bg-[#F7F7F7] h-full">
            <View className="max-h-[60px] justify-between items-center flex-row h-full mx-5 mb-4">
                <View className="flex-row items-center mt-2">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="flex-1 mr-5 max-w-[44px] w-full items-center justify-center rounded-[10px]">
                            <MaterialIcons name="close" size={24} color="black" />
                    </TouchableOpacity>
                    <Text className="text-black font-cygrebold text-[22px] font-bold">{groupName}</Text>
                </View>
                <TouchableOpacity
                    onPress={handleDeleteRepetitionGroup}
                    className="bg-primary flex-1 mt-2.5 mr-2.5 max-w-[44px] w-full items-center justify-center max-h-[44px] h-full rounded-[10px]">
                        <MaterialIcons name="delete" size={27} color={'#fff'} />
                </TouchableOpacity>
            </View>

            <View className="bg-[#D8E6FF] rounded-[13px] h-[7px] relative w-full mb-12">
                <View className='absolute bg-[#6592E3] h-full rounded-[13px]' style={{ width: `${progress}%` }}></View>
            </View>

            <View className="items-center mb-4">
                <CardSwipe
                    data={groups[currentIndex]}
                    onSwipeLeft={handleSwipeLeft}
                    onSwipeRight={handleSwipeRight} 
                    visualFeedBack={false}
                />
            </View>
            <View className="items-center flex-1">
                <Text className="text-[#646464] text-[18px] font-cygrebold">{`${currentIndex + 1} / ${cardCount}`}</Text>
            </View>
            <View className="mx-5">
                <PrimaryButton
                    containerStyles={'min-h-[48px] rounded-[30px] mb-4'}
                    title={'Repeat Group'}
                    textStyles={'text-[16px]'} 
                    handlePress={() => router.push({ pathname: 'revise', params: { groupName, groupId } })}
                />
            </View>
{/*             <BottomDrawer
                height="50%"
                isBottomSheetOpen={isBottomDrawerOpen}
                setIsBottomSheetOpen={setIsBottomDrawerOpen}
            >
                    <Text className="text-[#000000] my-4 font-cygrebold text-[22px] leading-[26.4px]">Add Cards</Text>
                    <TouchableOpacity
                        onPress={() => setIsBottomSheetOpen(false)}
                        className="rounded-[15px] bg-[#1C1C1C] max-h-[56px] w-full h-full flex-row items-center px-7 max-w-[360px] mb-2">
                        <Fontisto name="quote-a-left" size={20} color="white" />
                        <Text className="text-[#FEFEFC] font-cygrebold leading-[19.2px] ml-6">Existing Quotes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setIsBottomSheetOpen(false)}
                        className="rounded-[15px] bg-[#1C1C1C] max-h-[56px] w-full h-full flex-row items-center px-7 max-w-[360px] mb-2">
                        <Fontisto name="quote-a-right" size={20} color="white" />
                        <Text className="text-[#FEFEFC] font-cygrebold leading-[19.2px] ml-6">New Quote</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setIsBottomSheetOpen(false)}
                        className="rounded-[15px] bg-[#1C1C1C] max-h-[56px] w-full h-full flex-row items-center px-7 max-w-[360px] mb-2">
                        <FontAwesome6 name="notes-medical" size={20} color="white" />
                        <Text className="text-[#FEFEFC] font-cygrebold leading-[19.2px] ml-6">Existing Notes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setIsBottomSheetOpen(false)}
                        className="rounded-[15px] bg-[#1C1C1C] max-h-[56px] w-full h-full flex-row items-center px-7 max-w-[360px] mb-2">
                        <FontAwesome6 name="sticky-note" size={20} color="white" />
                        <Text className="text-[#FEFEFC] font-cygrebold leading-[19.2px] ml-6">New Note</Text>
                    </TouchableOpacity>

            </BottomDrawer> */}
    </SafeAreaView>
}




export default RepetitionGroup;