import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const PointsContainer = ({ userPoints, userRanking }) => {
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
  return (
    <View style={styles.container}>
      {/* Left side - Image with user points */}
      <View style={styles.leftContainer}>
        <Image
          source={require("../assets/images/star.png")}
          style={styles.image}
        />
        <Text style={styles.text}>{userPoints} Points</Text>
      </View>

      {/* Divider */}
      <Text style={styles.divider}>|</Text>

      {/* Right side - Image with ranking */}
      <View style={styles.rightContainer}>
        <Image source={medalImages[userRanking]} style={styles.image} />
        <Text style={styles.text}>Rank {userRanking}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    marginTop: 30,
    backgroundColor: "#FFD9B5", // Background color for the container
    borderRadius: 8,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 20,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 20,
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 8,
    resizeMode: "contain", // Adjust based on your image content
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#383838",
  },
  divider: {
    marginHorizontal: 8,
    marginRight: 30,
    fontSize: 24,
    color: "#333",
  },
});

export default PointsContainer;
