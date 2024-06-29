export default defineNuxtRouteMiddleware((to, from) => {
  const authState = useAuthState();
  if (
    authState.value == null &&
    to.path !== '/' &&
    !to.path.startsWith('/map') &&
    to.path !== '/account'
  ) {
    return navigateTo('/account');
  }
});
