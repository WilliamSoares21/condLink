import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

export default function AdminScreen() {
  const [complaints, setComplaints] = useState([
    { id: '1', text: 'Vazamento no corredor', status: 'Pendente', date: '10/05/2023' },
    { id: '2', text: 'Lâmpada queimada', status: 'Resolvido', date: '08/05/2023' },
    { id: '3', text: 'Barulho excessivo', status: 'Pendente', date: '12/05/2023' }
  ]);

  const handleResolve = (id) => {
    setComplaints(complaints.map(item =>
      item.id === id ? { ...item, status: 'Resolvido' } : item
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reclamações Recentes</Text>

      <FlatList
        data={complaints}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.complaintItem}>
            <Text style={styles.date}>{item.date}</Text>
            <Text>{item.text}</Text>
            <View style={styles.statusContainer}>
              <Text
                style={[
                  styles.status,
                  item.status === 'Pendente' ? styles.pending : styles.resolved
                ]}
              >
                {item.status}
              </Text>
              {item.status === 'Pendente' && (
                <TouchableOpacity
                  style={styles.resolveButton}
                  onPress={() => handleResolve(item.id)}
                >
                  <Text style={styles.buttonText}>Marcar como Resolvido</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  complaintItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  date: {
    color: '#666',
    fontSize: 12,
    marginBottom: 5,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  status: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  pending: {
    color: '#FF5722',
  },
  resolved: {
    color: '#4CAF50',
  },
  resolveButton: {
    backgroundColor: '#4CAF50',
    padding: 5,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
  }
});
