import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

const CACHE_KEY = 'coletivo_departures_data';

export const INITIAL_DEPARTURES = [
  {
    id: 'departure_1',
    title: 'Chapada dos Guimarães',
    dates: '15 a 18 de Julho',
    spotsText: 'Restam apenas 4 vagas',
    statusText: 'Confirmado',
    statusColor: '#10B981',
    isUrgent: false,
    link: 'https://wa.me/5511953823911?text=Olá!%20Gostaria%20de%20garantir%20minha%20vaga%20para%20a%20Chapada%20dos%20Guimarães%20(15%20a%2018%20de%20Julho).',
    order: 1
  },
  {
    id: 'departure_2',
    title: 'Expedição Pantanal Selvagem',
    dates: '22 a 26 de Julho',
    spotsText: 'Restam apenas 2 vagas',
    statusText: 'Últimas vagas!',
    statusColor: '#e63946',
    isUrgent: true,
    link: 'https://wa.me/5511953823911?text=Olá!%20Gostaria%20de%20garantir%20minha%20vaga%20para%20a%20Expedição%20Pantanal%20Selvagem%20(22%20a%2026%20de%20Julho).',
    order: 2
  },
  {
    id: 'departure_3',
    title: 'Nobres & Bom Jardim',
    dates: '05 a 07 de Agosto',
    spotsText: 'Restam 6 vagas',
    statusText: 'Confirmado',
    statusColor: '#10B981',
    isUrgent: false,
    link: 'https://wa.me/5511953823911?text=Olá!%20Gostaria%20de%20garantir%20minha%20vaga%20para%20Nobres%20&%20Bom%20Jardim%20(05%20a%2007%20de%20Agosto).',
    order: 3
  }
];

// Obter dados locais salvos ou os dados padrão
export const getLocalDepartures = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Erro ao ler cache local:', err);
  }
  return INITIAL_DEPARTURES;
};

// Salvar no cache local
export const saveLocalDepartures = (list) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn('Erro ao gravar cache local:', err);
  }
};

/**
 * Escuta saídas em tempo real.
 * Retorna os dados locais imediatamente e atualiza assim que o Firestore responder.
 */
export const subscribeDepartures = (onUpdate, onError) => {
  // Disparar imediatamente com os dados locais para nunca ficar em branco
  const initial = getLocalDepartures();
  onUpdate(initial, { source: 'local' });

  try {
    const collRef = collection(db, 'departures');
    const unsubscribe = onSnapshot(
      collRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteList = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data()
          }));
          remoteList.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
          saveLocalDepartures(remoteList);
          onUpdate(remoteList, { source: 'firestore' });
        } else {
          // Se a coleção estiver vazia no Firestore remoto, semear os dados padrão
          initial.forEach(async (item) => {
            try {
              const docRef = doc(db, 'departures', item.id);
              await setDoc(docRef, item);
            } catch (e) {
              console.warn('Erro ao auto-semear no Firestore:', e);
            }
          });
          onUpdate(initial, { source: 'local' });
        }
      },
      (error) => {
        console.warn('Firestore offline ou bloqueado, utilizando persistência local:', error);
        if (onError) onError(error);
        // Garante que os dados locais continuem ativos
        onUpdate(getLocalDepartures(), { source: 'local_fallback', error });
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn('Erro ao inicializar listener Firestore:', err);
    if (onError) onError(err);
    return () => {};
  }
};

/**
 * Adicionar novo passeio
 */
export const createDeparture = async (departureData) => {
  let createdId = 'dep_' + Date.now();
  let firestoreSuccess = false;

  try {
    const collRef = collection(db, 'departures');
    const docRef = await addDoc(collRef, departureData);
    createdId = docRef.id;
    firestoreSuccess = true;
  } catch (err) {
    console.warn('Falha ao gravar no Firestore, gravando localmente:', err);
  }

  // Atualizar cache local
  const current = getLocalDepartures();
  const newItem = { id: createdId, ...departureData };
  const updated = [...current, newItem].sort(
    (a, b) => (Number(a.order) || 0) - (Number(b.order) || 0)
  );
  saveLocalDepartures(updated);

  return { id: createdId, firestoreSuccess, item: newItem };
};

/**
 * Atualizar passeio existente
 */
export const updateDeparture = async (id, departureData) => {
  let firestoreSuccess = false;

  try {
    const docRef = doc(db, 'departures', id);
    await updateDoc(docRef, departureData);
    firestoreSuccess = true;
  } catch (err) {
    console.warn('Falha ao atualizar no Firestore, atualizando localmente:', err);
  }

  // Atualizar cache local
  const current = getLocalDepartures();
  const updated = current.map((item) =>
    item.id === id ? { ...item, ...departureData } : item
  ).sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
  saveLocalDepartures(updated);

  return { firestoreSuccess };
};

/**
 * Excluir passeio
 */
export const deleteDeparture = async (id) => {
  let firestoreSuccess = false;

  try {
    const docRef = doc(db, 'departures', id);
    await deleteDoc(docRef);
    firestoreSuccess = true;
  } catch (err) {
    console.warn('Falha ao deletar no Firestore, deletando localmente:', err);
  }

  // Atualizar cache local
  const current = getLocalDepartures();
  const updated = current.filter((item) => item.id !== id);
  saveLocalDepartures(updated);

  return { firestoreSuccess };
};
