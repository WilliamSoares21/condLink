import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import theme from '../../theme';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Erro capturado:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Ops! Algo deu errado.</Text>
          <Text style={styles.message}>{this.state.error?.toString()}</Text>
          <Button
            title="Tentar novamente"
            onPress={() => this.setState({ hasError: false })}
            color={theme.colors.primary}
          />
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: theme.colors.error,
  },
  message: {
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ErrorBoundary;