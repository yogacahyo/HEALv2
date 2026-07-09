// ============================================================
// Simulation Parameters — Default thresholds for SIMRS simulation
// ============================================================

import { SimulationParameters } from './types';

export const DEFAULT_SIMULATION_PARAMETERS: SimulationParameters = {
  highCapacityPressureThreshold: 0.85,
  criticalBorThreshold: 0.85,
  highEmergencyQueueThreshold: 10,
  highPatientLoadThreshold: 30,
  lateAlertThreshold: 3,
  absentAlertThreshold: 2,
  nightScheduleStartHour: 21,
  nightScheduleEndHour: 7,
  burnoutHighRiskThreshold: 67,
  burnoutMediumRiskThreshold: 34,
};

export const PARAMETER_LABELS: Record<keyof SimulationParameters, { label: string; description: string; unit: string }> = {
  highCapacityPressureThreshold: {
    label: 'Batas Tekanan Kapasitas Tinggi',
    description: 'Persentase kapasitas dokter yang dianggap tinggi',
    unit: '%',
  },
  criticalBorThreshold: {
    label: 'Batas BOR Kritis',
    description: 'Bed Occupancy Rate yang dianggap kritis',
    unit: '%',
  },
  highEmergencyQueueThreshold: {
    label: 'Batas Antrean Emergency Tinggi',
    description: 'Jumlah antrean emergency yang dianggap tinggi',
    unit: 'antrean',
  },
  highPatientLoadThreshold: {
    label: 'Batas Beban Pasien Tinggi',
    description: 'Jumlah pasien per hari yang dianggap tinggi',
    unit: 'pasien',
  },
  lateAlertThreshold: {
    label: 'Batas Peringatan Terlambat',
    description: 'Jumlah keterlambatan dalam periode yang memicu alert',
    unit: 'kali',
  },
  absentAlertThreshold: {
    label: 'Batas Peringatan Absent',
    description: 'Jumlah ketidakhadiran dalam periode yang memicu alert',
    unit: 'kali',
  },
  nightScheduleStartHour: {
    label: 'Jam Mulai Shift Malam',
    description: 'Jam mulai yang dianggap shift malam',
    unit: 'jam',
  },
  nightScheduleEndHour: {
    label: 'Jam Selesai Shift Malam',
    description: 'Jam selesai yang dianggap shift malam',
    unit: 'jam',
  },
  burnoutHighRiskThreshold: {
    label: 'Batas Burnout Risiko Tinggi',
    description: 'Skor burnout yang dianggap risiko tinggi',
    unit: 'skor',
  },
  burnoutMediumRiskThreshold: {
    label: 'Batas Burnout Risiko Sedang',
    description: 'Skor burnout yang dianggap risiko sedang',
    unit: 'skor',
  },
};
