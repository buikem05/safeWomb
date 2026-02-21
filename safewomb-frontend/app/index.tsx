import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Modal, Dimensions, TextInput, Image } from 'react-native'; // <-- Added Image here!
import { Ionicons } from '@expo/vector-icons';
import ConfettiCannon from 'react-native-confetti-cannon';
import { LineChart, ProgressChart } from 'react-native-chart-kit';
import { useRouter, useGlobalSearchParams } from 'expo-router';

export default function SafeWombDashboard() {
  const router = useRouter();
  const params = useGlobalSearchParams(); 

  // --- APP STATE ---
  const [isChildMode, setIsChildMode] = useState(false);
  const [showBirthModal, setShowBirthModal] = useState(false);
  
  const [userName, setUserName] = useState("Mother"); 
  const [babyName, setBabyName] = useState("Baby"); 

  const [dueDate, setDueDate] = useState("2026-10-31"); 
  const [overrideWeek, setOverrideWeek] = useState<number | null>(null); 
  const [showDateModal, setShowDateModal] = useState(false);
  const [tempDate, setTempDate] = useState("");

  const [vitDDrops, setVitDDrops] = useState(true);
  const [teethingGel, setTeethingGel] = useState(false);

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth > 768 ? screenWidth - 380 : Math.max(screenWidth - 80, 250);

  useEffect(() => {
    if (params.userName) setUserName(String(params.userName));
    if (params.userWeek) setOverrideWeek(parseInt(String(params.userWeek)));

    if (params.mode === 'child') {
      setIsChildMode(true);
      setShowBirthModal(false);
      if (params.name) setBabyName(String(params.name)); 
    } else if (params.mode === 'pregnancy') {
      setIsChildMode(false);
      if (params.dueDate) setDueDate(String(params.dueDate));
    }
  }, [params]); 

  // --- FUNCTIONS ---
  const handleToggle = (value: boolean) => {
    if (value) {
      setShowBirthModal(true);
    } else {
      setIsChildMode(false);
    }
  };

  const confirmBirth = () => {
    setShowBirthModal(false);
    router.push('/baby-setup'); 
  };

  const calculatePregnancyWeek = (dueDateString: string) => {
    const due = new Date(dueDateString);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weeksLeft = Math.floor(diffDays / 7);
    let calculatedWeek = 40 - weeksLeft;

    if (calculatedWeek < 1) return 1;
    if (calculatedWeek > 42) return 42;
    return calculatedWeek;
  };

  const getTimelineData = (week: number) => {
    if (week < 14) return { size: "a Lime", desc: "First Trimester! Baby's tiny organs are forming fast." };
    if (week < 23) return { size: "a Banana", desc: "Second Trimester! You might start feeling little flutters." };
    if (week < 30) return { size: "an Eggplant", desc: "Baby is growing rapidly! Time to plan the nursery." };
    if (week < 38) return { size: "a Butternut Squash", desc: "Third Trimester! Baby is practicing breathing." };
    return { size: "a Watermelon", desc: "Almost there! Your body is preparing for the big day." };
  };

  // 📍 NEW: DYNAMIC IMAGE SELECTOR (Every 4 weeks)
  const getBabyImage = (week: number) => {
    // These are placeholders. When you have real images, you will replace these lines like this:
    // if (week <= 4) return require('../assets/images/week-4.png');
    
    if (week <= 4) return require('../assets/images/image_4_weeks-removebg-preview.png');
    if (week <= 8) return require('../assets/images/image_8_weeks-removebg-preview.png');
    if (week <= 12) return require('../assets/images/image_12_weeks-removebg-preview.png');
    if (week <= 16) return require('../assets/images/image_16-removebg-preview.png')
    if (week <= 24) return require('../assets/images/image_20-removebg-preview.png' );
    if (week <= 28) return require('../assets/images/image_24-removebg-preview.png' );
    if (week <= 32) return require('../assets/images/image_28-removebg-preview.png' );
    if (week <= 36) return require('../assets/images/image_32-removebg-preview.png' );
    return require('../assets/images/image_36-removebg-preview.png' );
  };

  const saveNewDate = () => {
    if(tempDate.length === 10) {
      setDueDate(tempDate);
      setOverrideWeek(null); 
    }
    setShowDateModal(false);
  };

  let currentWeek = calculatePregnancyWeek(dueDate);
  if (overrideWeek !== null && !isNaN(overrideWeek)) {
    currentWeek = overrideWeek;
  }
  
  const timelineInfo = getTimelineData(currentWeek);
  const progressFraction = Math.min(currentWeek / 40, 1); 

  // --- CHART DATA ---
  const growthData = {
    labels: ['Birth', '1m', '2m', '3m', '4m', '5m', '6m'],
    datasets: [
      { data: [3.2, 4.5, 5.4, 6.2, 6.8, 7.3, 7.8], color: (opacity = 1) => `rgba(75, 211, 164, ${opacity})`, strokeWidth: 3 },
      { data: [2.5, 3.0, 3.8, 4.2, 5.0, 5.8, 6.5], color: (opacity = 1) => `rgba(163, 184, 153, ${opacity})`, strokeWidth: 2 }
    ],
    legend: ['Weight (kg)', 'Length (scaled)']
  };

  const chartConfig = {
    backgroundColor: '#ffffff', backgroundGradientFrom: '#ffffff', backgroundGradientTo: '#ffffff',
    decimalPlaces: 1, color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
    propsForDots: { r: '5', strokeWidth: '2', stroke: '#fff' }, propsForBackgroundLines: { strokeDasharray: '' },
  };

  return (
    <View style={styles.container}>
      <Modal visible={showBirthModal} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {showBirthModal && <ConfettiCannon count={200} origin={{ x: 150, y: -20 }} fallSpeed={2500} fadeOut={true} />}
            <Ionicons name="heart-circle" size={80} color="#d49a9a" />
            <Text style={styles.modalTitle}>Birth Confirmed!</Text>
            <Text style={styles.modalText}>Welcome to the next beautiful chapter of your journey. Let's set up your baby's dashboard.</Text>
            <TouchableOpacity style={styles.modalButton} onPress={confirmBirth}>
              <Text style={styles.modalButtonText}>Enter Child Mode</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showDateModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, {width: 300, padding: 20}]}>
            <Text style={styles.modalTitle}>Estimated Due Date</Text>
            <Text style={[styles.modalText, {marginBottom: 10}]}>Format: YYYY-MM-DD</Text>
            <TextInput style={styles.dateInput} placeholder="e.g., 2026-10-31" value={tempDate} onChangeText={setTempDate} />
            <TouchableOpacity style={[styles.modalButton, {marginTop: 15}]} onPress={saveNewDate}>
              <Text style={styles.modalButtonText}>Update Timeline</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.sidebar}>
        <View style={styles.logoContainer}>
          <Ionicons name="leaf" size={28} color="#4bd3a4" />
          <Text style={styles.logoText}>safewomb</Text>
        </View>
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/appointments')}>
          <Ionicons name="calendar-outline" size={20} color="#555" />
          <Text style={styles.menuText}>Doctor Appointments</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/appointments')}>
          <Ionicons name="medical-outline" size={20} color="#555" />
          <Text style={styles.menuText}>Vaccinations</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/journal')}>
          <Ionicons name="journal-outline" size={20} color="#555" />
          <Text style={styles.menuText}>Journal Logs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuItem, { marginTop: 'auto', borderBottomWidth: 0 }]} onPress={() => router.replace('/login')}>
          <Ionicons name="log-out-outline" size={20} color="#ff5252" />
          <Text style={[styles.menuText, { color: '#ff5252' }]}>Log Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.header}>
          <Ionicons name="menu" size={28} color="#333" />
          <View style={styles.headerRight}>
            <Text style={styles.profileName}>{userName}</Text>
            <View style={styles.profileAvatar}>
              <Ionicons name="person" size={16} color="#fff" />
            </View>
            <Switch trackColor={{ false: '#e0e0e0', true: '#4bd3a4' }} thumbColor={'#fff'} onValueChange={handleToggle} value={isChildMode} style={{ marginLeft: 15 }} />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {!isChildMode ? (
            <View>
              <Text style={styles.pageTitle}>Pregnancy Overview</Text>
              
              <View style={[styles.card, { flex: 2, marginRight: 15, backgroundColor: '#eef8f5', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                  
                  {/* Left Side: Text */}
                  <View style={{ flex: 1 }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={styles.cardTitle}>Week {currentWeek}</Text>
                      <TouchableOpacity onPress={() => setShowDateModal(true)} style={{marginLeft: 10}}>
                        <Ionicons name="pencil" size={16} color="#888" />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.cardSubtitle}>Your baby is the size of {timelineInfo.size}!</Text>
                  </View>
                  
                  {/* Right Side: Image at the edge */}
                  <View style={styles.imageContainer}>
                    <Image 
                      source={getBabyImage(currentWeek)} 
                      style={styles.babyImage} 
                      resizeMode="contain"
                    />
                  </View>

                
                
                <View style={[styles.card, { flex: 1 }]}>
                  <Text style={styles.cardTitle}>Stats</Text>
                  <View style={styles.ringContainer}>
                    <ProgressChart
                      data={{ data: [progressFraction] }}
                      width={100}
                      height={100}
                      strokeWidth={12}
                      radius={38}
                      chartConfig={{
                        backgroundGradientFrom: '#ffffff',
                        backgroundGradientTo: '#ffffff',
                        color: (opacity = 1) => `rgba(75, 211, 164, ${opacity})`,
                      }}
                      hideLegend={true}
                    />
                    <View style={styles.ringTextContainer}>
                      <Text style={styles.ringNumber}>{currentWeek}</Text>
                      <Text style={styles.ringLabel}>Weeks</Text>
                    </View>
                  </View>
                </View>
              </View>

              <Text style={styles.sectionTitle}>What to Expect</Text>
              <View style={styles.topRow}>
                <View style={[styles.card, { flex: 1, marginRight: 15, backgroundColor: '#ffe9d6', padding: 20 }]}>
                   <Text style={[styles.cardTitle, {fontSize: 16}]}>This Week</Text>
                   <Text style={[styles.cardSubtitle, {marginTop: 10}]}>{timelineInfo.desc}</Text>
                </View>
                <View style={[styles.card, { flex: 1, backgroundColor: '#d6f0ff' }]} />
              </View>

              <Text style={styles.sectionTitle}>Journal</Text>
              <View style={styles.journalCard}>
                <Text style={styles.cardTitle}>Log Your Symptoms</Text>
                <Text style={styles.cardSubtitle}>Record cravings, mood, or physical changes.</Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/new-entry')}>
                    <Ionicons name="mic" size={24} color="#fff" />
                    <Text style={styles.buttonText}>Voice Log</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={() => router.push('/new-entry')}>
                    <Ionicons name="pencil" size={24} color="#7a9070" />
                    <Text style={[styles.buttonText, {color: '#7a9070'}]}>Type Log</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
            </View>
          ) : (
            <View>
              <Text style={styles.pageTitle}>Child Mode</Text>
              <View style={styles.topRow}>
                <View style={[styles.card, { flex: 1, marginRight: 15, alignItems: 'center' }]}>
                  <View style={styles.babyAvatar} />
                  <Text style={styles.cardTitle}>{babyName}'s Growth</Text>
                  <Text style={styles.childStatNumber}>24</Text>
                  <Text style={styles.childStatLabel}>Weeks old</Text>
                </View>
                <View style={[styles.card, { flex: 2 }]}>
                  <Text style={styles.cardTitle}>Medicine Reminders</Text>
                  <View style={styles.reminderRow}>
                    <Text>Vitamin D Drops</Text>
                    <Switch value={vitDDrops} onValueChange={setVitDDrops} trackColor={{ false: '#e0e0e0', true: '#4bd3a4' }} />
                  </View>
                  <View style={styles.reminderRow}>
                    <Text>Teething Gel</Text>
                    <Switch value={teethingGel} onValueChange={setTeethingGel} trackColor={{ false: '#e0e0e0', true: '#4bd3a4' }} />
                  </View>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Nutrition Guides</Text>
              <View style={styles.topRow}>
                <View style={[styles.card, { flex: 1, marginRight: 15, backgroundColor: '#fff9c4', alignItems: 'center', justifyContent: 'center' }]}>
                  <Text style={styles.cardTitle}>Strong Bones</Text>
                  <Ionicons name="nutrition" size={45} color="#fbc02d" style={{marginTop: 5, marginBottom: 5}}/>
                  <TouchableOpacity onPress={() => router.push('/nutrition')} style={styles.nutritionButton}>
                    <Text style={styles.nutritionButtonText}>View Guide</Text>
                  </TouchableOpacity>
                </View>

                <View style={[styles.card, { flex: 1, backgroundColor: '#e3f2fd', alignItems: 'center', justifyContent: 'center' }]}>
                  <Text style={styles.cardTitle}>Sharp Brain</Text>
                  <Ionicons name="bulb" size={45} color="#1e88e5" style={{marginTop: 5, marginBottom: 5}}/>
                  <TouchableOpacity onPress={() => router.push('/nutrition')} style={styles.nutritionButton}>
                    <Text style={styles.nutritionButtonText}>View Guide</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.sectionTitle}>{babyName}'s Growth Chart (6 Months)</Text>
              <View style={styles.chartCard}>
                <LineChart data={growthData} width={chartWidth} height={220} chartConfig={chartConfig} bezier style={{ borderRadius: 15, paddingVertical: 10 }} />
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', backgroundColor: '#f4f7f6' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { width: 320, backgroundColor: '#fff', padding: 30, borderRadius: 25, alignItems: 'center', shadowColor: '#000', shadowOffset: {width: 0, height: 10}, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginTop: 15, marginBottom: 10 },
  modalText: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 25, lineHeight: 20 },
  modalButton: { backgroundColor: '#4bd3a4', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 30, width: '100%', alignItems: 'center' },
  modalButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  dateInput: { backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#eee', padding: 15, borderRadius: 12, fontSize: 16, width: '100%', textAlign: 'center' },
  sidebar: { width: 260, backgroundColor: '#fff', padding: 20, borderRightWidth: 1, borderColor: '#eee' },
  logoContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 40 },
  logoText: { fontSize: 24, fontWeight: 'bold', color: '#333', marginLeft: 10 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  menuText: { fontSize: 16, color: '#555', marginLeft: 15 },
  mainContent: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  profileName: { fontSize: 16, color: '#333', marginRight: 10 },
  profileAvatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 30 },
  pageTitle: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginTop: 30, marginBottom: 15 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between' },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 10, elevation: 2, height: 180 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', textAlign: 'center' },
  cardSubtitle: { fontSize: 14, color: '#666', marginTop: 5 },
  
  // 📍 NEW IMAGE STYLES
 // 📍 UPDATED: Increased size to beautifully fill the card's height
  imageContainer: { 
    height: 140, 
    width: 140, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginLeft: 10 
  },
  babyImage: { width: '100%', height: '100%' },

  babyAvatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#e0e0e0', marginBottom: 10 },
  ringContainer: { width: 100, height: 100, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 15 },
  ringTextContainer: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
  ringNumber: { fontSize: 26, fontWeight: 'bold', color: '#4bd3a4' },
  ringLabel: { fontSize: 12, color: '#888', marginTop: -2 },
  childStatNumber: { fontSize: 24, fontWeight: 'bold', color: '#4bd3a4' },
  childStatLabel: { fontSize: 12, color: '#888' },
  reminderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  chartCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginTop: 15, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 10, elevation: 2, alignItems: 'center' },
  journalCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 10, elevation: 2, marginTop: 5 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  actionButton: { flex: 1, backgroundColor: '#4bd3a4', padding: 15, borderRadius: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginRight: 5 },
  secondaryButton: { backgroundColor: '#eef8f5', marginLeft: 5, marginRight: 0 },
  buttonText: { color: '#fff', fontWeight: 'bold', marginLeft: 8 },
  nutritionButton: { backgroundColor: 'rgba(255,255,255,0.7)', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 15, marginTop: 10 },
  nutritionButtonText: { color: '#333', fontWeight: 'bold', fontSize: 14 }
});