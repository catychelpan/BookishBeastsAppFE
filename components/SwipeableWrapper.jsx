
import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  Easing
} from 'react-native';
import PropTypes from 'prop-types';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width / 5;

const SwipeableWrapper = ({ children, showDots = true }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const position = useRef(new Animated.Value(0)).current;

  // Convert children to array for easier handling
  const childrenArray = React.Children.toArray(children);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      // Only capture horizontal movements, let vertical ones pass to ScrollView
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
    },
    onPanResponderMove: (event, gesture) => {
      position.setValue(gesture.dx);
    },
    onPanResponderRelease: (event, gesture) => {
      if (gesture.dx < -SWIPE_THRESHOLD && currentIndex < childrenArray.length - 1) {
        // Swipe left to next
        Animated.timing(position, {
          toValue: -width,
          duration: 150,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }).start(() => {
          setCurrentIndex(currentIndex + 1);
          position.setValue(0);
        });
      } else if (gesture.dx > SWIPE_THRESHOLD && currentIndex > 0) {
        // Swipe right to previous
        Animated.timing(position, {
          toValue: width,
          duration: 150,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }).start(() => {
          setCurrentIndex(currentIndex - 1);
          position.setValue(0);
        });
      } else {
        // Return to center
        Animated.timing(position, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    }
  });

  const getCardStyle = () => {
    return {
      transform: [{ translateX: position }]
    };
  };

  // Indicator dots
  const renderDots = () => {
    if (!showDots) return null;
    
    return (
      <View style={styles.dotsContainer}>
        {childrenArray.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex && styles.activeDot
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <>
        <View style={styles.container}>
            <Animated.View 
                style={[styles.componentWrapper, getCardStyle()]} 
                {...panResponder.panHandlers}
            >
                {childrenArray[currentIndex]}
            </Animated.View>
          {renderDots()}
        </View>
    </>
  );
};

SwipeableWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  showDots: PropTypes.bool
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 15,
    backgroundColor: '#F7F7F7',
  },
  componentWrapper: {
    flex: 1,
    position: 'relative',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#000000',
  },
});

export default SwipeableWrapper;