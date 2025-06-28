import { useEffect } from "react";
import { useRoute } from "wouter";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CalendarDays, Home, Clock, Calendar } from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const timeSlots = [
  { value: "09:00", label: "9:00 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "15:00", label: "3:00 PM" },
  { value: "16:00", label: "4:00 PM" },
];

export default function Reschedule() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, params] = useRoute("/reschedule/:token");
  const token = params?.token;

  const { data: appointmentData, isLoading, error } = useQuery({
    queryKey: [`/api/appointments/reschedule/${token}`],
    enabled: !!token,
  });

  const formSchema = z.object({
    appointmentDate: z.string().min(1, t('dateRequired')),
    appointmentTime: z.string().min(1, t('timeRequired')),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      appointmentDate: "",
      appointmentTime: "",
    },
  });

  // Set form values when appointment data loads
  useEffect(() => {
    if (appointmentData?.appointment) {
      const appointment = appointmentData.appointment;
      const date = new Date(appointment.appointmentDate).toISOString().split('T')[0];
      form.reset({
        appointmentDate: date,
        appointmentTime: appointment.appointmentTime,
      });
    }
  }, [appointmentData, form]);

  const rescheduleAppointmentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PUT", `/api/appointments/reschedule/${token}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/appointments/reschedule/${token}`] });
      toast({
        title: "Success",
        description: "Appointment rescheduled successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reschedule appointment",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    rescheduleAppointmentMutation.mutate(data);
  };

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

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

  if (error || !appointmentData?.success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
              <p className="text-gray-600 mb-6">
                {error?.message || "Invalid or expired reschedule link."}
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

  const appointment = appointmentData.appointment;

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-surface rounded-2xl shadow-material-lg">
          <CardContent className="p-6 sm:p-8">
            <div className="text-center mb-8">
              <CalendarDays className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-secondary mb-2">
                {t('rescheduleAppointment')}
              </h2>
              <p className="text-gray-600">
                {t('updateAppointment')} for {appointment.name}
              </p>
            </div>

            {/* Current Appointment Info */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="font-medium text-secondary mb-2">Current Appointment</h3>
              <p className="text-sm text-gray-600">
                {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentTime}
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="appointmentDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          {t('newDate')} <span className="text-error ml-1">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type="date"
                              min={today}
                              {...field}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 pr-10"
                            />
                            <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="appointmentTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          {t('newTime')} <span className="text-error ml-1">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 pr-10">
                                <SelectValue placeholder={t('selectTime')} />
                              </SelectTrigger>
                              <SelectContent>
                                {timeSlots.map((slot) => (
                                  <SelectItem key={slot.value} value={slot.value}>
                                    {slot.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Clock className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-4">
                  <Button 
                    type="submit"
                    disabled={rescheduleAppointmentMutation.isPending}
                    className="flex-1 bg-primary hover:bg-primaryDark text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 flex items-center justify-center space-x-2"
                  >
                    {rescheduleAppointmentMutation.isPending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    ) : (
                      <>
                        <CalendarDays className="w-4 h-4" />
                        <span>{t('update')}</span>
                      </>
                    )}
                  </Button>
                  
                  <Link href="/">
                    <Button variant="outline" className="flex items-center space-x-2">
                      <Home className="w-4 h-4" />
                      <span>{t('backToHome')}</span>
                    </Button>
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
