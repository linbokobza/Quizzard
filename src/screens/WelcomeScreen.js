import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants/theme";
import { useNavigation } from "@react-navigation/native";
import Button from "../components/Button";

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={COLORS.backgroundImage}
        style={styles.backgroundImage}
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
              title="הרשמה"
              onPress={() => navigation.navigate("SignUpScreen")}
              buttonStyle={{ backgroundColor: COLORS.buttonColor}}
              textStyle={{ color: "#475569" }}
            />

            <View style={styles.buttonContainer}>
              <Button
                title="התחברות"
                onPress={() => navigation.navigate("SignInScreen")}
                buttonStyle={{ backgroundColor: COLORS.buttonColor}}
                textStyle={{ color: "#475569" }}
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
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
  contentContainer: {
    flex: 1,
    justifyContent: "space-around",
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
