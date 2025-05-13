import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Card, List, Text, Button, TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { auth, db } from '../services/firebaseConfig';
import { ref, get } from 'firebase/database';
import { signOut, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import theme from '../../theme';
import ErrorBoundary from '../components/ErrorBoundary';

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const snapshot = await get(ref(db, `users/${auth.currentUser.uid}`));
        if (snapshot.exists()) {
          setUserData(snapshot.val());
        } else {
          Alert.alert('Erro', 'Dados do usuário não encontrados');
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        Alert.alert('Erro', 'Falha ao carregar dados do usuário');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const resetPasswordForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setShowPasswordForm(false);
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Todos os campos são obrigatórios');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('As senhas não coincidem');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('A nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    setChangingPassword(true);
    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );

      await reauthenticateWithCredential(auth.currentUser, credential);

      await updatePassword(auth.currentUser, newPassword);

      Alert.alert('Sucesso', 'Sua senha foi atualizada!');
      resetPasswordForm();
    } catch (error) {
      console.error("Erro na alteração de senha:", error);

      if (error.code === 'auth/wrong-password') {
        setPasswordError('Senha atual incorreta');
      } else {
        setPasswordError('Erro ao alterar senha. Tente novamente.');
      }
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <List.Section>
              <List.Item
                title="Nome"
                description={userData?.name || 'Não informado'}
                left={() => (
                  <MaterialCommunityIcons
                    name="account"
                    size={24}
                    color={theme.colors.primary}
                    style={styles.icon}
                  />
                )}
              />
              <List.Item
                title="Email"
                description={userData?.email || 'Não informado'}
                left={() => (
                  <MaterialCommunityIcons
                    name="email"
                    size={24}
                    color={theme.colors.primary}
                    style={styles.icon}
                  />
                )}
              />
              <List.Item
                title="CPF"
                description={userData?.cpf || 'Não informado'}
                left={() => (
                  <MaterialCommunityIcons
                    name="card-account-details"
                    size={24}
                    color={theme.colors.primary}
                    style={styles.icon}
                  />
                )}
              />
              <List.Item
                title="Bloco"
                description={userData?.block || 'Não informado'}
                left={() => (
                  <MaterialCommunityIcons
                    name="office-building"
                    size={24}
                    color={theme.colors.primary}
                    style={styles.icon}
                  />
                )}
              />
              <List.Item
                title="Apartamento"
                description={userData?.apartment || 'Não informado'}
                left={() => (
                  <MaterialCommunityIcons
                    name="door"
                    size={24}
                    color={theme.colors.primary}
                    style={styles.icon}
                  />
                )}
              />
            </List.Section>

            {!showPasswordForm ? (
              <>
                <Button
                  mode="contained"
                  onPress={() => setShowPasswordForm(true)}
                  style={styles.passwordButton}
                  icon="key-change"
                >
                  Alterar Senha
                </Button>

                <Button
                  mode="contained"
                  onPress={() => signOut(auth)}
                  style={styles.logoutButton}
                  buttonColor={theme.colors.error}
                  icon="logout"
                >
                  Sair da Conta
                </Button>
              </>
            ) : (
              <Card style={styles.passwordCard}>
                <Card.Title title="Alterar Senha" />
                <Card.Content>
                  <TextInput
                    label="Senha Atual"
                    mode="outlined"
                    secureTextEntry
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    style={styles.input}
                  />
                  <TextInput
                    label="Nova Senha"
                    mode="outlined"
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                    style={styles.input}
                  />
                  <TextInput
                    label="Confirmar Nova Senha"
                    mode="outlined"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    style={styles.input}
                  />
                  {passwordError ? (
                    <Text style={styles.errorText}>{passwordError}</Text>
                  ) : null}

                  <View style={styles.buttonRow}>
                    <Button
                      mode="outlined"
                      onPress={resetPasswordForm}
                      style={[styles.formButton, styles.cancelButton]}
                    >
                      Cancelar
                    </Button>
                    <Button
                      mode="contained"
                      onPress={handleChangePassword}
                      loading={changingPassword}
                      disabled={changingPassword}
                      style={styles.formButton}
                    >
                      Confirmar
                    </Button>
                  </View>
                </Card.Content>
              </Card>
            )}
          </Card.Content>
        </Card>
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderRadius: 10,
    elevation: 3,
  },
  passwordCard: {
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  icon: {
    marginRight: 10,
    alignSelf: 'center',
  },
  passwordButton: {
    marginTop: 20,
    backgroundColor: theme.colors.primary,
  },
  logoutButton: {
    marginTop: 10,
  },
  input: {
    marginBottom: 10,
    backgroundColor: 'white',
  },
  errorText: {
    color: theme.colors.error,
    marginVertical: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  formButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    borderColor: theme.colors.primary,
  },
});
