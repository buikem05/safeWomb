import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function BabySetup() {
  const router = useRouter();
  
  // State to hold the new infant details
  const [babyName, setBabyName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthWeight, setBirthWeight] = useState('');

  const handleSave = () => {
    // We send a parameter back to the dashboard telling it to activate Child Mode
    router.push({ 
      pathname: '/', 
      params: { mode: 'child', name: babyName } 
    });
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.iconContainer}>
          <Ionicons name="color-wand" size={50} color="#4bd3a4" />
        </View>

        <Text style={styles.title}>Welcome to the World!</Text>
        <Text style={styles.subtitle}>Let's set up the dashboard for your little one.</Text>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Baby's Name</Text>
          <TextInput 
            style={styles.input} 
            placeholder="e.g., Ava"
            value={babyName}
            onChangeText={setBabyName}
            placeholderTextColor="#aaa"
          />

          <Text style={styles.label}>Date of Birth</Text>
          <TextInput 
            style={styles.input} 
            placeholder="DD/MM/YYYY"
            value={birthDate}
            onChangeText={setBirthDate}
            placeholderTextColor="#aaa"
          />

          <Text style={styles.label}>Birth Weight (kg)</Text>
          <TextInput 
            style={styles.input} 
            placeholder="e.g., 3.2"
            keyboardType="numeric"
            value={birthWeight}
            onChangeText={setBirthWeight}
            placeholderTextColor="#aaa"
          />
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, !babyName ? styles.saveButtonDisabled : null]} 
          onPress={handleSave}
          disabled={!babyName}
        >
          <Text style={styles.saveButtonText}>Enter Child Dashboard</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 10 }} />
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#f4f7f6', padding: 30, justifyContent: 'center' },
  iconContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#eef8f5', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 40 },
  formContainer: { backgroundColor: '#fff', padding: 25, borderRadius: 20, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 10, elevation: 2, marginBottom: 30 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 8 },
  input: { backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#eee', padding: 15, borderRadius: 12, fontSize: 16, marginBottom: 20, color: '#333' },
  saveButton: { backgroundColor: '#4bd3a4', padding: 18, borderRadius: 30, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', shadowColor: '#4bd3a4', shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  saveButtonDisabled: { backgroundColor: '#a3b899', opacity: 0.7 },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});