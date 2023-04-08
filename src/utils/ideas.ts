import type { GeneratedIdea } from '@/types/ideas';
import type { Component, ComponentsOnIdeas, Idea, User } from '@prisma/client';

export const ideaToIdeaDto = (
  idea: Idea & {
    author: User;
    components: (ComponentsOnIdeas & {
      component: Component;
    })[];
  },
  saved?: boolean
): GeneratedIdea => {
  return {
    id: idea.id,
    title: idea.title,
    description: idea.description,
    difficulty: idea.difficulty,
    timeToComplete: idea.timeToComplete,
    createdAt: idea.createdAt,
    updatedAt: idea.updatedAt,
    number: idea.number,
    keywords: idea.components.map((component) => component.component.value),
    saved: saved ?? false,
    author: {
      id: idea.authorId,
      name: idea.author?.name ?? ''
    }
  };
};
