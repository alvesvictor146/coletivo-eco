import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  setDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';

const CACHE_KEY = 'coletivo_packages_data';

export const INITIAL_PACKAGES = [
  {
    id: 'pkg_1',
    title: "Chapada dos Guimarães",
    desc: "Cachoeiras, paredões e mirantes espetaculares na savana central.",
    image: "images/chapada_guimaraes_1783969294083.png",
    days: "4 Dias",
    price: "R$ 1.890",
    order: 1,
    link: "https://wa.me/5511961781661?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20o%20pacote%20para%20Chapada%20dos%20Guimarães."
  },
  {
    id: 'pkg_2',
    title: "Nobres",
    desc: "Flutuação em rios cristalinos repletos de peixes e grutas calcárias.",
    image: "images/nobres_flutuacao_1783969302792.png",
    days: "3 Dias",
    price: "R$ 1.550",
    order: 2,
    link: "https://wa.me/5511961781661?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20o%20pacote%20para%20Nobres."
  },
  {
    id: 'pkg_3',
    title: "Pantanal",
    desc: "Safári ecológico e vivência única com a maior fauna das Américas.",
    image: "images/pantanal_jaguar_1783969312716.png",
    days: "5 Dias",
    price: "R$ 3.200",
    order: 3,
    link: "https://wa.me/5511961781661?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20o%20pacote%20para%20Pantanal."
  },
  {
    id: 'pkg_4',
    title: "Barra do Garças",
    desc: "Águas termais, cachoeiras místicas e mistérios na Serra do Roncador.",
    image: "images/hero_drone_view_1783969284798.png",
    days: "3 Dias",
    price: "R$ 1.350",
    order: 4,
    link: "https://wa.me/5511961781661?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20o%20pacote%20para%20Barra%20do%20Garças."
  },
  {
    id: 'pkg_5',
    title: "Jaciara",
    desc: "Aventura radical com rafting no Rio Tenente Amaral e cachoeiras incríveis.",
    image: "images/jaciara.png",
    days: "2 Dias",
    price: "R$ 890",
    order: 5,
    link: "https://wa.me/5511961781661?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20o%20pacote%20para%20Jaciara."
  },
  {
    id: 'pkg_6',
    title: "Vila Bela",
    desc: "Cânions imponentes e as mais altas cachoeiras do estado repletas de história.",
    image: "images/vila_bela.png",
    days: "4 Dias",
    price: "R$ 1.700",
    order: 6,
    link: "https://wa.me/5511961781661?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20o%20pacote%20para%20Vila%20Bela."
  }
];

/**
 * DT-01: Comprimir imagens no navegador com redimensionamento progressivo
 * Garante que o Base64 resultante nunca chegue perto do limite de 1MB do Firestore.
 */
export const compressImage = (file, maxWidth = 800, quality = 0.75) => {
  return new Promise((resolve) => {
    if (!file || !(file instanceof Blob)) {
      resolve('');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        try {
          const renderCanvas = (targetW, targetQuality) => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > targetW) {
              height = Math.round((height * targetW) / width);
              width = targetW;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            return canvas.toDataURL('image/jpeg', targetQuality);
          };

          let dataUrl = renderCanvas(maxWidth, quality);

          // Se a imagem ainda for maior que 400KB em base64, aplica compressão secundária
          if (dataUrl.length > 400000) {
            dataUrl = renderCanvas(600, 0.6);
          }
          if (dataUrl.length > 400000) {
            dataUrl = renderCanvas(480, 0.45);
          }

          resolve(dataUrl);
        } catch {
          resolve(event.target.result || '');
        }
      };
      img.onerror = () => resolve(event.target.result || '');
    };
    reader.onerror = () => resolve('');
  });
};

/**
 * DT-04: Deletar arquivo órfão no Firebase Storage
 */
export const deleteStorageImageIfPresent = async (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== 'string') return;
  if (imageUrl.includes('firebasestorage.googleapis.com')) {
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
      console.info('Imagem anterior removida do Storage:', imageUrl);
    } catch (err) {
      console.warn('Aviso: Não foi possível deletar imagem antiga do Storage:', err);
    }
  }
};

// Obter dados locais salvos ou os dados padrão
export const getLocalPackages = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Erro ao ler cache local de pacotes:', err);
  }
  return INITIAL_PACKAGES;
};

// Salvar no cache local
export const saveLocalPackages = (list) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn('Erro ao gravar cache local de pacotes:', err);
  }
};

/**
 * Escuta pacotes em tempo real.
 * Retorna os dados locais imediatamente e atualiza assim que o Firestore responder.
 */
export const subscribePackages = (onUpdate, onError) => {
  const initial = getLocalPackages();
  onUpdate(initial, { source: 'local' });

  try {
    const collRef = collection(db, 'packages');
    const unsubscribe = onSnapshot(
      collRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteList = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data()
          }));
          remoteList.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
          saveLocalPackages(remoteList);
          onUpdate(remoteList, { source: 'firestore' });
        } else {
          // DT-05: Auto-semear sequencialmente para evitar concorrência desordenada
          (async () => {
            for (const item of initial) {
              try {
                const docRef = doc(db, 'packages', item.id);
                await setDoc(docRef, item, { merge: true });
              } catch (e) {
                console.warn('Erro ao auto-semear pacotes no Firestore:', e);
              }
            }
          })();
          onUpdate(initial, { source: 'local' });
        }
      },
      (error) => {
        console.warn('Firestore offline ou bloqueado para pacotes, utilizando cache local:', error);
        if (onError) onError(error);
        onUpdate(getLocalPackages(), { source: 'local_fallback', error });
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn('Erro ao inicializar listener de pacotes no Firestore:', err);
    if (onError) onError(err);
    return () => {};
  }
};

/**
 * Adicionar novo pacote com timeout resiliente
 */
export const createPackage = async (packageData) => {
  let createdId = 'pkg_' + Date.now();
  let firestoreSuccess = false;

  try {
    const collRef = collection(db, 'packages');
    const addPromise = addDoc(collRef, packageData);
    
    // Timeout de 2.5s para nunca travar o painel
    const docRef = await Promise.race([
      addPromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout ao conectar Firestore')), 2500))
    ]);
    createdId = docRef.id;
    firestoreSuccess = true;
  } catch (err) {
    console.warn('Gravação remota adiada ou offline, salvando localmente:', err);
  }

  const current = getLocalPackages();
  const newItem = { id: createdId, ...packageData };
  const updated = [...current, newItem].sort(
    (a, b) => (Number(a.order) || 0) - (Number(b.order) || 0)
  );
  saveLocalPackages(updated);

  return { id: createdId, firestoreSuccess, item: newItem };
};

/**
 * Atualizar pacote existente com setDoc (merge) e timeout resiliente
 */
export const updatePackage = async (id, packageData) => {
  let firestoreSuccess = false;

  // DT-04: Limpar imagem antiga do Storage se foi substituída
  const current = getLocalPackages();
  const existingItem = current.find((item) => item.id === id);
  if (
    existingItem &&
    existingItem.image &&
    packageData.image &&
    existingItem.image !== packageData.image
  ) {
    deleteStorageImageIfPresent(existingItem.image).catch(() => {});
  }

  try {
    const docRef = doc(db, 'packages', id);
    const savePromise = setDoc(docRef, packageData, { merge: true });
    
    await Promise.race([
      savePromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout ao atualizar Firestore')), 2500))
    ]);
    firestoreSuccess = true;
  } catch (err) {
    console.warn('Atualização remota adiada ou offline, salvando localmente:', err);
  }

  const updated = current.map((item) =>
    item.id === id ? { ...item, ...packageData } : item
  ).sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
  saveLocalPackages(updated);

  return { firestoreSuccess };
};

/**
 * Excluir pacote com timeout resiliente
 */
export const deletePackage = async (id) => {
  let firestoreSuccess = false;

  // DT-04: Remover imagem do Storage ao deletar pacote
  const current = getLocalPackages();
  const existingItem = current.find((item) => item.id === id);
  if (existingItem && existingItem.image) {
    deleteStorageImageIfPresent(existingItem.image).catch(() => {});
  }

  try {
    const docRef = doc(db, 'packages', id);
    const delPromise = deleteDoc(docRef);
    await Promise.race([
      delPromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout ao deletar Firestore')), 2500))
    ]);
    firestoreSuccess = true;
  } catch (err) {
    console.warn('Exclusão remota adiada ou offline, deletando localmente:', err);
  }

  const updated = current.filter((item) => item.id !== id);
  saveLocalPackages(updated);

  return { firestoreSuccess };
};

/**
 * DT-01 & DT-06: Upload de imagem de pacote com compressão garantida e timeout ajustado para 4.5s
 */
export const uploadPackageImage = async (file) => {
  // Comprime a imagem instantaneamente com limite seguro de tamanho
  const compressedDataUrl = await compressImage(file, 800, 0.75);

  try {
    const safeName = file.name ? file.name.replace(/[^a-zA-Z0-9._-]/g, '_') : 'image.jpg';
    const fileName = `packages/${Date.now()}_${safeName}`;
    const storageRef = ref(storage, fileName);

    const uploadTask = async () => {
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    };

    // DT-06: Timeout de 4.5s para Firebase Storage (ideal para conexões 3G/4G e WiFi)
    const downloadURL = await Promise.race([
      uploadTask(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Firebase Storage timeout')), 4500))
    ]);

    return downloadURL;
  } catch (err) {
    console.warn('Firebase Storage offline ou timeout, utilizando imagem comprimida local:', err);
    // DT-01: Salvaguarda de segurança final: se o Base64 passar de 500KB, recomprime mais
    if (compressedDataUrl && compressedDataUrl.length > 500000) {
      return await compressImage(file, 480, 0.45);
    }
    return compressedDataUrl;
  }
};
