import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getMessaging } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: "AIzaSyClvEcOiLqMbCSMFzkBKzzmK98zIMVOkC8",
  authDomain: "reguleran-live-musik-a69f2.firebaseapp.com",
  projectId: "reguleran-live-musik-a69f2",
  storageBucket: "reguleran-live-musik-a69f2.firebasestorage.app",
  messagingSenderId: "752424809589",
  appId: "1:752424809589:web:9fca421fb5c906b504f43c",
  measurementId: "G-1G4P445R0Q"
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
    getAnalytics(app)
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
