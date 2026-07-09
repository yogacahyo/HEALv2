// ============================================================
// SIMRS Calculations — All derived fields computed from SIMRS data
// ============================================================

import type { ShiftType, SimulationParameters, SmartAction, Room, QueueNumber, DoctorQueueQuota, Attendance, DoctorSchedule, Registration, Employee, Position } from './types';
import { DEFAULT_SIMULATION_PARAMETERS } from './simulation-parameters';

/** Derive shift label from time string (HH:mm or HH:mm:ss) */
export function getShiftFromTime(value: string | null | undefined): ShiftType | null {
  if (!value) return null;
  const parts = value.split(':');
  const hour = parseInt(parts[0], 10);
  if (isNaN(hour)) return null;
  if (hour >= 7 && hour < 14) return 'Pagi';
  if (hour >= 14 && hour < 21) return 'Sore';
  return 'Malam';
}

/** Get shift label string */
export function getShiftLabel(shift: ShiftType | null): string {
  if (!shift) return 'Shift tidak tersedia';
  const labels: Record<ShiftType, string> = {
    Pagi: 'Pagi (07:00–14:00)',
    Sore: 'Sore (14:00–21:00)',
    Malam: 'Malam (21:00–07:00)',
    Off: 'Libur (Off)',
    Cuti: 'Cuti',
  };
  return labels[shift];
}

/** Calculate BOR (Bed Occupancy Rate) simulation */
export function calculateBOR(rooms: Room[]): number {
  const totalBeds = rooms.filter((r) => !['IGD'].includes(r.room_type)).length;
  if (totalBeds === 0) return 0;
  const occupied = rooms.filter((r) => r.status === 'Occupied' && !['IGD'].includes(r.room_type)).length;
  return occupied / totalBeds;
}

/** Calculate BOR by room type */
export function calculateBORByType(rooms: Room[]): Record<string, number> {
  const types = [...new Set(rooms.map((r) => r.room_type))];
  const result: Record<string, number> = {};
  for (const type of types) {
    const typeRooms = rooms.filter((r) => r.room_type === type);
    const total = typeRooms.length;
    const occupied = typeRooms.filter((r) => r.status === 'Occupied').length;
    result[type] = total > 0 ? occupied / total : 0;
  }
  return result;
}

/** Calculate capacity utilization for a doctor */
export function calculateCapacityUtilization(quota: DoctorQueueQuota): number {
  if (quota.max_patients === 0) return 0;
  return quota.current_patients / quota.max_patients;
}

/** Calculate patient-to-doctor ratio */
export function calculatePatientToStaffRatio(totalPatients: number, activeDoctors: number): number {
  if (activeDoctors === 0) return totalPatients;
  return Math.round((totalPatients / activeDoctors) * 10) / 10;
}

/** Calculate queue pressure from queue data */
export function calculateQueuePressure(queues: QueueNumber[], params: SimulationParameters = DEFAULT_SIMULATION_PARAMETERS): number {
  const emergencyCount = queues.filter((q) => q.priority === 'Emergency' && q.status === 'Waiting').length;
  const waitingCount = queues.filter((q) => q.status === 'Waiting').length;
  const emergencyPressure = Math.min(emergencyCount / params.highEmergencyQueueThreshold, 1);
  const waitingPressure = Math.min(waitingCount / (params.highPatientLoadThreshold || 30), 1);
  return emergencyPressure * 0.6 + waitingPressure * 0.4;
}

/** Calculate emergency pressure */
export function calculateEmergencyPressure(queues: QueueNumber[], registrations: Registration[], params: SimulationParameters = DEFAULT_SIMULATION_PARAMETERS): number {
  const emergencyQueues = queues.filter((q) => q.priority === 'Emergency' && q.status === 'Waiting').length;
  const emergencyRegs = registrations.filter((r) => r.registration_type === 'Gawat Darurat' && r.status === 'Active').length;
  const total = emergencyQueues + emergencyRegs;
  return Math.min(total / params.highEmergencyQueueThreshold, 1);
}

/** Calculate burnout risk score for a medical staff member */
export function calculateBurnoutRiskScore(params: {
  capacityPressure: number;
  lateFlag: boolean;
  absentFlag: boolean;
  emergencyPressure: number;
  nightScheduleFlag: boolean;
  highPatientLoadFlag: boolean;
}): number {
  const score =
    params.capacityPressure * 35 +
    (params.lateFlag ? 10 : 0) +
    (params.absentFlag ? 20 : 0) +
    params.emergencyPressure * 20 +
    (params.nightScheduleFlag ? 10 : 0) +
    (params.highPatientLoadFlag ? 15 : 0);
  return Math.min(Math.round(score), 100);
}

/** Get burnout category */
export function getBurnoutCategory(score: number, params: SimulationParameters = DEFAULT_SIMULATION_PARAMETERS): 'Rendah' | 'Sedang' | 'Tinggi' {
  if (score >= params.burnoutHighRiskThreshold) return 'Tinggi';
  if (score >= params.burnoutMediumRiskThreshold) return 'Sedang';
  return 'Rendah';
}

/** Get burnout recommendation */
export function getBurnoutRecommendation(category: 'Rendah' | 'Sedang' | 'Tinggi'): string {
  const recommendations: Record<string, string> = {
    Rendah: 'Kondisi relatif aman. Tetap pertahankan pola istirahat.',
    Sedang: 'Perlu pemantauan. Disarankan menjaga waktu istirahat dan melaporkan bila beban kerja meningkat.',
    Tinggi: 'Perlu perhatian. Disarankan mengajukan penyesuaian shift atau berkonsultasi dengan pengelola jadwal.',
  };
  return recommendations[category];
}

/** Calculate post-shift burnout score from 7 yes/no answers */
export function calculatePostShiftBurnoutScore(answers: boolean[]): number {
  const yesCount = answers.filter(Boolean).length;
  return Math.round((yesCount / 7) * 100);
}

/** Calculate staffing gap simulation */
export function calculateStaffingGap(params: {
  patientLoad: number;
  availableStaff: number;
  targetRatio: number;
}): number {
  const requiredStaff = Math.ceil(params.patientLoad / params.targetRatio);
  return Math.max(requiredStaff - params.availableStaff, 0);
}

/** Calculate night schedule flag */
export function isNightSchedule(startTime: string, endTime: string, params: SimulationParameters = DEFAULT_SIMULATION_PARAMETERS): boolean {
  const startHour = parseInt(startTime.split(':')[0], 10);
  const endHour = parseInt(endTime.split(':')[0], 10);
  return startHour >= params.nightScheduleStartHour || endHour <= params.nightScheduleEndHour;
}

/** Calculate working duration in hours */
export function calculateWorkingDuration(checkIn: string | null, checkOut: string | null): number | null {
  if (!checkIn || !checkOut) return null;
  const [inH, inM] = checkIn.split(':').map(Number);
  const [outH, outM] = checkOut.split(':').map(Number);
  let hours = outH - inH + (outM - inM) / 60;
  if (hours < 0) hours += 24;
  return Math.round(hours * 10) / 10;
}

/** Calculate penalty score for auto rostering */
export function calculatePenaltyScore(params: {
  capacityPressure: number;
  emergencyPressure: number;
  absentFlag: boolean;
  lateFlag: boolean;
  nightScheduleFlag: boolean;
}): number {
  return Math.round(
    params.capacityPressure * 30 +
    params.emergencyPressure * 20 +
    (params.absentFlag ? 20 : 0) +
    (params.lateFlag ? 10 : 0) +
    (params.nightScheduleFlag ? 10 : 0)
  );
}

/** Calculate fairness index for auto rostering */
export function calculateFairnessIndex(params: {
  lateCount: number;
  absentCount: number;
  nightScheduleCount: number;
  overloadCount: number;
}): number {
  return Math.max(
    0,
    100 - params.lateCount * 5 - params.absentCount * 10 - params.nightScheduleCount * 5 - params.overloadCount * 10
  );
}

/** Generate Smart Actions based on SIMRS data */
export function generateSmartActions(data: {
  queues: QueueNumber[];
  quotas: DoctorQueueQuota[];
  rooms: Room[];
  attendance: Attendance[];
  registrations: Registration[];
  params: SimulationParameters;
}): SmartAction[] {
  const actions: SmartAction[] = [];
  const { queues, quotas, rooms, attendance, registrations, params } = data;

  // Rule 1: Antrean Emergency Tinggi
  const emergencyWaiting = queues.filter((q) => q.priority === 'Emergency' && q.status === 'Waiting').length;
  if (emergencyWaiting > 0) {
    actions.push({
      id: 'emergency-queue',
      title: 'Antrean Emergency Tinggi',
      description: `Terdapat ${emergencyWaiting} antrean Emergency yang masih menunggu pelayanan.`,
      severity: emergencyWaiting >= params.highEmergencyQueueThreshold ? 'high' : 'medium',
      category: 'queue',
      source: 'queue_numbers',
      value: emergencyWaiting,
      threshold: params.highEmergencyQueueThreshold,
    });
  }

  // Rule 2: Kapasitas Dokter Melebihi Batas
  const overloadedDoctors = quotas.filter((q) => q.max_patients > 0 && q.current_patients / q.max_patients > params.highCapacityPressureThreshold);
  if (overloadedDoctors.length > 0) {
    actions.push({
      id: 'doctor-capacity',
      title: 'Utilisasi Dokter Tinggi',
      description: `${overloadedDoctors.length} dokter memiliki utilisasi pasien melebihi ${Math.round(params.highCapacityPressureThreshold * 100)}% kapasitas.`,
      severity: 'high',
      category: 'capacity',
      source: 'doctor_queue_quotas',
      value: overloadedDoctors.length,
    });
  }

  // Rule 3: BOR Tinggi
  const bor = calculateBOR(rooms);
  if (bor > params.criticalBorThreshold) {
    actions.push({
      id: 'bor-critical',
      title: 'BOR Kritis',
      description: `Bed Occupancy Rate simulasi saat ini ${Math.round(bor * 100)}%, melebihi batas ${Math.round(params.criticalBorThreshold * 100)}%.`,
      severity: 'high',
      category: 'room',
      source: 'rooms',
      value: bor,
      threshold: params.criticalBorThreshold,
    });
  }

  // Rule 4: Tenaga Medis Absent/Late Tinggi
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter((a) => a.date === today);
  const absentCount = todayAttendance.filter((a) => a.status === 'Absent').length;
  const lateCount = todayAttendance.filter((a) => a.status === 'Late').length;
  if (absentCount >= params.absentAlertThreshold || lateCount >= params.lateAlertThreshold) {
    actions.push({
      id: 'staff-availability',
      title: 'Risiko Ketersediaan Tenaga Medis',
      description: `${absentCount} pegawai tidak hadir dan ${lateCount} pegawai terlambat hari ini.`,
      severity: absentCount >= params.absentAlertThreshold ? 'high' : 'medium',
      category: 'attendance',
      source: 'attendance',
      value: absentCount + lateCount,
    });
  }

  // Rule 5: Beban Gawat Darurat Tinggi
  const emergencyRegs = registrations.filter((r) => r.registration_type === 'Gawat Darurat' && r.status === 'Active').length;
  if (emergencyRegs > 0 || emergencyWaiting > 3) {
    actions.push({
      id: 'emergency-load',
      title: 'Beban Gawat Darurat Tinggi',
      description: `${emergencyRegs} registrasi Gawat Darurat aktif dan ${emergencyWaiting} antrean Emergency menunggu.`,
      severity: emergencyRegs >= 3 || emergencyWaiting >= 5 ? 'high' : 'medium',
      category: 'emergency',
      source: 'registration, queue_numbers',
      value: emergencyRegs + emergencyWaiting,
    });
  }

  return actions;
}

/** Check if employee is a doctor based on position */
export function isDoctorPosition(position: Position): boolean {
  const name = position.position_name.toLowerCase();
  return name.includes('doctor') || name.includes('dokter') || name.includes('drg');
}

/** Check if employee is a nurse based on position */
export function isNursePosition(position: Position): boolean {
  const name = position.position_name.toLowerCase();
  return name.includes('perawat');
}

/** Check if employee is medical staff (doctor or nurse) */
export function isMedicalStaff(position: Position): boolean {
  return isDoctorPosition(position) || isNursePosition(position);
}

/** Get employee role label */
export function getEmployeeRole(position: Position): 'dokter' | 'perawat' | 'lainnya' {
  if (isDoctorPosition(position)) return 'dokter';
  if (isNursePosition(position)) return 'perawat';
  return 'lainnya';
}

/** Get medical staff from employees and positions */
export function getMedicalStaff(employees: Employee[], positions: Position[]): Employee[] {
  return employees.filter((emp) => {
    const pos = positions.find((p) => p.position_id === emp.position_id);
    return pos && isMedicalStaff(pos);
  });
}

/** Get doctors from employees and positions */
export function getDoctors(employees: Employee[], positions: Position[]): Employee[] {
  return employees.filter((emp) => {
    const pos = positions.find((p) => p.position_id === emp.position_id);
    return pos && isDoctorPosition(pos);
  });
}

/** Get nurses from employees and positions */
export function getNurses(employees: Employee[], positions: Position[]): Employee[] {
  return employees.filter((emp) => {
    const pos = positions.find((p) => p.position_id === emp.position_id);
    return pos && isNursePosition(pos);
  });
}

/** Get day of week name in Indonesian */
export function getDayName(dayOfWeek: number): string {
  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
  return days[dayOfWeek] || 'N/A';
}
