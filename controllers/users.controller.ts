import express,{ Request, Response } from "express";
import bcrypt from 'bcrypt';
import {connectionDB} from '../server';
import {UserInterface} from '../interfaces/user.interface';
import jwt from 'jsonwebtoken'

export const getAllUsers = async (req: Request,res: Response) => {
    try {
      connectionDB.query('SELECT * from users', (err, results) => {
        if(err) throw err.message;
        res.status(200).json({results})
      })  
    } catch (err) {
        return res.status(500).json({err})
    }
}

export const createUser = async (req: Request, res: Response) => {
    try {
      const { _id, name, email, password } = req.body;
  
      // Hash the password before storing it in the database
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user: UserInterface = {
        _id,
        name,
        email,
        password: hashedPassword
      };
  
      connectionDB.query('INSERT INTO users SET ?', user, (error, results, fields) => {
        if (error) {
          console.error(error);
          return res.status(500).send('Error registering user');
        }
  
        const id = results.insertId;

        const JWT_SECRET = process.env.JWT_SECRET as string
        const token = jwt.sign({ id: user._id, name: user.name }, JWT_SECRET);

        // Set the JWT as a cookie on the client
        res.cookie('jwt', token, { httpOnly: true, secure: true });

  
        // Return the user ID and name
        res.status(201).json({token, msg: "User signed up successfully"});
      });
    } catch (err) {
      return res.status(500).json({err})
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
  
      connectionDB.query('SELECT * FROM users WHERE email = ?', email, async (error, results, fields) => {
        if (error) {
          console.error(error);
          return res.status(500).send('Error logging in');
        }
  
        if (results.length === 0) {
          return res.status(401).send('Invalid email or password');
        }
  
        const user: UserInterface = results[0];
  
        // Compare the submitted password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);
  
        if (!passwordMatch) {
          return res.status(401).send('Invalid email or password');
        }

        const JWT_SECRET = process.env.JWT_SECRET as string
        const token = jwt.sign({ id: user._id, name: user.name }, JWT_SECRET);

        // Set the JWT as a cookie on the client
        res.cookie('jwt', token, { httpOnly: true, secure: true });
  
        // Return the user ID and name
        res.status(200).json({ token, msg: "User logged in successfully" });
      });
    } catch (err) {
      return res.status(500).json({err})
    }
}

export const logoutUser = async (req: Request, res: Response) => {
    try {
      // Clear the JWT cookie
      res.clearCookie('jwt');
  
      res.status(200).send('Logged out successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error logging out');
    }
}

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    connectionDB.query(`DELETE FROM users WHERE _id=?`,[req.params.id], (err, msg) => {
      if(err){
          return res.status(400).json({err: err})
      }else{
          res.status(200).json({msg: "Deleted Successfully"})
      }
  })
  } catch (err) {
    return res.status(500).json({err})
  }
}
  

