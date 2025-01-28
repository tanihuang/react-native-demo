import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { loadUser } from '@/store/authSlice';

const useLoadUser = () => {
  const dispatch = useDispatch<any>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await dispatch(loadUser());
      } catch (err: any) {
        setError(err.message || 'Failed to load user data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [dispatch]);

  return { isLoading, error };
};

export default useLoadUser;
