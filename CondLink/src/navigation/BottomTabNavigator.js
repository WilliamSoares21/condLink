import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import TenantScreen from '../screens/TenantScreen';
import AdminScreen from '../screens/AdminScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MoreScreen from '../screens/MoreScreen';
import theme from '../../theme';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator({ route }) {
  const { isAdmin } = route.params || {};
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: '#999',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarStyle: {
          paddingVertical: 5,
          height: 60,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      
      <Tab.Screen
        name="ComplaintsTab"
        component={isAdmin ? AdminScreen : TenantScreen}
        options={{
          tabBarLabel: 'Reclamações',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="comment-alert" size={size} color={color} />
          ),
        }}
      />
      
      <Tab.Screen
        name="FutureTab"
        component={MoreScreen}
        options={{
          tabBarLabel: 'Em Breve',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bell-ring" size={size} color={color} />
          ),
        }}
      />
      
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-circle" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}