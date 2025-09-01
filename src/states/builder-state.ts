import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type BuilderBlock = {
  id: string;
  type: string;
  x: number;
  y: number;
  text?: string;
  color?: string;
};

type BuilderState = {
  blocks: BuilderBlock[];
  selectedId?: string;
  addBlock: (block: BuilderBlock) => void;
  moveBlock: (id: string, x: number, y: number) => void;
  updateBlock: (id: string, props: Partial<BuilderBlock>) => void;
  selectBlock: (id?: string) => void;
};

export const useBuilderStore = create<BuilderState>()(
  persist(
    (set) => ({
      blocks: [],
      addBlock: (block) => set((state) => ({ blocks: [...state.blocks, block] })),
      moveBlock: (id, x, y) =>
        set((state) => ({
          blocks: state.blocks.map((b) => (b.id === id ? { ...b, x, y } : b)),
        })),
      updateBlock: (id, props) =>
        set((state) => ({
          blocks: state.blocks.map((b) => (b.id === id ? { ...b, ...props } : b)),
        })),
      selectBlock: (id) => set({ selectedId: id }),
    }),
    { name: 'builder-blocks' }
  )
);
