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
import {
  getDatabase,
  ref,
  get,
  update,
  set,
  runTransaction,
  serverTimestamp,
} from "firebase/database";

const QuizScreen = ({ navigation }) => {
  const route = useRoute();
  const { quizId, userId, quizName } = route.params;

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

  // useEffect(() => {
  //   const fetchAndSetQuestions = async () => {
  //     setLoading(true);
  //     const selectedQuestionIds = await selectQuestionsForReview(
  //       userId,
  //       quizId,
  //       10
  //     ); // Limit to 10 questions
  //     const fetchedQuestions = await fetchQuestionsDetails(
  //       quizId,
  //       selectedQuestionIds
  //     );
  //     setQuestions(fetchedQuestions);
  //     setLoading(false);
  //   };

  //   fetchAndSetQuestions();
  // }, []);

  useEffect(() => {
    const fetchAndSetQuestions = async () => {
      setLoading(true);

      // Check if the quiz exists in questionStatistics
      const userStatsRef = ref(
        db,
        `users/${userId}/questionStatistics/${quizId}`
      );
      const userStatsSnapshot = await get(userStatsRef);

      if (!userStatsSnapshot.exists()) {
        // Quiz not in questionStatistics, so initialize it
        const quizQuestionsRef = ref(db, `Quizzes/${quizId}/questions`);
        const quizQuestionsSnapshot = await get(quizQuestionsRef);

        if (quizQuestionsSnapshot.exists()) {
          const questionsData = quizQuestionsSnapshot.val();
          const updates = {};

          Object.keys(questionsData).forEach((questionId) => {
            updates[
              `users/${userId}/questionStatistics/${quizId}/${questionId}`
            ] = {
              correctCount: 0,
              incorrectCount: 0,
              lastAnswered: 0,
              interval: 1,
              weight: 1,
            };
          });

          await update(ref(db), updates);
        }
      }

      const selectedQuestionIds = await selectQuestionsForReview(
        userId,
        quizId,
        10
      ); // Limit to 10 questions
      const fetchedQuestions = await fetchQuestionsDetails(
        quizId,
        selectedQuestionIds
      );
      setQuestions(fetchedQuestions);
      setLoading(false);
    };

    fetchAndSetQuestions();
  }, []);

  const fetchQuestionsDetails = async (quizId, questionIds) => {
    const quizRef = ref(db, `Quizzes/${quizId}/questions`);
    const snapshot = await get(quizRef);

    if (snapshot.exists()) {
      const questionsData = snapshot.val();
      return questionIds.map((id) => {
        const question = questionsData[id];
        return {
          questionId: id,
          question: question.title,
          options: [...question.wrongAnswers, question.correctAnswer].sort(
            () => Math.random() - 0.5
          ),
          correct_option: question.correctAnswer,
          isCorrect: false,
          stats: question.stats || {
            correctCount: 0,
            incorrectCount: 0,
            lastAnswered: 0,
            interval: 1,
            weight: 1,
          },
        };
      });
    }
    return [];
  };

  const selectQuestionsForReview = async (userId, quizId, totalQuestions) => {
    const userRef = ref(db, `users/${userId}/questionStatistics/${quizId}`);
    const snapshot = await get(userRef);
    const questionStats = snapshot.val() || {};

    const now = Date.now();
    const questions = Object.entries(questionStats).map(([id, stats]) => ({
      id,
      dueDate: stats.lastAnswered + stats.interval * 24 * 60 * 60 * 1000,
      weight: stats.weight,
    }));

    // Sort questions by due date (oldest first) and weight (highest first)
    questions.sort((a, b) => {
      if (a.dueDate !== b.dueDate) {
        return a.dueDate - b.dueDate;
      }
      return b.weight - a.weight;
    });

    // Select questions that are due or new questions if not enough due questions
    const selectedQuestions = questions.slice(0, 10);
    const remainingCount = totalQuestions - selectedQuestions.length;

    if (remainingCount > 0) {
      // Fetch new questions not in the user's history
      const newQuestions = await fetchNewQuestions(
        quizId,
        remainingCount,
        Object.keys(questionStats)
      );
      selectedQuestions.push(...newQuestions);
    }

    return selectedQuestions.map((q) => q.id);
  };

  const fetchNewQuestions = async (quizId, count, excludeIds) => {
    const quizRef = ref(db, `Quizzes/${quizId}/questions`);
    const snapshot = await get(quizRef);

    if (snapshot.exists()) {
      const allQuestions = Object.keys(snapshot.val());
      const newQuestions = allQuestions
        .filter((id) => !excludeIds.includes(id))
        .sort(() => Math.random() - 0.5)
        .slice(0, count);

      return newQuestions.map((id) => ({ id }));
      Fwei;
    }
    return [];
  };

  const calculateNextInterval = (
    correctCount,
    incorrectCount,
    lastInterval,
    weight
  ) => {
    const totalAttempts = correctCount + incorrectCount;
    const correctRatio = correctCount / totalAttempts;

    let newInterval;
    let newWeight;

    if (correctRatio >= 0.8) {
      newInterval = Math.round(lastInterval * 2);
      newWeight = Math.min(weight * 1.1, 2.5);
    } else if (correctRatio >= 0.6) {
      newInterval = lastInterval;
      newWeight = weight;
    } else {
      newInterval = Math.max(Math.round(lastInterval * 0.5), 1);
      newWeight = Math.max(weight * 0.9, 0.5);
    }

    return { interval: newInterval, weight: newWeight };
  };

  const updateQuestionStatistics = async (
    userId,
    quizId,
    questionId,
    isCorrect
  ) => {
    const statsRef = ref(
      db,
      `users/${userId}/questionStatistics/${quizId}/${questionId}`
    );

    try {
      await runTransaction(statsRef, (currentData) => {
        if (currentData === null) {
          return {
            correctCount: isCorrect ? 1 : 0,
            incorrectCount: isCorrect ? 0 : 1,
            lastAnswered: serverTimestamp(),
            interval: 1,
            weight: 1,
          };
        }

        const newData = { ...currentData };
        if (isCorrect) {
          newData.correctCount++;
        } else {
          newData.incorrectCount++;
        }

        newData.lastAnswered = serverTimestamp();

        const { interval, weight } = calculateNextInterval(
          newData.correctCount,
          newData.incorrectCount,
          currentData.interval,
          currentData.weight
        );

        newData.interval = interval;
        newData.weight = weight;

        return newData;
      });
    } catch (error) {
      console.error("Error updating question statistics: ", error);
    }
  };

  const validateAnswer = (selectedOption) => {
    let correct_option = questions[currentQuestionIndex]["correct_option"];
    setCurrentOptionSelected(selectedOption);
    setCorrectOption(correct_option);
    setIsOptionsDisabled(true);
    const isCorrect = selectedOption === correct_option;
    if (isCorrect) {
      setScore(score + 1);
    }
    setShowNextButton(true);

    // Update question statistics
    const currentQuestion = questions[currentQuestionIndex];
    updateQuestionStatistics(
      userId,
      quizId,
      currentQuestion.questionId,
      isCorrect
    );
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

  const updateQuizStatistics = async () => {
    try {
      const quizStatsRef = `users/${userId}/quizStatistics/${quizName}`;
      const userRef = ref(db, quizStatsRef);
      const userSnapshot = await get(userRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.val();
        const currentAverageScore = userData.averageScore || 0;
        const currentNumberOfAttempts = userData.numberOfAttempts || 0;

        const newAverageScore =
          (currentAverageScore * currentNumberOfAttempts + score) /
          (currentNumberOfAttempts + 1);

        await update(userRef, {
          averageScore: newAverageScore,
          numberOfAttempts: currentNumberOfAttempts + 1,
        });
      } else {
        await set(ref(db, quizStatsRef), {
          quizName: quizName,
          averageScore: score,
          numberOfAttempts: 1,
        });
      }
    } catch (error) {
      console.error("Error updating quiz statistics: ", error);
      throw error;
    }
  };

  const updateScore = async (Flag) => {
    await updateQuizStatistics();
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
          <Text style={styles.nextButtonText}>הבא</Text>
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
