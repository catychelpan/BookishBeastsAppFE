import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, TouchableOpacity, View, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';
import { images } from '../constants';
import { PrimaryButton, SignInWithProvider } from '../components/CustomButton';
import { LocaleConfig } from 'react-native-calendars';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import axios from '../network/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import WelcomeIcon from '../components/WelcomeIconSvg';

GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID, // From Google Cloud Console
    offlineAccess: true,
});

LocaleConfig.locales['en'] = {
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ],
  monthNamesShort: ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  today: "Today"
};


LocaleConfig.defaultLocale = 'en';


export default function App() {

  const { setUser, setOnboardingState } = useContext(UserContext);

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const { data: { idToken, user: { email, name } }} = await GoogleSignin.signIn();
      //console.log(user)
      const { data } = await axios.post('users/sign-in/google', { idToken: idToken, email: email, username: name });

      axios.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
      setUser(prev => ({ ...prev, id: data.userId, isPremiumUser: data?.isPremiumUser }));
      await AsyncStorage.setItem('accessToken', data.accessToken);
      await AsyncStorage.setItem('refreshToken', data.refreshToken);
      setOnboardingState(state => ({...state, name: name}));
      if (!data?.hasCompletedOnboarding) {
        router.push("onboarding");
      } else {
        router.replace('(tabs)/home')
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign in in progress');
      } else {
        console.log('Error:', error);
      }
    }
  }

  const routeToHomeIfValidRefreshToken = async () => {
    try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        console.log("Refresh Token:", refreshToken);

        // Call your refresh endpoint
        if (!refreshToken) {
          return;
        }
        const response = await axios.post(`${axios.defaults.baseURL}/refresh`,
          { refreshToken },
          {
            headers: { 'Content-Type': 'application/json' }
          }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Store new tokens
        await AsyncStorage.setItem('accessToken', accessToken);
        await AsyncStorage.setItem('refreshToken', newRefreshToken);

        // Update authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        router.push('(tabs)/home');
      }
      catch(error) {
        console.log(error);
      }
    }

  useEffect(() => {
    routeToHomeIfValidRefreshToken();
  }, []);

    return (
        <SafeAreaView className="h-full bg-[#F7F7F7] flex-1">
                <View className="py-5 w-full">
                    <Text className="font-cygrebold color-[#000000] pb-2 text-center text-[24px]">Welcome To Bookish Beasts !</Text>
                    <View className="font-cygreregular leading-[20px] text-center px-8 w-full"> 

                        <View>
                            <Text className="text-[#000000] font-cygreregular leading-[20px] text-center w-full text-[16px]">Read. Remember. Enjoy. </Text>
                        </View>
                        <View>
                            <Text className="text-[#000000] font-cygreregular leading-[20px] text-center w-full text-[16px]">Start setting up your account to begin your personolized reading journey.</Text>
                        </View>

                    </View>
                </View>
                <View className="items-center mt-8">
{/*                     <Image source={images.welcome} resizeMode='cover' className='max-w-[185px] max-h-[202px]' /> */}
                <WelcomeIcon />
                </View>
                <View className='items-center my-4 px-[20px]'>
                    <PrimaryButton title={"Sign up"}
                        handlePress={() => router.push('sign-up')}
                        containerStyles={'max-w-[353px] w-full rounded-3xl'}
                        textStyles={'text-center justify-center items-center'}
                    />
                </View>
                <View className='items-center px-[20px]'>
                    <SignInWithProvider
                        handlePress={handleGoogleSignIn}
                        title={'Continue with Google'}
                        containerStyles={'max-w-[353px] w-full rounded-3xl'}
                        textStyles={'text-center ml-3'} 
                    />
                </View>
                <View className="w-full flex-1 justify-end mb-4">
                    <TouchableOpacity onPress={() => router.push('(auth)/sign-in')}>
                        <Text className='font-cygreregular text-[#373737] text-[16px] text-center'>Sign In</Text>
                    </TouchableOpacity>
                </View>
            <StatusBar backgroundColor='#F7F7F7' style='auto' />
        </SafeAreaView>
    );
}