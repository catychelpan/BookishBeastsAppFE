import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useCallback, useEffect } from "react";
import { router } from "expo-router";
import axios from '../../network/axios';
import { QuestionMarkIcon, SpaceHintIcon, SpaceGraphIcon, SpaceCalendarIcon } from "../../components/Svg";
import { COLLECTION_ICON_MAP, COLOR_MAP, COLOR_MAP_SECONDARY } from "../../components/CollectionSvg";
import OverlayModal from "../../components/OverlayModal";

function splitArray(arr) {
    const midpoint = Math.ceil(arr.length / 2);
    const firstHalf = arr.slice(0, midpoint);
    const secondHalf = arr.slice(midpoint);
    return [firstHalf, secondHalf];
}

const Repetition = () => {

    const data = [
        { desc: 'It is a learning technique that helps you retain information more effectively by revisiting content at specific intervals.',
             icon: SpaceHintIcon 
        },

        { desc: 'It leverages the "forgetting curve," ensuring you reinforce key concepts over time by making you review stuff at systematic intervals.',
             icon: SpaceGraphIcon
        },
        {
            desc: 'Here you can set your repetition schedule for each specific group and set reminders for those dates.',
            icon: SpaceCalendarIcon
        }
    ];

    const [firstHalfCollections, setFirstHalfCollections] = useState([]);

    const [secondHalfCollections, setSecondtHalfCollections] = useState([]);

    const [isOverlayOpen, setIsOverlayOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const fetchCollections = useCallback(async () => {
        try {
            setIsLoading(true);
            const { data } = await axios.get('users/repetition-groups');
            const [first, second] = splitArray(data);
            setFirstHalfCollections(first);
            setSecondtHalfCollections(second);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }, [])

    const renderGifLoader = () => {
        if (isLoading) {
            return (
                <View className="items-center justify-center">
                <Image
                    source={require('../../assets/gifs/book-loader.gif')}
                    width={150}
                    height={150}
                    className="max-h-[150px] max-w-[150px]"
                />
                <Text className="text-black text-[24px] leading-[28.8px] font-cygreregular">Wait a bit...</Text>
                </View>
            );
        }
        return null;
  };

    useEffect(() => {
        fetchCollections();
    }, [])

    return (
        <SafeAreaView className="bg-[#F7F7F7] h-full flex-1">
            <View className="max-h-[60px] justify-between items-center flex-row h-full mx-5 mb-7">
                <TouchableOpacity
                    activeOpacity={0.7}
                    className="flex-1 pt-3 flex-row"
                >
                    <Text className="font-cygrebold text-[24px] leading-[28.8px] text-[#121F16]">Spaced Repetition</Text>
                </TouchableOpacity>
            </View>
            <View className="mx-5 flex-1">
                <TouchableOpacity
                    onPress={() => setIsOverlayOpen(true)}
                    className="bg-[#1C1C1C] mb-6 max-h-[106px] h-full rounded-[20px] border-[.3px] border-[#8A8A8A] flex-row justify-between px-6 items-center">
                    <View className="py-4 max-w-[60%]">
                        <Text className="font-cygrebold leading-[19.2px] text-white">Spaced Repetition Technique</Text>
                        <Text className="text-[12px] font-cygreregular text-white">Tap to see how and why it works</Text>
                    </View>
                    <View className="mt-2.5">
                        <QuestionMarkIcon />
                    </View>
                </TouchableOpacity>
                <OverlayModal
                    visible={isOverlayOpen}
                    onClose={() => setIsOverlayOpen(false)}
                >
                    <View className="items-center mb-7">
                        <SpaceHintIcon />
                    </View>
                    <Text className="text-[##1C1C1C] text-[14px] font-cygreregular text-center">It is a learning technique that helps you retain information more effectively by revisiting content at specific intervals. </Text>
                </OverlayModal>
                <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
                        { isLoading ? (
                            renderGifLoader()
                        ) : (
                            <View className="flex-row justify-between w-full gap-x-2">
                                <View className="w-full flex-[.5]">
                                    <NewGroup />
                                    { secondHalfCollections.map(item => 
                                        <ExistingGroup
                                            key={item.id}
                                            name={item.name}
                                            cardsCount={item.cardCount}
                                            iconId={item.iconId}
                                            colorId={item.colorId}
                                            onPress={() => item.cardCount ?  router.push({ pathname: 'repetition-group', params: { groupName: item.name, groupId: item.id } }) : () => undefined}
                                    />) }
                                </View>
                                <View className="w-full flex-[.5]">
                                    { firstHalfCollections.map(item =>
                                    <ExistingGroup
                                        key={item.id}
                                        name={item.name} 
                                        cardsCount={item.cardCount}
                                        iconId={item.iconId}
                                        colorId={item.colorId}
                                        onPress={() => item.cardCount ?  router.push({ pathname: 'repetition-group', params: { groupName: item.name, groupId: item.id } }) : () => undefined}
                                    />) }
                                </View>
                            </View>
                        ) }
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

const NewGroup = () => {

    return <View className="rounded-[17px] flex-row rounded-br-[44px] mb-4 bg-black max-w-[171px] w-full h-[114px] p-4">
        <Text className="font-cygrebold max-w-[83px] text-[18px] text-[#fff] leading-[21.6px]">Add new group</Text>
        <TouchableOpacity
            onPress={() => router.push('add-repetition-group')}
            className="items-center self-end flex-1 justify-center">
                <View className="bg-[#fff] w-[50px] h-[50px] items-center justify-center rounded-full ">
                    <MaterialIcons name="add" size={30} color={'black'} />
                </View>
        </TouchableOpacity>
    </View>
}

const ExistingGroup = ({ name, cardsCount, iconId, colorId, onPress, containerStyles }) => {

    const IconElement = COLLECTION_ICON_MAP[iconId];

    return <TouchableOpacity
                onPress={onPress}
                style={{ backgroundColor: COLOR_MAP[colorId] }}
                className={`rounded-[17px] overflow-hidden justify-between relative max-w-[171px] w-full h-[114px] mb-4 p-4 ${containerStyles}`}
            >

            <View className="mb-2">
                <Text
                    style={{ borderRadius: 15, overflow: 'hidden' }}
                    className="font-cygrebold self-start bg-[#F7F7F7] items-center justify-center px-2 text-[18px] text-black">
                    {name}
                </Text>
            </View>

            { cardsCount ? (
                <View className="items-end self-end mt-3 bg-[#F7F7F7] rounded-[21px]">
                    <Text className="px-2.5 py-1 text-[12px] font-medium">{`${cardsCount} cards`}</Text>
                </View>
            ) : <></> }

            <View className="items-center self-end max-w-[61px] absolute -z-10 rounded-full justify-center">
                <IconElement fill={COLOR_MAP_SECONDARY[COLOR_MAP[colorId]]} />
            </View>

    </TouchableOpacity>
}

export default Repetition;