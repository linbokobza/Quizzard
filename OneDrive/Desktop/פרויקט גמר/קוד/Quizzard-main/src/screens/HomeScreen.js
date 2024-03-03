import {
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../firebase";
import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue,get } from "firebase/database";
import { FloatingAction } from "react-native-floating-action";
const HomeScreen = () => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [requestList, setRequestList] = useState([]);
  const [isApproveModalVisible, setApproveModalVisible] = useState(false);
  const [isDarkOverlayVisible, setIsDarkOverlayVisible] = useState(false);

  const profileImages = {
    female: require("../assets/images/woman.png"),
    male: require("../assets/images/man.png"),
    other: require("../assets/images/other.png"),
  };
  const fetchUserData = async () => {
    const user = auth.currentUser;

    if (user) {
      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);

      const userDataListener = onValue(
        userRef,
        (snapshot) => {
          const userData = snapshot.val();
          if (userData) {
            setUserData(userData);
            console.log("User data set:", userData);
          } else {
            console.log("User data not found for UID:", user.uid);
          }
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching user data:", error);
          setLoading(false);
        }
      );

      // Clean up the listener when the component unmounts
      return () => {
        off(userRef, userDataListener);
      };
    } else {
      console.log("No user is currently signed in.");
      setLoading(false);
    }
  };
  const actions = [
    {
      text: "Approve Lecturer",
      icon: require("../assets/images/man.png"),
      name: "Approve",
      position: 1,
    },
    {
      text: "Add Quiz",
      icon: require("../assets/images/man.png"),
      name: "Add Quiz",
      position: 2,
    },
    {
      text: "Add Question",
      icon: require("../assets/images/man.png"),
      name: "Add Question",
      position: 3,
    },
    {
      text: "Delete Quiz",
      icon: require("../assets/images/man.png"),
      name: "Delete Quiz",
      position: 4,
    },
  ];
  const handleFloatingAction = (name) => {
    setIsDarkOverlayVisible(!isDarkOverlayVisible);
    console.log(`Selected button: ${name}`);
    if (name === "Approve") {
      //fetchRequestList();
      //toggleApproveModal();
    }
  };
  const handleFloatingActionPress=()=>{
    setIsDarkOverlayVisible(!isDarkOverlayVisible); // Toggle overlay visibility
  }
  const renderFloatingActionButton = () => {
    if (userData && userData.role !== "S") {
      return (
          <FloatingAction
          actions={userData.role === "L" ? actions.slice(1) : actions}
          showBackground={false}
          position="left"
          style={styles.floatingActionButton}
          onPressMain={handleFloatingActionPress} 
          onPressItem={(name) => {
            handleFloatingAction(name);
          }}
            />
      );
    }
    return null;
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const quizzes = [
    {
      id: 1,
      title: "Quiz 1",
      image: require("../assets/images/user.png"), // Replace with actual quiz image
    },
    {
      id: 2,
      title: "Quiz 2",
      image: require("../assets/images/user.png"), // Replace with actual quiz image
    },
    {
      id: 3,
      title: "Quiz 3",
      image: require("../assets/images/user.png"), // Replace with actual quiz image
    },
    {
      id: 4,
      title: "Quiz 4",
      image: require("../assets/images/user.png"), // Replace with actual quiz image
    },
    {
      id: 5,
      title: "Quiz 5",
      image: require("../assets/images/user.png"), // Replace with actual quiz image
    },
    // Add more quizzes as needed
  ];

  const renderQuizCard = ({ item }) => (
    <TouchableOpacity style={styles.quizCard}>
      <Image source={item.image} style={styles.quizImage} />
      <Text style={styles.quizTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const yearDisplay = {
    1: "1st",
    2: "2nd",
    3: "3rd",
    4: "4th",
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
      <View style={styles.profileImageContainer}>
          {userData && userData.profileImage && (
            <Image
              source={profileImages[userData.profileImage]}
              style={styles.profileImage}
            />
          )}
        </View>
        <View style={styles.greetingContainer}>
          
          <Text style={styles.greetingText}>
            {loading
              ? "Loading..."
              : userData
              ? `   Hello ${userData.fullName}`
              : "User data not found"}
          </Text>
        </View>
      </View>
      <View style={styles.pointsContainer}>
        <Text style={styles.pointsText}>Your Points: {userData.points}</Text>
      </View>
      <View style={styles.pointsContainer}>
        <Text style={styles.pointsText}>
          You are in {yearDisplay[userData.year]} year
        </Text>
      </View>

      <FlatList
        data={quizzes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderQuizCard}
        style={styles.quizList}
      />
      {isDarkOverlayVisible && <View style={styles.darkOverlay} />}
      {renderFloatingActionButton()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5", // Light gray background
    padding: 16,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  greetingContainer: {
    flex: 1,
    marginRight: 20,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333", // Dark gray text color
  },
  profileImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 25,
    overflow: "hidden",
  },
  profileImage: {
    position:"relative",
    width: "100%",
    height: "100%",
  },
  pointsContainer: {
    marginBottom: 16,
  },
  pointsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333", // Dark gray text color
  },
  quizList: {
    flex: 1,
  },

  quizCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 8,
    backgroundColor: "#FFFFFF", // White background for quiz cards
    borderRadius: 8,
    elevation: 2, // Add elevation for a subtle shadow on Android
  },
  quizImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333", // Dark gray text color
  },
  logoutButton: {
    padding: 8,
    backgroundColor: "#FF0000", // Red color
    borderRadius: 10,
    marginLeft: 8,
  },
  floatingActionButton: {
    position:"absolute",
    bottom: 16,
    right: 16,
    zIndex: 1, // Set a higher zIndex for the FAB
  },
  optionButton: {
    backgroundColor: "#548AB7",
    padding: 30,
    borderRadius: 10,
    width: "48%", // Adjusted to fit two buttons side by side
  },
  optionText: {
    color: "#fff",
    textAlign: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: 22,
  },

  logoutButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark overlay color
  },
});
export default HomeScreen;