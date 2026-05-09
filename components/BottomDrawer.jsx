import {
    Modal,
    StyleSheet,
    Dimensions,
    Pressable,
    Animated
} from "react-native";
import { useRef, useEffect } from "react";

const BookBottomDrawer = ({
    children,
    isBottomSheetOpen,
    setIsBottomSheetOpen,
    height,
    pressableContainer,
    onClose, //if onClose is defined, it overrides handleCloseBottom logic
    onOpen,  //if onOpen is defined, it overrides handleCloseBottom logic
    containerStyles 
}) => {

    const windowHeight = Dimensions.get('window').height;

    const slideAnim = useRef(new Animated.Value(0)).current;

    const liftDistance = windowHeight * 0.0001;

    // Function to open the bottom sheet 
    const handleOpenBottomSheet = () => {
        if (onOpen) {
            onOpen();
        } else {
            setIsBottomSheetOpen(true);
        }
    };

    // Function to close the bottom sheet
    const handleCloseBottomSheet = () => {
        if (onClose) {
            onClose();
        } else {
            setIsBottomSheetOpen(false);
        }
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
            animationType="fade"
            transparent={true}
            visible={isBottomSheetOpen}
            className={pressableContainer}
            onRequestClose={handleOpenBottomSheet}>
                <Pressable
                    onPress={handleCloseBottomSheet}
                    className={`absolute transition-opacity h-full w-full  bg-[#3D3D3D61] opacity-[38] ${pressableContainer}`}>
                </Pressable>
                <Animated.View
                    className={`rounded-t-[30px] p-4 z-10 ${containerStyles}`}
                    style={[styles.bottomSheet, { height: height ? height : 'auto', transform: [{ translateY }] }]}>
                        {children}
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


export default BookBottomDrawer;




