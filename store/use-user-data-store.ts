/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

export interface IUser {
  id: number;
  password: string;
  last_login: string | null;
  nome: string;
  sobrenome: string;
  telefone: string;
  email: string;
  tipo: string;
  genero: string;
  img: string | null;
  data_nascimento: string;
  data_criacao: string;
  ultima_atualizacao: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  groups: any[];
  user_permissions: any[];
}

interface UserState {
  user: IUser | null;
  token: string | null;
  initialized: boolean;

  login: (data: { token: string; refreshToken: string; user?: IUser }) => void;
  logout: () => void;
  setUser: (user: IUser | null) => void;
  initialize: (user: IUser | null, token?: string | null) => void;
}

export const useUserDataStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      initialized: false,

      login: ({ token, refreshToken, user }) =>
        set(() => {
          Cookies.set("token", token, { expires: 7 });
          Cookies.set("refreshToken", refreshToken, { expires: 7 });
          Cookies.set("userId", String(user?.id ?? ""), { expires: 7 });

          return {
            user,
            token,
          };
        }),

      logout: () =>
        set(() => {
          Cookies.remove("token");
          Cookies.remove("userId");
          Cookies.remove("refreshToken");

          return {
            user: null,
            token: null,
          };
        }),

      setUser: (user) =>
        set(() => ({
          user,
        })),

      initialize: (user, token) =>
        set((state) => {
          const cookieToken = Cookies.get("token");
          const cookieUserId = Cookies.get("userId");

          return {
            user: user
              ? user
              : state.user ??
                (cookieUserId ? ({ id: Number(cookieUserId) } as IUser) : null),

            token: token ? token : state.token ?? cookieToken ?? null,

            initialized: true,
          };
        }),
    }),
    {
      name: "user-data-store",
    }
  )
);
