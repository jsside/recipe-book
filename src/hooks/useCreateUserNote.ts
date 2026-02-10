import { CreateUserNoteInput, UserNote } from "@/data/userNotes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userNotesKey } from "./useGetUserNotes";
import { supabase } from "@/db/supabaseClient";

export async function createUserNoteFn(
  input: CreateUserNoteInput,
): Promise<UserNote> {
  const { data, error } = await supabase
    .from("user_notes")
    .insert({
      ...input,
      color: input.color ?? "yellow",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Usage:
 * const createNote = useCreateUserNote();
 * await createNote.mutateAsync(input);
 */
export function useCreateUserNote() {
  const queryClient = useQueryClient();

  return useMutation<UserNote, Error, CreateUserNoteInput>({
    mutationFn: createUserNoteFn,
    onSuccess: (note) => {
      queryClient.setQueryData<UserNote[]>(
        userNotesKey(note.page_type, note.page_id),
        (old = []) => [...old, note],
      );
    },
  });
}
