
import { View, Text, StyleSheet } from "react-native";
import React from 'react';
import Slider from '@react-native-community/slider';




const SliderCounter = ({
    value,
    setValue,
    minimumVal = 13,
    textColor,
    maxValue = 100,
    showCounter = true,
    updateUI
  }) => {


  //Slider's track height isn't customizable

  return (
    <View style={styles.container}>
        { showCounter ?  (
            <Text className={`text-[60px] font-bold font-cygrebold ${textColor}`}>{value.toFixed(0)}</Text>
        ) : <></> }
      <Slider
        style={{ height: 40, width: '100%' }}
        minimumValue={minimumVal}
        maximumValue={maxValue}
        step={1}
        value={value}
        onValueChange={updateUI}
        onSlidingComplete={setValue}
        thumbTintColor={'#6592E3'}
        minimumTrackTintColor="#6592E3"
        maximumTrackTintColor="#C1D7FF"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  valueText: {
    fontSize: 24,
    marginBottom: 20,
  },
  slider: {
    width: '100%',
    height: "26px",
  },
});

export default SliderCounter;