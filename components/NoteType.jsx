import { TouchableOpacity, Text } from "react-native";

const NoteType = ({ name, icon, bgColor, selected, onPress, containerStyles }) => {
    return (
        <TouchableOpacity
                onPress={onPress}
                style={{backgroundColor: bgColor}}
                className={`mt-2 flex-row justify-start pl-6 flex-1 mb-1 rounded-[15px] h-[56px] items-center ${selected ? 'border-black border' : ''} ${containerStyles}`}>
            <Text className="text-[20px]">{icon}</Text>
            <Text className="text-white pl-9 font-cygrebold text-[18px]">{name}</Text>
        </TouchableOpacity>
    );
}

export default NoteType;