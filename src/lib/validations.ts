import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(30, 'Username must be at most 30 characters'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'Password must contain at least one special character'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.enum(['STUDENT', 'PROFESSOR', 'MANAGEMENT']).default('STUDENT'),
  department: z.string().optional(),
  year: z.number().min(1).max(6).optional(),
  graduationYear: z.number().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const postSchema = z.object({
  content: z.string().min(1, 'Content is required').max(5000, 'Content must be at most 5000 characters'),
  type: z.enum(['POST', 'ARTICLE', 'ANNOUNCEMENT']).default('POST'),
  title: z.string().max(200).optional(),
  images: z.array(z.string()).default([]),
  visibility: z.enum(['PUBLIC', 'PRIVATE', 'CONNECTED']).default('PUBLIC'),
  tags: z.array(z.string()).default([]),
  repoId: z.string().optional(),
});

export const commentSchema = z.object({
  content: z.string().min(1, 'Content is required').max(2000, 'Content must be at most 2000 characters'),
  parentId: z.string().optional(),
});

export const connectionSchema = z.object({
  userId: z.string(),
});

export const messageSchema = z.object({
  receiverId: z.string(),
  content: z.string().min(1, 'Message cannot be empty').max(5000, 'Message too long'),
});

export const repoSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
  description: z.string().max(500).optional(),
  url: z.string().url().optional().or(z.literal('')),
  language: z.string().optional(),
  topics: z.array(z.string()).default([]),
  visibility: z.enum(['PUBLIC', 'PRIVATE']).default('PUBLIC'),
});

export const eventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be at most 200 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  type: z.string(),
  capacity: z.number().optional(),
  tags: z.array(z.string()).default([]),
});

export const skillSchema = z.object({
  skillId: z.string(),
});

export const jobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  company: z.string().min(1, 'Company is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  type: z.enum(['INTERNSHIP', 'FULL_TIME', 'PART_TIME', 'CONTRACT', 'RESEARCH']),
  location: z.string().optional(),
  requirements: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  salary: z.string().optional(),
  deadline: z.string().datetime().optional(),
  applicationLink: z.string().url().optional().or(z.literal('')),
});

export const profileUpdateSchema = z.object({
  bio: z.string().max(500).optional(),
  department: z.string().optional(),
  year: z.number().optional(),
  graduationYear: z.number().optional(),
  location: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  resumeUrl: z.string().url().optional().or(z.literal('')),
  pronouns: z.string().optional(),
  phone: z.string().optional(),
  interests: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const emailVerificationSchema = z.object({
  token: z.string(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type PostInput = z.infer<typeof postSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
export type ConnectionInput = z.infer<typeof connectionSchema>;
export type MessageInput = z.infer<typeof messageSchema>;
export type RepoInput = z.infer<typeof repoSchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type JobInput = z.infer<typeof jobSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
