import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "@/constants/colors";

interface TranscriptionCardProps {
  text: string;
}

export const TranscriptionCard: React.FC<TranscriptionCardProps> = ({ text }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Live Transcription</Text>
      <Text style={styles.text}>{text || "Waiting for audio..."}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.purpleBorder,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  text: {
    color: COLORS.textPrimary,
    fontSize: 15,
    lineHeight: 22,
  },
});
