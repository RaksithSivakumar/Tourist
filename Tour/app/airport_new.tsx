import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet,
  Dimensions,
  TextInput,
  SafeAreaView,
  FlatList 
} from 'react-native';
import { LineChart, PieChart, BarChart } from 'react-native-chart-kit';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Types
interface Flight {
  id: string;
  number: string;
  destination: string;
  departure: string;
  status: 'On Time' | 'Delayed' | 'Boarding' | 'Check-in';
  gate: string;
  aircraft: string;
}

interface Alert {
  id: string;
  type: string;
  severity: 'high' | 'medium' | 'low';
  message: string;
  location: string;
  time: string;
}

interface Passenger {
  id: string;
  name: string;
  flight: string;
  status: string;
  seat: string;
  checkedBags: number;
}

// Mock data
const mockFlights: Flight[] = [
  { id: '1', number: 'AA123', destination: 'New York', departure: '14:30', status: 'On Time', gate: 'A12', aircraft: 'Boeing 777' },
  { id: '2', number: 'BA456', destination: 'London', departure: '16:45', status: 'Delayed', gate: 'B05', aircraft: 'Airbus A380' },
  { id: '3', number: 'DL789', destination: 'Los Angeles', departure: '18:20', status: 'Boarding', gate: 'C08', aircraft: 'Boeing 737' },
];

const mockAlerts: Alert[] = [
  { id: '1', type: 'Security', severity: 'high', message: 'Unattended baggage detected', location: 'Terminal A, Gate 15', time: '10 min ago' },
  { id: '2', type: 'Medical', severity: 'medium', message: 'Medical assistance requested', location: 'Terminal B, Food Court', time: '25 min ago' },
];

const mockPassengers: Passenger[] = [
  { id: '1', name: 'John Smith', flight: 'AA123', status: 'Checked In', seat: '12A', checkedBags: 2 },
  { id: '2', name: 'Sarah Johnson', flight: 'BA456', status: 'Boarding', seat: '8C', checkedBags: 1 },
];

// Color schemes
const colors = {
  primary: '#3B82F6',
  secondary: '#6B7280',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  background: '#F9FAFB',
  white: '#FFFFFF',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
};

const darkColors = {
  primary: '#3B82F6',
  secondary: '#9CA3AF',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  background: '#111827',
  white: '#1F2937',
  textPrimary: '#F9FAFB',
  textSecondary: '#9CA3AF',
  border: '#374151',
};

// Reusable Components
const StatsCard: React.FC<{
  title: string;
  value: string;
  icon: string;
  color: string;
  trend?: string;
  onPress?: () => void;
  darkMode?: boolean;
}> = ({ title, value, icon, color, trend, onPress, darkMode = false }) => {
  const currentColors = darkMode ? darkColors : colors;
  
  return (
    <TouchableOpacity style={[styles.statsCard, { backgroundColor: currentColors.white }]} onPress={onPress}>
      <View style={styles.statsCardContent}>
        <View style={styles.statsHeader}>
          <MaterialIcons name={icon as any} size={24} color={color} />
          {trend && (
            <View style={styles.trendContainer}>
              <MaterialIcons name="trending-up" size={12} color={colors.success} />
              <Text style={[styles.trendText, { color: colors.success }]}>{trend}</Text>
            </View>
          )}
        </View>
        <Text style={[styles.statsValue, { color: currentColors.textPrimary }]}>{value}</Text>
        <Text style={[styles.statsTitle, { color: currentColors.textSecondary }]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const FlightCard: React.FC<{
  flight: Flight;
  onPress?: () => void;
  darkMode?: boolean;
}> = ({ flight, onPress, darkMode = false }) => {
  const currentColors = darkMode ? darkColors : colors;
  
  const getStatusColor = (status: Flight['status']) => {
    switch (status) {
      case 'On Time': return colors.success;
      case 'Delayed': return colors.danger;
      case 'Boarding': return colors.warning;
      case 'Check-in': return colors.primary;
      default: return colors.secondary;
    }
  };

  return (
    <TouchableOpacity style={[styles.flightCard, { backgroundColor: currentColors.white, borderColor: currentColors.border }]} onPress={onPress}>
      <View style={styles.flightHeader}>
        <View>
          <Text style={[styles.flightNumber, { color: currentColors.textPrimary }]}>{flight.number}</Text>
          <Text style={[styles.flightDestination, { color: currentColors.textSecondary }]}>{flight.destination}</Text>
        </View>
        <View style={styles.flightInfo}>
          <Text style={[styles.flightTime, { color: currentColors.textSecondary }]}>{flight.departure}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(flight.status) }]}>
            <Text style={styles.statusText}>{flight.status}</Text>
          </View>
        </View>
      </View>
      <View style={styles.flightDetails}>
        <View style={styles.flightDetail}>
          <MaterialIcons name="flight" size={16} color={currentColors.textSecondary} />
          <Text style={[styles.flightDetailText, { color: currentColors.textSecondary }]}>Gate {flight.gate}</Text>
        </View>
        <View style={styles.flightDetail}>
          <MaterialIcons name="airplanemode-active" size={16} color={currentColors.textSecondary} />
          <Text style={[styles.flightDetailText, { color: currentColors.textSecondary }]}>{flight.aircraft}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const AlertCard: React.FC<{
  alert: Alert;
  onPress?: () => void;
  darkMode?: boolean;
}> = ({ alert, onPress, darkMode = false }) => {
  const currentColors = darkMode ? darkColors : colors;
  
  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'high': return colors.danger;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
      default: return colors.secondary;
    }
  };

  return (
    <TouchableOpacity style={[styles.alertCard, { backgroundColor: currentColors.white, borderColor: currentColors.border }]} onPress={onPress}>
      <View style={styles.alertHeader}>
        <View style={styles.alertIconContainer}>
          <MaterialIcons 
            name="warning" 
            size={20} 
            color={getSeverityColor(alert.severity)} 
          />
        </View>
        <View style={styles.alertContent}>
          <View style={styles.alertTopRow}>
            <Text style={[styles.alertType, { color: currentColors.textSecondary }]}>{alert.type}</Text>
            <Text style={[styles.alertTime, { color: currentColors.textSecondary }]}>{alert.time}</Text>
          </View>
          <Text style={[styles.alertMessage, { color: currentColors.textPrimary }]}>{alert.message}</Text>
          <View style={styles.alertLocation}>
            <MaterialIcons name="location-on" size={12} color={currentColors.textSecondary} />
            <Text style={[styles.alertLocationText, { color: currentColors.textSecondary }]}>{alert.location}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Main Dashboard Component
const Dashboard: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  const currentColors = darkMode ? darkColors : colors;
  
  const chartConfig = {
    backgroundColor: currentColors.white,
    backgroundGradientFrom: currentColors.white,
    backgroundGradientTo: currentColors.white,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: currentColors.primary
    }
  };

  const flightData = {
    labels: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'],
    datasets: [{
      data: [45, 62, 78, 85, 92, 67],
      color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
      strokeWidth: 2
    }]
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: currentColors.background }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: currentColors.textPrimary }]}>
          Airport Safety Dashboard
        </Text>
        <TouchableOpacity style={styles.notificationButton}>
          <MaterialIcons name="notifications" size={24} color={currentColors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatsCard
          title="Active Flights"
          value="147"
          icon="flight"
          color={colors.primary}
          trend="+12%"
          darkMode={darkMode}
        />
        <StatsCard
          title="Passengers"
          value="2,847"
          icon="people"
          color={colors.success}
          trend="+8%"
          darkMode={darkMode}
        />
        <StatsCard
          title="Active Alerts"
          value="3"
          icon="warning"
          color={colors.danger}
          darkMode={darkMode}
        />
        <StatsCard
          title="Security Score"
          value="94%"
          icon="security"
          color={colors.warning}
          darkMode={darkMode}
        />
      </View>

      {/* Flight Traffic Chart */}
      <View style={[styles.chartCard, { backgroundColor: currentColors.white }]}>
        <Text style={[styles.chartTitle, { color: currentColors.textPrimary }]}>
          Flight Traffic Today
        </Text>
        <LineChart
          data={flightData}
          width={width - 40}
          height={200}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Recent Flights */}
      <View style={[styles.section, { backgroundColor: currentColors.white }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: currentColors.textPrimary }]}>
            Recent Flights
          </Text>
          <TouchableOpacity>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>
        {mockFlights.slice(0, 3).map(flight => (
          <FlightCard key={flight.id} flight={flight} darkMode={darkMode} />
        ))}
      </View>

      {/* Active Alerts */}
      <View style={[styles.section, { backgroundColor: currentColors.white }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: currentColors.textPrimary }]}>
            Active Alerts
          </Text>
          <TouchableOpacity>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>
        {mockAlerts.map(alert => (
          <AlertCard key={alert.id} alert={alert} darkMode={darkMode} />
        ))}
      </View>
    </ScrollView>
  );
};

// Main App Component
const AirportSafetyDashboard: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const currentColors = darkMode ? darkColors : colors;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentColors.background }]}>
      <View style={[styles.topBar, { backgroundColor: currentColors.white, borderBottomColor: currentColors.border }]}>
        <Text style={[styles.appTitle, { color: currentColors.textPrimary }]}>
          Airport Control
        </Text>
        <TouchableOpacity 
          onPress={() => setDarkMode(!darkMode)}
          style={styles.themeToggle}
        >
          <MaterialIcons 
            name={darkMode ? "light-mode" : "dark-mode"} 
            size={24} 
            color={currentColors.textSecondary} 
          />
        </TouchableOpacity>
      </View>
      
      <Dashboard darkMode={darkMode} />
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  themeToggle: {
    padding: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  notificationButton: {
    padding: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  statsCard: {
    width: '48%',
    margin: '1%',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statsCardContent: {
    alignItems: 'center',
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statsTitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  chartCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  chart: {
    borderRadius: 8,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '500',
  },
  flightCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  flightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  flightNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  flightDestination: {
    fontSize: 14,
    marginTop: 2,
  },
  flightInfo: {
    alignItems: 'flex-end',
  },
  flightTime: {
    fontSize: 14,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  flightDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flightDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flightDetailText: {
    fontSize: 12,
    marginLeft: 4,
  },
  alertCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  alertHeader: {
    flexDirection: 'row',
  },
  alertIconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  alertContent: {
    flex: 1,
  },
  alertTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  alertType: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  alertTime: {
    fontSize: 12,
  },
  alertMessage: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  alertLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertLocationText: {
    fontSize: 12,
    marginLeft: 4,
  },
});

export default AirportSafetyDashboard;
