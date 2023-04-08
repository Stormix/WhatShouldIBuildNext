import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface IdeaStore {
  generatedIdeaId: string | null;
  setGeneratedIdea: (id: string | null) => void;
}

export const useIdeasStore = create<IdeaStore>()(
  devtools(
    persist(
      (set) => ({
        generatedIdeaId: null,
        setGeneratedIdea: (id) => set({ generatedIdeaId: id })
      }),
      {
        name: 'idea-storage'
      }
    )
  )
);
