import { type Patient, type InsertPatient, type DentalChart, type InsertDentalChart } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;
  
  // Patient operations
  createPatient(patient: InsertPatient): Promise<Patient>;
  getPatient(id: string): Promise<Patient | undefined>;
  getPatientByIcNumber(icNumber: string): Promise<Patient | undefined>;
  
  // Dental chart operations
  createDentalChart(chart: InsertDentalChart): Promise<DentalChart>;
  getDentalChart(id: string): Promise<DentalChart | undefined>;
  getDentalChartByPatientId(patientId: string): Promise<DentalChart | undefined>;
  updateDentalChart(id: string, updates: Partial<DentalChart>): Promise<DentalChart>;
}

export class MemStorage implements IStorage {
  private users: Map<string, any>;
  private patients: Map<string, Patient>;
  private dentalCharts: Map<string, DentalChart>;

  constructor() {
    this.users = new Map();
    this.patients = new Map();
    this.dentalCharts = new Map();
  }

  async getUser(id: string): Promise<any | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: any): Promise<any> {
    const id = randomUUID();
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const id = randomUUID();
    const patient: Patient = {
      ...insertPatient,
      id,
      createdAt: new Date(),
    };
    this.patients.set(id, patient);
    return patient;
  }

  async getPatient(id: string): Promise<Patient | undefined> {
    return this.patients.get(id);
  }

  async getPatientByIcNumber(icNumber: string): Promise<Patient | undefined> {
    return Array.from(this.patients.values()).find(
      (patient) => patient.icNumber === icNumber,
    );
  }

  async createDentalChart(insertChart: InsertDentalChart): Promise<DentalChart> {
    const id = randomUUID();
    const chart: DentalChart = {
      ...insertChart,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.dentalCharts.set(id, chart);
    return chart;
  }

  async getDentalChart(id: string): Promise<DentalChart | undefined> {
    return this.dentalCharts.get(id);
  }

  async getDentalChartByPatientId(patientId: string): Promise<DentalChart | undefined> {
    return Array.from(this.dentalCharts.values()).find(
      (chart) => chart.patientId === patientId,
    );
  }

  async updateDentalChart(id: string, updates: Partial<DentalChart>): Promise<DentalChart> {
    const existing = this.dentalCharts.get(id);
    if (!existing) {
      throw new Error("Dental chart not found");
    }
    
    const updated: DentalChart = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    
    this.dentalCharts.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
