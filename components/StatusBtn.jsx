import {
    Text,
    TouchableOpacity
} from "react-native";

const StatusBtn = ({ selected, text, containerStyles, onPress }) => {
    return <TouchableOpacity
            onPress={onPress}
            className={`rounded-[15px] justify-center items-center max-w-[106px] h-[38px] w-full border-[.5px] border-[#8A8A8A] ${selected ? 'bg-primary' : 'bg-[#ffffff]'} ${containerStyles}`}>
        <Text className={`leading-[16.8px] text-center font-cygrebold text-sm ${selected ? 'text-[#ffffff]' : 'text-black'}`}>{text}</Text>
    </TouchableOpacity>
}

export default StatusBtn;