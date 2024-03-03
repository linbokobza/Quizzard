import {
  View,
  Text,
  StyleSheet,
  Modal,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { FloatingAction } from "react-native-floating-action";
import React, { useState, useEffect } from "react";
import { getDatabase, ref, get, onValue, update } from "firebase/database";
import { auth } from "../firebase"; // Assuming you have a firebase.js file where you initialize Firebase

const StatisticsScreen = () => {
  const [userData, setUserData] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [requestList, setRequestList] = useState([]);
  const [isApproveModalVisible, setApproveModalVisible] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const db = getDatabase();
        const userRef = ref(db, `users/${user.uid}`);

        const userDataListener = onValue(userRef, (snapshot) => {
          const userData = snapshot.val();
          if (userData) {
            setUserData(userData);
          }
        });

        return () => {
          off(userRef, userDataListener);
        };
      }
    };

    fetchUserData();
  }, []);

  const toggleApproveModal = () => {
    setApproveModalVisible(!isApproveModalVisible);
  };

  const saveChanges = () => {
    console.log("hi");
  };
  const RequestModal = () => {
    return (
      <Modal
        visible={isApproveModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text
              style={{ paddingBottom: 50, textAlign: "center", fontSize: 24 }}
            >
              Edit User Details
            </Text>

            <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={toggleApproveModal}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
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
  const fetchRequestList = async () => {
    try {
      const db = getDatabase();
      const requestsRef = ref(db, 'RequestLecturer');
  
      const snapshot = await get(requestsRef);
  
      if (snapshot.exists()) {
        const requestsData = snapshot.val();
       
        // Filter requests where approved is 'waiting'
        const waitingRequests = Object.entries(userData)
          .filter(([_, request]) => request.approved === 'waiting')
          .map(([requestId, request]) => ({ ...request, id: requestId }));
  
        setRequestList(waitingRequests);
        setApproveModalVisible(true);
      } else {
        console.log('No requests found');
      }
    } catch (error) {
      console.error('Error fetching request list:', error);
    }
  };

  const handleFloatingAction = (name) => {
    console.log(`Selected button: ${name}`);
    if (name === "Approve") {
      fetchRequestList();
      toggleApproveModal(); // Call toggleApproveModal to show the modal
    }
  };

  const renderFloatingActionButton = () => {
    if (userData && userData.role !== "S") {
      return (
        <FloatingAction
          actions={userData.role === "L" ? actions.slice(1) : actions}
          showBackground={false}
          position="left"
          style={styles.floatingActionButton}
          onPressItem={(name) => handleFloatingAction(name)}
        />
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {renderFloatingActionButton()}
      <RequestModal />

      <Text>Statistics Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,  0,  0,  0.5)", // Semi-transparent background
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%", // Adjust width as needed
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  editInput: {
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 5,
    width: "100%",
  },
  saveButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "100%",
  },
  saveButtonText: {
    color: "white",
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#FF4500",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "100%",
  },
});

export default StatisticsScreen;
