import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    FlatList,
    KeyboardAvoidingView,
    Platform
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { MaterialIcons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from "react";
import SelectGenre from "../../components/SelectGenre";
import axios from '../../network/axios';
import { UserContext } from "../../context/UserContext";


const arrayToObject = arr => Object.fromEntries(arr.map(key => [key, false]));

const SelectAuthors = () => {

    const handleInputTextChange = () => {}


    //fetch authors from api selecting authors from already existing books

    const [authors, setAuthors] = useState([]);

    const { setBookFilter } = useContext(UserContext);

    const [authorsSelected, setAuthorsSelected] = useState({})

    const handleOnPress = (author) => {
        setAuthorsSelected(prev => ({...prev, [author]: !authorsSelected[author]}))
    }

    const fetchAuthors = async () => {
        try {
            const { data } = await axios.get('users/books/authors');
            const authors = data.map(item => item.name);

            setAuthors(authors);

            const selectedAuthors = arrayToObject(authors);
            setAuthorsSelected(selectedAuthors);

        } catch(error) {
            console.log(error);
        }
    }

    const handleSave = () => {
        const selectedAuthors = Object.keys(authorsSelected)
            .filter(item => authorsSelected[item] === true)
            .map((item, idx) => ({ id: idx, name: item }));
        
        setBookFilter(item => ({...item, authors: selectedAuthors}))
        router.back()
    }

    useEffect(() => {
        fetchAuthors()
    }, []);

    
    return <SafeAreaView className="bg-[#F7F7F7] h-full flex-1">
            <View className="max-h-[60px] justify-between items-center flex-row h-full mx-5 mb-7">
                <View className="flex-row items-center mt-2">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="flex-1 mr-5 max-w-[44px] w-full items-center justify-center rounded-[10px]">
                            <MaterialIcons name="close" size={24} color="black" />
                    </TouchableOpacity>
{/*                     <Text className="text-black font-cygrebold text-[22px] font-bold">Create Note</Text> */}
                </View>
                <TouchableOpacity
                    onPress={handleSave}
                    className="bg-primary rounded-[30px] flex-1 mt-2.5 max-w-[110px] w-full items-center justify-center max-h-[48px] h-full py-2 px-4">
                        <Text className="leading-[19.2px] text-[#fff] font-cygrebold">Save</Text>
                </TouchableOpacity>
            </View>
            <KeyboardAvoidingView
                className="mx-5 max-h-[150px]"
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >

                <Text className="text-black mt-6 text-[22px] font-cygrebold leading-[26.4px] font-bold">Choose Authors</Text>
                <View className="bg-[#ffffff] mt-5 mb-7 border-[.3px] border-[#727272] items-center max-h-[43px] h-full flex-row justify-between w-full rounded-[26px] px-5">
                    <MaterialIcons name="search" color={'#1C1C1C'} size={22} />
                    <TextInput
                        className="bg-[#ffffff] font-cygreregular justify-center items-center flex-1 pl-4 text-[#000000] leading-[16.8px] text-sm"
                        placeholder="Search an author"
                    />
                    <TouchableOpacity
                        onPress={() => handleInputTextChange('')}
                        className="rounded-full bg-[#000] p-1">
                        <MaterialIcons name='close' color={'#fff'} size={14} />
                    </TouchableOpacity>
                </View>
                </KeyboardAvoidingView>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    className="mx-5 flex-1"
                    data={authors}
                    renderItem={({ item }) =>
                        <SelectGenre
                            key={item}
                            selected={authorsSelected[item]}
                            text={item}
                            onPress={() => handleOnPress(item)}
                            containerStyles={'mb-3.5'}
                        />}
                />
    </SafeAreaView>
}


export default SelectAuthors;