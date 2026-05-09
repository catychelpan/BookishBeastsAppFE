import { View, ScrollView, Text, TouchableOpacity } from 'react-native'
import React, { useState, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormField';
import { router } from 'expo-router';
import Stage from '../../components/Stage';
import axios from '../../network/axios';
import { UserContext } from '../../context/UserContext';



// usually if password is requested to be reset, there's some time to do this 
// we have to handle the case where user has reset password and refused to actually update it 
// gotta keep the state on the server and redirect to password update screen if user didn't do so 

// also there should be some timeout before user can request password reset again

const NewPassword = () => {

  const [password, setNewPassword] = useState({
    newPasswordRepeated: "",
    newPassword: ""
  });

  const { verificationCode, recoveryEmail } = useContext(UserContext);

  const [isPasswordError, setIsPasswordError] = useState(false);

  const isPasswordInvalid = () => {
    const { newPassword, newPasswordRepeated } = password;
    return newPassword === "" || newPasswordRepeated === "" || newPassword !== newPasswordRepeated 
  }

  const handleUpdate = async () => {
    if (isPasswordInvalid()) {
      setIsPasswordError(true);
    } else {
      await updatePassword()
    }
  }

  const updatePassword = async () => {
    try {
      const { newPassword, newPasswordRepeated } = password;
      await axios.post('/reset-password', {
          email: recoveryEmail,
          verificationCode: verificationCode,
          newPassword, newPasswordRepeated
      });
      router.push('/password-success');
    } catch (error) {
      console.log(error);
    }
  }

  return <SafeAreaView className="bg-[#F7F7F7] h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className='w-full flex-1 justify-between'>
          <View className="w-full h-full justify-between max-h-[60%] pt-[23px] items-start">
            <View className="font-inter text-[24px] text-[#000000] font-bold px-[25px] pt-10 pb-9"></View>
            <View className="w-full h-full justify-start px-[31px] max-h-[320px]">

              <View className="w-full items-center justify-center flex-row">
                <Stage />
                <Stage styles={'mx-[10px]'} />
                <Stage active={true} />
              </View>

              <View className="w-full mt-[63px]">

                <FormField
                  title={"New Password"}
                  titleStyles={"font-cygrebold text-black font-medium text-sm leading-[20px]"}
                  placeholder={'At least 8 characters'}
                  placeholderTextColor={"#777777"}
                  textInputStyles={'bg-[#EFEFEF] text-[12px] leading-[20px] tracking-[.1px] font-roboto font-semibold'}
                  textInputContainerStyles={'bg-[#EFEFEF] rounded-[5px] border-0'}
                  otherStyles={'max-h-[52px] h-full mb-[50px]'}
                  handleChangeText={(e) => setNewPassword(prev => ({ ...prev, newPasswordRepeated: e })) }
                  value={password.newPasswordRepeated}
                  error={isPasswordError}
                />

                <FormField
                  title={"Password"}
                  titleStyles={"font-cygrebold text-black  font-medium text-sm leading-[20px]"}
                  placeholder={'Confirm password'}
                  placeholderTextColor={"#777777"}
                  textInputStyles={'bg-[#EFEFEF] text-[12px] leading-[20px] tracking-[.1px] font-roboto font-semibold'}
                  textInputContainerStyles={'bg-[#EFEFEF] rounded-[5px] border-0'}
                  otherStyles={'max-h-[52px] h-full mb-[25px]'}
                  handleChangeText={(e) => setNewPassword(prev => ({ ...prev, newPassword: e })) }
                  value={password.newPassword}
                  error={isPasswordError}
                />

                { isPasswordError ? (
                  <Text className="leading-[20px] tracking-[.1px] mb-[30px] font-medium font-roboto text-[10px] text-[#E86F68]">
                    Passwords don’t match! Please try again.
                  </Text>
                ) : <></> } 

                <TouchableOpacity
                  onPress={handleUpdate}
                  className="rounded-[100px] mx-[33px] bg-primary self-center mt-[25px] w-full h-[40px] items-center justify-center">
                  <Text className="text-sm font-roboto leading-[20px] tracking-[.1px] text-white text-center">Update</Text>
                </TouchableOpacity>

              </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
}

export default NewPassword;