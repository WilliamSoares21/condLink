import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Card, List, Text, FAB } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import theme from '../../theme';

export default function TenantScreen() {
  const [complaint, setComplaint] = useState('');
  const [complaints, setComplaints] = useState([]);

  // Buscar reclamações ao carregar a tela
  useEffect(() => {
    const fetchComplaints = async () => {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Erro ao buscar reclamações:', error.message);
      } else {
        setComplaints(data);
      }
    };

    fetchComplaints();
  }, []);

  const handleSubmit = async () => {
    if (complaint.trim()) {
      const { data, error } = await supabase
        .from('complaints')
        .insert([{ text: complaint, status: 'Pendente', date: new Date().toISOString() }]);

      if (error) {
        console.error('Erro ao salvar reclamação:', error.message);
      } else {
        setComplaints([{ id: data[0].id, ...data[0] }, ...complaints]);
        setComplaint('');
      }
    }
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
            disabled={!complaint.trim()}
            icon="send"
          >
            Enviar
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
        onPress={() => {
          // Atualizar lista de reclamações
          const fetchComplaints = async () => {
            const { data, error } = await supabase
              .from('complaints')
              .select('*')
              .order('date', { ascending: false });

            if (error) {
              console.error('Erro ao atualizar reclamações:', error.message);
            } else {
              setComplaints(data);
            }
          };

          fetchComplaints();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
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
});
