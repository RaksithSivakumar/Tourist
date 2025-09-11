import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  StatusBar,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Animated,
  Platform,
  TextInput,
  FlatList,
} from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';

const { width, height } = Dimensions.get('window');

// Professional Police Theme Colors
const COLORS = {
  light: {
    primary: '#1e3a8a', // Police Blue
    primaryLight: '#dbeafe',
    primaryDark: '#1e40af',
    secondary: '#dc2626', // Emergency Red
    secondaryLight: '#fecaca',
    accent: '#f59e0b', // Warning Yellow
    accentLight: '#fef3c7',
    success: '#059669', // Success Green
    successLight: '#d1fae5',
    background: '#f8fafc',
    backgroundSecondary: '#f1f5f9',
    surface: '#ffffff',
    surfaceElevated: '#ffffff',
    text: '#0f172a',
    textSecondary: '#475569',
    textTertiary: '#64748b',
    border: '#e2e8f0',
    borderLight: '#f1f3f4',
    shadow: '#000000',
    overlay: 'rgba(0,0,0,0.5)',
  },
  dark: {
    primary: '#3b82f6',
    primaryLight: '#1e293b',
    primaryDark: '#1d4ed8',
    secondary: '#ef4444',
    secondaryLight: '#7f1d1d',
    accent: '#f59e0b',
    accentLight: '#451a03',
    success: '#10b981',
    successLight: '#064e3b',
    background: '#0f172a',
    backgroundSecondary: '#1e293b',
    surface: '#1e293b',
    surfaceElevated: '#334155',
    text: '#f8fafc',
    textSecondary: '#cbd5e1',
    textTertiary: '#94a3af',
    border: '#475569',
    borderLight: '#334155',
    shadow: '#000000',
    overlay: 'rgba(0,0,0,0.7)',
  },
};

// Professional Icon Component
const IconComponent = ({ name, size = 24, color = '#000', style = {} }) => {
  const icons = {
    'dashboard': '📊',
    'alert': '🚨',
    'document': '📄',
    'map': '🗺️',
    'officers': '👮',
    'phone': '📞',
    'location': '📍',
    'car': '🚔',
    'helicopter': '🚁',
    'ambulance': '🚑',
    'camera': '📷',
    'message': '💬',
    'search': '🔍',
    'filter': '🔽',
    'close': '✕',
    'check': '✓',
    'warning': '⚠️',
    'info': 'ℹ️',
    'settings': '⚙️',
    'user': '👤',
    'clock': '🕐',
    'stats': '📈',
    'priority-high': '🔴',
    'priority-medium': '🟡',
    'priority-low': '🟢',
    'status-active': '🟢',
    'status-busy': '🟡',
    'status-offline': '🔴',
    'navigation': '🧭',
  };

  return (
    <Text style={[{ fontSize: size, color }, style]}>
      {icons[name] || '•'}
    </Text>
  );
};

// Alert Priority Badge Component
const PriorityBadge = ({ priority, colors }) => {
  const getConfig = () => {
    switch (priority) {
      case 'critical':
        return { color: colors.secondary, bg: colors.secondaryLight, text: 'CRITICAL', icon: 'priority-high' };
      case 'high':
        return { color: colors.accent, bg: colors.accentLight, text: 'HIGH', icon: 'priority-medium' };
      case 'medium':
        return { color: colors.primary, bg: colors.primaryLight, text: 'MEDIUM', icon: 'priority-low' };
      default:
        return { color: colors.success, bg: colors.successLight, text: 'LOW', icon: 'priority-low' };
    }
  };

  const config = getConfig();

  return (
    <View style={[styles.priorityBadge, { backgroundColor: config.bg }]}>
      <IconComponent name={config.icon} size={12} color={config.color} />
      <Text style={[styles.priorityText, { color: config.color }]}>{config.text}</Text>
    </View>
  );
};

// Status Badge Component
const StatusBadge = ({ status, colors }) => {
  const getConfig = () => {
    switch (status) {
      case 'available':
        return { color: colors.success, bg: colors.successLight, text: 'AVAILABLE', icon: 'status-active' };
      case 'on-patrol':
        return { color: colors.primary, bg: colors.primaryLight, text: 'ON PATROL', icon: 'status-active' };
      case 'engaged':
        return { color: colors.accent, bg: colors.accentLight, text: 'ENGAGED', icon: 'status-busy' };
      case 'off-duty':
        return { color: colors.textTertiary, bg: colors.backgroundSecondary, text: 'OFF DUTY', icon: 'status-offline' };
      default:
        return { color: colors.textTertiary, bg: colors.backgroundSecondary, text: 'UNKNOWN', icon: 'status-offline' };
    }
  };

  const config = getConfig();

  return (
    <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
      <IconComponent name={config.icon} size={10} color={config.color} />
      <Text style={[styles.statusText, { color: config.color }]}>{config.text}</Text>
    </View>
  );
};

// Real-time Chart Component
const LiveChart = ({ data, type = 'line', colors }) => {
  const chartData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    datasets: [
      {
        data: [4, 7, 12, 18, 25, 15],
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, // blue
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    color: (opacity = 1) => colors.primary,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  return (
    <View style={[styles.chartContainer, { backgroundColor: colors.surface }]}>
      <Text style={[styles.chartTitle, { color: colors.text }]}>24hr Alert Trends</Text>
      <View style={styles.chartWrapper}>
        <LineChart
          data={chartData}
          width={width - 80}
          height={200}
          chartConfig={chartConfig}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>
    </View>
  );
};

// Heatmap Component
const HeatmapCard = ({ region, riskLevel, density, colors }) => {
  const getRiskColor = () => {
    switch (riskLevel) {
      case 'high': return colors.secondary;
      case 'medium': return colors.accent;
      case 'low': return colors.success;
      default: return colors.textTertiary;
    }
  };

  return (
    <View style={[styles.heatmapCard, { backgroundColor: colors.surface }]}>
      <View style={styles.heatmapHeader}>
        <Text style={[styles.heatmapRegion, { color: colors.text }]}>{region}</Text>
        <View style={[styles.riskIndicator, { backgroundColor: getRiskColor() + '20' }]}>
          <View style={[styles.riskDot, { backgroundColor: getRiskColor() }]} />
          <Text style={[styles.riskLevel, { color: getRiskColor() }]}>{riskLevel.toUpperCase()}</Text>
        </View>
      </View>
      <View style={styles.heatmapMetrics}>
        <View style={styles.metric}>
          <Text style={[styles.metricValue, { color: colors.text }]}>{density}</Text>
          <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Tourists</Text>
        </View>
        <View style={styles.metric}>
          <Text style={[styles.metricValue, { color: colors.text }]}>
            {riskLevel === 'high' ? '8' : riskLevel === 'medium' ? '3' : '1'}
          </Text>
          <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Incidents</Text>
        </View>
      </View>
    </View>
  );
};

// Main Police Dashboard Component
export default function PoliceMonitoringDashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  const colors = darkMode ? COLORS.dark : COLORS.light;

  // Mock Data
  const policeData = {
    station_id: "PS001",
    station_name: "Shillong Police HQ",
    officers_on_duty: [
      { officer_id: "O123", name: "Inspector Sharma", contact: "+91XXXXXXXXXX", status: "on-patrol", location: "Cherrapunji Zone" },
      { officer_id: "O124", name: "Sub-Inspector Patel", contact: "+91YYYYYYYYY", status: "available", location: "HQ Station" },
      { officer_id: "O125", name: "Constable Singh", contact: "+91ZZZZZZZZ", status: "engaged", location: "Tourist Area 3" },
      { officer_id: "O126", name: "Inspector Das", contact: "+91AAAAAAA", status: "off-duty", location: "Off Duty" },
    ],
    active_alerts: [
      {
        alert_id: "A987",
        tourist_id: "T12345",
        tourist_name: "John Smith",
        type: "SOS",
        priority: "critical",
        location: { lat: 25.612, lng: 91.899, address: "Cherrapunji Falls Area" },
        status: "intervention_required",
        timestamp: "2025-09-12T15:00:00Z",
        description: "Tourist sent SOS signal from remote waterfall area"
      },
      {
        alert_id: "A988",
        tourist_id: "T12346",
        tourist_name: "Maria Garcia",
        type: "Geo-fence",
        priority: "high",
        location: { lat: 25.615, lng: 91.905, address: "Restricted Forest Zone" },
        status: "investigating",
        timestamp: "2025-09-12T14:30:00Z",
        description: "Tourist entered restricted area after sunset"
      },
      {
        alert_id: "A989",
        tourist_id: "T12347",
        tourist_name: "Raj Patel",
        type: "Health",
        priority: "medium",
        location: { lat: 25.618, lng: 91.902, address: "Mawlynnong Village" },
        status: "resolved",
        timestamp: "2025-09-12T13:45:00Z",
        description: "High heart rate detected during trekking"
      }
    ],
    efir_records: [
      {
        efir_id: "EFIR001",
        tourist_id: "T12345",
        tourist_name: "John Smith",
        case_type: "Missing Person",
        details: "Tourist unresponsive for 6 hours in forest zone.",
        filed_on: "2025-09-12T16:00:00Z",
        status: "open",
        assigned_officer: "Inspector Sharma",
        priority: "critical"
      },
      {
        efir_id: "EFIR002",
        tourist_id: "T12348",
        tourist_name: "Lisa Chen",
        case_type: "Theft",
        details: "Reported theft of camera equipment at tourist spot.",
        filed_on: "2025-09-12T12:30:00Z",
        status: "in-progress",
        assigned_officer: "Sub-Inspector Patel",
        priority: "medium"
      }
    ],
    heatmaps: [
      {
        region: "Cherrapunji",
        risk_level: "high",
        tourist_density: 120,
        last_updated: "2025-09-12T14:30:00Z"
      },
      {
        region: "Mawlynnong",
        risk_level: "medium",
        tourist_density: 85,
        last_updated: "2025-09-12T14:25:00Z"
      },
      {
        region: "Shillong City",
        risk_level: "low",
        tourist_density: 200,
        last_updated: "2025-09-12T14:20:00Z"
      }
    ],
    resources: {
      vehicles: { total: 12, available: 8, deployed: 4 },
      drones: { total: 6, available: 4, deployed: 2 },
      medical_teams: { total: 4, available: 2, deployed: 2 }
    },
    performance: {
      alerts_today: 47,
      resolved_today: 39,
      avg_response_time: "8.5 min",
      resolution_rate: "82.9%"
    }
  };

  // Animate pulse for critical alerts
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  // Tab Button Component
  const TabButton = ({ name, label, icon, badgeCount }) => {
    const isActive = selectedTab === name;
    
    return (
      <TouchableOpacity
        style={[styles.tabButton, isActive && { backgroundColor: colors.primaryLight }]}
        onPress={() => setSelectedTab(name)}
        activeOpacity={0.7}
      >
        <View style={styles.tabIconContainer}>
          <IconComponent
            name={icon}
            size={20}
            color={isActive ? colors.primary : colors.textSecondary}
          />
          {badgeCount > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
              <Text style={styles.badgeText}>{badgeCount}</Text>
            </View>
          )}
        </View>
        <Text style={[
          styles.tabText,
          { color: isActive ? colors.primary : colors.textSecondary }
        ]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  // Dashboard Tab Content
  const renderDashboard = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      {/* Quick Stats */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
          <IconComponent name="alert" size={24} color={colors.secondary} />
          <Text style={[styles.statValue, { color: colors.text }]}>{policeData.performance.alerts_today}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Alerts Today</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
          <IconComponent name="check" size={24} color={colors.success} />
          <Text style={[styles.statValue, { color: colors.text }]}>{policeData.performance.resolved_today}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Resolved</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
          <IconComponent name="clock" size={24} color={colors.accent} />
          <Text style={[styles.statValue, { color: colors.text }]}>{policeData.performance.avg_response_time}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Avg Response</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
          <IconComponent name="stats" size={24} color={colors.primary} />
          <Text style={[styles.statValue, { color: colors.text }]}>{policeData.performance.resolution_rate}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Resolution Rate</Text>
        </View>
      </View>

      {/* Live Alerts Panel */}
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Live Alerts</Text>
          <TouchableOpacity style={[styles.refreshButton, { backgroundColor: colors.primaryLight }]}>
            <IconComponent name="settings" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
        
        {policeData.active_alerts.slice(0, 3).map((alert) => (
          <TouchableOpacity
            key={alert.alert_id}
            style={[styles.alertItem, { backgroundColor: colors.backgroundSecondary }]}
            onPress={() => setSelectedAlert(alert as any)}
          >
            <View style={styles.alertLeft}>
              <Animated.View style={[
                styles.alertIndicator,
                { backgroundColor: alert.priority === 'critical' ? colors.secondary : colors.accent },
                alert.priority === 'critical' && { transform: [{ scale: pulseAnim }] }
              ]} />
              <View style={styles.alertContent}>
                <Text style={[styles.alertTitle, { color: colors.text }]}>
                  {alert.type} - {alert.tourist_name}
                </Text>
                <Text style={[styles.alertLocation, { color: colors.textSecondary }]}>
                  📍 {alert.location.address}
                </Text>
                <Text style={[styles.alertTime, { color: colors.textTertiary }]}>
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </Text>
              </View>
            </View>
            <View style={styles.alertRight}>
              <PriorityBadge priority={alert.priority} colors={colors} />
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primary }]}>
                <IconComponent name="navigation" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Resource Status */}
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Resource Status</Text>
        <View style={styles.resourceGrid}>
          <View style={styles.resourceItem}>
            <IconComponent name="car" size={20} color={colors.primary} />
            <Text style={[styles.resourceLabel, { color: colors.textSecondary }]}>Vehicles</Text>
            <Text style={[styles.resourceValue, { color: colors.text }]}>
              {policeData.resources.vehicles.available}/{policeData.resources.vehicles.total}
            </Text>
          </View>
          <View style={styles.resourceItem}>
            <IconComponent name="helicopter" size={20} color={colors.accent} />
            <Text style={[styles.resourceLabel, { color: colors.textSecondary }]}>Drones</Text>
            <Text style={[styles.resourceValue, { color: colors.text }]}>
              {policeData.resources.drones.available}/{policeData.resources.drones.total}
            </Text>
          </View>
          <View style={styles.resourceItem}>
            <IconComponent name="ambulance" size={20} color={colors.success} />
            <Text style={[styles.resourceLabel, { color: colors.textSecondary }]}>Medical</Text>
            <Text style={[styles.resourceValue, { color: colors.text }]}>
              {policeData.resources.medical_teams.available}/{policeData.resources.medical_teams.total}
            </Text>
          </View>
        </View>
      </View>

      {/* Live Chart */}
      <LiveChart data={null} colors={colors} />
    </ScrollView>
  );

  // Alerts Tab Content
  const renderAlerts = () => (
    <View style={styles.tabContent}>
      {/* Search and Filter */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
        <View style={[styles.searchInput, { backgroundColor: colors.backgroundSecondary }]}>
          <IconComponent name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.textInput, { color: colors.text }]}
            placeholder="Search alerts..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.primary }]}>
          <IconComponent name="filter" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Alerts List */}
      <FlatList
        data={policeData.active_alerts}
        keyExtractor={(item) => item.alert_id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.alertsList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.fullAlertItem, { backgroundColor: colors.surface }]}
            onPress={() => setSelectedAlert(item as any)}
          >
            <View style={styles.alertHeader}>
              <View style={styles.alertTitleRow}>
                <Text style={[styles.alertId, { color: colors.textTertiary }]}>#{item.alert_id}</Text>
                <PriorityBadge priority={item.priority} colors={colors} />
              </View>
              <Text style={[styles.alertMainTitle, { color: colors.text }]}>
                {item.type} Alert - {item.tourist_name}
              </Text>
            </View>
            
            <Text style={[styles.alertDescription, { color: colors.textSecondary }]}>
              {item.description}
            </Text>
            
            <View style={styles.alertFooter}>
              <View style={styles.alertLocationInfo}>
                <IconComponent name="location" size={16} color={colors.textSecondary} />
                <Text style={[styles.alertLocationText, { color: colors.textSecondary }]}>
                  {item.location.address}
                </Text>
              </View>
              <Text style={[styles.alertTimestamp, { color: colors.textTertiary }]}>
                {new Date(item.timestamp).toLocaleString()}
              </Text>
            </View>
            
            <View style={styles.quickActions}>
              <TouchableOpacity style={[styles.quickActionButton, { backgroundColor: colors.primary }]}>
                <IconComponent name="navigation" size={16} color="#FFFFFF" />
                <Text style={styles.quickActionText}>Navigate</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.quickActionButton, { backgroundColor: colors.success }]}>
                <IconComponent name="phone" size={16} color="#FFFFFF" />
                <Text style={styles.quickActionText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.quickActionButton, { backgroundColor: colors.accent }]}>
                <IconComponent name="car" size={16} color="#FFFFFF" />
                <Text style={styles.quickActionText}>Dispatch</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  // E-FIR Tab Content
  const renderEFIR = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>E-FIR Records</Text>
          <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]}>
            <IconComponent name="document" size={16} color="#FFFFFF" />
            <Text style={styles.addButtonText}>New FIR</Text>
          </TouchableOpacity>
        </View>

        {policeData.efir_records.map((record) => (
          <View key={record.efir_id} style={[styles.firItem, { backgroundColor: colors.backgroundSecondary }]}>
            <View style={styles.firHeader}>
              <Text style={[styles.firId, { color: colors.text }]}>#{record.efir_id}</Text>
              <View style={[styles.firStatus, { 
                backgroundColor: record.status === 'open' ? colors.secondaryLight : 
                               record.status === 'in-progress' ? colors.accentLight : colors.successLight 
              }]}>
                <Text style={[styles.firStatusText, { 
                  color: record.status === 'open' ? colors.secondary : 
                         record.status === 'in-progress' ? colors.accent : colors.success 
                }]}>
                  {record.status.toUpperCase()}
                </Text>
              </View>
            </View>
            
            <Text style={[styles.firTitle, { color: colors.text }]}>
              {record.case_type} - {record.tourist_name}
            </Text>
            <Text style={[styles.firDetails, { color: colors.textSecondary }]}>
              {record.details}
            </Text>
            
            <View style={styles.firFooter}>
              <Text style={[styles.firOfficer, { color: colors.textTertiary }]}>
                Assigned: {record.assigned_officer}
              </Text>
              <Text style={[styles.firDate, { color: colors.textTertiary }]}>
                Filed: {new Date(record.filed_on).toLocaleDateString()}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  // Heatmaps Tab Content
  const renderHeatmaps = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Risk Heatmaps</Text>
        
        <View style={styles.heatmapGrid}>
          {policeData.heatmaps.map((heatmap, index) => (
            <HeatmapCard
              key={index}
              region={heatmap.region}
              riskLevel={heatmap.risk_level}
              density={heatmap.tourist_density}
              colors={colors}
            />
          ))}
        </View>
      </View>

      {/* Interactive Map Placeholder */}
      <View style={[styles.card, { backgroundColor: colors.surface, padding: 0 }]}>
        <View style={[styles.mapContainer, { backgroundColor: colors.backgroundSecondary }]}>
          <Text style={[styles.mapPlaceholder, { color: colors.text }]}>
            🗺️ Interactive Risk Heatmap
          </Text>
          <Text style={[styles.mapSubtext, { color: colors.textSecondary }]}>
            Real-time tourist density and risk visualization
          </Text>
          <TouchableOpacity style={[styles.mapButton, { backgroundColor: colors.primary }]}>
            <Text style={styles.mapButtonText}>Open Full Map</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  // Officers Tab Content
  const renderOfficers = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Officers on Duty</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {policeData.officers_on_duty.filter(o => o.status !== 'off-duty').length} Active
          </Text>
        </View>

        {policeData.officers_on_duty.map((officer) => (
          <View key={officer.officer_id} style={[styles.officerItem, { backgroundColor: colors.backgroundSecondary }]}>
            <View style={[styles.officerAvatar, { backgroundColor: colors.primaryLight }]}>
              <IconComponent name="officers" size={24} color={colors.primary} />
            </View>
            
            <View style={styles.officerInfo}>
              <Text style={[styles.officerName, { color: colors.text }]}>{officer.name}</Text>
              <Text style={[styles.officerLocation, { color: colors.textSecondary }]}>
                📍 {officer.location}
              </Text>
              <Text style={[styles.officerContact, { color: colors.textTertiary }]}>
                {officer.contact}
              </Text>
            </View>
            
            <View style={styles.officerActions}>
              <StatusBadge status={officer.status} colors={colors} />
              <View style={styles.officerButtons}>
                <TouchableOpacity style={[styles.officerActionButton, { backgroundColor: colors.success }]}>
                  <IconComponent name="phone" size={16} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.officerActionButton, { backgroundColor: colors.primary }]}>
                  <IconComponent name="message" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Shift Schedule */}
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Today's Shifts</Text>
        
        <View style={styles.shiftTimeline}>
          {[
            { time: '06:00-14:00', shift: 'Morning', officers: 8, status: 'completed' },
            { time: '14:00-22:00', shift: 'Evening', officers: 6, status: 'active' },
            { time: '22:00-06:00', shift: 'Night', officers: 4, status: 'upcoming' },
          ].map((shift, index) => (
            <View key={index} style={styles.shiftItem}>
              <View style={[styles.shiftDot, { 
                backgroundColor: shift.status === 'active' ? colors.success : 
                               shift.status === 'completed' ? colors.textTertiary : colors.accent 
              }]} />
              <View style={styles.shiftInfo}>
                <Text style={[styles.shiftTime, { color: colors.text }]}>{shift.time}</Text>
                <Text style={[styles.shiftName, { color: colors.textSecondary }]}>{shift.shift} Shift</Text>
                <Text style={[styles.shiftOfficers, { color: colors.textTertiary }]}>
                  {shift.officers} officers assigned
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  // Alert Detail Modal
  const AlertDetailModal = () => (
    <Modal
      visible={selectedAlert !== null}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setSelectedAlert(null)}
    >
      <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Alert Details</Text>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.backgroundSecondary }]}
              onPress={() => setSelectedAlert(null)}
            >
              <IconComponent name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {selectedAlert && (
            <ScrollView style={styles.modalBody}>
              <View style={styles.alertDetailHeader}>
                <Text style={[styles.alertDetailId, { color: colors.textTertiary }]}>
                  #{selectedAlert.alert_id}
                </Text>
                <PriorityBadge priority={selectedAlert.priority} colors={colors} />
              </View>

              <Text style={[styles.alertDetailTitle, { color: colors.text }]}>
                {selectedAlert.type} Alert - {selectedAlert.tourist_name}
              </Text>

              <Text style={[styles.alertDetailDescription, { color: colors.textSecondary }]}>
                {selectedAlert.description}
              </Text>

              {/* Location Info */}
              <View style={[styles.infoSection, { backgroundColor: colors.backgroundSecondary }]}>
                <Text style={[styles.infoSectionTitle, { color: colors.text }]}>Location</Text>
                <Text style={[styles.infoSectionContent, { color: colors.textSecondary }]}>
                  📍 {selectedAlert.location.address}
                </Text>
                <Text style={[styles.coordinates, { color: colors.textTertiary }]}>
                  Lat: {selectedAlert.location.lat}, Lng: {selectedAlert.location.lng}
                </Text>
              </View>

              {/* Timeline */}
              <View style={[styles.infoSection, { backgroundColor: colors.backgroundSecondary }]}>
                <Text style={[styles.infoSectionTitle, { color: colors.text }]}>Timeline</Text>
                <Text style={[styles.infoSectionContent, { color: colors.textSecondary }]}>
                  Alert received: {new Date(selectedAlert.timestamp).toLocaleString()}
                </Text>
                <Text style={[styles.infoSectionContent, { color: colors.textSecondary }]}>
                  Status: {selectedAlert.status.replace('_', ' ').toUpperCase()}
                </Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtonsGrid}>
                <TouchableOpacity style={[styles.primaryActionButton, { backgroundColor: colors.primary }]}>
                  <IconComponent name="navigation" size={20} color="#FFFFFF" />
                  <Text style={styles.primaryActionText}>Navigate to Location</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.secondaryActionButton, { backgroundColor: colors.success }]}>
                  <IconComponent name="phone" size={18} color="#FFFFFF" />
                  <Text style={styles.secondaryActionText}>Call Tourist</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.secondaryActionButton, { backgroundColor: colors.accent }]}>
                  <IconComponent name="car" size={18} color="#FFFFFF" />
                  <Text style={styles.secondaryActionText}>Dispatch Unit</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.secondaryActionButton, { backgroundColor: colors.secondary }]}>
                  <IconComponent name="ambulance" size={18} color="#FFFFFF" />
                  <Text style={styles.secondaryActionText}>Medical Team</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={[styles.badgeContainer, { backgroundColor: colors.primary }]}>
              <IconComponent name="officers" size={24} color="#FFFFFF" />
            </View>
            <View>
              <Text style={[styles.stationName, { color: colors.text }]}>
                {policeData.station_name}
              </Text>
              <Text style={[styles.stationId, { color: colors.textSecondary }]}>
                Station ID: {policeData.station_id}
              </Text>
            </View>
          </View>
          
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={[styles.headerButton, { backgroundColor: colors.backgroundSecondary }]}
              onPress={() => setDarkMode(!darkMode)}
            >
              <IconComponent
                name={darkMode ? "white-balance-sunny" : "weather-night"}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.headerButton, { backgroundColor: colors.backgroundSecondary }]}>
              <IconComponent name="settings" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
        <TabButton 
          name="dashboard" 
          label="Dashboard" 
          icon="dashboard" 
          badgeCount={0} 
        />
        <TabButton 
          name="alerts" 
          label="Alerts" 
          icon="alert" 
          badgeCount={policeData.active_alerts.filter(a => a.priority === 'critical').length} 
        />
        <TabButton 
          name="efir" 
          label="E-FIR" 
          icon="document" 
          badgeCount={policeData.efir_records.filter(r => r.status === 'open').length} 
        />
        <TabButton 
          name="heatmaps" 
          label="Heatmaps" 
          icon="map" 
          badgeCount={0} 
        />
        <TabButton 
          name="officers" 
          label="Officers" 
          icon="officers" 
          badgeCount={0} 
        />
      </View>

      {/* Tab Content */}
      <View style={styles.content}>
        {selectedTab === 'dashboard' && renderDashboard()}
        {selectedTab === 'alerts' && renderAlerts()}
        {selectedTab === 'efir' && renderEFIR()}
        {selectedTab === 'heatmaps' && renderHeatmaps()}
        {selectedTab === 'officers' && renderOfficers()}
      </View>

      {/* Alert Detail Modal */}
      <AlertDetailModal />
    </SafeAreaView>
  );
}

// Comprehensive StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // Header Styles
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  badgeContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stationName: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  stationId: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Tab Navigation
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 4,
    paddingVertical: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    position: 'relative',
  },
  tabIconContainer: {
    position: 'relative',
    marginBottom: 4,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },

  // Content Area
  content: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  // Card Styles
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 56) / 2,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
  },

  // Alert Items
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  alertLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  alertIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
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
  alertRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  
  // Priority Badge
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Status Badge
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 3,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Action Buttons
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Resource Grid
  resourceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  resourceItem: {
    alignItems: 'center',
    gap: 8,
  },
  resourceLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  resourceValue: {
    fontSize: 16,
    fontWeight: '700',
  },

  // Chart Container
  chartContainer: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  chartWrapper: {
    alignItems: 'center',
  },
  chartPlaceholder: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 60,
  },

  // Search Container
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Full Alert Item (for alerts tab)
  alertsList: {
    padding: 16,
  },
  fullAlertItem: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  alertHeader: {
    marginBottom: 12,
  },
  alertTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertId: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  alertMainTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  alertDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  alertFooter: {
    marginBottom: 16,
  },
  alertLocationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  alertLocationText: {
    fontSize: 13,
    fontWeight: '500',
  },
  alertTimestamp: {
    fontSize: 12,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  quickActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  // E-FIR Items
  firItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  firHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  firId: {
    fontSize: 14,
    fontWeight: '700',
  },
  firStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  firStatusText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  firTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  firDetails: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  firFooter: {
    gap: 4,
  },
  firOfficer: {
    fontSize: 12,
    fontWeight: '500',
  },
  firDate: {
    fontSize: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },

  // Heatmap Cards
  heatmapGrid: {
    gap: 16,
  },
  heatmapCard: {
    borderRadius: 12,
    padding: 16,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  heatmapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  heatmapRegion: {
    fontSize: 16,
    fontWeight: '700',
  },
  riskIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 6,
  },
  riskDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  riskLevel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  heatmapMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },

  // Map Container
  mapContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  mapPlaceholder: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  mapSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  mapButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  mapButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // Officer Items
  officerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  officerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  officerInfo: {
    flex: 1,
  },
  officerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  officerLocation: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 2,
  },
  officerContact: {
    fontSize: 12,
  },
  officerActions: {
    alignItems: 'flex-end',
    gap: 12,
  },
  officerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  officerActionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Shift Timeline
  shiftTimeline: {
    gap: 16,
  },
  shiftItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shiftDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 16,
  },
  shiftInfo: {
    flex: 1,
  },
  shiftTime: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  shiftName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  shiftOfficers: {
    fontSize: 12,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    maxHeight: height * 0.8,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    padding: 20,
  },
  alertDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  alertDetailId: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  alertDetailTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  alertDetailDescription: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  infoSection: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  infoSectionContent: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
  },
  coordinates: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  actionButtonsGrid: {
    gap: 12,
    marginTop: 8,
  },
  primaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  secondaryActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});