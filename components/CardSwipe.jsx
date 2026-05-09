import React, { useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

const CardSwipe = ({ data, onSwipeLeft, onSwipeRight, visualFeedBack = true }) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(1)).current;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
    // Only capture horizontal movements, let vertical ones pass to ScrollView
    return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
  },
    onPanResponderGrant: () => {
      pan.setOffset({
        x: pan.x._value,
        y: pan.y._value,
      });
    },
    onPanResponderMove: Animated.event(
      [null, { dx: pan.x, dy: pan.y }],
      { useNativeDriver: false }
    ),
    onPanResponderRelease: (evt, gestureState) => {
      pan.flattenOffset();
      
      const swipeThreshold = screenWidth * 0.3;
      const velocityThreshold = 500;
      
      if (Math.abs(gestureState.dx) > swipeThreshold || Math.abs(gestureState.vx) > velocityThreshold) {
        const direction = gestureState.dx > 0 ? 'right' : 'left';
        const toValue = direction === 'right' ? screenWidth : -screenWidth;
        
        // Animate card off screen
        Animated.timing(pan.x, {
          toValue,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          // Call appropriate callback
          if (direction === 'right') {
            onSwipeRight && onSwipeRight();
          } else {
            onSwipeLeft && onSwipeLeft();
          }
          
          // Reset position for next card
          pan.setValue({ x: 0, y: 0 });
          rotate.setValue(0);
          textOpacity.setValue(1);
        });
      } else {
        // Spring back to center
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
        }).start();
        
        Animated.spring(rotate, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
        
        Animated.spring(textOpacity, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  // Update rotation and text opacity based on translateX
  React.useEffect(() => {
    const listener = pan.x.addListener(({ value }) => {
      const rotation = (value / screenWidth) * 30;
      rotate.setValue(rotation);
      
      // Make text disappear when swiping
      const opacity = 1 - Math.abs(value) / (screenWidth * 0.4);
      textOpacity.setValue(Math.max(0, opacity));
    });
    
    return () => pan.x.removeListener(listener);
  }, [pan.x, rotate, textOpacity]);

return (
  <Animated.View
    style={[
      styles.card,
      {
        transform: [
          { translateX: pan.x },
          { 
            rotate: rotate.interpolate({
              inputRange: [-30, 0, 30],
              outputRange: ['-30deg', '0deg', '30deg'],
              extrapolate: 'clamp',
            }) 
          },
        ],
      },
    ]}
    {...panResponder.panHandlers}
  >
    {/* Content */}
    <ScrollView style={{ flex: 1 }}>
      <Animated.Text style={[styles.cardText, { opacity: textOpacity }]}>
        <MaterialIcons name="book" color={'white'} size={15} />
        {data.title}
      </Animated.Text>
      <Animated.Text style={[styles.cardDescription, { opacity: textOpacity }]}>
        {data.description}
      </Animated.Text>
    </ScrollView>

    {/* Overlay - NOW OUTSIDE ScrollView */}
    {visualFeedBack && (
      <>
        <Animated.View 
          style={[
            styles.overlay,
            styles.leftOverlay,
            {
              opacity: pan.x.interpolate({
                inputRange: [-screenWidth * 0.5, 0],
                outputRange: [1, 0],
                extrapolate: 'clamp',
              }),
            },
          ]}
          pointerEvents="none"  // So it doesn't block touches
        >
          <Text style={styles.overlayText}>Revise</Text>
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.overlay,
            styles.rightOverlay,
            {
              opacity: pan.x.interpolate({
                inputRange: [0, screenWidth * 0.5],
                outputRange: [0, 1],
                extrapolate: 'clamp',
              }),
            },
          ]}
          pointerEvents="none"
        >
          <Text style={styles.overlayText}>Remember</Text>
        </Animated.View>
      </>
    )}
  </Animated.View>
);
};

const styles = StyleSheet.create({
  card: {
    width: screenWidth * 0.85,
    //height: 'auto',
    height: 450,
    //maxHeight: '1200px',
    backgroundColor: 'white',
    //position: 'absolute',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    //shadowOpacity: 0.3,
    shadowRadius: 4.65,
    borderColor: '#8A8A8A',
    borderWidth: .5,
    //elevation: 8,
    justifyContent: 'start',
    //alignItems: 'center',
  },
  cardText: {
    fontSize: 14,
    fontWeight: 'bold',
    overflow: 'scroll',
    fontFamily: 'Cygre-Medium',
    backgroundColor: '#1C1C1C',
    marginBottom: 20,
    color: '#fff',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'between',
  },
  cardDescription: {
    fontFamily: 'Cygre-Regular',
    overflow: 'scroll',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 500,
    color: '#1D1D1D',
    lineHeight: 24,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftOverlay: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
  },
  rightOverlay: {
    backgroundColor: 'rgba(0, 255, 0, 0.1)',
  },
  overlayText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  info: {
    padding: 20,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  instructions: {
    fontSize: 14,
    color: '#666',
  },
});

export default CardSwipe;