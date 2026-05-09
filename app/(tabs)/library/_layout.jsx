import React from 'react'
import { Tabs, Stack } from 'expo-router'

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "", headerTransparent: true, headerBackVisible: false, headerShown: false }} />
      <Stack.Screen name="notes" options={{ title: "", headerTransparent: true, headerBackVisible: false, headerShown: false }} />
      <Stack.Screen name="quotes" options={{ title: "", headerTransparent: true, headerBackVisible: false, headerShown: false }} />
    </Stack>
  );
}