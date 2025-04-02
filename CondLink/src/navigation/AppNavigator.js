import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import TenantScreen from '../screens/TenantScreen';
import AdminScreen from '../screens/AdminScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#4CAF50' },
        headerTintColor: 'white'
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'Acesso ao CondLink' }}
      />
      <Stack.Screen
        name="Tenant"
        component={TenantScreen}
        options={{ title: 'Área do Morador' }}
      />
      <Stack.Screen
        name="Admin"
        component={AdminScreen}
        options={{ title: 'Painel do Síndico' }}
      />
    </Stack.Navigator>
  );
}
