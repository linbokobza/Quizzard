// AddQuestionModal.js

import React, { useState, useEffect } from "react";
import {
  Modal,
  TouchableOpacity,
  View,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";
import { getDatabase, ref, get } from "firebase/database";
import AddQuestionForm from "./AddQuestionForm";
import { COLORS } from "../constants/theme";

const AddQuestionModal = ({ isVisible, onRequestClose, userEmail }) => {
  const [userQuizzes, setUserQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    const fetchUserQuizzes = async () => {
      const db = getDatabase();
      const quizzesRef = ref(db, "Quizzes");

      try {
        const snapshot = await get(quizzesRef);
        const quizzesData = snapshot.val();

        const quizzesArray = Object.entries(quizzesData)
          .map(([id, quiz]) => ({
            id,
            title: quiz.title,
            lecturer: quiz.lecturer || "",
          }))
          .filter((quiz) => quiz.lecturer.trim() === userEmail.trim());

        setUserQuizzes(quizzesArray);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    if (userEmail) {
      fetchUserQuizzes();
    }
  }, [userEmail]);

  const handleSelectQuiz = (quiz) => {
    setSelectedQuiz(quiz);
  };

  const renderQuizItem = ({ item }) => (
    <TouchableOpacity
      style={styles.quizItem}
      onPress={() => handleSelectQuiz(item)}
    >
      <Text>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>בחר קורס להוספת שאלה:</Text>
          <FlatList
            data={userQuizzes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderQuizItem}
          />
          <TouchableOpacity style={styles.closeButton} onPress={onRequestClose}>
            <Text style={styles.closeButtonText}>סגור</Text>
          </TouchableOpacity>
        </View>
      </View>
      {selectedQuiz && (
        <AddQuestionForm
          isVisible={true}
          onRequestClose={() => setSelectedQuiz(null)}
          quizId={selectedQuiz.id}
        />
      )}
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
    width: "80%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  quizItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
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

export default AddQuestionModal;
