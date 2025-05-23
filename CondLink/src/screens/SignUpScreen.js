import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Card, Text } from 'react-native-paper';
import { auth, db } from '../services/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set, get, query, orderByKey, equalTo } from 'firebase/database';
import { hashCPF } from '../utils/securityUtils';
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

  // Nova função para validar se o CPF está autorizado
  const validateAuthorizedResident = async (cpf) => {
    try {
      const hashedCPF = hashCPF(cpf);
      const residentQuery = query(
        ref(db, 'authorized_residents'),
        orderByKey(),
        equalTo(hashedCPF)
      );
      
      const snapshot = await get(residentQuery);
      return snapshot.exists();
    } catch (error) {
      console.error('Erro na validação do CPF:', error);
      return false;
    }
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Verificar se o CPF está autorizado
      const isAuthorized = await validateAuthorizedResident(cpf);
      
      if (!isAuthorized) {
        Alert.alert(
          'Não Autorizado',
          'CPF não encontrado na base de dados. Por gentileza, entre em contato com o síndico do seu condomínio.'
        );
        setLoading(false);
        return;
      }
      
      // Continuar com o cadastro se o CPF estiver autorizado
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
      console.error('Erro na validação do CPF:', error);
      
      // Mostra uma mensagem específica para erro de permissão
      if (error.message && error.message.includes('permission_denied')) {
        Alert.alert(
          'Acesso não autorizado',
          'Por favor, entre em contato com o administrador do condomínio para verificar seu CPF.'
        );
      } else {
        // Outras mensagens de erro (VVou tentar colocar mais depois)
        Alert.alert('Erro', 'Não foi possível verificar seu CPF. Tente novamente mais tarde.');
      }
      
      setLoading(false);
      return;
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

