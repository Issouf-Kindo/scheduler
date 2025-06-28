import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Calendar } from "lucide-react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { AppointmentForm } from "@/components/AppointmentForm";
import { ConfirmationScreen } from "@/components/ConfirmationScreen";

export default function Home() {
  const { t } = useTranslation();
  const [confirmedAppointment, setConfirmedAppointment] = useState(null);

  const handleAppointmentSuccess = (appointment: any) => {
    setConfirmedAppointment(appointment);
  };

  const handleBookAnother = () => {
    setConfirmedAppointment(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface shadow-material border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Calendar className="text-white w-5 h-5" />
              </div>
              <h1 className="text-xl font-semibold text-secondary">
                {t('title')}
              </h1>
            </div>
            
            <LanguageToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {confirmedAppointment ? (
          <ConfirmationScreen 
            appointment={confirmedAppointment}
            onBookAnother={handleBookAnother}
          />
        ) : (
          <AppointmentForm onSuccess={handleAppointmentSuccess} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-gray-100 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              {t('footerText')}
            </p>
            <div className="mt-4 flex justify-center space-x-6 text-sm">
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                {t('privacy')}
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                {t('terms')}
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                {t('support')}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
