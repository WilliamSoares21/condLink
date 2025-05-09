import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import theme from './theme';
import { db } from './src/services/firebaseConfig'; // Importa o db
import { ref, set } from 'firebase/database'; // Importa funções do Firebase

export default function App() {
  // useEffect para testar a conexão
  useEffect(() => {
    const testConnection = async () => {
      try {
        await set(ref(db, 'connectionTest'), {
          message: 'Conexão estabelecida em: ' + new Date().toISOString()
        });
        console.log('✅ Conexão com Firebase bem-sucedida!');
      } catch (error) {
        console.error('❌ Erro na conexão:', error);
      }
    };
    
    testConnection();
  }, []);

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
}
