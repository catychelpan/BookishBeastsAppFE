import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { router, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImageHandler from '../../components/ImageHandler';
import { images } from '../../constants';
import axios from '../../network/axios';


const BooksFinished = () => {

    const { date } = useLocalSearchParams();

    const newDate = new Date(date);

    const formatted = newDate.toLocaleDateString('de-DE')

    const [events, setEvents] = useState([]);
    //console.log(date);

    const getReadEvents = async () => {
        try {
            const { data } = await axios.get(`users/read-events?day=${newDate.toISOString()}`);
            console.log(data);
            setEvents(data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getReadEvents();
    }, []);

    return <SafeAreaView className="flex-1 h-full bg-[#F7F7F7]">
        <View className="max-h-[60px] justify-between items-center flex-row h-full mx-5 mb-7">
            <View className="flex-row flex-1">
                <TouchableOpacity
                    className="mr-4"
                    onPress={() => router.back()}>
                    <MaterialIcons name="close" size={30} />
                </TouchableOpacity>
            </View>
        </View>

        <View className="px-5 items-center justify-center mb-8">
            <Text className="text-[22px] text-black font-cygrebold">{`Books finished on ${formatted}`}</Text>
        </View>
        <FlatList
            data={events}
            className="px-5"
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, _ }) => 
                <BookCard
                    key={item.id}
                    id={item.id}
                    bookImgSrc={item.imageUrl}
                    name={item.bookName}
                    rating={item?.rating}
                    memoImgSrc={item.imageId ? `${axios.defaults.baseURL}/users/memo/image/${item.imageId}` : null}
                /> }
        />
    </SafeAreaView>
}


const BookCard = ({ id, bookImgSrc, name, rating, memoImgSrc }) => {
    return <TouchableOpacity
        onPress={() => router.push({pathname: 'book-memory', params: { eventId: id }})}
        className="bg-[#fff] border-[.3px] border-[#8A8A8A] rounded-[20px] pl-4 py-3 flex-row mb-4">
                <Image source={{uri: bookImgSrc}} className="max-w-[82px] max-h-[118px]" width={82} height={118} resizeMode='contain' />
        <View className="flex-row ml-2">
            <View className="gap-y-2 justify-start">
                <Text className="text-[14px] font-cygrebold text-black">{name}</Text>
                <View className="rounded-[16px] flex-row self-start border-[#121F16] border-[1px] items-center justify-center px-1 py-1.5 gap-[2px] max-w-[54px] w-full">
                    <ImageHandler source={images.filledStar} className="w-[19px] h-[20px]" />
                    <Text className="font-cygrebold leading-[14.4px] text-[12px]">{rating}</Text>
                </View>
            </View>
        </View>
        
        { memoImgSrc ? (
            <View className="items-center justify-center flex-1">
                <ImageHandler source={memoImgSrc} className="rounded-full max-w-[80px] max-h-[80px]" width={80} height={80} resizeMode='cover' />
            </View>
        ) : <></> }
    </TouchableOpacity>
}



export default BooksFinished;