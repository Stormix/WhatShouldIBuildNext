import { api } from '@/utils/api';
import { cn } from '@/utils/styles';
import { ChatBubbleLeftEllipsisIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import type { Comment, User } from '@prisma/client';
import { format } from 'date-fns';
import Image from 'next/image';
import type { FC } from 'react';
import { toast } from 'react-hot-toast';
import Button from './Button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './DropdownMenu';

export type FullComment = Comment & {
  author: User;
  children?: FullComment[];
};

interface CommentThreadProps {
  comment: FullComment;
  comments?: FullComment[];
  level?: number;
  reply: (id: string) => void;
}

const CommentActions: FC<{ comment: FullComment }> = ({ comment }) => {
  const context = api.useContext();
  const { mutate: deleteComment } = api.comments.deleteComment.useMutation({
    onSuccess: () => {
      context.comments.getAll.invalidate();
      toast.success('Comment deleted');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVerticalIcon className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Edit comment</DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            deleteComment({
              id: comment.id
            })
          }
        >
          Delete comment
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const CommentComponent: FC<CommentThreadProps> = ({ comment, comments, reply, level = 0 }) => {
  const children = comment.children;
  return (
    <div
      className={cn('flex flex-col gap-2')}
      style={{
        marginLeft: `${level * 2}rem`
      }}
    >
      <div className="flex flex-row gap-2">
        <div className="flex flex-grow flex-row items-center gap-2">
          <Image
            className="rounded-full"
            src={comment.author.image as string}
            alt={comment.author.name as string}
            width={40}
            height={40}
          />
          <p className="font-semibold text-black">{comment.author.name}</p>
          <span className="opacity-70 text-black">{format(comment.createdAt, 'dd/MM/yyyy HH:mm:ss')}</span>
        </div>
        <CommentActions comment={comment} />
      </div>
      <div className="py-2 text-black">{comment.content}</div>
      <div className="flex flex-row gap-2 border-b border-opacity-20 pb-2 border-black">
        <Button
          variant="text"
          size="text"
          onClick={() => reply(comment.id)}
          icon={<ChatBubbleLeftEllipsisIcon className="h-3 w-3" />}
        >
          Reply
        </Button>
      </div>
      {(children?.length ?? 0) > 0 && (
        <div className="mt-4 flex flex-col gap-8">
          {children?.map((child) => (
            <CommentComponent
              key={child.id}
              comment={child}
              level={level + 1}
              comments={comments}
              reply={() => reply(comment.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentComponent;
