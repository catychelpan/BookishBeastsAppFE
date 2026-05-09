
import Svg, { Circle } from 'react-native-svg';
import { StyleSheet, View, Text } from 'react-native';


const CircularProgress = ({ 
  size = 100,
  strokeWidth = 10,
  progress = 0,
  progressColor = '#6592E3',
  backgroundColor = '#ffffff',
  containerStyles
}) => {
  // Calculate dimensions
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progressOffset = circumference - (progress / 100) * circumference;
  
  // Calculate center point
  const center = size / 2;
  
  return (
    <View
        style={styles.container}
        className={containerStyles}>
      <Svg
        width={size}
        height={size}
        style={{ transform: [{ rotate: '-90deg' }] }}
      >
        {/* Background circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
          strokeLinecap="round"
          fill="transparent"
        />
      </Svg>
      
      {/* Progress text in the center */}
      <View style={[
        styles.textContainer, 
        { width: size, height: size }
      ]}>
        <Text style={styles.progressText}>
          {Math.round(progress)}%
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  textContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 26,
    color: '#fff',
    fontFamily: 'Cygre-Bold',
    fontWeight: '700',
  },
});

export default CircularProgress;