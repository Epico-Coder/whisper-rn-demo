import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { COLORS } from "@/constants/colors";
import type { WhisperModel } from "@/hooks/use-whisper-model";

interface ModelCardProps {
  model: WhisperModel;
  isDownloaded: boolean;
  isActive: boolean;
  isInitializing: boolean;
  downloadProgress: number;
  fileSize?: number;
  isDeletingModelId: string | null;
  isDownloadingModelId: string | null;
  onSwitch: (modelId: string) => void;
  onDelete: (modelId: string) => void;
  onDownload: (modelId: string) => void;
}

export const ModelCard: React.FC<ModelCardProps> = ({
  model,
  isDownloaded,
  isActive,
  isInitializing,
  downloadProgress,
  fileSize,
  isDeletingModelId,
  isDownloadingModelId,
  onSwitch,
  onDelete,
  onDownload,
}) => {
  return (
    <View style={[styles.card, isActive && styles.cardActive]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.name}>{model.label}</Text>
          <Text style={styles.id}>{model.id}</Text>
        </View>
        {isActive && <Text style={styles.activeTag}>Active</Text>}
      </View>

      <View style={styles.properties}>
        <Text style={styles.propertyText}>
          Multilingual: {model.capabilities.multilingual ? "Yes" : "No"}
        </Text>
        {isDownloaded && fileSize && (
          <Text style={styles.propertyText}>
            Size: {(fileSize / (1024 * 1024)).toFixed(2)} MB
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        {isDownloaded ? (
          <>
            {!isActive && (
              <TouchableOpacity
                style={[styles.actionButton, styles.switchButton]}
                onPress={() => onSwitch(model.id)}
                disabled={isInitializing}
              >
                <Text style={styles.actionButtonText}>Switch</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => onDelete(model.id)}
              disabled={isDeletingModelId === model.id || isInitializing}
            >
              {isDeletingModelId === model.id ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.actionButtonText}>Delete</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[styles.actionButton, styles.downloadButton]}
            onPress={() => onDownload(model.id)}
            disabled={isDownloadingModelId === model.id}
          >
            {isDownloadingModelId === model.id ? (
              <View style={styles.downloadingContainer}>
                <ActivityIndicator color="white" size="small" />
                <Text style={styles.actionButtonText}>
                  {(downloadProgress * 100).toFixed(0)}%
                </Text>
              </View>
            ) : (
              <Text style={styles.actionButtonText}>Download</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLORS.cardBorder,
  },
  cardActive: {
    borderColor: COLORS.activeCardBorder,
    backgroundColor: COLORS.activeBg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  name: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  id: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
  activeTag: {
    color: COLORS.success,
    fontSize: 14,
    fontWeight: "600",
  },
  properties: {
    marginBottom: 12,
    gap: 6,
  },
  propertyText: {
    color: COLORS.textTertiary,
    fontSize: 13,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "flex-end",
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    color: COLORS.buttonText,
    fontSize: 13,
    fontWeight: "600",
  },
  switchButton: {
    backgroundColor: COLORS.buttonBlue,
  },
  downloadButton: {
    backgroundColor: COLORS.buttonGreen,
  },
  deleteButton: {
    backgroundColor: COLORS.buttonRed,
  },
  downloadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
});
