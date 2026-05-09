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
import { router } from "expo-router";
import { UserContext } from "../../context/UserContext";
import QuoteCard from "../../components/QuoteCard";
import axios from '../../network/axios';



const QuoteToConnect = () => {

    const [text, setText] = useState('')

    const handleInputTextChange = (text) => {
        setText(text);
    }

    const { setNote, note } = useContext(UserContext);

    //fetch from api
    const [quotes, setQuotes] = useState([
        {
            id: 1,
            text: 'Trying to solve a problem before being taught the solution leads to better learning, even when errors are made in the attempt.',
            book: 'Make It Stick',
            selected: true
        },
        {
            id: 2,
            text: 'Interleaving is a learning technique where different topics, subjects, or problem types are mixed within a single study session rather than focusing on just one topic in a blocked fashion. ',
            book: 'Make It Stick',
            selected: false
        },
        {
            id: 3,
            text: 'People who learn to extract the key ideas from new material and organize them into a mental model and connect that model to prior knowledge show an advantage in learning complex mastery. A mental model is a mental representation of some external reality.',
            book: 'Make It Stick',
            selected: false
        },
    ]);

    const handleQuoteSelection = (selectedId) => {
        setQuotes(prev => 
            prev.map(quote => 
                quote.id === selectedId
                    ? { ...quote, selected: true }
                    : { ...quote, selected: false }
            )
        );
    };

    const getQuoteSelectedState = (id) => {
        return note?.quote?.id === id;
    }

    const handleSave = () => {
        const selectedQuote = quotes.find(item => item.selected);
        setNote(prev => ({...prev, quote: selectedQuote}))
        router.back();
    }

    const fetchQuotes = async () => {
        try {
            const { data } = await axios.get('users/quotes');
            const mappedQuotes = data.map(item => ({
                id: item.id,
                text: item.text,
                book: item.bookName,
                selected: getQuoteSelectedState(item.id)
            }));
            setQuotes(mappedQuotes);
        } catch(error) {
            console.log(error);
        }
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

                <Text className="text-black mt-6 text-[22px] font-cygrebold leading-[26.4px] font-bold">Select quote to connect</Text>
                <View className="bg-[#ffffff] mt-5 mb-7 border-[.3px] border-[#727272] items-center max-h-[43px] h-full flex-row justify-between w-full rounded-[26px] px-5">
                    <MaterialIcons name="search" color={'#1C1C1C'} size={22} />
                    <TextInput
                        onChangeText={handleInputTextChange}
                        value={text}
                        className="bg-[#ffffff] font-cygreregular justify-center items-center flex-1 pl-4 text-[#000000] leading-[16.8px] text-sm"
                        placeholder="search"
                    />
                    <TouchableOpacity
                        onPress={() => handleInputTextChange('')}
                        className="rounded-full bg-[#000] p-1">
                        <MaterialIcons name='close' color={'#fff'} size={14} />
                    </TouchableOpacity>
                </View>
                </KeyboardAvoidingView>
                <FlatList
                    className="mx-5 flex-1"
                    data={quotes}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => <QuoteCard
                        book={item.book}
                        text={item.text}
                        selected={item.selected}
                        onRadioButtonPress={() => handleQuoteSelection(item.id)}
                        containerStyles={'mb-4'} />}
                />
        </SafeAreaView>
    );
}





export default QuoteToConnect;