<template>
  <div class="py-4 pr-4 h-full">
    <div class="bg-gray-900 rounded-2xl h-full overflow-hidden relative px-9 py-6">
      <div v-if="authState != null">
        <div class="text-4xl font-bold pb-6">Hello, {{ authState.username }}</div>
        <button
          class="bg-red-600 rounded-xl font-bold px-12 py-2"
          @click="() => logout()"
          :disabled="loading">
          Log out
        </button>
      </div>
      <div v-else class="h-full flex items-center justify-center">
        <div class="flex flex-col items-center pb-5">
          <h1 class="text-4xl font-bold">Log In</h1>

          <div class="pt-5">
            <div class="relative mt-2 rounded-md">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span class="text-gray-500 !text-[18px] material-symbols-outlined"> person </span>
              </div>
              <input
                type="text"
                class="block w-full rounded-md border-0 py-1.5 pl-10 pr-20 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-300"
                placeholder="Username"
                v-model="username" />
            </div>
          </div>

          <div class="pt-3">
            <div class="relative mt-2 rounded-md">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span class="text-gray-500 !text-[18px] material-symbols-outlined"> password </span>
              </div>
              <input
                type="password"
                class="block w-full rounded-md border-0 py-1.5 pl-10 pr-20 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-300"
                placeholder="Password"
                v-model="password" />
            </div>
          </div>

          <button
            class="bg-green-600 rounded-xl font-bold px-12 py-2 mt-8 w-full"
            @click="() => login()"
            :disabled="loading">
            Log in
          </button>
          <div class="text-red-600 text-sm mt-2">
            {{ loginError }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const authState = useAuthState();

const loading = ref(false);

const username = ref('');
const password = ref('');
const loginError = ref('');

const logout = async () => {
  loading.value = true;
  if (authState.value == null) return;
  await $fetch('/api/logout', {
    method: 'POST',
    body: {
      session: authState.value.session,
    },
    headers: authState.value != null ? { Authorization: authState.value.session } : {},
  });
  authState.value = null;
  loading.value = false;
};

const login = async () => {
  loading.value = true;
  const result = await $fetch('/api/login', {
    method: 'POST',
    body: {
      username: username.value,
      password: password.value,
    },
  });
  if (result.success && result.token != null && result.id != null && result.username != null) {
    authState.value = {
      id: result.id,
      session: result.token,
      username: result.username,
    };
  } else {
    loginError.value = result.error ?? 'error, please try again';
  }

  loading.value = false;
};
</script>
