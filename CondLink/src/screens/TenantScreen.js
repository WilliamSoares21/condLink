import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TextInput } from 'react-native';

export default function TenantScreen({ navigation }) {
  const [complaint, setComplaint] = useState('');
  const [complaints, setComplaints] = useState([
    { id: '1', text: 'Vazamento no corredor', status: 'Pendente' },
    { id: '2', text: 'Lâmpada queimada', status: 'Resolvido' }
  ]);

  const handleSubmit = () => {
    if (complaint) {
      setComplaints([...complaints, {
        id: Date.now().toString(),
        text: complaint,
        status: 'Pendente'
      }]);
      setComplaint('');
      Alert.alert('Sucesso', 'Reclamação enviada!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova Reclamação</Text>
      <TextInput
        style={styles.input}
        placeholder="Descreva sua reclamação"
        value={complaint}
        onChangeText={setComplaint}
        multiline
      />
      <Button
        title="Enviar"
        onPress={handleSubmit}
        color="#4CAF50"
      />

      <Text style={styles.subtitle}>Histórico:</Text>
      <FlatList
        data={complaints}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.complaintItem}>
            <Text>{item.text}</Text>
            <Text style={styles.status}>{item.status}</Text>
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
    marginBottom: 10,
  },
  input: {
    borderColor: '#4CAF50',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
    minHeight: 100,
  },
  complaintItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  status: {
    color: '#4CAF50',
    marginTop: 5,
  },
  subtitle: {
    marginTop: 20,
    fontWeight: 'bold',
  }
});
