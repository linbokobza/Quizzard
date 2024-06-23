import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { getDatabase, ref, onValue, get } from "firebase/database";
import { useRoute } from "@react-navigation/native";
import { PieChart } from "react-native-chart-kit";
import { COLORS } from "../constants/theme";
import Icon from "react-native-vector-icons/Ionicons"; // Add this import
import { LinearGradient } from "expo-linear-gradient";

const screenWidth = Dimensions.get("window").width;

const StatisticsScreen = () => {
  const route = useRoute();
  const { userId } = route.params;
  const [quizStatistics, setQuizStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [numSignupUsers, setNumSignupUsers] = useState(0);
  const [numSignupLecturer, setNumSignupLecturer] = useState(0);
  const [numQuizzes, setNumQuizzes] = useState(0);
  const [role,setrole]=useState(null)
  //role = null;
  const db = getDatabase();

  useEffect(() => {
    const fetchQuizStatistics = async () => {
      try {
        const userStatsRef = ref(db, `users/${userId}/quizStatistics`);
        const userRef = ref(db, `users/${userId}`);
        const userSnapshot = await get(userRef);
        const userData = userSnapshot.val();
        setrole(userData.role);
        onValue(userStatsRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const quizStatsArray = Object.entries(data).map(
              ([quizName, stats]) => ({
                quizName,
                averageScore: parseFloat(stats.averageScore.toFixed(2)),
                numberOfAttempts: stats.numberOfAttempts,
              })
            );
            setQuizStatistics(quizStatsArray);
          } else {
            setQuizStatistics([]);
          }
          setLoading(false);
        });
      } catch (error) {
        console.error("Error fetching quiz statistics: ", error);
        setLoading(false);
      }
    };

    const fetchNumSignupUsers = async () => {
      try {
        const usersRef = ref(db, "users");
        onValue(usersRef, (snapshot) => {
          const userData = snapshot.val();
          let numL = 0;
          if (userData) {
            const numUsers = Object.keys(userData).length;
            for (const key in userData) {
              if (userData[key].role === "L") {
                numL++;
              }
            }
            setNumSignupUsers(numUsers);
            setNumSignupLecturer(numL);
          } else {
            setNumSignupUsers(0);
            setNumSignupLecturer(0);
          }
        });
      } catch (error) {
        console.error("Error fetching number of signup users: ", error);
        setNumSignupUsers(0);
        setNumSignupLecturer(0);
      }
    };

    const fetchNumQuizzes = async () => {
      try {
        const quizRef = ref(db, "Quizzes");
        onValue(quizRef, (snapshot) => {
          const quizData = snapshot.val();
          if (quizData) {
            const numQuizzes = Object.keys(quizData).length;
            setNumQuizzes(numQuizzes);
          } else {
            setNumQuizzes(0);
          }
        });
      } catch (error) {
        console.error("Error fetching number of quizzes: ", error);
        setNumQuizzes(0);
      }
    };

    fetchQuizStatistics();
    if (role === "A") {
      fetchNumSignupUsers();
      fetchNumQuizzes();
    }
  }, [db, userId, role]);

  const renderPieChart = () => {
    const chartData = quizStatistics.map((item) => ({
      name: item.quizName,
      score: item.averageScore,
      color: getRandomPastelColor(),
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    }));

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>התפלגות ממוצעי הקורסים</Text>
        <PieChart
          data={chartData}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
          }}
          accessor={"score"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          absolute
          hasLegend={false}
        />
        <View style={styles.legendContainer}>
          {chartData.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: item.color }]}
              />
              <Text style={styles.legendText}>{item.name}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderStatsOverview = () => {
    const totalAttempts = quizStatistics.reduce(
      (acc, item) => acc + item.numberOfAttempts,
      0
    );

    const overallAverage = calculateOverallAverage();
    const highestAverageQuiz = findHighestAverageQuiz();

    return (
      <View style={styles.statsOverview}>
        <View style={styles.statItem}>
          <Icon name="trophy" size={24} color="#FFD700" />
          <Text style={styles.statValue}>{overallAverage.toFixed(2)}</Text>
          <Text style={styles.statLabel}>ממוצע כללי</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="trending-up" size={24} color="#4CD964" />
          <Text style={styles.statValue}>{highestAverageQuiz}</Text>
          <Text style={styles.statLabel}>קורס מצטיין</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="repeat" size={24} color="#007AFF" />
          <Text style={styles.statValue}>{totalAttempts}</Text>
          <Text style={styles.statLabel}>מספר נסיונות</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  const getRandomPastelColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const pastel = `hsl(${hue}, 70%, 80%)`;
    return pastel;
  };

  const calculateOverallAverage = () => {
    if (quizStatistics.length === 0) return 0;

    const totalScores = quizStatistics.reduce(
      (acc, item) => acc + item.averageScore,
      0
    );
    return totalScores / quizStatistics.length;
  };

  const findHighestAverageQuiz = () => {
    if (quizStatistics.length === 0) return "No quizzes";

    let highestAverage = -1;
    let highestAverageQuiz = "";

    quizStatistics.forEach((item) => {
      if (item.averageScore > highestAverage) {
        highestAverage = item.averageScore;
        highestAverageQuiz = item.quizName;
      }
    });

    return highestAverageQuiz;
  };

  const renderQuizItem = ({ item }) => (
    <LinearGradient
      colors={["#ffffff", "#f0f0f0"]}
      style={styles.quizContainer}
    >
      <View style={styles.quizHeader}>
        <Icon name="book" size={24} color="#007AFF" />
        <Text style={styles.quizName}>{item.quizName}</Text>
      </View>
      <View style={styles.quizStats}>
        <View style={styles.quizStat}>
          <Icon name="trophy" size={20} color="#FFD700" />
          <Text style={styles.quizStatValue}>
            {item.averageScore.toFixed(2)}
          </Text>
          <Text style={styles.quizStatLabel}>ממוצע</Text>
        </View>
        <View style={styles.quizStat}>
          <Icon name="repeat" size={20} color="#4CD964" />
          <Text style={styles.quizStatValue}>{item.numberOfAttempts}</Text>
          <Text style={styles.quizStatLabel}>נסיונות</Text>
        </View>
      </View>
    </LinearGradient>
  );

  return (
    <SafeAreaView style={styles.container}>
      {role === 'A' ? (
        <View style={styles.adminContainer}>
          <Text style={styles.adminTitle}>סטטיסטיקות מנהל</Text>
          <View style={styles.statsContainer}>
            <LinearGradient
              colors={["#71A9E1", "#AFC3EF"]}
              style={styles.statBox}
            >
              <Icon name="people" size={40} color="#ffffff" />
              <Text style={styles.statValue}>{numSignupUsers}</Text>
              <Text style={styles.statLabel}>משתמשים</Text>
            </LinearGradient>
            <LinearGradient
              colors={["#11998e", "#5BC0A1"]}
              style={styles.statBox}
            >
              <Icon name="school" size={40} color="#ffffff" />
              <Text style={styles.statValue}>{numSignupLecturer}</Text>
              <Text style={styles.statLabel}>מרצים</Text>
            </LinearGradient>
            <LinearGradient
              colors={["#D45645", "#DB7777"]}
              style={styles.statBox}
            >
              <Icon name="list" size={40} color="#ffffff" />
              <Text style={styles.statValue}>{numQuizzes}</Text>
              <Text style={styles.statLabel}>קורסים</Text>
            </LinearGradient>
          </View>
        </View>
      ) : (
        <View style={styles.userContainer}>
          <Text style={styles.userTitle}>סטטיסטיקות</Text>
          {renderStatsOverview()}
          <FlatList
            data={quizStatistics}
            keyExtractor={(item) => item.quizName}
            renderItem={renderQuizItem}
            ListHeaderComponent={renderPieChart}
            ListEmptyComponent={() => (
              <Text style={styles.noDataText}>
                אין סטטיסטיקות זמינות
              </Text>
            )}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundcolor,
    paddingTop: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  userContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  userTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  quizContainer: {
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  quizHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  quizName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
    flex: 1,
  },
  quizStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  quizStat: {
    alignItems: "center",
  },
  quizStatValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
  },
  quizStatLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  chartContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    marginBottom: 10,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: "#666",
  },
  noDataText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  adminContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  adminTitle: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 40,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  statBox: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    margin: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    flex: 1,
  },
  statLabel: {
    fontSize: 20,
    color: "#000000",
    marginTop: 4,
    textAlign: "center",
  },
  statValue: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
    textAlign: "center",
  },
  statsOverview: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
});

export default StatisticsScreen;
