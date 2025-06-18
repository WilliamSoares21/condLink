import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView, RefreshControl } from 'react-native';
import { TextInput, Button, Card, Chip, Text, FAB, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { auth, db } from '../services/firebaseConfig';
import { createComplaint, listenToUserComplaints } from '../services/databaseService';
import { ref, get } from 'firebase/database';
import theme from '../../theme';

export default function TenantScreen() {
  const [complaint, setComplaint] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Buscar dados do usuário para exibir informações da unidade
    const fetchUserData = async () => {
      try {
        const snapshot = await get(ref(db, `users/${auth.currentUser.uid}`));
        if (snapshot.exists()) {
          setUserData(snapshot.val());
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      }
    };

    fetchUserData();

    // Escutar reclamações do usuário atual
    const unsubscribe = listenToUserComplaints(auth.currentUser.uid, (data) => {
      // Ordenar reclamações por data de criação (mais recentes primeiro)
      const sortedData = [...data].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setComplaints(sortedData);
      setLoading(false);
      setRefreshing(false);
    });
    
    return () => unsubscribe();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    // A atualização acontece automaticamente pelo listener em useEffect
    // Este timeout é apenas para feedback visual
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleSubmit = async () => {
    if (!complaint.trim()) return;

    setSubmitting(true);
    try {
      await createComplaint({
        text: complaint,
        userId: auth.currentUser.uid,
        date: new Date().toISOString(),
        status: 'Pendente'
      });
      setComplaint('');
      Alert.alert('Sucesso', 'Reclamação enviada com sucesso!');
    } catch (error) {
      Alert.alert("Erro", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Ícones e cores para status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pendente': return 'clock-alert';
      case 'Em Análise': return 'progress-check';
      case 'Resolvido': return 'check-circle';
      default: return 'alert-circle';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendente': return theme.colors.secondary;
      case 'Em Análise': return '#FF9800'; // Laranja para "Em Análise"
      case 'Resolvido': return '#4CAF50'; // Verde para "Resolvido"
      default: return theme.colors.primary;
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR') + ' ' + 
             date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return dateString;
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
            disabled={!complaint.trim() || submitting}
            loading={submitting}
            icon="send"
          >
            {submitting ? 'Enviando...' : 'Enviar'}
          </Button>
        </Card.Content>
      </Card>

      <View style={styles.historyTitleContainer}>
        <Text style={styles.historyTitle}>Histórico de Reclamações</Text>
        <Chip icon="refresh" onPress={onRefresh}>Atualizar</Chip>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Carregando reclamações...</Text>
        </View>
      ) : (
        <ScrollView 
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          style={styles.scrollView}
        >
          {complaints.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <Text style={styles.emptyText}>
                  Você ainda não possui reclamações registradas.
                </Text>
              </Card.Content>
            </Card>
          ) : (
            complaints.map(item => (
              <Card key={item.id} style={[
                styles.complaintCard,
                {
                  borderLeftWidth: 5,
                  borderLeftColor: getStatusColor(item.status)
                }
              ]}>
                <Card.Content>
                  <View style={styles.complaintHeader}>
                    <Chip 
                      mode="outlined"
                      icon={() => (
                        <MaterialCommunityIcons 
                          name={getStatusIcon(item.status)} 
                          size={16} 
                          color={getStatusColor(item.status)} 
                        />
                      )}
                      style={[styles.statusChip, { borderColor: getStatusColor(item.status) }]}
                      textStyle={{ color: getStatusColor(item.status) }}
                    >
                      {item.status}
                    </Chip>
                    <Text style={styles.dateText}>
                      {formatDate(item.date)}
                    </Text>
                  </View>
                  
                  <Text style={styles.complaintText}>{item.text}</Text>
                  
                  {item.notes && (
                    <View style={styles.notesContainer}>
                      <Text style={styles.notesLabel}>Resposta do administrador:</Text>
                      <Text style={styles.notesText}>{item.notes}</Text>
                    </View>
                  )}
                  
                  {item.lastUpdated && (
                    <Text style={styles.updatedText}>
                      Atualizado em: {formatDate(new Date(item.lastUpdated).toISOString())}
                    </Text>
                  )}

                  <View style={styles.statusIndicator}>
                    <View style={[
                      styles.statusDot, 
                      { backgroundColor: ['Pendente', 'Em Análise', 'Resolvido'].includes(item.status) ? getStatusColor('Pendente') : '#ccc' }
                    ]} />
                    <View style={styles.statusLine} />
                    <View style={[
                      styles.statusDot, 
                      { backgroundColor: ['Em Análise', 'Resolvido'].includes(item.status) ? getStatusColor('Em Análise') : '#ccc' }
                    ]} />
                    <View style={styles.statusLine} />
                    <View style={[
                      styles.statusDot, 
                      { backgroundColor: item.status === 'Resolvido' ? getStatusColor('Resolvido') : '#ccc' }
                    ]} />
                  </View>
                  <View style={styles.statusLabels}>
                    <Text style={styles.statusLabel}>Pendente</Text>
                    <Text style={styles.statusLabel}>Em Análise</Text>
                    <Text style={styles.statusLabel}>Resolvido</Text>
                  </View>
                </Card.Content>
              </Card>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
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
  historyTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  historyTitle: {
    fontWeight: 'bold',
    color: theme.colors.primary,
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: theme.colors.primary,
  },
  emptyCard: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
  },
  complaintCard: {
    marginBottom: 15,
    borderRadius: 8,
  },
  complaintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusChip: {
    backgroundColor: 'white',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  complaintText: {
    fontSize: 16,
    marginVertical: 10,
  },
  notesContainer: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
    marginVertical: 8,
  },
  notesLabel: {
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 2,
  },
  notesText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  updatedText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
    marginBottom: 10,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingHorizontal: 10,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusLine: {
    height: 2,
    backgroundColor: '#ddd',
    flex: 1,
  },
  statusLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    marginTop: 5,
  },
  statusLabel: {
    fontSize: 10,
    color: '#666',
    flex: 1,
    textAlign: 'center',
  }
});
