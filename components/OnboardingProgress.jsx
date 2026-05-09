import { View, Text } from "react-native";

const OnboardingProgress = ({ stage1 = 0, stage2 = 0 }) => {

    return <View className="flex-row w-full gap-[5px] items-center">
        <View className="rounded-full w-[26px] items-center justify-center h-[26px] bg-[#6592E3]">
            <Text className="font-bold text-[18px] leading-[18px] text-center text-white font-cygreregular">1</Text>
        </View>
        <View className="bg-[#D8E6FF] rounded-[13px] h-[12px] max-w-[156px] relative w-full">
            <View className='absolute bg-[#6592E3] h-full rounded-[13px]' style={{ width: `${stage1}%` }}></View>
        </View>
        <View className="rounded-full w-[26px] h-[26px]  items-center justify-center bg-[#6592E3]" style={{ backgroundColor: stage2 === 0 ? '#D8E6FF': '#6592E3' }}>
            <Text className="font-bold text-[18px] leading-[18px] text-center text-white font-cygreregular">2</Text>
        </View>
        <View className="bg-[#D8E6FF] rounded-[13px] max-w-[136px] h-[12px] relative w-full flex-1">
            <View className='absolute bg-[#6592E3] h-full rounded-[13px]' style={{ width: `${stage2}%` }}></View>
        </View>
    </View>
}


export default OnboardingProgress;

