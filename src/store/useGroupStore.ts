import { create } from "zustand";

interface GroupStore {
  groups: string[];
  activeGroup: string;
  activeGroupIdx: number;
  setGroups: (groups: string[]) => void;
  setActiveGroup: (activeGroup: string) => void;
  setActiveGroupIdx: (activeGroupIdx: number) => void;
}

const useGroupStore = create<GroupStore>((set) => ({
  groups: [],
  activeGroup: '',
  activeGroupIdx: 0,
  setGroups: (groups: string[]) => set({ groups }),
  setActiveGroup: (activeGroup: string) => set({ activeGroup }),
  setActiveGroupIdx: (activeGroupIdx: number) => set({ activeGroupIdx })
}))

export default useGroupStore;