import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getMessaging } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

let app = null
let auth = null
let db = null
let storage = null
let messaging = null

export const isConfigured = () => {
  return !!(firebaseConfig.apiKey && firebaseConfig.projectId)
}

export const getFirebaseApp = () => {
  if (!app && isConfigured()) {
    app = initializeApp(firebaseConfig)
  }
  return app
}

export const getFirebaseAuth = () => {
  if (!auth) {
    const a = getFirebaseApp()
    if (a) auth = getAuth(a)
  }
  return auth
}

export const getFirestoreDB = () => {
  if (!db) {
    const a = getFirebaseApp()
    if (a) db = getFirestore(a)
  }
  return db
}

export const getFirebaseStorage = () => {
  if (!storage) {
    const a = getFirebaseApp()
    if (a) storage = getStorage(a)
  }
  return storage
}

export const getFirebaseMessaging = () => {
  if (!messaging) {
    const a = getFirebaseApp()
    if (a) {
      try { messaging = getMessaging(a) } catch (e) { console.warn('Messaging unavailable:', e.message) }
    }
  }
  return messaging
}
