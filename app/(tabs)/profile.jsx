import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Alert,
    Linking,
    ActivityIndicator,
    Share,
    Platform
} from "react-native";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from '@expo/vector-icons';
import { router } from "expo-router";
import { useContext, useState } from "react";
import * as Sharing from 'expo-sharing';
import axios from '../../network/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    PremiumBenefitsIcon,
    LogoutIcon,
    StarIcon,
    ImportIcon,
    ResetDataIcon,
    SubscriptionIcon,
    BugIcon,
    ExportIcon,
    ShareIcon,
    NotificationIcon,
    InstagramIcon,
    TikTokIcon,
    PrivacyIcon,
    TermsIcon,
    DeleteAccountIcon,
    DiceIcon,
    ActivationIcon,
} from "../../components/Svg";
import { UserContext } from "../../context/UserContext";
import * as FileSystem from 'expo-file-system/legacy';



const Profile = () => {

    const [isExporting, setIsExporting] = useState(false);

    const { user, setUser } = useContext(UserContext);

    const handleExportData = async () => {
        setIsExporting(true);
        
        try {
            const isAvailable = await Sharing.isAvailableAsync();
            if (!isAvailable) {
                Alert.alert('Error', 'Sharing is not available on this device');
                return;
            }

            // Get the auth token
            const token = await AsyncStorage.getItem('accessToken');

            // Create filename with date
            const date = new Date().toISOString().split('T')[0];
            const fileName = `bookish-export-${date}.json`;
            const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

            // Download file directly
            const response = await FileSystem.downloadAsync(
                `${axios.defaults.baseURL}/users/export`,
                fileUri,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status !== 200) {
                throw new Error('Download failed');
            }

            // Open share sheet
            await Sharing.shareAsync(response.uri, {
                mimeType: 'application/json',
                dialogTitle: 'Export Your Bookish Data',
                UTI: 'public.json',
            });

        } catch (error) {
            console.log('Export error:', error);
            Alert.alert(
                'Export Failed',
                'Unable to export your data. Please try again.'
            );
        } finally {
            setIsExporting(false);
        }
    };


    const reportBug = () => {
        const email = 'bekjonibr@gmail.com';
        const subject = 'Bug Report';
        const body = 'Please describe the bug:\n\n';
        const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        Linking.openURL(url);
    };

    const handleReportBug = () => {
        reportBug();
    }

    const handleLogout = async () => {
        Alert.alert(
            "Logout Confirmation",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Yes",
                     onPress: async () => {
                        axios.defaults.headers.common.Authorization = null;
                        await AsyncStorage.removeItem('accessToken');
                        await AsyncStorage.removeItem('refreshToken');
                        setUser(prev => ({...prev, name: '', id: ''}))
                        await GoogleSignin?.signOut();
                        router.replace('/');
                    },
                    style: "destructive"
                }
            ]
        );
    }

    const deleteUserData = async () => {
        try {
            await axios.delete('/users/me');
            axios.defaults.headers.common.Authorization = null;
            await AsyncStorage.removeItem('accessToken');
            await AsyncStorage.removeItem('refreshToken');
            router.replace('/');
        } catch(error) {
            console.log(error);
        }
    }
    
    const resetuserData = async () => { 
        try {
            await axios.put('users/progress');
            router.replace('home');
        } catch(error) {
            console.log(error);
        }
    }

    const handleResetUserData = () => {
        Alert.alert(
            "Reset Progress",
            "Are you sure you want to reset your progress? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Reset",
                    onPress: async () => await resetuserData(),
                    style: "destructive"
                }
            ]
        );
    }

    const handleDeleteUserData = () => {
        Alert.alert(
            "Delete Account",
            "Are you sure you want to delete your account? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete",
                    onPress: async () => await deleteUserData(),
                    style: "destructive"
                }
            ]
        );
    }

    const handleManageRecommendations = () => {
        router.push('manage-recommendations');
    }

    const openPrivacyPolicy = () => {
        Linking.openURL(`${process.env.EXPO_PUBLIC_WEBSITE_URL}/#privacy`);
    };

    const openTermsOfUse = () => {
        Linking.openURL(`${process.env.EXPO_PUBLIC_WEBSITE_URL}/#terms`);
    };

    const handleShareApp = async () => {

        const appStoreUrl = 'https://apps.apple.com/app/your-app-id';

        const playStoreUrl = process.env.EXPO_PUBLIC_PLAYSTORE_URL;
        
        // Or use a universal link that redirects
        const universalLink = `${process.env.EXPO_PUBLIC_WEBSITE_URL}/download`;
        
        const message = Platform.select({
            //ios: `I've been tracking my reading with Bookish 📚✨ Check it out: ${appStoreUrl}`,
            android: `I've been tracking my reading with Bookish 📚✨ Check it out: ${playStoreUrl}`,
            default: `I've been tracking my reading with Bookish 📚✨ Check it out: ${universalLink}`
        });

        try {
            await Share.share({
                message,
                title: 'Share Bookish'
            });

        } catch (error) {
            console.log(error);
        }
    };

    const handleImport = () => {
        Alert.alert(
            'Coming Soon',
            'Import functionality will be available in a future update!'
        );
    }

    const handleManageNotificationSettigns = () => {
        router.push('notification-setting');
    }

    const handleRateAndReview = () => {
        Alert.alert(
            'We\'d Love Your Feedback!',
            'We\'re not on the stores yet, but your feedback helps us improve!',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Send Feedback',
                    onPress: () => {
                        const email = 'bekjonibr@gmail.com';
                        const subject = 'Bookish Feedback';
                        const body = 'Hey! Here\'s my feedback:\n\n';
                        const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                        Linking.openURL(url);
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView className="bg-[#F7F7F7] h-full flex-1">
            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
                <View className="max-h-[60px] justify-between items-center flex-row h-full mx-5 mb-7">
                    <TouchableOpacity
                        activeOpacity={0.7}
                        className="flex-1 pt-3 flex-row"
                    >
                        <Text className="font-cygrebold text-[24px] leading-[28.8px] text-[#121F16]">Profile</Text>
                    </TouchableOpacity>
                </View>
                <View className="mx-5 max-h-[150px]">
                    { !user?.isPremiumUser ? (
                        <TouchableOpacity
                            onPress={() => router.push('special-offer')}
                            className="bg-[#1C1C1C] mb-6 max-h-[120px] h-full rounded-[20px] border-[.3px] border-[#8A8A8A] flex-row justify-between px-6 items-center">
                            <View className="py-4 max-w-[70%]">
                                <Text className="font-cygrebold leading-[19.2px] text-white text-[18px]">Enjoy Premium Benefits!</Text>
                                <Text className="text-[12px] font-cygreregular text-white max-w-[175px]">Enter your Beast Mode full potential :) Enlarge your knowledge with the price of a cup of coffee.</Text>
                            </View>
                            <View className="mt-2.5">
                                <PremiumBenefitsIcon />
                            </View>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            className="bg-[#1C1C1C] mb-6 max-h-[120px] h-full rounded-[20px] border-[.3px] border-[#8A8A8A] flex-row justify-between pl-6 items-center">
                            <View className="py-4 max-w-[70%]">
                                <Text className="font-cygrebold leading-[19.2px] text-white text-[18px]">You're a premium user!</Text>
                                <Text className="text-[12px] font-cygreregular text-white max-w-[175px]">Thank you very much for your support!</Text>
                                <Text className="text-[12px] font-cygreregular text-white max-w-[175px]">Enjoy premium benefits such as Memory Calendar and
                                    Bookish Beasts for keep a streak  </Text>
                            </View>
                            <View className="justify-self-end">
                                <ActivationIcon />
                            </View>
                        </TouchableOpacity>
                    ) }
                </View>
                <View className="mx-5">
                    <TouchableOpacity
                        className="border-[#727272] border-[.5px] bg-[#FFFFFF] rounded-[15px] py-4 px-3"
                        onPress={() => router.push('set-strike')}>
                            <View>
                                <View className="flex-row mb-5">
                                    <View className="flex-[.9]">
                                        <Text className="text-primary text-[18px] font-cygrebold mb-4">Update Your Preferences</Text>
                                        <Text className="text-[#1C1C1C] text-[12px] font-cygreregular">Go through the onboarding steps to either refresh initial preferences or set new, if skipped onboarding at first.</Text>
                                    </View>
                                    <View className="flex-[.5]">
                                        <DiceIcon />
                                    </View>
                                </View>
                                <View className="flex-row flex-wrap gap-2">
                                    <View className="rounded-[20px] bg-[#EEEEEE] px-2">
                                        <Text className="text-[#1C1C1C] text-[12px] font-cygrebold">Unlock Personal Reading Plan</Text>
                                    </View>
                                    <View className="rounded-[20px] bg-[#EEEEEE] px-2">
                                        <Text className="text-[#1C1C1C] text-[12px] font-cygrebold">New Recommendations</Text>
                                    </View>
                                </View>
                            </View>
                    </TouchableOpacity>
                </View>

                <View className="mx-5 max-h-[200px]">
                    <Text className="text-black text-[20px] font-cygrebold mb-4">Settings</Text>
                </View>

                <View className="mx-5 px-7 py-5 rounded-[15px] border-[.5px] border-[#8A8A8A] max-h-[168px] bg-white mb-4">
                    <Text className="text-[18px] font-cygrebold mb-2">General</Text>
                    <Setting
                        onPress={handleManageNotificationSettigns}
                        name={'Notification Settings'}
                        icon={NotificationIcon} 
                    />
                    <Setting
                        onPress={handleManageRecommendations}
                        name={'Manage Recommendations'}
                        icon={StarIcon} 
                    />
                </View>

                <View className="mx-5 px-7 py-5 rounded-[15px] border-[.5px] border-[#8A8A8A] max-h-[223px] bg-white mb-4">
                    <Text className="text-[18px] font-cygrebold mb-2">Data</Text>
                    <Setting
                        onPress={handleImport}
                        name={'Import'}
                        icon={ImportIcon}
                    />
                    <Setting 
                        onPress={handleExportData}
                        name={'Export'} 
                        icon={ExportIcon}
                        isLoading={isExporting}
                    />
                    <Setting
                        name={'Reset Progress'}
                        onPress={handleResetUserData}
                        icon={ResetDataIcon} 
                    />
                </View>

                <View className="mx-5 px-7 py-5 rounded-[15px] border-[.5px] border-[#8A8A8A] max-h-[223px] bg-white mb-4">
                    <Text className="text-[18px] font-cygrebold mb-2">Leave a Feedback!</Text>
                    <Setting
                        name={'Share Us with Friends'}
                        onPress={handleShareApp}
                        icon={ShareIcon}
                    />
                    <Setting
                        name={'Rate & Review Us'}
                        onPress={handleRateAndReview}
                        icon={StarIcon} />
                    <Setting
                        name={'Report a Bug'}
                        onPress={handleReportBug}
                        icon={BugIcon} />
                </View>

                <View className="mx-5 px-7 py-5 rounded-[15px] border-[.5px] border-[#8A8A8A] max-h-[161px] bg-white mb-4">
                    <Text className="text-[18px] font-cygrebold mb-2">Let's Connect!</Text>
                    <Setting
                        name={'Follow us on Instagram'}
                        icon={InstagramIcon}
                    />
                    <Setting 
                        name={'Follow us on TikTok'}
                        icon={TikTokIcon} 
                    />
                </View>

                <View className="mx-5 px-7 py-5 rounded-[15px] border-[.5px] border-[#8A8A8A] max-h-[303px] bg-white mb-8">
                    <Text className="text-[18px] font-cygrebold mb-2">Other</Text>
                    <Setting
                        onPress={openPrivacyPolicy}
                        name={'Privacy Policy'}
                        icon={PrivacyIcon} />
                    <Setting
                        onPress={openTermsOfUse}
                        name={'Terms of Use'}
                        icon={TermsIcon} />
                    <Setting
                        name={'Subscription Terms'}
                        icon={SubscriptionIcon} />
                    <Setting
                        name={'Delete Account'}
                        onPress={handleDeleteUserData}
                        icon={DeleteAccountIcon} 
                    />
                    <Setting
                        name={'Logout'}
                        onPress={handleLogout}
                        icon={LogoutIcon} 
                    />
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}


const Setting = ({ icon, name, onPress, className, isLoading = false }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isLoading}
            className={`flex-row items-center mb-2 ${isLoading ? 'opacity-50' : ''}`}
        >
            { icon() }
            <View className="border-b-[#EDEDED] border-b-2 py-2 flex-row flex-1 ml-5 justify-between">
                <Text className="text-[14px] font-cygreregular">{name}</Text>
                {isLoading ? (
                    <ActivityIndicator size="small" color="#000" />
                ) : (
                    <View className="rotate-180">
                        <MaterialIcons name="arrow-back-ios-new" className="-rotate-180" size={18} color="black" />
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}


export default Profile;