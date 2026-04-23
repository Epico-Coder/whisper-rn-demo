import { StyleSheet } from "react-native";
import { COLORS } from "@/constants/colors";

export const homeScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderTopWidth: 2,
    borderTopColor: COLORS.primaryBorder,
  },
  scrollView: {
    flex: 1,
  },

  // Top Section
  topSection: {
    padding: 16,
    gap: 12,
  },

  // Control Section
  controlSection: {
    padding: 16,
    paddingVertical: 24,
    gap: 12,
  },

  // Models Section
  modelsSection: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  modelsSectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
});
