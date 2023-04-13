'use client';

import { env } from '@/env.mjs';
import 'feeder-react-feedback/dist/feeder-react-feedback.css';
import dynamic from 'next/dynamic';

const Feedback = dynamic<{ projectId: string; email: boolean; postSubmitButtonMsg: string }>(
  () => import('feeder-react-feedback'),
  {
    ssr: false
  }
);

const FeedbackModal = () => {
  if (!env.NEXT_PUBLIC_FEEDER_PROJECT_ID) return null;
  return <Feedback projectId={env.NEXT_PUBLIC_FEEDER_PROJECT_ID} email={true} postSubmitButtonMsg={`Thank you!`} />;
};

export default FeedbackModal;
