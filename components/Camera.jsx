import { CameraView, useCameraPermissions } from 'expo-camera';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Button
} from "react-native";
import { useContext, useRef, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const Camera = () => {
    const cameraRef = useRef();
    const { setMemo } = useContext(UserContext);
    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
        <View style={styles.container}>
            <Text style={styles.message}>We need your permission to show the camera</Text>
            <Button onPress={requestPermission} title="grant permission" />
        </View>
        );
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    const handleTakePicture = async () => {
        try {
            const res = await cameraRef.current?.takePictureAsync({ base64: true, exif: true });
            if (res) {

                const response = await fetch(res.uri);
                
                // Convert to blob (binary data)
                const blob = await response.blob();


                setMemo(prev => ({...prev, imageUri: res.uri, imageBlob: blob}));

                router.back();

            }
        } catch(error) {
            console.log(error);
        }
    }

    return (
        <View style={styles.container}>
            <CameraView
                ref={cameraRef}
                style={styles.camera} 
                facing={facing}>
                <View style={styles.controlsContainer}>
                    <View style={styles.bottomControls}>
                        <View style={styles.spacer} />
                        <TouchableOpacity 
                            style={styles.shutterButton}
                            onPress={handleTakePicture}
                            activeOpacity={0.8}>
                            <View style={styles.shutterInner} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.flipButton}
                            onPress={toggleCameraFacing}
                            activeOpacity={0.8}>
                            <MaterialIcons name="flip-camera-ios" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    controlsContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingVertical: 50,
    },
    bottomControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    spacer: {
        width: 50, // Same width as flip button to keep shutter centered
    },
    shutterButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 4,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    shutterInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'white',
    },
    flipButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    flipIconContainer: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    flipIconOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    flipIconInner: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'white',
    },
    flipArrows: {
        position: 'absolute',
        top: -2,
        right: -8,
    },
});

export default Camera;