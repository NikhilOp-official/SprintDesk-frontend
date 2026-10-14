import { useAppSelector } from "@/store";

export const useCurrentUser = () => useAppSelector((state) => state.auth.user);

export const useIsAdmin = () =>
  useAppSelector((state) => state.auth.user?.role === "admin");
