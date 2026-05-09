import {
    View,
    Text,
} from "react-native";

import Checkbox from "./Checkbox";

const SelectGenre = ({ selected, text, onPress, containerStyles }) => {

    return <View className={`rounded-[10px] flex-row items-center h-[49px] w-full border-[.3px] px-4 
        ${selected ? 'bg-[#121F16] text-[#ffffff]' : 'bg-[#ffffff] text-[#121F16]'} ${containerStyles}`}>
            <Checkbox
                containerStyles={'mr-3'}
                checked={selected}
                onPress={onPress}
            /> 
            <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                className={`text-[#FFFFFF] font-cygrebold leading-[19.2px] font-bold
                ${selected ? 'text-[#ffffff]' : 'text-[#121F16]'}`}>{text}</Text>
    </View>
}

export default SelectGenre;