import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AppointmentsScreen() {
  const router = useRouter();
  
  // State to toggle between tabs
  const [activeTab, setActiveTab] = useState<'doctor' | 'vaccine'>('doctor');

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Schedule</Text>
        <View style={{ width: 24 }} /> {/* Spacer for centering */}
      </View>

      {/* Tab Toggle */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'doctor' && styles.activeTab]}
          onPress={() => setActiveTab('doctor')}
        >
          <Ionicons name="calendar" size={18} color={activeTab === 'doctor' ? '#fff' : '#888'} />
          <Text style={[styles.tabText, activeTab === 'doctor' && styles.activeTabText]}>
            Doctor Visits
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'vaccine' && styles.activeTab]}
          onPress={() => setActiveTab('vaccine')}
        >
          <Ionicons name="medical" size={18} color={activeTab === 'vaccine' ? '#fff' : '#888'} />
          <Text style={[styles.tabText, activeTab === 'vaccine' && styles.activeTabText]}>
            Vaccinations
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {activeTab === 'doctor' ? (
          /* --- DOCTOR APPOINTMENTS LIST --- */
          <View>
            <Text style={styles.sectionHeader}>Upcoming</Text>
            
            <View style={styles.card}>
              <View style={styles.dateBadge}>
                <Text style={styles.dateMonth}>AUG</Text>
                <Text style={styles.dateDay}>14</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Prenatal Checkup</Text>
                <Text style={styles.cardSubtitle}>Dr. Eleanor Vance • 10:00 AM</Text>
                <Text style={styles.cardDetail}>City Hospital, Room 205</Text>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.dateBadge}>
                <Text style={styles.dateMonth}>SEP</Text>
                <Text style={styles.dateDay}>02</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>3rd Trimester Ultrasound</Text>
                <Text style={styles.cardSubtitle}>Dr. Patel • 2:30 PM</Text>
                <Text style={styles.cardDetail}>Women's Imaging Center</Text>
              </View>
            </View>
          </View>

        ) : (
          /* --- VACCINATIONS LIST --- */
          <View>
            <Text style={styles.sectionHeader}>Baby's Schedule</Text>
            
            <View style={[styles.card, styles.vaccineCard]}>
              <View style={styles.iconBadge}>
                <Ionicons name="shield-checkmark" size={24} color="#4bd3a4" />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Hepatitis B (Dose 1)</Text>
                <Text style={styles.cardSubtitle}>Recommended at Birth</Text>
                <View style={styles.statusCompleted}>
                  <Text style={styles.statusTextCompleted}>Completed</Text>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <View style={[styles.iconBadge, {backgroundColor: '#ffe9d6'}]}>
                <Ionicons name="shield" size={24} color="#ff9800" />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Polio (IPV) & DTaP</Text>
                <Text style={styles.cardSubtitle}>Due at 2 Months</Text>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>Book Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

      </ScrollView>

      {/* Floating Action Button to Add New */}
      {activeTab === 'doctor' && (
        <TouchableOpacity style={styles.fab}>
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f6' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#fff', paddingTop: 40 },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  
  tabContainer: { flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: 20, paddingBottom: 15, borderBottomWidth: 1, borderColor: '#eee' },
  tab: { flex: 1, flexDirection: 'row', paddingVertical: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 25, marginHorizontal: 5 },
  activeTab: { backgroundColor: '#4bd3a4' },
  tabText: { fontSize: 15, fontWeight: '600', color: '#888', marginLeft: 8 },
  activeTabText: { color: '#fff' },

  scrollContent: { padding: 20, paddingBottom: 100 }, // Extra padding for the FAB
  sectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#555', marginBottom: 15, marginTop: 10 },
  
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 15, padding: 15, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 10, elevation: 2, alignItems: 'center' },
  vaccineCard: { opacity: 0.8 }, // Slightly faded for completed ones
  
  dateBadge: { backgroundColor: '#eef8f5', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 15, alignItems: 'center', justifyContent: 'center', marginRight: 15, height: 65, width: 65 },
  dateMonth: { fontSize: 12, fontWeight: 'bold', color: '#4bd3a4', textTransform: 'uppercase' },
  dateDay: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  
  iconBadge: { backgroundColor: '#eef8f5', borderRadius: 12, height: 60, width: 60, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  cardSubtitle: { fontSize: 14, color: '#666', marginBottom: 4 },
  cardDetail: { fontSize: 13, color: '#999' },
  
  statusCompleted: { backgroundColor: '#eef8f5', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 10, alignSelf: 'flex-start', marginTop: 5 },
  statusTextCompleted: { color: '#4bd3a4', fontSize: 12, fontWeight: 'bold' },
  
  actionButton: { backgroundColor: '#fff9c4', paddingVertical: 6, paddingHorizontal: 15, borderRadius: 15, alignSelf: 'flex-start', marginTop: 5, borderWidth: 1, borderColor: '#fbc02d' },
  actionButtonText: { color: '#f57f17', fontSize: 12, fontWeight: 'bold' },

  fab: { position: 'absolute', bottom: 30, right: 30, width: 60, height: 60, borderRadius: 30, backgroundColor: '#4bd3a4', justifyContent: 'center', alignItems: 'center', shadowColor: '#4bd3a4', shadowOpacity: 0.4, shadowRadius: 10, elevation: 5 },
});