import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function NewEntryScreen() {
  const router = useRouter();
  
  // State variables for our form
  const [entryType, setEntryType] = useState('text'); // 'text' or 'voice'
  const [noteText, setNoteText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Symptoms');

  const categories = ['Symptoms', 'Cravings', 'Diet', 'Mood', 'Notes'];

  const toggleRecording = () => {
    // In the future, this is where we trigger the device microphone API
    setIsRecording(!isRecording);
  };

  const handleSave = () => {
    // Eventually, this will save the data to a database. For now, it just goes back.
    router.push('/journal'); 
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Log</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* Toggle Text vs Voice */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity 
              style={[styles.toggleButton, entryType === 'text' && styles.activeToggle]}
              onPress={() => setEntryType('text')}
            >
              <Ionicons name="pencil" size={18} color={entryType === 'text' ? '#fff' : '#888'} />
              <Text style={[styles.toggleText, entryType === 'text' && styles.activeToggleText]}>Write</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.toggleButton, entryType === 'voice' && styles.activeToggle]}
              onPress={() => setEntryType('voice')}
            >
              <Ionicons name="mic" size={18} color={entryType === 'voice' ? '#fff' : '#888'} />
              <Text style={[styles.toggleText, entryType === 'voice' && styles.activeToggleText]}>Record</Text>
            </TouchableOpacity>
          </View>

          {/* Categories Selector */}
          <Text style={styles.sectionTitle}>What are you logging?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map((cat) => (
              <TouchableOpacity 
                key={cat} 
                style={[styles.categoryPill, activeCategory === cat && styles.activeCategoryPill]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text style={[styles.categoryText, activeCategory === cat && styles.activeCategoryText]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Dynamic Input Area */}
          <View style={styles.inputArea}>
            {entryType === 'text' ? (
              <TextInput
                style={styles.textInput}
                placeholder="What are you experiencing right now?"
                placeholderTextColor="#aaa"
                multiline
                autoFocus
                value={noteText}
                onChangeText={setNoteText}
                textAlignVertical="top"
              />
            ) : (
              <View style={styles.voiceContainer}>
                {isRecording ? (
                  <View style={styles.recordingUI}>
                    <Text style={styles.timerText}>00:14</Text>
                    <Text style={styles.recordingStatus}>Recording your voice...</Text>
                    {/* Mock Waveform */}
                    <View style={styles.waveform}>
                      {[...Array(12)].map((_, i) => (
                        <View key={i} style={[styles.waveBar, { height: Math.random() * 40 + 10 }]} />
                      ))}
                    </View>
                  </View>
                ) : (
                  <Text style={styles.voicePrompt}>Tap the microphone to start sharing your experience.</Text>
                )}
                
                <TouchableOpacity 
                  style={[styles.micButton, isRecording && styles.micButtonRecording]} 
                  onPress={toggleRecording}
                >
                  <Ionicons name={isRecording ? "stop" : "mic"} size={40} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          </View>

        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f6' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingTop: 50, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee' },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  saveText: { fontSize: 16, fontWeight: 'bold', color: '#4bd3a4', padding: 5 },
  
  scrollContent: { padding: 20 },
  
  toggleContainer: { flexDirection: 'row', backgroundColor: '#eef2ee', borderRadius: 25, padding: 5, marginBottom: 25 },
  toggleButton: { flex: 1, flexDirection: 'row', paddingVertical: 12, justifyContent: 'center', alignItems: 'center', borderRadius: 20 },
  activeToggle: { backgroundColor: '#4bd3a4', shadowColor: '#4bd3a4', shadowOpacity: 0.3, shadowRadius: 5, elevation: 3 },
  toggleText: { fontSize: 15, fontWeight: 'bold', color: '#888', marginLeft: 8 },
  activeToggleText: { color: '#fff' },

  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#555', marginBottom: 15 },
  categoryScroll: { flexDirection: 'row', marginBottom: 25 },
  categoryPill: { backgroundColor: '#fff', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: '#ddd' },
  activeCategoryPill: { backgroundColor: '#dce8e3', borderColor: '#a3b899' },
  categoryText: { color: '#666', fontWeight: '600' },
  activeCategoryText: { color: '#3a5a40' },

  inputArea: { flex: 1, minHeight: 300, backgroundColor: '#fff', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 },
  textInput: { flex: 1, fontSize: 18, color: '#333', lineHeight: 28 },
  
  voiceContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  voicePrompt: { fontSize: 16, color: '#888', textAlign: 'center', marginBottom: 40, paddingHorizontal: 20, lineHeight: 24 },
  
  recordingUI: { alignItems: 'center', marginBottom: 40, width: '100%' },
  timerText: { fontSize: 40, fontWeight: 'bold', color: '#333' },
  recordingStatus: { fontSize: 14, color: '#ff5252', marginTop: 5, fontWeight: '600' },
  waveform: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 60, marginTop: 20, width: '100%' },
  waveBar: { width: 6, backgroundColor: '#4bd3a4', borderRadius: 3, marginHorizontal: 3 },
  
  micButton: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#4bd3a4', justifyContent: 'center', alignItems: 'center', shadowColor: '#4bd3a4', shadowOpacity: 0.4, shadowRadius: 15, elevation: 6 },
  micButtonRecording: { backgroundColor: '#ff5252', shadowColor: '#ff5252' },
});