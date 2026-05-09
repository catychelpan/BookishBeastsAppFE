import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useEffect, useState } from "react";
import FormField from './FormField';
import BookBottomDrawer from "./BottomDrawer";
import axios from '../network/axios';


const defaultColors = {
    black: false,
    orange: false,
    lightYellow: false,
    brightYellow: false,
    green: false,
    blue: false,
    violet: false,
    pink: false,
    turquoise: false,
    red: false,
    brown: false,
    oliveGreen: false
}

const CreateNoteTypeDrawer = ({ isNoteTypeDrawerOpen, setIsNoteTypeDrawerOpen, onClose}) => {

    const [name, setName] = useState('');
    const [icon, setIcon] = useState('');
    const [error, setError] = useState({ icon: '', name: '', color: '' });

    const [colors, setColors] = useState({
        black: true,
        orange: false,
        lightYellow: false,
        brightYellow: false,
        green: false,
        blue: false,
        violet: false,
        pink: false,
        turquoise: false,
        red: false,
        brown: false,
        oliveGreen: false
    });

    const getColorHesh = (color) => {
        switch(color) {
            case 'black':
                return '#000';
            case 'orange':
                return '#F8846A';
            case 'lightYellow':
                return '#FFCA57';
            case 'brightYellow':
                return '#FFF946';
            case 'green':
                return '#1BBA3B';
            case 'blue':
                return '#4D81E0';
            case 'violet':
                return '#633EE9';
            case 'pink':
                return '#F473C0';
            case 'turquoise':
               return '#7AD4DE';
            case 'red':
               return '#9D1414';
            case 'brown':
                return '#6F3416';
            case 'oliveGreen':
                return '#65875A';
            default:
                return '#fff';
        }
    }

    const getColor = () => {
        return Object.keys(colors).find(key => colors[key] === true);
    }

    const hasErrors = () => {
        return !name || !icon || !getColor();
    }

    const validateAll = () => {
        if (!name) setNameError('Name cannot be empty');
        //if (!icon || !isLetter(icon)) setIconError('Input should be an icon');
        if (!getColor()) setColorError('Choose note color');
    }

    const clearAllErrors = () => {
        setIconError('')
        setNameError('')
        setColorError('')
    }

    const handleSaveNoteType = async () => {
        try {
            const color = getColorHesh(getColor());
            validateAll();
            //console.log("hasError: ", hasErrors());
            if (hasErrors()) return;
            
            await axios.post('users/note/type', {
                color: color,
                name: name,
                icon: icon
            });
            
            clearAllErrors();
            setIsNoteTypeDrawerOpen(false);
        } catch(error) {
            console.log(error);
        }
    }

    const handleNameChange = (name) => {
        if (!name) {
            setNameError('Name cannot be empty');
            setName(name);
        } else {
            setName(name);
        }
    }

    const handleColorChange = (color) => {
        setColors(() => ({...defaultColors, [color]: !colors[color]}))
    }

    const handleIconChange = (iconArg) => {
/*         if (isLetter(iconArg.at(-1))) {
            //emoji takes up 2 letter spaces, so we should should take into account for two letter case
            setIconError('Input should be an icon')
        } 
        else {
            setIconError('')
        } */
        setIcon(iconArg);
    }

    const getIconError = () => {
        return error['icon'];
    }

    const getNameError = () => {
        return error['name'];
    }

    const getColorError = () => {
        return error['color'];
    }

    const setIconError = (error) => {
        setError(prev => ({...prev, icon: error}));
    }

    const setNameError = (error) => {
        setError(prev => ({...prev, name: error}));
    }

    const setColorError = (error) => {
        setError(prev => ({...prev, color: error}));
    }

    const isLetter = (char) => {
        return /^\p{L}$/u.test(char);
    };

    const ColorButton = ({ color, borderColor, bgColor }) => (
        <TouchableOpacity
            onPress={() => handleColorChange(color)}
            className={`border-[2px] rounded-[6px] max-w-[29px] w-full h-[28px]`}
            style={{ backgroundColor: colors[color] ? bgColor : '', borderColor: borderColor }}
        />
    );

    useEffect(() => {
        return () => {
            clearAllErrors();
        }
    }, []);

    return (
        <BookBottomDrawer
                height="80%"
                isBottomSheetOpen={isNoteTypeDrawerOpen}
                setIsBottomSheetOpen={setIsNoteTypeDrawerOpen}
                onClose={onClose}
                containerStyles={'pb-0'}
            >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
            >
                <ScrollView 
                    className="flex-1"
                    contentInsetAdjustmentBehavior="automatic"
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={{ flex: 1 }} className="w-full">
                        <Text className="font-cygrebold text-[22px] mt-9 leading-[26.4px] text-center">
                            Create New Type
                        </Text>

                        <View className={`mt-6 rounded-[20px] items-center border-[.5px] py-4 ${!getColor() ? 'border-red' : ''}`}>
                            <View className="flex-row mb-6 justify-evenly w-full">
                                <ColorButton color="black" borderColor="#000" bgColor="#000" />
                                <ColorButton color="orange" borderColor="#F8846A" bgColor="#F8846A" />
                                <ColorButton color="lightYellow" borderColor="#FFCA57" bgColor="#FFCA57" />
                                <ColorButton color="brightYellow" borderColor="#FFF946" bgColor="#FFF946" />
                                <ColorButton color="green" borderColor="#1BBA3B" bgColor="#1BBA3B" />
                                <ColorButton color="blue" borderColor="#4D81E0" bgColor="#4D81E0" />
                            </View>
                            <View className="flex-row justify-evenly w-full">
                                <ColorButton color="violet" borderColor="#633EE9" bgColor="#633EE9" />
                                <ColorButton color="pink" borderColor="#F473C0" bgColor="#F473C0" />
                                <ColorButton color="turquoise" borderColor="#7AD4DE" bgColor="#7AD4DE" />
                                <ColorButton color="red" borderColor="#9D1414" bgColor="#9D1414" />
                                <ColorButton color="brown" borderColor="#6F3416" bgColor="#6F3416" />
                                <ColorButton color="oliveGreen" borderColor="#65875A" bgColor="#65875A" />
                            </View>
                        </View>
                        { !getColor() && (
                            <Text className='font-cygrebold max-h-[20px] text-[12px] text-red'>{getColorError()}</Text>
                        ) }
                        <View className="mt-6" style={{ flex: 1 }}>
                            <FormField
                                value={name}
                                handleChangeText={handleNameChange}
                                title={'Name'}
                                placeholder={'Enter name for this type'}   
                                otherStyles={'mb-5'}
                                error={getNameError()}
                                errorText={getNameError()}
                            />
                            <FormField
                                value={icon}
                                maxLength={2}
                                handleChangeText={handleIconChange}
                                title={'Icon'}
                                placeholder={'Enter emoji for this type'}   
                                otherStyles={'mb-5'}
                                error={getIconError()}
                                errorText={getIconError()}
                            />
                        </View>
                    </View>
                </ScrollView>

                <View style={{ padding: 30 }}>
                    <TouchableOpacity
                        onPress={handleSaveNoteType} 
                        className="bg-black justify-center rounded-[34px] h-[56px] items-center w-full"
                    >
                        <Text className="text-white font-cygrebold text-[18px] text-center">
                            Save
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </BookBottomDrawer>
    );
}


export default CreateNoteTypeDrawer;