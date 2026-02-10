import { UserNote } from "@/data/userNotes";
import { USER_NOTES_KEY } from "./useGetUserNotes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/db/supabaseClient";

export async function deleteUserNoteFn(id: string): Promise<void> {
  const { error } = await supabase.from("user_notes").delete().eq("id", id);

  if (error) throw error;
}

/**
 * Usage:
 * const deleteNote = useDeleteUserNote();
 * await deleteNote.mutateAsync(noteId);
 */
export function useDeleteUserNote() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteUserNoteFn,
    onSuccess: (_, deletedId) => {
      queryClient
        .getQueryCache()
        .findAll({ queryKey: [USER_NOTES_KEY] })
        .forEach((q) => {
          queryClient.setQueryData<UserNote[]>(q.queryKey, (old = []) =>
            old.filter((n) => n.id !== deletedId),
          );
        });
    },
  });
}
