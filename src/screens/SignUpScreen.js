import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { themeColors } from "../constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { getDatabase, ref, set } from "firebase/database";
import { Alert } from "react-native";
import Button from "../components/Button";
import womanImage from "../assets/images/woman.png";
import manImage from "../assets/images/man.png";
import otherImage from "../assets/images/other.png";

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("S");
  const [year, setYear] = useState("1"); // Set initial value to "1"
  const [errorMessage, setErrorMessage] = useState(null); // State for error message
  const [gender, setGender] = useState("female"); // Set initial value to "female"

  const auth = getAuth();
  const db = getFirestore();

  const handleSubmit = async () => {
    if (!email || !password || !fullName) {
      Alert.alert("Error", "Please fill in all fields.");
    }
    const points = 0;
    if (email && password && fullName && role && year && gender) {
      try {
        const authUser = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        // Reference to the user's node under the "users" path in Realtime Database
        const database = getDatabase();
        const usersRef = ref(database, `users/${authUser.user.uid}`);

        // Set the user data
        console.log("Attempting to set user data in Realtime Database:", {
          email: authUser.user.email,
          fullName: fullName,
          role: "S",
          year: year,
          profileImage: gender,
          points: points,
        });

        await set(usersRef, {
          email: authUser.user.email,
          fullName: fullName,
          role: "S",
          year: year,
          profileImage: gender,
          points: points,
        });

        console.log("User signed up successfully!");
      } catch (err) {
        console.error("Error setting user data in Realtime Database:", err);
      }
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ArrowLeftIcon size={20} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.imageContainer}>
          <Image
            source={require("../assets/images/signup.png")}
            style={styles.logo}
          />
        </View>
      </SafeAreaView>
      <View style={styles.formContainer}>
        <View style={styles.form}>
          <Text style={styles.formLabel}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={(value) => setFullName(value)}
            placeholder="Enter Name"
          />
          <Text style={styles.formLabel}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(value) => setEmail(value)}
            placeholder="Enter Email"
          />
          <Text style={styles.formLabel}>Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={(value) => setPassword(value)}
            placeholder="Enter Password"
          />
          <Text style={styles.formLabel}>Year</Text>
          <Picker
            style={styles.input}
            selectedValue={year}
            onValueChange={(itemValue) => setYear(itemValue)}
          >
            <Picker.Item label="Year 1" value="1" />
            <Picker.Item label="Year 2" value="2" />
            <Picker.Item label="Year 3" value="3" />
            <Picker.Item label="Year 4" value="4" />
          </Picker>

          <Text style={styles.formLabel}>Gender</Text>
          <Picker
            style={styles.input}
            selectedValue={gender}
            onValueChange={(itemValue) => setGender(itemValue)}
          >
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Other" value="other" />
          </Picker>

          <Button
            title="Sign Up"
            onPress={handleSubmit}
            buttonStyle={{ backgroundColor: "#F6E05E" }}
            textStyle={{ color: "#475569" }}
          />
          {errorMessage && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}
        </View>
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignInScreen")}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.bg,
  },
  safeArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  iconContainer: {
    justifyContent: "flex-start",
  },
  backButton: {
    backgroundColor: "#F6E05E",
    padding: 10,
    borderRadius: 10,
    marginLeft: 4,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  logo: {
    width: 165,
    height: 110,
  },
  formContainer: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  form: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  formLabel: {
    color: "#475569",
    marginLeft: 16,
    marginBottom: 4,
  },
  input: {
    padding: 16,
    backgroundColor: "#F3F4F6",
    color: "#475569",
    borderRadius: 10,
    marginBottom: 16,
  },
  signupButton: {
    padding: 16,
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
  orText: {
    fontSize: 20,
    color: "#475569",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 16,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 12,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  loginText: {
    color: "#475569",
    fontWeight: "600",
  },
  loginLink: {
    color: "#F6E05E",
    fontWeight: "600",
    marginLeft: 4,
  },
});

export default SignUpScreen;