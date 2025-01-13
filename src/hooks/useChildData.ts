import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ref, push, set, get, child } from 'firebase/database';
import { database } from '../config/firebase';
import type { ChildData } from '../types';

export const useChildData = () => {
  const queryClient = useQueryClient();

  const fetchChildData = async () => {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, 'children'));
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data).map(key => ({
        id: key,
        ...data[key],
      }));
    }
    return [];
  };

  const { data: children, isLoading: isLoadingData } = useQuery({
    queryKey: ['children'],
    queryFn: fetchChildData,
  });

  const { mutate: addChildData, isPending: isAddingData } = useMutation({
    mutationFn: async (newChild: Omit<ChildData, 'id'>) => {
      const childRef = push(ref(database, 'children'));
      await set(childRef, newChild);
      return { id: childRef.key, ...newChild };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['children'] });
    },
  });

  return {
    children,
    addChildData,
    isLoading: isLoadingData || isAddingData,
  };
};
