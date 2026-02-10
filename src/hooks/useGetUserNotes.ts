import { UserNote } from "@/data/userNotes";
import { supabase } from "@/db/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const USER_NOTES_KEY = "user-notes";

export const userNotesKey = (pageType: string, pageId: number | null) =>
  [USER_NOTES_KEY, pageType, pageId] as const;

async function getUserNotesFn(
  pageType: string,
  pageId: number | null,
): Promise<UserNote[]> {
  const query = supabase
    .from("user_notes")
    .select("*")
    .eq("page_type", pageType);

  if (pageId !== null) {
    query.eq("page_id", pageId);
  } else {
    query.is("page_id", null);
  }

  const { data, error } = await query.order("created_at");

  if (error) throw error;
  return data;
}

/**
 * Usage:
 * const { data: notes } = useUserNotes("recipe", recipeId);
 */
export function useGetUserNotes(pageType: string, pageId: number | null) {
  return useQuery<UserNote[], Error>({
    queryKey: userNotesKey(pageType, pageId),
    queryFn: () => getUserNotesFn(pageType, pageId),
  });
}
