//hooks/useEnrollCourse.tsx
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import apiFetcher from '@/utils/api-fetcher';

export const useEnrollCourse = () => {
  return useMutation({
    mutationFn: async (courseId: number) => {
      const response = await apiFetcher('/src/app/api/EnrollCourse/route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId }),
      });
      return response;
    }
  } as UseMutationOptions<any, Error, number>);
};

