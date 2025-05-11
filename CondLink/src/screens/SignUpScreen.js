import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Card, Text } from 'react-native-paper';
import { auth, db } from '../services/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import theme from '../../theme';

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [block, setBlock] = useState('');
  const [apartment, setApartment] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!email || !password || !name || !cpf || !block || !apartment) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios');
      return false;
    }

    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      Alert.alert('Erro', 'Formato de email inválido');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter no mínimo 6 caracteres');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await set(ref(db, `users/${userCredential.user.uid}`), {
        name,
        cpf,
        block,
        apartment,
        isAdmin: false,
        email: userCredential.user.email
      });

      Alert.alert('Sucesso', 'Cadastro realizado!');
      navigation.navigate('Login');
    } catch (error) {
      let errorMessage = 'Erro ao cadastrar: ';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage += 'Este email já está cadastrado';
          break;
        case 'auth/invalid-email':
          errorMessage += 'Email inválido';
          break;
        case 'auth/weak-password':
          errorMessage += 'Senha muito fraca (mínimo 6 caracteres)';
          break;
        default:
          errorMessage += error.message;
      }
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            label="Nome Completo"
            mode="outlined"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            label="CPF"
            mode="outlined"
            value={cpf}
            onChangeText={setCpf}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Bloco"
            mode="outlined"
            value={block}
            onChangeText={setBlock}
            style={styles.input}
          />
          <TextInput
            label="Apartamento"
            mode="outlined"
            value={apartment}
            onChangeText={setApartment}
            style={styles.input}
          />
          <TextInput
            label="Email"
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          <TextInput
            label="Senha"
            mode="outlined"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <Button
            mode="contained"
            onPress={handleSignUp}
            loading={loading}
            disabled={loading}
            buttonColor={theme.colors.primary}
            style={{ marginTop: 15 }}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  card: {
    borderRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'white',
  },
});

