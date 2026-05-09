import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    TextInput,
    Platform,
    FlatList
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatisticsIcon, Statistics2Icon, RightCircleIcon, LeftCircleIcon } from "../../components/Svg";
import BookBottomDrawer from "../../components/BottomDrawer";
import { BarChart } from "react-native-gifted-charts";
import { MaterialIcons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { router } from "expo-router";
import axios from '../../network/axios';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useFocusEffect } from "expo-router";
import ImageHandler from "../../components/ImageHandler";
import CircularProgress from "../../components/CircleProgress";

const screenWidth = Dimensions.get('window').width;

const getDateRangeISO = (days) => {
  const now = new Date();
  const from = new Date();
  
  // Subtract the specified number of days from current date
  from.setDate(now.getDate() - days + 1);
  
  // Set from date to start of day (00:00:00)
  //from.setHours(0, 0, 0, 0);
  
  // Set to date to end of current day (23:59:59.999)
  const to = new Date(now);

  if (days > 7) {
    to.setDate(new Date().getDate() - (days - 7))
  }

  //to.setHours(23, 59, 59, 999);
  
  return {
    from: from.toUTCString(),
    to: to.toUTCString()
  };
};

const getPastWeekDays = () => {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const labels = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(dayNames[date.getDay()]);
    }
    //return originalData?.map(item => item.date);
    return labels;
};

function createLast7DaysObject(days) {
  const daysObject = {};
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i - days);
    
    // Format as DD-MM-YYYY
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const dateKey = `${year}-${month}-${day}`;
    
    daysObject[dateKey] = 0;
  }
  
  return daysObject;
}

function createLastMonthObject(days) {
  const daysObject = {};
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i - days);
    
    // Format as DD-MM-YYYY
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const dateKey = `${year}-${month}-${day}`;
    
    daysObject[dateKey] = 0;
  }
  
  return daysObject;
}




const getDateRangeStringCustom = (days = 7) => {
    const today = new Date();

    const startDate = new Date();

    startDate.setDate(today.getDate() - (days) + 1);

    if (days > 7) {
        today.setDate(new Date().getDate() - (days - 7))
    }
    
    const formatOptions = { day: 'numeric', month: 'short' };
    
    const start = startDate.toLocaleDateString('en-GB', formatOptions);

    const end = today.toLocaleDateString('en-GB', formatOptions);
    
    return `${start} - ${end}`;
};

const createYAxisConfig = (data, sections = 4) => {
  if (!data || data.length === 0) {
    return { maxValue: 100, yAxisLabelTexts: ['0', '25', '50', '75', '100'] };
  }
  
  const maxValue = Math.max(...data.map(item => item.pagesRead || 0));
  const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
  const normalized = maxValue / magnitude;
  
  let niceMax;
  if (normalized <= 1) niceMax = 1;
  else if (normalized <= 2) niceMax = 2;
  else if (normalized <= 5) niceMax = 5;
  else niceMax = 10;
  
  const smartMax = niceMax * magnitude;
  const step = smartMax / sections;
  
  const labels = Array.from({ length: sections + 1 }, (_, i) => 
    String(Math.round(i * step))
  );
  
  return { maxValue: smartMax, yAxisLabelTexts: labels };
};

const createYAxisConfigForReadingSessions = (data, sections = 4) => {
  if (!data || data.length === 0) {
    return { maxValue: 100, yAxisLabelTexts: ['0', '25', '50', '75', '100'] };
  }

  const maxValue = Math.max(...data.map(item => item.secondsRead || 0));
  const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
  const normalized = maxValue / magnitude;
  
  let niceMax;
  if (normalized <= 1) niceMax = 1;
  else if (normalized <= 2) niceMax = 2;
  else if (normalized <= 5) niceMax = 5;
  else niceMax = 10;
  
  const smartMax = niceMax * magnitude;
  const step = smartMax / sections;
  
  const labels = Array.from({ length: sections + 1 }, (_, i) => 
    String(Math.round(i * step))
  );
  
  return { maxValue: smartMax, yAxisLabelTexts: labels };
};


// In your render

const Statistics = () => {

    // Original data values
    const [originalData, setOriginalData] = useState([0, 0, 0, 76, 30, 62, 0]);
    const [booksReadData, setBooksReadData] = useState([]);
    const [booksSessionData, setBooksSessionData] = useState([]);
    const [isBooksGoalDrawerOpen, setIsBooksGoalDrawerOpen] = useState(false);
    const [bookGoalAmount, setBookGoalAmount] = useState(0);
    const [goalState, setGoalState] = useState({
        pagesGoal: null,
        timeGoal: null,
        booksGoal: null,
        currentAmountBooksGoal: null,
        currentAmountInMinutes: null,
        booksReadWithinCurrentYear: null
    });

    const labels = getPastWeekDays(booksReadData);

    const inputRef = useRef(null);

    const handleInputChange = (amount) => {
        setBookGoalAmount(amount)
    }
    const handleSaveBookGoalCount = async () => {
        await setBooksGoalForYear();
    }
    const handleOpenBooksGoalDrawer = () => {
        setIsBooksGoalDrawerOpen(true);
        setTimeout(() => {
            inputRef?.current?.focus();
        }, 400);
    }

    const fetchUserGoalState = useCallback(async () => {
        try {
            const { data } = await axios.get('users/goals/state');
            setGoalState(prev => ({...prev, 
                pagesGoal: data?.pagesGoal,
                booksGoal: data?.booksGoal,
                timeGoal: data?.timeGoalInMinutes,
                currentAmountBooksGoal: data?.currentAmountBooksGoal,
                currentAmountInMinutes: data?.currentAmountMinutes,
                booksReadWithinCurrentYear: data?.booksReadWithinCurrentYear
            }));
            //console.log('Goal state', data)
        } catch(error) {
            console.log(error);
        }
    },[]);

    const setBooksGoalForYear = async () => {
        try {
            await axios.post('users/goals/books-amount', { amount: bookGoalAmount })
            setIsBooksGoalDrawerOpen(false);
            setGoalState(prev => ({...prev, booksGoal: bookGoalAmount}))
        } catch(error) {
            console.log(error);
        }
    }

    // Format data for Gifted Charts
    const barData = originalData.map((value, index) => ({
        value: value,
        label: labels[index],
        frontColor: '#6592E3',
        spacing: 2,
        labelWidth: 40,
        labelTextStyle: {
            color: '#000',
            fontSize: 12,
        },
        topLabelComponent: () => value > 0 ? (
            <Text style={{
                color: '#000',
                fontSize: 12,
                fontWeight: '600',
                textAlign: 'center'
            }}>
                {value}
            </Text>
        ) : null,
    }));

    const booksReadChartData = booksReadData.map((value, index) => ({
        value: value,
        label: labels[index],
        frontColor: '#6592E3',
        spacing: 2,
        labelWidth: 40,
        labelTextStyle: {
            color: '#000',
            fontSize: 12,
        },
        topLabelComponent: () => value > 0 ? (
            <Text style={{
                color: '#000',
                fontSize: 12,
                fontWeight: '600',
                textAlign: 'center'
            }}>
                {value}
            </Text>
        ) : null,
    }));

    const timeBarData = booksSessionData.map((value, index) => ({
        value: value,
        label: labels[index],
        frontColor: '#6592E3',
        spacing: 2,
        labelWidth: 40,
        labelTextStyle: {
            color: '#000',
            fontSize: 12,
        },
        topLabelComponent: () => value > 0 ? (
            <Text style={{
                color: '#000',
                fontSize: 12,
                fontWeight: '600',
                textAlign: 'center'
            }}>
                {value}
            </Text>
        ) : null,
    }));


    const [isPagesReadOpen, setIsPagesReadOpen] = useState(false);

    const [isHoursReadOpen, setIsHoursReadOpen] = useState(false);

    const [isBooksReadOpen, setIsBooksReadOpen] = useState(false);

    const [isTopReadOpen, setIsTopReadOpen] = useState(false);

    const [stats, setStats] = useState({});

    const [stepsBack, setStepsBack] = useState(1);

    const [period, setPeriod] = useState(7);

    const mapReadStatsToWeekArray = (readStats) => {

        const map = createLast7DaysObject(stepsBack > 1 ? (7 * (stepsBack - 1)) : 0);

        for(let i = 0; i < readStats.length; i++) {
            if (map.hasOwnProperty(readStats[i].date)) {
                map[readStats[i].date] = readStats[i].pagesRead;
            }
        }

        //console.log(Object.values(map))

        return Object.values(map);
    };

    const mapReadSessionStatsToWeekArray = (readStats) => {

        const map = createLast7DaysObject(stepsBack > 1 ? (7 * (stepsBack - 1)) : 0);

        for(let i = 0; i < readStats.length; i++) {
            if (map.hasOwnProperty(readStats[i].date)) {
                map[readStats[i].date] = readStats[i].secondsRead;
            }
        }

        //console.log(Object.values(map))

        return Object.values(map);
    };

    const mapBooksReadStatsToWeekArray = (readStats) => {
        // Initialize array with 7 zeros [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
        const map = createLast7DaysObject(stepsBack > 1 ? (7 * (stepsBack - 1)) : 0);

        for(let i = 0; i < readStats.length; i++) {
            if (map.hasOwnProperty(readStats[i].date)) {
                map[readStats[i].date] = readStats[i].booksRead;
            }
        }

        //console.log(Object.values(map))

        return Object.values(map);
    };

    const fetchStats = useCallback(async () => {
        try {
            const daysBackward = period * stepsBack;
            const dates = getDateRangeISO(daysBackward); //subject to filter options
            const { data } = await axios.get(`users/stats?from=${dates.from}&to=${dates.to}`);
            //console.log(mapReadStatsToWeekArray(data.readStats))
            setOriginalData(mapReadStatsToWeekArray(data.readStats));
            setBooksReadData(mapBooksReadStatsToWeekArray(data.bookReadStats))
            setBooksSessionData(mapReadSessionStatsToWeekArray(data.readingSessionStat))
            setStats(data);
            //console.log(data, dates)
        } catch(error) {
            console.log(error);
        }
    },[stepsBack]);

    useFocusEffect(
        useCallback(() => {
            fetchStats()
        }, [fetchStats, stepsBack])
    );

    useFocusEffect(
        useCallback(() => {
            fetchUserGoalState();
        }, [fetchUserGoalState])
    );

    const handleStepBack = () => setStepsBack(prev => prev - 1 > 0 ? prev - 1 : prev);

    const handleStepForward = () => setStepsBack(prev => prev + 1);

    const { quotesSaved, notesSaved, topCategories, topAuthors} = stats || {};

    const topCategoryNames = topCategories?.map(item => item?.category)?.join(', ') || '';

    const topAuthorNames = topAuthors?.map(item => item.name)?.join(', ') || '';

    const pagesRead = useMemo(() => stats?.readStats?.length > 0 ? stats?.readStats?.map(a => a.pagesRead)?.reduce((a,b) => a + b) : 0, [stats?.readStats]);
    
    const booksRead = stats?.bookReadStats?.length ?? 0;

    const yAxisConfig = createYAxisConfig(stats?.readStats);
    const yAxisConfigForReadingSession = createYAxisConfigForReadingSessions(stats?.readingSessionStat);

    const topCategoryCount = topCategories?.length > 0 
    ? Math.max(...topCategories.map(item => item?.books?.length ?? 0))
    : 0;
    
    const fullYear = new Date().getFullYear();

    const secondsRead = useMemo(() => stats?.readingSessionStat?.length > 0
        ? stats?.readingSessionStat
        ?.map(a => a.secondsRead)
        ?.reduce((a,b) => a + b) : 0, [stats?.readingSessionStat]);

    return (
        <SafeAreaView className="bg-[#F7F7F7] h-full flex-1">
            <View className="max-h-[60px] justify-between items-center flex-row h-full mx-5 mb-7">
                <TouchableOpacity
                    activeOpacity={0.7}
                    className="flex-1 pt-3 flex-row"
                >
                    <Text className="font-cygrebold text-[24px] leading-[28.8px] text-[#121F16]">Statistics</Text>
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                <View className="mx-5 mb-4 max-h-[110px]">
                    { goalState?.timeGoal ? ( 
                        <TouchableOpacity
                            onPress={() => router.push('daily-goal')}
                            className="bg-[#1C1C1C] mb-6 max-h-[106px] h-full rounded-[20px] border-[.3px] border-[#8A8A8A] flex-row justify-between px-6 items-center">
                            <View className="py-4 max-w-[60%]">
                                <Text className="font-cygreregular leading-[19.2px] text-white mb-1.5">Daily Reading Goal</Text>
                                <Text className="font-cygrebold leading-[19.2px] text-white text-[22px]">{`${goalState?.currentAmountInMinutes} of ${goalState?.timeGoal} minutes`}</Text>
                            </View>
                            <View>
                                <CircularProgress
                                    size={75}
                                    strokeWidth={5.69}
                                    progress={goalState?.currentAmountInMinutes / (goalState?.timeGoal) * 100}
                                    progressColor="#6592E3"
                                    backgroundColor="#fff"
                                />
                            </View>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={() => router.push('daily-goal')}
                            className="bg-[#1C1C1C] mb-6 max-h-[106px] h-full rounded-[20px] border-[.3px] border-[#8A8A8A] flex-row justify-between px-6 items-center">
                            <View className="py-4 max-w-[60%]">
                                <Text className="font-cygrebold leading-[19.2px] text-white">Set your daily Reading Goal</Text>
                            </View>
                            <View className="mt-2.5">
                                <StatisticsIcon />
                            </View>
                        </TouchableOpacity>
                    )}
                </View>


                { goalState?.booksGoal ? (
                    <View className="mx-5">
                        <BooksProgressWithinCurrentYear
                            booksReadSoFar={goalState?.currentAmountBooksGoal}
                            booksGoalAmount={goalState?.booksGoal}
                            books={goalState?.booksReadWithinCurrentYear}
                        />
                    </View>
                ) : (
                    <TouchableOpacity
                        onPress={handleOpenBooksGoalDrawer}
                        className="mx-5 mb-7 max-h-[110px]">
                        <View className="bg-[#1C1C1C] mb-6 max-h-[106px] h-full rounded-[20px] border-[.3px] border-[#8A8A8A] flex-row-reverse justify-between px-6 items-center">
                            <View className="py-4 max-w-[40%]">
                                <Text className="font-cygrebold leading-[19.2px] text-white text-[18px]">Set your {fullYear} Reading Goals</Text>
                            </View>
                            <View className="mt-2.5">
                                <Statistics2Icon />
                            </View>
                        </View>
                    </TouchableOpacity>
                ) }
                

                <View className="mx-5 mb-2">
                    
                </View>

                <View className="flex-row justify-between mx-5 mb-7">
                    <TouchableOpacity
                        className="rounded-full bg-[#1C1C1C] rotate-180"
                        onPress={handleStepForward}
                    >
                        <LeftCircleIcon />
                    </TouchableOpacity>
                    <View className="rounded-[21px] border-[#000] border-[1px] max-w-[133px] p-2">
                        <Text>
                            { getDateRangeStringCustom(period * stepsBack) }
                        </Text>
                    </View>
                    <TouchableOpacity
                        className="rounded-full bg-[#1C1C1C]"
                        onPress={handleStepBack}
                    >
                        <RightCircleIcon />
                    </TouchableOpacity>
                </View>
                
                <View className="px-5 mb-5">
                    <View style={styles.chartContainer}>
                        <View className="flex-row justify-between">
                            <View className="flex-row">
                                <Text className="text-[18px] mr-1.5 font-cygreregular">You've read</Text>
                                <Text className="text-[18px] text-primary font-cygrebold">{pagesRead} pages</Text>
                            </View>
                            <TouchableOpacity onPress={() => setIsPagesReadOpen(!isPagesReadOpen)}>
                                <MaterialIcons name="arrow-drop-up" size={30} />
                            </TouchableOpacity>
                        </View>
                        <View className="flex-row">
                            <Feather name="arrow-up-right" size={24} color="#5EBAB9" />
{/*                             <Text className="text-[#5EBAB9] text-[14px]">32 pages</Text> */}
                        </View>
                        <BarChart
                            data={isPagesReadOpen ? barData : []}
                            width={screenWidth - 120}
                            height={isPagesReadOpen ? 250 : 0}
                            barWidth={35}
                            spacing={15}
                            roundedBottom={false}
                            scrollAnimation
                            hideRules={false}
                            xAxisThickness={0}
                            yAxisThickness={0}
                            yAxisColor="rgba(101, 146, 227, 0.29)"
                            maxValue={yAxisConfig.maxValue}
                            yAxisLabelTexts={yAxisConfig.yAxisLabelTexts}
                            noOfSections={4}
                            yAxisLabelWidth={40}
                            rulesLength={screenWidth - 120}
                            rulesColor="rgba(101, 146, 227, 0.29)"
                            rulesThickness={1}
                            showReferenceLine1={false}
                            showReferenceLine2={false}
                            showReferenceLine3={false}
                            backgroundColor="#ffffff"
                            isAnimated={true}
                            animationDuration={300}
                            yAxisTextStyle={{
                                color: '#000',
                                fontSize: 12,
                            }}
                            showValuesAsTopLabel={false}
                            topLabelTextStyle={{
                                color: '#000',
                                fontSize: 12,
                                fontWeight: '600',
                            }}
                        />
                    </View>
                </View>
                <View className="px-5 mb-5">
                    <View style={styles.chartContainer}>
                        <View className="flex-row justify-between">
                            <View className="flex-row">
                                <Text className="text-[18px] mr-1.5 font-cygreregular">You've read for</Text>
                                <Text className="text-[18px] text-primary font-cygrebold">{Math.round(secondsRead / 60)} minutes</Text>
                            </View>
                            <TouchableOpacity onPress={() => setIsHoursReadOpen(!isHoursReadOpen)}>
                                <MaterialIcons name="arrow-drop-up" size={30} />
                            </TouchableOpacity>
                        </View>
                        <View className="flex-row">
                            <Feather name="arrow-up-right" size={24} color="#5EBAB9" />
{/*                             <Text className="text-[#5EBAB9] text-[14px]">47 m</Text> */}
                        </View>
                        <BarChart
                            data={isHoursReadOpen ? timeBarData : []}
                            width={screenWidth - 120}
                            height={isHoursReadOpen ? 250 : 0}
                            barWidth={35}
                            spacing={15}
                            roundedBottom={false}
                            scrollAnimation
                            hideRules={false}
                            xAxisThickness={0}
                            yAxisThickness={0}
                            yAxisColor="rgba(101, 146, 227, 0.29)"
                            maxValue={yAxisConfigForReadingSession.maxValue}
                            yAxisLabelTexts={yAxisConfigForReadingSession.yAxisLabelTexts}
                            noOfSections={4}
                            yAxisLabelWidth={40}
                            rulesLength={screenWidth - 120}
                            rulesColor="rgba(101, 146, 227, 0.29)"
                            rulesThickness={1}
                            showReferenceLine1={false}
                            showReferenceLine2={false}
                            showReferenceLine3={false}
                            backgroundColor="#ffffff"
                            isAnimated={true}
                            animationDuration={300}
                            yAxisTextStyle={{
                                color: '#000',
                                fontSize: 12,
                            }}
                            showValuesAsTopLabel={false}
                            topLabelTextStyle={{
                                color: '#000',
                                fontSize: 12,
                                fontWeight: '600',
                            }}
                        />
                    </View>
                </View>
                <View className="px-5 mb-5">
                    <View style={styles.chartContainer}>
                        <View className="flex-row justify-between">
                            <View className="flex-row">
                                <Text className="text-[18px] mr-1.5 font-cygreregular">You've finished</Text>
                                <Text className="text-[18px] text-black font-cygrebold">{`${booksRead} books`}</Text>
                            </View>
                            <TouchableOpacity onPress={() => setIsBooksReadOpen(!isBooksReadOpen)}>
                                <MaterialIcons name="arrow-drop-up" size={30} />
                            </TouchableOpacity>
                        </View>
                        <View className="flex-row">
                            <Feather name="arrow-up-right" size={24} color="#5EBAB9" />
{/*                             <Text className="text-[#5EBAB9] text-[14px]">1 book</Text> */}
                        </View>
                        <BarChart
                            data={isBooksReadOpen ? booksReadChartData : []}
                            width={screenWidth - 120}
                            height={isBooksReadOpen ? 250 : 0}
                            barWidth={35}
                            spacing={15}
                            roundedBottom={false}
                            scrollAnimation
                            hideRules={false}
                            xAxisThickness={0}
                            yAxisThickness={0}
                            yAxisColor="rgba(101, 146, 227, 0.29)"
                            yAxisLabelTexts={['0', '3', '5', '7', '10']}
                            maxValue={10}
                            noOfSections={4}
                            yAxisLabelWidth={40}
                            rulesLength={screenWidth - 120}
                            rulesColor="rgba(101, 146, 227, 0.29)"
                            rulesThickness={1}
                            showReferenceLine1={false}
                            showReferenceLine2={false}
                            showReferenceLine3={false}
                            backgroundColor="#ffffff"
                            isAnimated={true}
                            animationDuration={300}
                            yAxisTextStyle={{
                                color: '#000',
                                fontSize: 12,
                            }}
                            showValuesAsTopLabel={false}
                            topLabelTextStyle={{
                                color: '#000',
                                fontSize: 12,
                                fontWeight: '600',
                            }}
                        />
                    </View>
                </View>
                <View className="px-5 mb-5 flex-row justify-between gap-1.5">
                    <View className="rounded-[20px] max-w-[176px] h-[105px] flex-[.5] bg-primary items-center justify-center">
                        <Text className="text-white font-cygrebold">Quotes Saved</Text>
                        <Text className="text-white text-[34px] font-cygrebold">{quotesSaved}</Text>
                    </View>
                    <View className="rounded-[20px] max-w-[176px] h-[105px] flex-[.5] bg-[#D5E3FC] items-center justify-center">
                        <Text className="text-[#1D192B] font-cygrebold">Notes Saved</Text>
                        <Text className="text-[#1D192B] text-[34px] font-cygrebold">{notesSaved}</Text>
                    </View>
                </View>
                <View className="px-5 mb-5">
                    <View style={styles.chartContainer}>
                        <View className="flex-row justify-between mb-4">
                            <View className="">
                                <Text className="text-[18px] mr-1.5 font-cygreregular">Your top categories were</Text>
                                <Text className="text-[18px] text-primary font-cygrebold">{topCategoryNames}</Text>
                            </View>
                            <TouchableOpacity onPress={() => setIsTopReadOpen(!isTopReadOpen)}>
                                <MaterialIcons name="arrow-drop-up" size={30} />
                            </TouchableOpacity>
                        </View>
                        { isTopReadOpen ?  
                            <>
                            { topCategories?.map((item, _) => (
                                <View key={item.category}>
                                    <Text className="text-[14px] pl-1">{item?.category}</Text>
                                    <View className="flex-row items-center justify-between">
                                        <View className="bg-[#D8E6FF] rounded-[13px] h-[8px] relative flex-[.9] w-full">
                                            <View className='absolute bg-[#6592E3] h-full rounded-[13px]'
                                                style={{ width: `${item?.books?.length * 100 / topCategoryCount}%` }}></View>
                                        </View>
                                        <Text className="text-[14px] flex-[.2] text-right">{item?.books?.length} {item?.books?.length > 0 ? 'books' : 'book'}</Text>
                                    </View>
                                </View>
                            ))}
{/*                                 <View>
                                    <Text className="text-[14px] pl-1">Fantasy</Text>
                                    <View className="flex-row items-center justify-between">
                                        <View className="bg-[#D8E6FF] rounded-[13px] h-[8px] relative flex-[.9] w-full">
                                            <View className='absolute bg-[#6592E3] h-full rounded-[13px]' style={{ width: `${100}%` }}></View>
                                        </View>
                                        <Text className="text-[14px] flex-[.2] text-right">2 book</Text>
                                    </View>
                                </View> */}
                            </> : <></>
                        }
                    </View>
                </View>

                <View className="px-5 mb-12">
                    <View style={styles.chartContainer}>
                        <View className="flex-row justify-between mb-4">
                            <View className="">
                                <Text className="text-[18px] mr-1.5 font-cygreregular">Your top authors were</Text>
                                <Text className="text-[18px] text-primary font-cygrebold">{topAuthorNames}</Text>
                            </View>
                            <TouchableOpacity>
                                <MaterialIcons name="arrow-drop-up" size={30} />
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </ScrollView>
            <BookBottomDrawer
                isBottomSheetOpen={isBooksGoalDrawerOpen}
                setIsBottomSheetOpen={setIsBooksGoalDrawerOpen}>
                    <Text className="text-black font-cygrebold text-[22px] mb-7 text-center max-w-[250px]">How many books you want to read this year?</Text>
                    <View className="items-center flex-1 gap-x-1 relative flex-row justify-center rounded-[15px] mx-4 mb-7">
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        className="border-[.5px] border-[#8A8A8A] rounded-[15px] max-w-[200px] w-full mb-7">
                            <TextInput
                                inputMode="numeric"
                                value={bookGoalAmount}
                                ref={inputRef}
                                keyboardType="numeric"
                                onChangeText={handleInputChange}
                                className="px-10 py-3 text-center text-black leading-[19.2px] font-cygreregular" 
                            />
                        </KeyboardAvoidingView>
                    </View>
                <TouchableOpacity 
                    onPress={handleSaveBookGoalCount}
                    className="bg-primary rounded-[30px] flex-1 w-full items-center justify-center max-h-[48px] h-full py-2 px-4">
                    <Text className="text-white text-[18px] font-cygrebold text-center justify-center items-center">Save</Text>
                </TouchableOpacity>
            </BookBottomDrawer>
            
        </SafeAreaView>
    );
}


const BooksProgressWithinCurrentYear = ({ booksReadSoFar, booksGoalAmount, books }) => {

    const currentYear = new Date().getFullYear();

    const progressPercent = booksReadSoFar / booksGoalAmount * 100;

    const lastElementId = "last_element";

    const booksWithEndingElement = [...books, { id: lastElementId }]

    return <View className="border border-[#8A8A8A] bg-white mb-1.5 rounded-[20px] pt-6">
            <View className="flex-row justify-between items-center px-7">
                <Text className="text-[#1C1C1C] font-cygreregular">{`${currentYear} Reading Goal`}</Text>
                <TouchableOpacity
                    onPress={() => router.push('yearly-goals')}
                    className="bg-primary rounded-[30px] items-center justify-center px-4 py-2">
                    <Text className="text-center text-white font-cygrebold text-[18px]">View All</Text>
                </TouchableOpacity>
            </View>
            <Text className="text-[#1C1C1C] font-cygrebold text-[34px] mb-4 pl-7">
                {`${booksReadSoFar} of ${booksGoalAmount} books`}
            </Text>
            <View className="bg-[#D8E6FF] rounded-[13px] h-[12px] max-w-[85%] ml-7 relative w-full mb-5">
                <View className='absolute bg-[#6592E3] h-full rounded-[13px]' style={{ width: `${progressPercent}%` }}></View>
            </View>
            <View className="pl-6">
                <FlatList
                    data={booksWithEndingElement}
                    horizontal
                    className="mb-8"
                    keyExtractor={a => a.id}
                    ItemSeparatorComponent={<View className="w-[8px]"></View>}
                    renderItem={({ item }) => {
                        if (item?.id === lastElementId) {
                            return <PlaceHolderForBooksYetToRead
                                booksAmountYetToRead={booksGoalAmount - booksReadSoFar}
                            />
                        }
                        if (!item?.imageUrl) {
                            return <BookPlaceHolder
                                key={item.id}
                                title={item?.title}
                                author={item?.author}
                                titleColor={item?.cover?.titleColor}
                                backgroundColor={item?.cover?.backgroundColor}
                            />
                        }

                        return <ImageHandler
                            key={item.id}
                            width={77}
                            height={104}
                            source={item?.imageUrl}
                            resizeMode="contain"
                        />}
                    }
                />
            </View>
    </View>
}


const PlaceHolderForBooksYetToRead = ({booksAmountYetToRead}) => {
    return <View className="h-[107px] bg-[#D5E3FC] items-center justify-center w-[77px] rounded-[6px]">
        <Text className="text-primary text-[34px] font-cygrebold">{booksAmountYetToRead}</Text>
    </View>
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
    chartContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 1
    },
    container: {
        width: 77,
        height: 104,
        alignSelf: 'center',
        borderRadius: 6,
        overflow: 'hidden', // Add this to clip children to border radius
    },
    titleContainer: {
        flex: 1, // Takes remaining space
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
        padding: 8,
    },
    titleText: {
        fontSize: 16,
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
    }
});

export default Statistics;