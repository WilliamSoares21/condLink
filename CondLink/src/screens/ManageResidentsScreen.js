import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Card, DataTable, Text } from 'react-native-paper';
import { ref, set, get, remove } from 'firebase/database';
import { db, auth } from '../services/firebaseConfig';
import { hashCPF } from '../utils/securityUtils';
import theme from '../../theme';

export default function ManageResidentsScreen({ navigation }) {
  const [cpf, setCpf] = useState('');
  const [name, setName] = useState('');
  const [block, setBlock] = useState('');
  const [apartment, setApartment] = useState('');
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingPermission, setCheckingPermission] = useState(true);

  useEffect(() => {
    // Verificar se o usuário é administrador
    const checkAdminStatus = async () => {
      setCheckingPermission(true);
      try {
        const userSnapshot = await get(ref(db, `users/${auth.currentUser.uid}`));
        const userData = userSnapshot.val();
        
        if (!userData || userData.isAdmin !== true) {
          // Redirecionar usuário não administrador
          Alert.alert(
            "Acesso negado",
            "Você não tem permissão para acessar esta área."
          );
          navigation.goBack();
          return;
        }
        
        setIsAdmin(true);
        loadResidents();
      } catch (error) {
        console.error('Erro ao verificar permissões:', error);
        navigation.goBack();
      } finally {
        setCheckingPermission(false);
      }
    };
    
    checkAdminStatus();
  }, [navigation]);

  const loadResidents = async () => {
    try {
      const snapshot = await get(ref(db, 'authorized_residents'));
      if (snapshot.exists()) {
        const data = [];
        snapshot.forEach((childSnapshot) => {
          data.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
        setResidents(data);
      }
    } catch (error) {
      console.error('Erro ao carregar moradores:', error);
      Alert.alert('Erro', 'Falha ao carregar a lista de moradores');
    }
  };

  const addResident = async () => {
    if (!cpf.trim() || !block.trim() || !apartment.trim()) {
      Alert.alert('Erro', 'CPF, Bloco e Apartamento são obrigatórios');
      return;
    }

    setLoading(true);
    try {
      const hashedCPF = hashCPF(cpf);
      await set(ref(db, `authorized_residents/${hashedCPF}`), {
        name,
        block,
        apartment,
        createdAt: Date.now()
      });
      
      Alert.alert('Sucesso', 'Morador autorizado com sucesso');
      setCpf('');
      setName('');
      setBlock('');
      setApartment('');
      loadResidents();
    } catch (error) {
      console.error('Erro ao adicionar morador:', error);
      Alert.alert('Erro', 'Falha ao adicionar morador autorizado');
    } finally {
      setLoading(false);
    }
  };

  const removeResident = async (id) => {
    try {
      await remove(ref(db, `authorized_residents/${id}`));
      Alert.alert('Sucesso', 'Morador removido com sucesso');
      loadResidents();
    } catch (error) {
      console.error('Erro ao remover morador:', error);
      Alert.alert('Erro', 'Falha ao remover morador');
    }
  };

  if (checkingPermission) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text>Verificando permissões...</Text>
      </View>
    );
  }

  if (!isAdmin) {
    return null; // Não renderiza nada, pois o usuário será redirecionado
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Adicionar Morador Autorizado" />
        <Card.Content>
          <TextInput
            label="CPF"
            value={cpf}
            onChangeText={setCpf}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Nome (opcional)"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            label="Bloco"
            value={block}
            onChangeText={setBlock}
            style={styles.input}
          />
          <TextInput
            label="Apartamento"
            value={apartment}
            onChangeText={setApartment}
            style={styles.input}
          />
          <Button
            mode="contained"
            onPress={addResident}
            loading={loading}
            disabled={loading}
          >
            Adicionar
          </Button>
        </Card.Content>
      </Card>

      <Text style={styles.sectionTitle}>Moradores Autorizados</Text>
      <DataTable style={styles.table}>
        <DataTable.Header>
          <DataTable.Title>Nome</DataTable.Title>
          <DataTable.Title>Bloco</DataTable.Title>
          <DataTable.Title>Apto</DataTable.Title>
          <DataTable.Title numeric>Ações</DataTable.Title>
        </DataTable.Header>

        {residents.map((resident) => (
          <DataTable.Row key={resident.id}>
            <DataTable.Cell>{resident.name || "---"}</DataTable.Cell>
            <DataTable.Cell>{resident.block}</DataTable.Cell>
            <DataTable.Cell>{resident.apartment}</DataTable.Cell>
            <DataTable.Cell numeric>
              <Button
                mode="text"
                compact
                onPress={() => {
                  Alert.alert(
                    'Confirmar Exclusão',
                    'Deseja remover este morador da lista de autorizados?',
                    [
                      { text: 'Cancelar', style: 'cancel' },
                      { text: 'Remover', onPress: () => removeResident(resident.id) }
                    ]
                  );
                }}
              >
                Remover
              </Button>
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    </ScrollView>
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
  },
  input: {
    marginBottom: 10,
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    color: theme.colors.primary,
  },
  table: {
    backgroundColor: 'white',
    borderRadius: 10,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});