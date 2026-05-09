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



const SelectNotes = () => {

    const { id } = useLocalSearchParams();

    const { setQuote, quote } = useContext(UserContext);

    const getSelectedState = (id) => {
        return quote.notes.some(item => item.id === id);
    }

    const [searchText, setSearchText] = useState('');

    const handleSearchText = (text) => {
        setSearchText(text)
        fetchNotes(text)
    }

    //fetch from api
    const [notes, setNotes] = useState([
        {
            id: 1,
            text: 'Trying to solve a problem before being taught the solution leads to better learning, even when errors are made in the attempt.',
            book: 'Make It Stick',
            createdAt: '27.04.2021',
            selected: getSelectedState(1)
        },
        {
            id: 2,
            text: 'Interleaving is a learning technique where different topics, subjects, or problem types are mixed within a single study session rather than focusing on just one topic in a blocked fashion. ',
            book: 'Make It Stick',
            createdAt: '27.04.2021',
            selected: getSelectedState(2)
        },
        {
            id: 3,
            text: 'People who learn to extract the key ideas from new material and organize them into a mental model and connect that model to prior knowledge show an advantage in learning complex mastery. A mental model is a mental representation of some external reality.',
            book: 'Make It Stick',
            createdAt: '27.04.2021',
            selected: getSelectedState(3)
        },
    ]);

    const handleQuoteSelection = (selectedId) => {
        setNotes(prev => 
            prev.map(note => 
                note.id === selectedId
                    ? { ...note, selected: !note.selected }
                    : note
            )
        );
    };

    const fetchNotes = debounce(async (text) => {
        try {

            const queryParams = new URLSearchParams();
            if (text) {
                queryParams.append('searchText', text);
            }
            const { data } = await axios.get(`users/books/${id}/notes?${queryParams.toString()}`);
            const mappedNotes = data.map(item => ({
                id: item.id,
                text: item.text,
                book: item.bookName,
                createdAt: item.date,
                noteTypeName: item.noteTypeName,
                noteTypeColor: item.noteTypeColor,
                noteTypeIcon: item.noteTypeIcon,
                selected: getSelectedState(item.id)
            }));
            setNotes(mappedNotes);
            console.log(mappedNotes)
        } catch (error) {
            console.log(error);
        }
    }, 500);


    const handleSave = () => {
        const selectedNotes = notes.filter(item => item.selected === true);
        setQuote(prev => ({...prev, notes: selectedNotes}))
        router.back();
    }


    useEffect(() => {
        fetchNotes();
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
                    <TouchableOpacity
                        onPress={handleSave}
                        className="bg-primary rounded-[30px] flex-1 mt-2.5 max-w-[110px] w-full items-center justify-center max-h-[48px] h-full py-2 px-4">
                            <Text className="leading-[19.2px] text-[#fff] font-cygrebold">Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <KeyboardAvoidingView
                className="mx-5 max-h-[150px] flex-1"
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >

                <Text className="text-black mt-6 text-[22px] font-cygrebold leading-[26.4px] font-bold">Select notes to add</Text>
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
                    data={notes}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => <NoteCard
                        key={item.id}
                        book={item.book}
                        text={item.text}
                        createdAt={item.createdAt}
                        selected={item.selected}
                        onRadioButtonPress={() => handleQuoteSelection(item.id)}
                        containerStyles={'mb-4'} />}
                />
        </SafeAreaView>
    );
}





export default SelectNotes;



const NoteCard = ({ text, book, selected, createdAt, onRadioButtonPress, onDeleteButtonPress, showRadioButton = true, containerStyles }) => {

    return <View className={`border-[#8A8A8A] py-5 px-4 border-[.5px] rounded-[20px] ${containerStyles}`}>
        <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row">
                <View className="bg-primary px-4 py-1 rounded-[13px] flex-row items-center mr-2">
                    <MaterialIcons name="book" color={'white'} />
                    <Text className="text-[#FFFFFF] text-sm leading-[16.8px] ml-1">{book}</Text>
                </View>
                <View className="p-2 bg-[#EEEEEE] rounded-[13px] max-h-[40px] h-full items-center justify-center">
                    <Text className="text-sm text-black font-cygresemibold leading-[16.8px] text-center">{new Date(createdAt)?.toLocaleDateString('de-DE') ?? '30.09.2024'}</Text>
                </View>
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