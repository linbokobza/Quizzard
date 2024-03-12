// components/DeleteQuizModal.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
} from "react-native";
import { getDatabase, ref, get, remove } from "firebase/database";
import CustomAlert from "./CustomAlert";

const DeleteQuizModal = ({
  isVisible,
  onRequestClose,
  fetchQuizzes,
  userEmail,
}) => {
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
          .filter(
            (quiz) => quiz.lecturer.trim().localeCompare(userEmail.trim()) === 0
          );

        setUserQuizzes(quizzesArray);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchUserQuizzes();
  }, [userEmail]);

  const handleDeleteQuiz = (quizId, quizTitle) => {
    setSelectedQuiz({ id: quizId, title: quizTitle });
  };

  const handleConfirmedDelete = async () => {
    try {
      const db = getDatabase();
      const quizRef = ref(db, `Quizzes/${selectedQuiz.id}`);
      await remove(quizRef);
      fetchQuizzes();
      onRequestClose();
    } catch (error) {
      console.error("Error deleting quiz:", error);
    } finally {
      setSelectedQuiz(null);
    }
  };

  const renderQuizItem = ({ item }) => (
    <TouchableOpacity
      style={styles.quizItem}
      onPress={() => handleDeleteQuiz(item.id, item.title)}
    >
      <Text>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onRequestClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>בחר קוויז למחיקה:</Text>
          <FlatList
            data={userQuizzes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderQuizItem}
          />
          {selectedQuiz && (
            <CustomAlert
              isVisible={true}
              onRequestClose={() => setSelectedQuiz(null)}
              title="מחיקת קוויז"
              message={`האם אתה בטוח שברצונך למחוק את הקוויז  "${selectedQuiz.title}"?`}
              onConfirm={handleConfirmedDelete}
            />
          )}
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

export default DeleteQuizModal;
