import type { ComponentSettings } from '@/hooks/useComponentSettings';
import type { ValueOf } from '@/types/generic';
import type { GeneratedIdea } from '@/types/ideas';
import type { Component, ComponentsOnIdeas, Idea, Rating, User } from '@prisma/client';

export const ideaToIdeaDto = (
  idea: Idea & {
    author: User;
    components: (ComponentsOnIdeas & {
      component: Component;
    })[];
    ratings: Rating[];
    savedBy?: User[];
  },
  saved?: boolean,
  rated?: boolean
): GeneratedIdea => {
  const averageRating = idea.ratings?.length
    ? idea.ratings.reduce((acc, rating) => acc + rating.rating, 0) / idea.ratings.length
    : null;

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
    },
    rating: averageRating,
    ratedByThisUser: rated ?? false,
    ratingsCount: idea.ratings?.length ?? 0,
    saveCount: idea.savedBy?.length ?? 0
  };
};

export const toOptions = (components: ValueOf<ComponentSettings> | undefined) =>
  components
    ?.filter((component) => component.enabled)
    ?.map((component) => ({
      value: component.id,
      label: component.value
    })) ?? [];
