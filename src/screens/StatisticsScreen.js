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


  return (
    <View style={styles.container}>
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
