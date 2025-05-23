import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List, Text, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import theme from '../../theme';
import CustomHeader from '../components/CustomHeader';

export default function MoreScreen({ navigation, route }) {
  const { userData } = route.params || {};
  
  console.log("MoreScreen userData:", userData); // Para diagnóstico

  const menuItems = [
    { 
      title: 'Documentos', 
      icon: 'file-document-outline',
      description: 'Documentos importantes do condomínio',
      action: () => alert('Funcionalidade em desenvolvimento'),
    },
    { 
      title: 'Regras do Condomínio', 
      icon: 'clipboard-list-outline',
      description: 'Acesse o regulamento interno',
      action: () => alert('Funcionalidade em desenvolvimento'),
    },
    { 
      title: 'Contatos Úteis', 
      icon: 'phone-outline',
      description: 'Telefones de emergência e serviços',
      action: () => alert('Funcionalidade em desenvolvimento'),
    },
    { 
      title: 'Configurações', 
      icon: 'cog-outline',
      description: 'Ajustes do aplicativo',
      action: () => alert('Funcionalidade em desenvolvimento'),
    },
    { 
      title: 'Sobre o CondLink', 
      icon: 'information-outline',
      description: 'Informações sobre o aplicativo',
      action: () => alert('CondLink v1.0.0\nDesenvolvido para melhorar a comunicação em seu condomínio'),
    },
    { 
      title: 'Gerenciar Moradores', 
      icon: 'account-multiple-check',
      description: 'Adicionar ou remover moradores autorizados',
      action: () => navigation.navigate('ManageResidents'),
      adminOnly: true,
    },
  ];

  return (
    <View style={styles.container}>
      <CustomHeader navigation={navigation} title="Mais Opções" />
      
      <ScrollView>
        <Text style={styles.sectionTitle}>Opções Adicionais</Text>
        <Text style={styles.sectionSubtitle}>
          Acesse outros recursos do CondLink
        </Text>

        {menuItems
          .filter(item => !item.adminOnly || userData?.isAdmin)
          .map((item, index) => (
            <React.Fragment key={index}>
              <List.Item
                title={item.title}
                description={item.description}
                left={props => (
                  <List.Icon
                    {...props}
                    icon={({ size, color }) => (
                      <MaterialCommunityIcons
                        name={item.icon}
                        size={size}
                        color={theme.colors.primary}
                      />
                    )}
                  />
                )}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                onPress={item.action}
                style={styles.listItem}
              />
              <Divider />
            </React.Fragment>
          ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    marginTop: 20,
    color: theme.colors.primary,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginLeft: 16,
    marginBottom: 20,
    color: '#666',
  },
  listItem: {
    backgroundColor: 'white',
    paddingVertical: 8,
  },
});