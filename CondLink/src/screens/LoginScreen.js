import React from 'react';
import { View, Button, TextInput, Text } from 'react-native';

const LoginScreen = ({ navigation }) => {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>CondVoice</Text>
      <TextInput placeholder="E-mail" style={{ borderWidth: 1, marginBottom: 10, padding: 8 }} />
      <TextInput placeholder="Senha" secureTextEntry style={{ borderWidth: 1, marginBottom: 10, padding: 8 }} />
      <Button title="Entrar" onPress={() => navigation.navigate('Tenant')} />
      <Button title="Admin" onPress={() => navigation.navigate('Admin')} color="#666" />
    </View>
  );
};

export default LoginScreen;