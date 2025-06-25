import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, Card, Chip, ToggleButton, DataTable, Menu, Button, Dialog, Portal, TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { listenToComplaints, updateComplaintStatus } from '../services/databaseService';
import theme from '../../theme';

export default function AdminScreen({ navigation }) {
  const [filter, setFilter] = useState('all');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState({});
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [statusToUpdate, setStatusToUpdate] = useState('');

  useEffect(() => {
    const unsubscribe = listenToComplaints((data) => {
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

  const handleStatusChange = async (complaintId, newStatus) => {
    // Para status "Em Análise" e "Resolvido", mostrar diálogo para adicionar notas
    if (newStatus === 'Em Análise' || newStatus === 'Resolvido') {
      setSelectedComplaint(complaintId);
      setStatusToUpdate(newStatus);
      setAdminNotes(''); // Limpar notas anteriores
      setDialogVisible(true);
    } else {
      updateStatus(complaintId, newStatus);
    }
  };

  const updateStatus = async (complaintId, newStatus, notes = null) => {
    try {
      await updateComplaintStatus(complaintId, newStatus, notes);
      // Fechar menu para esta reclamação após atualizar
      setMenuVisible(prev => ({ ...prev, [complaintId]: false }));
      Alert.alert('Sucesso', `Status alterado para "${newStatus}"${notes ? ' com observações' : ''}`);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      Alert.alert('Erro', 'Não foi possível atualizar o status da reclamação');
    }
  };

  const toggleMenu = (id) => {
    setMenuVisible(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredComplaints = complaints.filter(item =>
    filter === 'all' || item.status === filter
  );

  // Mapeamento de cores para status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendente': return theme.colors.secondary;
      case 'Em Análise': return '#FF9800'; // Laranja para "Em Análise"
      case 'Resolvido': return '#4CAF50'; // Verde para "Resolvido"
      default: return theme.colors.primary;
    }
  };

  // Ícones para status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pendente': return 'clock-alert';
      case 'Em Análise': return 'progress-check';
      case 'Resolvido': return 'check-circle';
      default: return 'alert-circle';
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
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
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
              <Text variant="headlineMedium" style={[styles.statValue, { color: theme.colors.secondary }]}>
                {complaints.filter(c => c.status === 'Pendente').length}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="labelSmall">Em Análise</Text>
              <Text variant="headlineMedium" style={[styles.statValue, { color: '#FF9800' }]}>
                {complaints.filter(c => c.status === 'Em Análise').length}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="labelSmall">Resolvidos</Text>
              <Text variant="headlineMedium" style={[styles.statValue, { color: '#4CAF50' }]}>
                {complaints.filter(c => c.status === 'Resolvido').length}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <ToggleButton.Row
        value={filter}
        onValueChange={value => setFilter(value || 'all')}
        style={styles.filterGroup}
      >
        <ToggleButton
          icon="format-list-bulleted"
          value="all"
          style={styles.filterButton}
        />
        <ToggleButton
          icon="clock-alert"
          value="Pendente"
          style={styles.filterButton}
        />
        <ToggleButton
          icon="progress-check"
          value="Em Análise"
          style={styles.filterButton}
        />
        <ToggleButton
          icon="check-circle"
          value="Resolvido"
          style={styles.filterButton}
        />
      </ToggleButton.Row>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Carregando reclamações...</Text>
        </View>
      ) : filteredComplaints.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Card.Content>
            <Text style={styles.emptyText}>
              Nenhuma reclamação {filter !== 'all' ? `com status "${filter}"` : ''} encontrada.
            </Text>
          </Card.Content>
        </Card>
      ) : (
        filteredComplaints.map(item => (
          <Card key={item.id} style={styles.complaintCard}>
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
              
              <View style={styles.userInfoContainer}>
                <MaterialCommunityIcons name="account" size={16} color="#666" />
                <Text style={styles.userInfo}>{item.userName || "Usuário"}</Text>
                <MaterialCommunityIcons name="home" size={16} color="#666" style={{ marginLeft: 10 }} />
                <Text style={styles.userInfo}>
                  Bloco {item.block || "-"}, Apto {item.apartment || "-"}
                </Text>
              </View>
              
              <Text style={styles.complaintText}>{item.text}</Text>
              
              {item.notes && (
                <View style={styles.notesContainer}>
                  <Text style={styles.notesLabel}>Observações:</Text>
                  <Text style={styles.notesText}>{item.notes}</Text>
                </View>
              )}
              
              {item.lastUpdated && (
                <Text style={styles.updatedText}>
                  Atualizado em: {formatDate(new Date(item.lastUpdated).toISOString())}
                </Text>
              )}
              
              <View style={styles.actionsContainer}>
                <Text style={styles.actionsLabel}>Alterar status:</Text>
                <View style={styles.buttonsContainer}>
                  <Button
                    mode="outlined"
                    disabled={item.status === 'Pendente'}
                    onPress={() => handleStatusChange(item.id, 'Pendente')}
                    style={[styles.actionButton, { borderColor: theme.colors.secondary }]}
                    labelStyle={{ color: item.status === 'Pendente' ? '#999' : theme.colors.secondary }}
                    compact
                  >
                    Pendente
                  </Button>
                  
                  <Button
                    mode="outlined"
                    disabled={item.status === 'Em Análise'}
                    onPress={() => handleStatusChange(item.id, 'Em Análise')}
                    style={[styles.actionButton, { borderColor: '#FF9800' }]}
                    labelStyle={{ color: item.status === 'Em Análise' ? '#999' : '#FF9800' }}
                    compact
                  >
                    Em Análise
                  </Button>
                  
                  <Button
                    mode="outlined"
                    disabled={item.status === 'Resolvido'}
                    onPress={() => handleStatusChange(item.id, 'Resolvido')}
                    style={[styles.actionButton, { borderColor: '#4CAF50' }]}
                    labelStyle={{ color: item.status === 'Resolvido' ? '#999' : '#4CAF50' }}
                    compact
                  >
                    Resolvido
                  </Button>
                </View>
              </View>
            </Card.Content>
          </Card>
        ))
      )}

      {/* Diálogo para adicionar observações ao alterar status */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>
            {statusToUpdate === 'Em Análise' ? 'Iniciar análise' : 'Marcar como resolvido'}
          </Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>
              {statusToUpdate === 'Em Análise' 
                ? 'Adicione observações sobre como essa reclamação será analisada.' 
                : 'Adicione observações sobre como essa reclamação foi resolvida.'}
            </Text>
            <TextInput
              label="Observações"
              value={adminNotes}
              onChangeText={setAdminNotes}
              multiline
              numberOfLines={3}
              mode="outlined"
              style={styles.dialogInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancelar</Button>
            <Button onPress={() => {
              updateStatus(selectedComplaint, statusToUpdate, adminNotes);
              setDialogVisible(false);
            }}>Confirmar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: theme.colors.background,
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
    flex: 1,
  },
  statValue: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  filterGroup: {
    marginVertical: 10,
    justifyContent: 'center',
  },
  filterButton: {
    borderWidth: 0,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyCard: {
    padding: 10,
    marginVertical: 20,
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
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userInfo: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  complaintText: {
    fontSize: 16,
    marginVertical: 10,
  },
  notesContainer: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
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
  },
  actionsContainer: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  actionsLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 3,
  },
  dialogText: {
    marginBottom: 15,
  },
  dialogInput: {
    backgroundColor: 'white',
  },
});
