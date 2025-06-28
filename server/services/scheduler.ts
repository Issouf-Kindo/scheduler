import cron from 'node-cron';
import { storage } from '../storage';
import { sendEmail } from './email';
import { sendSMS } from './sms';
import { DateTime } from 'luxon';

// Run every hour to check for upcoming appointments
cron.schedule('0 * * * *', async () => {
  try {
    const appointments = await storage.getUpcomingAppointments();
    const now = DateTime.now();

    for (const appointment of appointments) {
      const appointmentDateTime = DateTime.fromJSDate(appointment.appointmentDate);
      const hoursUntil = appointmentDateTime.diff(now, 'hours').hours;

      // Send 24-hour reminder
      if (hoursUntil <= 24 && hoursUntil > 23) {
        await sendReminders(appointment, '24h');
      }

      // Send 1-hour reminder
      if (hoursUntil <= 1 && hoursUntil > 0) {
        await sendReminders(appointment, '1h');
      }
    }
  } catch (error) {
    console.error('Error in scheduler:', error);
  }
});

async function sendReminders(appointment: any, timeFrame: '24h' | '1h') {
  const appointmentDateTime = DateTime.fromJSDate(appointment.appointmentDate);
  const isHour = timeFrame === '1h';
  const isFrench = appointment.language === 'fr';

  // Email reminder
  if (appointment.email && appointment.emailReminder) {
    const subject = isFrench 
      ? `Rappel: Rendez-vous dans ${isHour ? '1 heure' : '24 heures'}`
      : `Reminder: Appointment in ${isHour ? '1 hour' : '24 hours'}`;

    const html = `
      <h2>${isFrench ? 'Rappel de rendez-vous' : 'Appointment Reminder'}</h2>
      <p>${isFrench ? 'Vous avez un rendez-vous' : 'You have an appointment'} ${isHour ? (isFrench ? 'dans 1 heure' : 'in 1 hour') : (isFrench ? 'dans 24 heures' : 'in 24 hours')}.</p>
      <p><strong>${isFrench ? 'Nom' : 'Name'}:</strong> ${appointment.name}</p>
      <p><strong>${isFrench ? 'Date' : 'Date'}:</strong> ${appointmentDateTime.toLocaleString()}</p>
      <p><strong>${isFrench ? 'ID de confirmation' : 'Confirmation ID'}:</strong> APT-${appointment.id}</p>
    `;

    await sendEmail({
      to: appointment.email,
      from: process.env.FROM_EMAIL || "noreply@scheduler.com",
      subject,
      html,
    });
  }

  // SMS reminder
  if (appointment.phone && appointment.smsReminder) {
    const message = isFrench
      ? `Rappel: Rendez-vous pour ${appointment.name} ${isHour ? 'dans 1 heure' : 'dans 24 heures'} le ${appointmentDateTime.toLocaleString()}. ID: APT-${appointment.id}`
      : `Reminder: Appointment for ${appointment.name} ${isHour ? 'in 1 hour' : 'in 24 hours'} on ${appointmentDateTime.toLocaleString()}. ID: APT-${appointment.id}`;

    await sendSMS({
      to: appointment.phone,
      message,
    });
  }
}
