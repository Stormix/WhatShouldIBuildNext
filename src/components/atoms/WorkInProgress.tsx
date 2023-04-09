import { env } from '@/env.mjs';
import { format } from 'date-fns';
import React from 'react';

const WorkInProgress: React.FC = () => {
  const timestamp = format(new Date(Number(env.NEXT_PUBLIC_COMMIT_TIMESTAMP) * 1000), 'dd/MM/yyyy HH:mm:ss');
  return (
    <div className="flex flex-row items-center gap-2">
      <span className="flex-grow">Still a work in progress. Still need to finish the copy writing.</span>
      <span className="hidden gap-2 lg:flex">
        Last commit{' '}
        <a
          target="_blank"
          className="text-primary"
          href={`https://github.com/Stormix/hack-ideas/commit/${env.NEXT_PUBLIC_COMMIT_HASH}`}
          rel="noreferrer"
        >
          {env.NEXT_PUBLIC_COMMIT_HASH}
        </a>{' '}
        at <b>{timestamp}</b>
      </span>
    </div>
  );
};

export default WorkInProgress;
