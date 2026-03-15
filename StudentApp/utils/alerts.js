import { Alert, Platform } from "react-native";
import Swal from "sweetalert2";

export const isSuccessStatus = (status) => {
  const normalized = String(status || "").toLowerCase();
  return normalized === "ok" || normalized === "success";
};

const fireWebAlert = ({ icon, title, text }) => {
  return Swal.fire({
    icon,
    title,
    text,
    confirmButtonColor: "#0d6efd",
  });
};

export const showSuccessAlert = ({
  title = "Success",
  message,
  onNativeAlert,
}) => {
  if (Platform.OS === "web") {
    return fireWebAlert({ icon: "success", title, text: message || "Done." });
  }

  if (typeof onNativeAlert === "function") {
    onNativeAlert({ type: "success", title, message });
    return Promise.resolve();
  }

  Alert.alert(title, message || "Done.");
  return Promise.resolve();
};

export const showErrorAlert = ({ title = "Error", message, onNativeAlert }) => {
  if (Platform.OS === "web") {
    return fireWebAlert({
      icon: "error",
      title,
      text: message || "Something went wrong.",
    });
  }

  if (typeof onNativeAlert === "function") {
    onNativeAlert({ type: "error", title, message });
    return Promise.resolve();
  }

  Alert.alert(title, message || "Something went wrong.");
  return Promise.resolve();
};

export const showDeleteConfirmation = ({
  studentName,
  onConfirm,
  onNativeAlert,
}) => {
  const message = `Delete ${studentName}?`;

  if (Platform.OS === "web") {
    return Swal.fire({
      icon: "warning",
      title: "Delete Student",
      text: message,
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc3545",
    }).then((result) => {
      if (result.isConfirmed && typeof onConfirm === "function") {
        onConfirm();
      }
    });
  }

  if (typeof onNativeAlert === "function") {
    onNativeAlert({
      type: "confirm",
      title: "Delete Student",
      message,
      onConfirm,
    });
    return Promise.resolve();
  }

  Alert.alert("Delete Student", message, [
    { text: "Cancel", style: "cancel" },
    { text: "Delete", style: "destructive", onPress: onConfirm },
  ]);
  return Promise.resolve();
};
