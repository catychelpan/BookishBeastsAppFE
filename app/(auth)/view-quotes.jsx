import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useContext, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { UserContext } from "../../context/UserContext";
import RadioButton from "../../components/RadioButton";
import axios from '../../network/axios'
import debounce from 'lodash/debounce';



const ViewQuotes = () => {

    const [searchText, setSearchText] = useState('');

    const handleSearchText = (text) => {
        setSearchText(text)
        fetchQuotes(text)
    }

    const { id } = useLocalSearchParams();

    const { setRepetitionGroup, repetitionGroup } = useContext(UserContext);

    const getSelectedState = (id) => {
        return repetitionGroup.quotes.find(item => item.id === id)?.selected ?? false;
    }

    //fetch from api
    const [quotes, setQuotes] = useState([]);

    const handleQuoteSelection = (selectedId) => {
        setQuotes(prev => 
            prev.map(note => 
                note.id === selectedId
                    ? { ...note, selected: !note.selected }
                    : note
            )
        );
    };

    const fetchQuotes = debounce(async (text) => {
        try {
            const queryParams = new URLSearchParams();
            if (text) {
                queryParams.append('searchText', text);
            }
            const { data } = await axios.get(`users/books/${id}/quotes?${queryParams.toString()}`);
            const mappedNotes = data.map(item => ({
                id: item.id,
                text: item.text,
                book: item.bookName,
                selected: getSelectedState(item.id)
            }));
            setQuotes(mappedNotes);
        } catch (error) {
            console.log(error);
        }
    }, 500);


    const handleSave = () => {
        const selectedNotes = quotes.filter(item => item.selected === true);
        setRepetitionGroup(prev => ({...prev, quotes: selectedNotes}))
        router.back();
    }


    useEffect(() => {
        fetchQuotes();
    }, []);

    //fetch quotes set to notes object 

    return (
        <SafeAreaView className="bg-[#F7F7F7] flex-1">
            <View className="max-h-[60px] items-center h-full mx-5 mb-7">
                <View className="flex-row justify-between ites-center w-full items-center mt-2">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="flex-1 mr-5 max-w-[44px] w-full items-center justify-center rounded-[10px]">
                            <MaterialIcons name="close" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
            <KeyboardAvoidingView
                className="mx-5 max-h-[150px] flex-1"
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >

                <Text className="text-black mt-6 text-[22px] font-cygrebold leading-[26.4px] font-bold">All Quotes</Text>
                <View className="bg-[#ffffff] mt-5 mb-7 border-[.3px] border-[#727272] items-center max-h-[43px] h-full flex-row justify-between w-full rounded-[26px] px-5">
                    <MaterialIcons name="search" color={'#1C1C1C'} size={22} />
                    <TextInput
                        onChangeText={handleSearchText}
                        value={searchText}
                        className="bg-[#ffffff] font-cygreregular justify-center items-center flex-1 pl-4 text-[#000000] leading-[16.8px] text-sm"
                        placeholder="search"
                    />
                    <TouchableOpacity
                        onPress={() => handleSearchText('')}
                        className="rounded-full bg-[#000] p-1">
                        <MaterialIcons name='close' color={'#fff'} size={14} />
                    </TouchableOpacity>
                </View>
                </KeyboardAvoidingView>
                <FlatList
                    className="mx-5 flex-1"
                    data={quotes}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => <NoteCard
                        book={item.book}
                        text={item.text}
                        selected={item.selected}
                        onRadioButtonPress={() => handleQuoteSelection(item.id)}
                        containerStyles={'mb-4'} />}
                />
        </SafeAreaView>
    );
}





export default ViewQuotes;



const NoteCard = ({ text, book, selected, onRadioButtonPress, onDeleteButtonPress, showRadioButton = true, containerStyles }) => {

    return <View className={`border-[#8A8A8A] py-5 px-4 border-[.5px] rounded-[20px] ${containerStyles}`}>
        <View className="flex-row justify-between items-center mb-4">
            <View className="bg-primary px-4 py-1 rounded-[13px] flex-row items-center">
                <MaterialIcons name="book" color={'white'} />
                <Text className="text-[#FFFFFF] text-sm leading-[16.8px] ml-1">{book}</Text>
            </View>
            { showRadioButton ? (
                <RadioButton
                    onPress={onRadioButtonPress}
                    selected={selected} 
                />
            ) : <TouchableOpacity
                    onPress={onDeleteButtonPress}
                    className="bg-black rounded-full p-2">
                    <MaterialIcons name="delete" size={24} color="white" />
                </TouchableOpacity> }
        </View>
        <View className="py-3 px-4 rounded-[8px] bg-[#EEEEEE] w-full">
            <Text className="text-black font-cygresemibold leading-[19.2px]">{text}</Text>
        </View>
    </View>
}