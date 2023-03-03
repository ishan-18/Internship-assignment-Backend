import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { connectionDB} from '../server';
import { UserInterface } from '../interfaces/user.interface';

declare global {
  namespace Express {
    interface Request {
      user?: UserInterface;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }
  if (!token) {
    return res.status(401).json({
      success: false,
      data: 'Not authorized to access this route',
    });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    connectionDB.query(`SELECT * FROM users WHERE _id = ?`, [decoded.id], (err, rows: UserInterface[]) => {
      if (err) {
        return res.status(500).json({
          success: false,
          data: 'Server Error',
        });
      }
      

      if (!rows.length) {
        return res.status(401).json({
          success: false,
          data: 'Not authorized to access this route',
        });
      }

      req.user = rows[0];
      next();
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      data: 'Not authorized to access this route!!',
    });
  }
};

