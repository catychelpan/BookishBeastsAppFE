import { StyleSheet, TextInput, TouchableOpacity, View, Image, Alert } from 'react-native'
import { useState } from 'react';
import { icons } from '../constants';
import React from 'react'
import { usePathname } from 'expo-router';
import { router } from 'expo-router';

const SearchInput = ({ initialQuery }) => {

  const pathname = usePathname();

  const [query, setQuery] = useState(initialQuery || '');

  return (
      <View className="border-2 w-full h-16 px-4 bg-black-100 border-black-200 rounded-2xl focus:border-secondary items-center flex-row space-x-4">
        <TextInput
          className="text-base mt-.5 text-white flex-1 font-pregular"
          value={query}
          placeholder={"Search for a video topic"}  
          placeholderTextColor={"#7cdcd0"}
          onChangeText={(e) => setQuery(e)}
         />
          <TouchableOpacity onPress={() => {
            if (!query) return Alert.alert('missing query', 'please input someting to search results across database')
            if (pathname.startsWith('/search')) router.setParams({ query })
            else router.push(`/search/${query}`)
          }}>
            <Image source={icons.search} resizeMode='contain' className="w-5 h-5" />
          </TouchableOpacity>
    </View>
  )
}

export default SearchInput;

const styles = StyleSheet.create({})