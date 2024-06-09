// components/CustomAlert.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";

const CustomAlert = ({
  isVisible,
  onRequestClose,
  title,
  message,
  onConfirm,
}) => {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onRequestClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onRequestClose}
            >
              <Text style={styles.buttonText}>ביטול</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.buttonText}>אישור</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignSelf: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    width: "40%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#FF4500",
    padding: 10,
    borderRadius: 5,
    width: "40%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
});

export default CustomAlert;
