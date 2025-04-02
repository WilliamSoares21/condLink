import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = () => {
    // Lógica simplificada para testar ( irei substituir por Firebase depois)
    if (email && password) {
      navigation.navigate(isAdmin ? 'Admin' : 'Tenant');
    } else {
      Alert.alert('Erro', 'Preencha todos os campos');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <View style={styles.switchContainer}>
        <Button
          title={isAdmin ? "Modo Síndico" : "Modo Morador"}
          onPress={() => setIsAdmin(!isAdmin)}
          color="#4CAF50"
        />
      </View>
      <Button
        title="Entrar"
        onPress={handleLogin}
        color="#4CAF50"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#4CAF50',
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
    borderRadius: 4,
  },
  switchContainer: {
    marginBottom: 20,
  }
});
