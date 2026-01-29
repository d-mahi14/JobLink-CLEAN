import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, profile, isAuthenticated, isLoading } = useAuthStore();

  return {
    user,
    profile,
    isAuthenticated,
    isLoading,
    isCandidate: profile?.user_type === 'candidate',
    isCompany: profile?.user_type === 'company',
  };
};