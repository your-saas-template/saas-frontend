"use client";

import type { ReactNode } from "react";
import { AuthProvider as BaseAuthProvider } from "@/entities/user";

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  return <BaseAuthProvider>{children}</BaseAuthProvider>;
};
