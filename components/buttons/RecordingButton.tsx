import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { COLORS } from "@/constants/colors";

interface RecordingButtonProps {
  isActive: boolean;
  isEnabled: boolean;
  onPress: () => void;
}

export const RecordingButton: React.FC<RecordingButtonProps> = ({
  isActive,
  isEnabled,
  onPress,
}) => {
  const backgroundColor = isActive ? COLORS.buttonRed : COLORS.buttonGreen;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, { backgroundColor }]}
      disabled={!isEnabled}
    >
      <Text style={styles.text}>
        {isActive ? "Stop Recording" : "Start Recording"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  text: {
    color: COLORS.buttonText,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
