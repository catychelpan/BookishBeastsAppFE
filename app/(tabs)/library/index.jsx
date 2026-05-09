import {
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    FlatList,
    RefreshControl,
    StyleSheet
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../../constants";
import { MaterialIcons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import { useRef, useState, useCallback, useContext } from "react";
import { router, useFocusEffect } from "expo-router";
import axios from '../../../network/axios';
import { UserContext } from "../../../context/UserContext";
import BookPageDropdown from "../../../components/BookPageDropdown";
import ImageHandler from "../../../components/ImageHandler";
import { debounce } from "lodash";
import { QuoteStarsIcon } from "../../../components/Svg";


const Index = () => {


    const inputRef = useRef(null);
    const [searchText, setSearchText] = useState('');

    const [books, setBooks] = useState([]);

    const [refreshing, setRefreshing] = useState(false);

    const booksToRead = books.filter(item => item.status === 0).length;

    const booksReading = books.filter(item => item.status === 1).length;

    const booksFinished = books.filter(item => item.status === 2).length;

    const [isLoading, setIsLoading] = useState(true);

    const { bookFilter } = useContext(UserContext);

    const [isOpen, setIsOpen] = useState(false);

    const handleCloseBtn = () => {}

    const [selectedOption, setSelectedOption] = useState('Books');

    const handleSelect = (option) => {
        setSelectedOption(option);
        setIsOpen(false)
        //TODO:refactor
        switch (option) {
            case "Notes":
                router.push('/library/notes');
                break;
            case "Quotes":
                router.push('/library/quotes')
                break;
            case "Books":
                router.push('/library')
                break;
            default:
                return

        }
    }

    const renderGifLoader = () => {
        if (isLoading) {
            return (
                <View className="items-center justify-center">
                <Image
                    source={require('../../../assets/gifs/book-loader.gif')}
                    width={150}
                    height={150}
                    className="max-h-[150px] max-w-[150px]"
                />
                <Text className="text-black text-[24px] leading-[28.8px] font-cygreregular">Wait a bit...</Text>
                </View>
            );
        }
        return renderEmptyState();
  };

    const renderEmptyState = () => {
        return (
            <View className="flex-1 justify-center">
                <View className="items-center justify-end mb-10">
                    <Text className="text-[22px] mb-10 text-black leading-[26.4px] font-cygrebold">Can’t see anything here</Text>
                    <Image source={images.noteEyes} width={255} height={54} className="max-w-[255px] max-h-[54px]" />
                </View>
                <TouchableOpacity
                    onPress={handleAddBookRedirect}
                    className="mx-5 bg-black max-h-[106px] h-full flex-row justify-center items-center rounded-[20px]">
                    <View
                        className="mx-7">
                        <Text className="font-cygresemibold leading-[19.2px] font-bold text-[#fff] max-w-[157px]">Add books to your library</Text>
                    </View>
                    <QuoteStarsIcon />
                </TouchableOpacity>
            </View>
        );
    }

    const handleAddBookRedirect = () => router.push('search-book');

    const getProgress = (totalPages, currentPage) => {
        return Math.round(currentPage / totalPages * 100).toString();
    }

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
    
        // Your refresh logic here
        await fetchBooks()
        setRefreshing(false);

    }, []);

    const fetchBooks = useCallback(debounce(async (search) => {
         const queryParams = new URLSearchParams();
    
        if (bookFilter.authors.length > 0) {
            bookFilter.authors.forEach(author => {
                queryParams.append('authors', author);
            });
        }
        
        if (bookFilter.readingStatuses.length > 0) {
            bookFilter.readingStatuses.forEach(status => {
                queryParams.append('statuses', status);
            });
        }
        
        if (bookFilter.categories.length > 0) {
            bookFilter.categories.forEach(category => {
                queryParams.append('categories', category);
            });
        }
        
        if (bookFilter.collections.length > 0) {
            bookFilter.collections.forEach(collection => {
                queryParams.append('collections', collection);
            });
        }

        if (search) {
            queryParams.append('searchText', search);
        }

        try {
            setIsLoading(true);
            const { data } = await axios.get(`/users/books?${queryParams.toString()}`);
            setBooks(data);
        } catch (error) {
            console.log(error);
        }
        finally {
            setIsLoading(false);
        }
    }, 500),[bookFilter]);

    const handleSearch = (text) => {
        setSearchText(text);
        fetchBooks(text);
    }


    const getFiltersCount = useCallback(() => {
        return Object.values(bookFilter)
        .filter(array => array.length > 0).length;
    }, [bookFilter])

    useFocusEffect(
        useCallback(() => {
            fetchBooks(searchText)
        }, [fetchBooks])
    );

    //console.log(books[0], books.length)

    return <SafeAreaView className="bg-[#F7F7F7] h-full flex-1">
        <View className="max-h-[60px] justify-between items-center flex-row h-full mx-5 mb-7">
            <TouchableOpacity
                activeOpacity={0.7}
                className="flex-1 pt-3 flex-row"
            >
{/*             <View className="flex-row">
                <Text className="text-black text-[24px] leading-[28.8px] font-cygrebold font-bold">Books</Text>
                <MaterialIcons name="arrow-drop-down" size={24} color="black" />
            </View> */}
            <BookPageDropdown
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                handleSelect={handleSelect} 
                selectedOption={selectedOption}
            />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => router.push('search-book')}
                className="bg-primary flex-1 mt-2.5 mr-2.5 max-w-[44px] w-full items-center justify-center max-h-[44px] h-full rounded-[10px]">
                    <Entypo name="plus" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => router.push('book-filters')}
                className="bg-primary relative flex-1 mt-2.5 max-w-[44px] w-full items-center justify-center max-h-[44px] h-full rounded-[10px]">
                    <MaterialIcons name="filter-list" size={24} color="white" />
                    { getFiltersCount() > 0 && (
                        <View className="absolute -top-1 -right-1 rounded-full h-[16px] w-[16px] bg-black">
                            <Text className="text-white text-center text-[11px]">{getFiltersCount()}</Text>
                        </View>
                    ) }
            </TouchableOpacity>
        </View>
            <View className="mx-5 max-h-[50px]">
                <View className="bg-[#ffffff] mb-12 border border-[#49454F] items-center max-h-[43px] h-full flex-row justify-between w-full rounded-[26px] px-5">
                    <MaterialIcons name="search" color={'#49454F'} size={22} />
                    <TextInput
                        ref={inputRef}
                        value={searchText}
                        onChangeText={handleSearch}
                        className="bg-[#ffffff] font-cygreregular justify-center items-center flex-1 pl-4 text-[#000000] leading-[16.8px] text-sm"
                        placeholder="Search a book"
                    />
                    <TouchableOpacity onPress={handleCloseBtn} className="rounded-full bg-[#000] p-1">
                        <MaterialIcons name='close' color={'#fff'} size={14} />
                    </TouchableOpacity>
                </View>
            </View>
            <View className="mx-5 flex-row justify-center items-center mt-5">
                <BookStatBox
                    statName={'To Read'}
                    count={booksToRead}
                    containerStyles={'mr-1'} 
/*                     onPress={() =>
                         setCurrentReadingStatus(prev =>
                             ({...defaultReadingStatuses, toRead: !prev['toRead'] }))} */
                />
                <BookStatBox
                    statName={'Reading'}
                    count={booksReading}
                    containerStyles={'mr-1'} 
/*                     onPress={() =>
                         setCurrentReadingStatus(prev =>
                             ({...defaultReadingStatuses, reading: !prev['reading'] }))} */
                />
                <BookStatBox
                    statName={'Finished'}
                    count={booksFinished}
/*                     onPress={() =>
                         setCurrentReadingStatus(prev =>
                             ({...defaultReadingStatuses, finished: !prev['finished'] }))} */
                />
            </View>
            <FlatList
                contentContainerStyle={{ paddingBottom: 100 }}
                className="flex-1 mx-5 mt-5"
                data={books}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={true}
                maxToRenderPerBatch={10}
                updateCellsBatchingPeriod={50}
                windowSize={5}
                initialNumToRender={10}
                keyExtractor={item => item.id}
                ListEmptyComponent={renderGifLoader()}
                refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    // Optional props:
                    colors={['#9Bd35A', '#689F38']} // Android
                    tintColor="#689F38"  // iOS
                    title="Pull to refresh" // iOS
                />
            }
            renderItem={({ item }) => <BookStatus
                key={item.id}
                author={item.author}
                name={item.title}
                progress={getProgress(item.totalPages, item.currentPage)}
                imageUrl={item.imageUrl}
                containerStyles={'mb-4'}
                tag={item.bookCollections.length > 0 && item.bookCollections[0].name}
                titleColor={item?.titleColor}
                backgroundColor={item?.backgroundColor}
                onPress={() => router.push({pathname: 'saved-book', params: { id: item.id }})}
            />}
            />
    </SafeAreaView>
}


const BookStatBox = ({ statName, onPress, count, containerStyles }) => {
    return <TouchableOpacity
        onPress={onPress}
        className={`bg-[#121F16] rounded-[15px] max-w-[112px] items-center w-full max-h-[83px] h-full ${containerStyles}`}>
        <Text className="text-[14px] font-cygrebold leading-[16.8px] font-bold text-[#fff] my-4">{statName}</Text>
        <View className="bg-primary rounded-[22px] justify-center items-center max-w-[38px] w-full mb-5">
            <Text className="text-[14px] leading-[16.8px] font-cygreregular p-1 text-[#fff]">{count}</Text>
        </View>
    </TouchableOpacity>
}


const BookStatus = ({ name, author, titleColor, backgroundColor, progress, tag, imageUrl, onPress, containerStyles }) => {
    return <TouchableOpacity
        onPress={onPress}
        className={`max-w-[353px] h-[172px] w-full flex-row border border-[#727272] px-3 py-3 rounded-[15px] ${containerStyles}`}>
            { imageUrl ? (
                <ImageHandler
                    source={imageUrl}
                    className="max-w-[99px] max-h-[141px] w-full h-full mr-4"
                    width={99}
                    height={141}
                />
            ) : (
                <BookPlaceHolder
                    title={name}
                    author={author}
                    titleColor={titleColor}
                    backgroundColor={backgroundColor}
                />
            )}
        <View className="w-full flex-1">
            <Text className="text-black text-[18px] font-cygrebold leading-[21.6px] max-w-[200px]" numberOfLines={1} ellipsizeMode='tail'>{name}</Text>
            <Text className="text-black text-sm font-cygreregular leading-[16.8px] max-w-[210px]">{author}</Text>
            <Text className="text-primary text-right text-[12px] leading-[14.4px] mt-2 mr-2">{`${progress}%`}</Text>
            <View className="relative max-w-[195px] w-full max-h-[13px] h-full bg-[#EEEEEE] mb-7 rounded-[15px]">
                <View className={`absolute h-full bg-primary rounded-[15px]`} style={{ width: `${progress}%` }}></View>
            </View>
        { tag ? (
            <View className="bg-primary rounded-[5px] self-start flex-1 max-h-[28px] py-1 px-2 items-center justify-center">
                <Text className="text-[14px] leading-[16.8px] font-cygreregular text-[#fff] text-center">{tag}</Text>
            </View>
        ) : <></> }
        </View>
    </TouchableOpacity>
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
        width: 99,
        height: 141,
        alignSelf: 'center',
        borderRadius: 6,
        marginRight: 12,
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

export default Index;