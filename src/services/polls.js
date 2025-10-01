import { db, auth, ensureSignedIn } from '@/lib/firebase'
import { doc, setDoc, serverTimestamp, onSnapshot, getDoc, addDoc, collection, query, onSnapshot as onColSnapshot } from 'firebase/firestore'
import { v4 as uuid } from 'uuid'

// CREATE a poll with static options (id + text). No counts stored here.
export async function createPoll({ question, options, settings = {} }) {
  const clean = (options || [])
    .filter(t => t && t.trim())
    .map(t => ({ id: uuid(), text: t.trim() }))

  if (!question?.trim() || clean.length < 2) {
    throw new Error('Need a question and at least 2 options')
  }

  const ref = await addDoc(collection(db, 'polls'), {
    question: question.trim(),
    options: clean,
    settings: {
      allowMultiple: !!settings.allowMultiple,
      showResultsBeforeVote: settings.showResultsBeforeVote ?? true,
    },
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function getPollOnce(pollId) {
  const snap = await getDoc(doc(db, 'polls', pollId))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export function onPoll(pollId, cb) {
  return onSnapshot(doc(db, 'polls', pollId), s => cb(s.exists() ? ({ id: s.id, ...s.data() }) : null))
}

export async function vote(pollId, optionId) {
  const user = await ensureSignedIn()
  const voteRef = doc(db, 'polls', pollId, 'votes', user.uid)
  await setDoc(voteRef, { optionId, createdAt: serverTimestamp() }, { merge: false })
}

// Subscribe to votes for a poll, returns {counts, total, myVote}
export function onVotes(pollId, cb) {
  const q = query(collection(db, 'polls', pollId, 'votes'))
  return onColSnapshot(q, (snap) => {
    const counts = new Map()
    let myVote = null
    const uid = auth.currentUser?.uid
    snap.forEach(doc => {
      const { optionId } = doc.data()
      counts.set(optionId, (counts.get(optionId) || 0) + 1)
      if (doc.id === uid) myVote = optionId
    })
    const obj = Object.fromEntries(counts)
    const total = Object.values(obj).reduce((a,b)=>a+b,0)
    cb({ counts: obj, total, myVote })
  })
}
