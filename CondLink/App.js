import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import theme from './theme';
import * as Font from 'expo-font';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, View } from 'react-native';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        // Carregar as fontes do MaterialCommunityIcons
        await Font.loadAsync(MaterialCommunityIcons.font);
        setFontsLoaded(true);
      } catch (error) {
        console.error('Erro ao carregar fontes:', error);
      }
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    // Exibir um indicador de carregamento enquanto as fontes são carregadas
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
}
