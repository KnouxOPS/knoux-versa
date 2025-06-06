import { users, transformations, vipSessions, type User, type InsertUser, type Transformation, type InsertTransformation, type VipSession, type InsertVipSession } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createTransformation(transformation: InsertTransformation): Promise<Transformation>;
  getTransformation(id: number): Promise<Transformation | undefined>;
  getUserTransformations(userId?: number): Promise<Transformation[]>;
  
  createVipSession(session: InsertVipSession): Promise<VipSession>;
  getVipSession(sessionKey: string): Promise<VipSession | undefined>;
  deactivateVipSession(sessionKey: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private transformations: Map<number, Transformation>;
  private vipSessions: Map<string, VipSession>;
  private currentUserId: number;
  private currentTransformationId: number;
  private currentVipSessionId: number;

  constructor() {
    this.users = new Map();
    this.transformations = new Map();
    this.vipSessions = new Map();
    this.currentUserId = 1;
    this.currentTransformationId = 1;
    this.currentVipSessionId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createTransformation(insertTransformation: InsertTransformation): Promise<Transformation> {
    const id = this.currentTransformationId++;
    const transformation: Transformation = { 
      ...insertTransformation, 
      id,
      createdAt: new Date()
    };
    this.transformations.set(id, transformation);
    return transformation;
  }

  async getTransformation(id: number): Promise<Transformation | undefined> {
    return this.transformations.get(id);
  }

  async getUserTransformations(userId?: number): Promise<Transformation[]> {
    return Array.from(this.transformations.values()).filter(
      (transformation) => !userId || transformation.userId === userId
    );
  }

  async createVipSession(insertVipSession: InsertVipSession): Promise<VipSession> {
    const id = this.currentVipSessionId++;
    const session: VipSession = { 
      ...insertVipSession, 
      id,
      createdAt: new Date()
    };
    this.vipSessions.set(session.sessionKey, session);
    return session;
  }

  async getVipSession(sessionKey: string): Promise<VipSession | undefined> {
    return this.vipSessions.get(sessionKey);
  }

  async deactivateVipSession(sessionKey: string): Promise<void> {
    const session = this.vipSessions.get(sessionKey);
    if (session) {
      session.isActive = false;
      this.vipSessions.set(sessionKey, session);
    }
  }
}

export const storage = new MemStorage();
