<template>
  <div class="max-w-3xl mx-auto px-4 py-10 space-y-6">
    <h1 class="text-2xl font-bold">About Fire Poll</h1>
    <p>
      Fire Poll lets you create lightweight polls and share them instantly. No accounts are required —
      voting is one per browser, enforced by anonymous authentication.
    </p>
    <p>
      Built with Vue, Vite, and Firebase. Your data lives securely in Firestore, and votes update in real time.
    </p>
    <div class="mt-10 bg-white/80 border rounded-2xl p-5 shadow-sm">
      <PollPreviewChart :labels="['Thursday','Friday','Saturday','Sunday']" :values="demo" title="Best Day For Dinner" />
    </div>
  </div>
</template>

<script setup>
  import PollPreviewChart from '@/components/PollPreviewChart.vue'
  import { ref } from 'vue'

  const demo = ref([12, 5, 8, 2])
  setInterval(() => {
    const i = Math.floor(Math.random() * demo.value.length)
    demo.value = demo.value.map((v, idx) => idx === i ? v + 1 : v)
  }, 3000)
</script>