import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    FlatList,
    Image
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useContext, useEffect } from "react";
import { router } from "expo-router";
import { UserContext } from "../../context/UserContext";
import axios from '../../network/axios'
import { useLocalSearchParams } from "expo-router";
import debounce from 'lodash/debounce';
import { images } from "../../constants";


const ViewNotes = () => {

    const { id } = useLocalSearchParams();

    const { quote } = useContext(UserContext);

    const [isLoading, setIsLoading] = useState(true);

    const getSelectedState = (id) => {
        return quote.notes.some(item => item.id === id);
    }

    const [searchText, setSearchText] = useState('');

    const handleSearchText = (text) => {
        setSearchText(text)
        fetchNotes(text)
    }

    //fetch from api
    const [notes, setNotes] = useState([]);

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
        } finally {
            setIsLoading(false);
        }
    }, 500);


    useEffect(() => {
        fetchNotes();
    }, []);

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
        return renderEmptyState();
  };

    const renderEmptyState = () => {
        return (
            <View className="flex-1 justify-center">
                <View className="items-center justify-end mb-10">
                    <Text className="text-[22px] mb-10 text-black leading-[26.4px] font-cygrebold">Can’t see anything here</Text>
                    <Image source={images.noteEyes} width={255} height={54} className="max-w-[255px] max-h-[54px]" />
                </View>
                <TouchableOpacity
                    className="mx-5 bg-black max-h-[106px] h-full flex-row justify-center items-center rounded-[20px]">
{/*                     <View
                        className="mx-7">
                        <Text className="font-cygresemibold leading-[19.2px] font-bold text-[#fff] max-w-[157px]">Add books to your library</Text>
                    </View>
                    <QuoteStarsIcon /> */}
                </TouchableOpacity>
            </View>
        );
    }

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

                <Text className="text-black mt-6 text-[22px] font-cygrebold leading-[26.4px] font-bold">All Notes</Text>
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
                    ListEmptyComponent={renderGifLoader}
                    keyExtractor={(item) => item.id.toString()}
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



const NoteCard = ({ text, book, onDeleteButtonPress, containerStyles }) => {

    return <View className={`border-[#8A8A8A] py-5 px-4 border-[.5px] rounded-[20px] ${containerStyles}`}>
        <View className="flex-row justify-between items-center mb-4">
            <View className="bg-primary px-4 py-1 rounded-[13px] flex-row items-center">
                <MaterialIcons name="book" color={'white'} />
                <Text className="text-[#FFFFFF] text-sm leading-[16.8px] ml-1">{book}</Text>
            </View>
            <TouchableOpacity
                onPress={onDeleteButtonPress}
                className="bg-black rounded-full p-2">
                <MaterialIcons name="delete" size={24} color="white" />
            </TouchableOpacity>
        </View>
        <View className="py-3 px-4 rounded-[8px] bg-[#EEEEEE] w-full">
            <Text className="text-black font-cygresemibold leading-[19.2px]">{text}</Text>
        </View>
    </View>
}


export default ViewNotes;