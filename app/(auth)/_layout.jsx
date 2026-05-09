import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Text } from 'react-native'

//never-forget is complicated component 

const AuthLayout = () => {
  return (
    <>
      <Stack>
        
{/*         Onboarding Screens */}
        <Stack.Screen name="sign-in" options={{ title: "Sign In", headerTitle: () => <HeaderTitle text={"Sign In"} />, headerTransparent: true }} />
        <Stack.Screen name="sign-up" options={{ title: "Sign Up", headerTitle: () => <HeaderTitle text={"Sign Up"} />, headerTransparent: true}} /> 
        <Stack.Screen name="forgot-password" options={{ title: "Forgot Password", headerTitle: () => <HeaderTitle text={"Forgot Password"} />, headerTransparent: true }} />
        <Stack.Screen name="verification" options={{ title: "Verification", headerTitle: () => <HeaderTitle text={"Verification"} />, headerTransparent: true }} />
        <Stack.Screen name="new-password" options={{ title: "New Password", headerTitle: () => <HeaderTitle text={"New Password"} />, headerTransparent: true }} />

        <Stack.Screen name="password-success" options={{ title: "", headerShown: false }} />
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ title: "", headerBackVisible: false, headerShown: false }} />
        <Stack.Screen name="set-strike" options={{ title: "", headerBackVisible: false, headerShown: false }} />
        <Stack.Screen name="keep-strike" options={{ title: "", headerBackVisible: false, headerShown: false }} />
        <Stack.Screen name="commit-to-growing" options={{ title: "", headerBackVisible: false, headerShown: false }} />
        <Stack.Screen name="never-forget" options={{ title: "", headerBackVisible: false, headerShown: false }} /> 
        <Stack.Screen name="set-books" options={{ title: "", headerBackVisible: false, headerShown: false }} /> 
        <Stack.Screen name="sounds-promising" options={{ title: "", headerBackVisible: false, headerShown: false }} /> 
        <Stack.Screen name="topics-interested" options={{ title: "", headerBackVisible: false, headerShown: false }} /> 
{/*         <Stack.Screen name="people-interested" options={{ title: "", headerBackVisible: false, headerShown: false }} />  */}
        <Stack.Screen name="books-interested" options={{ title: "", headerBackVisible: false, headerShown: false }} /> 
        <Stack.Screen name="reason-for-reading" options={{ title: "", headerBackVisible: false, headerShown: false }} /> 
        <Stack.Screen name="what-a-taste" options={{ title: "", headerBackVisible: false, headerShown: false }} /> 
        <Stack.Screen name="commitment" options={{ title: "", headerBackVisible: false, headerShown: false }} /> 
        <Stack.Screen name="preparing-plan" options={{ title: "", headerBackVisible: false, headerShown: false }} /> 
        <Stack.Screen name="special-offer" options={{ title: "", headerBackVisible: false, headerShown: false }} /> 

{/*         Functional Screens */}
        <Stack.Screen name="search-book" options={{ title: "", headerTransparent: true, headerBackVisible: false, headerShown: false, animation: 'slide_from_bottom' }} /> 

        <Stack.Screen name="add-book" options={{ title: "", headerTransparent: true, headerShown: false, animation: 'slide_from_bottom' }} /> 
        <Stack.Screen name="edit-book" options={{ title: "", headerTransparent: true, headerShown: false, animation: 'slide_from_bottom' }} /> 
        <Stack.Screen name="saved-book" options={{ title: "", headerTransparent: true, headerBackVisible: false, headerShown: false }} /> 

        <Stack.Screen name="select-genres" options={{ title: "", headerTransparent: true, headerShown: false,  animation: 'slide_from_bottom' }} /> 
        <Stack.Screen name="select-notes" options={{ title: "", headerTransparent: true, headerShown: false,  animation: 'slide_from_bottom' }} /> 
        <Stack.Screen name="select-notes-many" options={{ title: "", headerTransparent: true, headerShown: false,  animation: 'slide_from_bottom' }} /> 
        <Stack.Screen name="select-quotes-many" options={{ title: "", headerTransparent: true, headerShown: false,  animation: 'slide_from_bottom' }} /> 
        <Stack.Screen name="select-collections" options={{ title: "", headerTransparent: true, headerBackVisible: false, headerShown: false, animation: 'slide_from_bottom' }} /> 
        <Stack.Screen name="select-note-collections" options={{ title: "", headerTransparent: true, headerBackVisible: false, headerShown: false, animation: 'slide_from_bottom' }} /> 
        <Stack.Screen name="select-quote-collections" options={{ title: "", headerTransparent: true, headerBackVisible: false, headerShown: false, animation: 'slide_from_bottom' }} /> 
        <Stack.Screen name="select-note-repetition-collections" options={{ title: "", headerTransparent: true, headerBackVisible: false, headerShown: false, animation: 'slide_from_bottom' }} /> 
        <Stack.Screen name="select-quote-repetition-collections" options={{ title: "", headerTransparent: true, headerBackVisible: false, headerShown: false, animation: 'slide_from_bottom' }} /> 
        <Stack.Screen name="book-filters" options={{ title: "", headerTransparent: true, headerBackVisible: false, animation: 'slide_from_bottom', headerShown: false }} /> 
        <Stack.Screen name="create-note" options={{ title: "", headerTransparent: true, headerBackVisible: false, animation: 'slide_from_left', headerShown: false }} /> 
        <Stack.Screen name="create-quote" options={{ title: "", headerTransparent: true, headerBackVisible: false, animation: 'slide_from_left', headerShown: false }} /> 
        <Stack.Screen name="quote-to-connect" options={{ title: "", headerTransparent: true, headerBackVisible: false, animation: 'slide_from_right', headerShown: false }} /> 
        <Stack.Screen name="repetition-groups" options={{ title: "", headerTransparent: true, headerBackVisible: false, animation: 'slide_from_right', headerShown: false }} /> 
        <Stack.Screen name="select-authors" options={{ title: "", headerTransparent: true, headerBackVisible: false, animation: 'slide_from_bottom', headerShown: false }} /> 
        <Stack.Screen name="select-books" options={{ title: "", headerTransparent: true, headerBackVisible: false, animation: 'slide_from_bottom', headerShown: false }} /> 
        <Stack.Screen name="create-collection" options={{ title: "", headerTransparent: true, headerBackVisible: false, animation: 'slide_from_bottom', headerShown: false }} /> 
        <Stack.Screen name="create-note-collection" options={{ title: "", headerTransparent: true, headerBackVisible: false, animation: 'slide_from_bottom', headerShown: false }} /> 
        <Stack.Screen name="create-quote-collection" options={{ title: "", headerTransparent: true, headerBackVisible: false, animation: 'slide_from_bottom', headerShown: false }} /> 
        <Stack.Screen name="collection" options={{ title: "", headerTransparent: true, headerBackVisible: false, animation: 'slide_from_bottom', headerShown: false }} /> 
        <Stack.Screen name="note-filters" options={{ title: "", headerTransparent: true, headerBackVisible: false, animation: 'slide_from_bottom', headerShown: false }} /> 

        <Stack.Screen name="countdown" options={{ title: "", headerTransparent: true, headerBackVisible: false, animation: 'slide_from_bottom', headerShown: false }} /> 
        <Stack.Screen name="save-session" options={{ title: "", headerTransparent: true, headerBackVisible: false, animation: 'slide_from_bottom', headerShown: false }} /> 
        <Stack.Screen name="sessions" options={{ title: "", headerTransparent: true, headerBackVisible: false, animation: 'slide_from_bottom', headerShown: false }} /> 
        <Stack.Screen name="yearly-goals" options={{ title: "", headerTransparent: true, headerBackVisible: false, animation: 'slide_from_bottom', headerShown: false }} /> 
        <Stack.Screen name="view-notes" options={{ title: "", headerTransparent: true, headerBackVisible: false, animation: 'slide_from_bottom', headerShown: false }} /> 
        <Stack.Screen name="view-quotes" options={{ title: "", headerTransparent: true, headerBackVisible: false, animation: 'slide_from_bottom', headerShown: false }} /> 
        <Stack.Screen name="notification-setting" options={{ title: "", headerTransparent: true, headerBackVisible: false, animation: 'slide_from_bottom', headerShown: false }} /> 


{/*         <Stack.Screen name="notes" options={{ title: "", headerTransparent: true, headerBackVisible: false, animation: 'slide_from_bottom', headerShown: false }} /> 
        <Stack.Screen name="quotes" options={{ title: "", headerTransparent: true, headerBackVisible: false, animation: 'slide_from_bottom', headerShown: false }} />  */}
        <Stack.Screen name="book-notes" options={{ title: "", headerTransparent: true, headerBackVisible: false, animation: 'slide_from_bottom', headerShown: false }} /> 
        <Stack.Screen name="book-quotes" options={{ title: "", headerTransparent: true, headerBackVisible: false, animation: 'slide_from_bottom', headerShown: false }} /> 
        <Stack.Screen name="edit-note" options={{ title: "", headerTransparent: true, headerBackVisible: false, animation: 'slide_from_bottom', headerShown: false }} /> 
        <Stack.Screen name="edit-quote" options={{ title: "", headerTransparent: true, headerBackVisible: false, animation: 'slide_from_bottom', headerShown: false }} /> 
        <Stack.Screen name="you-finished-book" options={{ title: "", headerTransparent: true, headerBackVisible: false, animation: 'slide_from_bottom', headerShown: false }} /> 
        <Stack.Screen name="book-calendar" options={{ title: "", headerTransparent: true, headerBackVisible: false, animation: 'slide_from_bottom', headerShown: false }} /> 
        <Stack.Screen name="books-finished" options={{ title: "", headerTransparent: true, headerBackVisible: false, animation: 'slide_from_bottom', headerShown: false }} /> 
        <Stack.Screen name="book-memory" options={{ title: "", headerTransparent: true, headerBackVisible: false, animation: 'slide_from_bottom', headerShown: false }} /> 
        <Stack.Screen name="add-repetition-group" options={{ title: "", headerTransparent: true, headerBackVisible: false, animation: 'slide_from_bottom', headerShown: false }} /> 
        <Stack.Screen name="repetition-group" options={{ title: "", headerTransparent: true, headerBackVisible: false, animation: 'slide_from_bottom', headerShown: false }} /> 
        <Stack.Screen name="camera" options={{ title: "", headerTransparent: true, headerBackVisible: false, animation: 'slide_from_bottom', headerShown: false }} /> 
        <Stack.Screen name="revise" options={{ title: "", headerTransparent: true, headerBackVisible: false, animation: 'slide_from_bottom', headerShown: false }} /> 
        <Stack.Screen name="daily-goal" options={{ title: "", headerTransparent: true, headerBackVisible: false, animation: 'slide_from_bottom', headerShown: false }} /> 
        <Stack.Screen name="repetition-group-success" options={{ title: "", headerTransparent: true, headerBackVisible: false, animation: 'slide_from_bottom', headerShown: false }} /> 
        <Stack.Screen name="manage-recommendations" options={{ title: "", headerTransparent: true, headerBackVisible: false, animation: 'slide_from_bottom', headerShown: false }} /> 
      </Stack>
      <StatusBar backgroundColor='#F7F7F7' style='dark' />
    </>
  )
}


export default AuthLayout


const HeaderTitle = ({ text }) => {
  return <Text className="font-cygrebold text-black font-bold text-[24px]">{text}</Text>
}