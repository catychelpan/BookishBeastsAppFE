import { Image, View, Text, Platform } from 'react-native'
import { Tabs } from 'expo-router'
import { icons } from '../../constants';

const TabIcon = ({ icon, color, name, focused }) => {
    return (
        <View className='items-center justify-center w-20' style={{ paddingTop: 10 }}>
            <View className={`rounded-full ${focused ? 'bg-[#6592E3] p-3' : ''}`}>
                <Image
                    source={icon}
                    resizeMode='contain'
                    tintColor={color}
                    className="w-5 h-[22px]"
                />
            </View>
            {!focused && (
                <Text
                    className='text-[12px] font-cygreregular'
                    style={{ color: color }}
                >
                    {name}
                </Text>
            )}
        </View>
    )
}

const TabsLayout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarHideOnKeyboard: true,
                tabBarBackground: () => <View className="bg-transparent" />,
                tabBarShowLabel: false,
                tabBarActiveTintColor: '#F9F9F9',
                tabBarInactiveTintColor: '#CDCDE0',
                tabBarItemStyle: {
                    paddingVertical: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                tabBarStyle: {
                    backgroundColor: '#0D0C0CD6',
                    position: 'absolute',
                    borderTopWidth: 1,
                    elevation: 0,
                    borderRadius: 44,
                    bottom: 50,
                    marginRight: 16,
                    marginLeft: 16,
                    borderTopColor: '#232533',
                    height: Platform.select({
                        ios: 88, 
                        android: 79,
                    }),
                    paddingBottom: 8
                }
            }}
        >
            <Tabs.Screen
                name='home'
                options={{
                    title: "",
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon
                            icon={icons.home}
                            color={color}
                            focused={focused}
                            name="Home"
                        />
                    )
                }}
            />
            <Tabs.Screen
                name='library'
                options={{
                    title: "Library",
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon
                            icon={icons.book}
                            color={color}
                            focused={focused}
                            name="Library"
                        />
                    )
                }}
            />
            <Tabs.Screen
                name='repetition'
                options={{
                    title: "Repetition",
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon
                            icon={icons.repetition}
                            color={color}
                            focused={focused}
                            name="Repetition"
                        />
                    )
                }}
            />
            <Tabs.Screen
                name='stats'
                options={{
                    title: "Stats",
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon
                            icon={icons.stats}
                            color={color}
                            focused={focused}
                            name="Stats"
                        />
                    )
                }}
            />
            <Tabs.Screen
                name='profile'
                options={{
                    title: "Profile",
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon
                            icon={icons.profile}
                            color={color}
                            focused={focused}
                            name="Profile"
                        />
                    )
                }}
            />
        </Tabs>
    )
}

export default TabsLayout