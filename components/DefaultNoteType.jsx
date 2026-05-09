import { TouchableOpacity, Text } from 'react-native';

const DefaultNoteType = ({ onPress, bgColor, text }) => {

   return (
        <TouchableOpacity
            onPress={onPress}
            style={{ backgroundColor: bgColor }}
            className="max-w-[95px] mt-4 mr-2 max-h-[25px] w-full h-full justify-center items-center rounded-[13px]">
            <Text className="text-sm text-white font-cygrebold leading-[16.8px] text-center" numberOfLines={1} ellipsizeMode="tail">{text}</Text>
        </TouchableOpacity>
   );
}

export default DefaultNoteType;