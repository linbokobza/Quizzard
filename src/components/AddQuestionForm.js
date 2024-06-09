// AddQuestionForm.js

import React, { useState } from "react";
import {
  Modal,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
} from "react-native";
import { getDatabase, ref, push, update } from "firebase/database";
import { COLORS } from "../constants/theme";

const AddQuestionForm = ({ isVisible, onRequestClose, quizId }) => {
  const [questionTitle, setQuestionTitle] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [wrongAnswer1, setWrongAnswer1] = useState("");
  const [wrongAnswer2, setWrongAnswer2] = useState("");
  const [wrongAnswer3, setWrongAnswer3] = useState("");

  const handleAddQuestion = async () => {
    if (
      !questionTitle ||
      !correctAnswer ||
      !wrongAnswer1 ||
      !wrongAnswer2 ||
      !wrongAnswer3
    ) {
      Alert.alert("אנא מלא את כל השדות✍🏻");
      return;
    }

    try {
      const db = getDatabase();
      const quizRef = ref(db, `Quizzes/${quizId}/questions`);
      const newQuestionRef = push(quizRef);

      const newQuestion = {
        title: questionTitle,
        correctAnswer,
        wrongAnswers: [wrongAnswer1, wrongAnswer2, wrongAnswer3],
      };

      await update(newQuestionRef, newQuestion);

      onRequestClose();
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>הוספת שאלה</Text>
          <TextInput
            style={[styles.input, { textAlign: "right" }]}
            placeholder="כותרת השאלה"
            placeholderTextColor="gray"
            value={questionTitle}
            onChangeText={(text) => setQuestionTitle(text)}
          />
          <TextInput
            style={[styles.input, { textAlign: "right" }]}
            placeholder="תשובה נכונה"
            placeholderTextColor="gray"
            value={correctAnswer}
            onChangeText={(text) => setCorrectAnswer(text)}
          />
          <TextInput
            style={[styles.input, { textAlign: "right" }]}
            placeholder="תשובה שגויה 1"
            placeholderTextColor="gray"
            value={wrongAnswer1}
            onChangeText={(text) => setWrongAnswer1(text)}
          />
          <TextInput
            style={[styles.input, { textAlign: "right" }]}
            placeholder="תשובה שגויה 2"
            placeholderTextColor="gray"
            value={wrongAnswer2}
            onChangeText={(text) => setWrongAnswer2(text)}
          />
          <TextInput
            style={[styles.input, { textAlign: "right" }]}
            placeholder="תשובה שגויה 3"
            placeholderTextColor="gray"
            value={wrongAnswer3}
            onChangeText={(text) => setWrongAnswer3(text)}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onRequestClose}
            >
              <Text style={styles.buttonText}>סגור</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleAddQuestion}
            >
              <Text style={styles.buttonText}>הוסף</Text>
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
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  input: {
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
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
    fontWeight: "bold",
  },
});

export default AddQuestionForm;
