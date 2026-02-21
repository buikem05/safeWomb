import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function InfantDashboard() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.weekText}>Welcome, Baby!</Text>
        <Text style={styles.subText}>Month 1 Milestones</Text>
      </View>

      {/* Vaccination Schedule */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="medical" size={24} color="#a3b899" />
          <Text style={styles.cardTitle}>Upcoming Vaccinations</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.itemText}>Hepatitis B (Dose 2)</Text>
          <Text style={styles.dateText}>In 2 weeks</Text>
        </View>
      </View>

      {/* Feeding Guide */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="nutrition" size={24} color="#a3b899" />
          <Text style={styles.cardTitle}>Smart Feeding Guide</Text>
        </View>
        <Text style={styles.cardDesc}>Focus: Brain Development & Strong Bones</Text>
        <View style={styles.listItem}>
          <Text style={styles.itemText}>Exclusive Breastfeeding</Text>
          <Text style={styles.dateText}>Every 2-3 hours</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.itemText}>Vitamin D Drops</Text>
          <Text style={styles.dateText}>Daily</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f4' },
  header: { padding: 30, alignItems: 'center', backgroundColor: '#a3b899', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  weekText: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  subText: { fontSize: 16, color: '#eef2ee', marginTop: 5 },
  card: { backgroundColor: '#fff', margin: 20, padding: 20, borderRadius: 15, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginLeft: 10 },
  cardDesc: { color: '#666', marginBottom: 15, fontStyle: 'italic' },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  itemText: { fontSize: 16, color: '#444' },
  dateText: { fontSize: 14, color: '#a3b899', fontWeight: 'bold' }
});