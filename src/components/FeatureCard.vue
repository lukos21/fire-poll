<template>
  <div class="rounded-2xl border bg-white p-5">
    <div class="flex items-center gap-3">
      <!-- Icon -->
      <component
        v-if="icon"
        :is="icon"
        :class="['w-6 h-6', accentText]"
      />
      <!-- Step badge -->
      <div
        v-else-if="step != null"
        :class="['h-7 w-7 inline-flex items-center justify-center rounded-full text-xs font-semibold', badgeBg, badgeText]"
      >
        {{ step }}
      </div>

      <div class="font-semibold">{{ title }}</div>
    </div>

    <p class="mt-2 text-gray-600 text-sm">
      {{ desc }}
    </p>
  </div>
</template>

<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    // Use either 'icon' OR 'step' (both optional)
    icon: { type: [Object, Function], default: null },
    step: { type: [Number, String], default: null },

    title: { type: String, required: true },
    desc: { type: String, required: true },

    // tasteful accent variants you can pick per card
    variant: {
      type: String,
      default: 'indigo',
      validator: (v) => ['indigo', 'violet', 'emerald'].includes(v),
    },
  })

  const accentText = computed(() => ({
    indigo: 'text-indigo-600',
    violet: 'text-violet-600',
    emerald: 'text-emerald-600',
  }[props.variant]))

  const badgeBg = computed(() => ({
    indigo: 'bg-indigo-100',
    violet: 'bg-violet-100',
    emerald: 'bg-emerald-100',
  }[props.variant]))

  const badgeText = computed(() => ({
    indigo: 'text-indigo-700',
    violet: 'text-violet-700',
    emerald: 'text-emerald-700',
  }[props.variant]))
</script>
