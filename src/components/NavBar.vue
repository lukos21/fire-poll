<template>
  <header class="sticky top-0 z-40 bg-white/70 backdrop-blur border-b">
    <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
      <router-link to="/" class="flex items-center gap-2">
        <div class="relative h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500"><span class="absolute left-2.5 top-1.5">🔥</span></div>
        <span class="font-semibold">Fire Poll</span>
      </router-link>
      <nav class="flex items-center gap-4 text-sm">
        <router-link class="hover:text-indigo-600" to="/create">Create</router-link>
        <router-link class="hover:text-indigo-600" to="/about">About</router-link>
      </nav>
    </div>
  </header>
</template>
