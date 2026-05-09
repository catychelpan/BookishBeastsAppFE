import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, Image, ScrollView, Alert, Pressable, Linking } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { router } from "expo-router";
import { useContext, useState } from "react";
import images from "../../constants/images";
import { MaterialIcons } from '@expo/vector-icons';
import RadioButton from "../../components/RadioButton";
import { useStripe } from "@stripe/stripe-react-native";
import axios from '../../network/axios';
import { UserContext } from "../../context/UserContext";
import { CalendarBenefitIcon, PersonalizedExperienceIcon, ReadAndCollectIcon } from "../../components/Svg";



const SpecialOffer = () => {

    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);
    const { user, setUser } = useContext(UserContext);

    const fetchPaymentSheetParams = async () => {
        try {
            console.log(user);
            const response = await axios.post('stripe/create-payment-sheet', {
                priceId: process.env.EXPO_PUBLIC_PRICE_ID,
                userId: user.id
            });
            const { clientSecret, publishableKey, customerId } = response.data;
            return { clientSecretKey: clientSecret, publishableKey, customerId };
        }
        catch(error) {
            console.log(error)
        }
    }

    const initializePaymentSheet = async () => {
        const {
            clientSecretKey,
            publishableKey,
            customerId
        } = await fetchPaymentSheetParams();
        console.log('Initializing payment sheet with:', { clientSecretKey, publishableKey, customerId });

        const { error } = await initPaymentSheet({
            merchantDisplayName: "Bookish",
            customerId: customerId,
            paymentIntentClientSecret: clientSecretKey,
            // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
            //methods that complete payment after a delay, like SEPA Debit and Sofort.
            allowsDelayedPaymentMethods: false,
            returnURL: 'test-scheme://(tabs)/home',
            googlePay: {
                merchantCountryCode: 'LV', // or your country code
                testEnv: false, // set to true for testing
            },
        });
        if (!error) {
            //setLoading(true);
            //Alert.alert(error);
        }
  };

  const handleSubscribe = async () => {
    //console.log(priceId)
    setLoading(true);
    //setSelectedPlan(planType);

    try {
      // Initialize payment sheet
      await initializePaymentSheet();
      
      // Present the payment sheet
      const { error } = await presentPaymentSheet();
      console.log(error)

      if (error) {
        if (error.code === 'Canceled') {
          Alert.alert('Cancelled', 'You cancelled the payment');
        } else {
          Alert.alert('Error', error.message);
        }
      } else {
        await updatePremiumStatus();
        router.replace('(tabs)/home');
/*         Alert.alert(
          'Success! 🎉',
          `You've successfully subscribed to the ${planName} plan!`,
          [
            {
              text: 'OK',
              onPress: () => {
                // TODO: Navigate to success screen or refresh subscription status
                console.log('Subscription successful');
              },
            },
          ]
        ); */
      }
    } catch (error) {
      console.error('Subscription error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
      //setSelectedPlan(null);
    }
  };

    const updatePremiumStatus = async () => {
        try {
            await axios.post('users/premium')
            setUser(prev => ({...prev, isPremiumUser: true}))
        } catch(error) {
            console.log(error);
        }
    }


    const openPrivacyPolicy = () => {
        Linking.openURL(`${process.env.EXPO_PUBLIC_WEBSITE_URL}/#privacy`);
    };

    const openTermsOfUse = () => {
        Linking.openURL(`${process.env.EXPO_PUBLIC_WEBSITE_URL}/#terms`);
    };

    return <SafeAreaView className="bg-[#F7F7F7] h-full">
        <ScrollView>
            <TouchableOpacity
                onPress={() => router.replace('(tabs)/home')}
                className="items-start mt-6 px-[20px]">
                <MaterialIcons name={'close'} size={24} />
            </TouchableOpacity>
            <View className="items-center">
                <Text className="text-center justify-center items-center text-[#1C1C1C] font-bold font-cygrebold text-[80px] leading-[98px]">
                    6.99€</Text>
                <Image source={images.specialOffer} />
                <View>
                    <Text className="text-[#000000] max-w-[328px] font-bold font-cygrebold text-[20px] leading-[24px] text-center">
                        One time payment to support the community and our hard work!
                    </Text>
{/*                     <Text className="text-[#000000] max-w-[328px] font-bold font-cygrebold text-[20px] leading-[24px] text-center">
                        Enjoy Premium Benefits.
                    </Text> */}

                </View>
            </View>
    {/*         Potentially fetch these values from flag features */}
{/*             <View className="w-full items-center mt-16 mb-8 max-h-[200px]">
                <OfferCardWithDiscount
                    isSelected={offerState.offerOption === 'A'}
                    setIsSelected={() => setOfferState({ offerCost: '30.99€/year', offerOption: 'A', priceId: 'price_1SVBqJHpVeN2g2qiK4zfg9mp' })} 
                    containerStyles={'mb-[15px]'}
                />
                <OfferCard
                    isSelected={offerState.offerOption === 'B'}
                    setIsSelected={() => setOfferState({ offerCost: '3.49 €/month', offerOption: 'B', priceId: 'price_1SVBozHpVeN2g2qiS3QYACEv' })} 
                />
            </View> */}



            <View className="mt-8 mb-5">
                <Text className="text-[#000000] text-[24px] mb-5 font-bold leading-[28.8px] font-cygrebold text-center">What Extras You Will Get?</Text>
                <View className="px-5">
                    <PremiumBenefit
                        title={'Read and collect'}
                        description={'Keep your strike and collect interesting creatures.'}
                        icon={ReadAndCollectIcon}
                        containerStyles={'mb-6'}
                        descriptionStyles={'max-w-[250px]'}
                    />
                    <PremiumBenefit
                        title={'Personalized Experience'}я
                        description={'Unlock full reading plan and journeys specifically for your needs and goals.'}
                        icon={PersonalizedExperienceIcon}
                        descriptionStyles={'max-w-[280px] mb-6'}
                    />
                    <PremiumBenefit
                        title={'Calendar of Memories'}
                        description={'Capture special moments of finishing the book by taking a picture, noting down your feelings and saving in your personal calendar.'}
                        icon={CalendarBenefitIcon}
                        descriptionStyles={'max-w-[280px] mb-6'}
                    />
                </View>
                <View className="mx-auto max-w-[353px] border relative justify-between flex-row rounded-[30px] border-[#fff] bg-[#fff] z-20  max-h-[137px] w-full h-full">
                    <View className="absolute bg-[#C1D7FF] -z-10 right-0 h-[137px] rounded-r-[30px] flex-row w-[200px]"></View>
                    <View className="z-10 justify-center pl-[17px]">
                        <Text className="text-[22px] font-cygrebold leading-[22.44px] max-w-[88px]">Treat Yourself</Text>
                        <Text className="leading-[19.2px] font-cygreregular">Try 7-day free trial!</Text>
                    </View>
                    <View className="justify-center items-end justify-self-end mr-6">
                        <Image source={images.specialOfferMonster} className="max-w-[131px] max-h-[121px]" width={131} height={121} />
                    </View>
                </View>

                <View className="w-full items-center justify-center mb-3 flex-row mt-10">
                    <OptionButton text={'Help'} containerStyles={'mr-[10px]'}/>
                    <OptionButton text={'Switch User'} containerStyles={'max-w-[98px] mr-[10px]'} />
                </View>

                <View className="items-center w-full">
                    <Text className='text-[12px] font-cygreregular text-[##1C1C1C]'>By continuing, you agree to</Text>
                    <View className="flex-row gap-x-2">
                        <Pressable onPress={openTermsOfUse}>
                            <Text className="text-[12px] font-cygrebold text-[#1C1C1C]">Terms of Service</Text>
                        </Pressable>
                        <Text className='text-[12px] font-cygreregular text-[#1C1C1C]'>
                            and
                        </Text>
                        <Pressable onPress={openPrivacyPolicy}>
                            <Text className="text-[12px] font-cygrebold text-[#1C1C1C]">Privacy Policy</Text>
                        </Pressable>
                    </View>
                </View>

            </View>
        </ScrollView>
        <View className="w-full max-h-[100px] justify-center items-center px-[16px]">
            <TouchableOpacity
                onPress={() => handleSubscribe()}
                className="bg-[#6592E3] w-full self-center mb-[11px] items-center justify-center max-h-[71px] h-full rounded-[47px]">
                <Text className="text-[#FEFEFC] text-[18px] leading-[22px] font-semibold">6.99€</Text>
                <Text className="text-[#FEFEFC] text-[14px] leading-[16.8px] font-cygreregular">{'One Time Payment'}</Text>
            </TouchableOpacity>
        </View>

        <StatusBar backgroundColor='#F7F7F7' style='dark' />
    </SafeAreaView>
}


const OptionButton = ({ text, containerStyles }) => {
    return <TouchableOpacity className={`max-w-[72px] h-[30px] w-full items-center justify-center rounded-[13px] bg-[#E9E9E9] ${containerStyles}`}>
        <Text className="text-[#1C1C1C] font-cygreregular text-sm">{text}</Text>
    </TouchableOpacity>
}



const OfferCard = ({ isSelected, setIsSelected, containerStyles }) => {

    //unknown rounding
    return <View
        className={`max-w-[353px] max-h-[88px] w-full h-full items-center bg-[#ffffff] flex-row justify-between rounded-[15px] border ${isSelected ? 'border-[#6592E3] border-[2px]' : 'border-[#1C1C1C]'} px-[30px] ${containerStyles} `}>
        <Text className={`font-semibold text-[18px] leading-[21px] font-cygrebold ${isSelected ? 'text-[#6592E3]' : 'text-[#1C1C1C]' }`}>3.49 €/month</Text>
        <RadioButton
            size={42}
            selected={isSelected}
            onPress={setIsSelected}
        />
    </View>
}


const OfferCardWithDiscount = ({ isSelected, setIsSelected, containerStyles }) => {

    return <View
            className={`max-w-[353px] max-h-[88px] relaitve w-full h-full items-center bg-[#ffffff] flex-row justify-between rounded-[15px] border  ${isSelected ? 'border-[#6592E3] border-[2px]' : 'border-[#1C1C1C]'}  px-[30px] ${containerStyles}`}>
        <View className="absolute h-[25px] w-[121px] bg-[#6592E3] rounded-[13px] items-center justify-center right-4 -top-3">
            <Text className="text-[#ffffff] text-sm font-cygreregular text-center leading-[16.8px]">20% discount </Text>
        </View>
        <View>
            <Text className={`font-semibold text-[18px] leading-[21px] font-cygrebold ${isSelected ? 'text-[#6592E3]' : 'text-[#1C1C1C]' } `}>30.99€/year</Text>
            <Text className={`text-[14px] leading-[16.8px] font-cygrebold line-through ${isSelected ? 'text-[#6592E3]' : 'text-[#1C1C1C]'}`}>40.99€/year</Text>
        </View>
        <RadioButton
            size={42}
            selected={isSelected}
            onPress={setIsSelected}
        />
    </View>
}


export default SpecialOffer;

const PremiumBenefit = ({ title, description, icon, containerStyles, descriptionStyles }) => {
    return <View className={`flex-row ${containerStyles}`}>
        <View className="bg-[#6592E3] items-center justify-center h-full w-full rounded-[10px] max-w-[46px] max-h-[45px]">
            { icon() }
        </View>
        <View className="ml-5">
            <Text className="text-[#000000] mb-1 font-bold font-cygrebold text-[18px] leading-[21.6px] text-left">{title}</Text>
            <Text className={`text-[#000000] font-cygreregular text-[16px] leading-[19.2px] text-left ${descriptionStyles}`}>{description}</Text>
        </View>
    </View>;
}
