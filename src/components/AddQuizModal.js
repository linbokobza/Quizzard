// AddQuizModal.js
import React, { useState } from "react";
import { Modal, View, Text, TextInput, Button, Image } from "react-native";
import { getDatabase, ref, push, update } from "firebase/database";
import { getUnixTime } from "date-fns";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { storage } from "../firebase";

const AddQuizModal = ({ isVisible, onRequestClose, fetchQuizzes }) => {
  const [quizTitle, setQuizTitle] = useState("");
  const [selectedYear, setSelectedYear] = useState(1);
  const [imageUri, setImageUri] = useState(null);

  const saveQuiz = async () => {
    try {
      const db = getDatabase();
      const quizzesRef = ref(db, "Quizzes");

      const newQuizRef = push(quizzesRef);
      const quizData = {
        id: getUnixTime(new Date()),
        title: quizTitle,
        year: selectedYear,
        imageUri: imageUri,
        // Add other quiz-related data here
      };

      await update(newQuizRef, quizData);

      onRequestClose();
      fetchQuizzes();
    } catch (error) {
      console.error("Error saving quiz:", error);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        const response = await fetch(result.uri);
        const blob = await response.blob();
        const imageName = `${getUnixTime(new Date())}.jpg`;
        const storageRef = storage.ref().child(`quiz_images/${imageName}`);
        await storageRef.put(blob);

        const downloadURL = await storageRef.getDownloadURL();
        setImageUri(downloadURL);
      }
    } catch (error) {
      console.error("Error picking and uploading image:", error);
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide">
      <View>
        <Text>הוספת קוויז</Text>
        <TextInput
          placeholder="כותרת הקוויז"
          value={quizTitle}
          onChangeText={(text) => setQuizTitle(text)}
        />
        <Picker
          selectedValue={selectedYear}
          onValueChange={(itemValue) => setSelectedYear(itemValue)}
        >
          <Picker.Item label="שנה 1" value={1} />
          <Picker.Item label="שנה 2" value={2} />
          <Picker.Item label="שנה 3" value={3} />
          <Picker.Item label="שנה 4" value={4} />
        </Picker>
        <Button title="בחר תמונה" onPress={pickImage} />
        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={{ width: 200, height: 200 }}
          />
        )}
        <Button title="שמור וסגור" onPress={saveQuiz} />
        <Button title="סגור" onPress={onRequestClose} />
      </View>
    </Modal>
  );
};

export default AddQuizModal;
