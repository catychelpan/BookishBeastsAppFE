import {
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    ScrollView,
    StyleSheet
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useCallback } from "react";
import { router, useFocusEffect } from "expo-router";
import axios from '../../../network/axios';
import BookPageDropdown from "../../../components/BookPageDropdown";
import Feather from '@expo/vector-icons/Feather';
import ImageHandler from "../../../components/ImageHandler";
import { COLLECTION_ICON_MAP } from "../../../components/CollectionSvg";
import { QuoteStarsIcon } from "../../../components/Svg";
import { images } from "../../../constants";


const Notes = () => {

    const [isOpen, setIsOpen] = useState(false);

    const [selectedOption, setSelectedOption] = useState('Notes');

    const [bookNotes, setBookNotes] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

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

    const [isFilteredByBooks, setIsFilteredByBooks] = useState(true);

    const handleToggleFilterByCollections = () => {
        setIsFilteredByBooks(false);
    }

    const handleToggleFilterByBooks = () => {
        setIsFilteredByBooks(true);
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
                    onPress={handleRedirectToAddNewNoteCollection}
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

    const handleRedirectToAddNewNoteCollection = () => router.push('search-book')

    const fetchBookNotes = useCallback(async () => {
        try {
            const { data } = await axios.get('users/books/notes');
            setBookNotes(data);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }, [])

    useFocusEffect(
        useCallback(() => {
            fetchBookNotes()
        }, [fetchBookNotes])
    );

    return <SafeAreaView className="bg-[#F7F7F7] h-full flex-1">
        <View className="max-h-[60px] justify-between items-center flex-row h-full mx-5 mb-7">
            <TouchableOpacity
                activeOpacity={0.7}
                className="flex-1 pt-3 flex-row"
            >
            <BookPageDropdown
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                handleSelect={handleSelect} 
                selectedOption={selectedOption}
            />
            </TouchableOpacity>
            <TouchableOpacity
                className="bg-primary relative flex-1 mt-2.5 max-w-[44px] w-full items-center justify-center max-h-[44px] h-full rounded-[10px]">
                    <MaterialIcons name="filter-list" size={24} color="white" />
            </TouchableOpacity>
        </View>
        <View className="flex-row mx-5">
            <TouchableOpacity
                onPress={handleToggleFilterByBooks}
                className={`rounded-l-[100px] border-[.5] flex-row py-2 flex-1 ${isFilteredByBooks ? 'bg-black' : 'bg-[#fff]'} items-center justify-center`}>
                { isFilteredByBooks && (
                    <Feather name="check" size={16} color="white" />
                )}
                <Text className={`${isFilteredByBooks ? 'text-[#fff]' : 'text-black'} text-sm text-center ml-2`}>By Books</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={handleToggleFilterByCollections}
                className={`rounded-r-[100px] flex-row border-[.5] py-2 flex-1 ${isFilteredByBooks ? 'bg-[#fff]' : 'bg-black'} items-center justify-center`}>
                { !isFilteredByBooks && (
                    <Feather name="check" size={16} color="white" />
                )}
                <Text className={`${isFilteredByBooks ? 'text-black' : 'text-[#fff]'} text-sm text-center ml-2`}>By Collections</Text>
            </TouchableOpacity>
        </View>
{/*         <View className="mx-5 mt-7">
            <BookNoteCard name={'name'} author={'author'} notesCount={10} />
        </View> */}
        { isFilteredByBooks ? (
            <FlatList
                contentContainerStyle={{ paddingBottom: 100 }}
                className="mx-5 mt-7 flex-1"
                data={bookNotes}
                ListEmptyComponent={renderGifLoader()}
                renderItem={({ item }) => <BookNoteCard
                    key={item.id}
                    onPress={() => router.push({pathname: 'book-notes', params: { name: item.bookName, id: item.id }})}
                    name={item.bookName}
                    author={item.author}
                    notesCount={item.notesCount}   
                    titleColor={item?.cover?.titleColor}
                    backgroundColor={item?.cover?.backgroundColor}
                    imageUrl={item.imageUrl}
                    containerStyles={'mb-4'}
                />}
            />
        ) : <NoteCollections /> }
    </SafeAreaView>
}

const BookNoteCard = ({ name, author, titleColor, backgroundColor, notesCount, imageUrl, onPress, containerStyles }) => {
    return <TouchableOpacity
        onPress={onPress}
        className={`max-w-[353px] h-[172px] w-full flex-row border border-[#727272] px-3 py-3 rounded-[15px] ${containerStyles}`}>
            { imageUrl ? (
                <ImageHandler
                    source={imageUrl ? imageUrl : require('../../../assets/images/book.png')}
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
            <View className="self-end items-end justify-end flex-1">
                <View className="bg-[#D5E3FC] w-[63px] h-[63px] items-center justify-center rounded-full">
                    <Text className="text-black text-[22px] leading-[26.4px]">{notesCount}</Text>
                </View>
            </View>
        </View>
    </TouchableOpacity>
}

export default Notes;

function splitArray(arr) {
    const midpoint = Math.ceil(arr.length / 2);
    const firstHalf = arr.slice(0, midpoint);
    const secondHalf = arr.slice(midpoint);
    return [firstHalf, secondHalf];
}

const NoteCollections = () => {

    const [firstHalfCollections, setFirstHalfCollections] = useState([]);

    const [secondHalfCollections, setSecondtHalfCollections] = useState([]);

    const fetchCollections = useCallback(async () => {
        try {
            const { data } = await axios.get('users/note-collections');
            //console.log(data)
            const [first, second] = splitArray(data);
            //we need collections variable in case there are already selected collections
            setFirstHalfCollections(first);
            setSecondtHalfCollections(second);
        } catch (error) {
            console.log(error);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchCollections()
        }, [fetchCollections])
    );

    return (
        <ScrollView className="m-5" showsVerticalScrollIndicator={false}>
            <View className="flex-row justify-between space-x-3 w-full">
                <View className="w-full flex-[.5]">
                    <NewCollection />
                    { secondHalfCollections
                        .map(item => 
                            <ExistingCollection
                                key={item.id}
                                name={item.name}
                                onSelected={() => router.push({pathname:
                                     'book-notes', params: { name: item.name, id: item.id, byCollection: true }})}
                                selected={item.selected}
                                notesCount={item.notesCount}
                                iconId={item.iconId}
                            />)
                    }
                </View>
                <View className="w-full flex-[.5]">
                    { firstHalfCollections
                        .map(item =>
                            <ExistingCollection
                                key={item.id}
                                onSelected={() => router.push({pathname:
                                     'book-notes', params: { name: item.name, id: item.id, byCollection: true }})}
                                name={item.name} 
                                selected={item.selected}
                                notesCount={item.notesCount}
                                iconId={item.iconId}
                        />) }
                </View>
            </View>
            <View className="h-20"></View>
        </ScrollView>
    );
}


const NewCollection = ({ containerStyles }) => {

    return <View className={`bg-black rounded-[20px] mb-4 justify-between p-4 max-w-[169px] flex-1 max-h-[174px] ${containerStyles}`}>
        <Text className="font-cygrebold mb-7 text-[22px] leading-[26.4px] font-bold text-[#ffffff]" numberOfLines={2} ellipsizeMode="tail">New Collection</Text>
        <TouchableOpacity
            onPress={() => router.push({pathname: '/create-note-collection', params: { fromSelect: true }})}
            className="items-center self-end bg-[#fff] max-w-[61px] max-h-[62px] rounded-full justify-center p-4">
            <MaterialIcons name="add" size={30} />
        </TouchableOpacity>
    </View>
}

const ExistingCollection = ({ name, iconId, notesCount, onSelected, containerStyles }) => {

    const IconElement = COLLECTION_ICON_MAP[iconId];

    return (
        <TouchableOpacity
            onPress={onSelected}
            className={`bg-[#D5E3FC] relative mb-4 overflow-hidden border-[#8A8A8A] border-[.5px] rounded-[20px] justify-between p-4 h-[174px] ${containerStyles}`}>
            <Text
                className={`font-cygrebold mb-3 text-[22px] leading-[26.4px] font-bold text-[#121F16]`}
                numberOfLines={2} ellipsizeMode="tail">{name}</Text>
                { notesCount > 0 ? (
                    <View className="bg-[#EEEEEE] self-start rounded-[21px] px-2.5 py-1">
                        <Text className="text-black text-sm font-medium">{`${notesCount} books`}</Text>
                    </View>
                ) : <View className="px-2.5 py-1"></View> }
            <View
                className="items-center  self-end max-w-[61px] bottom-0 relative -right-1 -z-10 max-h-[61px] rounded-full justify-center">
                    <IconElement fill={'#6592E3'} />
            </View>
        </TouchableOpacity>
    );
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