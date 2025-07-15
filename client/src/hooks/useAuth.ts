export interface User {
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
}

const useAuth = (): AuthState => {
  // This is a placeholder hook to resolve a build error.
  // Replace with your actual authentication logic.
  return { user: null, loading: false };
};

export default useAuth;
