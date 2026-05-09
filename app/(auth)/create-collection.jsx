import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from '@expo/vector-icons';
import { useRef, useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import axios from '../../network/axios';



const CreateCollection = () => {

    const inputRef = useRef(null);

    const [name, setName] = useState('');

    const { fromSelect } = useLocalSearchParams();

    useEffect(() => {
        inputRef.current?.focus();
    }, [])

    const addCollection = async () => {
        if (!name) return;
        try {
            await axios.post('/users/collections', { name });
            if (fromSelect) {
                router.back();
            } else {
                router.push({pathname: 'collection', params: { name } })
            }
        } catch(error) {
            console.log(error)
        }
    }

    const handleInputChange = (text) => {
        setName(text);
    }

    return (
        <SafeAreaView className="bg-[#F7F7F7] h-full relative">
            <View className="max-h-[60px] justify-start items-center flex-row h-full mx-5">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="flex-1 mt-2.5 mr-2.5 max-w-[44px] w-full items-center justify-center rounded-[10px]">
                        <MaterialIcons name="close" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <KeyboardAvoidingView className="items-center flex-1 justify-center">
                <View>
                    <Text className="font-cygrebold text-[24px] leading-[28.8px] mb-7">Your new collection:</Text>
                    <View className="border-[.5px] border-[#8A8A8A] rounded-[15px] max-w-[307px] mb-7">
                        <TextInput
                            ref={inputRef}
                            onChangeText={handleInputChange}
                            className="px-10 py-3 text-black leading-[19.2px] font-cygreregular" 
                        />
                    </View>
                    <TouchableOpacity
                        onPress={addCollection}
                        className="bg-primary rounded-[30px] p-2.5 items-center justify-center max-w-[307px]">
                        <Text className="text-white  font-cygrebold leading-[19.2px]">Save</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}


export default CreateCollection;