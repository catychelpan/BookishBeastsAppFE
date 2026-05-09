import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { useFocusEffect } from 'expo-router'
import React, { Fragment, useEffect, useState, useCallback, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Svg, G, Path, Rect, ClipPath, Defs } from 'react-native-svg'
import { MaterialIcons } from '@expo/vector-icons';
import { images } from '../../constants'
import AddBookBottomDrawer from '../../components/AddBookBottomDrawer';
import { LaptopIcon, TimerIcon, QuoteIcon, NoteIcon, MaginifierIcon } from '../../components/Svg';
import { router } from 'expo-router';
import axios from '../../network/axios';
import ImageHandler from '../../components/ImageHandler';
import useSpacedRepetition from '../hooks/useSpacedRepetition';
import { RocketIcon } from '../../components/Svg'
import WelcomeSmIcon from '../../components/WelcomeSmIcon'
import { UserContext } from '../../context/UserContext'

const Home = () => {

  const { getPushToken } = useSpacedRepetition();

  const [currentStreak, setCurrentStreak] = useState({
    streakLengthInDays: 1,
    minutesRead: 1,
    pagesRead: 0,
    notesCount: 0
  });

  const fetchCurrentStreak = useCallback(async () => {
    try {
      const { data } = await axios.get('/users/streak');
      setCurrentStreak(prev => ({
        ...prev,
        streakLengthInDays: data.currentStreak,
        minutesRead: data.minutesToday,
        pagesRead: data.pagesReadToday,
        notesCount: data.notesCount
      }));
    } catch (error) {
      console.log(error);
    }
  }, [])

  useEffect(() => {
    getPushToken();
  }, []);

  useFocusEffect(
      useCallback(() => {
          fetchCurrentStreak()
      }, [fetchCurrentStreak])
  );

  return <SafeAreaView className="bg-[#F7F7F7]" style={{ flex: 1 }}>
      <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}>
            <ThisWeekStatistics
              currentStreak={currentStreak.streakLengthInDays}
              minutesRead={currentStreak.minutesRead}
              pagesRead={currentStreak.pagesRead}
              notesCount={currentStreak.notesCount}
            />
            <CurrentBook />
            <BookCalendar />
            <PersonalPlan />
            <Categories />
            <ToBoostIntelligence />
            <CollectionForYou />
            <PersonalizedChallenges />
      </ScrollView>
    </SafeAreaView>
}

export default Home



const PersonalizedChallenges = () => {
  return <View className="my-7 mx-3">
    <Text className="font-cygrebold mb-4 font-bold text-[22px] leading-[26.4px] text-[#000000]">Personolized Challenges</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <Challenge title={'Success'} bottomLabel={'28-day challenge'} containerStyles={'mr-4'} />
      <Challenge title={'Morning Routine'} bottomLabel={'10-day challenge'} />
    </ScrollView>
  </View>
}

const Challenge = ({ title, bottomLabel, containerStyles }) => {
  return <View className={`rounded-[15px] justify-between px-5 bg-[#ffffff] w-[230px] h-[108px] py-3.5 border-[.5px] border-[#8A8A8A] relative ${containerStyles}`}>
    <Text className="text-[20px] leading-[24px] font-extrabold text-[#1C1C1C] max-w-[83px]">{title}</Text>
    <View className="bg-[#E6E6E6] items-center p-0.5 justify-center max-w-[132px] max-h-[23px] w-full rounded-[16px]">
      <Text className="text-center text-[#000000]">{bottomLabel}</Text>
    </View>
    <View className="absolute right-2 top-2">
      <BrutalistIcon />
    </View>
  </View>
}


const BrutalistIcon = () => {
  return <Svg width="88" height="88" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M87.9999 44.0001V43.6995C87.8797 31.6576 78.0618 21.96 65.9999 22.0001C65.8998 22.0001 65.7996 22.0001 65.6994 22.0001H65.9999V21.6995C65.8797 9.63763 56.0419 -0.0399488 44 0.000124001C31.9581 -0.0399488 22.1203 9.65767 22.0001 21.6995V22.0001C9.93816 21.96 0.120342 31.6576 0.000123746 43.6995V44.0001C-0.039949 56.0419 9.65766 65.8798 21.6995 66H22.0001C21.96 78.0619 31.6576 87.8798 43.6995 88H44H44.3005C56.3424 87.8798 66.04 78.0619 65.9999 66H66.3005C78.3624 65.8798 88.04 56.0419 87.9999 44.0001ZM22.0001 66H22.3006C22.2004 66 22.1002 66 22.0001 66ZM57.244 57.2441H30.756V30.756H57.2641V57.2441H57.244Z" fill="#1C1C1C"/>
  </Svg>
}


const CollectionForYou = () => {
  return <View className="mt-7 mx-3">
    <Text className="font-cygrebold mb-4 font-bold text-[22px] leading-[26.4px] text-[#000000]">Collections For You</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <CollectionItem icon={'1'} title={'Dopamine Detox Guide'} desc={'No more scrolling addiction'} containerStyles={'mr-4'} />
      <CollectionItem icon={'2'} title={'TOP - 10'} desc={'To Know History Inside Out'} />
    </ScrollView>
  </View>
}

const CollectionItem = ({ icon, title, desc, containerStyles }) => {
  return <View className={`rounded-[15px] pt-4 pl-5 bg-[#1C1C1C] w-[189px] h-[174px] ${containerStyles}`}>
    <Text className="text-[#FEFEFC] text-[18px] mb-2 font-cygrebold leading-[21.6px] max-w-[120px]">{title}</Text>
    <View className="flex-row">
      <Text className="text-sm text-[#FEFEFC] leading-[16.8px] mr-2 max-w-[72px]">{desc}</Text>
      { icon === '1' ? <CollectionIcon2 /> : <CollectionIcon1 /> }
    </View>
  </View>
}


const CollectionIcon1 = () => {
  return <Svg width="70" height="121" viewBox="0 0 70 121" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path fill-rule="evenodd" clip-rule="evenodd" d="M9.11483 0C9.00884 0 8.92293 0.0865437 8.92293 0.193301V4.71147L7.77769 7.38311H0.1919C0.0859163 7.38311 0 7.46965 0 7.57641V16.115C0 16.1582 0.0144221 16.2003 0.040956 16.2343L5.35377 23.0513V26.8366C5.35377 26.8944 5.37947 26.9492 5.42382 26.9859L14.6446 34.6199L13.0387 45.0413C13.0191 45.1345 13.0047 45.2287 12.9955 45.3238C12.9085 46.2301 13.3101 47.1245 14.0743 47.9712C14.818 48.7952 15.9198 49.5916 17.3064 50.337L10.1156 113.485L10.1152 113.488C10.0367 114.305 10.5568 115.096 11.4518 115.821C12.3541 116.552 13.6813 117.253 15.326 117.89C18.618 119.165 23.2246 120.202 28.3669 120.703C33.51 121.204 38.2497 121.049 41.7444 120.405C43.4905 120.084 44.9366 119.639 45.9688 119.086C46.9922 118.537 47.6584 117.855 47.7369 117.037L51.5197 77.9602C51.5208 77.9488 51.5209 77.9374 51.52 77.9261C51.5194 77.9187 51.5184 77.9113 51.517 77.904L50.5845 73.1407C50.5729 73.0812 50.5343 73.0307 50.4801 73.0042L46.9976 71.2994L45.8804 66.7658L49.2638 63.4888C49.283 63.4703 49.2981 63.4479 49.3083 63.4231L49.9753 61.7913L52.926 60.7135C52.9504 60.7046 52.9727 60.6908 52.9916 60.673L55.023 58.7609C55.0618 58.7244 55.0839 58.6732 55.0839 58.6197V53.6004C57.4926 52.6709 58.804 51.363 58.9583 49.7918L60.6478 39.6774H70.3644C70.4704 39.6774 70.5563 39.5908 70.5563 39.4841V36.1456C70.5563 35.3297 70.6492 34.3615 71.1547 33.1552C71.6613 31.9461 72.5865 30.4885 74.2642 28.7029C76.9258 25.87 80.9957 24.6489 82.6934 24.3956C82.7332 24.3896 82.77 24.3713 82.7989 24.3432L86.9417 20.2985C86.979 20.2621 87 20.212 87 20.1597V16.8855C87 16.8455 86.9877 16.8065 86.9647 16.7738L75.2375 0.081637C75.2015 0.0304359 75.1431 0 75.0808 0H9.11483ZM8.08003 7.65304L9.23945 4.94832L74.8429 6.80003C74.6233 7.64723 73.8247 9.58237 71.9357 11.9493C70.9196 13.2225 69.1745 14.2826 67.3828 15.0912C65.5962 15.8976 63.7888 16.4427 62.6738 16.6969C62.6297 16.707 62.5905 16.7324 62.5632 16.7687L58.0319 22.7912H5.63899L0.383799 16.0481V7.76971H7.90386C7.98043 7.76971 8.04968 7.72385 8.08003 7.65304ZM74.8889 0.386602V6.41457L9.30673 4.56347V0.386602H74.8889ZM86.6162 16.947L75.2727 0.801068V6.54092L86.6162 19.6439V16.947ZM75.1801 7.02214L86.5438 20.1485L82.6765 23.9242L72.3355 12.0645C74.0913 9.83357 74.9066 7.97291 75.1801 7.02214ZM72.0889 12.3676L82.2941 24.0715C80.3933 24.4305 76.5621 25.6947 73.9854 28.4371C72.2851 30.2467 71.3301 31.7424 70.8011 33.0049C70.3661 34.0429 70.2218 34.9171 70.184 35.6688L58.3779 22.9713L62.827 17.0582C63.9682 16.7927 65.7634 16.2457 67.5397 15.444C69.2675 14.6642 71.001 13.6331 72.0889 12.3676ZM58.3191 23.4737L69.5579 35.561L63.6581 32.8395L58.3191 27.2085V23.4737ZM58.0445 27.4785L62.8759 32.5742C58.1469 31.0378 48.1193 28.3767 40.4902 28.3767C36.4757 28.3767 33.7884 28.6124 32.0579 28.9091C31.1929 29.0574 30.5627 29.2216 30.1235 29.3812C29.9039 29.461 29.7286 29.5409 29.5941 29.6191C29.5012 29.6731 29.421 29.7302 29.3588 29.7911C23.9354 29.9259 20.3658 30.7113 18.1033 31.6494C16.9662 32.1209 16.1549 32.6328 15.6043 33.1239C15.1796 33.5028 14.9034 33.8754 14.7579 34.2133L6.08696 27.0345L58.0445 27.4785ZM59.7971 38.3462C60.1363 38.8903 60.2664 39.2866 60.2917 39.4788L58.7813 48.5211C58.5388 47.8715 58.0712 47.2371 57.4225 46.6302C56.3557 45.6322 54.7729 44.6819 52.793 43.8244C48.8312 42.1084 43.2375 40.7458 36.8789 40.1262C30.6621 39.5204 24.939 39.7486 20.6609 40.6133C18.5228 41.0454 16.7362 41.6385 15.4276 42.3725C14.652 42.8076 14.0327 43.299 13.6115 43.845L15.0395 34.5772C15.109 34.2782 15.3486 33.8684 15.8588 33.4133C16.3698 32.9575 17.1415 32.4663 18.2494 32.0069C20.4656 31.088 24.0094 30.3037 29.4509 30.1756C36.2495 30.0156 42.8443 31.0558 48.0176 32.3846C50.604 33.0489 52.8326 33.7847 54.5515 34.4773C56.2786 35.1732 57.4696 35.8171 58 36.2903C58.8802 37.0756 59.4467 37.784 59.7971 38.3462ZM5.73757 23.1778V26.6449L57.9353 27.091V23.1778H5.73757ZM22.6047 52.1061L23.0074 45.3957C24.5718 44.8161 26.4592 44.4323 28.5249 44.2283L27.6329 53.441C25.8294 53.0518 24.1424 52.6021 22.6047 52.1061ZM22.5808 52.5042C24.1189 52.9966 25.801 53.4424 27.5954 53.8283L22.1925 109.632C21.1267 109.652 20.1068 109.703 19.1437 109.784L22.5808 52.5042ZM37.1447 54.7943L37.5431 44.3502C39.825 44.6046 42.076 45.0165 44.1444 45.5659L43.114 54.9841C41.2169 55.0095 39.2147 54.9489 37.1447 54.7943ZM37.1299 55.1809C39.1886 55.3342 41.1812 55.3951 43.0716 55.3713L42.2672 62.7245C42.2643 62.7513 42.2669 62.7784 42.275 62.804L44.5974 70.1883L43.1169 69.7174C43.0614 69.6997 43.001 69.7084 42.9526 69.7409C42.9042 69.7735 42.8731 69.8263 42.868 69.8847L39.2119 111.669C37.8913 111.299 36.5486 111.008 35.0109 110.722L37.1299 55.1809Z" fill="#F9F9F9"/>
  </Svg>
}

const CollectionIcon2 = () => {
  return <Svg width="73" height="90" viewBox="0 0 73 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path fill-rule="evenodd" clip-rule="evenodd" d="M58.8492 9.11691L53.0147 0.625198L36.8984 13.0099L31.7863 5.5894C31.4694 5.64728 31.2151 5.79001 30.8495 6.05468C30.5051 6.30402 30.0847 6.65485 29.6044 7.09577C28.6433 7.97802 27.4335 9.22926 26.0978 10.7716C23.4264 13.8564 20.2448 18.1137 17.5379 22.9281C13.0191 30.9648 9.7918 40.6141 12.5564 48.9452C11.1843 49.9766 9.71196 51.1805 8.3158 52.4844C5.54375 55.0735 3.04245 58.0843 2.25349 60.944C1.28498 64.4545 0.371253 68.5054 1.00864 72.7861C1.64716 77.0744 3.83846 81.5716 9.03837 85.9856C14.2665 90.4236 20.319 90.5602 25.7912 88.771C31.2587 86.9834 36.1638 83.2698 39.1367 79.9711C44.99 73.4766 53.0616 73.9287 56.7715 78.6114C59.7639 82.3884 59.7424 86.4148 59.3701 87.9282L59.3302 88.0902L59.4794 88.1439C60.7154 88.5885 62.6544 89.0718 64.4579 89.0734C66.2461 89.0751 67.9857 88.6008 68.6948 87.0304C69.1295 86.0679 69.2383 84.5242 69.0456 82.7227C68.8519 80.9129 68.3507 78.8141 67.5377 76.7228C65.9136 72.5453 63.0307 68.3622 58.8267 66.5928C54.6612 64.8395 50.9979 64.3015 47.63 64.7485C44.2622 65.1955 41.203 66.6256 38.2436 68.7871C35.2858 70.9474 31.8403 74.3222 28.2911 76.7062C24.7299 79.0983 21.1091 80.4687 17.7574 78.7498C10.9759 75.2722 10.0485 67.318 12.961 62.7356C14.132 60.8932 15.9144 59.2255 17.6756 57.887C17.8977 57.7181 18.1194 57.5547 18.3392 57.3969C21.0541 59.5936 24.298 60.8467 27.7775 61.4192C32.8823 62.2591 38.5024 61.6361 43.7302 60.3762C48.9594 59.1159 53.8061 57.2157 57.3685 55.4921C59.1495 54.6304 60.6125 53.8114 61.6434 53.1367C62.1582 52.7997 62.5693 52.4962 62.8591 52.2391C63.1695 51.9637 63.3452 51.7635 63.3922 51.4663L56.4972 41.4487L72.5726 29.0369L66.7379 20.5448L50.7557 32.9494L47.5994 28.5426L47.5975 28.5399L42.7432 21.4937L58.8492 9.11691ZM19.1893 56.8077C22.3425 59.3906 25.8959 60.1377 28.2052 58.363C31.3627 55.9366 30.999 49.7147 27.3928 44.4661C23.7865 39.2174 18.3034 36.9296 15.1459 39.356C12.9698 41.0282 12.4662 44.503 13.5437 48.2196C14.2569 47.7073 14.9278 47.2511 15.5279 46.8626C15.304 44.8528 15.8025 43.0889 17.0514 42.1292C19.3319 40.3767 23.251 41.9693 25.8049 45.6863C28.3587 49.4033 28.5803 53.8372 26.2997 55.5897C24.9845 56.6004 23.1242 56.4985 21.2952 55.5182C20.6797 55.8591 19.9574 56.2938 19.1893 56.8077ZM39.9217 17.3983L55.7505 5.23454L58.3655 9.04044L42.5413 21.2006L39.9217 17.3983ZM72.0894 28.9611L56.2974 41.1541L53.6605 37.2122L69.4738 25.1543L72.0894 28.9611ZM31.4556 8.42016L38.3595 18.4683C38.4151 18.5493 38.3971 18.6635 38.3192 18.7234C38.2412 18.7833 38.133 18.7662 38.0773 18.6852L31.3631 8.91307C29.823 10.0043 26.4027 13.4404 23.05 18.3948C19.5975 23.4966 16.2321 30.1863 15.0688 37.5443C15.0531 37.6439 14.9637 37.7126 14.8693 37.6976C14.7749 37.6827 14.7111 37.5898 14.7268 37.4902C15.9017 30.0583 19.2974 23.3161 22.7686 18.1865C26.2367 13.0616 29.7957 9.52428 31.3177 8.51188L31.4556 8.42016ZM54.6653 66.8424C54.6555 66.9427 54.5704 67.0171 54.4752 67.0085C45.1681 66.1656 40.0702 70.6011 33.7997 76.0569C33.0628 76.6981 32.3094 77.3536 31.5313 78.0161C30.0528 79.2749 28.1527 80.0328 26.3981 80.4833C24.6417 80.9342 23.0168 81.0805 22.0764 81.1069C21.9806 81.1095 21.9022 81.0301 21.9013 80.9294C21.9003 80.8287 21.9771 80.7449 22.0729 80.7423C22.9938 80.7164 24.5935 80.5725 26.3212 80.129C28.0508 79.685 29.8944 78.9442 31.3158 77.7341C32.0914 77.0737 32.8437 76.4188 33.5813 75.7767C39.8464 70.3227 45.0547 65.7887 54.5105 66.6451C54.6058 66.6537 54.6751 66.742 54.6653 66.8424Z" fill="#F9F9F9"/>
  </Svg>
}


//shall have to fetch from api
const ToBoostIntelligence = () => {

  return <View className="mx-3 mt-7 max-h-[300px]">
    <Text className="font-cygrebold mb-4 font-bold text-[22px] leading-[26.4px] text-[#000000]">To Boost Intelligence</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <Book
        src={images.book1}
        title={'The Body Keeps Th...'}
        containerStyles={'mr-6'} 
      />
      <Book
        src={images.book2}
        title={'Make Your Bed'}
        containerStyles={'mr-6'} 
      />
      <Book
        src={images.book2}
        title={'Make Your Bed'} 
      />
    </ScrollView>
  </View>
}

const Book = ({ src, title, containerStyles }) => {
  return <View className={`relative ${containerStyles} pt-4`}>
    <TouchableOpacity className="absolute top-0 right-0 z-10 -mr-2 rounded-full bg-[#6592E3] items-center justify-center h-[40px] w-[40px]">
      <Text className="text-[#FFFFFF] text-[31px] font-semibold leading-[37.5px]">+</Text>
    </TouchableOpacity>

    <Image source={src} className="max-w-[144px] max-h-[209px]" />
    <Text className="text-sm text-left text-[#000000] mt-1.5 font-cygreregular leading-[16.8px]">{title}</Text>
  </View>
}


const Categories = () => {
  return <View className="mx-3 mt-10">
    <Text className="font-cygrebold mb-4 font-bold text-[22px] leading-[26.4px] text-[#000000]">Categories You Would Like</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <Category icon={'psychology'} title={'Psychology'} containerStyles={'mr-2.5'} />
      <Category icon={'fantasy'} title={'Fantasy'} />
    </ScrollView>
  </View>
}

const Category = ({ icon, title, containerStyles }) => {
  return <View className={`border-[#8A8A8A] flex-row border-[.5px] items-center bg-[#ffffff] rounded-[15px] w-[237px] h-[56px] px-4 ${containerStyles}`}>
    <View className="mr-4 bg-[#1C1C1C] rounded-full w-[38px] h-[38px] items-center justify-center">
      { icon === 'psychology' ? <PsychologyIcon /> : <FantasyIcon /> }
    </View>
    <Text className="text-[#1C1C1C] text-[18px] font-cygrebold leading-[21.6px]">{title}</Text>
  </View>
}

const FlameIcon = () => {
  return <Svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 12 16" id="flame">
          <G id="Octicons" fill="none" fill-rule="evenodd" stroke="none" stroke-width="1">
            <G id="flame" fill="#fff">
              <Path id="Shape" d="M5.05.31c.81 2.17.41 3.38-.52 4.31C3.55 5.67 1.98 6.45.9 7.98c-1.45 2.05-1.7 6.53 3.53 7.7-2.2-1.16-2.67-4.52-.3-6.61-.61 2.03.53 3.33 1.94 2.86 1.39-.47 2.3.53 2.27 1.67-.02.78-.31 1.44-1.13 1.81 3.42-.59 4.78-3.42 4.78-5.56 0-2.84-2.53-3.22-1.25-5.61-1.52.13-2.03 1.13-1.89 2.75.09 1.08-1.02 1.8-1.86 1.33-.67-.41-.66-1.19-.06-1.78C8.18 5.31 8.68 2.45 5.05.32L5.03.3l.02.01z"></Path>
            </G>
          </G>
    </Svg>
}

const PsychologyIcon = () => {
  return <TouchableOpacity>
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <G clip-path="url(#clip0_619_3468)">
        <Path d="M23.3409 13.345L16.5559 20.754C14.6619 22.822 11.9859 24 9.18193 24H4.00293C1.79393 24 0.00292969 22.209 0.00292969 20V16C0.00292969 13.791 1.79393 12 4.00293 12H11.7899C13.1639 12 14.2499 13.26 13.9539 14.685C13.7609 15.611 12.9499 16.283 12.0139 16.417L7.85193 17C7.30493 17.078 6.92493 17.585 7.00393 18.131C7.08193 18.678 7.58893 19.057 8.13493 18.979L12.3869 18.383C14.4489 18.089 16.0039 16.296 16.0039 14.213C16.0039 13.994 15.9719 13.784 15.9389 13.575L19.4799 9.838C19.9349 9.338 20.5769 9.035 21.2739 9.003C21.9659 8.969 22.6369 9.212 23.1519 9.681C24.2039 10.639 24.2899 12.282 23.3409 13.345ZM5.24993 9C5.96193 9 6.59093 8.666 6.99993 8.149V9C6.99993 9.553 7.44693 10 7.99993 10C8.55293 10 8.99993 9.553 8.99993 9V7H12.4999C13.8809 7 14.9999 5.881 14.9999 4.5C14.9999 3.305 14.1599 2.309 13.0399 2.062C12.5869 1.421 11.8439 1 10.9999 1C10.7449 1 10.5029 1.049 10.2709 1.121C9.90893 0.457 9.21293 0 8.40393 0C7.63693 0 6.96993 0.408 6.59293 1.016C5.14893 1.099 3.99993 2.285 3.99993 3.75C3.99993 4.112 4.07393 4.455 4.20093 4.771C3.48993 5.149 2.99993 5.889 2.99993 6.75C2.99993 7.993 4.00693 9 5.24993 9Z" fill="#FEFEFC"/>
      </G>
      <Defs>
        <ClipPath id="clip0_619_3468">
          <Rect width="24" height="24" fill="#fff"/>
        </ClipPath>
      </Defs>
    </Svg>
  </TouchableOpacity>
}

const FantasyIcon = () => {
  return <TouchableOpacity>
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <G clip-path="url(#clip0_619_3470)">
        <Path d="M13.46 13.7849C14.18 13.9909 14.18 15.0099 13.46 15.2159L12.492 15.4929L12.215 16.4609C12.009 17.1809 10.99 17.1809 10.784 16.4609L10.507 15.4929L9.539 15.2159C8.819 15.0099 8.819 13.9909 9.539 13.7849L10.507 13.5079L10.784 12.5399C10.99 11.8209 12.009 11.8209 12.215 12.5399L12.492 13.5079L13.46 13.7849ZM0.54 7.21491L1.508 7.49191L1.785 8.45991C1.991 9.17991 3.01 9.17991 3.216 8.45991L3.493 7.49191L4.461 7.21491C5.181 7.00891 5.181 5.98991 4.461 5.78391L3.493 5.50691L3.216 4.53891C3.01 3.81991 1.991 3.81991 1.785 4.53891L1.508 5.50691L0.54 5.78391C-0.18 5.98991 -0.18 7.00891 0.54 7.21491ZM19.54 4.21491L20.508 4.49191L20.785 5.45991C20.991 6.17991 22.01 6.17991 22.216 5.45991L22.493 4.49191L23.461 4.21491C24.181 4.00891 24.181 2.98991 23.461 2.78391L22.493 2.50691L22.216 1.53891C22.01 0.819913 20.991 0.819913 20.785 1.53891L20.508 2.50691L19.54 2.78391C18.82 2.98991 18.82 4.00891 19.54 4.21491ZM6.652 7.76691C6.836 8.05691 7.182 8.20091 7.517 8.12691L9.958 7.54091L11.454 9.65191C11.654 9.93591 12.012 10.0629 12.347 9.96791C12.522 9.91891 12.67 9.81491 12.775 9.67691C12.871 9.55091 12.931 9.39691 12.941 9.23091L13.045 7.56291L22.447 13.8309C22.617 13.9439 22.81 13.9989 23.001 13.9989C23.324 13.9989 23.641 13.8429 23.834 13.5539C24.14 13.0939 24.016 12.4729 23.557 12.1669L14.445 6.09191L15.644 5.66591C15.971 5.54891 16.189 5.23891 16.189 4.89091C16.188 4.54291 15.966 4.23391 15.637 4.12091L13.211 3.27691L13.132 0.779913C13.116 0.435913 12.886 0.138913 12.558 0.0369127C12.23 -0.0650873 11.872 0.0489127 11.663 0.321913L10.172 2.27491L7.705 1.48591C7.378 1.38591 7.023 1.50091 6.816 1.77191C6.609 2.04391 6.592 2.41591 6.774 2.70491L8.186 4.87691L6.695 6.82991C6.487 7.10291 6.471 7.47691 6.655 7.76591L6.652 7.76691ZM22.001 18.9989H16.89C14.112 18.9989 12.648 20.3329 11.946 21.7469C11.244 20.3329 9.78 18.9989 7.002 18.9989H2C0.895 18.9989 0 19.8939 0 20.9989V22.9989C0 23.5509 0.448 23.9989 1 23.9989H23C23.552 23.9989 24 23.5509 24 22.9989V20.9989C24 19.8939 23.106 18.9989 22.001 18.9989Z" fill="#FEFEFC"/>
      </G>
      <Defs>
        <ClipPath id="clip0_619_3470">
          <Rect width="24" height="24" fill="#fff"/>
        </ClipPath>
      </Defs>
    </Svg>
  </TouchableOpacity>
}


const BookCalendar = () => {

  const { user } = useContext(UserContext);

  const handleRedirectToCalendar = () => {
    if (user?.isPremiumUser) {
      router.push('book-calendar')
    } else {
      router.push('special-offer');
    }
  }

  return <TouchableOpacity
      onPress={handleRedirectToCalendar}
      className="mx-3 mt-5 border-[.5px] p-3 border-[#727272] items-center justify-between flex-row rounded-[15px] bg-[#ffffff]">
    <View className="flex-1">
      <Text className="text-[28px] leading-[33.6px] font-cygrebold mb-6">Book Calendar</Text>
      <View className="flex-row">
        <TouchableOpacity className="rounded-[20px] mr-1.5 bg-[#E6E6E6] items-center justify-center h-[33px] max-w-[88px] w-full">
          <Text className="text-[#000000] text-sm leading-[16.8px] text-center font-cygreregular">Memories</Text>
        </TouchableOpacity>
        <TouchableOpacity className="rounded-[20px] mr-1.5 bg-[#E6E6E6] h-[33px] items-center justify-center max-w-[110px] w-full">
          <Text className="text-[#000000] text-sm leading-[16.8px] text-center font-cygreregular">Monthly View</Text>
        </TouchableOpacity>
      </View>
    </View>
    <WelcomeSmIcon />
  </TouchableOpacity>;
}

const CurrentBook = () => {


  const [book, setBook] = useState(undefined);

  const fetchLatestBook = useCallback(async () => {
    try {
      const { data } = await axios.get('users/home');
      setBook(data);
    } catch(error) {
      console.log(error);
    }
  }, []);

  useFocusEffect(
      useCallback(() => {
          fetchLatestBook()
      }, [fetchLatestBook])
  );

  if (book) {
    return (
      <ScrollView horizontal={true}
            className="mx-4 h-[270px]"
            showsHorizontalScrollIndicator={false}>
              <LatestBookCard book={book} />
              <AddBookCard />
      </ScrollView>
    );
  }

  return <AddBookCard containerStyles={'mx-4'} />
}


const LatestBookCard = ({ book }) => {

  const { pageCount : totalPages } = book;

  const [currentPage, setCurrentPage] = useState(book.currentPage);

  const handleReduceCounter = () => {
      const page = currentPage > 0 ? currentPage - 1 : 0;
      updatePageCount(page)
          .then(() => setCurrentPage(prev => prev > 0 ? prev - 1 : 0))
  }

  const handleAddCounter = () => {
      const page = currentPage < totalPages ? currentPage + 1 : currentPage;
      updatePageCount(page)
          .then(() => setCurrentPage(prev => prev < totalPages ? prev + 1 : prev))
  }

  const updatePageCount = async (page) => {
      try {
          await axios.put(`users/books/${book.id}/currentPage`, { page })
      } catch (error) {
          console.log(error);
      }
  }

  return (
      <View className="rounded-[15px] mr-4 flex-row bg-[#ffffff] justify-between max-w-[320px] w-full max-h-[220px] h-full mb-5 border-[.5px] border-[#8A8A8A] p-3">
        { book?.imageUrl ? (
          <ImageHandler
            source={book?.imageUrl}
            width={111}
            height={194}
            className="rounded-[6px] max-w-[111px] max-h-[194px] mr-[10px]" 
          />
        ) : (
          <BookPlaceHolder
            title={book?.title}
            author={book?.author}
            titleColor={book?.cover?.titleColor}
            backgroundColor={book?.cover?.backgroundColor}
           />
        ) }
        <View className="bg-[#1C1C1C] rounded-[6px] max-h-[194px] h-full">
          <View className="px-3 py-4 flex-row justify-between w-[171px]">
            <TouchableOpacity
              onPress={handleReduceCounter}
              className="rounded-full bg-[#8A8A8A] items-center justify-center h-[45px] w-[42px]">
              <Text className="text-[#FFFFFF] text-[31px] font-semibold leading-[37.5px]">-</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleAddCounter}
              className="rounded-full bg-[#6592E3] items-center justify-center h-[45px] w-[42px]">
              <Text className="text-[#FFFFFF] text-[31px] font-semibold leading-[37.5px]">+</Text>
            </TouchableOpacity>
          </View>
          <View className="items-center mb-6">
            <Text className="text-[34px] leading-[40px] font-bold text-[#fff]">{currentPage}</Text>
            <Text className="text-sm leading-[16px] font-medium text-[#fff]">of {book?.pageCount}</Text>
          </View>
          <View className="flex-row justify-center">
            <TouchableOpacity onPress={() => router.push({ pathname: 'countdown', params: { id: book.id }})}>
              <TimerIcon />
            </TouchableOpacity>
            <View className="w-[1px] h-[25px] bg-[#fff] mx-4"></View>
            <TouchableOpacity
              onPress={() => router.push({ pathname: 'create-note', params: { id: book.id }})}
            >
              <NoteIcon />
            </TouchableOpacity>
            <View className="w-[1px] h-[25px] bg-[#fff] mx-4"></View>
            <TouchableOpacity
              onPress={() => router.push({ pathname: 'create-quote', params: { id: book.id }})}
            >
              <QuoteIcon />
            </TouchableOpacity>
          </View>
        </View>
      </View>
  )
}

const AddBookCard = ({ containerStyles }) => {

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  return (
    <Fragment>
      <View //style={{ width: book ? '320' : '100%' }}
        className={`bg-[#1C1C1C] rounded-[15px] max-h-[220px] h-full min-w-[320px] px-5 py-3 ${containerStyles}`}>
          <Text className="text-[#fff] text-[34px] leading-[40px] font-cygrebold font-bold">
            Add a book
          </Text>
          <Text className="text-[#fff] text-sm leading-[16px] font-cygreregular font-light">Is there a book you are reading?</Text>
          <View className="flex-row mt-6">
            <TouchableOpacity
              onPress={() => setIsBottomSheetOpen(true)}
              className="bg-[#6592E3] h-[44px] justify-center items-center max-w-[126px] w-full flex-row flex-1 rounded-[25px] ">
              <MaterialIcons name='add' color='#fff' size={33} />
              <Text className="text-[18px] text-[#fff] font-cygrebold leading-[21px] font-bold">Add</Text>
            </TouchableOpacity>
            <MaginifierIcon />
          </View>
        </View>
        <AddBookBottomDrawer
          isBottomSheetOpen={isBottomSheetOpen}
          setIsBottomSheetOpen={setIsBottomSheetOpen}
        />
    </Fragment>
  );

}

const PersonalPlan = () => {
  return <View className="mt-5 mx-3 flex-row bg-[#1C1C1C] items-center rounded-[15px] max-h-[114px] h-full px-5 justify-between">
    <LaptopIcon />
    <Text className="text-[#FFFFFF] font-cygrebold text-[22px] leading-[25px] font-bold max-w-[145px]">
      Your Personal Reading Plan
    </Text>
  </View>;
}

const ThisWeekStatistics = ({ currentStreak, minutesRead, pagesRead, notesCount }) => {

  const hasNoProgress = minutesRead === 0 && pagesRead === 0 && notesCount === 0;

  const NoProgress = () => {
    return (
      <TouchableOpacity
        onPress={() => router.push('search-book')}
        className="flex-row flex-1 ml-5">
        <View className="flex-[.6]">
          <Text className="text-[18px] font-cygrebold text-primary">No progress for now</Text>
          <Text className="text-[12px] font-cygreregular">Click here to start your growth</Text>
        </View>
        <View className="absolute right-0 -mr-5">
          <RocketIcon />
        </View>
      </TouchableOpacity>
    );
  }

  return <View className="bg-[#FFFFFF] mx-4 my-8 flex-row border-[#727272] border-[.5px] rounded-[15px]">
    <View className="flex-row justify-center flex-1 items-center rounded-[14px] border-0 max-w-[108px] h-[95px] bg-[#6592E3]">
      <View>
        <FlameIcon />
      </View>
      <Text className="text-[#FFFFFF] font-cygrebold font-extrabold text-[26px] leading-[32px]">{currentStreak}</Text>
    </View>
    { hasNoProgress ? <NoProgress /> : (
      <View className="py-2 flex-1">
        <Text className="text-[18px] font-cygresemibold leading-[21.6px] text-center">This week statistics</Text>
        <View className="flex-row justify-center flex-1 items-center">
          <View className='mr-10 justify-center items-center'>
            <Text className="text-[#000000] text-[22px] leading-[26.4px] font-cygrebold">{pagesRead}</Text>
            <Text className="text-[#000000] font-cygreregular text-sm leading-[16.8px]">pages</Text>
          </View>
          <View className='mr-10 items-center'>
            <Text className="text-[#000000] text-[22px] leading-[26.4px] font-cygrebold">{minutesRead}</Text>
            <Text className="font-cygreregular text-sm leading-[16.8px]">minutes</Text>
          </View>
          <View className="items-center">
            <Text className="text-[#000000] text-[22px] leading-[26.4px] font-cygrebold">{notesCount}</Text>
            <Text className="font-cygreregular text-sm leading-[16.8px]">notes</Text>
          </View>
        </View>
      </View>
    )}
  </View>;
} 


const BookPlaceHolder = ({ title, author, titleColor, backgroundColor }) => {
    
    return (
        <View style={[styles.container, { backgroundColor: backgroundColor }]}>
            <View style={[styles.titleContainer, { backgroundColor: titleColor }]}>
                <Text style={[styles.titleText, { color: backgroundColor }]}>{title}</Text>
            </View>
            <View style={[styles.authorContainer]}>
                <Text style={[styles.authorText, { color: titleColor }]}>{author}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 111,
        height: 194,
        alignSelf: 'center',
        borderRadius: 6,
        marginRight: 10,
        overflow: 'hidden', // Add this to clip children to border radius
    },
    titleContainer: {
        flex: 1, // Takes remaining space
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
        padding: 8,
    },
    titleText: {
        fontSize: 20,
        fontFamily: 'CygreBold',
    },
    authorContainer: {
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
        flex: 1
    },
    authorText: {
        fontSize: 12,
        fontFamily: 'CygreBold',
    },
});