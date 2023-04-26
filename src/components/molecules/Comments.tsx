import type { GeneratedIdea } from '@/types/ideas';
import { api } from '@/utils/api';
import { addCommentSchema } from '@/validation/comments';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import type { FC } from 'react';
import { useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useForm, useFormState } from 'react-hook-form';
import toast from 'react-hot-toast';
import type { z } from 'zod';
import Button from '../atoms/Button';
import { Card, CardContent } from '../atoms/Card';
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
  const { executeRecaptcha } = useGoogleReCaptcha();

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
      captcha: '',
      parentId: parentId
    }
  });

  const { errors } = useFormState({ control });

  const onSubmit = async (data: FormValues) => {
    if (!session?.user) {
      return toast.error('Please login first!');
    }

    if (!executeRecaptcha) {
      console.warn('Execute recaptcha not yet available');
      return;
    }

    const token = await executeRecaptcha('yourAction');

    if (!commenting && token) {
      addComment({ ...data, parentId, captcha: token });
    }
  };

  return (
    <Card>
      <CardContent>
        <div className="mx-auto flex w-full flex-col gap-4 px-4">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold  lg:text-2xl">Discussion ({comments.length})</h2>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="mb-6 flex flex-col gap-4">
            <h3 className="text-lg font-bold  lg:text-2xl">
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
            <div className="flex items-center justify-start gap-4">
              <Button type="submit" className=" w-fit" loading={commenting}>
                {parentId ? 'Post reply' : 'Post comment'}
              </Button>
              {parentId && (
                <Button
                  type="button"
                  variant={'text'}
                  className=" w-fit"
                  onClick={() => {
                    setParentId(undefined);
                    setValue('parentId', undefined);
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
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
                  reply={(id) => {
                    setParentId(id);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Comments;
