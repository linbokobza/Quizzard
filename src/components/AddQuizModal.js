import React, { useState } from "react";
import {
  Modal,
  TouchableOpacity,
  View,
  Text,
  TextInput,
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const numberOfImages = 10; // Adjust this number according to the number of images you have
  const imagePaths = Array.from(
    { length: 10 },
    (_, i) => `../assets/images/courses/(${i + 1}).png`
  );

  const saveQuiz = async () => {
    try {
      const db = getDatabase();
      const quizzesRef = ref(db, "Quizzes");

      const newQuizRef = push(quizzesRef);
      const quizData = {
        title: quizTitle,
        year: selectedYear,
        imageUri: imagePaths[selectedImageIndex],
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
    1: require("../assets/images/courses/ (1).png"),
    2: require("../assets/images/courses/ (2).png"),
    3: require("../assets/images/signup.png"),
    4: require("../assets/images/signup.png"),
    5: require("../assets/images/courses/ (5).png"),
    6: require("../assets/images/courses/ (6).png"),
    7: require("../assets/images/courses/ (7).png"),
    8: require("../assets/images/courses/ (8).png"),
    9: require("../assets/images/courses/ (9).png"),
    10: require("../assets/images/courses/ (10).png"),
  };

  const pickImage = (index) => {
    setSelectedImageIndex(index);
  };

  return (
    <Modal visible={isVisible} animationType="slide">
      <View>
        <Text>הוספת קוויז</Text>
        <TextInput
          placeholder="כותרת הקוויז"
          value={quizTitle}
          onChangeText={(text) => setQuizTitle(text)}
        />
        <Picker
          selectedValue={selectedYear}
          onValueChange={(itemValue) => setSelectedYear(itemValue)}
        >
          <Picker.Item label="שנה 1" value={1} />
          <Picker.Item label="שנה 2" value={2} />
          <Picker.Item label="שנה 3" value={3} />
          <Picker.Item label="שנה 4" value={4} />
        </Picker>
        <View>
          <Text>בחר תמונה:</Text>
          {/* {imagePaths.map((path, index) => (
            <TouchableOpacity key={index} onPress={() => pickImage(index)}>
              {console.log(index)}
              <Image
                source={quizImages[index + 1]}
                style={{ width: 50, height: 50 }}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))} */}
          <Image source={quizImages[3]} style={{ width: 50, height: 50 }} />
        </View>
        {selectedImageIndex !== null && (
          <Image
            source={"../assets/images/courses/ (8).png"}
            style={{ width: 50, height: 50 }}
          />
        )}

        <Button title="שמור וסגור" onPress={saveQuiz} />
        <Button title="סגור" onPress={onRequestClose} />
      </View>
    </Modal>
  );
};

export default AddQuizModal;
