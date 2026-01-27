<template>
  <Suspense>
    <template #default>
      <router-view />
    </template>

    <template #fallback>
      <div class="loading">
        Loading page...
      </div>
    </template>
  </Suspense>
</template>