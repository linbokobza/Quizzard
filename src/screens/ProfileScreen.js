import React, { useState, useEffect } from "react";
import { getDatabase, ref, set, onValue, update } from "firebase/database";
import { auth } from "../firebase";
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
import { COLORS } from "../constants/theme";
import ProfileButton from "../components/ProfileButton";
import ChangePasswordModal from "../components/ChangePasswordModal";
import EditProfileModal from "../components/EditProfileModal";

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
          Alert.alert("פרטי המשתמש השתנו בהצלחה 😊");

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
      Alert.alert("הסיסמאות לא תואמות, נסה שנית 🔁");
      return;
    }

    try {
      // Update the password directly without reauthentication
      await updatePassword(user, newPassword);

      console.log("Password updated successfully!");
      Alert.alert("הסיסמה שונתה בהצלחה 😊");

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
        Alert.alert("משתמש זה כבר משתמש מרצה 👨‍🏫");
        return "You already a lecturer";
      }
      if (userData && userData.role == "A") {
        Alert.alert("משתמש זה כבר אדמין 🛡️");
        return "You already a admin";
      }
      await set(usersRef, {
        fullName: userData.fullName,
        email: user.email,
        status: "waiting",
      });

      console.log("User information added to the database successfully!");
      Alert.alert("Request sent succsefully");
    } catch (error) {
      console.error("Error adding user information:", error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <EditProfileModal
        isVisible={isEditModalVisible}
        toggleModal={toggleEditModal}
        editedFullName={editedFullName}
        setEditedFullName={setEditedFullName}
        editedYear={editedYear}
        setEditedYear={seteditedYear}
        saveChanges={saveChanges}
      />

      <ChangePasswordModal
        isVisible={isChangePasswordModalVisible}
        toggleModal={toggleChangePasswordModal}
        currentPassword={currentPassword}
        setCurrentPassword={setCurrentPassword}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        savePasswordChange={savePasswordChange}
      />

      {userData && (
        <View style={styles.profileContainer}>
          <Image
            source={profileImages[userData.profileImage]}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{userData.fullName}</Text>
          <View style={styles.buttoncontainer}>
            <ProfileButton
              imageSource={require("../assets/profile/profileuser.png")}
              buttonText="שינוי פרטים אישיים"
              onPress={toggleEditModal}
            />
            <ProfileButton
              imageSource={require("../assets/profile/password.png")}
              buttonText="שינוי סיסמה"
              onPress={toggleChangePasswordModal}
            />
            <ProfileButton
              imageSource={require("../assets/profile/lecturer.png")}
              buttonText="הפיכה למרצה"
              onPress={handleRequest}
            />
            <ProfileButton
              imageSource={require("../assets/profile/logout.png")}
              buttonText="התנתקות"
              onPress={handleLogout}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundcolor,
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
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
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

  buttoncontainer: {
    alignItems: "flex-end",
    marginTop: "10%", // Adjust the value as needed
  },
});

export default ProfilePage;
