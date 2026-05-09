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


const BookNotes = () => {

    const { name, id, byCollection } = useLocalSearchParams();

    const [bookNotes, setBookNotes] = useState([]);

    const handleEdit = (noteId) => {
        router.push({pathname: 'edit-note', params: { bookId: id, noteId }})
    }

    const handleDelete = async (noteId) => {
        try {
            await axios.delete(`books/${id}/note/${noteId}`);
            setBookNotes(prev => prev.filter(item => item.id !== noteId));
        } catch(error) {
            console.log(error);
        }
    }

    const fetchBookNotes = useCallback(async () => {
        try {
            const { data } = byCollection ? await axios.get(`users/note-collections/${id}/notes`)
            : await axios.get(`users/books/${id}/notes`);
            console.log(data);
            setBookNotes(data);
        }
        catch (error) {
            console.log(error);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchBookNotes();
        }, [fetchBookNotes])
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
            data={bookNotes}
            ListEmptyComponent={renderEmptyState}
            renderItem={({ item }) => <BookNote
                key={item.id}
                id={item.id}
                bookId={id}
                bookName={item.bookName}
                noteTypeName={item.noteTypeName} 
                noteTypeIcon={item.noteTypeIcon}
                noteTypeColor={item.noteTypeColor}
                date={item.date}
                text={item.text}
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



const BookNote = ({ 
        id,
        bookName,
        text,
        date,
        handleEdit,
        handleDelete,
        noteTypeColor,
        noteTypeName,
        noteTypeIcon,
        containerStyles 
    }) => {

    const handleCopy = async () => {
        await copyToClipboard(text);
    }


    const confirmDelete = () => {
        Alert.alert(
            "Delete Note",
            "Are you sure you want to delete this note? This action cannot be undone.",
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

    return <View className={`border-[.5px] border-[#8A8A8A] rounded-[20px] p-5 ${containerStyles}`}>
        <View className="flex-row">
            <View className="bg-black flex-row mr-2 rounded-[13px] px-3 py-1.5">
                <Feather name="book" size={18} color="white" />
                <Text className="text-sm leading-[16.8px] ml-1 text-white text-center">{bookName}</Text>
            </View>
            <View
                style={{backgroundColor: noteTypeColor}}
                className="flex-row rounded-[13px] px-3 py-1.5">
                <Text>{noteTypeIcon}</Text>
                <Text className="text-sm leading-[16.8px] ml-1 text-white text-center">{noteTypeName}</Text>
            </View>
        </View>
        <View className="mt-7">
            <Text className="text-black leading-[19.2px] font-cygreregular">{text}</Text>
        </View>
        <View className="justify-self-end flex-row justify-between mt-7">
            <View className="bg-[#EEEEEE] rounded-[31px] px-2.5 py-1.5 justify-center items-center">
                <Text className="text-sm text-black font-cygresemibold leading-[16.8px] text-center">{new Date(date)?.toLocaleDateString('de-DE') ?? '30.09.2024'}</Text>
            </View>
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
                <TouchableOpacity className="h-[34px] w-[34px] rounded-full bg-black items-center justify-center">
                    <MaterialIcons name="format-quote" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    </View>
}

export default BookNotes;