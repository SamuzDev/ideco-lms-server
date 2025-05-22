import express from 'express';
import { auth } from '@/lib/auth.js';
import { fromNodeHeaders } from 'better-auth/node';

/**
 * Middleware que asegura que el usuario esté autenticado
 */
export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (!req.user) {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      if (!session?.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      req.user = session.user;
    } catch (error) {
      return res.status(500).json({ message: 'Error validating session', error });
    }
  }

  next();
};

/**
 * Middleware que asegura que el usuario tenga un rol específico
 * @param role Rol requerido (ej: "admin", "instructo", etc.)
 */
export const requireRole = (role: string) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!req.user) {
      try {
        const session = await auth.api.getSession({
          headers: fromNodeHeaders(req.headers),
        });

        if (!session?.user) {
          return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = session.user;
      } catch (error) {
        return res.status(500).json({ message: 'Error validating session', error });
      }
    }

    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }

    next();
  };
};
