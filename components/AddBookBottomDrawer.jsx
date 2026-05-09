import {
    Modal,
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Pressable,
    Animated
} from "react-native";
import { useRef, useEffect } from "react";
import { MaterialIcons } from '@expo/vector-icons';
import { router } from "expo-router";

const AddBookBottomDrawer = ({ isBottomSheetOpen, setIsBottomSheetOpen }) => {

    const windowHeight = Dimensions.get('window').height;

    const slideAnim = useRef(new Animated.Value(0)).current;

    const liftDistance = windowHeight * 0.0001;

    // Function to open the bottom sheet 
    const handleOpenBottomSheet = () => {
        setIsBottomSheetOpen(true);
    };

    // Function to close the bottom sheet
    const handleCloseBottomSheet = () => {
        setIsBottomSheetOpen(false);
    };

    useEffect(() => {
        if (isBottomSheetOpen) {
        slideAnim.setValue(0);
        Animated.timing(slideAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
        }
    }, [isBottomSheetOpen]);

    const translateY = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [windowHeight, -liftDistance],
    });


    return <Modal
            animationType="none"
            transparent={true}
            visible={isBottomSheetOpen}
            onRequestClose={handleOpenBottomSheet}>
                <Pressable
                    onPress={handleCloseBottomSheet}
                    className="absolute transition-opacity h-full w-full z-0 bg-[#3D3D3D61] opacity-[38]">
                </Pressable>
                <Animated.View
                    className="rounded-t-[30px] p-4 z-10"
                    style={[styles.bottomSheet, { height: '30%', transform: [{ translateY }],
                    }]}>

                    <Text className="text-[#000000] mb-6 font-cygrebold text-[22px] leading-[26.4px]">Add a Book</Text>
                    <TouchableOpacity
                        onPress={() => {
                            setIsBottomSheetOpen(false);
                            router.push("/(auth)/search-book")
                        }}
                        className="rounded-[15px] bg-[#1C1C1C] max-h-[56px] w-full h-full flex-row items-center px-7 max-w-[360px] mb-2">
                        <MaterialIcons name='search' size={25} color={'#fff'} />
                        <Text className="text-[#FEFEFC] font-cygrebold leading-[19.2px] ml-6">Add By Search</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            setIsBottomSheetOpen(false);
                            router.push("/(auth)/add-book")
                        }}
                        className="rounded-[15px] bg-[#1C1C1C] max-h-[56px] w-full h-full flex-row items-center px-7 max-w-[360px] mb-2">
                        <MaterialIcons name='keyboard' size={25} color={'#fff'} />
                        <Text className="text-[#FEFEFC] font-cygrebold leading-[19.2px] ml-6">Add Manually</Text>
                    </TouchableOpacity>
                </Animated.View>
        </Modal>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomSheet: {
        position: 'absolute',
        left: 0,
        right: 0,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingVertical: 23,
        paddingHorizontal: 25,
        bottom: 0,
    },
});


export default AddBookBottomDrawer;




