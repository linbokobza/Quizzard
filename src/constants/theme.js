import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

export const COLORS = {

  success: "#00C851",
  error: "#ff4444",

  black: "#171717",
  white: "#FFFFFF",
  backgroundcolor: "#FFF3E4",
  backgroundImage: require("../assets/background.jpg"),
  border: "#F5F5F7",
  buttonColor: "#FFE5C3",

  primary: "#252c4a",
  secondary: '#1E90FF',
  accent: '#3498db',
  background: "#252C4A"
};

export const SIZES = {
  base: 10,
  width,
  height,
};

export const themeColors = {
  bg: "#A2AAFC",
};
