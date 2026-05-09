import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text,Image, TouchableOpacity, FlatList } from "react-native";
import { useContext, useEffect, useState } from "react";
import { router } from "expo-router";
import OnboardingProgress from "../../components/OnboardingProgress";
import { StatusBar } from 'expo-status-bar';
import { images } from "../../constants";
import axios from '../../network/axios';
import { UserContext } from "../../context/UserContext";


const BooksInterested = () => {

    const [books, setBooks] = useState([]);
    const [chosenBooks, setChosenBooks] = useState([]);

    const { setOnboardingState } = useContext(UserContext);

    const fetchBooks = async () => {
        try {
            const { data } = await axios.get('books/interested-books');
            setBooks(data)
            console.log(data)
        } catch(error) {
            console.log(error);
        }
    }

    const handleCaptureState = (id) => {
        if (chosenBooks.some(a => a === id)) {
            setChosenBooks(prev => prev.filter(a => a !== id))
        } else {
            setChosenBooks(prev => [...prev, id])
        }
    }

    const handleContinue = () => {
        setOnboardingState(prev => ({...prev, booksSelected: chosenBooks}))
        router.push('/reason-for-reading');
    }

    useEffect(() => {
        fetchBooks();
    }, []);

    return <SafeAreaView className="bg-[#F7F7F7] h-full">
            <View className="w-full px-[20px] mt-[20px]">
                <OnboardingProgress stage1={100} stage2={70} />
            </View>
            <View className="w-full mt-[65px] mb-[47px] items-center">
                <Text className="font-bold text-[#000000] max-w-[349px] text-[24px] text-center leading-[28px] px-[40px] font-cygrebold">
                    Choose the books that seem interesting:
                </Text>
            </View>
            <FlatList
                className="flex-[3]"
                data={books}
                numColumns={3}
                initialNumToRender={15}
                keyExtractor={(item) => item.id}
                columnWrapperStyle={{justifyContent: 'center'}}
                showsVerticalScrollIndicator={true}
                renderItem={({ item }) => (
                    <BookImage
                        handleCapture={handleCaptureState}
                        src={item.imageUrl}
                        id={item.id}
                        isSelected={chosenBooks.some(a => a === item.id)}/>
                )}
            />
            <View className="w-full flex-[1.5] justify-center items-center">
                <TouchableOpacity
                    onPress={handleContinue}
                    className="bg-[#6592E3] max-w-[313px] w-full self-center mb-[11px] items-center justify-center max-h-[52px] h-full rounded-[47px]">
                    <Text className="text-[#FEFEFC] text-[18px] leading-[22px] font-semibold">Continue</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push('/reason-for-reading')}
                    className="border border-[#000000] self-center bg-transparent items-center justify-center max-w-[313px] w-full max-h-[52px] h-full rounded-[47px]">
                    <Text className="text-[#000000] text-[18px] leading-[22px] font-semibold">Skip For Now</Text>
                </TouchableOpacity>
            </View>
            <StatusBar backgroundColor='#F7F7F7' style='dark' />
    </SafeAreaView>
};


const BookImage = ({ src, styles, id, handleCapture, isSelected }) => {

    return <TouchableOpacity
            activeOpacity={.7}
            onPress={() => {
                handleCapture(id)
            }}
            className={`max-w-[111px] m-2 max-h-[149px] relative ${styles}`}>
            { isSelected ? 
                ( <View className="h-full w-full bg-[#00000080] absolute opacity-50 z-20 rounded-[10px]"></View> )
                : <></>
            }
            <Image source={images.bookSelected}
                className={`absolute h-full w-full max-w-[70px] max-h-[70px] left-[18%] top-[25%] ${isSelected ? 'z-20' : ''}`} />
            <View className="w-full h-full">
                <Image
                    source={{ uri: src }}
                    style={{ width: 200, height: 200 }}
                    className="rounded-[10px] z-10 max-h-[149px] max-w-[111px]"
                    resizeMethod="cover"
                />
            </View>
        </TouchableOpacity>
};


export default BooksInterested;