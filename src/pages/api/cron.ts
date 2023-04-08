import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(request: NextApiRequest, response: NextApiResponse) {
  console.log('Cron job ran at: ', new Date().toISOString());

  response.status(200).json({
    body: request.body,
    query: request.query,
    cookies: request.cookies
  });
}
