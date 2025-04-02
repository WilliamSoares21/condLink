import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider } from 'react-native-paper';
import theme from '../../theme';
import LoginScreen from '../screens/LoginScreen';
import TenantScreen from '../screens/TenantScreen';
import AdminScreen from '../screens/AdminScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <PaperProvider theme={theme}> {/* Envolva com PaperProvider */}
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
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: '🔐 Acesso CondLink' }}
        />
        <Stack.Screen
          name="Tenant"
          component={TenantScreen}
          options={{ title: '🏠 Área do Morador' }}
        />
        <Stack.Screen
          name="Admin"
          component={AdminScreen}
          options={{ title: '📊 Painel Administrativo' }}
        />
      </Stack.Navigator>
    </PaperProvider>
  );
}
