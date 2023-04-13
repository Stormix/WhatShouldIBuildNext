'use client';

import { env } from '@/env.mjs';
import Feedback from 'feeder-react-feedback';
import 'feeder-react-feedback/dist/feeder-react-feedback.css';

const FeedbackModal = () => {
  if (!env.NEXT_PUBLIC_FEEDER_PROJECT_ID) return null;
  return <Feedback projectId={env.NEXT_PUBLIC_FEEDER_PROJECT_ID} />;
};

export default FeedbackModal;
