import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar, 
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Platform,
  Dimensions,
  Image
} from 'react-native';
import { Provider as PaperProvider, Appbar, Card, Title, Paragraph, DataTable, Chip, FAB, Switch, Modal, Portal, Button, MD3Theme } from 'react-native-paper';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import Animated, { 
  SlideInRight, 
  SlideInLeft, 
  FadeIn, 
  ZoomIn,
  useAnimatedStyle,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { useSharedValue } from 'react-native-reanimated';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Type definitions
interface ScreenProps {
  theme: any;
  refreshing?: boolean;
  onRefresh?: () => void;
}

interface DashboardScreenProps extends ScreenProps {
  refreshing: boolean;
  onRefresh: () => void;
}

// Dummy data based on the schema
const airportData = {
  airport_id: "AP001",
  airport_name: "Shillong International Airport",
  location: { lat: 25.570, lng: 91.880 },
  flights: [
    { id: "F101", flight_no: "AI701", origin: "Delhi", destination: "Shillong", status: "On Time", scheduled: "08:30", estimated: "08:30", terminal: "T1", gate: "G4" },
    { id: "F102", flight_no: "SG305", origin: "Kolkata", destination: "Shillong", status: "Delayed", scheduled: "09:15", estimated: "10:30", terminal: "T1", gate: "G2" },
    { id: "F103", flight_no: "6E205", origin: "Guwahati", destination: "Shillong", status: "Landed", scheduled: "10:00", estimated: "10:05", terminal: "T2", gate: "G5" },
    { id: "F104", flight_no: "UK707", origin: "Bangalore", destination: "Shillong", status: "On Time", scheduled: "11:45", estimated: "11:45", terminal: "T1", gate: "G3" },
  ],
  tourist_registry: [
    { id: "T201", name: "John Smith", nationality: "USA", passport: "P1234567", flight: "AI701", status: "Cleared" },
    { id: "T202", name: "Emma Johnson", nationality: "UK", passport: "P7654321", flight: "SG305", status: "Pending" },
    { id: "T203", name: "Chen Wei", nationality: "China", passport: "P9876543", flight: "6E205", status: "Cleared" },
    { id: "T204", name: "Priya Patel", nationality: "India", passport: "P4567890", flight: "UK707", status: "Under Review" },
  ],
  security_alerts: [
    { id: "SA301", level: "High", message: "Unattended baggage at Terminal 1", location: "Check-in Area", time: "07:45", status: "Investigating" },
    { id: "SA302", level: "Medium", message: "Suspicious activity at Gate G2", location: "Departure Lounge", time: "08:30", status: "Monitoring" },
    { id: "SA303", level: "Low", message: "Crowd forming at Immigration", location: "Immigration Counters", time: "09:15", status: "Resolved" },
  ],
  immigration_records: [
    { id: "I401", passenger: "John Smith", passport: "P1234567", flight: "AI701", status: "Approved", time: "08:45" },
    { id: "I402", passenger: "Emma Johnson", passport: "P7654321", flight: "SG305", status: "Pending", time: "10:30" },
    { id: "I403", passenger: "Chen Wei", passport: "P9876543", flight: "6E205", status: "Approved", time: "10:15" },
    { id: "I404", passenger: "Priya Patel", passport: "P4567890", flight: "UK707", status: "Under Review", time: "11:45" },
  ],
  baggage_tracking: [
    { id: "B501", tag: "BT001234", flight: "AI701", status: "Claimed", carousel: "C3", time: "08:50" },
    { id: "B502", tag: "BT005678", flight: "SG305", status: "In Transit", carousel: "C1", time: "10:35" },
    { id: "B503", tag: "BT009876", flight: "6E205", status: "Unclaimed", carousel: "C2", time: "10:20" },
    { id: "B504", tag: "BT002345", flight: "UK707", status: "Loaded", carousel: "C4", time: "11:50" },
  ],
  airport_analytics: {
    total_flights_today: 45,
    total_passengers_today: 1200,
    alerts_today: 5,
    immigration_pending: 12,
    baggage_uncollected: 8
  }
};

// Main App Component
const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Dashboard');

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => setRefreshing(false), 2000);
  };

  const paperTheme = {
    ...(isDarkMode ? 
      {
        dark: true,
        colors: {
          primary: '#6366F1',
          background: '#0F172A',
          surface: '#1E293B',
          accent: '#06B6D4',
          error: '#EF4444',
          text: '#F8FAFC',
          onSurface: '#F8FAFC',
          disabled: '#64748B',
          placeholder: '#94A3B8',
          backdrop: 'rgba(15, 23, 42, 0.8)',
        },
      } : 
      {
        dark: false,
        colors: {
          primary: '#6366F1',
          background: '#FAFAFA',
          surface: '#FFFFFF',
          accent: '#06B6D4',
          error: '#EF4444',
          text: '#1E293B',
          onSurface: '#1E293B',
          disabled: '#CBD5E1',
          placeholder: '#64748B',
          backdrop: 'rgba(0, 0, 0, 0.5)',
        },
      }
    ),
  };

  const navigationTheme = {
    ...(isDarkMode ? 
      {
        dark: true,
        colors: {
          primary: '#6366F1',
          background: '#0F172A',
          card: '#1E293B',
          text: '#F8FAFC',
          border: '#334155',
          notification: '#EF4444',
        },
        fonts: {
          regular: {
            fontFamily: 'System',
            fontWeight: '400',
          },
          medium: {
            fontFamily: 'System',
            fontWeight: '500',
          },
          bold: {
            fontFamily: 'System',
            fontWeight: '700',
          },
          heavy: {
            fontFamily: 'System',
            fontWeight: '900',
          },
        },
      } : 
      {
        dark: false,
        colors: {
          primary: '#6366F1',
          background: '#FAFAFA',
          card: '#FFFFFF',
          text: '#1E293B',
          border: '#E2E8F0',
          notification: '#EF4444',
        },
        fonts: {
          regular: {
            fontFamily: 'System',
            fontWeight: '400',
          },
          medium: {
            fontFamily: 'System',
            fontWeight: '500',
          },
          bold: {
            fontFamily: 'System',
            fontWeight: '700',
          },
          heavy: {
            fontFamily: 'System',
            fontWeight: '900',
          },
        },
      }
    ),
  };

  const theme = isDarkMode ? 
    {
      dark: true,
      colors: {
        primary: '#6366F1',
        background: '#0F172A',
        card: '#1E293B',
        text: '#F8FAFC',
        border: '#334155',
        notification: '#EF4444',
        surface: '#1E293B',
        accent: '#06B6D4',
        backdrop: 'rgba(15, 23, 42, 0.9)',
      },
    } : 
    {
      dark: false,
      colors: {
        primary: '#6366F1',
        background: '#FAFAFA',
        card: '#FFFFFF',
        text: '#1E293B',
        border: '#E2E8F0',
        notification: '#EF4444',
        surface: '#FFFFFF',
        accent: '#06B6D4',
        backdrop: 'rgba(0, 0, 0, 0.5)',
      },
    };

  const Tab = createBottomTabNavigator();

  return (
    <PaperProvider theme={paperTheme}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: navigationTheme.colors.background }]}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <Appbar.Header style={{ backgroundColor: navigationTheme.colors.primary, elevation: 0 }}>
          <Appbar.Content 
            title="Airport Security Dashboard" 
            subtitle="Shillong International Airport"
            titleStyle={{ fontWeight: '700', fontSize: 18 }}
            subtitleStyle={{ fontSize: 14, opacity: 0.9 }}
          />
          <Appbar.Action 
            icon={isDarkMode ? "white-balance-sunny" : "moon-waning-crescent"} 
            onPress={toggleTheme}
            iconColor="#FFFFFF"
          />
        </Appbar.Header>
          
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName: any;

                if (route.name === 'Dashboard') {
                  iconName = focused ? 'grid' : 'grid-outline';
                } else if (route.name === 'Flights') {
                  iconName = focused ? 'airplane' : 'airplane-outline';
                } else if (route.name === 'Passengers') {
                  iconName = focused ? 'people' : 'people-outline';
                } else if (route.name === 'Alerts') {
                  iconName = focused ? 'notifications' : 'notifications-outline';
                } else if (route.name === 'Analytics') {
                  iconName = focused ? 'bar-chart' : 'bar-chart-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: theme.colors.primary,
              tabBarInactiveTintColor: isDarkMode ? '#64748B' : '#94A3B8',
              tabBarStyle: {
                backgroundColor: theme.colors.card,
                borderTopWidth: 1,
                borderTopColor: theme.colors.border,
                paddingTop: 8,
                paddingBottom: 8,
                height: 65,
              },
              tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: '600',
                marginTop: 4,
              },
              headerShown: false,
            })}
          >
            <Tab.Screen name="Dashboard">
              {() => <DashboardScreen theme={navigationTheme} refreshing={refreshing} onRefresh={onRefresh} />}
            </Tab.Screen>
            <Tab.Screen name="Flights">
              {() => <FlightsScreen theme={navigationTheme} />}
            </Tab.Screen>
            <Tab.Screen name="Passengers">
              {() => <PassengersScreen theme={navigationTheme} />}
            </Tab.Screen>
            <Tab.Screen name="Alerts">
              {() => <AlertsScreen theme={navigationTheme} />}
            </Tab.Screen>
            <Tab.Screen name="Analytics">
              {() => <AnalyticsScreen theme={navigationTheme} />}
            </Tab.Screen>
          </Tab.Navigator>
        </SafeAreaView>
    </PaperProvider>
  );
};

// Dashboard Screen Component
const DashboardScreen: React.FC<DashboardScreenProps> = ({ theme, refreshing, onRefresh }) => {
  const isDarkMode = theme.dark;
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeIn.duration(800)}>
        {/* Welcome Header */}
        <View style={styles.welcomeHeader}>
          <Text style={[styles.welcomeTitle, { color: theme.colors.text }]}>Welcome Back</Text>
          <Text style={[styles.welcomeSubtitle, { color: theme.colors.text, opacity: 0.7 }]}>
            Here's your airport overview for today
          </Text>
        </View>
        
        {/* Key Metrics Cards */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Quick Overview</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          <Animated.View entering={SlideInRight.duration(500)}>
            <Card style={[styles.metricCard, styles.metricCardShadow, { backgroundColor: theme.colors.card }]}>
              <Card.Content style={styles.metricCardContent}>
                <View style={[styles.metricIconContainer, { backgroundColor: '#3B82F6' }]}>
                  <Ionicons name="airplane" size={28} color="#FFFFFF" />
                </View>
                <Title style={[styles.metricTitle, { color: theme.colors.text }]}>
                  {airportData.airport_analytics.total_flights_today}
                </Title>
                <Paragraph style={[styles.metricLabel, { color: theme.colors.text, opacity: 0.7 }]}>
                  Flights Today
                </Paragraph>
              </Card.Content>
            </Card>
          </Animated.View>
          
          <Animated.View entering={SlideInRight.duration(600)}>
            <Card style={[styles.metricCard, styles.metricCardShadow, { backgroundColor: theme.colors.card }]}>
              <Card.Content style={styles.metricCardContent}>
                <View style={[styles.metricIconContainer, { backgroundColor: '#10B981' }]}>
                  <Ionicons name="people" size={28} color="#FFFFFF" />
                </View>
                <Title style={[styles.metricTitle, { color: theme.colors.text }]}>
                  {airportData.airport_analytics.total_passengers_today}
                </Title>
                <Paragraph style={[styles.metricLabel, { color: theme.colors.text, opacity: 0.7 }]}>
                  Passengers Today
                </Paragraph>
              </Card.Content>
            </Card>
          </Animated.View>
          
          <Animated.View entering={SlideInRight.duration(700)}>
            <Card style={[styles.metricCard, styles.metricCardShadow, { backgroundColor: theme.colors.card }]}>
              <Card.Content style={styles.metricCardContent}>
                <View style={[styles.metricIconContainer, { backgroundColor: '#EF4444' }]}>
                  <Ionicons name="warning" size={28} color="#FFFFFF" />
                </View>
                <Title style={[styles.metricTitle, { color: theme.colors.text }]}>
                  {airportData.airport_analytics.alerts_today}
                </Title>
                <Paragraph style={[styles.metricLabel, { color: theme.colors.text, opacity: 0.7 }]}>
                  Security Alerts
                </Paragraph>
              </Card.Content>
            </Card>
          </Animated.View>
          
          <Animated.View entering={SlideInRight.duration(800)}>
            <Card style={[styles.metricCard, styles.metricCardShadow, { backgroundColor: theme.colors.card }]}>
              <Card.Content style={styles.metricCardContent}>
                <View style={[styles.metricIconContainer, { backgroundColor: '#F59E0B' }]}>
                  <Ionicons name="bag" size={28} color="#FFFFFF" />
                </View>
                <Title style={[styles.metricTitle, { color: theme.colors.text }]}>
                  {airportData.airport_analytics.baggage_uncollected}
                </Title>
                <Paragraph style={[styles.metricLabel, { color: theme.colors.text, opacity: 0.7 }]}>
                  Unclaimed Bags
                </Paragraph>
              </Card.Content>
            </Card>
          </Animated.View>
        </ScrollView>
        
        {/* Flight Status Section */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recent Flight Status</Text>
        <Card style={[styles.sectionCard, { backgroundColor: theme.colors.card }]}>
          <Card.Content style={{ padding: 20 }}>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title style={{ flex: 2 }}>
                  <Text style={[styles.tableHeader, { color: theme.colors.text }]}>Flight</Text>
                </DataTable.Title>
                <DataTable.Title>
                  <Text style={[styles.tableHeader, { color: theme.colors.text }]}>Origin</Text>
                </DataTable.Title>
                <DataTable.Title>
                  <Text style={[styles.tableHeader, { color: theme.colors.text }]}>Status</Text>
                </DataTable.Title>
              </DataTable.Header>
              
              {airportData.flights.slice(0, 3).map((flight, index) => (
                <Animated.View key={flight.id} entering={SlideInLeft.duration(500).delay(index * 100)}>
                  <DataTable.Row style={{ minHeight: 56 }}>
                    <DataTable.Cell style={{ flex: 2 }}>
                      <Text style={[styles.tableCell, { color: theme.colors.text }]}>{flight.flight_no}</Text>
                    </DataTable.Cell>
                    <DataTable.Cell>
                      <Text style={[styles.tableCell, { color: theme.colors.text }]}>{flight.origin}</Text>
                    </DataTable.Cell>
                    <DataTable.Cell>
                      <Chip 
                        mode="outlined" 
                        style={[
                          styles.modernStatusChip, 
                          flight.status === 'On Time' ? styles.statusOnTime : 
                          flight.status === 'Delayed' ? styles.statusDelayed : 
                          styles.statusLanded
                        ]}
                        textStyle={{ fontSize: 12, fontWeight: '600' }}
                      >
                        {flight.status}
                      </Chip>
                    </DataTable.Cell>
                  </DataTable.Row>
                </Animated.View>
              ))}
            </DataTable>
          </Card.Content>
        </Card>
        
        {/* Security Alerts Section */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Security Alerts</Text>
        <Card style={[styles.sectionCard, { backgroundColor: theme.colors.card }]}>
          <Card.Content style={{ padding: 20 }}>
            {airportData.security_alerts.map((alert, index) => (
              <Animated.View key={alert.id} entering={ZoomIn.duration(500).delay(index * 150)}>
                <View style={[
                  styles.modernAlertItem, 
                  { backgroundColor: theme.colors.surface },
                  alert.level === 'High' ? styles.alertHigh : 
                  alert.level === 'Medium' ? styles.alertMedium : 
                  styles.alertLow
                ]}>
                  <View style={styles.alertContent}>
                    <View style={[
                      styles.alertIconContainer,
                      { backgroundColor: alert.level === 'High' ? '#FEF2F2' : 
                                       alert.level === 'Medium' ? '#FFFBEB' : '#F0FDF4' }
                    ]}>
                      <Ionicons 
                        name="warning" 
                        size={20} 
                        color={alert.level === 'High' ? '#EF4444' : 
                              alert.level === 'Medium' ? '#F59E0B' : '#10B981'} 
                      />
                    </View>
                    <View style={styles.alertText}>
                      <Text style={[styles.alertMessage, { color: theme.colors.text }]}>{alert.message}</Text>
                      <Text style={[styles.alertLocation, { color: theme.colors.text }]}>{alert.location} • {alert.time}</Text>
                    </View>
                  </View>
                  <Chip 
                    mode="outlined" 
                    style={[styles.modernStatusChip, styles.alertStatus]}
                    textStyle={{ fontSize: 11, fontWeight: '600' }}
                  >
                    {alert.status}
                  </Chip>
                </View>
              </Animated.View>
            ))}
          </Card.Content>
        </Card>
        
        {/* Passenger Flow Chart */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Passenger Flow Today</Text>
        <Card style={[styles.sectionCard, { backgroundColor: theme.colors.card }]}>
          <Card.Content style={{ padding: 20 }}>
            <LineChart
              data={{
                labels: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'],
                datasets: [
                  {
                    data: [120, 450, 280, 380, 290, 180],
                    color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
                    strokeWidth: 3
                  }
                ]
              }}
              width={Dimensions.get('window').width - 72}
              height={240}
              chartConfig={{
                backgroundColor: theme.colors.card,
                backgroundGradientFrom: theme.colors.card,
                backgroundGradientTo: theme.colors.card,
                decimalPlaces: 0,
                color: (opacity = 1) => isDarkMode ? `rgba(248, 250, 252, ${opacity * 0.8})` : `rgba(30, 41, 59, ${opacity * 0.8})`,
                labelColor: (opacity = 1) => isDarkMode ? `rgba(248, 250, 252, ${opacity * 0.8})` : `rgba(30, 41, 59, ${opacity * 0.8})`,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "3",
                  stroke: "#6366F1",
                  fill: "#6366F1"
                },
                fillShadowGradient: '#6366F1',
                fillShadowGradientOpacity: 0.1,
              }}
              bezier
              style={{
                marginVertical: 12,
                borderRadius: 16
              }}
            />
          </Card.Content>
        </Card>
      </Animated.View>
    </ScrollView>
  );
};

// Flights Screen Component
const FlightsScreen: React.FC<ScreenProps> = ({ theme }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const isDarkMode = theme.dark;
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.welcomeHeader}>
        <Text style={[styles.welcomeTitle, { color: theme.colors.text }]}>Flight Management</Text>
        <Text style={[styles.welcomeSubtitle, { color: theme.colors.text, opacity: 0.7 }]}>
          Monitor and manage all flight operations
        </Text>
      </View>
      
      <View style={[styles.searchContainer, { marginBottom: 24 }]}>
        <TextInput
          style={[styles.modernSearchInput, { 
            backgroundColor: theme.colors.surface, 
            color: theme.colors.text,
            borderColor: theme.colors.border 
          }]}
          placeholder="Search flights..."
          placeholderTextColor={isDarkMode ? '#94A3B8' : '#64748B'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={styles.searchIconContainer}>
          <Ionicons name="search" size={20} color={isDarkMode ? '#94A3B8' : '#64748B'} />
        </View>
      </View>
      
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Today's Flight Schedule</Text>
      <Card style={[styles.sectionCard, { backgroundColor: theme.colors.card }]}>
        <Card.Content style={{ padding: 20 }}>
          <DataTable>
            <DataTable.Header style={{ marginBottom: 8 }}>
              <DataTable.Title>
                <Text style={[styles.tableHeader, { color: theme.colors.text }]}>Flight</Text>
              </DataTable.Title>
              <DataTable.Title>
                <Text style={[styles.tableHeader, { color: theme.colors.text }]}>Route</Text>
              </DataTable.Title>
              <DataTable.Title>
                <Text style={[styles.tableHeader, { color: theme.colors.text }]}>Time</Text>
              </DataTable.Title>
              <DataTable.Title>
                <Text style={[styles.tableHeader, { color: theme.colors.text }]}>Status</Text>
              </DataTable.Title>
            </DataTable.Header>
            
            {airportData.flights.map((flight, index) => (
              <Animated.View key={flight.id} entering={SlideInLeft.duration(500).delay(index * 100)}>
                <DataTable.Row style={{ minHeight: 60, paddingVertical: 4 }}>
                  <DataTable.Cell>
                    <View>
                      <Text style={[styles.tableCell, { color: theme.colors.text, fontWeight: '600' }]}>
                        {flight.flight_no}
                      </Text>
                      <Text style={[styles.tableSubCell, { color: theme.colors.text, opacity: 0.6 }]}>
                        {flight.terminal}
                      </Text>
                    </View>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <View>
                      <Text style={[styles.tableCell, { color: theme.colors.text }]}>
                        {flight.origin} → {flight.destination}
                      </Text>
                    </View>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <Text style={[styles.tableCell, { color: theme.colors.text }]}>{flight.scheduled}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <Chip 
                      mode="outlined" 
                      style={[
                        styles.modernStatusChip, 
                        flight.status === 'On Time' ? styles.statusOnTime : 
                        flight.status === 'Delayed' ? styles.statusDelayed : 
                        styles.statusLanded
                      ]}
                      textStyle={{ fontSize: 12, fontWeight: '600' }}
                    >
                      {flight.status}
                    </Chip>
                  </DataTable.Cell>
                </DataTable.Row>
              </Animated.View>
            ))}
          </DataTable>
        </Card.Content>
      </Card>
      
      {/* Airport Map */}
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Airport Location</Text>
      <Card style={[styles.sectionCard, { backgroundColor: theme.colors.card }]}>
        <Card.Content style={{ padding: 20 }}>
          <View style={styles.mapContainer}>
            <View style={[styles.map, { 
              backgroundColor: isDarkMode ? '#334155' : '#E5E7EB', 
              justifyContent: 'center', 
              alignItems: 'center' 
            }]}>
              <View style={styles.mapPlaceholder}>
                <Ionicons 
                  name="location" 
                  size={48} 
                  color={isDarkMode ? '#94A3B8' : '#6B7280'} 
                />
                <Text style={[styles.mapPlaceholderText, { 
                  color: isDarkMode ? '#94A3B8' : '#6B7280' 
                }]}>
                  Airport Location
                </Text>
                <Text style={[styles.mapPlaceholderSubtext, { 
                  color: isDarkMode ? '#64748B' : '#9CA3AF' 
                }]}>
                  Shillong International Airport
                </Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

// Passengers Screen Component
const PassengersScreen: React.FC<ScreenProps> = ({ theme }) => {
  const isDarkMode = theme.dark;
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.welcomeHeader}>
        <Text style={[styles.welcomeTitle, { color: theme.colors.text }]}>Passenger Management</Text>
        <Text style={[styles.welcomeSubtitle, { color: theme.colors.text, opacity: 0.7 }]}>
          Monitor tourist registry and immigration status
        </Text>
      </View>
      
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Tourist Registry</Text>
      <Card style={[styles.sectionCard, { backgroundColor: theme.colors.card }]}>
        <Card.Content style={{ padding: 20 }}>
          <DataTable>
            <DataTable.Header style={{ marginBottom: 8 }}>
              <DataTable.Title>
                <Text style={[styles.tableHeader, { color: theme.colors.text }]}>Name</Text>
              </DataTable.Title>
              <DataTable.Title>
                <Text style={[styles.tableHeader, { color: theme.colors.text }]}>Country</Text>
              </DataTable.Title>
              <DataTable.Title>
                <Text style={[styles.tableHeader, { color: theme.colors.text }]}>Flight</Text>
              </DataTable.Title>
              <DataTable.Title>
                <Text style={[styles.tableHeader, { color: theme.colors.text }]}>Status</Text>
              </DataTable.Title>
            </DataTable.Header>
            
            {airportData.tourist_registry.map((tourist, index) => (
              <Animated.View key={tourist.id} entering={SlideInLeft.duration(500).delay(index * 100)}>
                <DataTable.Row style={{ minHeight: 56, paddingVertical: 4 }}>
                  <DataTable.Cell>
                    <View>
                      <Text style={[styles.tableCell, { color: theme.colors.text, fontWeight: '600' }]}>
                        {tourist.name}
                      </Text>
                      <Text style={[styles.tableSubCell, { color: theme.colors.text, opacity: 0.6 }]}>
                        {tourist.passport}
                      </Text>
                    </View>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <Text style={[styles.tableCell, { color: theme.colors.text }]}>{tourist.nationality}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <Text style={[styles.tableCell, { color: theme.colors.text }]}>{tourist.flight}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <Chip 
                      mode="outlined" 
                      style={[
                        styles.modernStatusChip, 
                        tourist.status === 'Cleared' ? styles.statusCleared : 
                        tourist.status === 'Pending' ? styles.statusPending : 
                        styles.statusReview
                      ]}
                      textStyle={{ fontSize: 12, fontWeight: '600' }}
                    >
                      {tourist.status}
                    </Chip>
                  </DataTable.Cell>
                </DataTable.Row>
              </Animated.View>
            ))}
          </DataTable>
        </Card.Content>
      </Card>
      
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Immigration Status</Text>
      <Card style={[styles.sectionCard, { backgroundColor: theme.colors.card }]}>
        <Card.Content style={{ padding: 20 }}>
          <DataTable>
            <DataTable.Header style={{ marginBottom: 8 }}>
              <DataTable.Title>
                <Text style={[styles.tableHeader, { color: theme.colors.text }]}>Passenger</Text>
              </DataTable.Title>
              <DataTable.Title>
                <Text style={[styles.tableHeader, { color: theme.colors.text }]}>Passport</Text>
              </DataTable.Title>
              <DataTable.Title>
                <Text style={[styles.tableHeader, { color: theme.colors.text }]}>Flight</Text>
              </DataTable.Title>
              <DataTable.Title>
                <Text style={[styles.tableHeader, { color: theme.colors.text }]}>Status</Text>
              </DataTable.Title>
            </DataTable.Header>
            
            {airportData.immigration_records.map((record, index) => (
              <Animated.View key={record.id} entering={SlideInLeft.duration(500).delay(index * 100)}>
                <DataTable.Row style={{ minHeight: 56, paddingVertical: 4 }}>
                  <DataTable.Cell>
                    <View>
                      <Text style={[styles.tableCell, { color: theme.colors.text, fontWeight: '600' }]}>
                        {record.passenger}
                      </Text>
                      <Text style={[styles.tableSubCell, { color: theme.colors.text, opacity: 0.6 }]}>
                        {record.time}
                      </Text>
                    </View>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <Text style={[styles.tableCell, { color: theme.colors.text }]}>{record.passport}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <Text style={[styles.tableCell, { color: theme.colors.text }]}>{record.flight}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <Chip 
                      mode="outlined" 
                      style={[
                        styles.modernStatusChip, 
                        record.status === 'Approved' ? styles.statusCleared : 
                        record.status === 'Pending' ? styles.statusPending : 
                        styles.statusReview
                      ]}
                      textStyle={{ fontSize: 12, fontWeight: '600' }}
                    >
                      {record.status}
                    </Chip>
                  </DataTable.Cell>
                </DataTable.Row>
              </Animated.View>
            ))}
          </DataTable>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

// Alerts Screen Component
const AlertsScreen: React.FC<ScreenProps> = ({ theme }) => {
  const [emergencyModalVisible, setEmergencyModalVisible] = useState(false);
  const isDarkMode = theme.dark;
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.welcomeHeader}>
        <Text style={[styles.welcomeTitle, { color: theme.colors.text }]}>Security & Alerts</Text>
        <Text style={[styles.welcomeSubtitle, { color: theme.colors.text, opacity: 0.7 }]}>
          Monitor security alerts and emergency responses
        </Text>
      </View>
      
      {/* Emergency Response Button */}
      <TouchableOpacity 
        style={[styles.modernEmergencyButton, { backgroundColor: '#EF4444' }]}
        onPress={() => setEmergencyModalVisible(true)}
      >
        <View style={styles.emergencyButtonContent}>
          <View style={styles.emergencyIconContainer}>
            <Ionicons name="warning" size={28} color="#FFFFFF" />
          </View>
          <View style={styles.emergencyTextContainer}>
            <Text style={styles.emergencyButtonTitle}>Emergency Response</Text>
            <Text style={styles.emergencyButtonSubtitle}>Tap to alert emergency services</Text>
          </View>
        </View>
      </TouchableOpacity>
      
      <Card style={[styles.sectionCard, { backgroundColor: theme.colors.card }]}>
        <Card.Content>
          <Title style={{ color: theme.colors.text }}>Active Security Alerts</Title>
          {airportData.security_alerts.map((alert, index) => (
            <Animated.View key={alert.id} entering={ZoomIn.duration(500).delay(index * 150)}>
              <View style={[
                styles.alertItem, 
                { backgroundColor: theme.colors.surface },
                alert.level === 'High' ? styles.alertHigh : 
                alert.level === 'Medium' ? styles.alertMedium : 
                styles.alertLow
              ]}>
                <View style={styles.alertContent}>
                  <Ionicons 
                    name="warning" 
                    size={20} 
                    color={alert.level === 'High' ? '#EF4444' : 
                          alert.level === 'Medium' ? '#F59E0B' : '#10B981'} 
                  />
                  <View style={styles.alertText}>
                    <Text style={[styles.alertMessage, { color: theme.colors.text }]}>{alert.message}</Text>
                    <Text style={[styles.alertLocation, { color: theme.colors.text }]}>{alert.location} • {alert.time}</Text>
                  </View>
                </View>
                <Chip mode="outlined" style={styles.alertStatus}>{alert.status}</Chip>
              </View>
            </Animated.View>
          ))}
        </Card.Content>
      </Card>
      
      <Card style={[styles.sectionCard, { backgroundColor: theme.colors.card }]}>
        <Card.Content>
          <Title style={{ color: theme.colors.text }}>Baggage Tracking</Title>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Bag Tag</DataTable.Title>
              <DataTable.Title>Flight</DataTable.Title>
              <DataTable.Title>Carousel</DataTable.Title>
              <DataTable.Title>Status</DataTable.Title>
            </DataTable.Header>
            
            {airportData.baggage_tracking.map((baggage, index) => (
              <Animated.View key={baggage.id} entering={SlideInLeft.duration(500).delay(index * 100)}>
                <DataTable.Row>
                  <DataTable.Cell>{baggage.tag}</DataTable.Cell>
                  <DataTable.Cell>{baggage.flight}</DataTable.Cell>
                  <DataTable.Cell>{baggage.carousel}</DataTable.Cell>
                  <DataTable.Cell>
                    <Chip 
                      mode="outlined" 
                      style={[
                        styles.statusChip, 
                        baggage.status === 'Claimed' ? styles.statusCleared : 
                        baggage.status === 'In Transit' ? styles.statusPending : 
                        styles.statusReview
                      ]}
                    >
                      {baggage.status}
                    </Chip>
                  </DataTable.Cell>
                </DataTable.Row>
              </Animated.View>
            ))}
          </DataTable>
        </Card.Content>
      </Card>
      
      {/* Emergency Response Modal */}
      <Portal>
        <Modal 
          visible={emergencyModalVisible} 
          onDismiss={() => setEmergencyModalVisible(false)}
          contentContainerStyle={[styles.emergencyModal, { backgroundColor: theme.colors.card }]}
        >
          <Title style={{ color: theme.colors.text, marginBottom: 16 }}>Emergency Response</Title>
          <Text style={{ color: theme.colors.text, marginBottom: 20 }}>
            Select emergency service to alert:
          </Text>
          
          <View style={styles.emergencyOptions}>
            <TouchableOpacity style={[styles.emergencyOption, { backgroundColor: '#DC2626' }]}>
              <Ionicons name="flame" size={24} color="#FFFFFF" />
              <Text style={styles.emergencyOptionText}>Fire Department</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.emergencyOption, { backgroundColor: '#2563EB' }]}>
              <Ionicons name="shield" size={24} color="#FFFFFF" />
              <Text style={styles.emergencyOptionText}>Police</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.emergencyOption, { backgroundColor: '#059669' }]}>
              <Ionicons name="medical" size={24} color="#FFFFFF" />
              <Text style={styles.emergencyOptionText}>Ambulance</Text>
            </TouchableOpacity>
          </View>
          
          <Button 
            mode="outlined" 
            onPress={() => setEmergencyModalVisible(false)}
            style={{ marginTop: 20 }}
          >
            Cancel
          </Button>
        </Modal>
      </Portal>
    </ScrollView>
  );
};

// Analytics Screen Component
const AnalyticsScreen: React.FC<ScreenProps> = ({ theme }) => {
  const isDarkMode = theme.dark;
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.welcomeHeader}>
        <Text style={[styles.welcomeTitle, { color: theme.colors.text }]}>Analytics & Reports</Text>
        <Text style={[styles.welcomeSubtitle, { color: theme.colors.text, opacity: 0.7 }]}>
          Comprehensive data insights and trends
        </Text>
      </View>
      
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Passenger Analytics</Text>
      <Card style={[styles.sectionCard, { backgroundColor: theme.colors.card }]}>
        <Card.Content style={{ padding: 20 }}>
          <BarChart
            data={{
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              datasets: [
                {
                  data: [2500, 2800, 3200, 2950, 3400, 3800, 3500],
                }
              ]
            }}
            width={Dimensions.get('window').width - 72}
            height={240}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: theme.colors.card,
              backgroundGradientFrom: theme.colors.card,
              backgroundGradientTo: theme.colors.card,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
              labelColor: (opacity = 1) => isDarkMode ? `rgba(248, 250, 252, ${opacity * 0.8})` : `rgba(30, 41, 59, ${opacity * 0.8})`,
              style: {
                borderRadius: 16
              },
              barPercentage: 0.7,
            }}
            style={{
              marginVertical: 12,
              borderRadius: 16
            }}
          />
        </Card.Content>
      </Card>
      
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Flight Status Distribution</Text>
      <Card style={[styles.sectionCard, { backgroundColor: theme.colors.card }]}>
        <Card.Content style={{ padding: 20 }}>
          <PieChart
            data={[
              {
                name: 'On Time',
                population: 65,
                color: '#10B981',
                legendFontColor: theme.colors.text,
                legendFontSize: 14
              },
              {
                name: 'Delayed',
                population: 15,
                color: '#F59E0B',
                legendFontColor: theme.colors.text,
                legendFontSize: 14
              },
              {
                name: 'Canceled',
                population: 5,
                color: '#EF4444',
                legendFontColor: theme.colors.text,
                legendFontSize: 14
              },
              {
                name: 'Landed',
                population: 15,
                color: '#6366F1',
                legendFontColor: theme.colors.text,
                legendFontSize: 14
              }
            ]}
            width={Dimensions.get('window').width - 72}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </Card.Content>
      </Card>
      
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Security Alert Trends</Text>
      <Card style={[styles.sectionCard, { backgroundColor: theme.colors.card }]}>
        <Card.Content style={{ padding: 20 }}>
          <LineChart
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              datasets: [
                {
                  data: [20, 45, 28, 80, 50, 65],
                  color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
                  strokeWidth: 3
                }
              ]
            }}
            width={Dimensions.get('window').width - 72}
            height={240}
            chartConfig={{
              backgroundColor: theme.colors.card,
              backgroundGradientFrom: theme.colors.card,
              backgroundGradientTo: theme.colors.card,
              decimalPlaces: 0,
              color: (opacity = 1) => isDarkMode ? `rgba(248, 250, 252, ${opacity * 0.8})` : `rgba(30, 41, 59, ${opacity * 0.8})`,
              labelColor: (opacity = 1) => isDarkMode ? `rgba(248, 250, 252, ${opacity * 0.8})` : `rgba(30, 41, 59, ${opacity * 0.8})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "6",
                strokeWidth: "3",
                stroke: "#EF4444",
                fill: "#EF4444"
              },
              fillShadowGradient: '#EF4444',
              fillShadowGradientOpacity: 0.1,
            }}
            bezier
            style={{
              marginVertical: 12,
              borderRadius: 16
            }}
          />
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  welcomeHeader: {
    marginBottom: 24,
    paddingTop: 8,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    marginTop: 8,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  horizontalScroll: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  metricCard: {
    width: 160,
    marginRight: 16,
    borderRadius: 16,
  },
  metricCardShadow: {
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  metricCardContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  metricIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  sectionCard: {
    marginBottom: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  statusChip: {
    height: 32,
    justifyContent: 'center',
  },
  modernStatusChip: {
    height: 32,
    justifyContent: 'center',
    borderRadius: 16,
    paddingHorizontal: 12,
  },
  tableHeader: {
    fontSize: 14,
    fontWeight: '600',
  },
  tableCell: {
    fontSize: 15,
    fontWeight: '500',
  },
  statusOnTime: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: '#10B981',
  },
  statusDelayed: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: '#F59E0B',
  },
  statusLanded: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: '#3B82F6',
  },
  statusCleared: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: '#10B981',
  },
  statusPending: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: '#F59E0B',
  },
  statusReview: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: '#3B82F6',
  },
  alertItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  modernAlertItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  alertIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertHigh: {
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  alertMedium: {
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  alertLow: {
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  alertText: {
    marginLeft: 12,
    flex: 1,
  },
  alertMessage: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  alertLocation: {
    fontSize: 12,
    opacity: 0.7,
  },
  alertStatus: {
    height: 28,
    justifyContent: 'center',
  },
  searchContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  searchInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingLeft: 48,
    fontSize: 16,
  },
  modernSearchInput: {
    height: 56,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingLeft: 56,
    fontSize: 16,
    fontWeight: '500',
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    top: 13,
  },
  searchIconContainer: {
    position: 'absolute',
    left: 20,
    top: 18,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableSubCell: {
    fontSize: 12,
    marginTop: 2,
  },
  mapContainer: {
    height: 240,
    borderRadius: 16,
    overflow: 'hidden',
  },
  map: {
    height: '100%',
    width: '100%',
  },
  mapPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    fontWeight: '400',
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  modernEmergencyButton: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  emergencyButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emergencyIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  emergencyTextContainer: {
    flex: 1,
  },
  emergencyButtonTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  emergencyButtonSubtitle: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.9,
    fontWeight: '500',
  },
  emergencyButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  emergencyModal: {
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
  emergencyOptions: {
    marginBottom: 16,
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
});

export default App;