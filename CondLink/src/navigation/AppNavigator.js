import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { IconButton } from 'react-native-paper';
import theme from '../../theme';
import LoginScreen from '../screens/LoginScreen';
import TenantScreen from '../screens/TenantScreen';
import AdminScreen from '../screens/AdminScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ProfileScreen from '../screens/ProfileScreen';


const Stack = createStackNavigator();

export default function AppNavigator() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return null;

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        cardStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      {user ? (
        <>
          <Stack.Screen
            name="Tenant"
            component={TenantScreen}
            options={({ navigation }) => ({
              title: '🏠 Área do Morador',
              headerRight: () => (
                <IconButton
                  icon="logout"
                  color="white"
                  onPress={() => auth.signOut()}
                />
              ),
              headerLeft: () => (
                <IconButton
                  icon="arrow-left"
                  color="white"
                  onPress={() => navigation.goBack()}
                />
              ),
            })}
          />
          <Stack.Screen
            name="Admin"
            component={AdminScreen}
            options={{
              title: '📊 Painel Administrativo',
              headerRight: () => (
                <IconButton
                  icon="logout"
                  color="white"
                  onPress={() => auth.signOut()}
                />
              ),
            }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              title: '👤 Meu Perfil',
              headerRight: () => (
                <IconButton
                  icon="logout"
                  color="white"
                  onPress={() => auth.signOut()}
                />
              ),
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              title: '🔐 Acesso CondLink',
              headerLeft: null
            }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{
              title: '📝 Cadastro',
              headerLeft: () => (
                <IconButton
                  icon="arrow-left"
                  color="white"
                  onPress={() => navigation.goBack()}
                />
              ),
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
