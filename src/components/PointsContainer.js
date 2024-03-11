import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const PointsContainer = ({ userPoints, userRanking }) => {
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
        <Image
          source={require("../assets/medals/1.png")}
          style={styles.image}
        />
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
    backgroundColor: "#FAB16B", // Background color for the container
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
    marginHorizontal: 16,
    fontSize: 24,
    color: "#333",
  },
});

export default PointsContainer;
