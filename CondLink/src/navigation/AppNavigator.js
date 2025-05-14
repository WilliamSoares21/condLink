import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../services/firebaseConfig';
import { get, ref } from 'firebase/database';
import { IconButton } from 'react-native-paper';
import theme from '../../theme';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import BottomTabNavigator from './BottomTabNavigator';
import TenantScreen from '../screens/TenantScreen';
import AdminScreen from '../screens/AdminScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        try {
          const snapshot = await get(ref(db, `users/${user.uid}`));
          if (snapshot.exists()) {
            setUserData(snapshot.val());
          }
        } catch (error) {
          console.error("Erro ao carregar dados do usuário:", error);
        }
      }
      
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
          {/* Tab Navigator como rota principal após login */}
          <Stack.Screen
            name="Main"
            component={BottomTabNavigator}
            options={{ headerShown: false }}
            initialParams={{ isAdmin: userData?.isAdmin }}
          />
          
          {/* Manter as rotas individuais para navegação de dentro da Tab */}
          <Stack.Screen
            name="Tenant"
            component={TenantScreen}
            options={({ navigation }) => ({
              title: 'Reclamações',
              headerRight: () => (
                <IconButton
                  icon="account-circle"
                  color="white"
                  onPress={() => navigation.navigate('Profile')}
                  style={{ marginRight: 8 }}
                />
              ),
            })}
          />
          <Stack.Screen
            name="Admin"
            component={AdminScreen}
            options={{
              title: 'Gerenciar Reclamações',
            }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              title: 'Meu Perfil',
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
            options={({ navigation }) => ({
              title: '📝 Cadastro',
              headerLeft: () => (
                <IconButton
                  icon="arrow-left"
                  color="white"
                  onPress={() => navigation.goBack()}
                />
              ),
            })}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
