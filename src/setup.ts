import { ValidationPipe } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');
export const setupApp = (app: any) => {
  (app as any).set('etag', false);

  app.use(cookieSession({ keys: ['qwerty'] }));

  app.use((_req: any, res: any, next: any) => {
    res.removeHeader('x-powered-by');
    res.removeHeader('date');
    next();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
};
