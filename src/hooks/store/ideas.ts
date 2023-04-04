import type { Idea } from '@prisma/client';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface IdeaStore {
  generatedIdea: Idea | null;
  setGeneratedIdea: (idea: Idea) => void;
}

export const useIdeasStore = create<IdeaStore>()(
  devtools(
    persist(
      (set) => ({
        generatedIdea: null,
        setGeneratedIdea: (idea: Idea) => set({ generatedIdea: idea })
      }),
      {
        name: 'idea-storage'
      }
    )
  )
);
