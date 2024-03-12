// EditProfileModal.js
import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const EditProfileModal = ({
  isVisible,
  toggleModal,
  editedFullName,
  setEditedFullName,
  editedYear,
  setEditedYear,
  saveChanges,
}) => {
  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={{ paddingBottom: 50, textAlign: "center", fontSize: 24 }}>
            עריכת פרטי משתמש
          </Text>
          <TextInput
            style={styles.editInput}
            placeholder="הכנס שם מלא"
            placeholderTextColor="gray"
            value={editedFullName}
            onChangeText={(text) => setEditedFullName(text)}
          />

          <Picker
            selectedValue={editedYear}
            onValueChange={(itemValue) => setEditedYear(itemValue)}
          >
            <Picker.Item label="שנה א'" value="1" />
            <Picker.Item label="שנה ב'" value="2" />
            <Picker.Item label="שנה ג'" value="3" />
            <Picker.Item label="שנה ד'" value="4" />
          </Picker>
          <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
            <Text style={styles.saveButtonText}>שמור שינויים</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
            <Text style={styles.closeButtonText}>סגור</Text>
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

export default EditProfileModal;
