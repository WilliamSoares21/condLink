import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { auth } from '../services/firebaseConfig.js';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { db } from '../services/firebaseConfig.js';
import theme from '../../theme';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // Função para validar o formato do e-mail
  const validateEmail = (email) => {
    // Expressão regular para validar e-mails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    // Limpa possíveis espaços extras
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      Alert.alert('Atenção', 'Por favor, informe seu e-mail');
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      Alert.alert('E-mail inválido', 'Por favor, insira um endereço de e-mail válido');
      return;
    }

    if (!password.trim()) {
      Alert.alert('Atenção', 'Por favor, informe sua senha');
      return;
    }

    try {
      setLoading(true);
      console.log("Tentando login com:", trimmedEmail); // Log para depuração
      
      const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, password);
      console.log("Login bem-sucedido:", userCredential.user.uid); // Log para depuração
      
      // Verificar se é admin
      const userRef = ref(db, `users/${userCredential.user.uid}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        const userData = snapshot.val();
        console.log("Dados do usuário:", userData); // Log para depuração
        navigation.navigate(userData.isAdmin ? 'Admin' : 'Tenant');
      } else {
        console.log("Usuário autenticado, mas sem dados no banco"); // Log para depuração
        Alert.alert('Erro', 'Usuário não cadastrado completamente');
        await auth.signOut();
      }
    } catch (error) {
      console.error("Erro de login:", error.code, error.message);
      
      // Tratamento específico de erros
      switch (error.code) {
        case 'auth/invalid-login-credentials':
        case 'auth/invalid-credential':
          Alert.alert(
            'Credenciais inválidas', 
            'E-mail ou senha incorretos. Verifique suas informações e tente novamente.'
          );
          break;
          
        case 'auth/user-not-found':
          Alert.alert(
            'Usuário não encontrado', 
            'Este e-mail não está cadastrado. Deseja criar uma conta?',
            [
              { text: 'Não' },
              { text: 'Sim', onPress: () => navigation.navigate('SignUp') }
            ]
          );
          break;
        
        case 'auth/wrong-password':
          Alert.alert('Senha incorreta', 'Por favor, verifique sua senha e tente novamente.');
          break;
        
        case 'auth/invalid-email':
          Alert.alert('E-mail inválido', 'Por favor, informe um endereço de e-mail válido.');
          break;
          
        case 'auth/too-many-requests':
          Alert.alert('Muitas tentativas', 'Acesso temporariamente bloqueado devido a muitas tentativas sem sucesso. Tente novamente mais tarde ou redefina sua senha.');
          break;
          
        case 'auth/network-request-failed':
          Alert.alert('Erro de conexão', 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.');
          break;
        
        default:
          Alert.alert('Erro de autenticação', `Ocorreu um erro durante o login: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    // Limpa possíveis espaços extras
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      Alert.alert('Atenção', 'Por favor, informe seu e-mail para redefinir a senha');
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      Alert.alert('E-mail inválido', 'Por favor, insira um endereço de e-mail válido');
      return;
    }

    try {
      setResetLoading(true);
      console.log("Enviando e-mail de redefinição para:", trimmedEmail); // Log para depuração
      
      await sendPasswordResetEmail(auth, trimmedEmail);
      
      Alert.alert(
        'E-mail enviado',
        'Enviamos um link para redefinição de senha para o seu e-mail. Verifique sua caixa de entrada e a pasta de spam.'
      );
    } catch (error) {
      console.error("Erro ao enviar e-mail de redefinição:", error.code, error.message);
      
      switch (error.code) {
        case 'auth/user-not-found':
          Alert.alert('Usuário não encontrado', 'Não existe conta associada a este e-mail.');
          break;
          
        case 'auth/invalid-email':
          Alert.alert('E-mail inválido', 'Por favor, informe um endereço de e-mail válido.');
          break;
          
        case 'auth/missing-android-pkg-name':
        case 'auth/missing-continue-uri':
        case 'auth/missing-ios-bundle-id':
          Alert.alert('Erro de configuração', 'Há um problema na configuração do aplicativo. Entre em contato com o suporte.');
          break;
          
        default:
          Alert.alert('Erro', `Não foi possível enviar o e-mail de redefinição: ${error.message}`);
      }
    } finally {
      setResetLoading(false);
    }
  };

  // Restante do código (return e styles) permanece igual
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
            autoCapitalize="none"
            autoCorrect={false}
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
            mode="text"
            onPress={handleForgotPassword}
            loading={resetLoading}
            disabled={resetLoading}
            style={styles.forgotButton}
            textColor={theme.colors.secondary}>
            Esqueceu sua senha?
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
  button: {
    marginTop: 10,
    paddingVertical: 5,
  },
  forgotButton: {
    marginTop: 10,
    marginBottom: 5,
  },
  signUpButton: {
    marginTop: 5,
  }
});