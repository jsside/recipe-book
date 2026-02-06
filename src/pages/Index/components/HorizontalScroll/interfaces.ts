import { ReactNode } from "react";

export interface HorizontalScrollProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  viewAllLink?: string;
  viewAllText?: string;
}
