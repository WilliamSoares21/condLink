import { db } from './firebaseConfig';
import { ref, push, set, update, remove, onValue } from 'firebase/database';

// Operações para Reclamações
export const createComplaint = (complaint) => {
  const newComplaintRef = push(ref(db, 'complaints'));
  return set(newComplaintRef, {
    ...complaint,
    createdAt: Date.now(),
    status: 'Pendente'
  });
};

export const updateComplaintStatus = (id, newStatus) => {
  return update(ref(db, `complaints/${id}`), { status: newStatus });
};

export const deleteComplaint = (id) => {
  return remove(ref(db, `complaints/${id}`));
};

export const listenToComplaints = (callback) => {
  return onValue(ref(db, 'complaints'), (snapshot) => {
    const data = snapshot.val();
    callback(data ? Object.entries(data).map(([id, value]) => ({ id, ...value })) : []);
  });
};
