import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function JournalLogScreen() {
  const router = useRouter();
  
  // 1. State to hold your real database logs and loading status
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Fetch data when the screen loads
  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      // Point this to your backend IP/localhost
      const response = await fetch('http://localhost:5000/api/logs'); 
      const result = await response.json();

      if (result.success) {
        setLogs(result.data);
      } else {
        Alert.alert("Error", "Failed to load journal logs.");
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
      Alert.alert("Network Error", "Could not connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Journal Logs</Text>
        <View style={{ width: 24 }} /> 
      </View>

      {/* Loading Spinner */}
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#4bd3a4" />
          <Text style={{ marginTop: 10, color: '#888' }}>Loading your history...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {logs.length === 0 ? (
             <Text style={{ textAlign: 'center', color: '#888', marginTop: 50 }}>No journal entries yet. Go record one!</Text>
          ) : (
            logs.map((entry: any) => {
              // Format the MongoDB date beautifully
              const dateString = new Date(entry.createdAt).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              });

              // Check if it's a voice note based on the saved symptoms text
              const isVoice = entry.symptoms === "Voice Note Submitted";

              return (
                <View key={entry._id} style={styles.logContainer}>
                  <Text style={styles.dateText}>{dateString} - Week {entry.week}</Text>
                  
                  {/* User's Entry */}
                  <View style={styles.userBubble}>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
                      <Ionicons name={isVoice ? 'mic' : 'pencil'} size={14} color="#888" />
                      <Text style={styles.bubbleLabel}> You</Text>
                    </View>
                    <Text style={styles.userText}>{entry.symptoms}</Text>
                    {isVoice && (
                      <View style={styles.waveformMock}><Ionicons name="pulse" size={24} color="#4bd3a4" /></View>
                    )}
                  </View>

                  {/* AI Response */}
                  <View style={styles.aiBubble}>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
                      <Ionicons name="sparkles" size={14} color="#a855f7" />
                      <Text style={[styles.bubbleLabel, {color: '#a855f7'}]}> SafeWomb Assistant</Text>
                    </View>
                    {/* Pulling the advice directly from the saved aiAnalysis object */}
                    <Text style={styles.aiText}>{entry.aiAnalysis?.advice || "No advice recorded."}</Text>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}
    </View>
  );
}

// Keep your exact same styles down here...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f6' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingTop: 50, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee' },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  scrollContent: { padding: 20, paddingBottom: 50 },
  logContainer: { marginBottom: 30 },
  dateText: { fontSize: 13, fontWeight: 'bold', color: '#888', marginBottom: 10, textAlign: 'center' },
  userBubble: { backgroundColor: '#fff', padding: 15, borderRadius: 20, borderBottomRightRadius: 5, alignSelf: 'flex-end', maxWidth: '85%', shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 5, elevation: 1, marginBottom: 10 },
  bubbleLabel: { fontSize: 12, fontWeight: 'bold', color: '#888' },
  userText: { fontSize: 15, color: '#333', lineHeight: 22 },
  waveformMock: { backgroundColor: '#eef8f5', padding: 10, borderRadius: 10, marginTop: 10, alignItems: 'center' },
  aiBubble: { backgroundColor: '#f3e8ff', padding: 15, borderRadius: 20, borderTopLeftRadius: 5, alignSelf: 'flex-start', maxWidth: '85%', shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 5, elevation: 1 },
  aiText: { fontSize: 15, color: '#4c1d95', lineHeight: 22 },
});