import {
    View,
    Text,
    TouchableOpacity,
    FlatList
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { router } from "expo-router";
import { UserContext } from "../../context/UserContext";
import axios from '../../network/axios';


//TODO: extract out into utility functions
const getKeysWithTrueValue = obj => Object.entries(obj)
    .filter(([_, value]) => value === true)
    .map(([key]) => key);

const getSelectedCollectionIds = obj => Object.entries(obj)
    .filter(data => data[1][0] === true).map(obj => obj[1][1]);

const statusOptions = {
    'To Read': 0,
    'Reading': 1,
    'Finished': 2,
    'Gave Up': 3,
    'Paused': 4,
}

const bookNameToStatus = (status) => {
  return statusOptions[status];
};

const LibraryFilters = () => {

    const {
        bookFilter,
        setBookFilter,
        setSelectedCategories,
        setSelectedCollections,
        setSelectedReadingStatuses,
        selectedCategories,
        selectedCollections,
        selectedReadingStatuses
    } = useContext(UserContext);

    const onClose = (id) => {
        const filteredAuthors = bookFilter.authors.filter(item => item.id !== id);
        setBookFilter(prev => ({...prev, authors: filteredAuthors}))
    }

    const handleSave = () => {
        setBookFilter(prev => ({...prev,

            collections: getSelectedCollectionIds(selectedCollections),

            categories: getKeysWithTrueValue(selectedCategories),

            readingStatuses: getKeysWithTrueValue(selectedReadingStatuses)
                .map(item => bookNameToStatus(item))
        }));
        //console.log(getSelectedCollectionIds(selectedCollections));
        router.back();
    }


    const handleReset = () => {
        setBookFilter(prev =>
            ({
                ...prev,
                collections: [],
                categories: [],
                authors: [],
                readingStatuses: []
            }));
        setSelectedCategories({})
        setSelectedCollections({});
        setSelectedReadingStatuses({
            toRead: false,
            reading: false,
            done: false,
            gaveUp: false,
            paused: false
        });
    }

    return <SafeAreaView className="bg-[#F7F7F7] h-full">
        <View className="max-h-[60px] justify-between items-center flex-row h-full mx-5 mb-7">

            <TouchableOpacity
                onPress={() => router.back()}
                className="flex-1 mt-2.5 mr-2.5 max-w-[44px] w-full items-center justify-center rounded-[10px]">
                    <MaterialIcons name="close" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={handleSave}
                className="bg-primary rounded-[30px] flex-1 mt-2.5 max-w-[110px] w-full items-center justify-center max-h-[48px] h-full py-2 px-4">
                    <Text className="leading-[19.2px] text-[#fff] font-cygrebold">Save</Text>
            </TouchableOpacity>
        </View>

        <View className="mt-7 mx-5 justify-between flex-row items-center">
            <Text className="text-black text-[24px] leading-[28.8px] font-cygrebold">
                Choose Filters
            </Text>
            <View className="flex-row">
                <Text className="underline underline-offset-3 mr-2 text-black font-cygrebold">Reset</Text>
                <TouchableOpacity
                    onPress={handleReset}
                    className="rounded-full bg-[#000] p-1">
                    <MaterialIcons name='close' color={'#fff'} size={14} />
                </TouchableOpacity>
            </View>
        </View>

        <View className="mx-5 mt-9">
            <Text className="text-black text-[18px] leading-[21.6px] font-cygrebold mb-4">Reading Status</Text>
            <ReadingStatusRow
                setSelectedReadingStatuses={setSelectedReadingStatuses}
                selectedReadingStatuses={selectedReadingStatuses}
            />
        </View>

        <View className="mx-5 mt-7">
            <Text className="text-black text-[18px] leading-[21.6px] font-cygrebold mb-2.5">Authors</Text>
            <AuthorsDropdown />
            { bookFilter.authors && (
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    className="mt-3"
                    horizontal
                    data={bookFilter.authors}
                    renderItem={({ item }) =>
                        <SelectedAuthorChip
                            key={item.id}
                            name={item.name}
                            containerStyles={'mr-2.5'}
                            onClose={() => onClose(item.id)}
                        />
                    }
                />
            )}
        </View>

        <View className="mx-5 mt-7">
            <Text className="text-black text-[18px] leading-[21.6px] font-cygrebold mb-2.5">Categories</Text>
            <CategoryRow
                setSelectedCategories={setSelectedCategories}
                selectedCategories={selectedCategories}
             />
        </View>
        
        <View className="mx-5 mt-7">
            <Text className="text-black text-[18px] leading-[21.6px] font-cygrebold mb-2.5">Collections</Text>
            <CollectionRow
                setSelectedCollections={setSelectedCollections}
                selectedCollections={selectedCollections}
            />
        </View>

    </SafeAreaView>
}

export default LibraryFilters;



const AuthorsDropdown = () => {
    return <TouchableOpacity
        onPress={() => router.push('select-authors')}
        className="border-[#8A8A8A] border-[.5px] bg-[#fff] items-center justify-center rounded-[15px] flex-row p-3">
        <Text className="text-black font-cygreregular leading-[19.2px] mr-2.5 text-center">Choose Authors</Text>
        <MaterialIcons name="arrow-drop-down" size={20} color="black" />
    </TouchableOpacity>;
}

const SelectedAuthorChip = ({ name, onClose, containerStyles }) => {
    return <View className={`max-h-[32px] bg-black rounded-[5px] flex-row p-2 h-full items-center justify-center ${containerStyles}`}>
        <Text className="text-[#FFFFFF] font-cygrebold leading-[16.8px] text-sm px-1" numberOfLines={1} ellipsizeMode='tail'>{name}</Text>
        <TouchableOpacity
            onPress={onClose}
            className="rounded-full bg-[#fff] items-center ml-1 mr-2.5 justify-center w-[16px] h-[16px]">
            <MaterialIcons name='close' color={'#6592E3'} size={8} />
        </TouchableOpacity>
    </View>
}

const CollectionRow = ({ selectedCollections, setSelectedCollections }) => {

    const [collections, setCollections] = useState(["For main essay", "Health Hacks", "For psychology"]); //fetched from api

    const fetchCollections = async () => {
        try {
            const { data } = await axios.get('users/collections');

            const collectionNames = data.filter(item => item.name !== '');

            setCollections(collectionNames)

            //check for previously chosen collections
            const selectedCollectionsObj = Object.fromEntries(data.filter(item => item.name)
                .map(item => [item.name, [selectedCollections[item.name]
                    ? selectedCollections[item.name][0] : false, item.id]] ));

            setSelectedCollections(selectedCollectionsObj);
        } catch (error) {
            console.log(error);
        }}

    useEffect(() => {
        fetchCollections();
    }, []);

    return (
        <FlatList
            horizontal
            data={collections}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, _ }) => <Status
                key={item.id}
                status={item.name}
                selected={selectedCollections[item.name] && selectedCollections[item.name][0]}
                onPress={() => setSelectedCollections(prev => ({...prev, [item.name]:  [!selectedCollections[item.name][0],
                    selectedCollections[item.name][1]]}))}  
            />}
        />
    );


}


const CategoryRow = ({ selectedCategories, setSelectedCategories }) => {

    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get('categories');

            setCategories(data);

            const selectedCategoriesObj = Object.fromEntries(data
                .map(({ item }) => [item, selectedCategories[item] ?? false] ));

            setSelectedCategories(selectedCategoriesObj);
        } catch (error) {
            console.log(error);
        }
    }

    useLayoutEffect(() => {
        fetchCategories();
    }, []);

    return (
        <FlatList
            horizontal
            data={categories}
            showsHorizontalScrollIndicator={false}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            renderItem={({ item: { item, id } }) => <Status
                key={id}
                status={item}
                selected={selectedCategories[item]}
                onPress={() => setSelectedCategories(prev => ({...prev, [item]: !selectedCategories[item]}))}  
                
            />}
        />
    );


}

const ReadingStatusRow = ({ selectedReadingStatuses, setSelectedReadingStatuses }) => {

    const [statuses] = useState(["To Read", "Reading", "Finished", "Gave Up", "Paused"]);

    return (
        <FlatList
            horizontal
            data={statuses}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, _ }) => <Status
                key={item}
                status={item}
                selected={selectedReadingStatuses[item]}
                onPress={() => setSelectedReadingStatuses(prev => ({...prev, 
                    [item]: !selectedReadingStatuses[item]}))}  
            />}
        />
    );
}


const Status = ({ status, selected, onPress }) => {
    return <TouchableOpacity onPress={onPress} className={`${selected ? 'bg-primary' : 'bg-[#fff]'}  py-2 px-3 max-h-[40px] mr-1.5 border-[.5px] border-[#8A8A8A] rounded-[8px] justify-between items-center flex-row`}>
        { selected ? <Feather name="check" size={16} color="white" /> : <></> }
        <Text className={`${selected ? 'text-white ml-2' : 'text-black'} text-[14px] leading-[20px] font-cygrebold`}>{status}</Text>
    </TouchableOpacity>
}