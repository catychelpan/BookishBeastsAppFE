import {
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import { MaterialIcons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import { useState, useCallback } from "react";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import axios from '../../network/axios';
import Feather from '@expo/vector-icons/Feather';
import * as Clipboard from 'expo-clipboard';


const copyToClipboard = async (text) => {
  await Clipboard.setStringAsync(text);
};


const BookQuotes = () => {

    const { name, bookId, collectionId, byCollection } = useLocalSearchParams();

    const [bookQuotes, setBookQuotes] = useState([]);


    const handleEdit = (quoteId) => {
        router.push({pathname: 'edit-quote', params: { bookId: bookId, quoteId }})
    }

    const handleDelete = async (quoteId) => {
        try {
            await axios.delete(`books/${bookId}/quote/${quoteId}`);
            setBookQuotes(prev => prev.filter(item => item.id !== quoteId));
        } catch(error) {
            console.log(error);
        }
    }

    const fetchBookQuotes = useCallback(async () => {
        try {
            const { data } = byCollection ? await axios.get(`users/quote-collections/${collectionId}/quotes`)
            : await axios.get(`users/books/${bookId}/quotes`);
            setBookQuotes(data);
        }
        catch (error) {
            console.log(error);
        }
    }, [])

    useFocusEffect(
        useCallback(() => {
            fetchBookQuotes();
        }, [fetchBookQuotes])
    );
    
    return <SafeAreaView className="bg-[#F7F7F7] h-full flex-1">
        <View className="max-h-[60px] justify-between items-center flex-row h-full mx-5 mb-7">
            <View className="flex-row flex-1">
                <TouchableOpacity
                    className="mr-4"
                    onPress={() => router.back()}>
                    <Image source={images.leftArrowIcon} />
                </TouchableOpacity>
                <Text className="text-[24px] flex-1 leading-[28.8px] font-cygrebold text-black">{name}</Text>
            </View>

            <TouchableOpacity
                className="bg-primary relative flex-1 mt-2.5 mr-2.5 max-w-[44px] w-full items-center justify-center max-h-[44px] h-full rounded-[10px]">
                    <Entypo name="magnifying-glass" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
                className="bg-primary flex-1 mt-2.5 max-w-[44px] w-full items-center justify-center max-h-[44px] h-full rounded-[10px]">
                    <Entypo name="dots-three-vertical" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
        <FlatList
            className="mx-5 mt-7 flex-1"
            maxToRenderPerBatch={10}
            data={bookQuotes}
            ListEmptyComponent={renderEmptyState}
            renderItem={({ item }) => <BookQuote
                key={item.id}
                id={item.id}
                bookId={bookId}
                bookName={item.bookName}
                text={item.text}
                noteCount={item.noteCount}
                containerStyles={'mb-5'}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />}
        />
    </SafeAreaView>
}

const renderEmptyState = () => {
    return (
        <View className="items-center justify-end flex-1">
            <Text className="text-[22px] mb-10 text-black leading-[26.4px] font-cygrebold">Can’t see anything here</Text>
            <Image source={images.noteEyes} width={255} height={54} className="max-w-[255px] max-h-[54px]" />
        </View>
    );
}



const BookQuote = ({ id, bookName, text, noteCount, handleEdit, handleDelete, containerStyles }) => {

    const handleCopy = async () => {
        await copyToClipboard(text);
    }


    const confirmDelete = () => {
        Alert.alert(
            "Delete Quote",
            "Are you sure you want to delete this quote? This action cannot be undone.",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                { 
                    text: "Delete", 
                    onPress: async () => {
                        await handleDelete(id);
                    },
                    style: "destructive" // This will make it red on iOS
                }
            ]
        );
    }

    const renderNoteCount = () => {
        return noteCount === 1 ? `${noteCount} note` : `${noteCount} notes`
    }

    return <View className={`border-[.5px] border-[#8A8A8A] rounded-[20px] p-5 ${containerStyles}`}>
        <View className="flex-row justify-between items-center">
            <View className="bg-black flex-row mr-2 rounded-[13px] px-3 py-1.5">
                <Feather name="book" size={18} color="white" />
                <Text className="text-sm leading-[16.8px] ml-1 text-white text-center">{bookName}</Text>
            </View>
            <View
                className="flex-row px-3 py-1.5">
                <Text className="text-sm leading-[16.8px] ml-1 text-black text-center">{renderNoteCount()}</Text>
            </View>
        </View>
        <View className="mt-7">
            <Text className="text-black leading-[19.2px] font-cygreregular">{text}</Text>
        </View>
        <View className="justify-self-end flex-row justify-between mt-7">
            <View className="flex-row gap-2">
                <TouchableOpacity
                    onPress={confirmDelete}
                    className="h-[34px] w-[34px] rounded-full bg-black items-center justify-center">
                    <MaterialIcons name="delete" size={15} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleCopy}
                    className="h-[34px] w-[34px] rounded-full bg-black items-center justify-center">
                    <MaterialIcons name="content-copy" size={15} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleEdit(id)}
                    className="h-[34px] w-[34px] rounded-full bg-black items-center justify-center">
                    <MaterialIcons name="edit-note" size={20} color={'#fff'} />
                </TouchableOpacity>
            </View>
            <TouchableOpacity className="bg-primary rounded-[30px] items-center justify-center px-2.5 py-1.5">
                <Text className="text-sm text-[#fff] font-cygrebold leading-[16.8px]">Add Note</Text>
            </TouchableOpacity>
        </View>
    </View>
}

export default BookQuotes;