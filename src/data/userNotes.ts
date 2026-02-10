export type UserNote = {
  id: string;
  user_id: string;
  page_type: "recipe" | "home" | "collection";
  page_id: number | null;
  anchor_type: "ingredient" | "instruction" | "section" | null;
  anchor_id: number | null;
  content: string;
  color: string;
  position_x: number;
  position_y: number;
  z_index: number;
  created_at: string;
  updated_at: string;
};

export type CreateUserNoteInput = {
  id: string;
  page_type: UserNote["page_type"];
  page_id: number | null;
  anchor_type?: UserNote["anchor_type"];
  anchor_id?: number | null;
  content: string;
  color?: string;
  position_x: number;
  position_y: number;
};

export type UpdateUserNoteInput = {
  id: string;
  content?: string;
  color?: string;
  position_x?: number;
  position_y?: number;
  z_index?: number;
};
