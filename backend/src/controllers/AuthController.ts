import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { AppDataSource } from '../utils/database';
import { User } from '../models/User';
import { hashPassword, comparePassword, generateToken, AuthRequest } from '../utils/auth';

export class AuthController {
  private userRepository = AppDataSource.getRepository(User);

  async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName } = req.body;

      // Check if user already exists
      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists with this email' });
      }

      // Create new user
      const user = this.userRepository.create({
        email,
        password: await hashPassword(password),
        firstName,
        lastName
      });

      // Validate user data
      const errors = await validate(user);
      if (errors.length > 0) {
        return res.status(400).json({ errors: errors.map(e => e.constraints) });
      }

      await this.userRepository.save(user);

      // Generate token
      const token = generateToken(user.id);

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          currentDifficultyLevel: user.currentDifficultyLevel
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Verify password
      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate token
      const token = generateToken(user.id);

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          currentDifficultyLevel: user.currentDifficultyLevel
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getProfile(req: AuthRequest, res: Response) {
    try {
      const user = await this.userRepository.findOne({ where: { id: req.userId } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        currentDifficultyLevel: user.currentDifficultyLevel
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
