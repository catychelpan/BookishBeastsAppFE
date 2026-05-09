import {
    TextInput,
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    RefreshControl,
    Keyboard,
    Platform,
    Pressable
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from '@expo/vector-icons';
import { images } from "../../constants";
import { useRef, useEffect, useState, useCallback } from "react";
import { GearsIcon } from "../../components/Svg";
import axios from "../../network/axios";
import { router } from "expo-router";
import ImageHandler from "../../components/ImageHandler";



const SearchBook = () => {

    const inputRef = useRef();

    const [text, setText] = useState('');

    const [data, setData] = useState([]);

    const [keyboardVisible, setKeyboardVisible] = useState(false);

    //can extract into separate hook
    useEffect(() => {
        // For iOS
        const keyboardWillShow = Keyboard.addListener(
            'keyboardWillShow',
            () => setKeyboardVisible(true)
        );
        const keyboardWillHide = Keyboard.addListener(
            'keyboardWillHide',
            () => setKeyboardVisible(false)
        );

        // For Android
        const keyboardDidShow = Keyboard.addListener(
            'keyboardDidShow',
            () => setKeyboardVisible(true)
        );
        const keyboardDidHide = Keyboard.addListener(
            'keyboardDidHide',
            () => setKeyboardVisible(false)
        );

        return () => {
        // Cleanup
        if (Platform.OS === 'ios') {
            keyboardWillShow.remove();
            keyboardWillHide.remove();
        } else {
            keyboardDidShow.remove();
            keyboardDidHide.remove();
        }
        };
    }, []);

    const [timeoutId, setTimeoutId] = useState(null);
    const delay = 500;


    const fetchBooks = async (searchText) => {
        try {
            const { data } = await axios.get(`/search/${searchText}?maxResult=10`);
            console.log("fired new")
            return data;
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    const handleInputTextChange = useCallback(async (newText) => {
        setText(newText);

        // Clear existing timeout
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        // Only make API call if text is not empty
        if (newText.trim()) {
            const newTimeoutId = setTimeout(async () => {
                const res = await fetchBooks(newText);
                if (res) {
                    setData(res.items);
                }
            }, delay);

            setTimeoutId(newTimeoutId);
        } else {
            setData([]); // Clear results if input is empty
        }
    }, [timeoutId, delay]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [timeoutId]);

    const handleCloseBtn = () => {
        setText('');
    }

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return <SafeAreaView className="bg-[#F7F7F7] h-full">
        <View className="max-h-[60px] justify-between items-center flex-row h-full mx-5 mb-5">
            <TouchableOpacity
                className="flex-1"
                onPress={() => router.back()}>
                <Image source={require('../../assets/images/left_arrow.png')} />
            </TouchableOpacity>
        </View>
        <View className="mx-5 max-h-[100px] mb-10">
            <Text className="text-[#2B2B2B] text-[24px] font-cygrebold leading-[28.8px] mb-5">Search a Book!</Text>
            <View className="bg-[#ffffff] mb-12 border border-[#6592E3] items-center max-h-[43px] h-full flex-row justify-between w-full rounded-[26px] px-5">
                <MaterialIcons name="search" color={'#6592E3'} size={22} />
                <TextInput
                    ref={inputRef}
                    value={text}
                    onChangeText={handleInputTextChange}
                    className="bg-[#ffffff] font-cygreregular justify-center items-center flex-1 pl-4 text-[#000000] leading-[16.8px] text-sm"
                    placeholder="Search a book"
                />
                <TouchableOpacity onPress={handleCloseBtn} className="rounded-full bg-[#000] p-1">
                    <MaterialIcons name='close' color={'#fff'} size={14} />
                </TouchableOpacity>
            </View>
        </View>

{/*             Probably should add some animated effects upon refreshing */}
        <View className="flex-1 mx-5 max-h-[80%]">
            <FlatList
                data={data}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={(bookItem) => <BookResult {...bookItem.item} key={bookItem.item.id} />}
                ListEmptyComponent={() => 
                    <View className="mt-12 items-center">
                        <Image source={images.searchBookImage} width={299} height={171} className="w-[299px] h-[171px]" resizeMode="contain" />
                    </View>
                }
                refreshControl={<RefreshControl onRefresh={() => console.log('refreshing')} refreshing={false} />}
            />
        </View>
            { !keyboardVisible && (
                <View className="justify-end max-h-[100px] mx-5">
                    <TouchableOpacity 
                        onPress={() => router.push('add-book')}
                        className="items-center relative p-5 mb-5 flex-row justify-between max-h-[93px] h-full w-full rounded-[15px] bg-[#1C1C1C]">
                        <View>
                            <Text className="text-[#FFFFFF] mb-1 text-[18px] font-cygrebold leading-[21.6px] font-bold">Haven’t found it?</Text>
                            <Text className="text-[#FFFFFF] font-cygreregular leading-[16.8px]">Add manually</Text>
                        </View>
                        <GearsIcon />
                    </TouchableOpacity>
                </View>
            ) }
    </SafeAreaView>
}


export default SearchBook;


const BookResult = ({ volumeInfo, id }) => {
    return <Pressable
            onPress={() => router.push({pathname: '/add-book', params: { id: id }})}
            className="max-w-[353px] p-3 w-full  mb-2 rounded-[15px] max-h-[132px] border-[.3px] bg-[#ffffff] border-[#727272] flex-row">
        <View className="max-w-[78px] max-h-[111px] mr-4">
            <ImageHandler source={volumeInfo.imageLinks?.smallThumbnail}
                width={78}
                height={111}
                resizeMode="contain"
                className="rounded-[6px]"
            />
{/*             <Image
                source={{ uri: volumeInfo.imageLinks?.smallThumbnail }}
                width={78}
                height={111}
                resizeMode="contain"
                className="rounded-[6px]"
            /> */}
        </View>
        <View>
            <Text className="text-black text-[18px] leading-[21.6px] font-cygrebold max-w-[216px]" numberOfLines={2} ellipsizeMode='tail'>{volumeInfo.title}</Text>
            <Text className="mb-5 text-black leading-[14.4px] font-cygreregular max-w-[85%]" numberOfLines={2} ellipsizeMode='tail'>{volumeInfo?.authors?.join(",")}</Text>
            { volumeInfo?.averageRating > 0 && (
                <View className="max-w-[56px] max-h-[21px] w-full h-full flex-row p-1 bg-[#6C97E4] rounded-[15px] justify-center items-center">
                    <MaterialIcons name="star" color={'#fff'} />
                    <Text className="leading-[14.4px] font-cygrebold text-[12px] text-[#ffffff]">{volumeInfo?.averageRating}</Text>
                </View>
            ) }
        </View>
    </Pressable>
}