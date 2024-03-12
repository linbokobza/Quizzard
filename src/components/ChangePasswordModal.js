// ChangePasswordModal.js
import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";

const ChangePasswordModal = ({
  isVisible,
  toggleModal,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  savePasswordChange,
}) => {
  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={{ paddingBottom: 50, textAlign: "center", fontSize: 24 }}>
            שינוי סיסמה
          </Text>
          <TextInput
            style={styles.editInput}
            placeholder="הכנס סיסמה נוכחית"
            secureTextEntry
            placeholderTextColor="gray"
            value={currentPassword}
            onChangeText={(text) => setCurrentPassword(text)}
          />
          <TextInput
            style={styles.editInput}
            placeholder="הכנס סיסמה חדשה"
            secureTextEntry
            placeholderTextColor="gray"
            value={newPassword}
            onChangeText={(text) => setNewPassword(text)}
          />
          <TextInput
            style={styles.editInput}
            placeholder="אימות סיסמה חדשה"
            secureTextEntry
            placeholderTextColor="gray"
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
          />
          <TouchableOpacity
            style={styles.saveButton}
            onPress={savePasswordChange}
          >
            <Text style={styles.saveButtonText}>שמור שינויים</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
            <Text style={styles.closeButtonText}>סגירה</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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

export default ChangePasswordModal;
