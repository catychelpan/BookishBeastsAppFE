import { View, Text, TouchableOpacity } from "react-native";



const DailyTiming = ({ onPress, times, level, styles, selected }) => {

    return <TouchableOpacity
        onPress={onPress}
        className={`max-w-[348px] w-full bg-[#FFFFFF] border-[.9px] rounded-[15px] border-[#8A8A8A] justify-center max-h-[60px] h-full ${selected ? 'border-primary border-[2px]' : ''} ${styles}`}>
        <View className="flex-row justify-around">
            <View className="ml-[27px] justify-center">
                <Text className="text-[#000000] text-[16px] leading-[19.2px] font-bold">{times}</Text>
            </View>
            <View className="ml-[140px]">
                <Text className="text-[#6592E3] font-medium font-cygreregular leading-[16.8px] text-[14px] pr-[24px]">{level}</Text>
            </View>
        </View>
    </TouchableOpacity>
}


export default DailyTiming;