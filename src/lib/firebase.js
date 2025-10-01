// src/lib/firebase.js
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FB_PROJECT_ID,
  appId: import.meta.env.VITE_FB_APP_ID,
}

// sanity check
for (const [k,v] of Object.entries(firebaseConfig)) {
  if (!v) throw new Error(`Missing Firebase env: ${k}`)
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)

// Resolve when we have a user (anonymous or otherwise)
export const authReady = new Promise((resolve, reject) => {
  onAuthStateChanged(auth, (user) => {
    if (user) return resolve(user)
    signInAnonymously(auth).then(({ user }) => resolve(user)).catch(reject)
  })
})

// Call this anywhere to be sure there is a user
export async function ensureSignedIn() {
  if (auth.currentUser) return auth.currentUser
  return authReady
}
