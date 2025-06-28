import { appointments, users, type User, type InsertUser, type Appointment, type InsertAppointment } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Appointment methods
  createAppointment(appointment: Omit<InsertAppointment, 'appointmentDate'> & { 
    appointmentDate: Date;
    cancelToken: string;
    rescheduleToken: string;
  }): Promise<Appointment>;
  getAppointment(id: number): Promise<Appointment | undefined>;
  getAppointmentByToken(token: string, type: 'cancel' | 'reschedule'): Promise<Appointment | undefined>;
  updateAppointmentStatus(id: number, status: string): Promise<void>;
  updateAppointment(id: number, updates: Partial<Appointment>): Promise<Appointment | undefined>;
  getUpcomingAppointments(): Promise<Appointment[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createAppointment(appointmentData: Omit<InsertAppointment, 'appointmentDate'> & { 
    appointmentDate: Date;
    cancelToken: string;
    rescheduleToken: string;
  }): Promise<Appointment> {
    const [appointment] = await db
      .insert(appointments)
      .values({
        ...appointmentData,
        appointmentDate: appointmentData.appointmentDate,
      })
      .returning();
    return appointment;
  }

  async getAppointment(id: number): Promise<Appointment | undefined> {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment || undefined;
  }

  async getAppointmentByToken(token: string, type: 'cancel' | 'reschedule'): Promise<Appointment | undefined> {
    const column = type === 'cancel' ? appointments.cancelToken : appointments.rescheduleToken;
    const [appointment] = await db.select().from(appointments).where(eq(column, token));
    return appointment || undefined;
  }

  async updateAppointmentStatus(id: number, status: string): Promise<void> {
    await db
      .update(appointments)
      .set({ status, updatedAt: new Date() })
      .where(eq(appointments.id, id));
  }

  async updateAppointment(id: number, updates: Partial<Appointment>): Promise<Appointment | undefined> {
    const [appointment] = await db
      .update(appointments)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(appointments.id, id))
      .returning();
    return appointment || undefined;
  }

  async getUpcomingAppointments(): Promise<Appointment[]> {
    const now = new Date();
    const appointments24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const appointments1h = new Date(now.getTime() + 60 * 60 * 1000);
    
    return await db
      .select()
      .from(appointments)
      .where(eq(appointments.status, "scheduled"));
  }
}

export const storage = new DatabaseStorage();
