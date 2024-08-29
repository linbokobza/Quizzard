import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { getDatabase, ref, set } from "firebase/database";
import { Alert } from "react-native";
import Button from "../components/Button";
import { COLORS, themeColors } from "../constants/theme";

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("S");
  const [year, setYear] = useState("1"); // Set initial value to "1"
  const [errorMessage, setErrorMessage] = useState(null); // State for error message
  const [gender, setGender] = useState("female"); // Set initial value to "female"
  console.warn = () => {};

  const auth = getAuth();
  const db = getFirestore();

  const handleSubmit = async () => {
    if (!email || !password || !fullName) {
      Alert.alert("אנא מלא את כל השדות הדרושים");
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

  const pageFormView = () => {
    return (
    <View style={styles.formContainer}>
      <View style={styles.form}>
        <Text style={styles.formLabel}>שם מלא</Text>
        <TextInput
          autoCompleteType="name"
          style={styles.input}
          value={fullName}
          onChangeText={(value) => setFullName(value)}
          placeholder="הכנס שם מלא"
        />
        <Text style={styles.formLabel}>אימייל</Text>
        <TextInput
          autoCompleteType="email"
          style={styles.input}
          value={email}
          onChangeText={(value) => setEmail(value)}
          placeholder="הכנס אימייל"
        />
        <Text style={styles.formLabel}>סיסמה</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={(value) => setPassword(value)}
          placeholder="הכנס סיסמה"
        />
        <Text style={styles.formLabel}>שנת לימוד</Text>
        <Picker
          style={styles.input}
          selectedValue={year}
          onValueChange={(itemValue) => setYear(itemValue)}
        >
          <Picker.Item label="שנה א'" value="1" />
          <Picker.Item label="שנה ב'" value="2" />
          <Picker.Item label="שנה ג'" value="3" />
          <Picker.Item label="שנה ד'" value="4" />
        </Picker>

        <Text style={styles.formLabel}>מגדר</Text>
        <Picker
          style={styles.input}
          selectedValue={gender}
          onValueChange={(itemValue) => setGender(itemValue)}
        >
          <Picker.Item label="אישה" value="female" />
          <Picker.Item label="גבר" value="male" />
          <Picker.Item label="אחר" value="other" />
        </Picker>

        <Button
          title="הרשמה"
          onPress={handleSubmit}
          buttonStyle={{ backgroundColor: COLORS.buttonColor }}
          textStyle={{ color: "#475569" }}
        />
        {errorMessage && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}
      </View>
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>משתמש קיים?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignInScreen")}>
          <Text style={styles.loginLink}>התחברות</Text>
        </TouchableOpacity>
      </View>
    </View>)
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
      {Platform.OS === "ios" ? (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {pageFormView()}
    </ScrollView>
  ) : (
    pageFormView()
  )}
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.buttonColor,
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
    backgroundColor: COLORS.buttonColor,
    padding: 10,
    borderRadius: 10,
    marginLeft: 4,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  logo: {
    width: 400, // Adjust the width as needed
    height: 150, // Adjust the height as needed
    resizeMode: "contain",
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
    backgroundColor: COLORS.buttonColor,
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
    color: COLORS.buttonColor,
    fontWeight: "600",
    marginLeft: 4,
  },
});

export default SignUpScreen;
