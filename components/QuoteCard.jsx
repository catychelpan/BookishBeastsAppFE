import {
    View,
    Text,
    TouchableOpacity,
} from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import RadioButton from './RadioButton';


const QuoteCard = ({ text, book, selected, onRadioButtonPress, onDeleteButtonPress, showRadioButton = true, containerStyles }) => {

    return <View className={`border-[#8A8A8A] py-5 px-4 border-[.5px] rounded-[20px] ${containerStyles}`}>
        <View className="flex-row justify-between items-center mb-4">
            <View className="bg-primary px-4 py-1 rounded-[13px] flex-row items-center">
                <MaterialIcons name="book" color={'white'} />
                <Text className="text-[#FFFFFF] text-sm leading-[16.8px] ml-1">{book}</Text>
            </View>
            { showRadioButton ? (
                <RadioButton
                    onPress={onRadioButtonPress}
                    selected={selected} 
                />
            ) : <TouchableOpacity
                    onPress={onDeleteButtonPress}
                    className="bg-black rounded-full p-2">
                    <MaterialIcons name="delete" size={24} color="white" />
                </TouchableOpacity> }
        </View>
        <View className="py-3 px-4 rounded-[8px] bg-[#EEEEEE] w-full">
            <Text className="text-black font-cygresemibold leading-[19.2px]">{text}</Text>
        </View>
    </View>
}

export default QuoteCard;