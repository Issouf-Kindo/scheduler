import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Home } from "lucide-react";
import { Link } from "wouter";

export default function Cancel() {
  const { t } = useTranslation();
  const [, params] = useRoute("/cancel/:token");
  const token = params?.token;

  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/appointments/cancel/${token}`],
    enabled: !!token,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-secondary">{t('processing')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
              <p className="text-gray-600 mb-6">
                {error?.message || "Invalid or expired cancellation link."}
              </p>
              <Link href="/">
                <Button className="flex items-center space-x-2">
                  <Home className="w-4 h-4" />
                  <span>{t('backToHome')}</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {t('appointmentCancelled')}
            </h1>
            <p className="text-gray-600 mb-6">
              {t('cancelSuccess')}
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                <strong>Name:</strong> {data.appointment?.name}
              </p>
              <p className="text-sm text-gray-500">
                <strong>ID:</strong> APT-{data.appointment?.id}
              </p>
            </div>
            <div className="mt-6">
              <Link href="/">
                <Button className="flex items-center space-x-2">
                  <Home className="w-4 h-4" />
                  <span>{t('backToHome')}</span>
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
