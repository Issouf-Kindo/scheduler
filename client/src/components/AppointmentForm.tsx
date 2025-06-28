import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarCheck, User, Phone, Mail, Calendar, Clock, Info } from "lucide-react";
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

interface AppointmentFormProps {
  onSuccess: (appointment: any) => void;
}

export function AppointmentForm({ onSuccess }: AppointmentFormProps) {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const formSchema = z.object({
    name: z.string().min(1, t('nameRequired')),
    email: z.string().email(t('invalidEmail')).optional().or(z.literal("")),
    phone: z.string().optional().or(z.literal("")),
    appointmentDate: z.string().min(1, t('dateRequired')),
    appointmentTime: z.string().min(1, t('timeRequired')),
    emailReminder: z.boolean().default(false),
    smsReminder: z.boolean().default(false),
  }).refine(
    (data) => data.email || data.phone,
    {
      message: t('contactRequired'),
      path: ["email"],
    }
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      appointmentDate: "",
      appointmentTime: "",
      emailReminder: false,
      smsReminder: false,
    },
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/appointments", {
        ...data,
        language: i18n.language,
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      onSuccess(data.appointment);
      toast({
        title: t('appointmentConfirmed'),
        description: t('confirmationMessage'),
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create appointment",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    createAppointmentMutation.mutate(data);
  };

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  return (
    <Card className="bg-surface rounded-2xl shadow-material-lg">
      <CardContent className="p-6 sm:p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-secondary mb-2">
            {t('bookAppointment')}
          </h2>
          <p className="text-gray-600">
            {t('fillFormBelow')}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    {t('name')} <span className="text-error ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        placeholder="Enter your full name"
                        {...field}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 placeholder-gray-400 pr-10"
                      />
                      <User className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Contact Information */}
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('phone')}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          {...field}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 placeholder-gray-400 pr-10"
                        />
                        <Phone className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('email')}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="email"
                          placeholder="john@example.com"
                          {...field}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 placeholder-gray-400 pr-10"
                        />
                        <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Requirement Note */}
            <div className="bg-blue-50 border-l-4 border-primary p-4 rounded-r-lg">
              <div className="flex items-start">
                <Info className="text-primary mt-0.5 mr-3 w-4 h-4 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                  {t('contactRequirement')}
                </p>
              </div>
            </div>

            {/* Date and Time Selection */}
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="appointmentDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      {t('appointmentDate')} <span className="text-error ml-1">*</span>
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
                      {t('appointmentTime')} <span className="text-error ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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

            {/* Reminder Preferences */}
            <div className="form-group">
              <Label className="block text-sm font-medium text-secondary mb-3">
                {t('reminderPreferences')}
              </Label>
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="emailReminder"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="flex items-center text-sm text-secondary cursor-pointer">
                        <Mail className="text-gray-500 mr-2 w-4 h-4" />
                        {t('emailReminder')}
                      </FormLabel>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="smsReminder"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="flex items-center text-sm text-secondary cursor-pointer">
                        <Phone className="text-gray-500 mr-2 w-4 h-4" />
                        {t('smsReminder')}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                {t('reminderNote')}
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button 
                type="submit"
                disabled={createAppointmentMutation.isPending}
                className="w-full bg-primary hover:bg-primaryDark text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 flex items-center justify-center space-x-2 shadow-material"
              >
                {createAppointmentMutation.isPending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <>
                    <CalendarCheck className="w-4 h-4" />
                    <span>{t('bookAppointment').toUpperCase()}</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
