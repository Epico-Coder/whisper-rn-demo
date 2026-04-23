import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "@/constants/colors";

interface ErrorCardProps {
  message: string;
}

export const ErrorCard: React.FC<ErrorCardProps> = ({ message }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.errorBg,
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.errorBorder,
  },
  text: {
    color: COLORS.errorText,
    fontSize: 14,
  },
});
