import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Modal,
  Animated,
  Image,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { COLORS } from "../constants/theme";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { getDatabase, ref, get, update } from "firebase/database";

const QuizScreen = ({ navigation }) => {
  const route = useRoute();
  const { quizId, userId } = route.params;

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentOptionSelected, setCurrentOptionSelected] = useState(null);
  const [correctOption, setCorrectOption] = useState(null);
  const [isOptionsDisabled, setIsOptionsDisabled] = useState(false);
  const [score, setScore] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [progress, setProgress] = useState(new Animated.Value(0));
  const db = getDatabase();

  const cardClasses =
    "max-w-sm mx-auto bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 text-center";
  const textClasses = "text-zinc-800 dark:text-zinc-200";
  const largeTextClasses =
    "text-4xl font-bold text-zinc-900 dark:text-zinc-100";
  const borderClasses = "border-t border-zinc-300 dark:border-zinc-600";
  const smallTextClasses = "text-zinc-600 dark:text-zinc-400";
  useEffect(() => {
    const fetchQuestions = async () => {
      const quizRef = ref(db, `Quizzes/${quizId}`);
      try {
        const snapshot = await get(quizRef);
        if (snapshot.exists()) {
          const quizData = snapshot.val();
          if (quizData.questions) {
            const questionsRef = ref(db, `Quizzes/${quizId}/questions`);
            const questionsSnapshot = await get(questionsRef);
            if (questionsSnapshot.exists()) {
              const questionsData = questionsSnapshot.val();
              const formattedQuestions = Object.values(questionsData).map(
                (question) => ({
                  question: question.title,
                  options: [
                    ...question.wrongAnswers,
                    question.correctAnswer,
                  ].sort(() => Math.random() - 0.5),
                  correct_option: question.correctAnswer,
                })
              );

              // Randomly shuffle the questions
              const shuffledQuestions = formattedQuestions.sort(
                () => Math.random() - 0.5
              );

              // Limit the number of questions (e.g., to 10)
              const limitedQuestions = shuffledQuestions.slice(0, 3);

              setQuestions(limitedQuestions);
            } else {
              setQuestions([]); // Set questions to an empty array
            }
          } else {
            setQuestions([]); // Set questions to an empty array
          }
          setLoading(false);
        } else {
          console.log("Quiz not found.");
        }
      } catch (error) {
        console.error("Error fetching quiz data: ", error);
      }
    };

    fetchQuestions();
  }, []);

  const validateAnswer = (selectedOption) => {
    let correct_option = questions[currentQuestionIndex]["correct_option"];
    setCurrentOptionSelected(selectedOption);
    setCorrectOption(correct_option);
    setIsOptionsDisabled(true);
    if (selectedOption === correct_option) {
      setScore(score + 1);
    }
    setShowNextButton(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex === questions.length - 1) {
      setShowScoreModal(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentOptionSelected(null);
      setCorrectOption(null);
      setIsOptionsDisabled(false);
      setShowNextButton(false);
    }
    Animated.timing(progress, {
      toValue: currentQuestionIndex + 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const restartQuiz = async () => {
    updateScore("restart");
    setShowScoreModal(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setCurrentOptionSelected(null);
    setCorrectOption(null);
    setIsOptionsDisabled(false);
    setShowNextButton(false);
    Animated.timing(progress, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const renderQuestion = () => {
    return (
      <View style={styles.questionContainer}>
        <View style={styles.questionCountContainer}>
          <Text style={styles.currentQuestionCount}>
            {currentQuestionIndex + 1}
          </Text>
          <Text style={styles.totalQuestionCount}> / {questions.length}</Text>
        </View>
        <Text style={styles.questionText}>
          {questions[currentQuestionIndex]?.question}
        </Text>
      </View>
    );
  };

  const renderOptions = () => {
    return (
      <View style={styles.optionsContainer}>
        {questions[currentQuestionIndex]?.options.map((option) => (
          <TouchableOpacity
            onPress={() => validateAnswer(option)}
            disabled={isOptionsDisabled}
            key={option}
            style={[
              styles.optionButton,
              {
                borderColor:
                  option === correctOption
                    ? COLORS.success
                    : option === currentOptionSelected
                    ? COLORS.error
                    : COLORS.secondary + "40",
                backgroundColor:
                  option === correctOption
                    ? COLORS.success + "20"
                    : option === currentOptionSelected
                    ? COLORS.error + "20"
                    : COLORS.secondary + "20",
              },
            ]}
          >
            <Text style={styles.optionText}>{option} </Text>
            {option === correctOption ? (
              <View style={styles.correctIconContainer}>
                <MaterialCommunityIcons name="check" style={styles.icon} />
              </View>
            ) : option === currentOptionSelected ? (
              <View style={styles.wrongIconContainer}>
                <MaterialCommunityIcons name="close" style={styles.icon} />
              </View>
            ) : null}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const updateScore = async (Flag) => {
    try {
      const userRef = ref(db, `users/${userId}`);
      const userSnapshot = await get(userRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.val();
        let currentPoints = userData.points || 0;
        const updatedPoints = currentPoints + score;

        await update(userRef, { points: updatedPoints });
      } else {
        console.log("User not found.");
      }
    } catch (error) {
      console.error("Error updating user points: ", error);
    }
    if (Flag != "restart") navigation.navigate("Home");
  };

  const renderNextButton = () => {
    if (showNextButton) {
      return (
        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  };

  const progressAnim = progress.interpolate({
    inputRange: [0, questions.length],
    outputRange: ["0%", "100%"],
  });

  const renderProgressBar = () => {
    return (
      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[styles.progressBar, { width: progressAnim }]}
        ></Animated.View>
      </View>
    );
  };

  if (loading) {
    return (
      <ImageBackground
        source={COLORS.backgroundImage}
        style={styles.backgroundImage}
      >
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.accent} />
        </SafeAreaView>
      </ImageBackground>
    );
  }

  if (questions.length === 0) {
    return (
      <ImageBackground
        source={COLORS.backgroundImage}
        style={styles.backgroundImage}
      >
        <SafeAreaView style={styles.loadingContainer}>
          <Text style={styles.noQuestionsText}>No questions available.</Text>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={COLORS.backgroundImage}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        <View style={styles.quizContainer}>
          {renderProgressBar()}
          {renderQuestion()}
          {renderOptions()}
          {renderNextButton()}
          <Modal
            animationType="slide"
            transparent={true}
            visible={showScoreModal}
          >
            <View style={styles.modalContainer}>
              <View style={styles.card}>
                <Text
                  style={[styles.text, { fontSize: 20, fontWeight: "600" }]}
                >
                  כל הכבוד! הצלחת לענות נכון על
                </Text>
                <Text style={styles.largeText}>
                  {score} / {questions.length}
                </Text>
                <View style={styles.border}></View>
                <Text style={styles.spacer}>
                  -----------------------------------------
                </Text>
                <Text style={styles.smallText}>צברת {score} נקודות! </Text>
                <Image
                  source={require("../assets/medals/trophy.png")}
                  style={styles.image}
                  resizeMode="contain"
                />
                <View style={styles.finalResult}>
                  <TouchableOpacity
                    onPress={restartQuiz}
                    style={styles.GoBackButton}
                  >
                    <Text style={styles.retryButtonText}>נסה שנית</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={updateScore}
                    style={styles.GoBackButton}
                  >
                    <Text style={styles.retryButtonText}>דף בית</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  quizContainer: {
    flex: 1,
    padding: 16,
  },
  questionContainer: {
    marginVertical: 20,
  },
  questionCountContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  currentQuestionCount: {
    color: COLORS.black,
    fontSize: 20,
    opacity: 0.6,
    marginRight: 2,
  },
  totalQuestionCount: {
    color: COLORS.black,
    fontSize: 18,
    opacity: 0.6,
  },
  questionText: {
    color: COLORS.black,
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "right",
  },
  optionsContainer: {
    marginVertical: 20,
    textAlign: "right",
    writingDirection: "rtl",
  },
  optionButton: {
    borderWidth: 3,
    height: 60,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginVertical: 10,
    backgroundColor: COLORS.black,
    textAlign: "right",
    writingDirection: "rtl",
  },
  optionText: {
    fontSize: 17,
    color: COLORS.black,
    fontWeight: "bold",
    textAlign: "right",
    writingDirection: "rtl",
  },
  correctIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.success,
    justifyContent: "center",
    alignItems: "center",
  },
  wrongIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.error,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    color: COLORS.black,
    fontSize: 20,
  },
  nextButton: {
    marginTop: 20,
    width: "100%",
    backgroundColor: COLORS.nextButton,
    padding: 20,
    borderRadius: 5,
  },
  nextButtonText: {
    fontSize: 20,
    color: COLORS.white,
    textAlign: "center",
  },
  progressBarContainer: {
    width: "100%",
    height: 20,
    borderRadius: 20,
    backgroundColor: "#00000020",
  },
  progressBar: {
    height: 20,
    borderRadius: 20,
    backgroundColor: COLORS.accent,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noQuestionsText: {
    color: COLORS.white,
    fontSize: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: COLORS.nextButton,
    width: "90%",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 30,
    fontWeight: "bold",
  },
  scoreContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginVertical: 20,
  },
  scoreText: {
    fontSize: 30,
  },
  totalScoreText: {
    fontSize: 40,
    color: COLORS.white,
  },
  retryButton: {
    backgroundColor: COLORS.accent,
    padding: 20,
    width: "100%",
    borderRadius: 20,
  },

  trophyImage: {
    width: 150,
    height: 150,
    position: "absolute",
    top: "23%",
    //transform: [{ translateX: -50 }, { translateY: -50 }],
    zIndex: 1,
  },

  card: {
    maxWidth: "90%",
    alignSelf: "center",
    backgroundColor: COLORS.white,
    borderRadius: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    padding: 16,
    alignItems: "center",
  },
  text: {
    color: COLORS.black,
    marginBottom: 8,
  },
  largeText: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.black,
    marginTop: 8,
  },
  border: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    width: "100%",
    marginVertical: 8,
  },
  smallText: {
    color: COLORS.black,
    marginBottom: 10,
    fontSize: 18,
  },
  spacer: {
    color: COLORS.gray,
    fontSize: 13,
    marginBottom: 12,
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 16,
  },
  finalResult: {
    flexDirection: "row",
    marginVertical: 10,
    alignItems: "center",
  },
  GoBackButton: {
    alignItems: "center",
    paddingVertical: 25,
    marginHorizontal: 20,
  },
  retryButtonText: {
    color: COLORS.black,
    fontSize: 18,
  },
});

export default QuizScreen;
