import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState, useCallback } from "react";
import { router } from "expo-router";
import axios from '../../network/axios';
import ImageHandler from "../../components/ImageHandler";
import { images } from "../../constants";

const YearlyGoals = () => {

    const [isEditing, setIsEditing] = useState(false);

    const [goalState, setGoalState] = useState({
        booksReadWithinCurrentYear: [],
        booksGoalAmount: 0,
        booksReadSoFar: 0
    });

    const [goalLocalState, setGoalLocalState] = useState(0);

    const [years, setYears] = useState([2025, 2024, 2023]);

    const [currentYear, setCurrentYear] = useState(2025);

    const [isLoading, setIsLoading] = useState(true);

    const fetchUserGoalState = useCallback(async () => {
        try {
            const { data } = await axios.get('users/goals/state?year=' + currentYear);
            setGoalState(prev => ({...prev, 
                //pagesGoal: data?.pagesGoal,
                booksGoalAmount: data?.booksGoal,
                //timeGoal: data?.timeGoalInMinutes,
                booksReadSoFar: data?.currentAmountBooksGoal,
                //currentAmountInMinutes: data?.currentAmountInMinutes,
                booksReadWithinCurrentYear: data?.booksReadWithinCurrentYear
            }));
            setGoalLocalState(data?.booksGoal)
            //console.log('Goal state', data)
        } catch(error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    },[]);

    const fetchYearsStatistics = async () => {
        try {
            const { data } = await axios.get('users/goals/years');
            setYears(data);
        } catch(error) {
            console.log(error);
        }
    }

    const handleAddCounter = () => {
        setGoalLocalState(a => a + 1)
    }
    const handleReduceCounter = () => {
        setGoalLocalState(a => a - 1)
    }

    const handleGoalStateSave = async () => {
        try {
            await axios.post('users/goals/books-amount', { amount: goalLocalState });
            setGoalState(state => ({...state, booksGoalAmount: goalLocalState}));
            setIsEditing(false);
        } catch(error) {
            console.log(error);
        }
    }

    const renderGifLoader = () => {
        if (isLoading) {
            return (
                <View className="items-center justify-center">
                <ImageHandler
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
                    <ImageHandler source={images.noteEyes} width={255} height={54} className="max-w-[255px] max-h-[54px]" />
                </View>
                <Text className="text-center text-[22px] font-cygrebold">No finished books yet</Text>
            </View>
        );
    }

    const handleAddBookRedirect = () => router.push('search-book');

    const formatDate = (dotNetDateTime) => {
        const date = new Date(dotNetDateTime);
        
        const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
        const day = date.getUTCDate();
        
        return `${month} ${day}`;
    };

    useEffect(() => {
        fetchYearsStatistics();
        fetchUserGoalState();
    }, []);

    const progressPercent = goalState.booksReadSoFar / goalState.booksGoalAmount * 100;

    return (
        <SafeAreaView className="bg-[#F7F7F7] flex-1">
            <View className="max-h-[50px] justify-between items-center flex-row h-full mx-5 mb-7">
                <View className="flex-row items-center justify-center mt-2">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="flex-1 mr-2 max-w-[44px] w-full items-center justify-center rounded-[10px]">
                            <MaterialIcons name="close" size={24} color="black" />
                    </TouchableOpacity>
                    <Text className="text-black font-cygrebold text-[22px] font-bold">Yearly Goals</Text>
                </View>
                { isEditing ? (
                <TouchableOpacity
                    onPress={async () => await handleGoalStateSave()}
                    className="bg-primary rounded-[30px] text-[18px] flex-1 mt-2.5 max-w-[110px] w-full items-center justify-center max-h-[48px] h-full py-2 px-4">
                        <Text className="leading-[19.2px] text-[#fff] font-cygrebold text-center">Save</Text>
                </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        onPress={() => setIsEditing(true)}
                        className="bg-primary rounded-[10px] max-w-[44px] flex-1 mt-2.5 items-center justify-center max-h-[48px] h-full">
                            <MaterialIcons name="edit-note" size={27} color={'#fff'} />
                    </TouchableOpacity>
                ) }
            </View>
            <FlatList
                horizontal
                className="mx-5 mb-3 max-h-[50px]"
                data={years}
                renderItem={({ item }) => {
                    return <TouchableOpacity
                                key={ item }
                                onPress={() => setCurrentYear(item)}
                                style={{ backgroundColor: item === currentYear ? '#6592E3' : '#E8E8E9' }}
                                className={`rounded-[20px] w-[103px] h-[33px] mr-2.5 items-center justify-center`}>
                        <Text className={`font-cygrebold ${item === currentYear ? 'text-white' : 'text-[#1C1C1C]'} text-sm`}>{item}</Text>
                    </TouchableOpacity>
                }}
            />

            { isEditing ? (
                <View className="bg-[#1C1C1C] p-5 rounded-[20px] mx-5 mb-7">
                    <Text className="font-cygreregular text-white mb-5">{`${currentYear} Reading Goal`}</Text>
                    <View className="flex-row justify-between items-center">
                        <TouchableOpacity
                            onPress={handleReduceCounter}
                            className="rounded-full bg-[#8A8A8A] items-center justify-center h-[43px] w-[43px]">
                            <Text className="text-[#FFFFFF] text-[31px] font-semibold leading-[37.5px]">-</Text>
                        </TouchableOpacity>
                        <Text className="text-[#fff] text-center text-[34px] font-cygrebold leading-[72px]">{`${goalLocalState} books`}</Text>
                        <TouchableOpacity
                            onPress={handleAddCounter}
                            className="rounded-full bg-primary items-center justify-center h-[43px] w-[43px]">
                            <Text className="text-[#FFFFFF] text-[31px] font-semibold leading-[37.5px]">+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <View className="border border-[#8A8A8A] bg-[#1C1C1C] mb-7 rounded-[20px] mx-5 pt-5">
                    <Text className="text-white font-cygreregular pl-7">{`${currentYear} Reading Goal`}</Text>
                    <Text className="text-white font-cygrebold text-[34px] mb-4 pl-7">
                        {`${goalState.booksReadSoFar} of ${goalState.booksGoalAmount} books`}
                    </Text>
                    <View className="bg-[#D8E6FF] rounded-[13px] h-[12px] max-w-[85%] ml-7 relative w-full mb-5">
                        <View className='absolute bg-[#6592E3] h-full rounded-[13px]' style={{ width: `${progressPercent}%` }}></View>
                    </View>
                </View>
            ) }

            <FlatList
                contentContainerStyle={{paddingBottom:20}}
                className="mx-5"
                data={goalState.booksReadWithinCurrentYear} 
                ItemSeparatorComponent={<View className="h-[10px]"></View>}
                ListEmptyComponent={renderGifLoader()}
                renderItem={({ item }) => (
                    <BookProgressCard
                        key={item.id}
                        name={item.title}
                        imageUrl={item.imageUrl}
                        titleColor={item?.cover?.titleColor}
                        backgroundColor={item?.cover?.backgroundColor}
                        author={item.author}
                        date={formatDate(item?.finishedAt)}
                    />
                )}
            />
        </SafeAreaView>
    );
}

const BookProgressCard = ({ name, author, imageUrl, titleColor, backgroundColor, date, containerStyles }) => {
    return <TouchableOpacity
                className={`h-[172px] w-full flex-row border border-[#727272] px-3 py-3 rounded-[15px] ${containerStyles}`}>
                    { imageUrl ? (
                        <ImageHandler
                            source={imageUrl}
                            className="max-w-[99px] max-h-[141px] w-full h-full mr-4"
                            width={99}
                            height={141}
                        />
                    ) : (
                        <BookPlaceHolder
                            title={name}
                            author={author}
                            titleColor={titleColor}
                            backgroundColor={backgroundColor}
                        />
                    ) }
                <View className="w-full justify-between flex-1">
                    <View>
                        <Text className="text-black text-[18px] font-cygrebold leading-[21.6px] max-w-[200px]" numberOfLines={1} ellipsizeMode='tail'>{name}</Text>
                        <Text className="text-black text-sm font-cygreregular leading-[16.8px] max-w-[210px]">{author}</Text>
                    </View>
                    <View className="items-start mb-2">
                        <View className="bg-[#1C1C1C] rounded-[15px] py-1 px-2.5">
                            <Text className="font-cygrebold text-white text-[12px]">{date}</Text>
                        </View>
                    </View>
                </View>
    </TouchableOpacity>
}


const BookPlaceHolder = ({ title, author, titleColor, backgroundColor }) => {
    
    return (
        <View style={[styles.container, { backgroundColor: backgroundColor }]}>
            <View style={[styles.titleContainer, { backgroundColor: titleColor }]}>
                <Text style={[styles.titleText, { color: backgroundColor }]}>{title}</Text>
            </View>
            <View style={[styles.authorContainer]}>
                <Text style={[styles.authorText, { color: titleColor }]}>{author}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 99,
        height: 141,
        alignSelf: 'center',
        borderRadius: 6,
        marginRight: 12,
        overflow: 'hidden', // Add this to clip children to border radius
    },
    titleContainer: {
        flex: 1, // Takes remaining space
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
        padding: 8,
    },
    titleText: {
        fontSize: 20,
        fontFamily: 'CygreBold',
    },
    authorContainer: {
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
        flex: 1
    },
    authorText: {
        fontSize: 12,
        fontFamily: 'CygreBold',
    },
});


export default YearlyGoals;