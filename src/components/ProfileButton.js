import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ProfileButton = ({ imageSource, buttonText, onPress }) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
      <Ionicons name="arrow-back" size={24} color="black" />
      <Text style={styles.buttonText}>{buttonText}</Text>
      <Image source={imageSource} style={styles.buttonImage} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white", // Button background color
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonImage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  buttonText: {
    color: "black", // Text color
    fontSize: 18,
    writingDirection: "rtl",

    flex: 1, // Takes remaining space in the middle
    marginRight: 10,
  },
});

export default ProfileButton;
