import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// MSWサーバーの設定
export const server = setupServer(...handlers);