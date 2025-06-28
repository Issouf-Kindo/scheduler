import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, User, Calendar, Clock, Mail, Hash, Bell, CalendarDays, X } from "lucide-react";
import { DateTime } from "luxon";

interface ConfirmationScreenProps {
  appointment: any;
  onBookAnother: () => void;
}

export function ConfirmationScreen({ appointment, onBookAnother }: ConfirmationScreenProps) {
  const { t } = useTranslation();

  const appointmentDateTime = DateTime.fromJSDate(new Date(appointment.appointmentDate));
  const formattedDate = appointmentDateTime.toLocaleString(DateTime.DATE_FULL);
  const formattedTime = appointmentDateTime.toLocaleString(DateTime.TIME_SIMPLE);

  const handleCancel = () => {
    const domains = import.meta.env.VITE_REPLIT_DOMAINS?.split(',') || ['localhost:5000'];
    const baseUrl = `https://${domains[0]}`;
    window.open(`${baseUrl}/cancel/${appointment.cancelToken}`, '_blank');
  };

  const handleReschedule = () => {
    const domains = import.meta.env.VITE_REPLIT_DOMAINS?.split(',') || ['localhost:5000'];
    const baseUrl = `https://${domains[0]}`;
    window.open(`${baseUrl}/reschedule/${appointment.rescheduleToken}`, '_blank');
  };

  return (
    <Card className="bg-surface rounded-2xl shadow-material-lg">
      <CardContent className="p-6 sm:p-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="text-white w-8 h-8" />
          </div>
          <h2 className="text-2xl font-semibold text-secondary mb-2">
            {t('appointmentConfirmed')}
          </h2>
          <p className="text-gray-600">
            {t('confirmationMessage')}
          </p>
        </div>

        {/* Appointment Details */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-secondary mb-4">
            {t('appointmentDetails')}
          </h3>
          
          <div className="space-y-3">
            {/* Name */}
            <div className="flex items-center">
              <User className="text-gray-500 w-5 h-5" />
              <span className="ml-3 text-secondary">
                <strong>{t('name')}:</strong> {appointment.name}
              </span>
            </div>
            
            {/* Date */}
            <div className="flex items-center">
              <Calendar className="text-gray-500 w-5 h-5" />
              <span className="ml-3 text-secondary">
                <strong>{t('date')}:</strong> {formattedDate}
              </span>
            </div>
            
            {/* Time */}
            <div className="flex items-center">
              <Clock className="text-gray-500 w-5 h-5" />
              <span className="ml-3 text-secondary">
                <strong>{t('time')}:</strong> {formattedTime}
              </span>
            </div>
            
            {/* Contact */}
            <div className="flex items-center">
              <Mail className="text-gray-500 w-5 h-5" />
              <span className="ml-3 text-secondary">
                <strong>{t('contact')}:</strong> {appointment.email || appointment.phone}
              </span>
            </div>
            
            {/* Confirmation ID */}
            <div className="flex items-center">
              <Hash className="text-gray-500 w-5 h-5" />
              <span className="ml-3 text-secondary">
                <strong>{t('confirmationId')}:</strong> 
                <span className="font-mono ml-1">{appointment.confirmationId}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Reminder Status */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <Bell className="text-blue-600 mt-0.5 mr-3 w-5 h-5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-800 mb-1">
                {t('remindersEnabled')}
              </h4>
              <p className="text-sm text-blue-700">
                {t('reminderStatus')}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Reschedule Button */}
          <Button 
            variant="outline"
            onClick={handleReschedule}
            className="w-full border-2 border-primary text-primary font-semibold py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 flex items-center justify-center space-x-2"
          >
            <CalendarDays className="w-4 h-4" />
            <span>{t('reschedule')}</span>
          </Button>
          
          {/* Cancel Button */}
          <Button 
            variant="outline"
            onClick={handleCancel}
            className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-gray-300 flex items-center justify-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>{t('cancel')}</span>
          </Button>
        </div>

        {/* New Appointment Link */}
        <div className="text-center mt-6">
          <button 
            onClick={onBookAnother}
            className="text-primary hover:text-primaryDark font-medium text-sm underline"
          >
            {t('bookAnother')}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
