import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Card, List, Text, FAB, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { auth, db } from '../services/firebaseConfig';
import { createComplaint, listenToComplaints } from '../services/databaseService';
import { signOut } from 'firebase/auth';
import theme from '../../theme';

export default function TenantScreen({ navigation }) {
  const [complaint, setComplaint] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = listenToComplaints((data) => {
      setComplaints(data);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async () => {
    if (!complaint.trim()) return;
    
    setLoading(true);
    try {
      await createComplaint({
        text: complaint,
        userId: auth.currentUser.uid,
        date: new Date().toISOString(),
        status: 'Pendente'
      });
      setComplaint('');
    } catch (error) {
      Alert.alert("Erro", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    // Implemente a lógica de atualização se necessário
    console.log('Atualizando...');
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.title}>
            <MaterialCommunityIcons name="comment-alert" size={20} /> Nova Reclamação
          </Text>

          <TextInput
            label="Descreva sua reclamação"
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
            value={complaint}
            onChangeText={setComplaint}
          />

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.button}
            disabled={!complaint.trim() || loading}
            loading={loading}
            icon="send"
          >
            {loading ? 'Enviando...' : 'Enviar'}
          </Button>
        </Card.Content>
      </Card>

      <List.Section title="Histórico" titleStyle={styles.sectionTitle}>
        {complaints.map(item => (
          <List.Item
            key={item.id}
            title={item.text}
            description={new Date(item.date).toLocaleString()}
            left={props => (
              <List.Icon
                {...props}
                icon={item.status === 'Pendente' ? "alert-circle" : "check-circle"}
                color={item.status === 'Pendente' ? theme.colors.secondary : theme.colors.primary}
              />
            )}
            right={props => (
              <Text style={[
                styles.status,
                item.status === 'Pendente' ? styles.pending : styles.resolved
              ]}>
                {item.status}
              </Text>
            )}
            style={styles.listItem}
          />
        ))}
      </List.Section>

      <FAB
        icon="refresh"
        style={styles.fab}
        onPress={handleRefresh}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: theme.colors.background,
  },
  card: {
    marginBottom: 20,
    borderRadius: 10,
  },
  title: {
    marginBottom: 15,
    color: theme.colors.primary,
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 5,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: theme.colors.primary,
    fontSize: 18,
  },
  listItem: {
    backgroundColor: 'white',
    marginBottom: 5,
    borderRadius: 5,
    elevation: 1,
  },
  status: {
    alignSelf: 'center',
    marginRight: 10,
    fontWeight: 'bold',
  },
  pending: {
    color: theme.colors.secondary,
  },
  resolved: {
    color: theme.colors.primary,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
  logoutButton: {
    marginTop: 20,
    borderColor: theme.colors.error,
  }
});
