import React, { useState, Fragment, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { Calendar } from 'react-native-calendars';
import axios from '../../network/axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImageHandler from '../../components/ImageHandler';
import AntDesign from '@expo/vector-icons/AntDesign';


const DayComponent = ({ date, state, marking, onPress, ...rest }) => {

    const isSelected = state === 'today';

    const handleRedirect = () => {
      router.push({ pathname: 'books-finished', params: { date: date.dateString }})
    }
    const hasEvents = marking?.imageUrls && marking.imageUrls.length > 0;

    return (
      <TouchableOpacity onPress={handleRedirect} className={`relative ${hasEvents ? 'h-[80px]' : 'h-[60px]'}`}>
        <View className={isSelected ? "w-[30px] h-[30px] rounded-full bg-black justify-center": ""}>
          <Text className={`text-center ${isSelected ? 'text-white' : ''}`}>
            {date.day}
          </Text>
        </View>
        { marking?.imageUrls && (
          <ScrollView
            className="relative"
            contentContainerStyle={{
                padding: 0,
                flexGrow: 1, // This might help with height issues
              }}
              style={{
                flex: 1, // Ensures ScrollView takes full available height
                padding: 0,
              }}
            horizontal
          >
            { marking.imageUrls.map(item => <ImageHandler
                key={item}
                id={item}
                className={`max-w-[37px] ${isSelected ? 'mt-1' : ''} h-full max-h-[58px]`}
                height={58}
                width={37}
                source={item}
                resizeMode='contain'
            />) }
          </ScrollView>
        ) }
      </TouchableOpacity>
    )
}


const BookCalendar = () => {

    const [markedDates, setMarkedDates] = useState({
      '2025-06-06': {selected: true, marked: true, selectedColor: 'blue', imageUrl: 'awdw'},
    });

    const getReadEvents = async () => {
      try {
        const { data } = await axios.get(`users/read-events`);
        const result = data.reduce((acc, item) => {
        const dateKey = new Date(item.finishedAt).toISOString().split('T')[0];
          if (acc[dateKey]) {
            if (acc[dateKey].imageUrls.length < 2) {
              acc[dateKey].imageUrls.push(item.imageUrl);
            }
          } else {
            acc[dateKey] = {
              marked: true,
              imageUrls: [item.imageUrl]
            };
          }
          
          return acc;
        }, {});
        setMarkedDates(result);
      } catch(error) {
        console.log(error);
      }
    }

    useEffect(() => {
      getReadEvents();
    }, []);

    const renderArrow = (direction) => {
      if (direction === 'left') {
        return (
          <View className="bg-primary ml-[-15px] items-center justify-center w-[42px] h-[43px] rounded-[12px]">
            <AntDesign name="left" size={24} color="white" />
          </View>
        );
      } 

      return (
        <View className="bg-primary mr-[-15px] items-center justify-center w-[42px] h-[43px] rounded-[12px]">
          <AntDesign name="right" size={24} color="white" />
        </View>
      );
    };

    const theme = {
      dayNamesShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    }

const renderCalendarWithSelectableDate = () => {
    return (
        <Fragment>
            <Calendar
                markingType={'custom'} 
                theme={theme}
                enableSwipeMonths
                headerStyle={styles.headerStyle}
                renderArrow={renderArrow}
                renderHeader={(date) => {
                    const d = new Date(date);
                    const formatted = `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
                    return (
                        <Text className="text-black font-cygrebold text-[18px]">
                            {formatted}
                        </Text>
                    );
                }}
                onPressArrowLeft={subtractMonth => subtractMonth()}
                onPressArrowRight={addMonth => addMonth()}
                style={styles.calendar}
                markedDates={markedDates}
                dayComponent={DayComponent}
            />
        </Fragment>
    );
};
    return <SafeAreaView className="flex-1 h-full bg-[#F7F7F7]">
        <View className="max-h-[40px] justify-between items-center flex-row h-full mx-5 mb-7">
            <View className="flex-row flex-1">
              <TouchableOpacity
                  className="flex-1" onPress={() => router.back()}>
                  <Image source={require('../../assets/images/left_arrow.png')} />
              </TouchableOpacity>
            </View>
        </View>

      <ScrollView className="h-full">
        <View className="mx-5 mb-7 justify-start min-h-[150px]">
          <Text className="text-black font-cygrebold text-[28px]">Book Calendar</Text>
          <Text className="text-black font-cygreregular max-w-[75%]">See your finished books and captured emotions when finishing the book here.</Text>
        </View>
        <View className="mx-5 rounded-[10px] h-full max-h-[1200px]">
            {renderCalendarWithSelectableDate()}
        </View>
      </ScrollView>
    </SafeAreaView>
}

const styles = StyleSheet.create({
  calendar: {
    borderRadius: 20,
    borderColor: '#8A8A8A',
    borderWidth: 1,
  },
  headerStyle: {
    position: 'absolute',
    top: -100,
    zIndex: -100,
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
    tintColor: "transparent",
    width: "100%",
    paddingHorizontal: -100,
  }
});



export default BookCalendar;