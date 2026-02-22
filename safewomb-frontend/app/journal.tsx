import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function JournalLogScreen() {
  const router = useRouter();

  // Mock data representing database history
  const journalHistory = [
    {
      id: 1,
      date: "Oct 24, 2026",
      type: "voice",
      content: "Voice Note (00:45)",
      aiResponse: "Your baby's hearing is developing rapidly this week! It's perfectly normal to feel exhausted; your body is working overtime. Make sure to rest."
    },
    {
      id: 2,
      date: "Oct 22, 2026",
      type: "text",
      content: "Craving so much spicy food today but it's giving me terrible heartburn.",
      aiResponse: "Spicy food cravings are very common! To help with the heartburn, try eating smaller meals and avoid lying down immediately after eating."
    }
  ];

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

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {journalHistory.map((entry) => (
          <View key={entry.id} style={styles.logContainer}>
            <Text style={styles.dateText}>{entry.date}</Text>
            
            {/* User's Entry */}
            <View style={styles.userBubble}>
              <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
                <Ionicons name={entry.type === 'voice' ? 'mic' : 'pencil'} size={14} color="#888" />
                <Text style={styles.bubbleLabel}> You</Text>
              </View>
              <Text style={styles.userText}>{entry.content}</Text>
              {entry.type === 'voice' && (
                <View style={styles.waveformMock}><Ionicons name="pulse" size={24} color="#4bd3a4" /></View>
              )}
            </View>

            {/* AI Response */}
            <View style={styles.aiBubble}>
              <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
                <Ionicons name="sparkles" size={14} color="#a855f7" />
                <Text style={[styles.bubbleLabel, {color: '#a855f7'}]}> SafeWomb Assistant</Text>
              </View>
              <Text style={styles.aiText}>{entry.aiResponse}</Text>
            </View>
          </View>
        ))}

      </ScrollView>
    </View>
  );
}

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