import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TIMER_KEY = '@verification_timer';

const useTimer = (initialMinutes = 0, initialSeconds = 0) => {
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60 + initialSeconds);
  const intervalRef = useRef(null);
  const endTimeRef = useRef(null);
  const appStateSubscription = useRef(null);

  const formatTime = (time) => time.toString().padStart(2, '0');

  const { minutes, seconds, formattedTime } = useMemo(() => {
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    return {
      minutes: mins,
      seconds: secs,
      formattedTime: `${formatTime(mins)}:${formatTime(secs)}`
    };
  }, [secondsLeft]);

  const clearIntervalIfExists = async () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      await AsyncStorage.clear();
    }
  };

  const updateTimer = useCallback(() => {
    if (endTimeRef.current) {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTimeRef.current - now) / 1000));
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        clearIntervalIfExists();
      }
    }
  }, []);

  const startTimer = useCallback(async () => {
    clearIntervalIfExists();
    const endTime = Date.now() + secondsLeft * 1000;
    endTimeRef.current = endTime;
    await AsyncStorage.setItem(TIMER_KEY, endTime.toString());
    intervalRef.current = setInterval(updateTimer, 1000);
  }, [secondsLeft, updateTimer]);

  const resetTimer = useCallback(async () => {
    clearIntervalIfExists();
    await AsyncStorage.removeItem(TIMER_KEY);
    endTimeRef.current = null;
    setSecondsLeft(initialMinutes * 60 + initialSeconds);
    const newEndTime = Date.now() + (initialMinutes * 60 + initialSeconds) * 1000;
    endTimeRef.current = newEndTime;
    await AsyncStorage.setItem(TIMER_KEY, newEndTime.toString());
    intervalRef.current = setInterval(updateTimer, 1000);
  }, [initialMinutes, initialSeconds, updateTimer]);

  const handleAppStateChange = useCallback(async (nextAppState) => {
    if (nextAppState === 'active') {
      // App has come to the foreground
      const storedEndTime = await AsyncStorage.getItem(TIMER_KEY);
      if (storedEndTime) {
        const endTime = parseInt(storedEndTime, 10);
        const now = Date.now();
        if (now < endTime) {
          // Timer is still running
          endTimeRef.current = endTime;
          clearIntervalIfExists();
          intervalRef.current = setInterval(updateTimer, 1000);
        } else {
          // Timer has expired while in background
          await resetTimer();
        }
      }
    } else if (nextAppState === 'background') {
      // App has gone to the background
      clearIntervalIfExists();
    }
  }, [updateTimer, resetTimer]);

  useEffect(() => {
    const initializeTimer = async () => {
      const storedEndTime = await AsyncStorage.getItem(TIMER_KEY);
      if (storedEndTime) {
        const endTime = parseInt(storedEndTime, 10);
        const now = Date.now();
        if (now < endTime) {
          endTimeRef.current = endTime;
          intervalRef.current = setInterval(updateTimer, 1000);
        } else {
          await resetTimer();
        }
      } else {
        // No stored timer, start a new one
        await startTimer();
      }
    };

    appStateSubscription.current = AppState.addEventListener('change', handleAppStateChange);

    initializeTimer();

  }, [updateTimer, resetTimer, handleAppStateChange, startTimer]);


  useEffect(() => {
    return () => {
      if (appStateSubscription.current) {
        appStateSubscription.current.remove();
      }
      clearIntervalIfExists();
      //console.log("hit")
      //AsyncStorage.removeItem(TIMER_KEY);
    };
  },[]);

  return { minutes, seconds, formattedTime, resetTimer };
};

export default useTimer;