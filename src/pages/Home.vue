<template>
  <main>
    <!-- Hero -->
    <section class="relative overflow-hidden">
      <div class="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-200/50 blur-3xl"></div>
      <div class="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-violet-200/50 blur-3xl"></div>

      <div class="max-w-6xl mx-auto px-4 py-16 lg:py-24 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Make decisions <span class="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">in seconds</span>
          </h1>
          <p class="mt-4 text-gray-600 text-lg">
            Create a quick poll, share a link, and watch results update in real time.
            No accounts, no friction—just answers.
          </p>
          <div class="mt-8 flex items-center gap-3">
            <router-link
              to="/create"
              class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-5 py-3 font-medium hover:bg-indigo-700 active:scale-[.99] transition"
            >
              Create a poll
              <ArrowRightIcon class="w-5 h-5" />
            </router-link>

            <!-- Hide this when the How section is visible -->
            <a
              v-show="!howVisible"
              href="#how"
              class="inline-flex items-center gap-2 px-5 py-3 rounded-xl border hover:bg-white"
            >
              How it works
            </a>
          </div>
          <div class="mt-10 bg-white/80 border rounded-2xl p-5 shadow-sm">
            <PollPreviewChart :labels="['Pizza','Burritos','Sushi']" :values="demo" title="Best Team Lunch" />
          </div>
        </div>

        <!-- Simple mock card -->
        <div class="bg-white/80 border rounded-2xl p-5 shadow-sm">
          <div class="text-sm text-gray-500">Preview</div>
          <div class="mt-2 border rounded-xl p-5">
            <div class="font-semibold">Best team lunch?</div>
            <div class="mt-3 space-y-2">
              <button class="w-full text-left border rounded-lg p-3 hover:bg-gray-50">Pizza</button>
              <button class="w-full text-left border rounded-lg p-3 hover:bg-gray-50">Burritos</button>
              <button class="w-full text-left border rounded-lg p-3 hover:bg-gray-50">Sushi</button>
            </div>
            <div class="mt-4 text-xs text-gray-500">Share a link → collect votes → see results instantly.</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="max-w-6xl mx-auto px-4 py-14">
      <h2 class="text-2xl font-bold">Why Fire Poll?</h2>
      <div class="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard :icon="BoltIcon" title="Fast by default"
          desc="Create and share a poll in under 10 seconds. No sign up needed for voters."
          variant="indigo" />
        <FeatureCard :icon="ChartBarIcon" title="Live results"
          desc="Votes stream in realtime. Great for classrooms, standups, and events."
          variant="violet" />
        <FeatureCard :icon="ShieldCheckIcon" title="One vote per browser"
          desc="Anonymous auth prevents duplicate votes in the same browser."
          variant="emerald" />
      </div>
    </section>

    <!-- How it works -->
    <section id="how" class="max-w-6xl mx-auto px-4 pb-20">
      <h2 ref="howTitle" class="text-2xl font-bold">How it works</h2>
      <div class="mt-6 grid gap-4 sm:grid-cols-3">
        <FeatureCard :step="1" title="Create"
          desc="Ask a question and add 2–5 options."
          variant="indigo" />
        <FeatureCard :step="2" title="Share"
          desc="Copy your unique link or show a QR code."
          variant="violet" />
        <FeatureCard :step="3" title="Vote"
          desc="View results update in real time."
          variant="emerald" />
      </div>
      <div class="mt-8">
        <router-link
          to="/create"
          class="inline-flex items-center gap-2 rounded-xl bg-violet-600 text-white px-5 py-3 font-medium hover:bg-violet-700"
        >
          Start a poll
          <SparklesIcon class="w-5 h-5" />
        </router-link>
      </div>
    </section>
  </main>
</template>

<script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  import FeatureCard from '@/components/FeatureCard.vue'
  import { ArrowRightIcon, SparklesIcon, BoltIcon, ChartBarIcon, ShieldCheckIcon } from '@heroicons/vue/24/outline'
  import PollPreviewChart from '@/components/PollPreviewChart.vue'

  const demo = ref([12, 8, 5])
  setInterval(() => {
    const i = Math.floor(Math.random() * demo.value.length)
    demo.value = demo.value.map((v, idx) => idx === i ? v + 1 : v)
  }, 3000)

  const howTitle = ref(null)
  const howVisible = ref(false)

  let io
  onMounted(() => {
    io = new IntersectionObserver(
      entries => {
        howVisible.value = entries[0]?.isIntersecting ?? false
      },
      { root: null, threshold: 0.1 }
    )
    if (howTitle.value) io.observe(howTitle.value)
  })
  onBeforeUnmount(() => { if (io && howTitle.value) io.unobserve(howTitle.value) })
</script>
