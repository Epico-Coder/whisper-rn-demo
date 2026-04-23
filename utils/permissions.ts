import { Platform, Alert } from "react-native";
import {
  getRecordingPermissionsAsync,
  requestRecordingPermissionsAsync,
} from "expo-audio";

const getPermissionText = (blocked: boolean): string => {
  return blocked
    ? Platform.OS === "android"
      ? "Please enable microphone access in Android Settings to use real-time transcription."
      : "Please enable microphone access in iOS Settings to use real-time transcription."
    : "Microphone permission is required for real-time transcription.";
};

export const ensureMicrophonePermission = async (): Promise<boolean> => {
  try {
    let permissionStatus = await getRecordingPermissionsAsync();

    if (permissionStatus.granted) {
      return true;
    }

    if (!permissionStatus.canAskAgain) {
      Alert.alert("Microphone Permission", getPermissionText(true));
      console.warn("Microphone permission permanently denied.");
      return false;
    }

    permissionStatus = await requestRecordingPermissionsAsync();

    if (permissionStatus.granted) {
      return true;
    }

    const blocked = !permissionStatus.canAskAgain;
    Alert.alert("Microphone Permission", getPermissionText(blocked));
    console.warn("Microphone permission not granted:", permissionStatus);
    return false;
  } catch (err) {
    console.error("Failed to verify microphone permission:", err);
    Alert.alert(
      "Microphone Permission",
      "Unable to verify microphone permission. Please try again."
    );
    return false;
  }
};
