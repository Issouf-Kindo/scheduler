import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Header
      title: 'Appointment Scheduler',
      language: 'Language:',
      
      // Form
      bookAppointment: 'Book Your Appointment',
      fillFormBelow: 'Fill out the form below to schedule your appointment',
      name: 'Full Name',
      phone: 'Phone Number',
      email: 'Email Address',
      appointmentDate: 'Appointment Date',
      appointmentTime: 'Appointment Time',
      selectTime: 'Select time',
      reminderPreferences: 'Reminder Preferences',
      emailReminder: 'Send email reminders (24h and 1h before)',
      smsReminder: 'Send SMS reminders (24h and 1h before)',
      reminderNote: 'Reminders help ensure you don\'t miss your appointment',
      contactRequirement: 'Please provide either a phone number or email address for appointment confirmation.',
      
      // Confirmation
      appointmentConfirmed: 'Appointment Confirmed!',
      confirmationMessage: 'Your appointment has been successfully scheduled',
      appointmentDetails: 'Appointment Details',
      date: 'Date',
      time: 'Time',
      contact: 'Contact',
      confirmationId: 'Confirmation ID',
      remindersEnabled: 'Reminders Enabled',
      reminderStatus: 'You will receive email reminders 24 hours and 1 hour before your appointment.',
      reschedule: 'Reschedule',
      cancel: 'Cancel',
      bookAnother: 'Book Another Appointment',
      
      // Loading
      processing: 'Processing your appointment...',
      
      // Footer
      footerText: '© 2024 Appointment Scheduler. All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      support: 'Support',
      
      // Errors
      nameRequired: 'Name is required',
      contactRequired: 'Either phone or email is required',
      dateRequired: 'Date is required',
      timeRequired: 'Time is required',
      invalidEmail: 'Please enter a valid email address',
      invalidPhone: 'Please enter a valid phone number',
      
      // Cancel/Reschedule pages
      appointmentCancelled: 'Appointment Cancelled',
      cancelSuccess: 'Your appointment has been successfully cancelled.',
      rescheduleAppointment: 'Reschedule Appointment',
      updateAppointment: 'Update Appointment',
      newDate: 'New Date',
      newTime: 'New Time',
      update: 'Update',
      backToHome: 'Back to Home',
    }
  },
  fr: {
    translation: {
      // Header
      title: 'Planificateur de Rendez-vous',
      language: 'Langue:',
      
      // Form
      bookAppointment: 'Réserver Votre Rendez-vous',
      fillFormBelow: 'Remplissez le formulaire ci-dessous pour planifier votre rendez-vous',
      name: 'Nom Complet',
      phone: 'Numéro de Téléphone',
      email: 'Adresse E-mail',
      appointmentDate: 'Date du Rendez-vous',
      appointmentTime: 'Heure du Rendez-vous',
      selectTime: 'Sélectionner l\'heure',
      reminderPreferences: 'Préférences de Rappel',
      emailReminder: 'Envoyer des rappels par e-mail (24h et 1h avant)',
      smsReminder: 'Envoyer des rappels par SMS (24h et 1h avant)',
      reminderNote: 'Les rappels vous aident à ne pas manquer votre rendez-vous',
      contactRequirement: 'Veuillez fournir soit un numéro de téléphone, soit une adresse e-mail pour la confirmation du rendez-vous.',
      
      // Confirmation
      appointmentConfirmed: 'Rendez-vous Confirmé!',
      confirmationMessage: 'Votre rendez-vous a été planifié avec succès',
      appointmentDetails: 'Détails du Rendez-vous',
      date: 'Date',
      time: 'Heure',
      contact: 'Contact',
      confirmationId: 'ID de Confirmation',
      remindersEnabled: 'Rappels Activés',
      reminderStatus: 'Vous recevrez des rappels par e-mail 24 heures et 1 heure avant votre rendez-vous.',
      reschedule: 'Reprogrammer',
      cancel: 'Annuler',
      bookAnother: 'Réserver un Autre Rendez-vous',
      
      // Loading
      processing: 'Traitement de votre rendez-vous...',
      
      // Footer
      footerText: '© 2024 Planificateur de Rendez-vous. Tous droits réservés.',
      privacy: 'Politique de Confidentialité',
      terms: 'Conditions d\'Utilisation',
      support: 'Support',
      
      // Errors
      nameRequired: 'Le nom est requis',
      contactRequired: 'Le téléphone ou l\'e-mail est requis',
      dateRequired: 'La date est requise',
      timeRequired: 'L\'heure est requise',
      invalidEmail: 'Veuillez entrer une adresse e-mail valide',
      invalidPhone: 'Veuillez entrer un numéro de téléphone valide',
      
      // Cancel/Reschedule pages
      appointmentCancelled: 'Rendez-vous Annulé',
      cancelSuccess: 'Votre rendez-vous a été annulé avec succès.',
      rescheduleAppointment: 'Reprogrammer le Rendez-vous',
      updateAppointment: 'Mettre à Jour le Rendez-vous',
      newDate: 'Nouvelle Date',
      newTime: 'Nouvelle Heure',
      update: 'Mettre à Jour',
      backToHome: 'Retour à l\'Accueil',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
