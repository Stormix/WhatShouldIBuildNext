import type { GeneratedIdea } from '@/types/ideas';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface IdeaStore {
  generatedIdea: GeneratedIdea | null;
  setGeneratedIdea: (idea: GeneratedIdea) => void;
}

export const useIdeasStore = create<IdeaStore>()(
  devtools(
    persist(
      (set) => ({
        generatedIdea: null,
        setGeneratedIdea: (idea) => set({ generatedIdea: idea })
      }),
      {
        name: 'idea-storage'
      }
    )
  )
);
