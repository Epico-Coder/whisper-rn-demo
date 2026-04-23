import { useState, useCallback } from "react";
import { Alert } from "react-native";
import type { WhisperModel } from "@/hooks/use-whisper-model";

type InitializeModelFn = (modelId: string, options?: any) => Promise<any>;
type GetModelByIdFn = (modelId: string) => WhisperModel | undefined;

export const useModelManagement = (
  initializeWhisperModel: InitializeModelFn,
  deleteModel: (modelId: string) => Promise<void>,
  isModelDownloaded: (modelId: string) => boolean,
  getModelById: GetModelByIdFn,
  currentModelId: string | null
) => {
  const [isDeletingModelId, setIsDeletingModelId] = useState<string | null>(null);
  const [isDownloadingModelId, setIsDownloadingModelId] = useState<string | null>(null);

  const handleDownloadModel = useCallback(
    async (modelId: string) => {
      setIsDownloadingModelId(modelId);
      try {
        const model = getModelById(modelId);
        if (model) {
          await initializeWhisperModel(modelId);
          Alert.alert("Success", `${model.label} downloaded and initialized!`);
        }
      } catch (err) {
        Alert.alert("Error", `Failed to download model: ${err}`);
      } finally {
        setIsDownloadingModelId(null);
      }
    },
    [getModelById, initializeWhisperModel]
  );

  const handleDeleteModel = useCallback(
    (modelId: string) => {
      const isCurrentModel = modelId === currentModelId;
      const model = getModelById(modelId);

      Alert.alert(
        "Delete Model",
        isCurrentModel
          ? `Delete ${model?.label ?? "this model"}? This will remove the active model and set the system status back to Not initialized.`
          : "Are you sure you want to delete this model?",
        [
          { text: "Cancel", onPress: () => {} },
          {
            text: "Delete",
            onPress: async () => {
              setIsDeletingModelId(modelId);
              try {
                await deleteModel(modelId);
                Alert.alert(
                  "Success",
                  isCurrentModel
                    ? "Model deleted successfully. System status is now Not initialized."
                    : "Model deleted successfully!"
                );
              } catch (err) {
                Alert.alert("Error", `Failed to delete model: ${err}`);
              } finally {
                setIsDeletingModelId(null);
              }
            },
          },
        ]
      );
    },
    [currentModelId, deleteModel, getModelById]
  );

  const handleSwitchModel = useCallback(
    async (modelId: string) => {
      if (modelId === currentModelId) {
        return;
      }

      try {
        const model = getModelById(modelId);
        if (!model) return;

        if (isModelDownloaded(modelId)) {
          await initializeWhisperModel(modelId);
          Alert.alert("Success", `Switched to ${model.label}`);
        } else {
          await handleDownloadModel(modelId);
        }
      } catch (err) {
        Alert.alert("Error", `Failed to switch model: ${err}`);
      }
    },
    [currentModelId, getModelById, isModelDownloaded, initializeWhisperModel, handleDownloadModel]
  );

  return {
    isDeletingModelId,
    isDownloadingModelId,
    handleDownloadModel,
    handleDeleteModel,
    handleSwitchModel,
  };
};
