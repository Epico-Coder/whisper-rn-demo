import React, { useEffect } from "react";
import { View, ScrollView, Text } from "react-native";
import { useWhisperModels, WHISPER_MODELS } from "@/hooks/use-whisper-model";
import { useTranscription } from "@/hooks/useTranscription";
import { useModelManagement } from "@/hooks/useModelManagement";
import { StatusCard } from "@/components/cards/StatusCard";
import { ErrorCard } from "@/components/cards/ErrorCard";
import { TranscriptionCard } from "@/components/cards/TranscriptionCard";
import { RecordingButton } from "@/components/buttons/RecordingButton";
import { ModelCard } from "@/components/cards/ModelCard";
import { homeScreenStyles as styles } from "@/styles/homeScreenStyles";

export default function HomeScreen() {
  // Whisper models hook
  const {
    whisperContext,
    isInitializingModel,
    isDownloading,
    downloadProgress,
    currentModelId,
    modelFiles,
    initializeWhisperModel,
    getCurrentModel,
    getDownloadProgress,
    getModelById,
    isModelDownloaded,
    deleteModel,
  } = useWhisperModels();

  // Transcription management hook
  const {
    isRealtimeActive,
    realtimeResult,
    error,
    startRealtimeTranscription,
    stopRealtimeTranscription,
  } = useTranscription();

  // Model management hook
  const {
    isDeletingModelId,
    isDownloadingModelId,
    handleDownloadModel,
    handleDeleteModel,
    handleSwitchModel,
  } = useModelManagement(
    initializeWhisperModel,
    deleteModel,
    isModelDownloaded,
    getModelById,
    currentModelId
  );

  // Initialize default model on mount
  useEffect(() => {
    const initializeModel = async (modelId: string = "base") => {
      try {
        await initializeWhisperModel(modelId);
      } catch (e) {
        console.log(e);
      }
    };
    initializeModel();
  }, []);

  // Compute status text
  const activeModelLabel = getCurrentModel()?.label || "No model selected";
  const downloadPercentage = getDownloadProgress(currentModelId || "base") ?? 0;
  const whisperStatusText = isDownloading
    ? `Downloading ${activeModelLabel} . ${(downloadPercentage * 100).toFixed(0)}%`
    : isInitializingModel
    ? "Initializing model..."
    : whisperContext
    ? `Ready . ${activeModelLabel}`
    : "Not initialized";

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Top Section - Status and Transcription */}
        <View style={styles.topSection}>
          <StatusCard label="System Status" value={whisperStatusText} />
          {error ? <ErrorCard message={error} /> : null}
          <TranscriptionCard text={realtimeResult} />
        </View>

        {/* Middle Section - Control Button */}
        <View style={styles.controlSection}>
          <RecordingButton
            isActive={isRealtimeActive}
            isEnabled={!!whisperContext}
            onPress={
              isRealtimeActive
                ? stopRealtimeTranscription
                : () => startRealtimeTranscription(whisperContext)
            }
          />
        </View>

        {/* Bottom Section - Models */}
        <View style={styles.modelsSection}>
          <Text style={styles.modelsSectionTitle}>Available Models</Text>

          {WHISPER_MODELS.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              isDownloaded={isModelDownloaded(model.id)}
              isActive={currentModelId === model.id}
              isInitializing={isInitializingModel}
              downloadProgress={getDownloadProgress(model.id)}
              fileSize={modelFiles[model.id]?.size}
              isDeletingModelId={isDeletingModelId}
              isDownloadingModelId={isDownloadingModelId}
              onSwitch={handleSwitchModel}
              onDelete={handleDeleteModel}
              onDownload={handleDownloadModel}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
