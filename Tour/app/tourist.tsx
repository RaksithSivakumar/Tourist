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
  Animated,
  Easing,
  Platform,
  ActivityIndicator,
  Linking,
} from 'react-native';

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
const GradientView = ({ colors, children, className = "" }) => {
  return (
    <View className={`overflow-hidden ${className}`}>
      <View className="absolute inset-0 opacity-90" style={{ backgroundColor: colors[0] }} />
      <View className="absolute inset-0 opacity-70" style={{ backgroundColor: colors[1] }} />
      {children}
    </View>
  );
};

// Icon Component using MaterialCommunityIcons naming
const IconComponent = ({ name, size = 24, color = '#000', className = "" }) => {
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
    <Text className={className} style={{ fontSize: size, color }}>
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
    <View className="items-center justify-center p-5 mb-5 relative">
      <View className="w-48 h-5 rounded-lg overflow-hidden" style={{ backgroundColor: '#E9ECEF' }}>
        <Animated.View 
          className="h-full rounded-lg"
          style={{
            width: animatedValue.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%']
            }),
            backgroundColor: gaugeColor
          }}
        />
      </View>
      <View className="absolute items-center">
        <Text className="text-4xl font-bold mt-7" style={{ color: colors.text }}>{score}</Text>
        <Text className="text-sm mt-1" style={{ color: colors.textSecondary }}>Safety Score</Text>
        <Text className="text-base font-semibold mt-2" style={{ color: gaugeColor }}>{status}</Text>
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
    <Animated.View 
      className="w-36 h-28 rounded-2xl p-4 mr-4 shadow-sm"
      style={{
        backgroundColor: colors.card,
        transform: [{ scale: scaleValue }],
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View className="w-10 h-10 rounded-xl justify-center items-center mb-3" style={{ backgroundColor: color }}>
        <IconComponent name={icon} size={20} color={colors.white} />
      </View>
      <View className="flex-1 justify-end">
        <Text className="text-xl font-bold mb-1" style={{ color: colors.text }}>
          {value}
          <Text className="text-xs font-medium" style={{ color: colors.textSecondary }}> {unit}</Text>
        </Text>
        <Text className="text-xs font-medium" style={{ color: colors.textSecondary }}>{label}</Text>
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
        className="flex-1 items-center"
        onPress={() => {
          setSelectedTab(name);
          Animated.spring(slideAnim, {
            toValue: name === 'overview' ? 0 : name === 'itinerary' ? 1 : 2,
            useNativeDriver: true,
          }).start();
        }}
        activeOpacity={0.7}
      >
        <View className={`flex-row items-center py-3 px-4 rounded-xl justify-center ${
          isActive 
            ? 'border-b-2' 
            : ''
        }`} style={{
          backgroundColor: isActive ? colors.primary : 'transparent',
          borderBottomColor: isActive ? colors.white : 'transparent',
          borderBottomWidth: isActive ? 3 : 0,
        }}>
          <IconComponent
            name={icon}
            size={22}
            color={isActive ? colors.white : colors.textSecondary}
          />
          <Text className={`ml-1.5 text-xs font-semibold ${
            isActive ? 'text-white' : ''
          }`} style={{
            color: isActive ? colors.white : colors.textSecondary
          }}>
            {label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Overview Tab
  const renderOverview = () => (
    <ScrollView showsVerticalScrollIndicator={false} className="pb-8 px-5">
      {/* Health Metrics Section */}
      <View className="mb-5">
        <Text className="text-xl font-bold mb-4 px-1" style={{ color: colors.text }}>Health Metrics</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5 pl-5">
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
      <View className="rounded-2xl p-5 mb-5 shadow-sm" style={{ backgroundColor: colors.card }}>
        <Text className="text-lg font-bold" style={{ color: colors.text }}>Safety Overview</Text>
        <SafetyGauge score={touristData.safety_score} colors={colors} />
        <View className="flex-row justify-around pt-5">
          <View className="items-center">
            <Text className="text-xs mb-1" style={{ color: colors.textSecondary }}>Location Status</Text>
            <Text className="text-sm font-semibold" style={{ color: colors.success }}>Safe Zone</Text>
          </View>
          <View className="items-center">
            <Text className="text-xs mb-1" style={{ color: colors.textSecondary }}>Health Status</Text>
            <Text className="text-sm font-semibold text-red-700">Normal</Text>
          </View>
        </View>
      </View>
      
      {/* Recent Alerts Section */}
      <View className="rounded-2xl p-5 mb-5 shadow-sm" style={{ backgroundColor: colors.card }}>
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold" style={{ color: colors.text }}>Recent Alerts</Text>
          <IconComponent name="bell" size={20} color={colors.textSecondary} />
        </View>
        {touristData.alerts.map((alert, index) => (
          <View key={index} className="flex-row items-center p-4 rounded-xl mb-3 border-l-4" style={{
            backgroundColor: colors.card,
            borderLeftColor: alert.severity === 'high' ? colors.danger : 
                           alert.severity === 'medium' ? colors.warning : colors.success
          }}>
            <View className="flex-1">
              <Text className="text-sm font-semibold mb-1" style={{ color: colors.text }}>{alert.message}</Text>
              <Text className="text-xs mb-0.5" style={{ color: colors.textTertiary }}>{alert.location}</Text>
              <Text className="text-xs" style={{ color: colors.textSecondary }}>
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
    <ScrollView showsVerticalScrollIndicator={false} className="pb-8 px-5">
      {/* Trip Progress */}
      <View className="rounded-2xl p-5 mb-5 shadow-sm" style={{ backgroundColor: colors.card }}>
        <Text className="text-lg font-bold" style={{ color: colors.text }}>Trip Progress</Text>
        <View className="mb-4">
          <View className="mb-3">
            <Text className="text-lg font-bold" style={{ color: colors.text }}>
              Day {touristData.trip_itinerary.current_day} of {touristData.trip_itinerary.total_days}
            </Text>
            <Text className="text-sm mt-0.5" style={{ color: colors.textSecondary }}>
              Currently in {touristData.location}
            </Text>
          </View>
          <View className="h-2 rounded-sm overflow-hidden" style={{ backgroundColor: colors.border }}>
            <View 
              className="h-full rounded-sm" 
              style={{
                backgroundColor: colors.primary,
                width: `${(touristData.trip_itinerary.current_day / touristData.trip_itinerary.total_days) * 100}%`
              }}
            />
          </View>
        </View>
      </View>

      {/* Map Section */}
      <View className="rounded-2xl mb-5 overflow-hidden shadow-sm" style={{ backgroundColor: colors.card }}>
        <View className="h-48 justify-center items-center rounded-2xl p-5" style={{ backgroundColor: colors.background }}>
          <IconComponent name="map" size={40} color={colors.textSecondary} />
          <Text className="text-base font-semibold mt-2 mb-2" style={{ color: colors.text }}>
            Interactive Map View
          </Text>
          <Text className="text-sm mb-4 text-center" style={{ color: colors.textSecondary }}>
            Last Known Location: {touristData.wearable_iot.last_location.address}
          </Text>
          <TouchableOpacity className="px-5 py-2.5 rounded-2xl" style={{ backgroundColor: colors.primary }}>
            <Text className="text-white font-semibold">Open in Maps</Text>
          </TouchableOpacity>
        </View>
      </View>
        
      {/* Itinerary Timeline */}
      <View className="rounded-2xl p-5 mb-5 shadow-sm" style={{ backgroundColor: colors.card }}>
        <Text className="text-lg font-bold" style={{ color: colors.text }}>Trip Itinerary</Text>
        {touristData.trip_itinerary.places_planned.map((place, index) => (
          <View key={index} className="flex-row mb-5">
            <View className="items-center mr-4">
              <View 
                className="w-8 h-8 rounded-2xl justify-center items-center"
                style={{ backgroundColor: place.visited ? colors.success : colors.border }}
              >
                <IconComponent 
                  name={place.visited ? "check-circle" : "circle-outline"} 
                  size={16} 
                  color={place.visited ? colors.white : colors.textSecondary} 
                />
              </View>
              {index < touristData.trip_itinerary.places_planned.length - 1 && (
                <View className="flex-1 w-0.5 mt-2 min-h-10" style={{ backgroundColor: colors.border }} />
              )}
            </View>
            <View className="flex-1 pt-1">
              <Text className="text-base font-semibold mb-1" style={{ color: colors.text }}>{place.name}</Text>
              <Text className="text-sm" style={{ color: colors.textSecondary }}>
                {new Date(place.date).toLocaleDateString()}
              </Text>
              {place.visited && place.rating > 0 && (
                <View className="mt-1.5">
                  <Text className="text-xs font-medium" style={{ color: colors.warning }}>
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
    <ScrollView showsVerticalScrollIndicator={false} className="pb-8 px-5">
      {/* Emergency SOS Section */}
      <View className="rounded-2xl p-5 mb-5 shadow-sm" style={{ backgroundColor: colors.card }}>
        <Text className="text-lg font-bold" style={{ color: colors.text }}>Emergency Services</Text>
        <TouchableOpacity 
          className="flex-row py-4.5 px-6 rounded-2xl items-center justify-center mb-3 shadow-lg" 
          style={{ backgroundColor: colors.danger }}
          onPress={triggerSOS}
          activeOpacity={0.8}
        >
          <IconComponent name="alert" size={24} color={colors.white} />
          <Text className="text-white text-base font-bold ml-3 tracking-wider">TRIGGER EMERGENCY SOS</Text>
        </TouchableOpacity>
        <Text className="text-sm text-center leading-5" style={{ color: colors.textSecondary }}>
          This will immediately notify emergency services and your emergency contacts with your current location.
        </Text>
      </View>
      
      {/* Emergency Contacts */}
      <View className="rounded-2xl p-5 mb-5 shadow-sm" style={{ backgroundColor: colors.card }}>
        <Text className="text-lg font-bold" style={{ color: colors.text }}>Emergency Contacts</Text>
        {touristData.contact_info.emergency_contacts.map((contact, index) => (
          <TouchableOpacity 
            key={index} 
            className="flex-row items-center p-4 rounded-xl mb-3"
            style={{ backgroundColor: colors.background }}
            onPress={() => {
              if (contact.phone && contact.phone !== '112') {
                Linking.openURL(`tel:${contact.phone}`);
              } else {
                Alert.alert('Emergency Call', 'Calling emergency services...');
              }
            }}
            activeOpacity={0.7}
          >
            <View className="w-12 h-12 rounded-3xl justify-center items-center mr-4" style={{ backgroundColor: colors.primary }}>
              <Text className="text-lg">{contact.avatar}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold mb-0.5" style={{ color: colors.text }}>{contact.name}</Text>
              <Text className="text-sm mb-0.5" style={{ color: colors.textSecondary }}>{contact.relation}</Text>
              <Text className="text-xs" style={{ color: colors.textTertiary }}>{contact.phone}</Text>
            </View>
            <View className="w-10 h-10 rounded-2xl justify-center items-center" style={{ backgroundColor: colors.success }}>
              <IconComponent name="phone" size={20} color={colors.white} />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Safety Tips */}
      <View className="rounded-2xl p-5 mb-5 shadow-sm" style={{ backgroundColor: colors.card }}>
        <Text className="text-lg font-bold" style={{ color: colors.text }}>Safety Tips</Text>
        {[
          "Keep your device charged above 20%",
          "Share your location with trusted contacts",
          "Avoid isolated areas after dark",
          "Keep emergency contact numbers handy",
          "Inform someone about your travel plans"
        ].map((tip, index) => (
          <View key={index} className="flex-row items-start mb-3">
            <IconComponent name="information" size={16} color={colors.primary} className="mr-3 mt-0.5" />
            <Text className="flex-1 text-sm leading-5" style={{ color: colors.textSecondary }}>{tip}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.primary} />
      
      {/* Header */}
      <GradientView
        colors={[colors.primary, colors.primaryLight]}
        className="px-5 py-5"
        style={{ paddingTop: Platform.OS === 'ios' ? 50 : 30 }}
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center flex-1">
            <Image 
              source={{ uri: touristData.profile_pic }} 
              className="w-14 h-14 rounded-3xl mr-4 border-4 border-white/30"
            />
            <View>
              <Text className="text-sm font-medium text-white/80">Welcome back,</Text>
              <Text className="text-xl font-bold mt-0.5 text-white">{touristData.name}</Text>
              <View className="flex-row items-center mt-1">
                <IconComponent name="map-marker" size={14} color={colors.white} />
                <Text className="text-xs ml-1 text-white/80">{touristData.location}</Text>
              </View>
            </View>
          </View>
          <View className="flex-row items-center">
            <TouchableOpacity 
              className="w-10 h-10 rounded-2xl justify-center items-center ml-2.5 bg-white/20"
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
              className="w-10 h-10 rounded-2xl justify-center items-center ml-2.5 bg-white/20" 
              onPress={() => setShowDigitalID(true)}
              activeOpacity={0.7}
            >
              <IconComponent name="qrcode" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </GradientView>

      {/* Tab Navigation */}
      <View className="flex-row mx-5 -mt-5 rounded-2xl p-1.5 shadow-md" style={{ backgroundColor: colors.card }}>
        <TabButton name="overview" label="Overview" icon="view-dashboard" />
        <TabButton name="itinerary" label="Itinerary" icon="map-marker" />
        <TabButton name="safety" label="Safety" icon="shield" />
      </View>
      
      {/* Content */}
      <View className="flex-1 pt-2.5">
        {selectedTab === 'overview' && renderOverview()}
        {selectedTab === 'itinerary' && renderItinerary()}
        {selectedTab === 'safety' && renderSafety()}
      </View>

      {/* Digital ID Modal */}
      <Modal visible={showDigitalID} animationType="slide" transparent={true} onRequestClose={() => setShowDigitalID(false)}>
        <View className="flex-1 justify-center items-center bg-black/70 p-5">
          <View className="w-full max-w-sm rounded-2xl p-6" style={{ 
            backgroundColor: colors.card,
            maxHeight: height * 0.8
          }}>
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold" style={{ color: colors.text }}>Digital Tourist ID</Text>
              <TouchableOpacity 
                onPress={() => setShowDigitalID(false)}
                className="w-8 h-8 rounded-2xl justify-center items-center bg-black/10"
              >
                <IconComponent name="close" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <GradientView
              colors={[colors.primary, colors.secondary]}
              className="rounded-2xl p-6 items-center shadow-2xl"
            >
              <Image 
                source={{ uri: touristData.profile_pic }} 
                className="w-24 h-24 rounded-3xl border-4 border-white -mt-15 mb-4"
              />
              <Text className="text-2xl font-bold text-white mb-1">{touristData.name}</Text>
              <Text className="text-base text-white/80 mb-5">ID: {touristData.tourist_id}</Text>
              
              <View className="bg-white p-4 rounded-xl mb-5">
                <Image source={{ uri: touristData.digital_id.qr_code }} className="w-36 h-36" />
              </View>
              
              <View className="items-center">
                <Text className="text-sm text-white/90 mb-3 text-center">
                  Valid: {new Date(touristData.digital_id.validity_start).toLocaleDateString()} - {new Date(touristData.digital_id.validity_end).toLocaleDateString()}
                </Text>
                <View className="px-4 py-2 rounded-2xl" style={{ backgroundColor: colors.success }}>
                  <Text className="text-white font-bold text-xs tracking-wider">✓ {touristData.digital_id.status.toUpperCase()}</Text>
                </View>
              </View>
            </GradientView>
            
            <Text className="text-xs text-center mt-4 opacity-70" style={{ color: colors.textSecondary }}>
              Secured by blockchain: {touristData.digital_id.blockchain_txn_id}
            </Text>
          </View>
        </View>
      </Modal>

      {/* SOS Modal */}
      <Modal visible={showSOSModal} animationType="fade" transparent={true}>
        <View className="flex-1 justify-center items-center bg-black/80 p-5">
          <GradientView
            colors={[colors.danger, colors.warning]}
            className="items-center p-8 rounded-2xl w-full max-w-sm"
          >
            <Animated.View className="mb-6 p-5 rounded-3xl bg-white/20">
              <IconComponent name="alert" size={80} color={colors.white} />
            </Animated.View>
            <Text className="text-white text-3xl font-bold text-center mb-4">🚨 EMERGENCY SOS</Text>
            <Text className="text-white text-xl font-semibold text-center mb-4">
              {sosCountdown > 0 ? `Activating in ${sosCountdown}...` : 'ACTIVATED!'}
            </Text>
            <Text className="text-white text-center text-base leading-6 px-5 mb-8 opacity-90">
              {sosCountdown > 0 
                ? "Emergency services will be notified. Cancel if this was accidental."
                : "Help is on the way! Emergency services and contacts have been notified."
              }
            </Text>
            {sosCountdown > 0 && (
              <TouchableOpacity 
                className="bg-white/20 px-8 py-3 rounded-3xl border-2 border-white"
                onPress={() => {
                  setShowSOSModal(false);
                  setSOSCountdown(3);
                }}
              >
                <Text className="text-white font-bold text-base tracking-wider">CANCEL</Text>
              </TouchableOpacity>
            )}
          </GradientView>
        </View>
      </Modal>

      {/* Loading Overlay */}
      {isLoading && (
        <View className="absolute inset-0 justify-center items-center bg-black/50">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="mt-4 text-base font-medium" style={{ color: colors.text }}>Loading...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default SmartTouristDashboard;