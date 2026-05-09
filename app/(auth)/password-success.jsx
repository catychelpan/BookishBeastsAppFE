import { View, ScrollView, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router';
import { icons } from '../../constants';


const PasswordSuccess = () => {

  return <SafeAreaView className="bg-[#F7F7F7] h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>

        <View className="items-center w-full flex-1 justify-center">
          
          <Text className="text-black text-[28px] font-bold font-inter leading-[33px] w-[278px] text-center items-center justify-center">
            Password Updated!
          </Text>

          <Image source={icons.passwordSuccess} className="w-[130px] h-[130px] mt-[38px]" />

          <Text className="font-medium font-roboto text-base leading-[20px] my-[40px] tracking-[.1px] w-[222px] text-center">
            You password has been successfully updated.
          </Text>


        </View>
        <View className="mx-[20px] my-7">
          <TouchableOpacity
            onPress={() => router.push('sign-in')}
            className="rounded-[100px] self-center w-full bg-primary h-[52px] items-center justify-center">
            <Text className="font-cygrebold font-bold leading-[20px] text-lg text-[#FEFEFC] text-center">Login</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
}

export default PasswordSuccess;