import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAppointmentSchema } from "@shared/schema";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { sendEmail } from "./services/email";
import { sendSMS } from "./services/sms";
import { DateTime } from "luxon";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create appointment
  app.post("/api/appointments", async (req, res) => {
    try {
      const validatedData = insertAppointmentSchema.parse(req.body);
      
      // Parse date and time
      const appointmentDateTime = DateTime.fromISO(`${validatedData.appointmentDate}T${validatedData.appointmentTime}:00`);
      
      if (!appointmentDateTime.isValid) {
        return res.status(400).json({ message: "Invalid date or time format" });
      }

      // Generate secure tokens
      const cancelToken = jwt.sign({ purpose: "cancel", timestamp: Date.now() }, JWT_SECRET);
      const rescheduleToken = jwt.sign({ purpose: "reschedule", timestamp: Date.now() }, JWT_SECRET);

      // Create appointment
      const appointment = await storage.createAppointment({
        ...validatedData,
        appointmentDate: appointmentDateTime.toJSDate(),
        cancelToken,
        rescheduleToken,
      });

      // Send confirmation email
      if (validatedData.email && validatedData.emailReminder) {
        const domains = process.env.REPLIT_DOMAINS?.split(',') || ['localhost:5000'];
        const baseUrl = `https://${domains[0]}`;
        
        await sendEmail({
          to: validatedData.email,
          from: process.env.FROM_EMAIL || "noreply@scheduler.com",
          subject: validatedData.language === 'fr' ? "Confirmation de rendez-vous" : "Appointment Confirmation",
          html: `
            <h2>${validatedData.language === 'fr' ? 'Votre rendez-vous est confirmé' : 'Your appointment is confirmed'}</h2>
            <p><strong>${validatedData.language === 'fr' ? 'Nom' : 'Name'}:</strong> ${validatedData.name}</p>
            <p><strong>${validatedData.language === 'fr' ? 'Date' : 'Date'}:</strong> ${appointmentDateTime.toLocaleString()}</p>
            <p><strong>${validatedData.language === 'fr' ? 'ID de confirmation' : 'Confirmation ID'}:</strong> APT-${appointment.id}</p>
            
            <div style="margin: 20px 0;">
              <a href="${baseUrl}/cancel/${cancelToken}" style="background: #f44336; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-right: 10px;">
                ${validatedData.language === 'fr' ? 'Annuler' : 'Cancel'}
              </a>
              <a href="${baseUrl}/reschedule/${rescheduleToken}" style="background: #1976d2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                ${validatedData.language === 'fr' ? 'Reprogrammer' : 'Reschedule'}
              </a>
            </div>
          `,
        });
      }

      // Send confirmation SMS
      if (validatedData.phone && validatedData.smsReminder) {
        await sendSMS({
          to: validatedData.phone,
          message: validatedData.language === 'fr' 
            ? `Rendez-vous confirmé pour ${validatedData.name} le ${appointmentDateTime.toLocaleString()}. ID: APT-${appointment.id}`
            : `Appointment confirmed for ${validatedData.name} on ${appointmentDateTime.toLocaleString()}. ID: APT-${appointment.id}`,
        });
      }

      res.json({
        success: true,
        appointment: {
          id: appointment.id,
          name: appointment.name,
          appointmentDate: appointment.appointmentDate,
          appointmentTime: appointment.appointmentTime,
          confirmationId: `APT-${appointment.id}`,
          cancelToken,
          rescheduleToken,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation failed",
          errors: error.errors 
        });
      }
      console.error("Error creating appointment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Cancel appointment
  app.get("/api/appointments/cancel/:token", async (req, res) => {
    try {
      const { token } = req.params;
      
      // Verify token
      jwt.verify(token, JWT_SECRET);
      
      const appointment = await storage.getAppointmentByToken(token, 'cancel');
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      if (appointment.status === 'cancelled') {
        return res.status(400).json({ message: "Appointment already cancelled" });
      }

      await storage.updateAppointmentStatus(appointment.id, 'cancelled');

      res.json({ 
        success: true, 
        message: "Appointment cancelled successfully",
        appointment: {
          id: appointment.id,
          name: appointment.name,
          status: 'cancelled'
        }
      });
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      res.status(500).json({ message: "Invalid or expired token" });
    }
  });

  // Reschedule appointment - get appointment details
  app.get("/api/appointments/reschedule/:token", async (req, res) => {
    try {
      const { token } = req.params;
      
      // Verify token
      jwt.verify(token, JWT_SECRET);
      
      const appointment = await storage.getAppointmentByToken(token, 'reschedule');
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      if (appointment.status === 'cancelled') {
        return res.status(400).json({ message: "Cannot reschedule cancelled appointment" });
      }

      res.json({ 
        success: true,
        appointment: {
          id: appointment.id,
          name: appointment.name,
          email: appointment.email,
          phone: appointment.phone,
          appointmentDate: appointment.appointmentDate,
          appointmentTime: appointment.appointmentTime,
          emailReminder: appointment.emailReminder,
          smsReminder: appointment.smsReminder,
          language: appointment.language,
        }
      });
    } catch (error) {
      console.error("Error getting appointment for reschedule:", error);
      res.status(500).json({ message: "Invalid or expired token" });
    }
  });

  // Update reschedule appointment
  app.put("/api/appointments/reschedule/:token", async (req, res) => {
    try {
      const { token } = req.params;
      
      // Verify token
      jwt.verify(token, JWT_SECRET);
      
      const appointment = await storage.getAppointmentByToken(token, 'reschedule');
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      const { appointmentDate, appointmentTime } = req.body;
      const appointmentDateTime = DateTime.fromISO(`${appointmentDate}T${appointmentTime}:00`);
      
      if (!appointmentDateTime.isValid) {
        return res.status(400).json({ message: "Invalid date or time format" });
      }

      const updatedAppointment = await storage.updateAppointment(appointment.id, {
        appointmentDate: appointmentDateTime.toJSDate(),
        appointmentTime,
      });

      res.json({ 
        success: true,
        message: "Appointment rescheduled successfully",
        appointment: updatedAppointment
      });
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      res.status(500).json({ message: "Invalid or expired token" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
