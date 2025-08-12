import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPatientSchema, insertDentalChartSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Patient routes
  app.post("/api/patients", async (req, res) => {
    try {
      const patientData = insertPatientSchema.parse(req.body);
      
      // Check if patient with IC number already exists
      const existing = await storage.getPatientByIcNumber(patientData.icNumber);
      if (existing) {
        return res.status(400).json({ message: "Patient with this IC number already exists" });
      }
      
      const patient = await storage.createPatient(patientData);
      res.json(patient);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/patients/:id", async (req, res) => {
    try {
      const patient = await storage.getPatient(req.params.id);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      res.json(patient);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/patients/ic/:icNumber", async (req, res) => {
    try {
      const patient = await storage.getPatientByIcNumber(req.params.icNumber);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      res.json(patient);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Dental chart routes
  app.post("/api/dental-charts", async (req, res) => {
    try {
      const chartData = insertDentalChartSchema.parse(req.body);
      const chart = await storage.createDentalChart(chartData);
      res.json(chart);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/dental-charts/:id", async (req, res) => {
    try {
      const chart = await storage.getDentalChart(req.params.id);
      if (!chart) {
        return res.status(404).json({ message: "Dental chart not found" });
      }
      res.json(chart);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/dental-charts/patient/:patientId", async (req, res) => {
    try {
      const chart = await storage.getDentalChartByPatientId(req.params.patientId);
      if (!chart) {
        return res.status(404).json({ message: "Dental chart not found" });
      }
      res.json(chart);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/dental-charts/:id", async (req, res) => {
    try {
      const updates = req.body;
      const chart = await storage.updateDentalChart(req.params.id, updates);
      res.json(chart);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
