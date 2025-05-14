import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Avatar, Title, Surface, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { auth, db } from '../services/firebaseConfig';
import { ref, get } from 'firebase/database';
import theme from '../../theme';

export default function HomeScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const snapshot = await get(ref(db, `users/${auth.currentUser.uid}`));
        if (snapshot.exists()) {
          setUserData(snapshot.val());
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const navigateToComplaints = () => {
    if (userData?.isAdmin) {
      navigation.navigate('Admin');
    } else {
      navigation.navigate('Tenant');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <ScrollView style={styles.container}>
      {/* Cabeçalho com saudação e avatar */}
      <View style={styles.header}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>{greeting()},</Text>
          <Text style={styles.userName}>{userData?.name?.split(' ')[0] || 'Morador'}</Text>
        </View>
        <Avatar.Text 
          size={50} 
          label={(userData?.name?.charAt(0) || '?').toUpperCase()} 
          backgroundColor={theme.colors.primary}
        />
      </View>

      {/* Logo e título */}
      <View style={styles.logoContainer}>
        <MaterialCommunityIcons 
          name="shield-home" 
          size={60} 
          color={theme.colors.primary} 
        />
        <Title style={styles.appTitle}>CondLink</Title>
        <Text style={styles.subtitle}>
          {userData?.isAdmin ? 'Portal do Síndico' : 'Portal do Morador'}
        </Text>
      </View>

      {/* Grade de botões/cards */}
      <View style={styles.gridContainer}>
        <TouchableOpacity 
          style={styles.gridItem} 
          onPress={navigateToComplaints}
          activeOpacity={0.7}
        >
          <Surface style={styles.surface}>
            <MaterialCommunityIcons name="comment-alert" size={40} color={theme.colors.secondary} />
            <Text style={styles.cardTitle}>Reclamações</Text>
            <Text style={styles.cardSubtitle}>
              {userData?.isAdmin ? 'Gerenciar' : 'Enviar nova'}
            </Text>
          </Surface>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.gridItem} 
          activeOpacity={0.7}
          onPress={() => alert('Funcionalidade em desenvolvimento!')}
        >
          <Surface style={[styles.surface, styles.futureSurface]}>
            <MaterialCommunityIcons name="calendar-clock" size={40} color="#888" />
            <Text style={styles.cardTitle}>Reservas</Text>
            <Text style={styles.cardSubtitle}>Em breve</Text>
          </Surface>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.gridItem} 
          activeOpacity={0.7}
          onPress={() => alert('Funcionalidade em desenvolvimento!')}
        >
          <Surface style={[styles.surface, styles.futureSurface]}>
            <MaterialCommunityIcons name="bell-ring" size={40} color="#888" />
            <Text style={styles.cardTitle}>Avisos</Text>
            <Text style={styles.cardSubtitle}>Em breve</Text>
          </Surface>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.gridItem} 
          activeOpacity={0.7}
          onPress={() => navigation.navigate('More')}
        >
          <Surface style={styles.surface}>
            <MaterialCommunityIcons name="dots-horizontal-circle" size={40} color={theme.colors.primary} />
            <Text style={styles.cardTitle}>Mais</Text>
            <Text style={styles.cardSubtitle}>Outras opções</Text>
          </Surface>
        </TouchableOpacity>
      </View>

      {/* Informações rápidas */}
      <Card style={styles.infoCard}>
        <Card.Content>
          <Text style={styles.infoTitle}>Informações do Condomínio</Text>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="home" size={18} color={theme.colors.primary} />
            <Text style={styles.infoText}>Bloco {userData?.block}, Apto {userData?.apartment}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="phone" size={18} color={theme.colors.primary} />
            <Text style={styles.infoText}>Administração: (11) 3333-4444</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Versão do app */}
      <Text style={styles.version}>CondLink v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginTop: 10,
  },
  greetingContainer: {
    flexDirection: 'column',
  },
  greeting: {
    fontSize: 16,
    color: '#666',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  gridItem: {
    width: '48%',
    marginBottom: 16,
  },
  surface: {
    padding: 20,
    height: 150,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  futureSurface: {
    opacity: 0.7,
    backgroundColor: '#f8f8f8',
  },
  cardTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  infoCard: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 14,
  },
  version: {
    textAlign: 'center',
    color: '#999',
    marginBottom: 20,
  },
});