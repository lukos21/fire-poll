<template>
  <div class="max-w-3xl mx-auto px-4 py-10">
    <div class="bg-white border rounded-2xl p-6 shadow-sm">
      <div class="max-w-xl mx-auto space-y-4">
        <h1 class="text-2xl font-semibold">Create Poll</h1>

        <!-- Question -->
        <input
          v-model="question"
          class="w-full border rounded p-2"
          placeholder="Your question..."
        />

        <!-- Options -->
        <div class="space-y-2">
          <div v-for="(opt, i) in options" :key="i" class="relative">
            <input
              v-model="options[i]"
              class="w-full border rounded p-2 pr-10"
              :placeholder="`Option ${i + 1}`"
            />

            <!-- in-input remove button -->
            <button
              v-if="options.length > 2"
              type="button"
              class="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 inline-flex items-center justify-center hover:bg-gray-50 text-sm"
              @click="options.splice(i, 1)"
              :aria-label="`Remove Option ${i + 1}`"
              title="Remove"
            >
              ✕
            </button>
          </div>

          <button class="text-sm underline" @click="options.push('')">+ Add option</button>
        </div>

        <!-- Create -->
        <button
          class="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-indigo-700"
          :disabled="submitting || !canCreate"
          @click="submit"
        >
          {{ submitting ? 'Creating…' : 'Create' }}
        </button>

        <!-- Share actions -->
        <div v-if="link" class="mt-3 flex flex-wrap items-center gap-3">
          <span>Share: <a class="underline" :href="link">{{ link }}</a></span>

          <button class="rounded-lg border px-3 py-2 hover:bg-gray-50" @click="openQR">
            Show QR
          </button>
          <button class="rounded-lg border px-3 py-2 hover:bg-gray-50" @click="copyLink">
            Copy link
          </button>
        </div>

        <!-- Errors -->
        <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
      </div>
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
          <button class="rounded-lg bg-indigo-600 text-white px-3 py-2 hover:bg-indigo-700" @click="showQR = false">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
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
  import QRCode from 'qrcode'
  import { usePollStore } from '@/stores/polls'

  const store = usePollStore()

  // form state
  const question = ref('')
  const options = ref(['', ''])
  const submitting = ref(false)
  const error = ref('')

  // link + QR state
  const link = ref('')
  const showQR = ref(false)
  const qrDataUrl = ref('')
  const copied = ref(false)

  // computed
  const canCreate = computed(() =>
    question.value.trim().length > 3 &&
    options.value.filter(o => o && o.trim()).length >= 2
  )

  // actions
  async function submit() {
    error.value = ''
    if (!canCreate.value) return
    submitting.value = true
    try {
      const id = await store.create({
        question: question.value,
        options: options.value,
      })
      link.value = `${window.location.origin}/poll/${id}`

      // pre-generate QR so modal opens instantly
      qrDataUrl.value = await QRCode.toDataURL(link.value, {
        errorCorrectionLevel: 'M',
        width: 280,
        margin: 1,
      })
    } catch (e) {
      console.error('[CreatePoll] error', e)
      error.value = e?.message || 'Failed to create poll'
    } finally {
      submitting.value = false
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

  async function openQR() {
    if (!qrDataUrl.value && link.value) {
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

  // close QR on Escape
  function onKey(e) {
    if (e.key === 'Escape') showQR.value = false
  }

  onMounted(() => window.addEventListener('keydown', onKey))
  onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>
