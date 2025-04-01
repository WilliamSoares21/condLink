import React from 'react';
import { View, Text, FlatList } from 'react-native';

const AdminScreen = () => {
  const complaints = [
    { id: '1', category: 'Vazamento', status: 'Pendente' },
    { id: '2', category: 'Barulho', status: 'Resolvido' },
  ];

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Reclamações Recentes</Text>
      <FlatList
        data={complaints}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 10, borderWidth: 1, padding: 10 }}>
            <Text>Categoria: {item.category}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default AdminScreen;