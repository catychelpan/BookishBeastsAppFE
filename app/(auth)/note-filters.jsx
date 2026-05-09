import {
    View,
    Text,
    TouchableOpacity,
    FlatList
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useContext, useState } from "react";
import { router } from "expo-router";
import { UserContext } from "../../context/UserContext";

const NoteFilters = () => {


    const { noteFilter, setNoteFilter, setBooksSelected, booksSelected } = useContext(UserContext);

    //on close we need to remove chip from filter and un-select it in select-books screen
    const onClose = (id) => {
        const filteredBooks = noteFilter.books.filter(item => item.id !== id);
        setNoteFilter(prev => ({...prev, books: filteredBooks}))
        if (booksSelected[id]) {
            setBooksSelected(prev => ({...prev, [id]: false}))
        }
    }

    return <SafeAreaView className="bg-[#F7F7F7] h-full">
        <View className="max-h-[60px] justify-between items-center flex-row h-full mx-5 mb-7">

            <TouchableOpacity
                onPress={() => router.back()}
                className="flex-1 mt-2.5 mr-2.5 max-w-[44px] w-full items-center justify-center rounded-[10px]">
                    <MaterialIcons name="close" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
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
                <TouchableOpacity className="rounded-full bg-[#000] p-1">
                    <MaterialIcons name='close' color={'#fff'} size={14} />
                </TouchableOpacity>
            </View>
        </View>

        <View className="mx-5 mt-7">
            <Text className="text-black text-[18px] leading-[21.6px] font-cygrebold mb-2.5">Books</Text>
            <AuthorsDropdown />
            { noteFilter.books && (
                <FlatList
                    className="mt-3"
                    horizontal
                    showsVerticalScrollIndicator={false}
                    data={noteFilter.books}
                    renderItem={({ item }) =>
                        <SelectedBookChip
                            name={item.name}
                            containerStyles={'mr-2.5'}
                            onClose={() => onClose(item.id)}
                        />
                    }
                />
            )}
        </View>

        <View className="mx-5 mt-7">
            <Text className="text-black text-[18px] leading-[21.6px] font-cygrebold mb-2.5">Types</Text>
            <TypesRow />
        </View>
        
        <View className="mx-5 mt-7">
            <Text className="text-black text-[18px] leading-[21.6px] font-cygrebold mb-2.5">Has Photo</Text>
            <HasPhotoRow />
        </View>

    </SafeAreaView>
}

const Status = ({ status, selected, onPress }) => {
    return <TouchableOpacity onPress={onPress} className={`${selected ? 'bg-primary' : 'bg-[#fff]'}  py-2 px-3 max-h-[40px] mr-1.5 border-[.5px] border-[#8A8A8A] rounded-[8px] justify-between items-center flex-row`}>
        { selected ? <Feather name="check" size={16} color="white" /> : <></> }
        <Text className={`${selected ? 'text-white ml-2' : 'text-black'} text-[14px] leading-[20px] font-cygrebold`}>{status}</Text>
    </TouchableOpacity>
}

const AuthorsDropdown = () => {
    return <TouchableOpacity
        onPress={() => router.push('select-books')}
        className="border-[#8A8A8A] border-[.5px] bg-[#fff] items-center justify-center rounded-[15px] flex-row p-3">
        <Text className="text-black font-cygreregular leading-[19.2px] mr-2.5 text-center">Choose Books</Text>
        <MaterialIcons name="arrow-drop-down" size={20} color="black" />
    </TouchableOpacity>;
}

const TypesRow = () => {

    const [categories] = useState(["Fact", "Thought", "Question", "Too Relatable"]);

    const [selectedCategories, setSelectedCategories] = useState({
        fact: false,
        thought: false,
        question: false,
        tooRelatable: false,
    });


    return (
        <FlatList
            horizontal
            data={categories}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, _ }) => <Status
                status={item}
                selected={selectedCategories[item]}
                onPress={() => setSelectedCategories(prev => ({...prev, [item]: !selectedCategories[item]}))}  
            />}
        />
    );
}

const SelectedBookChip = ({ name, onClose, containerStyles }) => {
    return <View className={`max-h-[32px] bg-black rounded-[5px] flex-row p-2 h-full items-center justify-center ${containerStyles}`}>
        <Text className="text-[#FFFFFF] font-cygrebold leading-[16.8px] text-sm px-1" numberOfLines={1} ellipsizeMode='tail'>{name}</Text>
        <TouchableOpacity
            onPress={onClose}
            className="rounded-full bg-[#fff] items-center ml-1 mr-2.5 justify-center w-[16px] h-[16px]">
            <MaterialIcons name='close' color={'#6592E3'} size={8} />
        </TouchableOpacity>
    </View>
}

const HasPhotoRow = () => {

    const [categories] = useState(["Yes", "No"]);

    const [selectedCategories, setSelectedCategories] = useState({
        yes: false,
        no: false,
    });


    return (
        <FlatList
            horizontal
            data={categories}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, _ }) => <Status
                status={item}
                selected={selectedCategories[item]}
                onPress={() => setSelectedCategories(prev => ({...prev, [item]: !selectedCategories[item]}))}  
            />}
        />
    );
}

export default NoteFilters;