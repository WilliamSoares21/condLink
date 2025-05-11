import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { auth } from '../services/firebaseConfig.js';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { db } from '../services/firebaseConfig.js';
import theme from '../../theme';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Verificar se é admin
      const userRef = ref(db, `users/${userCredential.user.uid}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        navigation.navigate(snapshot.val().isAdmin ? 'Admin' : 'Tenant');
      } else {
        Alert.alert('Erro', 'Usuário não cadastrado');
        await auth.signOut();
      }
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary }]}>
            <MaterialCommunityIcons name="shield-account" size={24} /> CondLink
          </Text>

          <TextInput
            label="Email"
            mode="outlined"
            left={<TextInput.Icon icon="email" />}
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            theme={{ colors: { primary: theme.colors.primary } }}
          />

          <TextInput
            label="Senha"
            mode="outlined"
            secureTextEntry={secureText}
            left={<TextInput.Icon icon="lock" />}
            right={<TextInput.Icon
              icon={secureText ? "eye-off" : "eye"}
              onPress={() => setSecureText(!secureText)}
            />}
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            theme={{ colors: { primary: theme.colors.primary } }}
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.button}
            icon="login"
            loading={loading}
            disabled={loading}
            buttonColor={theme.colors.primary}
            textColor="white">
            Entrar
          </Button>
          
          <Button
            onPress={() => navigation.navigate('SignUp')}
            mode="text"
            style={styles.signUpButton}
            textColor={theme.colors.primary}>
            Não tem conta? Cadastre-se
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}


// Estilos locais (sem referência ao tema)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    borderRadius: 10,
    elevation: 5,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'white',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  button: {
    marginTop: 10,
    paddingVertical: 5,
  },
});
