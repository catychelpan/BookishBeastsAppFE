import { useLocalSearchParams } from "expo-router";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Entypo from '@expo/vector-icons/Entypo';
import { useMemo, useState, useEffect, useRef } from "react";
import { MaterialIcons } from '@expo/vector-icons';
import { router } from "expo-router";
import CardSwipe from "../../components/CardSwipe";
import axios from '../../network/axios'
import AntDesign from '@expo/vector-icons/AntDesign';



const Revise = () => {
    const { groupName, groupId } = useLocalSearchParams();

    const [toRevise, setToRevise] = useState(0);
    const [toRem, setToRem] = useState(0);
    const [unansweredCards, setUnansweredCards] = useState([]);
    const [currentCard, setCurrentCard] = useState(null);
    const [totalCards, setTotalCards] = useState(0);
    const [allCards, setAllCards] = useState([]); // Store all card data

    // Calculate progress based on remembered cards
    const progress = totalCards > 0 ? (toRem / totalCards) * 100 : 0;

    const countRef = useRef(0);

    const handleSwipeLeft = () => {
        if (currentCard === null) return;

        // Track that this card needs revision (only once per card)
        const cardData = allCards[currentCard];
        if (!cardData.revised) {
            setToRevise(prev => prev + 1);
            setAllCards(prev => {
                const updated = [...prev];
                updated[currentCard] = { ...updated[currentCard], revised: true };
                return updated;
            });
        }

        // Move to next card without removing current card from unanswered list
        setUnansweredCards((prevUnansweredCards) => {
            const currentIndex = prevUnansweredCards.indexOf(currentCard);
            const nextIndex = currentIndex === prevUnansweredCards.length - 1 ? 0 : currentIndex + 1;
            setCurrentCard(prevUnansweredCards[nextIndex]);
            return prevUnansweredCards;
        });
    };

    const handleSwipeRight = () => {
        if (currentCard === null) return;
        
        setToRem(prev => prev + 1);
        countRef.current += 1;

        // If this card was previously marked for revision, decrement the counter
        const cardData = allCards[currentCard];
        if (cardData.revised) {
            setToRevise(prev => Math.max(0, prev - 1));
        }

        // Remove card from unanswered list
        setUnansweredCards((prevUnansweredCards) => {
            let updatedUnansweredCards = [...prevUnansweredCards];
            const currentIndex = updatedUnansweredCards.indexOf(currentCard);
            
            // Remove the current card
            updatedUnansweredCards.splice(currentIndex, 1);
            
            if (updatedUnansweredCards.length === 0) {
                // All cards completed!
                setTimeout(() => {
                    router.replace({ 
                        pathname: 'repetition-group-success', 
                        params: { 
                            scorred: countRef.current, 
                            total: totalCards
                        } 
                    });
                }, 300);
            } else {
                // Set next card (adjust index if we removed the last card)
                const nextIndex = currentIndex === updatedUnansweredCards.length ? 0 : currentIndex;
                setCurrentCard(updatedUnansweredCards[nextIndex]);
            }
            
            return updatedUnansweredCards;
        });
    };

    const fetchGroupNotesAndQuotes = async () => {
        try {
            const { data } = await axios.get(`users/repetition-group/${groupId}`);
            
            const formattedCards = data.map(item => ({
                id: item.id,
                title: item.bookName,
                description: item.text,
                revised: false
            }));
            
            // Create array of indices [0, 1, 2, ...]
            const indices = Array.from({ length: formattedCards.length }, (_, i) => i);
            
            setTotalCards(formattedCards.length);
            setAllCards(formattedCards);
            setUnansweredCards(indices);
            setCurrentCard(indices[0]);
        } catch(error) {
            console.log(error);
        }
    };

    const handleQuit = () => {
        Alert.alert(
            "Are you sure",
            "Do you really want to leave without finishing the repetition?",
            [
                {
                    text: "Continue",
                    style: "default"
                },
                { 
                    text: "Leave", 
                    onPress: () => router.back(),
                    style: "destructive"
                }
            ]
        );
    };

    const shuffleCards = () => {
        setUnansweredCards(prev => {
            const shuffled = [...prev].sort(() => Math.random() - 0.5);
            setCurrentCard(shuffled[0] !== undefined ? shuffled[0] : null);
            return shuffled;
        });
    };

    useEffect(() => {
        fetchGroupNotesAndQuotes();
    }, []);


    const currentCardData = currentCard !== null ? allCards[currentCard] : { title: '', description: '' };

    return (
        <SafeAreaView className="bg-[#F7F7F7] h-full">
            <View className="max-h-[60px] justify-between items-center flex-row h-full mx-5 mb-4">
                <View className="flex-row items-center mt-2">
                    <TouchableOpacity
                        onPress={handleQuit}
                        className="mr-3 max-w-[44px] w-full items-center justify-center rounded-[10px]">
                        <MaterialIcons name="close" size={24} color="black" />
                    </TouchableOpacity>
                    <Text
                        className="text-black font-cygrebold  max-w-[80%] text-[22px] font-bold"
                        numberOfLines={1}
                        ellipsizeMode="tail">{groupName}</Text>
                </View>
                <TouchableOpacity
                    onPress={shuffleCards}
                    className="bg-primary rounded-[10px] flex-1 mt-2.5 max-w-[44px] items-center justify-center max-h-[44px] h-full">
                    <Entypo name="shuffle" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <View className="bg-[#D8E6FF] rounded-[13px] h-[7px] relative w-full">
                <View className='absolute bg-[#6592E3] h-full rounded-[13px]' style={{ width: `${progress}%` }}></View>
            </View>

            <View className="items-center mb-12">
                <Text className="text-[#646464] text-[14px] font-cygreregular">
                    {`${toRem} / ${totalCards}`}
                </Text>
            </View>

            <View className="justify-between w-full flex-row mb-12">
                <View className="max-w-[62px] max-h-[43px] rounded-r-[9px] bg-[#FFBBAB] w-full h-full py-2 items-center justify-center">
                    <Text className="text-white text-[18px] text-center">{toRevise}</Text>
                </View>
                <View className="max-w-[62px] max-h-[43px] rounded-l-[9px] bg-teal-600/40 w-full h-full py-2 items-center justify-center">
                    <Text className="text-white text-[18px] text-center">{toRem}</Text>
                </View>
            </View>

            <View className="items-center flex-1">
                <CardSwipe 
                    data={currentCardData}
                    onSwipeLeft={handleSwipeLeft}
                    onSwipeRight={handleSwipeRight} 
                />
            </View>
        </SafeAreaView>
    );
};

export default Revise;