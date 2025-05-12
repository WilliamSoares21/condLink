import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Card, List, Text, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { auth, db } from '../services/firebaseConfig';
import { ref, get } from 'firebase/database';
import { signOut } from 'firebase/auth';
import theme from '../../theme';

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

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
        Alert.alert('Erro', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando dados...</Text>
      </View>
    );
  }

  return (
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

          <Button
            mode="contained"
            onPress={() => signOut(auth)}
            style={styles.logoutButton}
            buttonColor={theme.colors.error}
            icon="logout"
          >
            Sair da Conta
          </Button>
        </Card.Content>
      </Card>
    </View>
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
  icon: {
    marginRight: 10,
    alignSelf: 'center',
  },
  logoutButton: {
    marginTop: 20,
  },
});
