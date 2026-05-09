import { View, Text, ScrollView, TextInput, Image, Platform, KeyboardAvoidingView } from 'react-native'
import { TouchableOpacity } from 'react-native';
import React, { useState, useRef, useEffect, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {  router } from 'expo-router';
import Stage from '../../components/Stage';
import { icons } from '../../constants';
import useTimer from '../hooks/useTimer';
import { UserContext } from '../../context/UserContext';
import axios from '../../network/axios';


const Verification = () => {
  

  return (
    <SafeAreaView className="bg-[#F7F7F7] h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className='w-full flex-1 justify-between'>
          <View className="w-full h-full justify-between max-h-[60%] pt-[23px] items-start">
            <View className="px-[25px] pt-10 pb-9"></View>
            <View className="w-full h-full justify-start px-[31px] max-h-[320px]">
              <View className="w-full flex-row items-center justify-center">
                <Stage />
                <Stage active={true} styles={'mx-[10px]'} />
                <Stage />
              </View>
              <SentTo />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const SentTo = () => {

  const { recoveryEmail, setRecoveryEmail } = useContext(UserContext);

  const { formattedTime, seconds, minutes, resetTimer } = useTimer(0, 25);

  const inputRef = useRef(null);

  const handleEditEmail = (e) => {
    setRecoveryEmail(e)
  }

  //gotta figure out how to share inserted email address

  const handleOnEditIconClick = () => {
    inputRef.current.focus();
  }

  return <View className="mt-[42px] items-center">
    <Text className="font-roboto font-medium leading-[20px] tracking-[.1px] text-[#373737] text-center">Sent To</Text>
    <View className="bg-[#EFEFEF] relative rounded-[5px] h-[36px] w-[247px] flex-row justify-between items-center px-[16px] mt-[16px]">
      <TextInput
        value={recoveryEmail}
        onChangeText={handleEditEmail}
        className="font-medium font-roboto text-[#777777] text-[14px] max-w-[180px]"  />
      <TouchableOpacity onPress={handleOnEditIconClick}>
        <View className='relative rounded-[5px] bg-primary w-[24px] items-center justify-center h-[24px]'>
          <Image source={icons.edit} className='w-[16px] h-[16px] absolute' />
        </View>
      </TouchableOpacity>
    </View>
    <View className="mt-[50px] items-center">
      <TimeLeft
        time={formattedTime} 
      />
      <DigitSellInput
        email={recoveryEmail}
      />
      <ResendButton
        resetTimer={resetTimer}
        seconds={seconds}
        minutes={minutes}
      />
    </View>
  </View>
}


const TimeLeft = ({ time }) => {
  return ( 
    <Text className="text-[15px] leading-[20px] tracking-[.1px] text-[#262626] font-robotoblack font-bold text-center mt-[12px]">
        {time}
    </Text>
  );
}


const ResendButton = ({ minutes, seconds, resetTimer }) => {

  return <>
      { seconds === 0 && minutes === 0 && (
        <TouchableOpacity onPress={() => resetTimer()} className="border border-[#000000] rounded-[100px] mt-[47px] w-[327px] h-[40px] items-center justify-center">
          <Text className="text-sm leading-[20px] tracking-[.1px] font-medium font-roboto">Resend Code</Text>
        </TouchableOpacity>
      ) }
  </>
}

const DigitSell = ({ value, onFocus, isError }) => {

  return (
    <View className={`border border-[#000000] items-center justify-center mr-2 rounded-[12px] w-[50px] h-[57px] ${isError ? 'border-2 border-[#E86F68]' : ''}`}>
      <TextInput
        maxLength={1}
        value={value}
        showSoftInputOnFocus={false}
        onFocus={() => onFocus()}
        keyboardType='numeric'
        className={`text-[35px] leading-[50px] tracking-[.1px] justify-center items-center font-roboto font-medium text-center ${isError ? 'text-[#E86F68]' : ''}`}
      />
    </View>
  );
}

const DigitSellInput = ({ email }) => {

  const { verificationCode, setVerificationCode } = useContext(UserContext);

  const [isVerificationCodeError, setIsVerificationCodeError] = useState(false);

  const inputRef = useRef(null);

  const focusDigitInput = () => {
    inputRef.current?.focus();
  }

  const verifyCode = async () => {
      try {
        await axios.post('/code-verify', { email: email, code: verificationCode })
        setIsVerificationCodeError(false);
        router.replace('/new-password')
      } catch(error) {
        //handle code expiration case
        console.log(error);
        setIsVerificationCodeError(true);
      }
  }

  useEffect(() => {
    inputRef.current?.focus();
  }, [])

  useEffect(() => {
      if (verificationCode.length === 4) {
        verifyCode()
      }
    }, [verificationCode]);

  return  (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="w-full mt-[24px] flex-row">

        <TextInput
          className="opacity-0 w-[1px]"
          keyboardType="numeric"
          ref={inputRef}
          maxLength={4}
          value={verificationCode}
          onChangeText={(e) => setVerificationCode(e) }
        />
        <DigitSell
          value={verificationCode.length > 0 ? verificationCode[0] : null}
          onFocus={focusDigitInput}
          isError={isVerificationCodeError}

        />
        <DigitSell
          value={verificationCode.length > 1 ? verificationCode[1] : null}
          onFocus={focusDigitInput}
          isError={isVerificationCodeError}
        />
        <DigitSell
          value={verificationCode.length > 2 ? verificationCode[2] : null} 
          onFocus={focusDigitInput}
          isError={isVerificationCodeError}
        />
        <DigitSell
          value={verificationCode.length > 3 ? verificationCode[3] : null}
          onFocus={focusDigitInput}
          isError={isVerificationCodeError}
        />
        </KeyboardAvoidingView>

      { isVerificationCodeError ? (
        <Text className="leading-[20px] tracking-[.1px] font-medium font-roboto mt-[11px] text-[12px] text-[#E86F68]">
          Wrong Code
        </Text>
      ) : <></> } 

    </>
  );
}


export default Verification;