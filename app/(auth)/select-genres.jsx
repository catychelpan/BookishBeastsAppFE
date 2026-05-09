import {
    TextInput,
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from '@expo/vector-icons';
import { useContext, useEffect, useState, useCallback } from "react";
import { UserContext } from "../../context/UserContext";
import { images } from "../../constants";
import { router } from "expo-router";
import axios from "../../network/axios";
import SelectGenre from "../../components/SelectGenre";



const SelectGenres = () => {

    const { genres, setGenres, book, setBook } = useContext(UserContext);

    //[{ id: int, item: string}]
    const [fetchedGenres, setFetchedGenres] = useState([]);

    const [genresText, setGenresText] = useState('');

    const handleOnPress = (name) => {
        setGenres(prev => ({...prev, [name]: !prev[name]}))
    }

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get('categories');
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    const getKeysWithTrueValue = obj => Object.entries(obj)
        .filter(([_, value]) => value === true)
        .map(([key]) => key);


    useEffect(() => {
        fetchCategories()
        .then(data => {
            const existingCategories = book.volumeInfo.categories;

            const genreObj = Object.fromEntries(data.map(({ item }) =>
                [item, existingCategories.includes(item) ? true : genres[item]]));

            const categories = getKeysWithTrueValue(genreObj);

            setGenres(genreObj);

            setBook(prev => ({...prev, volumeInfo: {
                ...prev.volumeInfo,
                categories: categories
            } }));

            setFetchedGenres(data.map(item => item.item));
        });
    }, []);

    const [timeoutId, setTimeoutId] = useState(null);

    const delay = 500;

    useEffect(() => {
        const categories = getKeysWithTrueValue(genres);
        setBook(prev => ({...prev, volumeInfo: {
            ...prev.volumeInfo,
            categories: categories
        } }));
    }, [genres])

    const handleInputTextChange = useCallback(async (newText) => {
        setGenresText(newText);

        // Clear existing timeout
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        // Only make API call if text is not empty
        if (newText.trim()) {
            const newTimeoutId = setTimeout(async () => {
                const filteredCategories = fetchedGenres
                    .filter(item => item.includes(newText) || newText.includes(item));
                
                    setFetchedGenres(filteredCategories)
            }, delay);

            setTimeoutId(newTimeoutId);
        } else if (!newText)  {
            fetchCategories()
            .then(data => setFetchedGenres(data.map(item => item.item)));
        }
    }, [timeoutId, delay]);

    useEffect(() => {
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [timeoutId]);

    const handleSaveSelectedGenres = () => {
        router.back();
    }

    return (
        <SafeAreaView className="bg-[#F7F7F7] h-full">
            <View className="max-h-[60px] justify-between items-center flex-row h-full mx-5">

                <TouchableOpacity className="flex-1" onPress={() => router.back()}>
                    <Image source={images.leftArrowIcon} />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleSaveSelectedGenres}
                    className="bg-primary self-end mt-2 max-w-[110px] w-full items-center justify-center max-h-[48px] h-full rounded-[30px]">
                    <Text className="text-[#FEFEFC] text-[18px] leading-[22px] font-semibold">Save</Text>
                </TouchableOpacity>
            </View>


            <View className="mx-5 max-h-[150px]">
                <Text className="text-black mt-6 text-[24px] font-cygrebold leading-[28.8px] font-bold">Select genres</Text>
                <View className="bg-[#ffffff] mt-5 mb-7 border-[.3px] border-[#727272] items-center max-h-[43px] h-full flex-row justify-between w-full rounded-[26px] px-5">
                    <MaterialIcons name="search" color={'#1C1C1C'} size={22} />
                    <TextInput
                        onChangeText={handleInputTextChange}
                        value={genresText}
                        className="bg-[#ffffff] font-cygreregular justify-center items-center flex-1 pl-4 text-[#000000] leading-[16.8px] text-sm"
                        placeholder="Search a genre"
                    />
                    <TouchableOpacity
                        onPress={() => handleInputTextChange('')}
                        className="rounded-full bg-[#000] p-1">
                        <MaterialIcons name='close' color={'#fff'} size={14} />
                    </TouchableOpacity>
                </View>

            </View>
            <FlatList
                showsVerticalScrollIndicator={false}
                className="mx-5"
                data={fetchedGenres}
                renderItem={({ item }) => <SelectGenre
                    key={item}
                    selected={genres[item]}
                    text={item}
                    onPress={() => handleOnPress(item)}
                    containerStyles={'mb-3.5'}
                />}
            />
{/*                  {fetchedGenres?.map(item => (
                    <Genre
                        key={item}
                        selected={genres[item]}
                        text={item}
                        onPress={() => handleOnPress(item)}
                        containerStyles={'mb-2.5'}
                    />))
                } */}
                

{/*                 <Genre
                    selected={genres["adventures"]}
                    text={'Adventure'} 
                    onPress={() => handleOnPress("adventures")}
                    containerStyles={'mb-2.5'}
                />
                <Genre
                    selected={genres["art"]}
                    text={'Art'} 
                    onPress={() => handleOnPress("art")}
                    containerStyles={'mb-2.5'}
                />
                <Genre
                    selected={genres["business"]}
                    text={'Business'} 
                    onPress={() => handleOnPress("business")}
                    containerStyles={'mb-2.5'}
                />
                <Genre
                    selected={genres["contemporary"]}
                    text={'Contemporary'} 
                    onPress={() => handleOnPress("contemporary")}
                    containerStyles={'mb-2.5'}
                />
                <Genre
                    selected={genres["crime"]}
                    text={'Crime'}
                    onPress={() => handleOnPress("crime")}
                    containerStyles={'mb-2.5'}
                />
                <Genre
                    selected={genres["drama"]}
                    text={'Drama'}
                    onPress={() => handleOnPress("drama")}
                    containerStyles={'mb-2.5'}
                />
                <Genre
                    selected={genres["history"]}
                    text={'History'} 
                    onPress={() => handleOnPress("history")}
                    containerStyles={'mb-2.5'}
                />
                <Genre
                    selected={genres["horror"]}
                    text={'Horror'} 
                    onPress={() => handleOnPress("horror")}
                    containerStyles={'mb-2.5'}
                />
                <Genre
                    selected={genres["nonFiction"]}
                    text={'Non-fiction'}
                    onPress={() => handleOnPress("nonFiction")}
                    containerStyles={'mb-2.5'}
                />
                <Genre
                    selected={genres["psychology"]}
                    text={'Psychology'} 
                    onPress={() => handleOnPress("psychology")}
                    containerStyles={'mb-10'}
                /> */}

        </SafeAreaView>
    );
}

export default SelectGenres;


