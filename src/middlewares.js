import jwt from 'jsonwebtoken';
import { secret } from './config.js';

export const notFound = (req, res, next) => {
    res.status(404);
    const error = new Error(`🔎- No encontrado - ${req.originalUrl}`);
    next(error);
} 

export const errorHandler = (err, req, res, next) => {
   const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
   res.status(statusCode);
   res.json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? '⚠️' : err.stack,
   });
}

export const auth = (req, res, next) => {
   const token = req.header('x-auth-token');
 
   // Check for token
   if (!token) {
     return res.status(401).json({ msg: 'Sin token, no tienes autorización' });
   }
 
   try {
     // Verify token
     const decoded = jwt.verify(token, secret);
     // Add user from payload
     req.usuario = decoded;
     next();
   } catch (e) {
     res.status(400).json({ msg: 'Token inválido' });
   }
 };



