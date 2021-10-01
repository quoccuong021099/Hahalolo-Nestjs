import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Cat } from 'src/cats/cat.interface';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Middleware');

    const cat: Cat = req.body;
    cat.isAdult = false;

    if (cat.age >= 18) {
      cat.isAdult = true;
    }

    next();
  }
}
