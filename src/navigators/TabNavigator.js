import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import StatisticsScreen from "../screens/StatisticsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import Icon from "react-native-vector-icons/Ionicons";
import { auth } from "../firebase";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="בית" // Set the initial screen to HomeScreen
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case "בית":
              iconName = focused ? "home" : "home-outline";
              break;
            case "סטטיסטיקות":
              iconName = focused ? "stats-chart" : "stats-chart-outline";
              break;
            case "פרופיל":
              iconName = focused ? "person" : "person-outline";
              break;
            default:
              iconName = "home-outline"; // Default icon if the route name doesn't match
              break;
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
        name="פרופיל"
        component={ProfileScreen}
      />
      <Tab.Screen
        options={{ headerShown: false }}
        name="סטטיסטיקות"
        initialParams={{ userId: auth.currentUser.uid }}
        component={StatisticsScreen}
      />
      <Tab.Screen
        options={{ headerShown: false }}
        name="בית"
        component={HomeScreen}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
