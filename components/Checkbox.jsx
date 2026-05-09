

import React from 'react';
import { TouchableOpacity, View } from 'react-native';

const Checkbox = ({ 
  onPress, 
  checked, 
  disabled = false,
  size = 24,
  containerStyles
}) => {

  return (
    <TouchableOpacity 
      className={`flex-row items-center gap-3 ${disabled ? 'opacity-50' : ''} ${containerStyles}`}
      onPress={onPress}
      disabled={disabled}
    >
      <View 
        style={{ width: size, height: size }}
        className={`
          border-[.3px] border-[#121F16] rounded-md items-center justify-center bg-[#ffffff]
          ${disabled ? 'border-gray-300' : ''}`}
      >
        {checked && (
          <View className="flex-1 items-center justify-center">
            <View className="rotate-[135deg] w-4 h-3 border-r-4 rounded-sm border-t-4 border-[#121F16] mt-[-2px]" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};


export default Checkbox;