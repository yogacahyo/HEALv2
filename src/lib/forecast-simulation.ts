// ============================================================
// Forecast Simulation — Moving average patient volume prediction
// ============================================================

import type { Registration, Appointment, QueueNumber, MedicalRecord, FollowUpAppointment, ForecastResult } from './types';

/** Calculate 7-day moving average of patient volumes */
export function calculateMovingAverage(registrations: Registration[], days: number = 7): number {
  const now = new Date();
  let total = 0;
  let count = 0;
  for (let i = 1; i <= days; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayCount = registrations.filter((r) => r.registration_date.startsWith(dateStr)).length;
    if (dayCount > 0) {
      total += dayCount;
      count++;
    }
  }
  return count > 0 ? total / count : registrations.length / Math.max(days, 1);
}

/** Calculate emergency factor */
export function calculateEmergencyFactor(registrations: Registration[], queues: QueueNumber[]): number {
  const emergencyRegs = registrations.filter((r) => r.registration_type === 'Gawat Darurat').length;
  const emergencyQueues = queues.filter((q) => q.priority === 'Emergency').length;
  return (emergencyRegs + emergencyQueues) * 0.15;
}

/** Calculate appointment factor */
export function calculateAppointmentFactor(appointments: Appointment[]): number {
  const today = new Date().toISOString().split('T')[0];
  const scheduledToday = appointments.filter((a) => a.appointment_date === today && a.status === 'Scheduled').length;
  return scheduledToday * 0.1;
}

/** Calculate follow-up factor */
export function calculateFollowUpFactor(followUps: FollowUpAppointment[]): number {
  const today = new Date().toISOString().split('T')[0];
  const now = new Date();
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const upcoming = followUps.filter((f) => {
    const d = f.appointment_date;
    return d >= today && d <= nextWeek.toISOString().split('T')[0] && f.status === 'Scheduled';
  }).length;
  return upcoming * 0.08;
}

/** Generate forecast for next N days */
export function generateForecast(params: {
  registrations: Registration[];
  appointments: Appointment[];
  queues: QueueNumber[];
  medicalRecords: MedicalRecord[];
  followUps: FollowUpAppointment[];
  days: number;
}): ForecastResult[] {
  const { registrations, appointments, queues, followUps, days } = params;
  const movingAvg = calculateMovingAverage(registrations);
  const emergencyFactor = calculateEmergencyFactor(registrations, queues);
  const appointmentFactor = calculateAppointmentFactor(appointments);
  const followUpFactor = calculateFollowUpFactor(followUps);

  const results: ForecastResult[] = [];
  const now = new Date();

  for (let i = 1; i <= days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    const dayOfWeek = date.getDay();
    
    // Weekend factor (lower volume on weekends)
    const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.6 : 1.0;
    
    // Add some randomness for realism
    const randomFactor = 0.9 + Math.random() * 0.2;
    
    const basePredict = (movingAvg + emergencyFactor + appointmentFactor + followUpFactor) * weekendFactor * randomFactor;
    
    results.push({
      date: date.toISOString().split('T')[0],
      predicted_patients: Math.round(Math.max(basePredict, 1)),
      predicted_emergency: Math.round(Math.max(emergencyFactor * randomFactor * 2, 0)),
      predicted_appointments: Math.round(Math.max(appointmentFactor * 10 * randomFactor, 0)),
      predicted_follow_ups: Math.round(Math.max(followUpFactor * 8 * randomFactor, 0)),
      confidence: Math.round((0.75 - i * 0.02) * 100) / 100,
    });
  }

  return results;
}

/** Estimate required staff based on forecast */
export function estimateRequiredStaff(predictedPatients: number): { doctors: number; nurses: number } {
  return {
    doctors: Math.ceil(predictedPatients / 10),
    nurses: Math.ceil(predictedPatients / 6),
  };
}
