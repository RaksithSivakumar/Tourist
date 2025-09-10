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
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

// Professional Color Palette
const COLORS = {
  light: {
    primary: '#4361EE',
    primaryLight: '#4895EF',
    secondary: '#3A0CA3',
    accent: '#7209B7',
    success: '#4CC9F0',
    warning: '#F72585',
    background: '#F8F9FA',
    card: '#FFFFFF',
    text: '#212529',
    textSecondary: '#6C757D',
    textTertiary: '#ADB5BD',
    border: '#DEE2E6',
    danger: '#DC3545',
    white: '#FFFFFF',
    black: '#000000',
  },
  dark: {
    primary: '#4895EF',
    primaryLight: '#4361EE',
    secondary: '#560BAD',
    accent: '#7209B7',
    success: '#4CC9F0',
    warning: '#F72585',
    background: '#121212',
    card: '#1E1E1E',
    text: '#E9ECEF',
    textSecondary: '#ADB5BD',
    textTertiary: '#6C757D',
    border: '#2D2D2D',
    danger: '#E5383B',
    white: '#FFFFFF',
    black: '#000000',
  },
};

// Custom Gradient Component
const GradientView = ({ colors, style, children }) => {
  return (
    <View style={[style, { overflow: 'hidden' }]}>
      <View style={[StyleSheet.absoluteFill, { 
        backgroundColor: colors[0],
        opacity: 0.9 
      }]} />
      <View style={[StyleSheet.absoluteFill, { 
        backgroundColor: colors[1],
        opacity: 0.7 
      }]} />
      {children}
    </View>
  );
};

// Icon Component using MaterialCommunityIcons naming
const IconComponent = ({ name, size = 24, color = '#000', style }) => {
  const icons = {
    'heart-pulse': '❤️',
    'gas-cylinder': '💨',
    'battery': '🔋',
    'view-dashboard': '📊',
    'map-marker': '📍',
    'shield': '🛡️',
    'weather-sunny': '☀️',
    'weather-night': '🌙',
    'qrcode': '📱',
    'alert': '⚠️',
    'check-circle': '✅',
    'circle-outline': '⭕',
    'phone': '📞',
    'close': '✕',
    'account': '👤',
    'map': '🗺️',
    'bell': '🔔',
    'medical-bag': '💊',
    'walk': '🚶',
    'calendar': '📅',
    'information': 'ℹ️',
  };

  return (
    <Text style={[{ fontSize: size, color }, style]}>
      {icons[name] || '•'}
    </Text>
  );
};

// Enhanced Safety Gauge with modern design
const SafetyGauge = ({ score, colors }) => {
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
    <View style={styles.gaugeContainer}>
      <View style={styles.gaugeOuterCircle}>
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
        <Text style={[styles.gaugeScore, { color: colors.text }]}>{score}</Text>
        <Text style={[styles.gaugeLabel, { color: colors.textSecondary }]}>Safety Score</Text>
        <Text style={[styles.gaugeStatus, { color: gaugeColor }]}>{status}</Text>
      </View>
    </View>
  );
};

// Modern Metric Card
const MetricCard = ({ icon, value, unit, label, color, colors, delay = 0 }) => {
  const scaleValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleValue, {
      toValue: 1,
      delay: delay,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[
      styles.metricCard,
      {
        backgroundColor: colors.card,
        transform: [{ scale: scaleValue }]
      }
    ]}>
      <View style={[styles.metricIconContainer, { backgroundColor: color }]}>
        <IconComponent name={icon} size={20} color={colors.white} />
      </View>
      <View style={styles.metricContent}>
        <Text style={[styles.metricValue, { color: colors.text }]}>
          {value}
          <Text style={[styles.metricUnit, { color: colors.textSecondary }]}> {unit}</Text>
        </Text>
        <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>{label}</Text>
      </View>
    </Animated.View>
  );
};

// Main Dashboard Component
export const SmartTouristDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [showDigitalID, setShowDigitalID] = useState(false);
  const [sosCountdown, setSOSCountdown] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  
  const slideAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  const colors = darkMode ? COLORS.dark : COLORS.light;

  // Mock Data
  const touristData = {
    name: "Elena Rodriguez",
    profile_pic: "https://randomuser.me/api/portraits/women/44.jpg",
    tourist_id: "T-78901",
    location: "Coimbatore, Tamil Nadu",
    digital_id: {
      qr_code: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=T-78901",
      validity_start: "2025-09-10",
      validity_end: "2025-09-15",
      status: "active",
      blockchain_txn_id: "0xabc...def"
    },
    safety_score: 85,
    alerts: [
      { 
        type: "geo_fence", 
        message: "Exited safe zone briefly", 
        timestamp: "2025-09-12T14:00:00Z", 
        severity: "medium",
        location: "Near Coimbatore Railway Station"
      },
      { 
        type: "health", 
        message: "Heart rate elevated during activity", 
        timestamp: "2025-09-12T13:30:00Z", 
        severity: "low",
        location: "Marudamalai Temple"
      },
      { 
        type: "weather", 
        message: "Heavy rain alert for your area", 
        timestamp: "2025-09-12T12:00:00Z", 
        severity: "high",
        location: "Ooty Hills"
      }
    ],
    wearable_iot: {
      last_location: { 
        latitude: 11.0168, 
        longitude: 76.9558, 
        address: "Coimbatore, Tamil Nadu"
      },
      battery: 78,
      health_status: { 
        heart_rate: 78, 
        oxygen: 98,
        steps: 8547,
        calories: 342,
        distance: 6.2
      }
    },
    trip_itinerary: {
      current_day: 2,
      total_days: 5,
      places_planned: [
        { name: "Coimbatore City Tour", date: "2025-09-10", visited: true, rating: 4.5 },
        { name: "Ooty Hill Station", date: "2025-09-11", visited: true, rating: 5.0 },
        { name: "Munnar Tea Gardens", date: "2025-09-12", visited: false, rating: 0 },
        { name: "Kodaikanal Lake", date: "2025-09-13", visited: false, rating: 0 },
        { name: "Palani Hills", date: "2025-09-14", visited: false, rating: 0 },
      ]
    },
    contact_info: {
      emergency_contacts: [
        { name: "Carlos Rodriguez", relation: "Brother", phone: "+911234567890", avatar: "👨‍💼" },
        { name: "Maria Santos", relation: "Best Friend", phone: "+910987654321", avatar: "👩‍⚕️" },
        { name: "Emergency Services", relation: "Local Authority", phone: "112", avatar: "🚓" }
      ]
    },
    preferences: {
      language: "English",
      currency: "INR",
      notifications: true,
      location_sharing: true
    }
  };

  // SOS trigger with countdown
  const triggerSOS = () => {
    setShowSOSModal(true);
    setSOSCountdown(3);
    
    const countdown = setInterval(() => {
      setSOSCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdown);
          Alert.alert(
            "🚨 Emergency Alert Sent!",
            "• Emergency services notified\n• Location shared with contacts\n• Medical info transmitted\n• Help is on the way!",
            [{ text: "OK", onPress: () => setShowSOSModal(false) }]
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Tab Button Component
  const TabButton = ({ name, label, icon }) => {
    const isActive = selectedTab === name;
    
    return (
      <TouchableOpacity
        style={styles.tab}
        onPress={() => {
          setSelectedTab(name);
          Animated.spring(slideAnim, {
            toValue: name === 'overview' ? 0 : name === 'itinerary' ? 1 : 2,
            useNativeDriver: true,
          }).start();
        }}
        activeOpacity={0.7}
      >
        <View style={[
          styles.tabButton,
          isActive && { 
            backgroundColor: colors.primary,
            borderBottomWidth: 3,
            borderBottomColor: colors.white,
          }
        ]}>
          <IconComponent
            name={icon}
            size={22}
            color={isActive ? colors.white : colors.textSecondary}
          />
          <Text style={[
            styles.tabText,
            { color: isActive ? colors.white : colors.textSecondary }
          ]}>
            {label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Overview Tab
  const renderOverview = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      {/* Health Metrics Section */}
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Health Metrics</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          <MetricCard
            icon="heart-pulse"
            value={touristData.wearable_iot.health_status.heart_rate}
            unit="BPM"
            label="Heart Rate"
            color={colors.warning}
            colors={colors}
            delay={0}
          />
          <MetricCard
            icon="gas-cylinder"
            value={touristData.wearable_iot.health_status.oxygen}
            unit="% SpO2"
            label="Oxygen Sat."
            color={colors.success}
            colors={colors}
            delay={100}
          />
          <MetricCard
            icon="battery"
            value={touristData.wearable_iot.battery}
            unit="%"
            label="Device Battery"
            color={colors.primaryLight}
            colors={colors}
            delay={200}
          />
        </ScrollView>
      </View>

      {/* Safety Score Section */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Safety Overview</Text>
        <SafetyGauge score={touristData.safety_score} colors={colors} />
        <View style={styles.safetyDetails}>
          <View style={styles.safetyDetailItem}>
            <Text style={[styles.safetyDetailLabel, { color: colors.textSecondary }]}>Location Status</Text>
            <Text style={[styles.safetyDetailValue, { color: colors.success }]}>Safe Zone</Text>
          </View>
          <View style={styles.safetyDetailItem}>
            <Text style={[styles.safetyDetailLabel, { color: colors.textSecondary }]}>Health Status</Text>
            <Text style={[styles.safetyDetailValue, { color: colors.success }]}>Normal</Text>
          </View>
        </View>
      </View>
      
      {/* Recent Alerts Section */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Recent Alerts</Text>
          <IconComponent name="bell" size={20} color={colors.textSecondary} />
        </View>
        {touristData.alerts.map((alert, index) => (
          <View key={index} style={[
            styles.alertItem, 
            { 
              backgroundColor: colors.card,
              borderLeftWidth: 4,
              borderLeftColor: alert.severity === 'high' ? colors.danger : 
                             alert.severity === 'medium' ? colors.warning : colors.success
            }
          ]}>
            <View style={styles.alertContent}>
              <Text style={[styles.alertMessage, { color: colors.text }]}>{alert.message}</Text>
              <Text style={[styles.alertLocation, { color: colors.textTertiary }]}>{alert.location}</Text>
              <Text style={[styles.alertTime, { color: colors.textSecondary }]}>
                {new Date(alert.timestamp).toLocaleTimeString()}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  // Itinerary Tab
  const renderItinerary = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      {/* Trip Progress */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Trip Progress</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressInfo}>
            <Text style={[styles.progressDay, { color: colors.text }]}>
              Day {touristData.trip_itinerary.current_day} of {touristData.trip_itinerary.total_days}
            </Text>
            <Text style={[styles.progressLocation, { color: colors.textSecondary }]}>
              Currently in {touristData.location}
            </Text>
          </View>
          <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
            <View style={[
              styles.progressFill, 
              { 
                backgroundColor: colors.primary,
                width: `${(touristData.trip_itinerary.current_day / touristData.trip_itinerary.total_days) * 100}%`
              }
            ]} />
          </View>
        </View>
      </View>

      {/* Map Section */}
      <View style={[styles.card, { backgroundColor: colors.card, padding: 0, overflow: 'hidden' }]}>
        <View style={[styles.mapPlaceholder, { backgroundColor: colors.background }]}>
          <IconComponent name="map" size={40} color={colors.textSecondary} />
          <Text style={[styles.mapPlaceholderText, { color: colors.text }]}>
            Interactive Map View
          </Text>
          <Text style={[styles.mapLocationText, { color: colors.textSecondary }]}>
            Last Known Location: {touristData.wearable_iot.last_location.address}
          </Text>
          <TouchableOpacity style={[styles.mapButton, { backgroundColor: colors.primary }]}>
            <Text style={styles.mapButtonText}>Open in Maps</Text>
          </TouchableOpacity>
        </View>
      </View>
        
      {/* Itinerary Timeline */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Trip Itinerary</Text>
        {touristData.trip_itinerary.places_planned.map((place, index) => (
          <View key={index} style={styles.timelineItem}>
            <View style={styles.timelineIndicator}>
              <View style={[
                styles.timelineDot,
                { 
                  backgroundColor: place.visited ? colors.success : colors.border,
                }
              ]}>
                <IconComponent 
                  name={place.visited ? "check-circle" : "circle-outline"} 
                  size={16} 
                  color={place.visited ? colors.white : colors.textSecondary} 
                />
              </View>
              {index < touristData.trip_itinerary.places_planned.length - 1 && (
                <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />
              )}
            </View>
            <View style={styles.timelineContent}>
              <Text style={[styles.placeName, { color: colors.text }]}>{place.name}</Text>
              <Text style={[styles.placeDate, { color: colors.textSecondary }]}>
                {new Date(place.date).toLocaleDateString()}
              </Text>
              {place.visited && place.rating > 0 && (
                <View style={styles.ratingContainer}>
                  <Text style={[styles.ratingText, { color: colors.warning }]}>
                    ⭐ {place.rating}/5.0
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  // Safety Tab
  const renderSafety = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      {/* Emergency SOS Section */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Emergency Services</Text>
        <TouchableOpacity 
          style={[styles.sosButton, { backgroundColor: colors.danger }]} 
          onPress={triggerSOS}
          activeOpacity={0.8}
        >
          <IconComponent name="alert" size={24} color={colors.white} />
          <Text style={styles.sosButtonText}>TRIGGER EMERGENCY SOS</Text>
        </TouchableOpacity>
        <Text style={[styles.sosDescription, { color: colors.textSecondary }]}>
          This will immediately notify emergency services and your emergency contacts with your current location.
        </Text>
      </View>
      
      {/* Emergency Contacts */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Emergency Contacts</Text>
        {touristData.contact_info.emergency_contacts.map((contact, index) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.contactItem, { backgroundColor: colors.background }]}
            onPress={() => {
              if (contact.phone && contact.phone !== '112') {
                Linking.openURL(`tel:${contact.phone}`);
              } else {
                Alert.alert('Emergency Call', 'Calling emergency services...');
              }
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.contactAvatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>{contact.avatar}</Text>
            </View>
            <View style={styles.contactInfo}>
              <Text style={[styles.contactName, { color: colors.text }]}>{contact.name}</Text>
              <Text style={[styles.contactRelation, { color: colors.textSecondary }]}>{contact.relation}</Text>
              <Text style={[styles.contactPhone, { color: colors.textTertiary }]}>{contact.phone}</Text>
            </View>
            <View style={[styles.callButton, { backgroundColor: colors.success }]}>
              <IconComponent name="phone" size={20} color={colors.white} />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Safety Tips */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Safety Tips</Text>
        {[
          "Keep your device charged above 20%",
          "Share your location with trusted contacts",
          "Avoid isolated areas after dark",
          "Keep emergency contact numbers handy",
          "Inform someone about your travel plans"
        ].map((tip, index) => (
          <View key={index} style={styles.tipItem}>
            <IconComponent name="information" size={16} color={colors.primary} style={styles.tipIcon} />
            <Text style={[styles.tipText, { color: colors.textSecondary }]}>{tip}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.primary} />
      
      {/* Header */}
      <GradientView
        colors={[colors.primary, colors.primaryLight]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View style={styles.headerProfile}>
            <Image source={{ uri: touristData.profile_pic }} style={styles.profileImage} />
            <View>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.userName}>{touristData.name}</Text>
              <View style={styles.locationContainer}>
                <IconComponent name="map-marker" size={14} color={colors.white} />
                <Text style={styles.userLocation}>{touristData.location}</Text>
              </View>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setDarkMode(!darkMode)}
              activeOpacity={0.7}
            >
              <IconComponent 
                name={darkMode ? "weather-sunny" : "weather-night"} 
                size={20} 
                color={colors.white} 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => setShowDigitalID(true)}
              activeOpacity={0.7}
            >
              <IconComponent name="qrcode" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </GradientView>

      {/* Tab Navigation */}
      <View style={[styles.tabContainer, { backgroundColor: colors.card }]}>
        <TabButton name="overview" label="Overview" icon="view-dashboard" />
        <TabButton name="itinerary" label="Itinerary" icon="map-marker" />
        <TabButton name="safety" label="Safety" icon="shield" />
      </View>
      
      {/* Content */}
      <View style={styles.content}>
        {selectedTab === 'overview' && renderOverview()}
        {selectedTab === 'itinerary' && renderItinerary()}
        {selectedTab === 'safety' && renderSafety()}
      </View>

      {/* Digital ID Modal */}
      <Modal visible={showDigitalID} animationType="slide" transparent={true} onRequestClose={() => setShowDigitalID(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Digital Tourist ID</Text>
              <TouchableOpacity 
                onPress={() => setShowDigitalID(false)}
                style={styles.closeButton}
              >
                <IconComponent name="close" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <GradientView
              colors={[colors.primary, colors.secondary]}
              style={styles.idCard}
            >
              <Image source={{ uri: touristData.profile_pic }} style={styles.idPhoto} />
              <Text style={styles.idName}>{touristData.name}</Text>
              <Text style={styles.idNumber}>ID: {touristData.tourist_id}</Text>
              
              <View style={styles.qrContainer}>
                <Image source={{ uri: touristData.digital_id.qr_code }} style={styles.qrCode} />
              </View>
              
              <View style={styles.idDetails}>
                <Text style={styles.idValidity}>
                  Valid: {new Date(touristData.digital_id.validity_start).toLocaleDateString()} - {new Date(touristData.digital_id.validity_end).toLocaleDateString()}
                </Text>
                <View style={[styles.idStatus, { backgroundColor: colors.success }]}>
                  <Text style={styles.idStatusText}>✓ {touristData.digital_id.status.toUpperCase()}</Text>
                </View>
              </View>
            </GradientView>
            
            <Text style={[styles.blockchainInfo, { color: colors.textSecondary }]}>
              Secured by blockchain: {touristData.digital_id.blockchain_txn_id}
            </Text>
          </View>
        </View>
      </Modal>

      {/* SOS Modal */}
      <Modal visible={showSOSModal} animationType="fade" transparent={true}>
        <View style={styles.sosModalContainer}>
          <GradientView
            colors={[colors.danger, colors.warning]}
            style={styles.sosContent}
          >
            <Animated.View style={[styles.sosIconContainer]}>
              <IconComponent name="alert" size={80} color={colors.white} />
            </Animated.View>
            <Text style={styles.sosTitle}>🚨 EMERGENCY SOS</Text>
            <Text style={styles.sosCountdownText}>
              {sosCountdown > 0 ? `Activating in ${sosCountdown}...` : 'ACTIVATED!'}
            </Text>
            <Text style={styles.sosMessage}>
              {sosCountdown > 0 
                ? "Emergency services will be notified. Cancel if this was accidental."
                : "Help is on the way! Emergency services and contacts have been notified."
              }
            </Text>
            {sosCountdown > 0 && (
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => {
                  setShowSOSModal(false);
                  setSOSCountdown(3);
                }}
              >
                <Text style={styles.cancelButtonText}>CANCEL</Text>
              </TouchableOpacity>
            )}
          </GradientView>
        </View>
      </Modal>

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

// Enhanced Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // Header Styles
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    marginRight: 15,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  greeting: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 2,
    color: '#FFFFFF',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  userLocation: {
    fontSize: 12,
    marginLeft: 4,
    color: 'rgba(255,255,255,0.8)',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
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
  
  // Tab Navigation Styles
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 15,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: 'center',
  },
  tabText: {
    marginLeft: 6,
    fontWeight: '600',
    fontSize: 13,
  },
  
  // Content Styles
  content: {
    flex: 1,
    paddingTop: 10,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  
  // Section Styles
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  
  // Card Styles
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // Metric Card Styles
  horizontalScroll: {
    marginHorizontal: -20,
    paddingLeft: 20,
  },
  metricCard: {
    width: 150,
    height: 110,
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  metricIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  metricValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricUnit: {
    fontSize: 12,
    fontWeight: '500',
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  
  // Safety Gauge Styles
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginBottom: 20,
    position: 'relative',
  },
  gaugeOuterCircle: {
    width: 200,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E9ECEF',
    overflow: 'hidden',
  },
  gaugeProgress: {
    height: '100%',
    borderRadius: 10,
  },
  gaugeInnerCircle: {
    position: 'absolute',
    alignItems: 'center',
  },
  gaugeScore: {
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 30,
  },
  gaugeLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  gaugeStatus: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  safetyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
  },
  safetyDetailItem: {
    alignItems: 'center',
  },
  safetyDetailLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  safetyDetailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Alert Styles
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertMessage: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  alertLocation: {
    fontSize: 13,
    marginBottom: 2,
  },
  alertTime: {
    fontSize: 12,
  },
  
  // Progress Styles
  progressContainer: {
    marginBottom: 16,
  },
  progressInfo: {
    marginBottom: 12,
  },
  progressDay: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressLocation: {
    fontSize: 14,
    marginTop: 2,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  
  // Map Styles
  mapPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    padding: 20,
  },
  mapPlaceholderText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 8,
  },
  mapLocationText: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  mapButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  mapButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  
  // Timeline Styles
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineIndicator: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineLine: {
    flex: 1,
    width: 2,
    marginTop: 8,
    minHeight: 40,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 4,
  },
  placeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  placeDate: {
    fontSize: 14,
  },
  ratingContainer: {
    marginTop: 6,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '500',
  },
  
  // Safety/SOS Styles
  sosButton: {
    flexDirection: 'row',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sosButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12,
    letterSpacing: 1,
  },
  sosDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  
  // Contact Styles
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  contactAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  contactRelation: {
    fontSize: 14,
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 12,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Safety Tips Styles
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  
  // Modal Styles
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
  
  // Digital ID Card Styles
  idCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  idPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FFF',
    marginTop: -60,
    marginBottom: 16,
  },
  idName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  idNumber: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 20,
  },
  qrContainer: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  qrCode: {
    width: 150,
    height: 150,
  },
  idDetails: {
    alignItems: 'center',
  },
  idValidity: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
    textAlign: 'center',
  },
  idStatus: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  idStatusText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1,
  },
  blockchainInfo: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
    opacity: 0.7,
  },
  
  // SOS Modal Styles
  sosModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 20,
  },
  sosContent: {
    alignItems: 'center',
    padding: 30,
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
  },
  sosIconContainer: {
    marginBottom: 24,
    padding: 20,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  sosTitle: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  sosCountdownText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  sosMessage: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 20,
    marginBottom: 32,
    opacity: 0.9,
  },
  cancelButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  cancelButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  
  // Loading Overlay
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SmartTouristDashboard;