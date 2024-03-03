import React, { useState, useEffect } from "react";
import { getDatabase, ref, set, onValue, update } from "firebase/database";
import { auth } from "../firebase"; // Assuming you have a firebase.js file where you initialize Firebase
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  SafeAreaView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { updatePassword } from "firebase/auth";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editedFullName, setEditedFullName] = useState("");
  const [editedYear, seteditedYear] = useState("");

  //password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangePasswordModalVisible, setChangePasswordModalVisible] =
    useState(false);

  const toggleEditModal = () => {
    setEditModalVisible(!isEditModalVisible);
  };

  const toggleChangePasswordModal = () => {
    setChangePasswordModalVisible(!isChangePasswordModalVisible);
  };

  const saveChanges = () => {
    // Get the current user
    const user = auth.currentUser;

    if (user) {
      // Reference to the user's node under the "users" path in Realtime Database
      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);

      // Create an object with the fields to update
      const updatedFields = {};

      if (editedFullName !== "") {
        updatedFields.fullName = editedFullName;
      }

      if (editedYear !== "") {
        updatedFields.year = editedYear;
      }

      // Update the user details in the database using update
      update(userRef, updatedFields)
        .then(() => {
          console.log("User details updated successfully!");
          setEditModalVisible(false); // Close the modal after saving changes
        })
        .catch((error) => {
          console.error("Error updating user details:", error);
        });
    }
  };

  const savePasswordChange = async () => {
    const user = auth.currentUser;

    if (!user) {
      console.error("No user is currently signed in.");
      return;
    }

    if (newPassword !== confirmPassword) {
      console.error("New password and confirmation do not match.");
      return;
    }

    try {
      // Update the password directly without reauthentication
      await updatePassword(user, newPassword);

      console.log("Password updated successfully!");
      // Reset all password-related states
      setNewPassword("");
      setConfirmPassword("");
      setCurrentPassword("");
      setChangePasswordModalVisible(false);
    } catch (error) {
      console.error("Error updating password:", error.message);
      // Optionally, show an alert or message to the user
    }
  };
  const profileImages = {
    female: require("../assets/images/woman.png"),
    male: require("../assets/images/man.png"),
    other: require("../assets/images/other.png"),
  };
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

  const handleLogout = async () => {
    try {
      await auth.signOut();
      // Navigate to login screen or show a message
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  const handleRequest = async () => {
    const user = auth.currentUser;
    const database = getDatabase();
    const usersRef = ref(database, `RequestLecturer/${user.uid}`);

    try {
      if (userData && userData.role == "L") {
        Alert.alert("You already a lecturer");
        throw new Error("You already a lecturer");
      }
      await set(usersRef, {
        email: user.email,
        approved: "waiting",
      });

      console.log("User information added to the database successfully!");
      Alert.alert("Request sent succsefully");
    } catch (error) {
      console.error("Error adding user information:", error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Modal
        visible={isEditModalVisible}
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
            <TextInput
              style={styles.editInput}
              placeholder="Enter new full name"
              placeholderTextColor="gray"
              value={editedFullName}
              onChangeText={(text) => setEditedFullName(text)}
            />

            <Picker
              selectedValue={editedYear}
              onValueChange={(itemValue) => seteditedYear(itemValue)}
            >
              <Picker.Item label="Year 1" value="1" />
              <Picker.Item label="Year 2" value="2" />
              <Picker.Item label="Year 3" value="3" />
              <Picker.Item label="Year 4" value="4" />
            </Picker>
            <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={toggleEditModal}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isChangePasswordModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text
              style={{ paddingBottom: 50, textAlign: "center", fontSize: 24 }}
            >
              Change Password
            </Text>
            <TextInput
              style={styles.editInput}
              placeholder="Enter current password"
              secureTextEntry
              placeholderTextColor="gray"
              value={currentPassword}
              onChangeText={(text) => setCurrentPassword(text)}
            />
            <TextInput
              style={styles.editInput}
              placeholder="Enter new password"
              secureTextEntry
              placeholderTextColor="gray"
              value={newPassword}
              onChangeText={(text) => setNewPassword(text)}
            />
            <TextInput
              style={styles.editInput}
              placeholder="Confirm new password"
              secureTextEntry
              placeholderTextColor="gray"
              value={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={savePasswordChange}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={toggleChangePasswordModal}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {userData && (
        <View style={styles.profileContainer}>
          <Image
              source={profileImages[userData.profileImage]}
              style={styles.profileImage}
          />
          <Text style={styles.profileName}>{userData.fullName}</Text>         
          <View style={styles.optionsContainer}>
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={[styles.optionButton, { backgroundColor: "#BD89E5" }]}
                onPress={toggleEditModal}
              >
                <Text style={styles.optionText}>Edit Personal Data</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionButton, { backgroundColor: "#71B1E5" }]}
                onPress={toggleChangePasswordModal}
              >
                <Text style={styles.optionText}>Change Password</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={[styles.optionButton, { backgroundColor: "#E15662" }]}
                onPress={handleLogout}
              >
                <Text style={styles.optionText}>Logout</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionButton, { backgroundColor: "#FAC564" }]}
                onPress={handleRequest}
              >
                <Text style={styles.optionText}>Change to Lecturer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  profileContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  profileName: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 40,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginBottom: "10%",
  },
  optionsContainer: {
    width: "100%",
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
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
  closeButtonText: {
    color: "white",
    textAlign: "center",
  },
});

export default ProfilePage;
