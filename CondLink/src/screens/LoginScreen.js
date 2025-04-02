import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Switch, Text, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import theme from '../../theme'; // Importe o tema aqui

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [secureText, setSecureText] = useState(true);

  const handleLogin = () => {
    navigation.navigate(isAdmin ? 'Admin' : 'Tenant');
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

          <View style={styles.switchContainer}>
            <Text variant="bodyMedium" style={{ color: theme.colors.text }}>
              {isAdmin ? 'Modo Administrador' : 'Modo Morador'}
            </Text>
            <Switch
              value={isAdmin}
              onValueChange={() => setIsAdmin(!isAdmin)}
              color={theme.colors.primary}
            />
          </View>

          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.button}
            icon="login"
            buttonColor={theme.colors.primary}
            textColor="white"
          >
            Entrar
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
