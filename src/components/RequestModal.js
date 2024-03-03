import React from "react";
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"; // Import FontAwesome icons

const RequestModal = ({
  isVisible,
  onRequestClose,
  requestList,
  handleRequest,
}) => {
  const renderRequestItem = ({ item }) => (
    <View style={styles.requestItem}>
      <Text style={styles.fullName}>{item.fullName}</Text>
      <TouchableOpacity onPress={() => handleRequest(item.id, "true")}>
        <Icon name="check" size={30} color="#4CAF50" style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleRequest(item.id, "false")}>
        <Icon name="times" size={30} color="#FF4500" style={styles.icon} />
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onRequestClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Request List</Text>
          <FlatList
            data={requestList}
            keyExtractor={(item) => item.id}
            renderItem={renderRequestItem}
          />
          <TouchableOpacity style={styles.closeButton} onPress={onRequestClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  requestItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  fullName: {
    flex: 1,
    fontSize: 18,
    marginRight: 10,
  },
  icon: {
    marginLeft: 10,
  },
  closeButton: {
    backgroundColor: "#FF4500",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "100%",
  },
  closeButtonText: {
    color: "white",
    textAlign: "center",
  },
});

export default RequestModal;
