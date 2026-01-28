import { PropsWithChildren, ReactNode } from "react";

export type RenderComponentProps = PropsWithChildren<{
  if: boolean;
  then: ReactNode;
  else?: ReactNode;
}>;
