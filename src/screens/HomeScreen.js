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
import { getDatabase, update, ref, onValue, get } from "firebase/database";
import { FloatingAction } from "react-native-floating-action";
import RequestModal from "../components/RequestModal";
import AddQuizModal from "../components/AddQuizModal";

const HomeScreen = () => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [requestList, setRequestList] = useState([]);
  const [isApproveModalVisible, setApproveModalVisible] = useState(false);
  const [isDarkOverlayVisible, setIsDarkOverlayVisible] = useState(false);
  const [isAddQuizModalVisible, setAddQuizModalVisible] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  let userEmail = null;

  const toggleApproveModal = () => {
    setApproveModalVisible(!isApproveModalVisible);
  };

  const toggleAddQuizModal = () => {
    setAddQuizModalVisible(!isAddQuizModalVisible);
  };

  const handleRequest = async (requestId, status) => {
    try {
      const db = getDatabase();

      const requestRef = ref(db, `RequestLecturer/${requestId}`);
      const requestSnapshot = await get(requestRef);
      const requestEmail = requestSnapshot.val().email;

      const userDataRef = ref(db, `users/`);
      const usersSnapshot = await get(userDataRef);
      const usersData = usersSnapshot.val();

      const userEntry = Object.entries(usersData).find(
        ([userId, userData]) => userData.email === requestEmail
      );

      const [userId, userData] = userEntry;

      if (status === "true") {
        await update(requestRef, { status: "Approved" });
        await update(ref(db, `users/${userId}`), { role: "L" });
      } else {
        await update(requestRef, { status: "Declined" });
      }

      // Close the modal or update the state as needed
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const profileImages = {
    female: require("../assets/images/woman.png"),
    male: require("../assets/images/man.png"),
    other: require("../assets/images/other.png"),
  };



  const fetchUserData = async () => {
    const user = auth.currentUser;
    const db = getDatabase();

    if (user) {
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
      text: "אשר מרצה",
      icon: require("../assets/images/man.png"),
      name: "Approve",
      position: 1,
    },
    {
      text: "הוספת קוויז",
      icon: require("../assets/images/man.png"),
      name: "Add Quiz",
      position: 2,
    },
    {
      text: "הוספת שאלה",
      icon: require("../assets/images/man.png"),
      name: "Add Question",
      position: 3,
    },
    {
      text: "מחיקת קוויז",
      icon: require("../assets/images/man.png"),
      name: "Delete Quiz",
      position: 4,
    },
  ];

  const handleFloatingAction = (name) => {
    setIsDarkOverlayVisible(!isDarkOverlayVisible);
    if (name === "Approve") {
      toggleApproveModal();
      fetchRequestList();
    }
    if (name === "Add Quiz") {
      toggleAddQuizModal();
      fetchRequestList();
    }
  };

  const handleFloatingActionPress = () => {
    setIsDarkOverlayVisible(!isDarkOverlayVisible); // Toggle overlay visibility
  };

  userEmail = userData.email;
  const renderFloatingActionButton = () => {
    if (userData && userData.role !== "S") {
      return (
        <FloatingAction
          actions={userData.role === "L" ? actions.slice(1) : actions}
          showBackground={false}
          position="right"
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
    fetchQuizzes();
  }, []);

  // const quizzes = [
  //   {
  //     id: 1,
  //     title: "אלגוריתמים",
  //     image: require("../assets/images/user.png"), // Replace with actual quiz image
  //   },
  //   {
  //     id: 2,
  //     title: "מבנה נתונים",
  //     image: require("../assets/images/user.png"), // Replace with actual quiz image
  //   },
  //   {
  //     id: 3,
  //     title: "אנליזה נומרית",
  //     image: require("../assets/images/user.png"), // Replace with actual quiz image
  //   },
  //   {
  //     id: 4,
  //     title: "חישוביות וסיבוכיות",
  //     image: require("../assets/images/user.png"), // Replace with actual quiz image
  //   },
  //   {
  //     id: 5,
  //     title: "לוגיקה 2",
  //     image: require("../assets/images/user.png"), // Replace with actual quiz image
  //   },
  //   // Add more quizzes as needed
  // ];
console.log(userEmail)
  const renderQuizCard = ({ item }) => (
    <TouchableOpacity style={styles.quizCard}>
      <Image
        source={{ uri: item.image }}
        style={styles.quizImage}
        defaultSource={require("../assets/images/user.png")}
      />
      <Text style={styles.quizTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const fetchQuizzes = async () => {
    const db = getDatabase();
    try {
      const quizzesRef = ref(db, "Quizzes");
      const snapshot = await get(quizzesRef);

      if (snapshot.exists()) {
        const quizzesData = snapshot.val();
        const quizzesArray = Object.entries(quizzesData).map(([id, quiz]) => ({
          id,
          title: quiz.title,
          image: quiz.image, // Add the correct property based on your structure
        }));

        // Update the state with the fetched quizzes
        setQuizzes(quizzesArray);
      } else {
        console.log("No quizzes found.");
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  const fetchRequestList = async () => {
    const db = getDatabase();
    console.log("Image URI:", item.imageUri);

    try {
      const requestsRef = ref(db, "RequestLecturer/");
      onValue(requestsRef, (snapshot) => {
        const data = snapshot.val();
        const newRequest = Object.entries(data)
          .filter(([_, request]) => request.status === "waiting")
          .map(([requestId, request]) => ({ ...request, id: requestId }));
        setRequestList(newRequest);
      });
      const snapshot = await get(requestsRef);
    } catch (error) {
      console.error("Error fetching request list:", error);
    }
  };

  const yearDisplay = {
    1: "שנה ראשונה",
    2: "שנה שניה",
    3: "שנה שלישית",
    4: "שנה רביעית",
  };

  return (
    <SafeAreaView style={styles.container}>
      <RequestModal
        isVisible={isApproveModalVisible}
        onRequestClose={toggleApproveModal}
        requestList={requestList}
        handleRequest={handleRequest}
      />
      <AddQuizModal
        isVisible={isAddQuizModalVisible}
        onRequestClose={toggleAddQuizModal}
        fetchQuizzes={fetchQuizzes}
        lecturerEmail={userEmail}
      />
      {renderFloatingActionButton()}

      <View style={styles.header}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>
            {loading
              ? "Loading..."
              : userData
              ? `  שלום ${userData.fullName} `
              : "User data not found"}
          </Text>
        </View>
        <View style={styles.profileImageContainer}>
          {userData && userData.profileImage && (
            <Image
              source={profileImages[userData.profileImage]}
              style={styles.profileImage}
            />
          )}
        </View>
      </View>
      <View style={styles.pointsContainer}>
        <Text style={styles.pointsText}>נקודות: {userData.points}</Text>
      </View>
      <View style={styles.pointsContainer}>
        <Text style={styles.pointsText}>
          אתה נמצא ב{yearDisplay[userData.year]} ללימודיך
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
    textAlign: "right",
  },
  profileImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 25,
    overflow: "hidden",
  },
  profileImage: {
    position: "relative",
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
    textAlign: "right",
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
    position: "absolute",
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
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Dark overlay color
  },
});
export default HomeScreen;
