import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { buttonVariants } from "./index";

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
