import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

let userRanking = 0;

const PointsContainer = ({ userPoints, onPress }) => {
  if (userPoints < 100) {
    userRanking = 4;
  } else if (userPoints > 100 && userPoints <= 200) {
    userRanking = 3;
  } else if (userPoints > 200 && userPoints <= 300) {
    userRanking = 2;
  } else if (userPoints > 300) {
    userRanking = 1;
  }

  const medalImages = {
    1: require("../assets/medals/1.png"),
    2: require("../assets/medals/2.png"),
    3: require("../assets/medals/3.png"),
    4: require("../assets/medals/4.png"),
  };

  const getRankingText = () => {
    switch (userRanking) {
      case 1:
        return "רמה 1";
      case 2:
        return "רמה 2";
      case 3:
        return "רמה 3";
      case 4:
        return "רמה 4";
      default:
        return "משתתף";
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.pointsContainer}>
        <Image
          source={require("../assets/images/star.png")}
          style={styles.image}
        />
        <Text style={styles.pointsText}>{userPoints} נקודות</Text>
      </View>
      <Text> | </Text>
      <View style={styles.levelContainer}>
        <Image source={medalImages[userRanking]} style={styles.medalImage} />
        <Text style={styles.levelText}>{getRankingText()}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFD9B5",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pointsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  levelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 36,
    height: 36,
    marginRight: 12,
  },
  medalImage: {
    width: 36,
    height: 36,
    marginRight: 12,
  },
  pointsText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#383838",
  },
  levelText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#383838",
  },
});

export default PointsContainer;
