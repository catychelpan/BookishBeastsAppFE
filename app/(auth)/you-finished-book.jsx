import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    StyleSheet,
    Platform,
    Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState, useRef } from "react";
import Entypo from '@expo/vector-icons/Entypo';
import ImageHandler from "../../components/ImageHandler";
import axios from '../../network/axios';
import { UserContext } from "../../context/UserContext";
import { useCameraPermissions } from 'expo-camera';
import { CalendarIcon } from "../../components/Svg";
import AntDesign from '@expo/vector-icons/AntDesign';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const YouFinishedBook = () => {

    const { 
            imageUrl,
            id,
            titleColor,
            backgroundColor,
            title,
            author
          } = useLocalSearchParams();

    const [memoText, setMemoText] = useState('');
    const [rating, setRating] = useState(0);
    const { memo, setMemo } = useContext(UserContext);
    const [permission, requestPermission] = useCameraPermissions();
    const [lastBooks, setLastBooks] = useState([]);
    const [isCapturing, setIsCapturing] = useState(false);

    // Ref for the shareable achievement view
    const achievementRef = useRef();

    const [goalState, setGoalState] = useState({
      booksGoal: 0,
      currentAmountBooksGoal: 0,
    });

    const handleMemoChange = (text) => {
      setMemoText(text)
    }

    const handleRatingPress = (selectedRating) => {
      setRating(selectedRating);
    }

    const handleOpeningCamera = () => {
      requestPermission().then(j => {
        router.push('camera')
      });
    }

    const fetchLastBooks = async () => {
      try {
        const { data } = await axios.get('users/books/last-read?limit=1&skip=1');
        setLastBooks(data);
      } catch(error) {
        console.log(error);
      }
    }

    const fetchUserGoalState = async () => {
        try {
            const { data } = await axios.get('users/goals/state');
            setGoalState(prev => ({...prev, 
                booksGoal: data?.booksGoal,
                currentAmountBooksGoal: data?.currentAmountBooksGoal
            }));
        } catch(error) {
            console.log(error);
        }
    }

    useEffect(() => {
      fetchLastBooks();
      fetchUserGoalState();
    }, []);

    const handleSave = async () => {
      try {
        const blob = memo?.imageBlob;
        const formData = new FormData();
        formData.append('memo', memoText);
        formData.append('bookId', id);
        formData.append('rating', rating);
        
        console.log(blob, memo);
        
        if (memo?.imageUri && blob) {
          formData.append('image', {
            uri: memo.imageUri,
            type: blob.type,
            name: blob._data?.name,
          });
        }
        
        await axios.post('users/books/read-events', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        router.back();
      } catch(error) {
        console.log(error);
      }
    }

    useEffect(() => {
      return () => {
        setMemo({imageUri: null, imageBlob: null});
      }
    }, []);

    const renderFinishedBookImage = () => {
      return imageUrl ? (
        <ImageHandler
            source={{uri: imageUrl}}
            width={70}
            height={99} 
        />
      ) : (
        <BookPlaceHolder
          title={title}
          author={author}
          titleColor={titleColor}
          backgroundColor={backgroundColor}
        />
      )
    }

    const getBooksGoalLeft = () => {
      return Math.max(goalState.booksGoal - goalState.currentAmountBooksGoal, 0);
    }

    // Share screenshot of the achievement
    const handleShareScreenshot = async () => {
      try {
        setIsCapturing(true);
        
        // Wait a bit for the state to update and render
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Capture the achievement view as an image
        const uri = await captureRef(achievementRef, {
          format: 'png',
          quality: 1,
        });

        // Check if sharing is available
        const isAvailable = await Sharing.isAvailableAsync();
        
        if (isAvailable) {
          await Sharing.shareAsync(uri, {
            mimeType: 'image/png',
            dialogTitle: 'Share your reading achievement!',
            UTI: 'public.png',
          });
        } else {
          // Fallback to basic Share API with just text
          await Share.share({
            message: `📚 I just finished reading "${title}" by ${author}! ${rating > 0 ? `I rated it ${rating}/5 ⭐` : ''}\n\nTracking my reading with Bookish 📖✨`,
            title: 'My Reading Achievement'
          });
        }
      } catch (error) {
        console.log('Error sharing screenshot:', error);
      } finally {
        setIsCapturing(false);
      }
    };


    return (
        <SafeAreaView className="bg-[#F7F7F7] flex-1">
          <ScrollView className="flex-1">
              <View className="max-h-[60px] items-center h-full mx-5 mb-7">
                  <View className="flex-row justify-between ites-center w-full items-center mt-2">
                      <TouchableOpacity
                          onPress={() => router.back()}
                          className="flex-1 mr-5 max-w-[44px] w-full items-center justify-center rounded-[10px]">
                              <MaterialIcons name="close" size={24} color="black" />
                      </TouchableOpacity>
                      <TouchableOpacity
                          onPress={handleSave}
                          className="bg-primary rounded-[30px] flex-1 mt-2.5 max-w-[110px] w-full items-center justify-center max-h-[48px] h-full py-2 px-4">
                              <Text className="leading-[19.2px] text-[#fff] font-cygrebold">Save</Text>
                      </TouchableOpacity>
                  </View>
              </View>

              {/* Shareable Achievement View */}
              <View 
                ref={achievementRef} 
                collapsable={false}
                className="bg-[#F7F7F7]"
              >
                <View className="mx-5 mt-8 items-center flex-1">
                    <Text className="text-black font-cygrebold text-[22px] leading-[26.4px] text-center">
                    Congratulations!
                    </Text>
                    <Text className="text-black font-cygrebold text-[22px] leading-[26.4px] text-center">
                        You've finished the book!
                    </Text>
                    { imageUrl ? (
                      <ImageHandler
                          className="mt-7"
                          source={{uri: imageUrl}}
                          width={154}
                          height={219} 
                      />
                    ) : (
                      <BookPlaceHolder
                        title={title}
                        author={author}
                        titleColor={titleColor}
                        backgroundColor={backgroundColor}
                        isLarge
                      />
                    )}
                    <View className="flex-row gap-1 items-center my-6">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity key={star} onPress={() => handleRatingPress(star)}>
                          <AntDesign 
                            name="star" 
                            size={39} 
                            color={star <= rating ? "#FFD700" : "#D3D3D3"}
                          /> 
                        </TouchableOpacity>
                      ))}
                    </View>
                    <View className="border-[.3px] py-5 px-4 gap-x-2 rounded-[20px] border-[#8A8A8A] flex-row w-full justify-center my-7">
                      { renderFinishedBookImage() }
                      { lastBooks.length > 0 ? lastBooks.map((book) => {
                        if (book.imageUrl) {
                          return <ImageHandler
                            key={book.id}
                            width={70}
                            height={99}
                            className="max-w-[70px] max-h-[99px]"
                            source={{uri: book.imageUrl}} />
                        }
                        return <BookPlaceHolder
                          key={book.id}
                          title={book.title}
                          author={book.author}
                          titleColor={book.titleColor}
                          backgroundColor={book.backgroundColor} />
                      }) : null}
                      <View className="bg-[#1C1C1C] rounded-[20px] items-center justify-center flex-1">
                        <Text className="text-[22px] font-cygrebold font-bold text-[#fff]">{getBooksGoalLeft()} more</Text>
                        <Text className="text-sm font-cygreregular text-[#fff] max-w-[90px]">To finish your monthly goal</Text>
                      </View>
                    </View>

                    {/* Branding for screenshot */}
                    {isCapturing && (
                      <View className="items-center mb-4">
                        <Text className="text-[#8A8A8A] font-cygreregular text-sm">
                          Tracked with Bookish 📚
                        </Text>
                      </View>
                    )}
                </View>
              </View>
              <View className="mx-5 items-center flex-1">
                  <Text className="text-black font-cygrebold text-[22px] leading-[26.4px] mt-8 self-start">
                      Keep The Memory
                  </Text>
                  <Text className="text-black leading-[19.2px] self-start font-cygreregular mt-2.5">
                    Capture this precious moment, take a photo and write some final thoughts on this book.
                  </Text>

                  { memo.imageUri ? (
                    <ImageHandler source={memo.imageUri} className="my-6 w-[242px] h-[242px] rounded-full"
                      resizeMode='cover'
                      width={242} height={242} />
                  ) : (
                    <TouchableOpacity
                        onPress={handleOpeningCamera}
                        className="w-[108px] h-[108px] rounded-full bg-primary items-center justify-center mt-7">
                        <Entypo name="camera" size={40} color="white" />
                    </TouchableOpacity>
                  )}
                  <View className="flex-1 my-7 w-full min-h-[137px]">
                      <TextInput
                          placeholder="How do you feel about this book?" 
                          className="border-[#8A8A8A] p-4 justify-start border-[.5px] rounded-[20px] w-full h-full flex-1"
                          textAlignVertical="top"
                          value={memoText}
                          onChangeText={handleMemoChange}
                          multiline
                      />
                  </View>
              </View>

            <TouchableOpacity 
              onPress={handleShareScreenshot}
              className="bg-black px-8 flex-row justify-between my-6 items-center mx-5 rounded-[20px] max-h-[106px] py-4"
            >
                <Text className="font-cygrebold max-w-[98px] text-white">Share your achievement with others!</Text>
                <CalendarIcon />
            </TouchableOpacity>

          </ScrollView>
        </SafeAreaView>
    );
}

const BookPlaceHolder = ({ title, author, titleColor, backgroundColor, isLarge }) => {
    const width = isLarge ? 154 : 70;
    const height = isLarge ? 219 : 99;
    const titleFontSize = isLarge ? 28 : 20;
    const authorFontSize = isLarge ? 16 : 12;
    
    return (
        <View style={[styles.container, { backgroundColor, width, height }]}>
            <View style={[styles.titleContainer, { backgroundColor: titleColor }]}>
                <Text style={[styles.titleText, { color: backgroundColor, fontSize: titleFontSize }]}>{title}</Text>
            </View>
            <View style={[styles.authorContainer]}>
                <Text style={[styles.authorText, { color: titleColor, fontSize: authorFontSize }]}>{author}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        borderRadius: 6,
        overflow: 'hidden',
    },
    titleContainer: {
        flex: 1,
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
        padding: 8,
    },
    titleText: {
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
        fontFamily: 'CygreBold',
    },
});

export default YouFinishedBook;