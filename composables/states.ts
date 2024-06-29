export const useAuthState = () =>
  useLocalState<{ id: number; session: string; username: string } | null>('authState', () => null);
