import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar, 
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Modal,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Animated, { 
  SlideInLeft, 
  FadeIn, 
  ZoomIn
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Mock data
const airportData = {
  airport_name: "Shillong International Airport",
  flights: [
    { id: "F101", flight_no: "AI701", origin: "Delhi", destination: "Shillong", status: "On Time", scheduled: "08:30", gate: "G4" },
    { id: "F102", flight_no: "SG305", origin: "Kolkata", destination: "Shillong", status: "Delayed", scheduled: "09:15", gate: "G2" },
    { id: "F103", flight_no: "6E205", origin: "Guwahati", destination: "Shillong", status: "Landed", scheduled: "10:00", gate: "G5" },
  ],
  security_alerts: [
    { id: "SA301", level: "High", message: "Unattended baggage at Terminal 1", location: "Check-in Area", time: "07:45", status: "Investigating" },
    { id: "SA302", level: "Medium", message: "Suspicious activity at Gate G2", location: "Departure Lounge", time: "08:30", status: "Monitoring" },
  ],
  airport_analytics: {
    total_flights_today: 45,
    total_passengers_today: 1200,
    alerts_today: 5,
    baggage_uncollected: 8
  }
};

// Color themes
const lightTheme = {
  background: '#F5F5F7',
  card: '#FFFFFF',
  text: '#1E293B',
  textSecondary: '#64748B',
  primary: '#1E40AF',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  border: '#E2E8F0',
};

const darkTheme = {
  background: '#0F172A',
  card: '#1E293B',
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  primary: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  border: '#334155',
};

// Reusable Components
const Card: React.FC<{ children: React.ReactNode; style?: any; isDarkMode: boolean }> = ({ children, style, isDarkMode }) => {
  const theme = isDarkMode ? darkTheme : lightTheme;
  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }, style]}>
      {children}
    </View>
  );
};

const StatusChip: React.FC<{ status: string; isDarkMode: boolean }> = ({ status, isDarkMode }) => {
  const theme = isDarkMode ? darkTheme : lightTheme;
  
  const getStatusColor = () => {
    switch (status) {
      case 'On Time':
      case 'Cleared':
      case 'Approved':
        return theme.success;
      case 'Delayed':
      case 'Pending':
        return theme.warning;
      case 'Investigating':
      case 'Monitoring':
        return theme.danger;
      default:
        return theme.textSecondary;
    }
  };

  return (
    <View style={[styles.statusChip, { backgroundColor: `${getStatusColor()}20`, borderColor: getStatusColor() }]}>
      <Text style={[styles.statusText, { color: getStatusColor() }]}>{status}</Text>
    </View>
  );
};

const MetricCard: React.FC<{ 
  title: string; 
  value: string; 
  icon: string; 
  color: string; 
  isDarkMode: boolean;
}> = ({ title, value, icon, color, isDarkMode }) => {
  const theme = isDarkMode ? darkTheme : lightTheme;
  
  return (
    <View style={styles.metricCard}>
      <Card isDarkMode={isDarkMode}>
        <View style={styles.metricContent}>
          <MaterialIcons name={icon as any} size={24} color={color} />
          <Text style={[styles.metricValue, { color: theme.text }]}>{value}</Text>
          <Text style={[styles.metricTitle, { color: theme.textSecondary }]}>{title}</Text>
        </View>
      </Card>
    </View>
  );
};

// Main App Component
const AirportSafetyDashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [emergencyModalVisible, setEmergencyModalVisible] = useState(false);

  const theme = isDarkMode ? darkTheme : lightTheme;

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const chartConfig = {
    backgroundColor: theme.card,
    backgroundGradientFrom: theme.card,
    backgroundGradientTo: theme.card,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: { borderRadius: 16 },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: theme.primary
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.topBar, { backgroundColor: theme.primary }]}>
        <View>
          <Text style={styles.headerTitle}>Airport Safety Dashboard</Text>
          <Text style={styles.headerSubtitle}>Shillong International Airport</Text>
        </View>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
          <MaterialIcons 
            name={isDarkMode ? "light-mode" : "dark-mode"} 
            size={24} 
            color="#FFFFFF" 
          />
        </TouchableOpacity>
      </View>

      {/* Navigation Tabs */}
      <View style={[styles.tabBar, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        {['Dashboard', 'Flights', 'Passengers', 'Alerts'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && { backgroundColor: `${theme.primary}20` }
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <MaterialIcons
              name={
                tab === 'Dashboard' ? 'dashboard' :
                tab === 'Flights' ? 'flight' :
                tab === 'Passengers' ? 'people' : 'warning'
              }
              size={20}
              color={activeTab === tab ? theme.primary : theme.textSecondary}
            />
            <Text style={[
              styles.tabText,
              { color: activeTab === tab ? theme.primary : theme.textSecondary }
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView 
        style={[styles.container, { backgroundColor: theme.background }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn.duration(800)}>
          {/* Key Metrics */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.metricsRow}>
            <MetricCard
              title="Flights Today"
              value={airportData.airport_analytics.total_flights_today.toString()}
              icon="flight"
              color={theme.primary}
              isDarkMode={isDarkMode}
            />
            <MetricCard
              title="Passengers"
              value={airportData.airport_analytics.total_passengers_today.toString()}
              icon="people"
              color={theme.success}
              isDarkMode={isDarkMode}
            />
            <MetricCard
              title="Active Alerts"
              value={airportData.airport_analytics.alerts_today.toString()}
              icon="warning"
              color={theme.danger}
              isDarkMode={isDarkMode}
            />
            <MetricCard
              title="Uncollected Bags"
              value={airportData.airport_analytics.baggage_uncollected.toString()}
              icon="luggage"
              color={theme.warning}
              isDarkMode={isDarkMode}
            />
          </ScrollView>

          {/* Passenger Flow Chart */}
          <Card isDarkMode={isDarkMode} style={styles.sectionCard}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Passenger Flow</Text>
            <LineChart
              data={{
                labels: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'],
                datasets: [{ data: [120, 450, 280, 380, 290, 180] }]
              }}
              width={width - 48}
              height={200}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </Card>

          {/* Flight Status */}
          <Card isDarkMode={isDarkMode} style={styles.sectionCard}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Flights</Text>
            {airportData.flights.map((flight, index) => (
              <Animated.View key={flight.id} entering={SlideInLeft.duration(500).delay(index * 100)}>
                <View style={styles.flightItem}>
                  <View style={styles.flightInfo}>
                    <Text style={[styles.flightNumber, { color: theme.text }]}>{flight.flight_no}</Text>
                    <Text style={[styles.flightRoute, { color: theme.textSecondary }]}>
                      {flight.origin} → {flight.destination}
                    </Text>
                    <Text style={[styles.flightTime, { color: theme.textSecondary }]}>{flight.scheduled} • Gate {flight.gate}</Text>
                  </View>
                  <StatusChip status={flight.status} isDarkMode={isDarkMode} />
                </View>
              </Animated.View>
            ))}
          </Card>

          {/* Security Alerts */}
          <Card isDarkMode={isDarkMode} style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Security Alerts</Text>
              <TouchableOpacity 
                style={[styles.emergencyButton, { backgroundColor: theme.danger }]}
                onPress={() => setEmergencyModalVisible(true)}
              >
                <MaterialIcons name="emergency" size={16} color="#FFFFFF" />
                <Text style={styles.emergencyText}>Emergency</Text>
              </TouchableOpacity>
            </View>
            
            {airportData.security_alerts.map((alert, index) => (
              <Animated.View key={alert.id} entering={ZoomIn.duration(500).delay(index * 150)}>
                <View style={[
                  styles.alertItem,
                  { backgroundColor: theme.background },
                  alert.level === 'High' ? { borderLeftColor: theme.danger } :
                  alert.level === 'Medium' ? { borderLeftColor: theme.warning } :
                  { borderLeftColor: theme.success }
                ]}>
                  <MaterialIcons 
                    name="warning" 
                    size={20} 
                    color={alert.level === 'High' ? theme.danger : 
                          alert.level === 'Medium' ? theme.warning : theme.success} 
                  />
                  <View style={styles.alertContent}>
                    <Text style={[styles.alertMessage, { color: theme.text }]}>{alert.message}</Text>
                    <Text style={[styles.alertDetails, { color: theme.textSecondary }]}>
                      {alert.location} • {alert.time}
                    </Text>
                  </View>
                  <StatusChip status={alert.status} isDarkMode={isDarkMode} />
                </View>
              </Animated.View>
            ))}
          </Card>
        </Animated.View>
      </ScrollView>

      {/* Emergency Modal */}
      <Modal
        visible={emergencyModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEmergencyModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.emergencyModal, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Emergency Response</Text>
            <Text style={[styles.modalText, { color: theme.textSecondary }]}>
              Select emergency service to alert:
            </Text>
            
            <TouchableOpacity style={[styles.emergencyOption, { backgroundColor: '#DC2626' }]}>
              <MaterialIcons name="local-fire-department" size={24} color="#FFFFFF" />
              <Text style={styles.emergencyOptionText}>Fire Department</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.emergencyOption, { backgroundColor: '#2563EB' }]}>
              <MaterialIcons name="local-police" size={24} color="#FFFFFF" />
              <Text style={styles.emergencyOptionText}>Police</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.emergencyOption, { backgroundColor: '#059669' }]}>
              <MaterialIcons name="local-hospital" size={24} color="#FFFFFF" />
              <Text style={styles.emergencyOptionText}>Medical</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.cancelButton, { borderColor: theme.border }]}
              onPress={() => setEmergencyModalVisible(false)}
            >
              <Text style={[styles.cancelButtonText, { color: theme.text }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  themeButton: {
    padding: 8,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricsRow: {
    marginBottom: 8,
  },
  metricCard: {
    width: 140,
    marginRight: 12,
  },
  metricContent: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  metricTitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  sectionCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  emergencyText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  chart: {
    borderRadius: 16,
  },
  flightItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  flightInfo: {
    flex: 1,
  },
  flightNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  flightRoute: {
    fontSize: 14,
    marginTop: 2,
  },
  flightTime: {
    fontSize: 12,
    marginTop: 4,
  },
  statusChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
  },
  alertContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  alertMessage: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  alertDetails: {
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyModal: {
    margin: 20,
    borderRadius: 12,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    marginBottom: 20,
  },
  emergencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  emergencyOptionText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  cancelButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    fontWeight: '500',
  },
});

export default AirportSafetyDashboard;
