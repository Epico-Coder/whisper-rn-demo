import { useState, useCallback } from "react";
import { Alert } from "react-native";
import { TranscribeRealtimeOptions } from "whisper.rn/index.js";
import type { WhisperContext } from "whisper.rn/index.js";
import { ensureMicrophonePermission } from "@/utils/permissions";

export interface RealtimeTranscriber {
  stop: () => Promise<void>;
}

export const useTranscription = () => {
  const [realtimeTranscriber, setRealtimeTranscriber] =
    useState<RealtimeTranscriber | null>(null);
  const [isRealtimeActive, setIsRealtimeActive] = useState(false);
  const [realtimeResult, setRealtimeResult] = useState<string>("");
  const [realtimeFinalResult, setRealtimeFinalResult] = useState<string>("");
  const [error, setError] = useState<string>("");

  const startRealtimeTranscription = useCallback(
    async (whisperContext: WhisperContext | null) => {
      if (!whisperContext) {
        Alert.alert("Error", "Whisper not initialized");
        return;
      }

      try {
        const hasMicPermission = await ensureMicrophonePermission();
        if (!hasMicPermission) {
          setError("Real-time transcription requires microphone access.");
          return;
        }

        setIsRealtimeActive(true);
        setRealtimeResult("");
        setError("");

        const realtimeOptions: TranscribeRealtimeOptions = {
          language: "en",
          realtimeAudioSec: 300,
          realtimeAudioSliceSec: 20,
          realtimeAudioMinSec: 2,
          audioSessionOnStartIos: {
            category: "PlayAndRecord" as any,
            options: ["MixWithOthers" as any],
            mode: "Default" as any,
          },
          audioSessionOnStopIos: "restore" as any,
        };

        const { stop, subscribe } = await whisperContext.transcribeRealtime(
          realtimeOptions
        );

        subscribe((event: any) => {
          const { isCapturing, data } = event;

          if (data?.result) {
            const currentResult = data.result.trim();
            setRealtimeResult(currentResult);

            console.log("Real-time update:", {
              isCapturing,
              length: currentResult.length,
              totalWords: currentResult.split(" ").length,
            });
          }

          if (!isCapturing) {
            console.log("Speech segment finished, continuing to listen...");
          }
        });

        setRealtimeTranscriber({ stop });
      } catch (err) {
        const errorMessage = `Real-time transcription failed: ${err}`;
        console.error(errorMessage);
        setError(errorMessage);
        Alert.alert("Real-time Error", errorMessage);
        setIsRealtimeActive(false);
      }
    },
    []
  );

  const stopRealtimeTranscription = useCallback(async () => {
    try {
      if (realtimeTranscriber?.stop) {
        await realtimeTranscriber.stop();
        setRealtimeTranscriber(null);
      }

      const finalTranscript = realtimeResult.trim();
      if (finalTranscript) {
        setRealtimeFinalResult(finalTranscript);
        console.log("Final real-time transcript:", finalTranscript);
      }

      setIsRealtimeActive(false);
      console.log("Real-time transcription stopped");
    } catch (err) {
      console.error("Error stopping real-time transcription:", err);
    }
  }, [realtimeTranscriber, realtimeResult]);

  const clearError = useCallback(() => {
    setError("");
  }, []);

  return {
    isRealtimeActive,
    realtimeResult,
    realtimeFinalResult,
    error,
    startRealtimeTranscription,
    stopRealtimeTranscription,
    clearError,
  };
};
