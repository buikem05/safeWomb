import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SignUpScreen() {
  const router = useRouter();

  // Basic Info State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(''); // 📍 NEW: Phone number state added
  const [motherAge, setMotherAge] = useState('');

  // Password State
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & Dynamic Child Info State
  const [status, setStatus] = useState<'pregnant' | 'mother'>('pregnant');
  const [pregnancyWeeks, setPregnancyWeeks] = useState('');
  const [babyDob, setBabyDob] = useState('');

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      Alert.alert("Passwords don't match", "Please make sure your passwords match before continuing.");
      return;
    }

    let calculatedDueDate = "";
    let enteredWeek = "14"; // Default fallback

    // MATHEMATICS: Convert "Pregnancy Weeks" into a real Due Date
    if (status === 'pregnant') {
      enteredWeek = pregnancyWeeks || "14"; // Captures exactly what she typed!
      const weeks = parseInt(enteredWeek);
      const weeksRemaining = 40 - weeks;

      const edd = new Date();
      edd.setDate(edd.getDate() + (weeksRemaining * 7));
      calculatedDueDate = edd.toISOString().split('T')[0];
    }

    // 🧠 TODO: Send 'phone', 'email', 'name', etc., to your MongoDB database later!
    console.log("Sign up details:", { name, email, phone, motherAge, status });

    // Sends the exact parameters back to the Dashboard globally
    router.push({
      pathname: '/',
      params: {
        userName: name || "New Mother",
        mode: status === 'mother' ? 'child' : 'pregnancy',
        dueDate: calculatedDueDate,
        userWeek: enteredWeek // Sending the exact number!
      }
    });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* Back Button & Header */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join SafeWomb to track, learn, and grow together.</Text>
        </View>

        {/* Status Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, status === 'pregnant' && styles.activeToggle]}
            onPress={() => setStatus('pregnant')}
          >
            <Text style={[styles.toggleText, status === 'pregnant' && styles.activeToggleText]}>I'm Pregnant</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, status === 'mother' && styles.activeToggle]}
            onPress={() => setStatus('mother')}
          >
            <Text style={[styles.toggleText, status === 'mother' && styles.activeToggleText]}>I'm a Mother</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Up Form */}
        <View style={styles.form}>
          <Text style={styles.sectionLabel}>Personal Information</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#888" style={styles.icon} />
            <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#aaa" value={name} onChangeText={setName} />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="calendar-outline" size={20} color="#888" style={styles.icon} />
            <TextInput style={styles.input} placeholder="Your Age" placeholderTextColor="#aaa" keyboardType="numeric" value={motherAge} onChangeText={setMotherAge} />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#888" style={styles.icon} />
            <TextInput style={styles.input} placeholder="Email Address" placeholderTextColor="#aaa" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
          </View>

          {/* 📍 NEW: Phone Number Field */}
          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} color="#888" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#aaa"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <Text style={styles.sectionLabel}>
            {status === 'pregnant' ? "Pregnancy Details" : "Baby's Details"}
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons name={status === 'pregnant' ? "hourglass-outline" : "calendar-outline"} size={20} color="#888" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder={status === 'pregnant' ? "Current Pregnancy Age (in weeks)" : "Baby's Date of Birth (YYYY-MM-DD)"}
              placeholderTextColor="#aaa"
              keyboardType={status === 'pregnant' ? "numeric" : "default"}
              value={status === 'pregnant' ? pregnancyWeeks : babyDob}
              onChangeText={status === 'pregnant' ? setPregnancyWeeks : setBabyDob}
            />
          </View>

          <Text style={styles.sectionLabel}>Security</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.icon} />
            <TextInput style={styles.input} placeholder="Create Password" placeholderTextColor="#aaa" secureTextEntry={!showPassword} value={password} onChangeText={setPassword} />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={22} color="#888" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#888" style={styles.icon} />
            <TextInput style={styles.input} placeholder="Confirm Password" placeholderTextColor="#aaa" secureTextEntry={!showConfirmPassword} value={confirmPassword} onChangeText={setConfirmPassword} />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
              <Ionicons name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} size={22} color="#888" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={handleSignUp}>
            <Text style={styles.primaryButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.footerLink}>Log In</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#f4f7f6', padding: 30, paddingTop: 60, paddingBottom: 50 },
  backButton: { marginBottom: 20 },
  header: { marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  subtitle: { fontSize: 15, color: '#666', lineHeight: 22 },
  toggleContainer: { flexDirection: 'row', backgroundColor: '#eef2ee', borderRadius: 15, padding: 5, marginBottom: 25 },
  toggleButton: { flex: 1, paddingVertical: 12, justifyContent: 'center', alignItems: 'center', borderRadius: 12 },
  activeToggle: { backgroundColor: '#4bd3a4', shadowColor: '#4bd3a4', shadowOpacity: 0.2, shadowRadius: 5, elevation: 2 },
  toggleText: { fontSize: 14, fontWeight: 'bold', color: '#888' },
  activeToggleText: { color: '#fff' },
  form: { width: '100%' },
  sectionLabel: { fontSize: 14, fontWeight: 'bold', color: '#555', marginTop: 15, marginBottom: 10, marginLeft: 5 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 15, marginBottom: 12, paddingHorizontal: 15, height: 60, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 5, elevation: 1 },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#333', outlineStyle: 'none' as any }, // Added outlineStyle for cleaner web rendering
  eyeIcon: { padding: 5 },
  primaryButton: { backgroundColor: '#4bd3a4', borderRadius: 15, height: 60, justifyContent: 'center', alignItems: 'center', marginTop: 20, shadowColor: '#4bd3a4', shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  primaryButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  footerText: { color: '#666', fontSize: 15 },
  footerLink: { color: '#4bd3a4', fontSize: 15, fontWeight: 'bold' }
});