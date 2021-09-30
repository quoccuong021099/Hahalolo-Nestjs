import { Request, Response, NextFunction } from 'express';
import { User } from 'src/users/interfaces/user.interface';

export function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(req.body);

  const users: User = req.body;
  users.isAdult = false;
  if (users.age > 15) {
    users.isAdult = true;
  }
  // console.log('res', res);
  console.log(`Call MDW`);
  next();
}
