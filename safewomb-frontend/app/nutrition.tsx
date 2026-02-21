import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function NutritionGuide() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nutrition Guide</Text>
        <View style={{ width: 24 }} /> {/* Spacer to center the title */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Hero Banner */}
        <View style={styles.heroCard}>
           <Ionicons name="restaurant" size={45} color="#4bd3a4" />
           <Text style={styles.heroTitle}>6 Months: Starting Solids</Text>
           <Text style={styles.heroDesc}>It is time to introduce exciting new textures and flavors to support your baby's rapid growth!</Text>
        </View>

        {/* Sharp Brains Section */}
        <Text style={styles.sectionTitle}>Sharp Brains 🧠</Text>
        <View style={styles.foodCard}>
            <View style={[styles.iconBox, { backgroundColor: '#e3f2fd' }]}>
                <Ionicons name="bulb" size={24} color="#1e88e5" />
            </View>
            <View style={styles.foodInfo}>
                <Text style={styles.foodName}>Avocado Puree</Text>
                <Text style={styles.foodBenefit}>Rich in healthy fats to rapidly build neural pathways.</Text>
            </View>
        </View>
        <View style={styles.foodCard}>
            <View style={[styles.iconBox, { backgroundColor: '#e3f2fd' }]}>
                <Ionicons name="fish" size={24} color="#1e88e5" />
            </View>
            <View style={styles.foodInfo}>
                <Text style={styles.foodName}>Mashed Salmon</Text>
                <Text style={styles.foodBenefit}>Packed with Omega-3 DHA for cognitive development.</Text>
            </View>
        </View>

        {/* Strong Bones Section */}
        <Text style={styles.sectionTitle}>Strong Bones 🦴</Text>
        <View style={styles.foodCard}>
            <View style={[styles.iconBox, { backgroundColor: '#fff9c4' }]}>
                <Ionicons name="nutrition" size={24} color="#fbc02d" />
            </View>
            <View style={styles.foodInfo}>
                <Text style={styles.foodName}>Iron-Fortified Oatmeal</Text>
                <Text style={styles.foodBenefit}>Essential iron and calcium for growing skeletons.</Text>
            </View>
        </View>

         {/* Sample Recipe Card */}
         <Text style={styles.sectionTitle}>Featured Recipe</Text>
         <View style={styles.recipeCard}>
            <Text style={styles.recipeTitle}>Sweet Potato & Apple Mash</Text>
            <Text style={styles.recipeTime}>⏱ 15 mins  •  👶 6+ months</Text>
            
            <View style={styles.recipeStepContainer}>
                <Text style={styles.recipeStepNumber}>1</Text>
                <Text style={styles.recipeStepText}>Peel and cube 1 small sweet potato and half an apple. Steam until very soft.</Text>
            </View>
            <View style={styles.recipeStepContainer}>
                <Text style={styles.recipeStepNumber}>2</Text>
                <Text style={styles.recipeStepText}>Mash together with a fork or blend until smooth.</Text>
            </View>
            <View style={styles.recipeStepContainer}>
                <Text style={styles.recipeStepNumber}>3</Text>
                <Text style={styles.recipeStepText}>Add a splash of breastmilk or formula to reach the perfect consistency!</Text>
            </View>
         </View>

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
  
  heroCard: { backgroundColor: '#eef8f5', borderRadius: 20, padding: 25, alignItems: 'center', marginBottom: 25, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 },
  heroTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginTop: 15, marginBottom: 8, textAlign: 'center' },
  heroDesc: { fontSize: 15, color: '#666', textAlign: 'center', lineHeight: 22 },

  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 15, marginTop: 10 },
  
  foodCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 15, padding: 15, marginBottom: 12, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 8, elevation: 1 },
  iconBox: { width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  foodInfo: { flex: 1 },
  foodName: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  foodBenefit: { fontSize: 13, color: '#666', lineHeight: 18 },

  recipeCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginTop: 5, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 12, elevation: 3, borderWidth: 1, borderColor: '#f0f0f0' },
  recipeTitle: { fontSize: 18, fontWeight: 'bold', color: '#4bd3a4', marginBottom: 5 },
  recipeTime: { fontSize: 13, color: '#888', fontWeight: '600', marginBottom: 20 },
  
  recipeStepContainer: { flexDirection: 'row', marginBottom: 15, paddingRight: 20 },
  recipeStepNumber: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#eef8f5', color: '#4bd3a4', textAlign: 'center', fontWeight: 'bold', lineHeight: 24, marginRight: 12, overflow: 'hidden' },
  recipeStepText: { fontSize: 15, color: '#555', lineHeight: 22, flex: 1 },
});