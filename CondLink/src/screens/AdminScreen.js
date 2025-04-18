import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { View, StyleSheet } from 'react-native';
import { Text, Card, DataTable, Chip, ToggleButton } from 'react-native-paper';
import theme from '../../theme';

export default function AdminScreen() {
  const [filter, setFilter] = useState('all');
  const [complaints, setComplaints] = useState([]);

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

  const filteredComplaints = complaints.filter(item =>
    filter === 'all' || item.status === filter
  );

  return (
    <View style={styles.container}>
      <Card style={styles.statsCard}>
        <Card.Content>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text variant="labelSmall">Total</Text>
              <Text variant="headlineMedium" style={styles.statValue}>
                {complaints.length}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="labelSmall">Pendentes</Text>
              <Text variant="headlineMedium" style={[styles.statValue, styles.pending]}>
                {complaints.filter(c => c.status === 'Pendente').length}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="labelSmall">Resolvidos</Text>
              <Text variant="headlineMedium" style={[styles.statValue, styles.resolved]}>
                {complaints.filter(c => c.status === 'Resolvido').length}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <ToggleButton.Row
        value={filter}
        onValueChange={value => setFilter(value)}
        style={styles.filterGroup}
      >
        <ToggleButton
          icon="format-list-bulleted"
          value="all"
          style={styles.filterButton}
        />
        <ToggleButton
          icon="alert"
          value="Pendente"
          style={styles.filterButton}
        />
        <ToggleButton
          icon="check"
          value="Resolvido"
          style={styles.filterButton}
        />
      </ToggleButton.Row>

      <DataTable style={styles.table}>
        <DataTable.Header>
          <DataTable.Title>Unidade</DataTable.Title>
          <DataTable.Title>Descrição</DataTable.Title>
          <DataTable.Title numeric>Status</DataTable.Title>
        </DataTable.Header>

        {filteredComplaints.map(item => (
          <DataTable.Row key={item.id}>
            <DataTable.Cell>{item.unit || 'N/A'}</DataTable.Cell>
            <DataTable.Cell>{item.text}</DataTable.Cell>
            <DataTable.Cell numeric>
              <Chip
                mode="outlined"
                style={[
                  styles.chip,
                  item.status === 'Pendente' ? styles.chipPending : styles.chipResolved
                ]}
              >
                {item.status}
              </Chip>
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  statsCard: {
    marginBottom: 15,
    borderRadius: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  pending: {
    color: theme.colors.secondary,
  },
  resolved: {
    color: '#4CAF50',
  },
  filterGroup: {
    marginVertical: 10,
    justifyContent: 'center',
  },
  filterButton: {
    borderWidth: 0,
  },
  table: {
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 1,
  },
  chip: {
    margin: 2,
  },
  chipPending: {
    backgroundColor: '#FFF3E0',
    borderColor: theme.colors.secondary,
  },
  chipResolved: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
});
