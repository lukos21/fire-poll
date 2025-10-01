<template>
  <div class="max-w-xl mx-auto p-6" v-if="poll">
    <h1 class="text-2xl font-semibold mb-3">{{ poll.question }}</h1>

    <!-- Share actions -->
    <div class="mt-2 flex items-center gap-2">
      <button class="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50" @click="openQR">QR</button>
      <button class="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50" @click="copyLink">Copy link</button>
    </div>

    <!-- QR overlay -->
    <div
      v-if="showQR"
      class="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-4"
      @click.self="showQR = false"
    >
      <div
        class="bg-white rounded-2xl p-6 w-[320px] max-w-full text-center space-y-3 shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-label="Poll QR code"
      >
        <div class="text-lg font-semibold">Scan to vote</div>
        <img v-if="qrDataUrl" :src="qrDataUrl" alt="QR code" class="mx-auto rounded-md border" />
        <div class="text-xs text-gray-500 break-all">{{ link }}</div>
        <div class="flex gap-2 justify-center">
          <button class="rounded-lg border px-3 py-2 hover:bg-gray-50" @click="downloadQR">Download PNG</button>
          <button class="rounded-lg bg-indigo-600 text-white px-3 py-2 hover:bg-indigo-700" @click="showQR=false">
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Options -->
    <div class="mt-4 space-y-2">
      <button
        v-for="o in poll.options"
        :key="o.id"
        class="w-full border rounded p-3 text-left hover:bg-gray-50 disabled:opacity-50 transition"
        :class="{
          'bg-indigo-50 border-indigo-200': myVote === o.id,
        }"
        :disabled="!!myVote"
        @click="cast(o.id)"
      >
        <span class="font-medium">{{ o.text }}</span>
        <span v-if="myVote === o.id" class="ml-2 text-xs text-indigo-600">(your vote)</span>
      </button>
    </div>

    <!-- Results -->
    <h2 class="mt-6 font-semibold">Results</h2>
    <div v-for="o in poll.options" :key="o.id" class="flex items-center gap-3">
      <div class="w-40 text-sm">{{ o.text }}</div>
      <div class="flex-1 h-3 bg-gray-100 rounded">
        <div
          class="h-3 rounded"
          :class="myVote === o.id ? 'bg-indigo-600' : 'bg-blue-500'"
          :style="{ width: getPercent(o.id) + '%' }"
        ></div>
      </div>
      <div class="w-14 text-right text-sm tabular-nums">{{ getCount(o.id) }}</div>
    </div>
  </div>

  <div v-else class="p-6 text-gray-500">Loading…</div>
  <!-- Toast -->
  <transition name="fade">
    <div
      v-if="copied"
      class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm"
    >
      Link copied!
    </div>
  </transition>
</template>

<script setup>
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
  import { useRoute } from 'vue-router'
  import { usePollStore } from '@/stores/polls'
  import { onVotes } from '@/services/polls'
  import QRCode from 'qrcode'

  const route = useRoute()
  const store = usePollStore()
  const poll = computed(() => store.current)

  // link + QR state
  const link = computed(() => `${window.location.origin}/poll/${route.params.id}`)
  const showQR = ref(false)
  const qrDataUrl = ref('')

  // vote state
  const counts = ref({})
  const total = ref(0)
  const myVote = ref(null)
  let unSubVotes = null

  onMounted(() => {
    store.watch(route.params.id)
    unSubVotes = onVotes(route.params.id, ({ counts: c, total: t, myVote: mv }) => {
      counts.value = c || {}
      total.value = t || 0
      myVote.value = mv
    })
    window.addEventListener('keydown', onKey)
  })

  onBeforeUnmount(() => {
    store.stop()
    if (unSubVotes) unSubVotes()
    window.removeEventListener('keydown', onKey)
  })

  function getCount(optionId) {
    return counts.value[optionId] || 0
  }

  function getPercent(optionId) {
    return total.value ? Math.round((getCount(optionId) / total.value) * 100) : 0
  }

  async function cast(optionId) {
    if (myVote.value) return // client guard; rules enforce one vote
    try {
      await store.vote(route.params.id, optionId)
    } catch (e) {
      console.error('[vote] error:', e)
      alert(`Vote failed: ${e?.message || 'Unknown error'}`)
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link.value)
      copied.value = true
      setTimeout(() => (copied.value = false), 2000) // hide after 2s
    } catch (e) {
      console.error('Clipboard failed', e)
    }
  }

  // QR helpers
  async function openQR() {
    if (!qrDataUrl.value) {
      qrDataUrl.value = await QRCode.toDataURL(link.value, { errorCorrectionLevel: 'M', width: 280, margin: 1 })
    }
    showQR.value = true
  }

  function downloadQR() {
    if (!qrDataUrl.value) return
    const a = document.createElement('a')
    a.href = qrDataUrl.value
    a.download = 'poll-qr.png'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  function onKey(e) {
    if (e.key === 'Escape') showQR.value = false
  }
</script>
