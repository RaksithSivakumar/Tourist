import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  StatusBar,
  Image,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Animated,
  Easing,
  Platform,
  ActivityIndicator,
  Linking,
  TextInput,
  FlatList,
  Switch,
  SectionList,
  RefreshControl
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Premium Hotel Color Palette
const COLORS = {
  light: {
    primary: '#0e4e8c',
    primaryLight: '#1e6bb8',
    secondary: '#d4af37',
    accent: '#b8860b',
    success: '#28a745',
    warning: '#ffc107',
    danger: '#dc3545',
    info: '#17a2b8',
    background: '#f8f9fa',
    card: '#ffffff',
    text: '#2c3e50',
    textSecondary: '#6c757d',
    textTertiary: '#95a5a6',
    border: '#e9ecef',
    white: '#ffffff',
    black: '#000000',
    gold: '#d4af37',
    silver: '#c0c0c0',
    bronze: '#cd7f32'
  },
  dark: {
    primary: '#1e6bb8',
    primaryLight: '#2c8ce0',
    secondary: '#ffd700',
    accent: '#ffed4e',
    success: '#34ce57',
    warning: '#ffd351',
    danger: '#e74c3c',
    info: '#48d1cc',
    background: '#1a1a2e',
    card: '#16213e',
    text: '#e6e6e6',
    textSecondary: '#b8b8b8',
    textTertiary: '#888888',
    border: '#2d4059',
    white: '#ffffff',
    black: '#000000',
    gold: '#ffd700',
    silver: '#c0c0c0',
    bronze: '#cd7f32'
  }
};

// Icon Component with premium hotel icons
const IconComponent = ({ name, size = 24, color = '#000', style }) => {
  const icons = {
    'dashboard': '🏨',
    'guests': '👥',
    'alerts': '🔔',
    'analytics': '📊',
    'settings': '⚙️',
    'search': '🔍',
    'notification': '📱',
    'profile': '👤',
    'room': '🛏️',
    'safety': '🛡️',
    'checkin': '📥',
    'checkout': '📤',
    'location': '📍',
    'time': '⏰',
    'phone': '📞',
    'message': '✉️',
    'service': '🔧',
    'emergency': '🚨',
    'map': '🗺️',
    'calendar': '📅',
    'star': '⭐',
    'close': '✕',
    'menu': '☰',
    'logout': '🚪',
    'wifi': '📶',
    'food': '🍽️',
    'clean': '🧹',
    'transport': '🚗',
    'spa': '💆',
    'pool': '🏊',
    'gym': '💪'
  };

  return (
    <Text style={[{ fontSize: size, color }, style]}>
      {icons[name] || '•'}
    </Text>
  );
};

// Custom Gradient Component for premium look
const GradientView = ({ colors, style, children }) => {
  return (
    <View style={[style, { overflow: 'hidden' }]}>
      <View style={[StyleSheet.absoluteFill, { 
        backgroundColor: colors[0],
        opacity: 0.8 
      }]} />
      <View style={[StyleSheet.absoluteFill, { 
        backgroundColor: colors[1],
        opacity: 0.6 
      }]} />
      {children}
    </View>
  );
};

// Safety Score Gauge Component
const SafetyGauge = ({ score, size = 100, colors }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: score,
      duration: 1500,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: false,
    }).start();
  }, [score]);

  let gaugeColor = colors.success;
  let status = 'Excellent';
  
  if (score < 70) {
    gaugeColor = colors.warning;
    status = 'Good';
  }
  if (score < 50) {
    gaugeColor = colors.danger;
    status = 'Poor';
  }

  return (
    <View style={[styles.gaugeContainer, { width: size, height: size }]}>
      <View style={[styles.gaugeOuterCircle, { 
        width: size, 
        height: size, 
        borderRadius: size / 2,
        borderColor: colors.border
      }]}>
        <Animated.View 
          style={[
            styles.gaugeProgress,
            {
              width: animatedValue.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%']
              }),
              backgroundColor: gaugeColor
            }
          ]}
        />
      </View>
      <View style={styles.gaugeInnerCircle}>
        <Text style={[styles.gaugeScore, { color: colors.text, fontSize: size / 4 }]}>{score}</Text>
        <Text style={[styles.gaugeLabel, { color: colors.textSecondary, fontSize: size / 10 }]}>Safety</Text>
      </View>
    </View>
  );
};

// Guest Card Component
const GuestCard = ({ guest, colors, onPress }) => (
  <TouchableOpacity 
    style={[styles.guestCard, { backgroundColor: colors.card }]}
    onPress={onPress}
  >
    <View style={styles.guestHeader}>
      <View style={styles.guestAvatar}>
        <IconComponent name="profile" size={24} color={colors.white} />
      </View>
      <View style={styles.guestInfo}>
        <Text style={[styles.guestName, { color: colors.text }]}>{guest.name}</Text>
        <Text style={[styles.guestId, { color: colors.textSecondary }]}>ID: {guest.tourist_id}</Text>
      </View>
      <View style={[styles.statusBadge, { 
        backgroundColor: guest.last_status === 'active' ? colors.success : 
                       guest.last_status === 'away' ? colors.warning : colors.danger 
      }]}>
        <Text style={styles.statusBadgeText}>{guest.last_status}</Text>
      </View>
    </View>
    
    <View style={styles.guestDetails}>
      <View style={styles.guestDetailItem}>
        <IconComponent name="room" size={16} color={colors.textSecondary} />
        <Text style={[styles.guestDetailText, { color: colors.text }]}>Room {guest.room_number}</Text>
      </View>
      <View style={styles.guestDetailItem}>
        <IconComponent name="checkin" size={16} color={colors.textSecondary} />
        <Text style={[styles.guestDetailText, { color: colors.text }]}>
          {new Date(guest.check_in).toLocaleDateString()}
        </Text>
      </View>
    </View>
    
    <View style={styles.guestFooter}>
      <SafetyGauge score={guest.safety_score} size={60} colors={colors} />
      <View style={styles.guestActions}>
        <TouchableOpacity style={[styles.guestAction, { backgroundColor: colors.primary }]}>
          <IconComponent name="message" size={16} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.guestAction, { backgroundColor: colors.info }]}>
          <IconComponent name="phone" size={16} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
);

// Alert Card Component
const AlertCard = ({ alert, colors }) => (
  <View style={[styles.alertCard, { backgroundColor: colors.card }]}>
    <View style={styles.alertHeader}>
      <View style={[styles.alertIcon, { backgroundColor: colors.warning }]}>
        <IconComponent name="alerts" size={20} color={colors.white} />
      </View>
      <Text style={[styles.alertTime, { color: colors.textTertiary }]}>
        {new Date(alert.timestamp).toLocaleTimeString()}
      </Text>
    </View>
    <Text style={[styles.alertMessage, { color: colors.text }]}>{alert.message}</Text>
    <View style={styles.alertFooter}>
      <Text style={[styles.alertGuest, { color: colors.textSecondary }]}>
        Guest: {alert.tourist_id}
      </Text>
      <View style={[styles.alertStatus, { 
        backgroundColor: alert.status === 'resolved' ? colors.success : colors.warning 
      }]}>
        <Text style={styles.alertStatusText}>{alert.status}</Text>
      </View>
    </View>
  </View>
);

// Stat Card Component
const StatCard = ({ title, value, subtitle, icon, color, colors }) => (
  <View style={[styles.statCard, { backgroundColor: colors.card }]}>
    <View style={styles.statHeader}>
      <Text style={[styles.statTitle, { color: colors.textSecondary }]}>{title}</Text>
      <View style={[styles.statIcon, { backgroundColor: color }]}>
        <IconComponent name={icon} size={16} color={colors.white} />
      </View>
    </View>
    <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
    {subtitle && <Text style={[styles.statSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
  </View>
);

// Service Request Card
const ServiceCard = ({ service, colors }) => (
  <View style={[styles.serviceCard, { backgroundColor: colors.card }]}>
    <View style={styles.serviceHeader}>
      <View style={[styles.serviceIcon, { backgroundColor: colors.primary }]}>
        <IconComponent name={service.type} size={20} color={colors.white} />
      </View>
      <Text style={[styles.serviceType, { color: colors.text }]}>{service.type}</Text>
      <View style={[styles.serviceStatus, { 
        backgroundColor: service.status === 'completed' ? colors.success : 
                       service.status === 'in_progress' ? colors.warning : colors.info 
      }]}>
        <Text style={styles.serviceStatusText}>{service.status}</Text>
      </View>
    </View>
    <Text style={[styles.serviceDetails, { color: colors.textSecondary }]}>{service.details}</Text>
    <View style={styles.serviceFooter}>
      <Text style={[styles.serviceGuest, { color: colors.textTertiary }]}>
        Room {service.room_number}
      </Text>
      <Text style={[styles.serviceTime, { color: colors.textTertiary }]}>
        {new Date(service.timestamp).toLocaleTimeString()}
      </Text>
    </View>
  </View>
);

// Main Dashboard Component
export const HotelSafetyDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [refreshing, setRefreshing] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const colors = darkMode ? COLORS.dark : COLORS.light;

  // Mock Data
  const hotelData = {
    hotel_id: "H5678",
    hotel_name: "Shillong Grand Hotel",
    location: { lat: 25.578, lng: 91.893 },
    total_rooms: 120,
    occupied_rooms: 85,
    registered_tourists: [
      {
        tourist_id: "T12345",
        name: "John Doe",
        digital_id: "abc123xyz",
        room_number: 203,
        check_in: "2025-09-10T10:00:00Z",
        check_out: "2025-09-15T12:00:00Z",
        safety_score: 85,
        last_status: "active",
        contact: "+1234567890",
        nationality: "USA",
        emergency_contact: "+1987654321"
      },
      {
        tourist_id: "T12346",
        name: "Emma Wilson",
        digital_id: "def456uvw",
        room_number: 305,
        check_in: "2025-09-11T14:00:00Z",
        check_out: "2025-09-16T11:00:00Z",
        safety_score: 92,
        last_status: "active",
        contact: "+1234567891",
        nationality: "UK",
        emergency_contact: "+1987654322"
      },
      {
        tourist_id: "T12347",
        name: "Carlos Rodriguez",
        digital_id: "ghi789rst",
        room_number: 412,
        check_in: "2025-09-09T12:00:00Z",
        check_out: "2025-09-14T10:00:00Z",
        safety_score: 78,
        last_status: "away",
        contact: "+1234567892",
        nationality: "Spain",
        emergency_contact: "+1987654323"
      }
    ],
    alerts: [
      {
        tourist_id: "T12345",
        message: "Guest entered high-risk zone",
        timestamp: "2025-09-12T14:00:00Z",
        status: "notified"
      },
      {
        tourist_id: "T12347",
        message: "SOS trigger detected",
        timestamp: "2025-09-12T15:30:00Z",
        status: "pending"
      }
    ],
    service_requests: [
      {
        id: "SR001",
        tourist_id: "T12345",
        room_number: 203,
        type: "clean",
        details: "Room cleaning requested",
        timestamp: "2025-09-12T10:00:00Z",
        status: "completed"
      },
      {
        id: "SR002",
        tourist_id: "T12346",
        room_number: 305,
        type: "food",
        details: "Dinner reservation for 2 at 8 PM",
        timestamp: "2025-09-12T16:00:00Z",
        status: "in_progress"
      }
    ],
    occupancy_stats: {
      total: 120,
      occupied: 85,
      available: 35,
      maintenance: 5
    },
    revenue_stats: {
      daily: 12500,
      weekly: 87500,
      monthly: 375000,
      trend: 12.5
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const handleGuestPress = (guest) => {
    setSelectedGuest(guest);
    setShowGuestModal(true);
  };

  const handleEmergencyAction = (type, guest) => {
    const actions = {
      police: () => Linking.openURL('tel:100'),
      hospital: () => Linking.openURL('tel:108'),
      embassy: () => Alert.alert('Embassy Contact', `Contacting embassy for ${guest.nationality} citizen`)
    };
    
    if (actions[type]) {
      actions[type]();
    }
  };

  // Dashboard Tab
  const renderDashboard = () => (
    <ScrollView 
      showsVerticalScrollIndicator={false} 
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Welcome Header */}
      <View style={styles.welcomeContainer}>
        <Text style={[styles.welcomeText, { color: colors.text }]}>Welcome to</Text>
        <Text style={[styles.hotelName, { color: colors.primary }]}>{hotelData.hotel_name}</Text>
      </View>

      {/* Stats Overview */}
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Hotel Overview</Text>
        <View style={styles.statsGrid}>
          <StatCard 
            title="Occupancy" 
            value={`${hotelData.occupancy_stats.occupied}/${hotelData.occupancy_stats.total}`}
            subtitle="Rooms occupied"
            icon="room"
            color={colors.primary}
            colors={colors}
          />
          <StatCard 
            title="Revenue" 
            value={`₹${hotelData.revenue_stats.daily.toLocaleString()}`}
            subtitle="Today's revenue"
            icon="analytics"
            color={colors.secondary}
            colors={colors}
          />
        </View>
      </View>

      {/* Current Guests */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Current Guests</Text>
          <TouchableOpacity>
            <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={hotelData.registered_tourists.slice(0, 3)}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.tourist_id}
          renderItem={({ item }) => (
            <GuestCard 
              guest={item} 
              colors={colors}
              onPress={() => handleGuestPress(item)}
            />
          )}
          contentContainerStyle={styles.horizontalList}
        />
      </View>

      {/* Recent Alerts */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Alerts</Text>
          <TouchableOpacity>
            <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
          </TouchableOpacity>
        </View>
        {hotelData.alerts.map((alert, index) => (
          <AlertCard key={index} alert={alert} colors={colors} />
        ))}
      </View>

      {/* Service Requests */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Service Requests</Text>
          <TouchableOpacity>
            <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
          </TouchableOpacity>
        </View>
        {hotelData.service_requests.map((service) => (
          <ServiceCard key={service.id} service={service} colors={colors} />
        ))}
      </View>
    </ScrollView>
  );

  // Guests Tab
  const renderGuests = () => (
    <View style={styles.tabContent}>
      <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
        <IconComponent name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search guests..."
          placeholderTextColor={colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={hotelData.registered_tourists}
        keyExtractor={(item) => item.tourist_id}
        renderItem={({ item }) => (
          <GuestCard 
            guest={item} 
            colors={colors}
            onPress={() => handleGuestPress(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );

  // Alerts Tab
  const renderAlerts = () => (
    <View style={styles.tabContent}>
      <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
        <IconComponent name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search alerts..."
          placeholderTextColor={colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={hotelData.alerts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <AlertCard alert={item} colors={colors} />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );

  // Analytics Tab
  const renderAnalytics = () => (
    <ScrollView 
      showsVerticalScrollIndicator={false} 
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Occupancy Analytics</Text>
        <View style={[styles.chartContainer, { backgroundColor: colors.card }]}>
          <View style={styles.chartPlaceholder}>
            <IconComponent name="analytics" size={40} color={colors.textSecondary} />
            <Text style={[styles.chartText, { color: colors.text }]}>Occupancy Chart</Text>
            <Text style={[styles.chartSubtext, { color: colors.textSecondary }]}>
              {hotelData.occupancy_stats.occupied} rooms occupied
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Revenue Analytics</Text>
        <View style={[styles.chartContainer, { backgroundColor: colors.card }]}>
          <View style={styles.chartPlaceholder}>
            <IconComponent name="star" size={40} color={colors.secondary} />
            <Text style={[styles.chartText, { color: colors.text }]}>Revenue Chart</Text>
            <Text style={[styles.chartSubtext, { color: colors.textSecondary }]}>
              ₹{hotelData.revenue_stats.monthly.toLocaleString()} monthly
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Safety Analytics</Text>
        <View style={styles.statsGrid}>
          <StatCard 
            title="Avg Safety Score" 
            value="85"
            subtitle="Across all guests"
            icon="safety"
            color={colors.success}
            colors={colors}
          />
          <StatCard 
            title="Alerts Today" 
            value={hotelData.alerts.length}
            subtitle="Need attention"
            icon="alerts"
            color={colors.warning}
            colors={colors}
          />
        </View>
      </View>
    </ScrollView>
  );

  // Settings Tab
  const renderSettings = () => (
    <ScrollView 
      showsVerticalScrollIndicator={false} 
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
        <View style={[styles.settingCard, { backgroundColor: colors.card }]}>
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              thumbColor={darkMode ? colors.primary : colors.white}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
            />
          </View>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Notifications</Text>
        <View style={[styles.settingCard, { backgroundColor: colors.card }]}>
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Push Notifications</Text>
            <Switch
              value={true}
              onValueChange={() => {}}
              thumbColor={colors.primary}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
            />
          </View>
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Email Alerts</Text>
            <Switch
              value={true}
              onValueChange={() => {}}
              thumbColor={colors.primary}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
            />
          </View>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Hotel Information</Text>
        <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.infoText, { color: colors.text }]}>{hotelData.hotel_name}</Text>
          <Text style={[styles.infoSubtext, { color: colors.textSecondary }]}>ID: {hotelData.hotel_id}</Text>
          <Text style={[styles.infoSubtext, { color: colors.textSecondary }]}>
            Location: {hotelData.location.lat.toFixed(4)}, {hotelData.location.lng.toFixed(4)}
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  // Tab Button Component
  const TabButton = ({ name, label, icon }) => {
    const isActive = selectedTab === name;
    
    return (
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => setSelectedTab(name)}
        activeOpacity={0.7}
      >
        <IconComponent
          name={icon}
          size={22}
          color={isActive ? colors.primary : colors.textSecondary}
        />
        <Text style={[
          styles.tabText,
          { color: isActive ? colors.primary : colors.textSecondary }
        ]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.primary} />
      
      {/* Header */}
      <GradientView
        colors={[colors.primary, colors.primaryLight]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.hotelId}>{hotelData.hotel_id}</Text>
            <Text style={styles.hotelNameHeader}>{hotelData.hotel_name}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {}}
            >
              <IconComponent 
                name="notification" 
                size={20} 
                color={colors.white} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </GradientView>

      {/* Main Content */}
      <View style={styles.content}>
        {selectedTab === 'dashboard' && renderDashboard()}
        {selectedTab === 'guests' && renderGuests()}
        {selectedTab === 'alerts' && renderAlerts()}
        {selectedTab === 'analytics' && renderAnalytics()}
        {selectedTab === 'settings' && renderSettings()}
      </View>

      {/* Tab Navigation */}
      <View style={[styles.tabContainer, { backgroundColor: colors.card }]}>
        <TabButton name="dashboard" label="Dashboard" icon="dashboard" />
        <TabButton name="guests" label="Guests" icon="guests" />
        <TabButton name="alerts" label="Alerts" icon="alerts" />
        <TabButton name="analytics" label="Analytics" icon="analytics" />
        <TabButton name="settings" label="Settings" icon="settings" />
      </View>

      {/* Guest Detail Modal */}
      <Modal visible={showGuestModal} animationType="slide" transparent={true}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Guest Details</Text>
              <TouchableOpacity 
                onPress={() => setShowGuestModal(false)}
                style={styles.closeButton}
              >
                <IconComponent name="close" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            {selectedGuest && (
              <ScrollView>
                <View style={styles.guestModalSection}>
                  <Text style={[styles.modalSectionTitle, { color: colors.text }]}>Personal Information</Text>
                  <View style={styles.modalInfoGrid}>
                    <View style={styles.modalInfoItem}>
                      <Text style={[styles.modalInfoLabel, { color: colors.textSecondary }]}>Name</Text>
                      <Text style={[styles.modalInfoValue, { color: colors.text }]}>{selectedGuest.name}</Text>
                    </View>
                    <View style={styles.modalInfoItem}>
                      <Text style={[styles.modalInfoLabel, { color: colors.textSecondary }]}>Room</Text>
                      <Text style={[styles.modalInfoValue, { color: colors.text }]}>{selectedGuest.room_number}</Text>
                    </View>
                    <View style={styles.modalInfoItem}>
                      <Text style={[styles.modalInfoLabel, { color: colors.textSecondary }]}>Nationality</Text>
                      <Text style={[styles.modalInfoValue, { color: colors.text }]}>{selectedGuest.nationality}</Text>
                    </View>
                    <View style={styles.modalInfoItem}>
                      <Text style={[styles.modalInfoLabel, { color: colors.textSecondary }]}>Status</Text>
                      <Text style={[styles.modalInfoValue, { color: colors.text }]}>{selectedGuest.last_status}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.guestModalSection}>
                  <Text style={[styles.modalSectionTitle, { color: colors.text }]}>Stay Details</Text>
                  <View style={styles.modalInfoGrid}>
                    <View style={styles.modalInfoItem}>
                      <Text style={[styles.modalInfoLabel, { color: colors.textSecondary }]}>Check-in</Text>
                      <Text style={[styles.modalInfoValue, { color: colors.text }]}>
                        {new Date(selectedGuest.check_in).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={styles.modalInfoItem}>
                      <Text style={[styles.modalInfoLabel, { color: colors.textSecondary }]}>Check-out</Text>
                      <Text style={[styles.modalInfoValue, { color: colors.text }]}>
                        {new Date(selectedGuest.check_out).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.guestModalSection}>
                  <Text style={[styles.modalSectionTitle, { color: colors.text }]}>Safety Status</Text>
                  <View style={styles.safetyModalContainer}>
                    <SafetyGauge score={selectedGuest.safety_score} size={120} colors={colors} />
                    <View style={styles.safetyActions}>
                      <Text style={[styles.safetyActionTitle, { color: colors.text }]}>Emergency Actions:</Text>
                      <View style={styles.emergencyButtons}>
                        <TouchableOpacity 
                          style={[styles.emergencyButton, { backgroundColor: colors.primary }]}
                          onPress={() => handleEmergencyAction('police', selectedGuest)}
                        >
                          <IconComponent name="emergency" size={16} color={colors.white} />
                          <Text style={[styles.emergencyButtonText, { color: colors.white }]}>Police</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={[styles.emergencyButton, { backgroundColor: colors.danger }]}
                          onPress={() => handleEmergencyAction('hospital', selectedGuest)}
                        >
                          <IconComponent name="emergency" size={16} color={colors.white} />
                          <Text style={[styles.emergencyButtonText, { color: colors.white }]}>Hospital</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={[styles.emergencyButton, { backgroundColor: colors.info }]}
                          onPress={() => handleEmergencyAction('embassy', selectedGuest)}
                        >
                          <IconComponent name="emergency" size={16} color={colors.white} />
                          <Text style={[styles.emergencyButtonText, { color: colors.white }]}>Embassy</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.guestModalSection}>
                  <Text style={[styles.modalSectionTitle, { color: colors.text }]}>Contact Information</Text>
                  <View style={styles.contactButtons}>
                    <TouchableOpacity 
                      style={[styles.contactButton, { backgroundColor: colors.primary }]}
                      onPress={() => Linking.openURL(`tel:${selectedGuest.contact}`)}
                    >
                      <IconComponent name="phone" size={16} color={colors.white} />
                      <Text style={[styles.contactButtonText, { color: colors.white }]}>Call Guest</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.contactButton, { backgroundColor: colors.info }]}
                      onPress={() => Linking.openURL(`tel:${selectedGuest.emergency_contact}`)}
                    >
                      <IconComponent name="phone" size={16} color={colors.white} />
                      <Text style={[styles.contactButtonText, { color: colors.white }]}>Emergency Contact</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hotelId: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
  },
  hotelNameHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  content: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  scrollContent: {
    padding: 16,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 16,
    marginBottom: 4,
  },
  hotelName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -8,
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  statIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
  },
  guestCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  guestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  guestAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0e4e8c',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  guestInfo: {
    flex: 1,
  },
  guestName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  guestId: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  guestDetails: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  guestDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  guestDetailText: {
    fontSize: 14,
    marginLeft: 4,
  },
  guestFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  guestActions: {
    flexDirection: 'row',
  },
  guestAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  alertCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  alertTime: {
    fontSize: 12,
  },
  alertMessage: {
    fontSize: 14,
    marginBottom: 8,
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertGuest: {
    fontSize: 12,
  },
  alertStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  alertStatusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  serviceCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  serviceType: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  serviceStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  serviceStatusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  serviceDetails: {
    fontSize: 14,
    marginBottom: 8,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  serviceGuest: {
    fontSize: 12,
  },
  serviceTime: {
    fontSize: 12,
  },
  tabContent: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  listContent: {
    padding: 16,
  },
  horizontalList: {
    paddingRight: 16,
  },
  chartContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartPlaceholder: {
    alignItems: 'center',
    padding: 20,
  },
  chartText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  chartSubtext: {
    fontSize: 14,
  },
  settingCard: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingLabel: {
    fontSize: 16,
  },
  infoCard: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  infoSubtext: {
    fontSize: 14,
    marginBottom: 2,
  },
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gaugeOuterCircle: {
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gaugeProgress: {
    position: 'absolute',
    height: '100%',
    borderRadius: 50,
  },
  gaugeInnerCircle: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeScore: {
    fontWeight: 'bold',
  },
  gaugeLabel: {
    fontWeight: '500',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    maxHeight: height * 0.8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  guestModalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  modalInfoItem: {
    width: '50%',
    padding: 8,
  },
  modalInfoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  modalInfoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  safetyModalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  safetyActions: {
    flex: 1,
    marginLeft: 16,
  },
  safetyActionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emergencyButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    margin: 4,
  },
  emergencyButtonText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  contactButtons: {
    flexDirection: 'row',
    marginHorizontal: -8,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
});

export default HotelSafetyDashboard;