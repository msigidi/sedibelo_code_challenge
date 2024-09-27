import sjcl from 'sjcl';

const DB_NAME = 'code_challenge';
const STORE_NAME = 'visualization-app';
const ENCRYPTION_KEY = 'code_challengekey'; 

// Encrypt data using sjcl
function encryptData(data) {
  const ciphertext = sjcl.encrypt(ENCRYPTION_KEY, JSON.stringify(data));
  return ciphertext;
}

// Decrypt data using sjcl
function decryptData(ciphertext) {
  const decryptedData = JSON.parse(sjcl.decrypt(ENCRYPTION_KEY, ciphertext));
  return decryptedData;
}

// Open or create the IndexedDB database
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = (event) => {
      reject(event);
    };
  });
}

// Add encrypted data to IndexedDB
export async function addData(data) {
  const db = await openDatabase();
  const transaction = db.transaction([STORE_NAME], 'readwrite');
  const store = transaction.objectStore(STORE_NAME);

  const encryptedData = encryptData(data); // Encrypt the data
  store.add({ data: encryptedData });

  return transaction.complete;
}

// Retrieve and decrypt data from IndexedDB
export async function getData(id) {
  const db = await openDatabase();
  const transaction = db.transaction([STORE_NAME], 'readonly');
  const store = transaction.objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const request = store.get(id);

    request.onsuccess = () => {
      if (request.result) {
        const decryptedData = decryptData(request.result.data); // Decrypt the data
        resolve(decryptedData);
      } else {
        resolve(null);
      }
    };

    request.onerror = (event) => {
      reject(event);
    };
  });
}

// Update encrypted data in IndexedDB
export async function updateData(id, newData) {
  const db = await openDatabase();
  const transaction = db.transaction([STORE_NAME], 'readwrite');
  const store = transaction.objectStore(STORE_NAME);

  const encryptedData = encryptData(newData); // Encrypt the updated data
  store.put({ id, data: encryptedData });

  return transaction.complete;
}

// Delete data from IndexedDB
export async function deleteData(id) {
  const db = await openDatabase();
  const transaction = db.transaction([STORE_NAME], 'readwrite');
  const store = transaction.objectStore(STORE_NAME);

  store.delete(id);

  return transaction.complete;
}
