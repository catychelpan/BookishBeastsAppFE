import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Image
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useCallback, useEffect, useContext } from "react";
import { router } from "expo-router";
import axios from '../../network/axios';
import { COLLECTION_ICON_MAP, COLOR_MAP, COLOR_MAP_SECONDARY } from "../../components/CollectionSvg";
import { UserContext } from "../../context/UserContext";
import debounce from "lodash/debounce";

function splitArray(arr) {
    const midpoint = Math.ceil(arr.length / 2);
    const firstHalf = arr.slice(0, midpoint);
    const secondHalf = arr.slice(midpoint);
    return [firstHalf, secondHalf];
}

const SelectRepetitionCollections = () => {

    const [firstHalfCollections, setFirstHalfCollections] = useState([]);

    const [secondHalfCollections, setSecondtHalfCollections] = useState([]);

    const { setNote, note: { repetitionGroups } } = useContext(UserContext);

    const [searchText, setSearchText] = useState('');   

    const [isLoading, setIsLoading] = useState(true);
    
    console.log(repetitionGroups)

    const fetchCollections = useCallback(debounce(async (text) => {
        try {
            const queryParams = new URLSearchParams();
            if (text) {
                queryParams.append('searchText', text);
            }
            const { data } = await axios.get(`users/repetition-groups?${queryParams.toString()}`);
            const [first, second] = splitArray(data);
            const firstMapped = first.map(item => ({...item, selected: repetitionGroups
                ?.some(j => j.id === item.id) ? true : false })); //probably wiser to receiver from backed selected false
            const secondMapped = second.map(item => ({...item, selected: repetitionGroups
                ?.some(j => j.id === item.id) ? true : false }));
            setFirstHalfCollections(firstMapped);
            setSecondtHalfCollections(secondMapped);
        } catch (error) {
            console.log(error);
        }
        finally {
            setIsLoading(false);
        }
    }, 500), [])

    useEffect(() => {
        fetchCollections();
    }, []);

    const handleSearchText = (text) => {
        setSearchText(text)
        fetchCollections(text);
    }

    const handleSave = () => {
        const first = firstHalfCollections.filter(item => item.selected)
            .map(item => ({ id: item.id, name: item.name}))

        const second = secondHalfCollections.filter(item => item.selected)
            .map(item => ({ id: item.id, name: item.name }));

        const collections = first.concat(second);

        setNote(prev => ({...prev, repetitionGroups: collections}))
        router.back();
    }

    const handleFirstHalfSelection = (selectedId) => {
        setFirstHalfCollections(prev => 
            prev.map(c => 
                c.id === selectedId
                    ? { ...c, selected: !c.selected }
                    : {...c}
            )
        );
    };

    const handleSecondHalfSelection = (selectedId) => {
        setSecondtHalfCollections(prev => 
            prev.map(c => 
                c.id === selectedId
                    ? { ...c, selected: !c.selected }
                    : {...c}
            )
        );
    };

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

    return (
        <SafeAreaView className="bg-[#F7F7F7] h-full flex-1">
            <View className="max-h-[60px] justify-between items-center flex-row h-full mx-5 mb-7">
                <TouchableOpacity className="flex-1" onPress={() => router.back()}>
                    <MaterialIcons name='close' color={'black'} size={20} />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleSave}
                    className="bg-primary self-end mt-2 max-w-[110px] w-full items-center justify-center max-h-[48px] h-full rounded-[30px]">
                    <Text className="text-[#FEFEFC] text-[18px] leading-[22px] font-semibold">Save</Text>
                </TouchableOpacity>
            </View>
            <View className="mx-5 max-h-[150px]">
                <Text className="text-black mt-6 text-[24px] font-cygrebold leading-[28.8px] font-bold">Select Repetition Groups</Text>
                <View className="bg-[#ffffff] mt-5 mb-7 border-[.3px] border-[#727272] items-center max-h-[43px] h-full flex-row justify-between w-full rounded-[26px] px-5">
                    <MaterialIcons name="search" color={'#1C1C1C'} size={22} />
                    <TextInput
                        value={searchText}
                        onChangeText={handleSearchText}
                        className="bg-[#ffffff] font-cygreregular justify-center items-center flex-1 pl-4 text-[#000000] leading-[16.8px] text-sm"
                        placeholder="Search collections"
                    />
                    <TouchableOpacity
                        onPress={() => handleSearchText('')}
                        className="rounded-full bg-[#000] p-1">
                        <MaterialIcons name='close' color={'#fff'} size={14} />
                    </TouchableOpacity>
                </View>

            </View>
            <View className="mx-5 flex-1">
                <ScrollView className="flex-1">
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
                                        selected={item.selected}
                                        onPress={() => handleSecondHalfSelection(item.id)}
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
                                    selected={item.selected}
                                    onPress={() => handleFirstHalfSelection(item.id)}
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

const ExistingGroup = ({ name, cardsCount, iconId, selected, colorId, onPress, containerStyles }) => {

    const IconElement = COLLECTION_ICON_MAP[iconId];

    return <TouchableOpacity
                onPress={onPress}
                style={{ backgroundColor: COLOR_MAP[colorId], borderColor: COLOR_MAP[colorId] }}
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

export default SelectRepetitionCollections;