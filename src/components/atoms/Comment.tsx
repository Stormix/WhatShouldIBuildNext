import { cn } from '@/utils/styles';
import { ChatBubbleLeftEllipsisIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import type { Comment, User } from '@prisma/client';
import { format } from 'date-fns';
import Image from 'next/image';
import type { FC } from 'react';
import Button from './Button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './DropdownMenu';

export type FullComment = Comment & {
  author: User;
};

interface CommentThreadProps {
  comment: FullComment;
  comments?: FullComment[];
  level?: number;
  reply: (id: string) => void;
}

const CommentActions: FC<{ comment: FullComment }> = ({ comment }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVerticalIcon className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Edit comment</DropdownMenuItem>
        <DropdownMenuItem>Delete comment</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const CommentComponent: FC<CommentThreadProps> = ({ comment, comments, reply, level = 0 }) => {
  const children = comments?.filter((c) => c.parentId === comment.id);
  return (
    <div className={cn('flex flex-col gap-2', `pl-${level * 4}`)}>
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
      <p className="text-black">{comment.content}</p>
      <div className="flex flex-row gap-2">
        <Button
          variant="text"
          onClick={() => reply(comment.id)}
          icon={<ChatBubbleLeftEllipsisIcon className="h-3 w-3" />}
        >
          Reply
        </Button>
      </div>
      <div className="flex flex-col gap-8">
        {children?.map((child) => (
          <CommentComponent
            key={child.id}
            comment={child}
            level={level + 1}
            comments={comments}
            reply={(id) => reply(id)}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentComponent;
