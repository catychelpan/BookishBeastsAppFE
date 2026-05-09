import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Pressable,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Image,
    Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import { useState, useRef, useEffect, useContext } from "react";
import { router, useLocalSearchParams } from "expo-router";
import axios from '../../network/axios';
import { images } from "../../constants";
import { QuoteStarsIcon } from "../../components/Svg";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import BottomDrawer from '../../components/BottomDrawer';


const Collection = () => {

    const { name } = useLocalSearchParams();

    const [search, setSearch] = useState('');

    const [isNoteDrawerOpen, setIsNoteDrawerOpen] = useState(false);

    const inputRef = useRef(null);

    const handleInputTextChange = (e) => {
        setSearch(e);
    }

    const handleCloseBtn = () => {}

    return (
        <SafeAreaView className="bg-[#F7F7F7] h-full flex-1">
            <View className="max-h-[60px] justify-between items-center flex-row h-full mx-5 mb-7">
                <View className="flex-row items-center mt-2">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="flex-1 mr-5 max-w-[44px] w-full items-center justify-center rounded-[10px]">
                            <MaterialIcons name="close" size={24} color="black" />
                    </TouchableOpacity>
                    <Text className="text-black font-cygrebold text-[22px] font-bold">{name}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => router.push('note-filters')}
                    className="bg-primary flex-1 mt-2.5 max-w-[44px] w-full items-center justify-center max-h-[44px] h-full rounded-[10px]">
                        <Entypo name="dots-three-vertical" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
            <BottomDrawer
                isBottomSheetOpen={isNoteDrawerOpen}
                setIsBottomSheetOpen={setIsNoteDrawerOpen} 
            >
                <Text className="font-cygrebold text-[22px] leading-[26.4px] text-center">Add Note</Text>
                <TouchableOpacity className="bg-black mt-7 flex-row justify-start pl-6 rounded-[15px] mb-2 max-h-[56px] items-center h-full w-full">
                    <MaterialIcons name="note-add" size={24} color="white" />
                    <Text className="text-white pl-9 font-cygrebold text-[18px]">New</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        setIsNoteDrawerOpen(false);
                    }}
                    className="bg-black flex-row justify-start pl-6 rounded-[15px] max-h-[56px] items-center w-full h-full">
                    <FontAwesome6 name="sticky-note" size={24} color="white" />
                    <Text className="text-white pl-9 font-cygrebold text-[18px]">Existing</Text>
                </TouchableOpacity>
            </BottomDrawer>
            <KeyboardAvoidingView
                className="mx-5"
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}>
                <View className="bg-[#ffffff] border border-[#6592E3] items-center max-h-[43px] h-full flex-row justify-between w-full rounded-[26px] px-5">
                    <MaterialIcons name="search" color={'#6592E3'} size={22} />
                    <TextInput
                        ref={inputRef}
                        value={search}
                        onChangeText={handleInputTextChange}
                        className="bg-[#ffffff] font-cygreregular justify-center items-center flex-1 pl-4 text-[#000000] leading-[16.8px] text-sm"
                        placeholder="Search a note"
                    />
                    <TouchableOpacity onPress={handleCloseBtn} className="rounded-full bg-[#000] p-1">
                        <MaterialIcons name='close' color={'#fff'} size={14} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
            <View className="flex-1 items-center">
                <Text className="text-[22px] mb-10 text-black leading-[26.4px] font-cygrebold">Can’t see anything here</Text>
                <Image source={images.noteEyes} width={255} height={54} className="max-w-[255px] max-h-[54px]" />
            </View>
            <TouchableOpacity
                onPress={() => setIsNoteDrawerOpen(true)}
                className="mx-5 mb-10 bg-black max-h-[106px] h-full flex-row justify-between pr-10 items-center rounded-[20px]">
                <View className="mx-7">
                    <Text className="font-cygrebold leading-[19.2px] text-[18px] font-bold text-[#FFFFFF] max-w-[136px]">Add notes to this collection</Text>
                </View>
                <QuoteStarsIcon />
            </TouchableOpacity>
        </SafeAreaView>
    )
}


export default Collection;