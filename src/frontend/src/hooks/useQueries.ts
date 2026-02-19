import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Student } from '../backend';

// Query key constants
const STUDENTS_QUERY_KEY = ['students'];

// Fetch all students
export function useGetAllStudents() {
  const { actor, isFetching } = useActor();

  return useQuery<Student[]>({
    queryKey: STUDENTS_QUERY_KEY,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllStudents();
    },
    enabled: !!actor && !isFetching,
  });
}

// Add a new student
export function useAddStudent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, email, uid }: { name: string; email: string; uid: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addStudent(name, email, uid);
    },
    onSuccess: () => {
      // Invalidate and refetch students list
      queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
    },
  });
}

// Update an existing student
export function useUpdateStudent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ uid, name, email }: { uid: string; name: string; email: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateStudent(uid, name, email);
    },
    onSuccess: () => {
      // Invalidate and refetch students list
      queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
    },
  });
}
