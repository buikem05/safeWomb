import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useGlobalSearchParams } from "expo-router";

export default function NewEntryScreen() {
  const router = useRouter();
  const params = useGlobalSearchParams();

  const [activeMode, setActiveMode] = useState<"text" | "voice">("text");
  const [journalText, setJournalText] = useState("");

  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [week, setWeek] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // 📍 NEW: Loading state for when the AI is "thinking"
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const mediaRecorder = useRef<any>(null);
  const audioChunks = useRef<Blob[]>([]);
  const audioPlayer = useRef<any>(null);

  useEffect(() => {
    setActiveMode(params.inputMode === "voice" ? "voice" : "text");
    return () => {
      if (mediaRecorder.current && mediaRecorder.current.state !== "inactive")
        mediaRecorder.current.stop();
      if (audioPlayer.current) audioPlayer.current.pause();
    };
  }, [params.inputMode]);

  const startRecording = async () => {
    if (Platform.OS !== "web") return alert("This setup is tailored for Web.");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new (window as any).MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event: any) => {
        if (event.data.size > 0) audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(audioBlob));
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setAudioUrl(null);
      setIsPlaying(false);
    } catch (err) {
      console.error("Mic access denied:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream
        .getTracks()
        .forEach((track: any) => track.stop());
    }
    setIsRecording(false);
  };

  const togglePlayback = () => {
    if (!audioUrl) return;
    if (isPlaying && audioPlayer.current) {
      audioPlayer.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayer.current = new Audio(audioUrl);
      audioPlayer.current.play();
      setIsPlaying(true);
      audioPlayer.current.onended = () => setIsPlaying(false);
    }
  };

  const retakeAudio = () => {
    if (audioPlayer.current) audioPlayer.current.pause();
    setAudioUrl(null);
    setIsPlaying(false);
  };

  // 📍 NEW: THE WEBSOCKET & AI LOGIC
  const handleSaveAndAnalyze = async () => {
    // Basic validation to prevent backend 400 errors
    if (!week) {
      alert("Please enter your pregnancy week first!");
      return;
    }

    setIsAnalyzing(true);

    try {
      // <--- The try block starts here
      let aiResponseText = "";

      // 📝 --- IF SHE TYPED A MESSAGE ---
      if (activeMode === "text") {
        const response = await fetch("http://localhost:5000/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            week: week,
            symptoms: journalText,
            phoneNumber: phoneNumber,
          }),
        });

        const result = await response.json();
        console.log("TEXT BACKEND RESPONSE:", result);

        if (result.success) {
          const aiData = result.data;
          aiResponseText = `⚠️ Risk Level: ${aiData.riskLevel}\n\n🩺 Advice: ${aiData.advice}\n\n👶 Baby Update: ${aiData.babyUpdate}`;
        } else {
          aiResponseText = "Analysis failed: " + result.error;
        }
      }

      // 🎙️ --- IF SHE RECORDED AUDIO ---
      else if (activeMode === "voice" && audioUrl) {
        const audioResponse = await fetch(audioUrl);
        const blob = await audioResponse.blob();

        const reader = new FileReader();
        reader.readAsDataURL(blob);

        await new Promise((resolve, reject) => {
          reader.onloadend = async () => {
            try {
              const base64Audio = (reader.result as string).split(",")[1];

              const serverRes = await fetch(
                "http://localhost:5000/api/analyze",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    week: week,
                    phoneNumber: phoneNumber,
                    type: "voice",
                    payload: base64Audio,
                  }),
                },
              );

              const result = await serverRes.json();
              console.log("VOICE BACKEND RESPONSE:", result);

              if (result.success) {
                const aiData = result.data;
                aiResponseText = `⚠️ Risk Level: ${aiData.riskLevel}\n\n🩺 Advice: ${aiData.advice}\n\n👶 Baby Update: ${aiData.babyUpdate}`;
              } else {
                aiResponseText = "Voice analysis failed: " + result.error;
              }

              resolve(null);
            } catch (err) {
              console.error("Error processing voice:", err);
              aiResponseText =
                "Something went wrong while processing the audio.";
              resolve(null);
            }
          };
          reader.onerror = reject;
        });
      }

      // 🚀 --- SEND THE RESPONSE TO THE DASHBOARD ---
      finishSave(aiResponseText);
    } catch (error) { 
      console.error("Failed to connect to AI API:", error);
      finishSave(
        "Looks like the AI is resting right now, but your journal entry was saved safely!",
      );
    }
  }; // <--- handleSaveAndAnalyze ends here

  // 👇 PASTE THE REAL FINISH SAVE HERE 👇
  const finishSave = (aiResponse: string) => {
    setIsAnalyzing(false);
    router.push({
      pathname: '/',
      params: {
        newEntryContent: activeMode === 'text' ? journalText : "Voice Note (Saved)",
        aiResponse: aiResponse
      }
    });
  };
  // 👆 ------------------------------- 👆

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        {isAnalyzing && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#4bd3a4" />
            <Text style={styles.loadingText}>
              AI is analyzing your journal...
            </Text>
          </View>
        )}

        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Entry</Text>
          <TouchableOpacity
            onPress={handleSaveAndAnalyze}
            disabled={isAnalyzing}
          >
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              activeMode === "text" && styles.activeToggle,
            ]}
            onPress={() => setActiveMode("text")}
          >
            <Ionicons
              name="pencil"
              size={20}
              color={activeMode === "text" ? "#fff" : "#888"}
            />
            <Text
              style={[
                styles.toggleText,
                activeMode === "text" && styles.activeToggleText,
              ]}
            >
              {" "}
              Type
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              activeMode === "voice" && styles.activeToggle,
            ]}
            onPress={() => setActiveMode("voice")}
          >
            <Ionicons
              name="mic"
              size={20}
              color={activeMode === "voice" ? "#fff" : "#888"}
            />
            <Text
              style={[
                styles.toggleText,
                activeMode === "voice" && styles.activeToggleText,
              ]}
            >
              {" "}
              Voice
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* 📍 NEW: Inputs for Week and Phone Number */}
          <View style={{ flexDirection: "row", gap: 10, marginBottom: 15 }}>
            <TextInput
              style={[styles.textInput, { minHeight: 50, flex: 1 }]}
              placeholder="Week (e.g. 14)"
              keyboardType="numeric"
              value={week}
              onChangeText={setWeek}
            />
            <TextInput
              style={[styles.textInput, { minHeight: 50, flex: 2 }]}
              placeholder="Phone # for SMS alerts"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>

          {activeMode === "text" ? (
            <TextInput
              style={[styles.textInput, { minHeight: 250 }]} // Adjusted height to make room for new inputs
              placeholder="How are you feeling today?"
              placeholderTextColor="#aaa"
              multiline={true}
              value={journalText}
              onChangeText={setJournalText}
            />
          ) : (
            <View style={styles.voiceContainer}>
              {!audioUrl ? (
                <>
                  <Text style={styles.voicePrompt}>
                    {isRecording
                      ? "Recording your voice..."
                      : "Tap to start recording"}
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.micButton,
                      isRecording && styles.micButtonRecording,
                    ]}
                    onPress={isRecording ? stopRecording : startRecording}
                  >
                    <Ionicons
                      name={isRecording ? "stop" : "mic"}
                      size={50}
                      color="#fff"
                    />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.voicePrompt}>Recording captured!</Text>
                  <View style={styles.playbackControls}>
                    <TouchableOpacity
                      style={styles.playButton}
                      onPress={togglePlayback}
                    >
                      <Ionicons
                        name={isPlaying ? "pause" : "play"}
                        size={45}
                        color="#fff"
                        style={{ marginLeft: isPlaying ? 0 : 5 }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.retakeButton}
                      onPress={retakeAudio}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color="#ff5252"
                      />
                      <Text style={styles.retakeText}>Retake</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f7f6", paddingTop: 50 },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.9)",
    zIndex: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  saveText: { fontSize: 16, fontWeight: "bold", color: "#4bd3a4" },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#eef2ee",
    borderRadius: 15,
    padding: 5,
    margin: 20,
  },
  toggleButton: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  activeToggle: {
    backgroundColor: "#4bd3a4",
    shadowColor: "#4bd3a4",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  toggleText: { fontSize: 15, fontWeight: "bold", color: "#888" },
  activeToggleText: { color: "#fff" },
  content: { paddingHorizontal: 20, flexGrow: 1 },
  textInput: {
    flex: 1,
    fontSize: 18,
    color: "#333",
    lineHeight: 28,
    textAlignVertical: "top",
    minHeight: 300,
  },
  voiceContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  voicePrompt: {
    fontSize: 18,
    color: "#666",
    marginBottom: 40,
    fontWeight: "bold",
  },
  micButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#4bd3a4",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#4bd3a4",
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  micButtonRecording: { backgroundColor: "#ff5252", shadowColor: "#ff5252" },
  playbackControls: { alignItems: "center", marginTop: 10 },
  playButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#4bd3a4",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#4bd3a4",
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
    marginBottom: 40,
  },
  retakeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffecec",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  retakeText: {
    color: "#ff5252",
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 16,
  },
});


