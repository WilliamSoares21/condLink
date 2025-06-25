import { auth, db } from './firebaseConfig';
import { ref, push, set, update, remove, onValue, get } from 'firebase/database';

// Verificar se o usuário atual é administrador
const isCurrentUserAdmin = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) return false;
  
  try {
    const snapshot = await get(ref(db, `users/${currentUser.uid}`));
    const userData = snapshot.val();
    return userData && userData.isAdmin === true;
  } catch (error) {
    console.error("Erro verificando status de admin:", error);
    return false;
  }
};

// Operações para Reclamações
export const createComplaint = async (complaint) => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("Usuário não autenticado");
  
  try {
    const userSnapshot = await get(ref(db, `users/${currentUser.uid}`));
    const userData = userSnapshot.val();
    
    const newComplaintRef = push(ref(db, 'complaints'));
    return set(newComplaintRef, {
      ...complaint,
      userId: currentUser.uid,
      userName: userData?.name || 'Usuário',
      block: userData?.block || '-',
      apartment: userData?.apartment || '-',
      createdAt: Date.now(),
      status: 'Pendente',
      date: new Date().toISOString()
    });
  } catch (error) {
    console.error("Erro ao criar reclamação:", error);
    throw error;
  }
};

export const updateComplaintStatus = async (id, newStatus, notes = null) => {
  const admin = await isCurrentUserAdmin();
  if (!admin) {
    throw new Error("Permissão negada: Apenas administradores podem atualizar status de reclamações");
  }
  
  const updateData = { 
    status: newStatus,
    lastUpdated: Date.now()
  };
  
  if (notes !== null) {
    updateData.notes = notes;
  }
  
  return update(ref(db, `complaints/${id}`), updateData);
};

export const deleteComplaint = async (id) => {
  const snapshot = await get(ref(db, `complaints/${id}`));
  if (!snapshot.exists()) throw new Error("Reclamação não encontrada");
  
  const complaint = snapshot.val();
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("Usuário não autenticado");
  
  const isOwner = complaint.userId === currentUser.uid;
  const isAdmin = await isCurrentUserAdmin();
  
  if (!isOwner && !isAdmin) {
    throw new Error("Permissão negada: Você só pode excluir suas próprias reclamações");
  }
  
  return remove(ref(db, `complaints/${id}`));
};

export const listenToComplaints = (callback) => {
  const complaintsRef = ref(db, 'complaints');
  
  return onValue(complaintsRef, 
    (snapshot) => {
      try {
        const data = snapshot.val();
        const complaintsList = data 
          ? Object.entries(data).map(([id, value]) => ({ id, ...value }))
          : [];
        callback(complaintsList);
      } catch (error) {
        console.error("Erro no listener de reclamações:", error);
        callback([]);
      }
    },
    (error) => {
      console.error("Erro no listener:", error);
      callback([]);
    }
  );
};

export const listenToUserComplaints = (userId, callback) => {
  const complaintsRef = ref(db, 'complaints');
  
  return onValue(complaintsRef, 
    (snapshot) => {
      try {
        const data = snapshot.val();
        const complaintsList = data 
          ? Object.entries(data)
            .map(([id, value]) => ({ id, ...value }))
            .filter(complaint => complaint.userId === userId)
          : [];
        callback(complaintsList);
      } catch (error) {
        console.error("Erro no listener de reclamações do usuário:", error);
        callback([]);
      }
    },
    (error) => {
      console.error("Erro no listener:", error);
      callback([]);
    }
  );
};
