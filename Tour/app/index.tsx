import { Redirect, useSegments } from 'expo-router';
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useAppSelector } from '@/store';

export default function RoleRouter() {
  const { isAuthenticated, role } = useAppSelector((s) => s.auth);
  const segments = useSegments();


  // Check if user is in auth group
  const inAuthGroup = segments[0] === '(auth)';
  
  // Helper function to get role-based redirect path
  const getRoleRedirectPath = (userRole: string) => {
    switch (userRole) {
      case 'tourist':
        return '/tourist';
      case 'police':
        return '/police';
      case 'hotel':
        return '/hotel';
      case 'airport':
        return '/airport';
      default:
        return '/tourist'; // Default fallback
    }
  };

  // Authentication logic
  if (isAuthenticated && role) {
    // User is authenticated and has a role
    if (inAuthGroup) {
      // User is authenticated but trying to access auth pages, redirect to their dashboard
      return <Redirect href={getRoleRedirectPath(role)} />;
    }
    
    // Check if user is in the correct role-based route
    const expectedRoleRoute = role;
    const currentRoleRoute = segments[0];
    
    // If user is not in their role-specific route and not in auth, redirect them
    if (currentRoleRoute !== expectedRoleRoute && currentRoleRoute !== '(tabs)' && !inAuthGroup) {
      return <Redirect href={getRoleRedirectPath(role)} />;
    }
    
    // User is authenticated and in correct route, allow access
    return null;
  } else {
    // User is not authenticated
    if (!inAuthGroup) {
      // Not authenticated and trying to access protected routes, redirect to login
      return <Redirect href="/(auth)/login" />;
    }
    
    // User is not authenticated and in auth group, allow access
    return null;
  }
}