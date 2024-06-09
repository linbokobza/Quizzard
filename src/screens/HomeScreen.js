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
import { COLORS } from "../constants/theme";
import PointsContainer from "../components/PointsContainer";
import DeleteQuizModal from "../components/DeleteQuizModal";
import AddQuestionModal from "../components/AddQuestionModal";

const HomeScreen = () => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [requestList, setRequestList] = useState([]);
  const [isApproveModalVisible, setApproveModalVisible] = useState(false);
  const [isDarkOverlayVisible, setIsDarkOverlayVisible] = useState(false);
  const [isAddQuizModalVisible, setAddQuizModalVisible] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [isDeleteQuizModalVisible, setDeleteQuizModalVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddQuestionModalVisible, setAddQuestionModalVisible] =
    useState(false);

  let userEmail = null;

  const toggleDeleteQuizModal = () => {
    setDeleteQuizModalVisible(!isDeleteQuizModalVisible);
    setIsDarkOverlayVisible(!isDarkOverlayVisible);
    setIsModalOpen(true); // Set the modal state to open when opening
  };

  const toggleApproveModal = () => {
    setApproveModalVisible(!isApproveModalVisible);
  };

  const toggleAddQuestionModal = () => {
    setAddQuestionModalVisible(!isAddQuestionModalVisible);
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
      fetchRequestList();

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

  const quizImages = {
    1: require("../assets/courses/(1).png"),
    2: require("../assets/courses/(2).png"),
    3: require("../assets/courses/(3).png"),
    4: require("../assets/courses/(4).png"),
    5: require("../assets/courses/(5).png"),
    6: require("../assets/courses/(6).png"),
    7: require("../assets/courses/(7).png"),
    8: require("../assets/courses/(8).png"),
    9: require("../assets/courses/(9).png"),
    10: require("../assets/courses/(10).png"),
  };

  const fetchUserData = () => {
    const user = auth.currentUser;
    if (user) {
      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);

      const userDataListener = onValue(userRef, (snapshot) => {
        const userData = snapshot.val();
        if (userData) {
          setUserData(userData);
          setLoading(false); // Assuming you want to stop showing the loading indicator once the data is fetched
        }
      });

      // Cleanup function to detach the listener when the component unmounts
      return () => {
        userDataListener();
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
    } else if (name === "Add Quiz") {
      toggleAddQuizModal();
    } else if (name === "Delete Quiz") {
      toggleDeleteQuizModal();
    } else if (name === "Add Question") {
      toggleAddQuestionModal();
    }
    //  else {
    //   handleFloatingAction(name);
    //}
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

  const renderQuizCard = ({ item }) => {
    if (item.year == userData.year) {
      return (
        <TouchableOpacity style={styles.quizCard}>
          <Image
            source={quizImages[item.image]}
            style={styles.quizImage}
            defaultSource={require("../assets/images/user.png")}
          />
          <Text style={styles.quizTitle}>{item.title}</Text>
        </TouchableOpacity>
      );
    } else {
      return null; // Render nothing if the year doesn't match
    }
  };

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
          image: quiz.imageIndex,
          year: quiz.year, // Add the correct property based on your structure
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

    try {
      const requestsRef = ref(db, "RequestLecturer/");
      const snapshot = await get(requestsRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const newRequest = Object.entries(data)
          .filter(([_, request]) => request.status === "waiting")
          .map(([requestId, request]) => ({ ...request, id: requestId }));
        setRequestList(newRequest);
      } else {
        console.log("No requests found.");
        setRequestList([]); // Set the request list to an empty array if no data is found
      }
    } catch (error) {
      console.error("Error fetching request list:", error);
      setRequestList([]); // Set the request list to an empty array in case of error
    }
  };

  const yearDisplay = {
    1: "שנה ראשונה",
    2: "שנה שניה",
    3: "שנה שלישית",
    4: "שנה רביעית",
  };

  useEffect(() => {
    const unsubscribe = fetchUserData();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }

      fetchRequestList();
    };
  }, []);

  useEffect(() => {
    fetchQuizzes();
  }, [userData, isModalOpen]);

  return (
    <SafeAreaView style={styles.container}>
      <DeleteQuizModal
        isVisible={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        fetchQuizzes={fetchQuizzes}
        userEmail={userEmail}
        isModalOpen={isModalOpen} // Pass isModalOpen to DeleteQuizModal
      />
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
      <AddQuestionModal
        isVisible={isAddQuestionModalVisible}
        onRequestClose={toggleAddQuestionModal}
        fetchQuizzes={fetchQuizzes}
        userEmail={userEmail}
      />
      {renderFloatingActionButton()}

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
              ? `שלום ${userData.fullName}`
              : "User data not found"}
          </Text>
        </View>
        <View style={styles.iconContainer}>
          <Image
            source={require("../assets/images/hi.png")}
            style={styles.iconContainer}
          />
        </View>
      </View>

      <PointsContainer
        userPoints={userData.points}
        userRanking={4}
      ></PointsContainer>

      <View style={styles.yearContainer}>
        <Image
          source={require("../assets/images/pencil.png")}
          style={{ width: 25, height: 25, marginRight: 15 }}
        />
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
    backgroundColor: COLORS.backgroundcolor,
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
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  greetingContainer: {
    flex: 1,
    marginRight: 20,
    justifyContent: "center",
  },
  greetingText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
    textAlign: "left",
    marginLeft: 30,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "right",
  },
  iconContainer: {
    width: 40,
    height: 40,
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
  yearContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  pointsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333", // Dark gray text color
    textAlign: "center",
    paddingTop: 25,
    paddingBottom: 20,
  },
  quizList: {
    flex: 1,
  },

  quizCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 8,
    backgroundColor: "#FFFDFB", // White background for quiz cards
    borderRadius: 12,
    elevation: 2, // Add elevation for a subtle shadow on Android
  },
  quizImage: {
    width: 50,
    height: 50,
    borderRadius: 20,
    marginRight: 12,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: "normal",
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
  deleteButton: {
    marginLeft: "auto", // Align to the right
    backgroundColor: "#FF0000", // Red color
    padding: 8,
    borderRadius: 10,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});
export default HomeScreen;
