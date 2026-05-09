import { View, ScrollView, Text, Alert, Linking, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormField';
import { PrimaryButton } from '../../components/CustomButton';
import { router } from 'expo-router';
import axios from '../../network/axios';
import { UserContext } from '../../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';


const SignUp = () => {

  const inputRef = useRef(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSignUpClick = async () => {
    const { name, email, password } = form;
    if (!name) {
      setErrors(item => ({...item, name: 'Name cannot be empty'}))
      return;
    }
    if (!email) {
      setErrors(item => ({...item, email: 'Email cannot be empty'}))
      return;
    }
    if (!password) {
      setErrors(item => ({...item, password: 'Password cannot be empty'}))
      return;
    }
    await registerUser(email, name, password);
  }

  const resetErrors = () => {
    setErrors({name: '', email: '', password: ''});
  }

  const { setOnboardingState, setUser } = useContext(UserContext);

  const registerUser = async (email, username, password) => {
    try {
      resetErrors();
      const { data } = await axios.post('/users', {
        email,
        username,
        password
      });
      axios.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
      setUser(prev => ({ ...prev, id: data.userId }));
      await AsyncStorage.setItem('accessToken', data.accessToken);
      await AsyncStorage.setItem('refreshToken', data.refreshToken);
      setOnboardingState(state => ({...state, name: username}));
      router.push("onboarding");
    } catch (error) {
      if (error.response) {
        console.log(error.response.data)
        if (error.response.data?.error?.userExists) {
          Alert.alert("Ooooooops....", "This email is already signed!", [
              {
                text: 'Try Again',
                onPress: () => console.log('Cancel pressed'),
                style: 'cancel'
              },
              {
                text: 'Sign in',
                onPress: () => router.push("/sign-in"),
              },
            ],
            {
              cancelable: true,  // Android only - allows tap outside to dismiss
              onDismiss: () => console.log('Alert dismissed')  // iOS only
            }
          );
        }
        setErrors(error.response.data) //could be a bit more simplified
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        //gotta handle something went wrong case
        console.error('Error message:', error.message);
      }
    }
  };

  useEffect(() => {
    inputRef?.current?.focus();
  }, []);

  return (
    <SafeAreaView className="bg-[#F7F7F7] h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="justify-between flex-1 items-center px-[20px] h-full">
          <View className="w-full items-end mt-[70px]">

            <FormField
              inputRef={inputRef}
              title={"Name"}
              placeholder={"Enter your name"} 
              textInputContainerStyles={'border-[.5px]'}
              handleChangeText={e => setForm(prev => ({...prev, name: e}))}
              error={errors.name}
              errorText={errors.name}
            />

            <FormField
              title={"Email"}
              placeholder={"Enter your email"}
              otherStyles={"my-[20px]"} 
              textInputContainerStyles={'border-[.5px]'}
              handleChangeText={e => setForm(prev => ({...prev, email: e}))}
              error={errors.email}
              errorText={errors.email}
            />

            <FormField
              title={"Password"}
              placeholder={"Enter your password"}
              hintText={"* At least 8 characters long"}  
              textInputContainerStyles={'border-[.5px]'}
              handleChangeText={e => setForm(prev => ({...prev, password: e}))}
              error={errors.password}
              errorText={errors.password}
            />

            <PrimaryButton title={"Sign up"}
                handlePress={handleSignUpClick}
                containerStyles={'mx-[20px] self-center mt-4 w-full rounded-3xl max-h-[65px]'}
                textStyles={'text-center justify-center items-center'}
            />

            </View>
            <View className="items-center w-full mb-4">

              <Text className='text-base font-cygreregular text-[#373737]'>
                By signing up you agree, to our
              </Text>
              <View className="flex-row">
                <TouchableOpacity onPress={() => Linking.openURL(`${process.env.EXPO_PUBLIC_WEBSITE_URL}/#terms`)}>
                  <Text className="underline underline-offset-1 text-base font-cygreregular text-[#373737]">
                    Terms of Service
                  </Text>
                </TouchableOpacity>
                <Text className='text-base font-cygreregular text-[#373737]'> and </Text>
                <TouchableOpacity onPress={() => Linking.openURL(`${process.env.EXPO_PUBLIC_WEBSITE_URL}/#privacy`)}>
                  <Text className="underline underline-offset-1 text-base font-cygreregular text-[#373737]">
                    Privacy Policy
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp



const Modal = () => {}

//need this to handle the case with duplicate users