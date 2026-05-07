<template>
  <div class="app-layout">
    <ParticleBackground />
    <Navbar @toggle-sidebar="sidebarOpen = !sidebarOpen" />
    <div class="layout-body">
      <Sidebar :open="sidebarOpen" @close="sidebarOpen = false" />
      <main class="main-content" @click="sidebarOpen = false">
        <div class="content-wrapper">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Navbar from './Navbar.vue'
import Sidebar from './Sidebar.vue'
import ParticleBackground from './ParticleBackground.vue'

const sidebarOpen = ref(false)
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  position: relative;
}

.layout-body {
  display: flex;
  padding-top: var(--navbar-height);
  min-height: calc(100vh - var(--navbar-height));
}

.main-content {
  flex: 1;
  margin-left: 0;
  min-height: calc(100vh - var(--navbar-height));
  transition: margin-left var(--transition-normal);
}

@media (min-width: 1024px) {
  .main-content {
    margin-left: var(--sidebar-width);
  }
}

.content-wrapper {
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

@media (min-width: 1401px) {
  .content-wrapper {
    padding-right: 240px;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 1.5rem 1rem;
  }
}
</style>
