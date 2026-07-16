'use client';

import React, { createContext, useReducer, useCallback, useEffect, useState, type ReactNode } from 'react';
import type {
  Patient, Doctor, User, Employee, Position, Department,
  Attendance, LeaveRequest, DoctorSchedule, DoctorQueueQuota,
  Appointment, Registration, MedicalRecord, OutpatientVisit,
  PatientVisit, QueueNumber, QueueType, QueueCounter, Room,
  Billing, BillingDetail, LaboratoryResult, RadiologyResult,
  Procedure, VisitProcedure, BMHP, VisitBMHP, SOAPNote, CPPT,
  VerbalOrder, FollowUpAppointment, ShiftSwapRequest, BurnoutAssessment,
  AttendanceSimulation, SimulationParameters, DatasetSource, SchemaHealth,
  ShiftType,
} from '@/lib/types';
import { DEFAULT_SIMULATION_PARAMETERS } from '@/lib/simulation-parameters';
import {
  mockPatients, mockDoctors, mockUsers, mockEmployees, mockPositions,
  mockDepartments, mockAttendance, mockLeaveRequests, mockDoctorSchedules,
  mockDoctorQueueQuotas, mockAppointments, mockRegistrations,
  mockMedicalRecords, mockOutpatientVisits, mockPatientVisits,
  mockQueueNumbers, mockQueueTypes, mockQueueCounters, mockRooms,
  mockBilling, mockBillingDetails, mockLaboratoryResults,
  mockRadiologyResults, mockProcedures, mockVisitProcedures,
  mockBMHP, mockVisitBMHP, mockSOAPNotes, mockCPPT, mockVerbalOrders,
  mockFollowUpAppointments, mockShiftSwapRequests
} from '@/lib/simrs-mock-data';
import { calculatePostShiftBurnoutScore, getBurnoutCategory } from '@/lib/simrs-calculations';
import { generateId, getToday, getCurrentTime } from '@/lib/formatters';

// ============================================================
// State Shape
// ============================================================
export interface SIMRSDatasetState {
  activePatients: Patient[];
  activeDoctors: Doctor[];
  activeUsers: User[];
  activeEmployees: Employee[];
  activePositions: Position[];
  activeDepartments: Department[];
  activeAttendance: Attendance[];
  activeLeaveRequests: LeaveRequest[];
  activeDoctorSchedules: DoctorSchedule[];
  activeDoctorQueueQuotas: DoctorQueueQuota[];
  activeAppointments: Appointment[];
  activeRegistration: Registration[];
  activeMedicalRecords: MedicalRecord[];
  activeOutpatientVisits: OutpatientVisit[];
  activePatientVisits: PatientVisit[];
  activeQueueNumbers: QueueNumber[];
  activeQueueTypes: QueueType[];
  activeQueueCounters: QueueCounter[];
  activeRooms: Room[];
  activeBilling: Billing[];
  activeBillingDetails: BillingDetail[];
  activeLaboratoryResults: LaboratoryResult[];
  activeRadiologyResults: RadiologyResult[];
  activeProcedures: Procedure[];
  activeVisitProcedures: VisitProcedure[];
  activeBMHP: BMHP[];
  activeVisitBMHP: VisitBMHP[];
  activeSOAPNotes: SOAPNote[];
  activeCPPT: CPPT[];
  activeVerbalOrders: VerbalOrder[];
  activeFollowUpAppointments: FollowUpAppointment[];
  shiftSwapRequests: ShiftSwapRequest[];
  burnoutAssessments: BurnoutAssessment[];
  attendanceSimulations: AttendanceSimulation[];
  simulationParameters: SimulationParameters;
  datasetSource: DatasetSource;
  lastUpdated: string;
  schemaHealth: SchemaHealth | null;
  selectedEmployeeId: number | null;
}

// ============================================================
// Actions
// ============================================================
type Action =
  | { type: 'SET_DATASET'; payload: Partial<SIMRSDatasetState> }
  | { type: 'RESET_TO_DUMMY' }
  | { type: 'UPDATE_SIMULATION_PARAMETERS'; payload: SimulationParameters }
  | { type: 'RESET_SIMULATION_PARAMETERS' }
  | { type: 'SUBMIT_ATTENDANCE_IN'; payload: { employee_id: number } }
  | { type: 'SUBMIT_ATTENDANCE_OUT'; payload: { employee_id: number } }
  | { type: 'SUBMIT_BURNOUT_FORM'; payload: { employee_id: number; answers: boolean[]; shift: ShiftType } }
  | { type: 'SUBMIT_SHIFT_SWAP'; payload: Omit<ShiftSwapRequest, 'request_id' | 'status' | 'created_at' | 'updated_at'> }
  | { type: 'APPROVE_SHIFT_SWAP'; payload: { request_id: string; admin_note?: string } }
  | { type: 'REJECT_SHIFT_SWAP'; payload: { request_id: string; admin_note?: string } }
  | { type: 'REQUEST_SHIFT_SWAP_IMPROVEMENT'; payload: { request_id: string; admin_note: string } }
  | { type: 'KADIV_APPROVE_SHIFT_SWAP'; payload: { request_id: string; kadiv_note?: string } }
  | { type: 'KADIV_REJECT_SHIFT_SWAP'; payload: { request_id: string; kadiv_note?: string } }
  | { type: 'SET_SELECTED_EMPLOYEE'; payload: number | null };

// ============================================================
// Initial State
// ============================================================
const initialState: SIMRSDatasetState = {
  activePatients: mockPatients,
  activeDoctors: mockDoctors,
  activeUsers: mockUsers,
  activeEmployees: mockEmployees,
  activePositions: mockPositions,
  activeDepartments: mockDepartments,
  activeAttendance: mockAttendance,
  activeLeaveRequests: mockLeaveRequests,
  activeDoctorSchedules: mockDoctorSchedules,
  activeDoctorQueueQuotas: mockDoctorQueueQuotas,
  activeAppointments: mockAppointments,
  activeRegistration: mockRegistrations,
  activeMedicalRecords: mockMedicalRecords,
  activeOutpatientVisits: mockOutpatientVisits,
  activePatientVisits: mockPatientVisits,
  activeQueueNumbers: mockQueueNumbers,
  activeQueueTypes: mockQueueTypes,
  activeQueueCounters: mockQueueCounters,
  activeRooms: mockRooms,
  activeBilling: mockBilling,
  activeBillingDetails: mockBillingDetails,
  activeLaboratoryResults: mockLaboratoryResults,
  activeRadiologyResults: mockRadiologyResults,
  activeProcedures: mockProcedures,
  activeVisitProcedures: mockVisitProcedures,
  activeBMHP: mockBMHP,
  activeVisitBMHP: mockVisitBMHP,
  activeSOAPNotes: mockSOAPNotes,
  activeCPPT: mockCPPT,
  activeVerbalOrders: mockVerbalOrders,
  activeFollowUpAppointments: mockFollowUpAppointments,
  shiftSwapRequests: mockShiftSwapRequests,
  burnoutAssessments: [],
  attendanceSimulations: [],
  simulationParameters: DEFAULT_SIMULATION_PARAMETERS,
  datasetSource: 'dummy',
  lastUpdated: '',
  schemaHealth: null,
  selectedEmployeeId: 1, // Default to first doctor
};

// ============================================================
// Reducer
// ============================================================
function reducer(state: SIMRSDatasetState, action: Action): SIMRSDatasetState {
  switch (action.type) {
    case 'SET_DATASET':
      return { ...state, ...action.payload, lastUpdated: typeof window !== 'undefined' ? new Date().toISOString() : '' };

    case 'RESET_TO_DUMMY':
      return { ...initialState, lastUpdated: typeof window !== 'undefined' ? new Date().toISOString() : '' };

    case 'UPDATE_SIMULATION_PARAMETERS':
      return { ...state, simulationParameters: action.payload };

    case 'RESET_SIMULATION_PARAMETERS':
      return { ...state, simulationParameters: DEFAULT_SIMULATION_PARAMETERS };

    case 'SUBMIT_ATTENDANCE_IN': {
      const sim: AttendanceSimulation = {
        employee_id: action.payload.employee_id,
        date: getToday(),
        check_in: getCurrentTime(),
        check_out: null,
        status: 'Sudah Absen Masuk',
        burnout_completed: false,
      };
      const existing = state.attendanceSimulations.findIndex(
        (a) => a.employee_id === sim.employee_id && a.date === sim.date
      );
      const sims = [...state.attendanceSimulations];
      if (existing >= 0) sims[existing] = sim;
      else sims.push(sim);
      return { ...state, attendanceSimulations: sims };
    }

    case 'SUBMIT_ATTENDANCE_OUT': {
      const sims = state.attendanceSimulations.map((a) => {
        if (a.employee_id === action.payload.employee_id && a.date === getToday()) {
          return { ...a, check_out: getCurrentTime(), status: 'Shift Selesai' as const };
        }
        return a;
      });
      return { ...state, attendanceSimulations: sims };
    }

    case 'SUBMIT_BURNOUT_FORM': {
      const score = calculatePostShiftBurnoutScore(action.payload.answers);
      const category = getBurnoutCategory(score, state.simulationParameters);
      const assessment: BurnoutAssessment = {
        assessment_id: generateId(),
        employee_id: action.payload.employee_id,
        date: getToday(),
        shift: action.payload.shift,
        answers: action.payload.answers,
        burnout_score: score,
        burnout_category: category,
        created_at: new Date().toISOString(),
      };
      const sims = state.attendanceSimulations.map((a) => {
        if (a.employee_id === action.payload.employee_id && a.date === getToday()) {
          return { ...a, burnout_completed: true };
        }
        return a;
      });
      return {
        ...state,
        burnoutAssessments: [...state.burnoutAssessments, assessment],
        attendanceSimulations: sims,
      };
    }

    case 'SUBMIT_SHIFT_SWAP': {
      const request: ShiftSwapRequest = {
        ...action.payload,
        request_id: generateId(),
        status: 'PENDING_KADIV', // Starts at Kadiv tier
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return { ...state, shiftSwapRequests: [...state.shiftSwapRequests, request] };
    }

    case 'APPROVE_SHIFT_SWAP': {
      const reqs = state.shiftSwapRequests.map((r) => {
        if (r.request_id === action.payload.request_id) {
          return { ...r, status: 'Disetujui' as const, admin_note: action.payload.admin_note, updated_at: new Date().toISOString() };
        }
        return r;
      });
      return { ...state, shiftSwapRequests: reqs };
    }

    case 'REJECT_SHIFT_SWAP': {
      const reqs = state.shiftSwapRequests.map((r) => {
        if (r.request_id === action.payload.request_id) {
          return { ...r, status: 'Ditolak' as const, admin_note: action.payload.admin_note, updated_at: new Date().toISOString() };
        }
        return r;
      });
      return { ...state, shiftSwapRequests: reqs };
    }

    case 'REQUEST_SHIFT_SWAP_IMPROVEMENT': {
      const reqs = state.shiftSwapRequests.map((r) => {
        if (r.request_id === action.payload.request_id) {
          return { ...r, status: 'Perlu Perbaikan' as const, admin_note: action.payload.admin_note, updated_at: new Date().toISOString() };
        }
        return r;
      });
      return { ...state, shiftSwapRequests: reqs };
    }

    case 'KADIV_APPROVE_SHIFT_SWAP': {
      const reqs = state.shiftSwapRequests.map((r) => {
        if (r.request_id === action.payload.request_id) {
          return {
            ...r,
            status: 'PENDING_ADMIN' as const,
            kadiv_note: action.payload.kadiv_note,
            kadiv_approved_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
        }
        return r;
      });
      return { ...state, shiftSwapRequests: reqs };
    }

    case 'KADIV_REJECT_SHIFT_SWAP': {
      const reqs = state.shiftSwapRequests.map((r) => {
        if (r.request_id === action.payload.request_id) {
          return {
            ...r,
            status: 'REJECTED' as const,
            kadiv_note: action.payload.kadiv_note,
            updated_at: new Date().toISOString(),
          };
        }
        return r;
      });
      return { ...state, shiftSwapRequests: reqs };
    }

    case 'SET_SELECTED_EMPLOYEE':
      return { ...state, selectedEmployeeId: action.payload };

    default:
      return state;
  }
}

// ============================================================
// Context
// ============================================================
export interface SIMRSContextValue {
  state: SIMRSDatasetState;
  dispatch: React.Dispatch<Action>;
  updateSIMRSDataset: (data: Partial<SIMRSDatasetState>) => void;
  resetToDummyDataset: () => void;
  updateSimulationParameters: (params: SimulationParameters) => void;
  resetSimulationParameters: () => void;
  submitAttendanceIn: (employeeId: number) => void;
  submitAttendanceOut: (employeeId: number) => void;
  submitPostShiftBurnoutForm: (employeeId: number, answers: boolean[], shift: ShiftType) => void;
  submitShiftSwapRequest: (data: Omit<ShiftSwapRequest, 'request_id' | 'status' | 'created_at' | 'updated_at'>) => void;
  approveShiftSwapRequest: (requestId: string, adminNote?: string) => void;
  rejectShiftSwapRequest: (requestId: string, adminNote?: string) => void;
  requestShiftSwapImprovement: (requestId: string, adminNote: string) => void;
  kadivApproveRequest: (requestId: string, kadivNote?: string) => void;
  kadivRejectRequest: (requestId: string, kadivNote?: string) => void;
  setSelectedEmployee: (id: number | null) => void;
}

export const SIMRSContext = createContext<SIMRSContextValue | null>(null);

// ============================================================
// Provider Component
// ============================================================
export function SIMRSDatasetProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    dispatch({ type: 'SET_DATASET', payload: { lastUpdated: new Date().toISOString() } });
  }, []);

  const updateSIMRSDataset = useCallback(
    (data: Partial<SIMRSDatasetState>) => dispatch({ type: 'SET_DATASET', payload: data }),
    []
  );
  const resetToDummyDataset = useCallback(() => dispatch({ type: 'RESET_TO_DUMMY' }), []);
  const updateSimulationParameters = useCallback(
    (params: SimulationParameters) => dispatch({ type: 'UPDATE_SIMULATION_PARAMETERS', payload: params }),
    []
  );
  const resetSimulationParameters = useCallback(() => dispatch({ type: 'RESET_SIMULATION_PARAMETERS' }), []);
  const submitAttendanceIn = useCallback(
    (employeeId: number) => dispatch({ type: 'SUBMIT_ATTENDANCE_IN', payload: { employee_id: employeeId } }),
    []
  );
  const submitAttendanceOut = useCallback(
    (employeeId: number) => dispatch({ type: 'SUBMIT_ATTENDANCE_OUT', payload: { employee_id: employeeId } }),
    []
  );
  const submitPostShiftBurnoutForm = useCallback(
    (employeeId: number, answers: boolean[], shift: ShiftType) =>
      dispatch({ type: 'SUBMIT_BURNOUT_FORM', payload: { employee_id: employeeId, answers, shift } }),
    []
  );
  const submitShiftSwapRequest = useCallback(
    (data: Omit<ShiftSwapRequest, 'request_id' | 'status' | 'created_at' | 'updated_at'>) =>
      dispatch({ type: 'SUBMIT_SHIFT_SWAP', payload: data }),
    []
  );
  const approveShiftSwapRequest = useCallback(
    (requestId: string, adminNote?: string) =>
      dispatch({ type: 'APPROVE_SHIFT_SWAP', payload: { request_id: requestId, admin_note: adminNote } }),
    []
  );
  const rejectShiftSwapRequest = useCallback(
    (requestId: string, adminNote?: string) =>
      dispatch({ type: 'REJECT_SHIFT_SWAP', payload: { request_id: requestId, admin_note: adminNote } }),
    []
  );
  const requestShiftSwapImprovement = useCallback(
    (requestId: string, adminNote: string) =>
      dispatch({ type: 'REQUEST_SHIFT_SWAP_IMPROVEMENT', payload: { request_id: requestId, admin_note: adminNote } }),
    []
  );
  const kadivApproveRequest = useCallback(
    (requestId: string, kadivNote?: string) =>
      dispatch({ type: 'KADIV_APPROVE_SHIFT_SWAP', payload: { request_id: requestId, kadiv_note: kadivNote } }),
    []
  );
  const kadivRejectRequest = useCallback(
    (requestId: string, kadivNote?: string) =>
      dispatch({ type: 'KADIV_REJECT_SHIFT_SWAP', payload: { request_id: requestId, kadiv_note: kadivNote } }),
    []
  );
  const setSelectedEmployee = useCallback(
    (id: number | null) => dispatch({ type: 'SET_SELECTED_EMPLOYEE', payload: id }),
    []
  );

  const value: SIMRSContextValue = {
    state,
    dispatch,
    updateSIMRSDataset,
    resetToDummyDataset,
    updateSimulationParameters,
    resetSimulationParameters,
    submitAttendanceIn,
    submitAttendanceOut,
    submitPostShiftBurnoutForm,
    submitShiftSwapRequest,
    approveShiftSwapRequest,
    rejectShiftSwapRequest,
    requestShiftSwapImprovement,
    kadivApproveRequest,
    kadivRejectRequest,
    setSelectedEmployee,
  };

  return <SIMRSContext.Provider value={value}>{children}</SIMRSContext.Provider>;
}
