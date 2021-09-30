import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { User } from 'src/users/interfaces/user.interface';

@Injectable()
export class DemoClassMiddeWare implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('call mdw class');
    const user: User = req.body;
    if (user.age > 15) {
      user.nameMid = 'class middleware';
    }
    next();
  }
}
