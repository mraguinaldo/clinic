"use client";

import { ReactNode, useEffect } from "react";
import { useUserDataStore } from "../../store/use-user-data-store";
import { useGetUserById } from "./use-get-user-byId";
import { useGetUserProfile } from "./use-get-user-profile";

export function UseInitializeUser({ children }: { children: ReactNode }) {
  const token = useUserDataStore((s) => s.token);
  const initialize = useUserDataStore((s) => s.initialize);

  const { data: currentUser } = useGetUserProfile();
  const { data, isSuccess } = useGetUserById(currentUser?.id);

  useEffect(() => {
    if (isSuccess && data) {
      initialize(data, token ?? undefined);
    }
  }, [isSuccess, data, initialize, token]);

  return <>{children}</>;
}
