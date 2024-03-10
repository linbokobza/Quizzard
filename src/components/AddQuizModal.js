import React, { useState } from "react";
import {
  Modal,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Image,
  ImageBackground,
} from "react-native";
import { getDatabase, ref, push, update } from "firebase/database";
import { getUnixTime } from "date-fns";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { storage } from "../firebase"; // Import storage from your firebase module
import { width } from "deprecated-react-native-prop-types/DeprecatedImagePropType";

const AddQuizModal = ({
  isVisible,
  onRequestClose,
  fetchQuizzes,
  lecturerEmail,
}) => {
  const [quizTitle, setQuizTitle] = useState("");
  const [selectedYear, setSelectedYear] = useState(1);
  const [IndexselectedImage, setSelectedImageIndex] = useState(null);
  let selectedImageIndex = 0;
  const saveQuiz = async () => {
    try {
      const db = getDatabase();
      const quizzesRef = ref(db, "Quizzes");

      const newQuizRef = push(quizzesRef);
      const quizData = {
        title: quizTitle,
        year: selectedYear,
        imageIndex: IndexselectedImage,
        lecturer: lecturerEmail,
      };

      await update(newQuizRef, quizData);

      onRequestClose();
      fetchQuizzes();
    } catch (error) {
      console.error("Error saving quiz:", error);
    }
  };
  const getImageSource = (path) => {
    const imageSource = Image.resolveAssetSource(path);
    return imageSource;
  };

  const quizImages = {
    1: require("../assets/courses/(1).png"),
    2: require("../assets/courses/(2).png"),
    3: require("../assets/courses/(3).png"),
    4: require("../assets/courses/(4).png"),
    5: require("../assets/courses/(5).png"),
    6: require("../assets/courses/(6).png"),
    7: require("../assets/courses/(7).png"),
    8: require("../assets/courses/(8).png"),
    9: require("../assets/courses/(9).png"),
    10: require("../assets/courses/(10).png"),
  };
  const quizImagesArray = Object.entries(quizImages);
  const imagePaths = Array.from(
    { length: 10 },
    (_, i) => `../assets/images/courses/(${i + 1}).png`
  );

  const pickImage = (index) => {
    setSelectedImageIndex(index);
    selectedImageIndex = index;
  };

  return (
    <Modal visible={isVisible} animationType="slide">
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>הוספת קוויז</Text>
        <TextInput
          style={styles.input}
          placeholder="כותרת הקוויז"
          value={quizTitle}
          onChangeText={(text) => setQuizTitle(text)}
        />
        <Picker
          style={styles.picker}
          selectedValue={selectedYear}
          onValueChange={(itemValue) => setSelectedYear(itemValue)}
        >
          <Picker.Item label="שנה 1" value={1} />
          <Picker.Item label="שנה 2" value={2} />
          <Picker.Item label="שנה 3" value={3} />
          <Picker.Item label="שנה 4" value={4} />
        </Picker>
        <Text style={styles.label}>בחר תמונה:</Text>
        <View style={styles.imageContainer}>
          {quizImagesArray.map(([index, value]) => (
            <TouchableOpacity
              style={styles.imageWrapper}
              key={index}
              onPress={() => pickImage(index)}
            >
              <Image
                source={quizImages[index]}
                style={styles.image}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </View>
        {/* {selectedImageIndex !== null && ( */}
        <Image
          source={quizImages[IndexselectedImage]}
          style={styles.selectedImage}
        />
        {/* )} */}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={saveQuiz}>
            <Text style={styles.buttonText}>הוסף</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={onRequestClose}>
            <Text style={styles.buttonText}>סגור</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: "100%",
  },
  picker: {
    height: 40,
    width: "100%",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 10,
  },
  imageWrapper: {
    width: "20%",
    padding: 5,
  },
  image: {
    width: 60,
    height: 60,
  },
  selectedImage: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  button: {
    marginHorizontal: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#3498db", // You can change the color
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff", // White text color
    fontSize: 16,
    fontWeight: "bold",
  },
});
export default AddQuizModal;
