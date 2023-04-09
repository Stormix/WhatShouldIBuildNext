import type { GeneratedIdea } from '@/types/ideas';
import { api } from '@/utils/api';
import { addCommentSchema } from '@/validation/comments';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import type { FC } from 'react';
import { useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import toast from 'react-hot-toast';
import type { z } from 'zod';
import Button from '../atoms/Button';
import Card from '../atoms/Card';
import type { FullComment } from '../atoms/Comment';
import CommentComponent from '../atoms/Comment';
import Loading from '../atoms/Loading';
import { Textarea } from '../atoms/Textarea';

type FormValues = z.TypeOf<typeof addCommentSchema>;

const Comments: FC<{
  idea: GeneratedIdea;
  comments: FullComment[];
  loading?: boolean;
}> = ({ idea, comments, loading }) => {
  const context = api.useContext();
  const [parentId, setParentId] = useState<string | undefined>(undefined);
  const parent = comments.find((comment) => comment.id === parentId);

  const sortComments = (comments: FullComment[]) => {
    return comments.sort((b, a) => {
      if (a.createdAt > b.createdAt) {
        return 1;
      } else if (a.createdAt < b.createdAt) {
        return -1;
      } else {
        return 0;
      }
    });
  };

  const { data: session, update } = useSession();
  const { isLoading: commenting, mutate: addComment } = api.comments.addComment.useMutation({
    onSuccess: () => {
      context.comments.getAll.invalidate({ ideaId: idea.id });
      update();
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const { handleSubmit, setValue, control } = useForm<FormValues>({
    resolver: zodResolver(addCommentSchema),
    defaultValues: {
      content: '',
      ideaId: idea.id,
      parentId: parentId
    }
  });

  const { errors } = useFormState({ control });

  const onSubmit = (data: FormValues) => {
    if (!session?.user) {
      return toast.error('Please login first!');
    }

    if (!commenting) {
      addComment(data);
    }
  };

  return (
    <Card>
      <div className="mx-auto flex w-full flex-col gap-4 px-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-black lg:text-2xl">Discussion (20)</h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mb-6 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-black lg:text-2xl">
            {parentId ? `Replying to ${parent?.author?.name}: ${parent?.content.substring(0, 85)}...` : 'Add comment'}
          </h3>
          <Textarea
            id="comment"
            placeholder="Write a comment..."
            required
            onChange={(e) => {
              setValue('content', e.target.value);
            }}
          />
          {errors.content && <p className="text-red-500">{errors.content.message}</p>}
          <Button type="submit" className="float-right w-fit" loading={commenting}>
            {parentId ? 'Post reply' : 'Post comment'}
          </Button>
        </form>
        {loading && (
          <div className="flex items-center justify-center">
            <Loading />
          </div>
        )}
        {comments.length > 0 && (
          <div className="flex max-h-96 flex-col gap-8 overflow-auto">
            {sortComments(comments).map((comment) => (
              <CommentComponent
                key={comment.id}
                comment={comment}
                comments={comments}
                reply={(id) => setParentId(id)}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default Comments;
