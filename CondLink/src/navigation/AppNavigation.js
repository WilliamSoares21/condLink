import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import TenantScreen from '../screens/TenantScreen';
import AdminScreen from '../screens/AdminScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Tenant" component={TenantScreen} />
      <Stack.Screen name="Admin" component={AdminScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;