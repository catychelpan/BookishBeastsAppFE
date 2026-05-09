import {
    TextInput,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from '@expo/vector-icons';
import { router, useFocusEffect } from "expo-router";
import { useContext, useState, useCallback } from "react";
import axios from '../../network/axios';
import { UserContext } from "../../context/UserContext";
import { COLLECTION_ICON_MAP } from "../../components/CollectionSvg";
import debounce from "lodash/debounce";


function splitArray(arr) {
    const midpoint = Math.ceil(arr.length / 2);
    const firstHalf = arr.slice(0, midpoint);
    const secondHalf = arr.slice(midpoint);
    return [firstHalf, secondHalf];
}


const SelectCollections = () => {


    //when fetching the collection it has to be ordered in backend and then split in two here

    const [searchText, setSearchText] = useState('');

    const [firstHalfCollections, setFirstHalfCollections] = useState([]);

    const [secondHalfCollections, setSecondtHalfCollections] = useState([]);

    const { setBook, book: { collections } } = useContext(UserContext);

    const fetchCollections = useCallback(debounce(async (text) => {
        try {
            const queryParams = new URLSearchParams();
            if (text) {
                queryParams.append('searchText', text);
            }
            const { data } = await axios.get(`users/collections?${queryParams.toString()}`);
            const [first, second] = splitArray(data);
            //we need collections variable in case there are already selected collections
            const firstMapped = first.map(item => ({...item, selected: collections
                ?.some(j => j.id === item.id) ? true : false })); //probably wiser to receiver from backed selected false
            const secondMapped = second.map(item => ({...item, selected: collections
                ?.some(j => j.id === item.id) ? true : false }));
            setFirstHalfCollections(firstMapped);
            setSecondtHalfCollections(secondMapped);
        } catch (error) {
            console.log(error);
        }
    }, 500), [])

    const handleTextSearch = (text) => {
        setSearchText(text);
        fetchCollections(text)
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

    const handleSave = () => {
        const first = firstHalfCollections.filter(item => item.selected)
            .map(item => ({ id: item.id, name: item.name, iconId: item.iconId }))

        const second = secondHalfCollections.filter(item => item.selected)
            .map(item => ({ id: item.id, name: item.name, iconId: item.iconId }));

        const collections = first.concat(second);

        setBook(prev => ({...prev, collections: collections}))
        router.back();
    }

    useFocusEffect(
        useCallback(() => {
            fetchCollections();
        }, [fetchCollections])
    );

    //console.log(firstHalfCollections, secondHalfCollections)

    return <SafeAreaView className="bg-[#F7F7F7] h-full">

            <View className="justify-between max-h-[60px] h-full items-center flex-row mx-5">

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
                <Text className="text-black mt-6 text-[24px] font-cygrebold leading-[28.8px] font-bold">Select collections</Text>
                <View className="bg-[#ffffff] mt-5 mb-7 border-[.3px] border-[#727272] items-center max-h-[43px] h-full flex-row justify-between w-full rounded-[26px] px-5">
                    <MaterialIcons name="search" color={'#1C1C1C'} size={22} />
                    <TextInput
                        value={searchText}
                        onChangeText={handleTextSearch}
                        className="bg-[#ffffff] font-cygreregular justify-center items-center flex-1 pl-4 text-[#000000] leading-[16.8px] text-sm"
                        placeholder="Search a collection"
                    />
                    <TouchableOpacity
                        onPress={() => {
                            setSearchText('')
                            fetchCollections('');
                        }}
                        className="rounded-full bg-[#000] p-1">
                        <MaterialIcons name='close' color={'#fff'} size={14} />
                    </TouchableOpacity>
                </View>

            </View>


            <ScrollView className="mx-5 flex-[3]"
                showsVerticalScrollIndicator={false}>
                <View className="flex-row justify-between space-x-3 w-full">
                    <View className="w-full flex-[.5] h-full">
                        <NewCollection />
                        { secondHalfCollections.map(item => 
                            <ExistingCollection
                                key={item.id}
                                name={item.name}
                                onSelected={() => handleSecondHalfSelection(item.id)}
                                iconId={item.iconId}
                                selected={item.selected}
                                booksCount={item.booksCount}
                        />) }
                    </View>
                    <View className="w-full flex-[.5] h-full">
                        { firstHalfCollections.map(item =>
                         <ExistingCollection
                            key={item.id}
                            onSelected={() => handleFirstHalfSelection(item.id)}
                            name={item.name} 
                            iconId={item.iconId}
                            selected={item.selected}
                            booksCount={item.booksCount}
                        />) }
                    </View>
                </View>
            </ScrollView>
    </SafeAreaView>
}


export default SelectCollections;


const NewCollection = ({ containerStyles }) => {

    return <View className={`bg-primary rounded-[20px] mb-4 justify-between p-4 max-w-[169px] h-[174px] ${containerStyles}`}>
        <Text className="font-cygrebold mb-7 text-[22px] leading-[26.4px] font-bold text-[#ffffff]" numberOfLines={2} ellipsizeMode="tail">New Collection</Text>
        <TouchableOpacity
            onPress={() => router.push({pathname: '/create-collection', params: { fromSelect: true }})}
            className="items-center self-end bg-[#fff] max-w-[61px] max-h-[62px] rounded-full justify-center p-4">
            <MaterialIcons name="add" size={30} />
        </TouchableOpacity>
    </View>
}


const ExistingCollection = ({ name, booksCount, iconId, selected, onSelected, containerStyles }) => {

    //push to collection with the name (it should be unique)

    const IconElement = COLLECTION_ICON_MAP[iconId];

    return (
        <TouchableOpacity
            onPress={onSelected}
            className={`bg-[#ffffff] relative mb-4 overflow-hidden border-[#8A8A8A] border-[.5px] rounded-[20px] justify-between p-4 h-[174px] ${selected ? 'border-[2px] border-primary': ''}  ${containerStyles}`}>
            <Text
                className={`font-cygrebold mb-3 text-[22px] leading-[26.4px] font-bold text-[#121F16] ${selected ? 'text-primary' : ''}`}
                numberOfLines={2} ellipsizeMode="tail">{name}</Text>
                { booksCount > 0 ? (
                    <View className="bg-[#EEEEEE] self-start rounded-[21px] px-2.5 py-1">
                        <Text className="text-black text-sm font-medium">{`${booksCount} books`}</Text>
                    </View>
                ) : <View className="px-2.5 py-1"></View> }
            <View
                className="items-center  self-end bg-[#ffffff] max-w-[61px] bottom-0 relative -right-1 -z-10 max-h-[61px] rounded-full justify-center">
                    <IconElement fill={selected && '#6592E3'} />
            </View>
        </TouchableOpacity>
    );
}