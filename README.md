# 🏢 CondLink - Sistema de Ouvidoria para Condomínios

![CondLink Screenshot](https://via.placeholder.com/800x400?text=CondLink+Screenshots) <!-- Substitua com imagens reais -->

## 📌 Visão Geral
CondLink é um aplicativo móvel que facilita a gestão de reclamações e solicitações em condomínios. Ele conecta moradores e administradores através de um sistema de tickets organizado, promovendo uma comunicação mais eficiente e transparente.

## ✨ Funcionalidades Principais
| **Usuário**  | **Recursos**                                                                 |
|--------------|-----------------------------------------------------------------------------|
| **Moradores** | - Envio de reclamações com fotos<br>- Acompanhamento de status<br>- Histórico de solicitações |
| **Síndicos**  | - Dashboard de tickets<br>- Filtros por categoria/status<br>- Geração de relatórios periódicos |
| **Geral**     | - Notificações em tempo real<br>- Login seguro<br>- Dados sincronizados na nuvem |

## 🛠 Tecnologias Utilizadas
- **Frontend**: React Native + Expo
- **Navegação**: React Navigation 7.x
- **Backend**: Firebase (Autenticação, Firestore)
- **UI**: Componentes nativos + React Native Paper

## 🚀 Como Executar
```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/CondLink.git

# 2. Acesse o diretório do projeto
cd CondLink

# 3. Instale as dependências
npm install

# 4. Inicie o projeto
npx expo start
```

## 📱 Fluxo de Telas
```
Login → Menu Principal → Nova Reclamação
                      → Histórico
                      → Configurações
```

## 📊 Estrutura do Projeto
```
src/
├── screens/       # Telas do app
├── navigation/    # Configuração de rotas
├── components/    # Componentes reutilizáveis
├── services/      # Conexão com Firebase
└── utils/         # Funções auxiliares
```

## 🤝 Como Contribuir
1. Faça um fork do projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'Adiciona X feature'`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 Licença
Este projeto está sob licença MIT - veja o arquivo `LICENSE.md` para detalhes.

---

## ✨ Melhorias Futuras (Roadmap)
- Integração com WhatsApp para alertas
- Suporte a múltiplos condomínios
- Exportação de relatórios em PDF
- Melhorias na interface do usuário

Caso tenha sugestões ou dúvidas, entre em contato! 😊

