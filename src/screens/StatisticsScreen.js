import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { getDatabase, ref, onValue } from "firebase/database";
import { useNavigation, useRoute } from "@react-navigation/native";

const StatisticsScreen = () => {
  const route = useRoute();
  const { userId } = route.params;
  const [quizStatistics, setQuizStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const db = getDatabase();
  useEffect(() => {
    const fetchQuizStatistics = async () => {
      try {
        const userStatsRef = ref(db, `users/${userId}/quizStatistics`);
        console.log("User stats ref:", userStatsRef.toString()); // Log reference to ensure it matches expected path
        onValue(userStatsRef, (snapshot) => {
          const data = snapshot.val();
          console.log("Fetched quiz statistics:", data); // Log fetched data
          if (data) {
            const quizStatsArray = Object.entries(data).map(
              ([quizName, stats]) => ({
                quizName,
                averageScore: stats.averageScore.toFixed(2), // Display averageScore with 2 decimal places
                numberOfAttempts: stats.numberOfAttempts,
              })
            );
            setQuizStatistics(quizStatsArray);
          } else {
            setQuizStatistics([]); // Handle case where data is empty
          }
          setLoading(false);
        });
      } catch (error) {
        console.error("Error fetching quiz statistics: ", error); // Log error
        setLoading(false);
      }
    };

    fetchQuizStatistics();
  }, [db, userId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={quizStatistics}
        keyExtractor={(item) => item.quizName}
        renderItem={({ item }) => (
          <View style={styles.quizContainer}>
            <Text style={styles.quizName}>{item.quizName}</Text>
            <Text>Average Score: {item.averageScore}</Text>
            <Text>Number of Attempts: {item.numberOfAttempts}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 60,
    paddingHorizontal: 16,
  },
  quizContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  quizName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
});

export default StatisticsScreen;
