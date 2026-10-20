import { create } from "zustand";

interface IAdminUser {
  user: {
    id: number;
    uid: string;
    firstname: string;
    lastname: string;
    email: string;
    roles: string[];
    client: string;
    created_at: Date;
  };
  roles: string[];
  permissions: string[];
}

interface IAdminUserStore {
  data: IAdminUser | undefined;
  setData: () => void;
}

export const useCounterStore = create<IAdminUserStore>((set) => ({
  data: undefined,
  setData: () => set((state) => ({ data: state.data })),
}));
