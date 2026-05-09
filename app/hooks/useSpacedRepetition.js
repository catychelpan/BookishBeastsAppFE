import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants'
import axios from '../../network/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';


const useSpacedRepetition = () => {

  const getPushToken = async () => {

    const pushToken = await AsyncStorage.getItem('push_token');

    if (!pushToken) {

      const projectId = Constants.expoConfig?.extra?.eas?.projectId; // From app.json or Constants.expoConfig.extra.eas.projectId

      if (!projectId) {
        throw new Error('project id is undefined');
      }

      const token = await Notifications.getDevicePushTokenAsync();

      await AsyncStorage.setItem('push_token', token.data);

      await saveToken(token.data)

      return token.data;
    }

    return pushToken;
  }


  const saveToken = async (token) => {
    try {
      const body = { token, platform: Platform.OS };
      console.log("body", body)
      await axios.post('users/push-token', body);
    } catch(error) {
      console.log(error);
    }
  }

  return {
    getPushToken,
  };
};

export default useSpacedRepetition;