import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

const RadioButton = ({
  selected = false,
  onPress,
  size = 24,
  selectedColor = '#6592E3',
  unselectedColor = '#000',
  label = '',
  disabled = false,
  labelStyle = {},
  containerStyle = {},
}) => {
  const outerSize = size;
  const innerSize = size / 2;
  
  const currentColor = disabled 
    ? '#ccc' 
    : selected 
      ? selectedColor 
      : unselectedColor;
  
  const customStyles = {
    outer: {
      height: outerSize,
      width: outerSize,
      borderRadius: outerSize / 2,
      borderWidth: 4,
      borderColor: currentColor,
      alignItems: 'center',
      justifyContent: 'center',
    },
    inner: {
      height: innerSize,
      width: innerSize,
      borderRadius: innerSize / 2,
      backgroundColor: currentColor,
    },
  };

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={[styles.outer, customStyles.outer]}>
        {selected && <View style={[styles.inner, customStyles.inner]} />}
      </View>
      {label ? (
        <Text
          style={[
            styles.label,
            { color: currentColor },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  outer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default RadioButton;