# 🏢 CondLink - Sistema de Ouvidoria para Condomínios

![Banner do App](https://via.placeholder.com/800x400?text=Screenshot+1+%7C+Screenshot+2+%7C+Screenshot+3)

## 📌 Visão Geral
Aplicativo móvel que facilita a comunicação entre moradores e administradores de condomínios, permitindo:
- 📝 Registro de reclamações com fotos
- 🔍 Acompanhamento em tempo real
- 📊 Geração de relatórios automáticos
- 🔔 Notificações push importantes

## ⚙️ Pré-requisitos
| Item              | Versão Recomendada | Link de Download                     |
|-------------------|--------------------|---------------------------------------|
| Node.js           | 18+ LTS            | [nodejs.org](https://nodejs.org/)     |
| npm               | 9+                 | (vem com Node.js)                     |
| Expo CLI          | Última estável     | `npm install -g expo-cli`             |
| Git               | 2.40+              | [git-scm.com](https://git-scm.com/)   |
| Expo Go (mobile)  | Última versão      | [expo.dev/client](https://expo.dev/client) |

## 🚀 Instalação Passo a Passo

### 1. Clonar o repositório
```bash
git clone https://github.com/seu-usuario/CondLink.git
cd CondLink
```
### 2. Instalar dependências
```bash
npm install
```
### 3. Configurar ambiente (opcional)
Crie um arquivo `.env` na raiz:
```
# Exemplo para Firebase
API_KEY=SUA_CHAVE_AQUI
AUTH_DOMAIN=seu-projeto.firebaseapp.com
PROJECT_ID=seu-projeto
```
### 4. Iniciar o projeto
```bash
npx expo start
```

## 🌐 Como Executar em Diferentes Plataformas

### ▶️ Dispositivo Físico
1. Abra o app Expo Go no celular
2. Escaneie o QR code exibido no terminal
3. Aguarde o carregamento (pode demorar alguns minutos na primeira execução)

### 💻 Navegador Web
```bash
npx expo start --web
```
Acesse: `http://localhost:19006`

### 🤖 Emulador Android
```bash
npx expo start --android
```
**Requisitos:**
- Android Studio instalado
- Dispositivo virtual configurado

### 🍎 Emulador iOS (somente macOS)
```bash
npx expo start --ios
```
**Requisitos:**
- Xcode instalado
- Simulador configurado

## 🛠️ Estrutura do Projeto
```
CondLink/
├── .expo/                 # Configurações internas do Expo
├── assets/                # Recursos estáticos
│   ├── fonts/             # Fontes customizadas
│   ├── images/            # Imagens do app
│   └── icons/             # Ícones vetoriais
├── src/
│   ├── components/        # Componentes reutilizáveis
│   ├── constants/         # Configurações globais
│   ├── navigation/        # Sistema de navegação
│   ├── screens/           # Telas do aplicativo
│   ├── services/          # Integrações externas
│   └── utils/             # Utilitários
├── App.js                 # Componente raiz
├── app.json               # Configuração do Expo
├── babel.config.js        # Configuração do Babel
└── package.json           # Dependências do projeto
```

## 🔧 Solução de Problemas Comuns

### 🐞 Erros frequentes e soluções:
#### "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```
#### Tela branca no navegador
```bash
npx expo start --clear
```
#### Problemas com Firebase
Verifique se:
- O arquivo `.env` existe
- As permissões do Firebase estão corretas
- O SHA-1 está configurado no Console do Firebase

#### Erros de estilo
```bash
npx expo install react-native-web react-dom
```

## 🤝 Guia de Contribuição

### 📢 Reporte bugs
Abra uma issue descrevendo:
- Passos para reproduzir
- Comportamento esperado vs atual
- Screenshots (se aplicável)

### 🚀 Sugira melhorias
Descreva:
- O problema que a feature resolve
- Proposta de solução
- Alternativas consideradas

### 📥 Envie um PR
Fluxo recomendado:
```bash
git checkout -b minha-feature
git add .
git commit -m "feat: Descrição concisa"
git push origin minha-feature
```

## 📄 Licença
MIT License - Veja o arquivo `LICENSE.md` para detalhes.

## ✨ Roadmap 2025
| Status | Feature             | Descrição                          |
|--------|--------------------|----------------------------------|
| ✅      | Autenticação        | Login com e-mail/senha         |
| ⏳      | Notificações Push   | Alertas para novos tickets     |
| 🚀      | Relatórios PDF      | Exportação mensal de ocorrências |
| ✨      | Chat Integrado      | Comunicação direta morador-síndico |

## 📬 Contato
**Equipe de Desenvolvimento**
- **Email:** dev@condlink.app
- **Site:** [condlink.app](https://condlink.app)
- **Relatar bugs:** Issues do GitHub

📌 **Nota:** Este projeto está em constante evolução. Consulte o `CHANGELOG.md` para acompanhar as últimas atualizações.

