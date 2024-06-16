import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen"; // Import your existing HomeScreen
import StatisticsScreen from "../screens/StatisticsScreen"; // Import the new StatisticsScreen
import ProfileScreen from "../screens/ProfileScreen"; // Import the new ProfileScreen
import Icon from "react-native-vector-icons/Ionicons";
import QuizScreen from "../screens/QuizScreen";
import { auth } from "../firebase";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Statistics") {
            iconName = focused ? "stats-chart" : "stats-chart-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: "#F7AA53",
        inactiveTintColor: "gray",
      }}
    >
      <Tab.Screen
        options={{ headerShown: false }}
        name="Home"
        component={HomeScreen}
      />
      <Tab.Screen
        options={{ headerShown: false }}
        name="Statistics"
        initialParams={{ userId: auth.currentUser.uid }}
        component={StatisticsScreen}
      />
      <Tab.Screen
        options={{ headerShown: false }}
        name="Profile"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
