import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import ImageHandler from '../../components/ImageHandler';
import { router, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '../../components/CustomButton';
import axios from '../../network/axios';
import { CalendarIcon } from '../../components/Svg';


const BookMemory = () => {

    const { eventId } = useLocalSearchParams();

    const [book, setBook] = useState({
        bookName: 'Make It Stick',
        author: 'Peter C. Brown, Mark A. McDaniel',
        imageUrl: '',
        startedAt: '25.09.2024',
        finishedAt: '30.09.2024',
        memo: 'This was an exciting journey, have boost my memory. Will re-read soon. Hope this time will remember more ',
        rating: '4',
        imageId: ''
    });

    //const [event, setEvent] = useState({});
    //console.log(date);

    const getReadEvent = async () => {
        try {
            const { data } = await axios.get(`users/read-event/${eventId}`);
            console.log(data);
            setBook(data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getReadEvent();
    }, []);

    return <SafeAreaView className="flex-1 h-full bg-[#F7F7F7]">
        <View className="max-h-[60px] justify-start items-center flex-row h-full mx-5 mb-7">
            <View className="flex-row">
                <TouchableOpacity
                    className="mr-5"
                    onPress={() => router.back()}>
                    <MaterialIcons name="close" size={30} />
                </TouchableOpacity>
            </View>
            <Text
                className="font-cygrebold text-[#1C1C1C] text-[22px] px-5 leading-[26.4px]">Memory: {book.bookName}</Text>
        </View>
        <ScrollView>
        <View className="mx-5 border-[#8A8A8A] flex-row p-4 border-[.5px] rounded-[20px] max-w-[353px] mb-7">
            <ImageHandler source={book.imageUrl} width={114} height={163} className="max-h-[163px] max-w-[114px] mr-5" />
            <View className="relative flex-1">
                <Text className="text-black text-[18px] mb-0.5 leading-[21.6px] font-cygrebold max-w-[150px]"
                    numberOfLines={1}
                    ellipsizeMode='tail'>
                        {book.bookName}
                </Text>
                <Text
                    className="text-black text-[12px] leading-[14.4px] font-cygreregular mb-5 max-w-[150px]"
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {book.author}
                </Text>
                <View className="bg-[#1C1C1C] rounded-[13px] items-center justify-center self-start my-3">
                    <Text className="font-cygrebold text-[12px] leading-[14.4px] text-white py-1 px-3">{`${book.startedAt ?? ''} - ${book.finishedAt}`}</Text>
                </View>
                <View className="justify-end flex-">
                    <PrimaryButton
                        title={'Read Again'}
                        containerStyles={'rounded-[30px] items-center justify-center max-h-[48px]'}
                        textStyles={'font-cygrebold text-[18px] leading-[21.6px]'}/>
                </View>
            </View>
        </View>

        <View className="mx-5 border-[#8A8A8A] items-center justify-center p-4 border-[.5px] rounded-[20px] max-w-[353px] mb-7">
            { book.imageId ? (
                <ImageHandler source={book.imageId ? `${axios.defaults.baseURL}/users/memo/image/${book.imageId}` : ''}
                    className="my-6 rounded-full"
                    resizeMode='cover'
                    width={242} height={242}
                />
            ) : <></> }
            <Text className="text-[14px] text-black font-cygreregular">{book?.memo}</Text>
        </View>
        <TouchableOpacity className="bg-black px-8 flex-row justify-between my-6 items-center mx-5 rounded-[20px] max-h-[106px] py-4">
            <Text className=" font-cygrebold max-w-[98px] text-white">Share your achievement with others!</Text>
            <CalendarIcon />
        </TouchableOpacity>
        </ScrollView>
    </SafeAreaView>
}



export default BookMemory;