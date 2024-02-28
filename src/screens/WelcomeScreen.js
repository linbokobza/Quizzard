import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { themeColors } from "../constants/theme";
import { useNavigation } from "@react-navigation/native";
import Button from "../components/Button";

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.bg }]}
    >
      <View style={styles.contentContainer}>

        <View style={styles.imageContainer}>
          <Image
            source={require("../assets/images/signup.png")}
            style={styles.image}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Sign Up"
            onPress={() => navigation.navigate("SignUpScreen")}
            buttonStyle={{ backgroundColor: "#F6E05E" }}
            textStyle={{ color: "#475569" }}
          />

          <View style={styles.buttonContainer}>
            <Button
              title="Log In"
              onPress={() => navigation.navigate("SignInScreen")}
              buttonStyle={{ backgroundColor: "#F6E05E" }}
              textStyle={{ color: "#475569" }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-around",
  },
  title: {
    color: "white",
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  image: {
    width: 400,
    height: 150,
  },
  buttonContainer: {
    marginVertical: 16,

  },
  button: {
    paddingVertical: 12,
    backgroundColor: "#F6E05E",
    borderRadius: 10,
    marginHorizontal: 16,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#475569",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  loginText: {
    color: "white",
    fontWeight: "600",
  },
  loginLink: {
    color: "#F6E05E",
    fontWeight: "600",
    marginLeft: 4,
  },
});

export default WelcomeScreen;
