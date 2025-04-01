import React from 'react';
import { View, Button, FlatList, Text } from 'react-native';

const TenantScreen = () => {
  const complaints = [
    { id: '1', category: 'Vazamento', description: 'Banheiro do térreo está alagando' },
    { id: '2', category: 'Barulho', description: 'Festa no apartamento 302' },
  ];

  return (
    <View style={{ padding: 20 }}>
      <Button title="Nova Reclamação" onPress={() => alert('Abrir formulário')} />
      <FlatList
        data={complaints}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 10 }}>
            <Text style={{ fontWeight: 'bold' }}>{item.category}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default TenantScreen;