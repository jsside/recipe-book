import { UpdateUserNoteInput, UserNote } from "@/data/userNotes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { USER_NOTES_KEY, userNotesKey } from "./useGetUserNotes";
import { supabase } from "@/db/supabaseClient";

type UpdateUserNoteContext = {
  previous: {
    key: readonly unknown[];
    data: UserNote[] | undefined;
  }[];
};

// TODO[performance]: add debounce
export async function updateUserNoteFn(
  input: UpdateUserNoteInput,
): Promise<UserNote> {
  const { id, ...updates } = input;

  const { data, error } = await supabase
    .from("user_notes")
    .update({
      ...updates,
      position_x: input.position_x ? Math.round(input.position_x) : undefined,
      position_y: input.position_y ? Math.round(input.position_y) : undefined,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Usage:
 * const updateNote = useUpdateUserNote();
 * updateNote.mutate({ id, position_x, position_y });
 */
export function useUpdateUserNote() {
  const queryClient = useQueryClient();

  return useMutation<
    UserNote,
    Error,
    UpdateUserNoteInput,
    UpdateUserNoteContext
  >({
    mutationFn: updateUserNoteFn,

    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: [USER_NOTES_KEY] });

      const allQueries = queryClient
        .getQueryCache()
        .findAll({ queryKey: [USER_NOTES_KEY] });

      const previous = allQueries.map((q) => ({
        key: q.queryKey,
        data: queryClient.getQueryData<UserNote[]>(q.queryKey),
      }));

      allQueries.forEach((q) => {
        queryClient.setQueryData<UserNote[]>(q.queryKey, (old = []) =>
          old.map((n) => (n.id === input.id ? { ...n, ...input } : n)),
        );
      });

      return { previous };
    },

    onError: (_err, _input, ctx) => {
      ctx?.previous.forEach(({ key, data }) => {
        queryClient.setQueryData(key, data);
      });
    },

    onSuccess: (updated) => {
      queryClient.setQueryData<UserNote[]>(
        userNotesKey(updated.page_type, updated.page_id),
        (old = []) => old.map((n) => (n.id === updated.id ? updated : n)),
      );
    },
  });
}
