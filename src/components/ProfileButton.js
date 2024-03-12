import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

const ProfileButton = ({ imageSource, buttonText, onPress }) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
      <Image source={imageSource} style={styles.buttonImage} />
      <Text style={styles.buttonText}>{buttonText}</Text>
      <Ionicons name="ios-arrow-forward" size={24} color="black" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white', // Button background color
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
    color: 'black', // Text color
    fontSize: 18,
    flex: 1, // Takes remaining space in the middle
    marginLeft: 10,
  },
});

export default ProfileButton;
