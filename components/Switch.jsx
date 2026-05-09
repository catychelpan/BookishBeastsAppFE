import React, { useState } from 'react';
import {
  TouchableOpacity,
  Animated,
  StyleSheet,
  View,
} from 'react-native';

const Switch = ({ 
  initialValue = false,
  onValueChange,
  size = 'medium',
  activeColor = '#4CAF50',
  inactiveColor = '#767577',
  thumbColor = '#ffffff',
  disabled = false,
  containerStyles
}) => {
  const [isEnabled, setIsEnabled] = useState(initialValue);
  const [thumbAnimation] = useState(new Animated.Value(initialValue ? 1 : 0));

  // Size variants
  const sizes = {
    small: {
      width: 40,
      height: 24,
      thumbSize: 20,
    },
    medium: {
      width: 52,
      height: 32,
      thumbSize: 28,
    },
    large: {
      width: 64,
      height: 40,
      thumbSize: 36,
    }
  };

  const currentSize = sizes[size] || sizes.medium;

  const toggleSwitch = () => {
    if (disabled) return;

    const newValue = !isEnabled;
    setIsEnabled(newValue);
    
    Animated.spring(thumbAnimation, {
      toValue: newValue ? 1 : 0,
      useNativeDriver: true,
      bounciness: 0,
    }).start();

    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  const translateX = thumbAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [2, currentSize.width - currentSize.thumbSize - 2],
  });

  const styles = StyleSheet.create({
    container: {
      width: currentSize.width,
      height: currentSize.height,
      borderRadius: currentSize.height / 2,
      padding: 2,
      backgroundColor: isEnabled ? activeColor : inactiveColor,
      opacity: disabled ? 0.5 : 1,
    },
    thumb: {
      width: currentSize.thumbSize,
      height: currentSize.thumbSize,
      borderRadius: currentSize.thumbSize / 2,
      backgroundColor: thumbColor,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={toggleSwitch}
      disabled={disabled}
      className={containerStyles}
    >
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.thumb,
            {
              transform: [{ translateX }],
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

export default Switch;