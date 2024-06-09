import React, { useState, useEffect } from "react";
import {
  Modal,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert
} from "react-native";
import { getDatabase, ref, get, remove } from "firebase/database";
import { COLORS } from "../constants/theme";

const DeleteQuestionForm = ({ isVisible, onRequestClose, quizId }) => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuizQuestions = async () => {
      const db = getDatabase();
      const questionsRef = ref(db, `Quizzes/${quizId}/questions`);

      try {
        const snapshot = await get(questionsRef);
        if (snapshot.exists()) {
          const questionsData = snapshot.val();
          const questionsArray = Object.entries(questionsData).map(
            ([id, question]) => ({
              id,
              ...question,
            })
          );
          setQuestions(questionsArray);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    if (quizId) {
      fetchQuizQuestions();
    }
  }, [quizId]);

  const handleDeleteQuestion = async (questionId) => {
    Alert.alert(
      "אישור מחיקה",
      "האם אתה בטוח שברצונך למחוק את השאלה?",
      [
        {
          text: "ביטול",
          style: "cancel"
        },
        {
          text: "מחק",
          onPress: async () => {
            try {
              const db = getDatabase();
              const questionRef = ref(db, `Quizzes/${quizId}/questions/${questionId}`);
              await remove(questionRef);
              setQuestions(questions.filter((q) => q.id !== questionId));
            } catch (error) {
              console.error("Error deleting question:", error);
            }
          },
          style: "destructive"
        }
      ],
      { cancelable: true }
    );
  };

  const renderQuestionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.questionItem}
      onPress={() => handleDeleteQuestion(item.id)}
    >
      <Text style={{ textAlign: 'right' }}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={[styles.modalTitle, { textAlign: 'right' }]}>בחר שאלה למחיקה:</Text>
          <FlatList
            data={questions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderQuestionItem}
          />
          <TouchableOpacity style={styles.closeButton} onPress={onRequestClose}>
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
    textAlign: "right",
    marginBottom: 10,
  },
  questionItem: {
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
    textAlign: "center",
    color: "white",
  },
});

export default DeleteQuestionForm;
