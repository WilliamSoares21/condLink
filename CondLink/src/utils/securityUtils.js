import CryptoJS from 'crypto-js';

/**
 * Cria um hash SHA-256 de um CPF
 * @param {string} cpf - CPF a ser convertido em hash (pode conter pontuação)
 * @return {string} - Hash SHA-256 do CPF
 */
export const hashCPF = (cpf) => {
  // Remover pontos, traços e espaços
  const cleanCPF = cpf.replace(/[^\d]/g, '');
  // Criar hash SHA-256 do CPF
  return CryptoJS.SHA256(cleanCPF).toString();
};