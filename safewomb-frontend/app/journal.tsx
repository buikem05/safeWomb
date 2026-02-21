import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function JournalLogs() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Journal</Text>
        <View style={{ width: 24 }} /> {/* Invisible spacer to center the title */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* --- VOICE NOTE ENTRY --- */}
        <View style={styles.logCard}>
          <View style={styles.logHeader}>
            <Text style={styles.logDate}>Today, Week 28</Text>
            <Ionicons name="mic-circle" size={28} color="#4bd3a4" />
          </View>
          <Text style={styles.logTitle}>Weird Cravings & Kicks!</Text>
          
          {/* Mock Audio Player UI */}
          <View style={styles.audioPlayer}>
            <TouchableOpacity style={styles.playButton}>
              <Ionicons name="play" size={20} color="#fff" style={{ marginLeft: 3 }} />
            </TouchableOpacity>
            {/* Visual representation of a waveform */}
            <View style={styles.waveformContainer}>
              {[...Array(15)].map((_, i) => (
                <View key={i} style={[styles.waveLine, { height: Math.random() * 20 + 10 }]} />
              ))}
            </View>
            <Text style={styles.audioDuration}>01:15</Text>
          </View>
        </View>

        {/* --- TEXT ENTRY --- */}
        <View style={styles.logCard}>
          <View style={styles.logHeader}>
            <Text style={styles.logDate}>Yesterday, Week 28</Text>
            <Ionicons name="document-text" size={24} color="#a3b899" />
          </View>
          <Text style={styles.logTitle}>Morning Nausea</Text>
          <Text style={styles.logText}>
            Woke up feeling a bit queasy today. Had some ginger tea and dry toast which really helped settle my stomach. The baby is definitely more active at night!
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f6' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee', paddingTop: 40 }, // PaddingTop accounts for phone status bars
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  scrollContent: { padding: 20 },
  
  logCard: { backgroundColor: '#fff', borderRadius: 15, padding: 20, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 },
  logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  logDate: { fontSize: 14, color: '#888', fontWeight: '600' },
  logTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  logText: { fontSize: 15, color: '#555', lineHeight: 22 },
  
  audioPlayer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eef8f5', padding: 10, borderRadius: 30, marginTop: 5 },
  playButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#4bd3a4', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  waveformContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', marginRight: 10 },
  waveLine: { width: 3, backgroundColor: '#a3b899', borderRadius: 3 },
  audioDuration: { fontSize: 12, color: '#666', fontWeight: 'bold' }
});