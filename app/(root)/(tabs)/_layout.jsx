//import { Iconicons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import { Platform } from "react-native";
import { useUserStore } from "../../../store/userStore";



function AndroidTabs() {

    const isAdmin = useUserStore((state) => state.isAdmin);

    return (
        <Tabs screenOptions = {{ headerShown: false}}>

            <Tabs.Screen name = "index" options = {{
                title: "Home",
                tabBarIcon: ({ color, size}) => (
                    // <Iconicons name = "home" color = {color} size={size}/>
                    <Ionicons name = "home" color = {color} size={size}/>
                ),
            }} />

            <Tabs.Screen name = "search" options = {{
                title: "Search",
                tabBarIcon: ({ color, size}) => (
                    <Ionicons name = "search" color = {color} size={size}/>
                    // <Iconicons name = "search" color = {color} size={size}/>
                ),
            }} />

            <Tabs.Screen name = "create" options = {{
                title: "Add",
                tabBarIcon: ({ color, size}) => (
                    <Ionicons name = "add-circle" color = {color} size={size}/>
                    // <Iconicons name = "add-circle" color = {color} size={size}/>
                ),
            }} />

            <Tabs.Screen name = "saved" options = {{
                title: "Saved",
                tabBarIcon: ({ color, size}) => (
                    <Ionicons name = "heart" color = {color} size={size}/>
                    // <Iconicons name = "heart" color = {color} size={size}/>
                ),
            }} />

            <Tabs.Screen name = "profile" options = {{
                title: "Profile",
                tabBarIcon: ({ color, size}) => (
                    <Ionicons name = "person" color = {color} size={size}/>
                    // <Iconicons name = "person" color = {color} size={size}/>
                ),
            }} />

        </Tabs>
    );
}

function IosTabs() {

    const isAdmin = useUserStore((state) => state.isAdmin);

    return (
        <NativeTabs>

            <NativeTabs.Trigger name="index">
                <Label>Home</Label>
                <Icon sf="house.fill" />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="search">
                <Label>Search</Label>
                <Icon sf="magnifyingglass" />

                {/* <NativeTabs.Trigger.Icon sf="gear" md="settings" />
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label> */}
            </NativeTabs.Trigger>

            {/* Create Property  */}

            {isAdmin && (
                <NativeTabs.Trigger name="create">
                    <Label>Add Property</Label>
                    <Icon sf="plus.circle.fill" />
                </NativeTabs.Trigger>
            )}


            <NativeTabs.Trigger name="saved">
                <Label>Saved</Label>
                <Icon sf="heart.fill" />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="profile">
                <Label>Profile</Label>
                <Icon sf="person.fill" />
            </NativeTabs.Trigger>

        </NativeTabs>
    );
}

export default function TabsLayout() {
     return Platform.OS === "ios" ? <IosTabs /> : <AndroidTabs />;
    //return <AndroidTabs />;
}
 
