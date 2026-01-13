const isDev = process.env.NEXT_PUBLIC_DEV === 'true';

export const API_URL = isDev
  ? process.env.NEXT_PUBLIC_API_URL_DEV!
  : process.env.NEXT_PUBLIC_API_URL_PROD!;
