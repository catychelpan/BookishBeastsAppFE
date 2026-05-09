import { createContext, memo, useState } from "react"

export const UserContext = createContext({});

export const UserProvider = ({ children }) => {

    const [onboardingState, setOnboardingState] = useState({
        interestAreas: [],
        books: [],
        readingPurposes: [],
        neverForget: {
            hour: 0,
            minute: 0,
            timeFormat: '',
            timeZoneId: ''
        },
        booksAmountGoal: 13,
        minutesPerDay: 20,
        dayStrike: 7,
        booksSelected: [],
        name: null,
        isOnboardingCompleted: false,
        isNotificationsEnabled: false,
    });

    const [user, setUser] = useState({ name: '', id: '', isPremiumUser: false });

    const [recoveryEmail, setRecoveryEmail] = useState('');

    const [memo, setMemo] = useState({
        imageBlob: null,
        imageUri: null
    });

    const [verificationCode, setVerificationCode] = useState('');

    const [repetitionGroup, setRepetitionGroup] = useState({
        quotes: [],
        notes: []
    });

    const [quote, setQuote] = useState({
        collections: [],
        repetitionGroups: [],
        notes: [],
    });

    const [note, setNote] = useState({
        repetitionGroups: [],
        collections: [],
        quote: null,
        text: ''
    });

    const [bookFilter, setBookFilter] = useState({
        authors: [],
        readingStatuses: [],
        categories: [],
        collections: []
    });

    const [noteFilter, setNoteFilter] = useState({
        books: [], //book ids
        noteTypes: [], //note type ids
        hasPhoto: false //bool parameter
    });

    const [booksSelected, setBooksSelected] = useState({});
    const [noteTypesSelected, setNoteTypesSelected] = useState({});

    const [selectedCategories, setSelectedCategories] = useState({});
    const [selectedCollections, setSelectedCollections] = useState({});
    const [selectedReadingStatuses, setSelectedReadingStatuses] = useState({
        toRead: false,
        reading: false,
        finished: false,
        gaveUp: false,
        paused: false
    });


    const [onboarding, setOnboarding] = useState({
        commitToGrowth: { 
            7: false,
            14: false,
            30: false,
            50: false,
        },
        minutesPerDay: {
            20: false,
            30: false,
            45: false,
            1: false,
        },
        bookPerYear: 13,
        areas: [],
        people: [],
        books: [],
        reasons: []
    });

    const [genres, setGenres] = useState({});

    const [book, setBook] = useState({
        id: '',
        volumeInfo: {
            title: '',
            authors: [],
            description: '',
            pageCount: 0,
            categories: [],
            imageLinks: {
                thumbnail: ''
            }
        },
        collections: [],
        cover: {
            titleColor: '',
            backgroundColor: ''
        }
    });

    return <UserContext.Provider value={{
        verificationCode,
        recoveryEmail,
        setRecoveryEmail,
        setVerificationCode,
        genres,
        setGenres,
        book,
        setBook,
        onboarding,
        setOnboarding,
        quote,
        setQuote,
        note,
        setNote,
        bookFilter,
        setBookFilter,
        selectedCategories,
        setSelectedCategories,
        selectedCollections,
        setSelectedCollections,
        selectedReadingStatuses,
        setSelectedReadingStatuses,
        noteFilter,
        setNoteFilter,
        booksSelected,
        setBooksSelected,
        noteTypesSelected,
        setNoteTypesSelected,
        memo,
        setMemo,
        repetitionGroup,
        setRepetitionGroup,
        onboardingState,
        setOnboardingState,
        //TODO: to remove
        user,
        setUser
    }}>
        {children}
    </UserContext.Provider>
}