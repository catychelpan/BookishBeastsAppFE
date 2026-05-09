import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Pressable,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { MaterialIcons } from '@expo/vector-icons';
import { RepetitionGroupIcon } from "../../components/Svg";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import axios from '../../network/axios';


//TODO: extract out into utility functions
function splitArray(arr) {
    const midpoint = Math.ceil(arr.length / 2);
    const firstHalf = arr.slice(0, midpoint);
    const secondHalf = arr.slice(midpoint);
    return [firstHalf, secondHalf];
}

const RepetitionGroups = () => {

    const handleInputTextChange = () => {}

    const [firstHalfCollections, setFirstHalfCollections] = useState([]);

    const [secondHalfCollections, setSecondtHalfCollections] = useState([]);

    const [selectedGroups, setSelectedGroups] = useState([]);

    const { setNote, note: { repetitinGroups } } = useContext(UserContext);

    const handleSave = () => {

        const first = firstHalfCollections
            .filter(item => item.selected)
            .map(item => ({ id: item.id, name: item.name}))
        const second = secondHalfCollections
            .filter(item => item.selected)
            .map(item => ({ id: item.id, name: item.name }));

        const groups = first.concat(second);

        console.log(groups);

        setNote(prev => ({...prev, repetitinGroups: groups}))

        router.back();
    }

    const handleFirstHalfSelection = (selectedId) => {
        setFirstHalfCollections(prev => 
            prev.map(c => 
                c.id === selectedId
                    ? { ...c, selected: !c.selected }
                    : {...c}
            )
        );
    };

    const handleSecondHalfSelection = (selectedId) => {
        setSecondtHalfCollections(prev => 
            prev.map(c => 
                c.id === selectedId
                    ? { ...c, selected: !c.selected }
                    : {...c}
            )
        );
    };

    const fetchGroups = async () => {
        try {
            const { data } = await axios.get('users/repetition-groups');

            const [first, second] = splitArray(data);
            
            //we need groups variable in case there are already selected collections
            const firstMapped = first.map(item => ({...item, selected: repetitinGroups?.some(j => j.id === item.id) ? true : false })); //probably wiser to receiver from backed selected false
            const secondMapped = second.map(item => ({...item, selected: repetitinGroups?.some(j => j.id === item.id) ? true : false }));
            setFirstHalfCollections(firstMapped);
            setSecondtHalfCollections(secondMapped);
        } catch(error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchGroups();
    }, []);
    
    return <SafeAreaView className="bg-[#F7F7F7] h-full max-h-full">
            <View className="max-h-[60px] justify-between items-center flex-row h-full mx-5 mb-7">
                <View className="flex-row items-center mt-2">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="flex-1 mr-5 max-w-[44px] w-full items-center justify-center rounded-[10px]">
                            <MaterialIcons name="close" size={24} color="black" />
                    </TouchableOpacity>
{/*                     <Text className="text-black font-cygrebold text-[22px] font-bold">Create Note</Text> */}
                </View>
                <TouchableOpacity
                    className="bg-primary rounded-[30px] flex-1 mt-2.5 max-w-[110px] w-full items-center justify-center max-h-[48px] h-full py-2 px-4">
                        <Text className="leading-[19.2px] text-[#fff] font-cygrebold">Save</Text>
                </TouchableOpacity>
            </View>
            <KeyboardAvoidingView
                className="mx-5 max-h-[150px] flex-1"
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >

                <Text className="text-black mt-6 text-[22px] font-cygrebold leading-[26.4px] font-bold">Select Repetition Groups</Text>
                <View className="bg-[#ffffff] mt-5 mb-7 border-[.3px] border-[#727272] items-center max-h-[43px] h-full flex-row justify-between w-full rounded-[26px] px-5">
                    <MaterialIcons name="search" color={'#1C1C1C'} size={22} />
                    <TextInput
                        className="bg-[#ffffff] font-cygreregular justify-center items-center flex-1 pl-4 text-[#000000] leading-[16.8px] text-sm"
                        placeholder="Search group"
                    />
                    <TouchableOpacity
                        onPress={() => handleInputTextChange('')}
                        className="rounded-full bg-[#000] p-1">
                        <MaterialIcons name='close' color={'#fff'} size={14} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
            <ScrollView className="px-5 flex-1">
                <View className="flex-row w-full">
                    <View className="w-full flex-[.5]">
                        <NewGroup />
                        <ExistingGroup name={"Self Development"} containerStyles={'my-4'} />
                    </View>
                    <View className="w-full flex-[.5]">
                        <ExistingGroup name={"Anatomy Midterm"} />
                    </View>
                </View>

            </ScrollView>
    </SafeAreaView>
}


const NewGroup = () => {

    return <View className="rounded-[17px] flex-row rounded-br-[44px] bg-black max-w-[171px] w-full h-[114px] p-4">
        <Text className="font-cygrebold max-w-[83px] text-[18px] text-[#fff] leading-[21.6px]">Add new group</Text>
        <TouchableOpacity
            className="items-center self-end flex-1 justify-center">
                <View className="bg-[#fff] max-w-[50px] max-h-[50px] items-center justify-center w-full h-full rounded-full ">
                    <MaterialIcons name="add" size={30} color={'black'} />
                </View>
        </TouchableOpacity>
    </View>
}

const ExistingGroup = ({ name, cardsAmount, selected, onSelect, containerStyles }) => {

    const breakTitleIfNecessaryAndRender = () => {
        if (name && name.length >= 15) {
            const names = name.split(' ')
            return names.map(item => <Text 
                    key={item}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    className="font-cygrebold self-start bg-[#F7F7F7] px-2 py-1 text-[18px] rounded-[15px] text-black leading-[17.2px]">{item}</Text>)
        }
        return <Text className="font-cygrebold bg-[#F7F7F7] px-2 py-1 text-[18px] rounded-[15px] text-black text-center leading-[17.2px]">{name}</Text>
    }

    return <View
            className={`rounded-[17px] overflow-hidden relative bg-[#F8846A] max-w-[171px] w-full h-[114px] px-4 pt-5 pb-2 ${containerStyles}`}>
        <View className="mb-2 flex-wrap">
            {breakTitleIfNecessaryAndRender()}
        </View>
        <View
            className="items-end self-end bg-[#F7F7F7] rounded-[21px]">
                <Text className="px-2.5 py-1 text-[12px] font-medium">20 cards</Text>
        </View>
        <View className="absolute right-0 -z-10">
            <RepetitionGroupIcon />
        </View>
    </View>
}


export default RepetitionGroups;