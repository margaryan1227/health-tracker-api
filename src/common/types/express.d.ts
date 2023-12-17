// express.d.ts
/**
 Adding 'user' property to Express Request interface
 */
declare namespace Express {
  interface Request {
    user?: {
      id: number;
      email: string;
    };
  }
}
