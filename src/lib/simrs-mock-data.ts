// ============================================================
// SIMRS Mock Data — Based on dummy_data.sql from SIMRS-SOBRI
// ============================================================

import type {
  Department, Position, Employee, Patient, Doctor, User,
  Registration, OutpatientVisit, PatientVisit, QueueType, QueueCounter,
  QueueNumber, DoctorSchedule, DoctorQueueQuota, Room, Attendance,
  LeaveType, LeaveRequest, Appointment, MedicalRecord, Billing, BillingDetail,
  LaboratoryResult, RadiologyResult, Procedure, VisitProcedure, BMHP, VisitBMHP,
  SOAPNote, CPPT, VerbalOrder, FollowUpAppointment, Invoice, Payment,
  MedicalCondition, Allergy, ShiftSwapRequest
} from './types';

const today = new Date().toISOString().split('T')[0];
const d = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const mockDepartments: Department[] = [
  { department_id: 1, department_name: 'Poli Umum', description: 'Poliklinik Umum' },
  { department_id: 2, department_name: 'Poli Gigi', description: 'Poliklinik Gigi dan Mulut' },
  { department_id: 3, department_name: 'Poli Anak', description: 'Poliklinik Anak' },
  { department_id: 4, department_name: 'Poli Kandungan', description: 'Poliklinik Kebidanan dan Kandungan' },
  { department_id: 5, department_name: 'Poli Mata', description: 'Poliklinik Mata' },
  { department_id: 6, department_name: 'Poli THT', description: 'Poliklinik THT' },
  { department_id: 7, department_name: 'Poli Bedah', description: 'Poliklinik Bedah' },
  { department_id: 8, department_name: 'Poli Jantung', description: 'Poliklinik Jantung dan Pembuluh Darah' },
  { department_id: 9, department_name: 'Poli Paru', description: 'Poliklinik Paru' },
  { department_id: 10, department_name: 'Poli Saraf', description: 'Poliklinik Saraf' },
  { department_id: 11, department_name: 'IGD', description: 'Instalasi Gawat Darurat' },
  { department_id: 12, department_name: 'Farmasi', description: 'Instalasi Farmasi' },
  { department_id: 13, department_name: 'Laboratorium', description: 'Instalasi Laboratorium' },
  { department_id: 14, department_name: 'Radiologi', description: 'Instalasi Radiologi' },
  { department_id: 15, department_name: 'Administrasi', description: 'Bagian Administrasi' },
  { department_id: 16, department_name: 'Keuangan', description: 'Bagian Keuangan' },
];

export const mockPositions: Position[] = [
  { position_id: 1, position_name: 'Doctor Umum', department_id: 1, description: 'Dokter Umum', base_salary: 15000000 },
  { position_id: 2, position_name: 'Doctor Spesialis Anak', department_id: 3, description: 'Dokter Spesialis Anak', base_salary: 25000000 },
  { position_id: 3, position_name: 'Doctor Spesialis Bedah', department_id: 7, description: 'Dokter Spesialis Bedah', base_salary: 30000000 },
  { position_id: 4, position_name: 'Doctor Spesialis Kandungan', department_id: 4, description: 'Dokter Spesialis Kandungan', base_salary: 28000000 },
  { position_id: 5, position_name: 'Doctor Spesialis Jantung', department_id: 8, description: 'Dokter Spesialis Jantung', base_salary: 35000000 },
  { position_id: 6, position_name: 'Doctor Gigi', department_id: 2, description: 'Dokter Gigi', base_salary: 18000000 },
  { position_id: 7, position_name: 'Perawat', department_id: 1, description: 'Perawat', base_salary: 6000000 },
  { position_id: 8, position_name: 'Perawat IGD', department_id: 11, description: 'Perawat IGD', base_salary: 7000000 },
  { position_id: 9, position_name: 'Apoteker', department_id: 12, description: 'Apoteker', base_salary: 8000000 },
  { position_id: 10, position_name: 'Staf Administrasi', department_id: 15, description: 'Staf Administrasi', base_salary: 5000000 },
  { position_id: 11, position_name: 'Kasir', department_id: 16, description: 'Kasir', base_salary: 5000000 },
  { position_id: 12, position_name: 'Analis Lab', department_id: 13, description: 'Analis Laboratorium', base_salary: 7500000 },
  { position_id: 13, position_name: 'Radiografer', department_id: 14, description: 'Radiografer', base_salary: 7500000 },
];

export const mockEmployees: Employee[] = [
  { employee_id: 1, employee_number: 'EM0001', first_name: 'Ahmad', last_name: 'Suryadi', position_id: 1, hire_date: '2020-01-15', birth_date: '1985-03-20', gender: 'L', address: null, phone: null, email: null, emergency_contact: null, emergency_phone: null, status: 'Active' },
  { employee_id: 2, employee_number: 'EM0002', first_name: 'Siti', last_name: 'Rahayu', position_id: 2, hire_date: '2019-06-01', birth_date: '1982-07-15', gender: 'P', address: null, phone: null, email: null, emergency_contact: null, emergency_phone: null, status: 'Active' },
  { employee_id: 3, employee_number: 'EM0003', first_name: 'Budi', last_name: 'Pratama', position_id: 3, hire_date: '2018-03-10', birth_date: '1978-11-05', gender: 'L', address: null, phone: null, email: null, emergency_contact: null, emergency_phone: null, status: 'Active' },
  { employee_id: 4, employee_number: 'EM0004', first_name: 'Dewi', last_name: 'Anggraini', position_id: 4, hire_date: '2019-09-15', birth_date: '1980-05-25', gender: 'P', address: null, phone: null, email: null, emergency_contact: null, emergency_phone: null, status: 'Active' },
  { employee_id: 5, employee_number: 'EM0005', first_name: 'Andi', last_name: 'Wijaya', position_id: 5, hire_date: '2017-08-01', birth_date: '1975-09-10', gender: 'L', address: null, phone: null, email: null, emergency_contact: null, emergency_phone: null, status: 'Active' },
  { employee_id: 6, employee_number: 'EM0006', first_name: 'Rina', last_name: 'Susanti', position_id: 6, hire_date: '2021-01-10', birth_date: '1990-02-14', gender: 'P', address: null, phone: null, email: null, emergency_contact: null, emergency_phone: null, status: 'Active' },
  { employee_id: 7, employee_number: 'EM0007', first_name: 'Hendra', last_name: 'Gunawan', position_id: 7, hire_date: '2020-04-01', birth_date: '1992-08-30', gender: 'L', address: null, phone: null, email: null, emergency_contact: null, emergency_phone: null, status: 'Active' },
  { employee_id: 8, employee_number: 'EM0008', first_name: 'Lina', last_name: 'Marlina', position_id: 8, hire_date: '2019-02-15', birth_date: '1991-12-01', gender: 'P', address: null, phone: null, email: null, emergency_contact: null, emergency_phone: null, status: 'Active' },
  { employee_id: 9, employee_number: 'EM0009', first_name: 'Agus', last_name: 'Hidayat', position_id: 9, hire_date: '2020-07-01', birth_date: '1988-06-20', gender: 'L', address: null, phone: null, email: null, emergency_contact: null, emergency_phone: null, status: 'Active' },
  { employee_id: 10, employee_number: 'EM0010', first_name: 'Maya', last_name: 'Putri', position_id: 10, hire_date: '2021-03-01', birth_date: '1995-04-10', gender: 'P', address: null, phone: null, email: null, emergency_contact: null, emergency_phone: null, status: 'Active' },
  { employee_id: 11, employee_number: 'EM0011', first_name: 'Eko', last_name: 'Prasetyo', position_id: 11, hire_date: '2021-06-01', birth_date: '1993-10-15', gender: 'L', address: null, phone: null, email: null, emergency_contact: null, emergency_phone: null, status: 'Active' },
  { employee_id: 12, employee_number: 'EM0012', first_name: 'Ratna', last_name: 'Sari', position_id: 12, hire_date: '2020-09-01', birth_date: '1989-01-25', gender: 'P', address: null, phone: null, email: null, emergency_contact: null, emergency_phone: null, status: 'Active' },
  { employee_id: 13, employee_number: 'EM0013', first_name: 'Doni', last_name: 'Firmansyah', position_id: 13, hire_date: '2021-01-15', birth_date: '1990-07-05', gender: 'L', address: null, phone: null, email: null, emergency_contact: null, emergency_phone: null, status: 'Active' },
];

export const mockUsers: User[] = [
  { user_id: 1, username: 'admin', password: '', role: 'admin', created_at: '2020-01-01', updated_at: '2020-01-01' },
  { user_id: 2, username: 'dr.ahmad', password: '', role: 'dokter', created_at: '2020-01-15', updated_at: '2020-01-15' },
  { user_id: 3, username: 'dr.siti', password: '', role: 'dokter', created_at: '2019-06-01', updated_at: '2019-06-01' },
  { user_id: 4, username: 'dr.budi', password: '', role: 'dokter', created_at: '2018-03-10', updated_at: '2018-03-10' },
  { user_id: 5, username: 'dr.dewi', password: '', role: 'dokter', created_at: '2019-09-15', updated_at: '2019-09-15' },
  { user_id: 6, username: 'dr.andi', password: '', role: 'dokter', created_at: '2017-08-01', updated_at: '2017-08-01' },
  { user_id: 7, username: 'drg.rina', password: '', role: 'dokter', created_at: '2021-01-10', updated_at: '2021-01-10' },
  { user_id: 8, username: 'perawat.hendra', password: '', role: 'perawat', created_at: '2020-04-01', updated_at: '2020-04-01' },
  { user_id: 9, username: 'perawat.lina', password: '', role: 'perawat', created_at: '2019-02-15', updated_at: '2019-02-15' },
  { user_id: 10, username: 'apoteker.agus', password: '', role: 'apoteker', created_at: '2020-07-01', updated_at: '2020-07-01' },
  { user_id: 11, username: 'staff.maya', password: '', role: 'staff', created_at: '2021-03-01', updated_at: '2021-03-01' },
  { user_id: 12, username: 'kasir.eko', password: '', role: 'kasir', created_at: '2021-06-01', updated_at: '2021-06-01' },
];

export const mockDoctors: Doctor[] = [
  { doctor_id: 1, user_id: 2, full_name: 'dr. Ahmad Suryadi', specialization: 'Umum', license_number: 'SIP-001-2020' },
  { doctor_id: 2, user_id: 3, full_name: 'dr. Siti Rahayu, Sp.A', specialization: 'Spesialis Anak', license_number: 'SIP-002-2019' },
  { doctor_id: 3, user_id: 4, full_name: 'dr. Budi Pratama, Sp.B', specialization: 'Spesialis Bedah', license_number: 'SIP-003-2018' },
  { doctor_id: 4, user_id: 5, full_name: 'dr. Dewi Anggraini, Sp.OG', specialization: 'Spesialis Kandungan', license_number: 'SIP-004-2019' },
  { doctor_id: 5, user_id: 6, full_name: 'dr. Andi Wijaya, Sp.JP', specialization: 'Spesialis Jantung', license_number: 'SIP-005-2017' },
  { doctor_id: 6, user_id: 7, full_name: 'drg. Rina Susanti', specialization: 'Gigi', license_number: 'SIP-006-2021' },
];

// Privacy: only patient_id, medical_record_number, registration_number, and aggregate data
export const mockPatients: Patient[] = [
  { patient_id: 1, registration_number: 'REG20250001', medical_record_number: 'MR2025000001', first_name: '', last_name: '', full_name: '', birth_date: '1980-05-15', gender: 'L', blood_type: 'A+', marital_status: 'Menikah', religion: 'Islam', occupation: null, address: null, phone: null, email: null, emergency_contact: null, emergency_phone: null, insurance_id: 1, insurance_number: '0001234567890', insurance_type: 'BPJS', created_at: '', updated_at: '' },
  { patient_id: 2, registration_number: 'REG20250002', medical_record_number: 'MR2025000002', first_name: '', last_name: '', full_name: '', birth_date: '1985-08-22', gender: 'P', blood_type: 'B+', marital_status: 'Menikah', religion: 'Islam', occupation: null, address: null, phone: null, email: null, emergency_contact: null, emergency_phone: null, insurance_id: 1, insurance_number: '0001234567891', insurance_type: 'BPJS', created_at: '', updated_at: '' },
  { patient_id: 3, registration_number: 'REG20250003', medical_record_number: 'MR2025000003', first_name: '', last_name: '', full_name: '', birth_date: '1975-12-03', gender: 'L', blood_type: 'O+', marital_status: 'Menikah', religion: null, occupation: null, address: null, phone: null, email: null, emergency_contact: null, emergency_phone: null, insurance_id: 2, insurance_number: 'PRU-2025001', insurance_type: 'Non-BPJS', created_at: '', updated_at: '' },
  { patient_id: 4, registration_number: 'REG20250004', medical_record_number: 'MR2025000004', first_name: '', last_name: '', full_name: '', birth_date: '1990-03-17', gender: 'P', blood_type: 'AB+', marital_status: 'Menikah', religion: null, occupation: null, address: null, phone: null, email: null, emergency_contact: null, emergency_phone: null, insurance_id: 2, insurance_number: 'PRU-2025002', insurance_type: 'Non-BPJS', created_at: '', updated_at: '' },
  { patient_id: 5, registration_number: 'REG20250005', medical_record_number: 'MR2025000005', first_name: '', last_name: '', full_name: '', birth_date: '1965-06-21', gender: 'L', blood_type: 'B-', marital_status: 'Menikah', religion: null, occupation: null, address: null, phone: null, email: null, emergency_contact: null, emergency_phone: null, insurance_id: null, insurance_number: null, insurance_type: 'Umum', created_at: '', updated_at: '' },
  { patient_id: 6, registration_number: 'REG20250006', medical_record_number: 'MR2025000006', first_name: '', last_name: '', full_name: '', birth_date: '1998-01-30', gender: 'P', blood_type: 'A-', marital_status: 'Belum Menikah', religion: null, occupation: null, address: null, phone: null, email: null, emergency_contact: null, emergency_phone: null, insurance_id: 1, insurance_number: '0001234567892', insurance_type: 'BPJS', created_at: '', updated_at: '' },
  { patient_id: 7, registration_number: 'REG20250007', medical_record_number: 'MR2025000007', first_name: '', last_name: '', full_name: '', birth_date: '1972-09-08', gender: 'L', blood_type: 'O-', marital_status: 'Menikah', religion: null, occupation: null, address: null, phone: null, email: null, emergency_contact: null, emergency_phone: null, insurance_id: 3, insurance_number: 'AXA-2025001', insurance_type: 'Non-BPJS', created_at: '', updated_at: '' },
  { patient_id: 8, registration_number: 'REG20250008', medical_record_number: 'MR2025000008', first_name: '', last_name: '', full_name: '', birth_date: '1988-11-14', gender: 'P', blood_type: 'B+', marital_status: 'Menikah', religion: null, occupation: null, address: null, phone: null, email: null, emergency_contact: null, emergency_phone: null, insurance_id: 3, insurance_number: 'AXA-2025002', insurance_type: 'Non-BPJS', created_at: '', updated_at: '' },
  { patient_id: 9, registration_number: 'REG20250009', medical_record_number: 'MR2025000009', first_name: '', last_name: '', full_name: '', birth_date: '2000-04-05', gender: 'P', blood_type: 'A+', marital_status: 'Belum Menikah', religion: null, occupation: null, address: null, phone: null, email: null, emergency_contact: null, emergency_phone: null, insurance_id: 1, insurance_number: '0001234567893', insurance_type: 'BPJS', created_at: '', updated_at: '' },
  { patient_id: 10, registration_number: 'REG20250010', medical_record_number: 'MR2025000010', first_name: '', last_name: '', full_name: '', birth_date: '1970-07-19', gender: 'L', blood_type: 'AB-', marital_status: 'Menikah', religion: null, occupation: null, address: null, phone: null, email: null, emergency_contact: null, emergency_phone: null, insurance_id: 4, insurance_number: 'ALZ-2025001', insurance_type: 'Non-BPJS', created_at: '', updated_at: '' },
];

export const mockRegistrations: Registration[] = [
  { registration_id: 1, patient_id: 1, registration_number: 'RG2025060001', registration_type: 'Rawat Jalan', registration_date: d(5) + ' 08:00:00', doctor_id: 1, department: 'Poli Umum', bpjs_number: '0001234567890', bpjs_status: 'Active', status: 'Active', notes: null },
  { registration_id: 2, patient_id: 2, registration_number: 'RG2025060002', registration_type: 'Rawat Jalan', registration_date: d(5) + ' 08:30:00', doctor_id: 2, department: 'Poli Anak', bpjs_number: '0001234567891', bpjs_status: 'Active', status: 'Completed', notes: null },
  { registration_id: 3, patient_id: 3, registration_number: 'RG2025060003', registration_type: 'Rawat Jalan', registration_date: d(4) + ' 09:00:00', doctor_id: 3, department: 'Poli Bedah', bpjs_number: null, bpjs_status: null, status: 'Active', notes: null },
  { registration_id: 4, patient_id: 4, registration_number: 'RG2025060004', registration_type: 'Rawat Jalan', registration_date: d(4) + ' 09:30:00', doctor_id: 4, department: 'Poli Kandungan', bpjs_number: null, bpjs_status: null, status: 'Active', notes: null },
  { registration_id: 5, patient_id: 5, registration_number: 'RG2025060005', registration_type: 'Gawat Darurat', registration_date: d(3) + ' 14:00:00', doctor_id: 1, department: 'IGD', bpjs_number: null, bpjs_status: null, status: 'Completed', notes: null },
  { registration_id: 6, patient_id: 6, registration_number: 'RG2025060006', registration_type: 'Rawat Jalan', registration_date: today + ' 08:15:00', doctor_id: 1, department: 'Poli Umum', bpjs_number: '0001234567892', bpjs_status: 'Active', status: 'Active', notes: null },
  { registration_id: 7, patient_id: 7, registration_number: 'RG2025060007', registration_type: 'Rawat Inap', registration_date: today + ' 10:00:00', doctor_id: 5, department: 'Poli Jantung', bpjs_number: null, bpjs_status: null, status: 'Active', notes: null },
  { registration_id: 8, patient_id: 8, registration_number: 'RG2025060008', registration_type: 'Rawat Jalan', registration_date: today + ' 08:00:00', doctor_id: 6, department: 'Poli Gigi', bpjs_number: null, bpjs_status: null, status: 'Active', notes: null },
  { registration_id: 9, patient_id: 9, registration_number: 'RG2025060009', registration_type: 'Penunjang', registration_date: today + ' 09:00:00', doctor_id: null, department: 'Laboratorium', bpjs_number: '0001234567893', bpjs_status: 'Active', status: 'Active', notes: null },
  { registration_id: 10, patient_id: 10, registration_number: 'RG2025060010', registration_type: 'Rawat Jalan', registration_date: today + ' 07:30:00', doctor_id: 5, department: 'Poli Jantung', bpjs_number: null, bpjs_status: null, status: 'Active', notes: null },
];

export const mockAppointments: Appointment[] = [
  { appointment_id: 1, patient_id: 1, doctor_id: 1, appointment_date: today, appointment_time: '09:00', status: 'Scheduled', queue_number: 1 },
  { appointment_id: 2, patient_id: 6, doctor_id: 1, appointment_date: today, appointment_time: '10:00', status: 'Scheduled', queue_number: 2 },
  { appointment_id: 3, patient_id: 7, doctor_id: 5, appointment_date: today, appointment_time: '09:30', status: 'Scheduled', queue_number: 1 },
  { appointment_id: 4, patient_id: 8, doctor_id: 6, appointment_date: today, appointment_time: '10:30', status: 'Scheduled', queue_number: 1 },
  { appointment_id: 5, patient_id: 10, doctor_id: 5, appointment_date: today, appointment_time: '11:00', status: 'Scheduled', queue_number: 2 },
];

export const mockMedicalRecords: MedicalRecord[] = [
  { record_id: 1, patient_id: 1, doctor_id: 1, visit_type: 'Rawat Jalan', visit_date: d(5), diagnosis: 'ISPA', treatment: 'Istirahat, obat penurun panas', notes: null },
  { record_id: 2, patient_id: 2, doctor_id: 2, visit_type: 'Rawat Jalan', visit_date: d(5), diagnosis: 'DBD recovery', treatment: 'Kontrol trombosit', notes: null },
  { record_id: 3, patient_id: 3, doctor_id: 3, visit_type: 'Rawat Jalan', visit_date: d(4), diagnosis: 'Appendisitis', treatment: 'Rencana operasi', notes: null },
  { record_id: 4, patient_id: 5, doctor_id: 1, visit_type: 'IGD', visit_date: d(3), diagnosis: 'Asma akut', treatment: 'Nebulizer, oksigen', notes: null },
  { record_id: 5, patient_id: 7, doctor_id: 5, visit_type: 'Rawat Inap', visit_date: d(2), diagnosis: 'Suspek PJK', treatment: 'Monitoring, EKG', notes: null },
];

export const mockOutpatientVisits: OutpatientVisit[] = [
  { visit_id: 1, patient_id: 1, registration_id: 1, visit_date: d(5), visit_type: 'First Visit', department_id: 1, doctor_id: 1, symptoms: 'Demam tinggi, batuk, pilek', diagnosis: 'ISPA', treatment_plan: 'Istirahat, obat', notes: null, status: 'Completed', created_at: d(5), updated_at: d(5) },
  { visit_id: 2, patient_id: 2, registration_id: 2, visit_date: d(5), visit_type: 'Follow Up', department_id: 3, doctor_id: 2, symptoms: 'Kontrol pasca DBD', diagnosis: 'DBD recovery', treatment_plan: 'Kontrol trombosit', notes: null, status: 'Completed', created_at: d(5), updated_at: d(5) },
  { visit_id: 3, patient_id: 3, registration_id: 3, visit_date: d(4), visit_type: 'First Visit', department_id: 7, doctor_id: 3, symptoms: 'Nyeri perut kanan bawah', diagnosis: 'Appendisitis', treatment_plan: 'Rencana operasi', notes: null, status: 'In Progress', created_at: d(4), updated_at: d(4) },
  { visit_id: 4, patient_id: 4, registration_id: 4, visit_date: d(4), visit_type: 'Routine Checkup', department_id: 4, doctor_id: 4, symptoms: 'Pemeriksaan kehamilan', diagnosis: 'Kehamilan 28 minggu', treatment_plan: 'USG dan kontrol', notes: null, status: 'Completed', created_at: d(4), updated_at: d(4) },
  { visit_id: 5, patient_id: 5, registration_id: 5, visit_date: d(3), visit_type: 'Emergency', department_id: 11, doctor_id: 1, symptoms: 'Sesak napas mendadak', diagnosis: 'Asma akut', treatment_plan: 'Nebulizer, oksigen', notes: null, status: 'Completed', created_at: d(3), updated_at: d(3) },
  { visit_id: 6, patient_id: 6, registration_id: 6, visit_date: today, visit_type: 'First Visit', department_id: 1, doctor_id: 1, symptoms: 'Sakit kepala berulang', diagnosis: null, treatment_plan: null, notes: null, status: 'Waiting', created_at: today, updated_at: today },
  { visit_id: 7, patient_id: 7, registration_id: 7, visit_date: today, visit_type: 'First Visit', department_id: 8, doctor_id: 5, symptoms: 'Nyeri dada, sesak', diagnosis: null, treatment_plan: null, notes: null, status: 'Waiting', created_at: today, updated_at: today },
  { visit_id: 8, patient_id: 8, registration_id: 8, visit_date: today, visit_type: 'First Visit', department_id: 2, doctor_id: 6, symptoms: 'Sakit gigi, gusi bengkak', diagnosis: null, treatment_plan: null, notes: null, status: 'Waiting', created_at: today, updated_at: today },
  { visit_id: 9, patient_id: 10, registration_id: 10, visit_date: today, visit_type: 'Follow Up', department_id: 8, doctor_id: 5, symptoms: 'Kontrol rutin jantung', diagnosis: null, treatment_plan: null, notes: null, status: 'Waiting', created_at: today, updated_at: today },
];

export const mockPatientVisits: PatientVisit[] = [
  { visit_id: 1, patient_id: 1, visit_date: d(5), visit_type: 'First Visit', department_id: 1, doctor_id: 1, symptoms: 'Demam tinggi', diagnosis: 'ISPA', treatment_plan: null, notes: null, created_at: d(5), updated_at: d(5) },
  { visit_id: 2, patient_id: 2, visit_date: d(5), visit_type: 'Follow Up', department_id: 3, doctor_id: 2, symptoms: 'Kontrol DBD', diagnosis: 'DBD Recovery', treatment_plan: null, notes: null, created_at: d(5), updated_at: d(5) },
  { visit_id: 3, patient_id: 3, visit_date: d(4), visit_type: 'First Visit', department_id: 7, doctor_id: 3, symptoms: 'Nyeri perut', diagnosis: 'Appendisitis', treatment_plan: null, notes: null, created_at: d(4), updated_at: d(4) },
  { visit_id: 4, patient_id: 5, visit_date: d(3), visit_type: 'Emergency', department_id: 11, doctor_id: 1, symptoms: 'Sesak napas', diagnosis: 'Asma Akut', treatment_plan: null, notes: null, created_at: d(3), updated_at: d(3) },
  { visit_id: 5, patient_id: 7, visit_date: d(2), visit_type: 'First Visit', department_id: 8, doctor_id: 5, symptoms: 'Nyeri dada', diagnosis: 'Suspek PJK', treatment_plan: null, notes: null, created_at: d(2), updated_at: d(2) },
];

export const mockQueueTypes: QueueType[] = [
  { type_id: 1, type_name: 'Registration', description: 'Antrean pendaftaran', is_active: true },
  { type_id: 2, type_name: 'Support', description: 'Antrean penunjang', is_active: true },
  { type_id: 3, type_name: 'Cashier', description: 'Antrean kasir', is_active: true },
  { type_id: 4, type_name: 'Pharmacy', description: 'Antrean apotek', is_active: true },
  { type_id: 5, type_name: 'Doctor', description: 'Antrean berdasarkan kuota dokter', is_active: true },
];

export const mockQueueCounters: QueueCounter[] = [
  { counter_id: 1, type_id: 1, counter_name: 'Loket 1', is_active: true },
  { counter_id: 2, type_id: 1, counter_name: 'Loket 2', is_active: true },
  { counter_id: 3, type_id: 2, counter_name: 'Penunjang 1', is_active: true },
  { counter_id: 4, type_id: 3, counter_name: 'Kasir 1', is_active: true },
  { counter_id: 5, type_id: 3, counter_name: 'Kasir 2', is_active: true },
  { counter_id: 6, type_id: 4, counter_name: 'Apotek 1', is_active: true },
  { counter_id: 7, type_id: 5, counter_name: 'Poli Umum', is_active: true },
  { counter_id: 8, type_id: 5, counter_name: 'Poli Anak', is_active: true },
  { counter_id: 9, type_id: 5, counter_name: 'Poli Bedah', is_active: true },
];

export const mockQueueNumbers: QueueNumber[] = [
  { queue_id: 1, type_id: 1, counter_id: 1, patient_id: 1, queue_number: today.replace(/-/g, '') + '001', status: 'Served', priority: 'Normal', created_at: today + ' 07:30:00', updated_at: today },
  { queue_id: 2, type_id: 1, counter_id: 1, patient_id: 2, queue_number: today.replace(/-/g, '') + '002', status: 'Served', priority: 'Normal', created_at: today + ' 07:45:00', updated_at: today },
  { queue_id: 3, type_id: 1, counter_id: 2, patient_id: 3, queue_number: today.replace(/-/g, '') + '003', status: 'Called', priority: 'Normal', created_at: today + ' 08:00:00', updated_at: today },
  { queue_id: 4, type_id: 1, counter_id: null, patient_id: 6, queue_number: today.replace(/-/g, '') + '004', status: 'Waiting', priority: 'Normal', created_at: today + ' 08:15:00', updated_at: today },
  { queue_id: 5, type_id: 1, counter_id: null, patient_id: 7, queue_number: today.replace(/-/g, '') + '005', status: 'Waiting', priority: 'Priority', created_at: today + ' 08:30:00', updated_at: today },
  { queue_id: 6, type_id: 1, counter_id: null, patient_id: 8, queue_number: today.replace(/-/g, '') + '006', status: 'Waiting', priority: 'Normal', created_at: today + ' 08:45:00', updated_at: today },
  { queue_id: 7, type_id: 1, counter_id: null, patient_id: 9, queue_number: today.replace(/-/g, '') + '007', status: 'Waiting', priority: 'Normal', created_at: today + ' 09:00:00', updated_at: today },
  { queue_id: 8, type_id: 1, counter_id: null, patient_id: 10, queue_number: today.replace(/-/g, '') + '008', status: 'Waiting', priority: 'Emergency', created_at: today + ' 09:15:00', updated_at: today },
  { queue_id: 9, type_id: 5, counter_id: 7, patient_id: 1, queue_number: 'D' + today.replace(/-/g, '') + '001', status: 'Served', priority: 'Normal', created_at: today + ' 08:00:00', updated_at: today },
  { queue_id: 10, type_id: 5, counter_id: 8, patient_id: 2, queue_number: 'D' + today.replace(/-/g, '') + '002', status: 'Called', priority: 'Normal', created_at: today + ' 08:30:00', updated_at: today },
  { queue_id: 11, type_id: 5, counter_id: null, patient_id: 6, queue_number: 'D' + today.replace(/-/g, '') + '003', status: 'Waiting', priority: 'Normal', created_at: today + ' 09:00:00', updated_at: today },
  { queue_id: 12, type_id: 4, counter_id: 6, patient_id: 1, queue_number: 'A' + today.replace(/-/g, '') + '001', status: 'Waiting', priority: 'Normal', created_at: today + ' 10:00:00', updated_at: today },
  { queue_id: 13, type_id: 4, counter_id: null, patient_id: 2, queue_number: 'A' + today.replace(/-/g, '') + '002', status: 'Waiting', priority: 'Normal', created_at: today + ' 10:15:00', updated_at: today },
];

export const mockDoctorSchedules: DoctorSchedule[] = [
  { schedule_id: 1, doctor_id: 1, day_of_week: 0, start_time: '08:00', end_time: '12:00', max_patients: 25, is_active: true },
  { schedule_id: 2, doctor_id: 1, day_of_week: 1, start_time: '08:00', end_time: '12:00', max_patients: 25, is_active: true },
  { schedule_id: 3, doctor_id: 1, day_of_week: 2, start_time: '13:00', end_time: '17:00', max_patients: 20, is_active: true },
  { schedule_id: 4, doctor_id: 1, day_of_week: 3, start_time: '08:00', end_time: '12:00', max_patients: 25, is_active: true },
  { schedule_id: 5, doctor_id: 1, day_of_week: 4, start_time: '08:00', end_time: '12:00', max_patients: 25, is_active: true },
  { schedule_id: 6, doctor_id: 2, day_of_week: 0, start_time: '08:00', end_time: '14:00', max_patients: 20, is_active: true },
  { schedule_id: 7, doctor_id: 2, day_of_week: 2, start_time: '08:00', end_time: '14:00', max_patients: 20, is_active: true },
  { schedule_id: 8, doctor_id: 2, day_of_week: 4, start_time: '08:00', end_time: '14:00', max_patients: 20, is_active: true },
  { schedule_id: 9, doctor_id: 3, day_of_week: 1, start_time: '09:00', end_time: '15:00', max_patients: 15, is_active: true },
  { schedule_id: 10, doctor_id: 3, day_of_week: 3, start_time: '09:00', end_time: '15:00', max_patients: 15, is_active: true },
  { schedule_id: 11, doctor_id: 4, day_of_week: 0, start_time: '08:00', end_time: '13:00', max_patients: 18, is_active: true },
  { schedule_id: 12, doctor_id: 4, day_of_week: 2, start_time: '08:00', end_time: '13:00', max_patients: 18, is_active: true },
  { schedule_id: 13, doctor_id: 4, day_of_week: 4, start_time: '08:00', end_time: '13:00', max_patients: 18, is_active: true },
  { schedule_id: 14, doctor_id: 5, day_of_week: 1, start_time: '08:00', end_time: '12:00', max_patients: 12, is_active: true },
  { schedule_id: 15, doctor_id: 5, day_of_week: 3, start_time: '08:00', end_time: '12:00', max_patients: 12, is_active: true },
  { schedule_id: 16, doctor_id: 5, day_of_week: 5, start_time: '08:00', end_time: '12:00', max_patients: 10, is_active: true },
  { schedule_id: 17, doctor_id: 6, day_of_week: 0, start_time: '09:00', end_time: '16:00', max_patients: 20, is_active: true },
  { schedule_id: 18, doctor_id: 6, day_of_week: 2, start_time: '09:00', end_time: '16:00', max_patients: 20, is_active: true },
  { schedule_id: 19, doctor_id: 6, day_of_week: 4, start_time: '09:00', end_time: '16:00', max_patients: 20, is_active: true },
];

export const mockDoctorQueueQuotas: DoctorQueueQuota[] = [
  { quota_id: 1, doctor_id: 1, date: today, max_patients: 25, current_patients: 3 },
  { quota_id: 2, doctor_id: 2, date: today, max_patients: 20, current_patients: 1 },
  { quota_id: 3, doctor_id: 5, date: today, max_patients: 12, current_patients: 2 },
  { quota_id: 4, doctor_id: 6, date: today, max_patients: 20, current_patients: 1 },
];

export const mockRooms: Room[] = [
  { room_id: 1, room_number: 'VIP-101', room_type: 'VIP', floor: 1, status: 'Available', price: 1500000 },
  { room_id: 2, room_number: 'VIP-102', room_type: 'VIP', floor: 1, status: 'Occupied', price: 1500000 },
  { room_id: 3, room_number: 'K1-201', room_type: 'Kelas 1', floor: 2, status: 'Available', price: 800000 },
  { room_id: 4, room_number: 'K1-202', room_type: 'Kelas 1', floor: 2, status: 'Available', price: 800000 },
  { room_id: 5, room_number: 'K2-301', room_type: 'Kelas 2', floor: 3, status: 'Available', price: 500000 },
  { room_id: 6, room_number: 'K2-302', room_type: 'Kelas 2', floor: 3, status: 'Occupied', price: 500000 },
  { room_id: 7, room_number: 'K3-401', room_type: 'Kelas 3', floor: 4, status: 'Available', price: 250000 },
  { room_id: 8, room_number: 'K3-402', room_type: 'Kelas 3', floor: 4, status: 'Available', price: 250000 },
  { room_id: 9, room_number: 'K3-403', room_type: 'Kelas 3', floor: 4, status: 'Maintenance', price: 250000 },
  { room_id: 10, room_number: 'IGD-01', room_type: 'IGD', floor: 1, status: 'Available', price: 350000 },
  { room_id: 11, room_number: 'IGD-02', room_type: 'IGD', floor: 1, status: 'Available', price: 350000 },
  { room_id: 12, room_number: 'ICU-01', room_type: 'ICU', floor: 1, status: 'Available', price: 2500000 },
  { room_id: 13, room_number: 'ICU-02', room_type: 'ICU', floor: 1, status: 'Occupied', price: 2500000 },
];

export const mockAttendance: Attendance[] = [
  // 4 days ago
  { attendance_id: 1, employee_id: 1, date: d(4), check_in: '07:45:00', check_out: '16:00:00', status: 'Present', notes: null },
  { attendance_id: 2, employee_id: 2, date: d(4), check_in: '07:50:00', check_out: '16:05:00', status: 'Present', notes: null },
  { attendance_id: 3, employee_id: 3, date: d(4), check_in: '08:30:00', check_out: '16:00:00', status: 'Late', notes: null },
  { attendance_id: 4, employee_id: 4, date: d(4), check_in: '07:55:00', check_out: '16:00:00', status: 'Present', notes: null },
  { attendance_id: 5, employee_id: 5, date: d(4), check_in: '08:00:00', check_out: '16:00:00', status: 'Present', notes: null },
  { attendance_id: 6, employee_id: 6, date: d(4), check_in: '08:55:00', check_out: '16:00:00', status: 'Present', notes: null },
  { attendance_id: 7, employee_id: 7, date: d(4), check_in: '07:30:00', check_out: '16:00:00', status: 'Present', notes: null },
  { attendance_id: 8, employee_id: 8, date: d(4), check_in: '07:40:00', check_out: '16:00:00', status: 'Present', notes: null },
  { attendance_id: 9, employee_id: 9, date: d(4), check_in: '08:00:00', check_out: '16:00:00', status: 'Present', notes: null },
  { attendance_id: 10, employee_id: 10, date: d(4), check_in: '07:55:00', check_out: '16:00:00', status: 'Present', notes: null },
  { attendance_id: 11, employee_id: 11, date: d(4), check_in: '08:00:00', check_out: '16:00:00', status: 'Present', notes: null },
  // 3 days ago
  { attendance_id: 12, employee_id: 1, date: d(3), check_in: '07:50:00', check_out: '16:10:00', status: 'Present', notes: null },
  { attendance_id: 13, employee_id: 2, date: d(3), check_in: '07:55:00', check_out: '16:00:00', status: 'Present', notes: null },
  { attendance_id: 14, employee_id: 3, date: d(3), check_in: '07:58:00', check_out: '16:00:00', status: 'Present', notes: null },
  { attendance_id: 15, employee_id: 4, date: d(3), check_in: '07:45:00', check_out: '16:00:00', status: 'Present', notes: null },
  { attendance_id: 16, employee_id: 5, date: d(3), check_in: '08:00:00', check_out: '15:30:00', status: 'Early Leave', notes: null },
  { attendance_id: 17, employee_id: 7, date: d(3), check_in: '07:30:00', check_out: '16:00:00', status: 'Present', notes: null },
  { attendance_id: 18, employee_id: 8, date: d(3), check_in: '07:40:00', check_out: '16:00:00', status: 'Present', notes: null },
  // 2 days ago
  { attendance_id: 19, employee_id: 1, date: d(2), check_in: '07:55:00', check_out: '16:05:00', status: 'Present', notes: null },
  { attendance_id: 20, employee_id: 2, date: d(2), check_in: '08:15:00', check_out: '16:00:00', status: 'Late', notes: null },
  { attendance_id: 21, employee_id: 3, date: d(2), check_in: '07:50:00', check_out: '16:00:00', status: 'Present', notes: null },
  // 1 day ago
  { attendance_id: 22, employee_id: 1, date: d(1), check_in: '07:50:00', check_out: '16:00:00', status: 'Present', notes: null },
  { attendance_id: 23, employee_id: 2, date: d(1), check_in: '07:45:00', check_out: '16:10:00', status: 'Present', notes: null },
  { attendance_id: 24, employee_id: 3, date: d(1), check_in: '07:55:00', check_out: '16:00:00', status: 'Present', notes: null },
  { attendance_id: 25, employee_id: 4, date: d(1), check_in: '08:00:00', check_out: '16:00:00', status: 'Present', notes: null },
  { attendance_id: 26, employee_id: 5, date: d(1), check_in: '07:55:00', check_out: '16:00:00', status: 'Present', notes: null },
  // Today
  { attendance_id: 27, employee_id: 1, date: today, check_in: '07:45:00', check_out: null, status: 'Present', notes: null },
  { attendance_id: 28, employee_id: 2, date: today, check_in: '07:50:00', check_out: null, status: 'Present', notes: null },
  { attendance_id: 29, employee_id: 3, date: today, check_in: '08:00:00', check_out: null, status: 'Present', notes: null },
  { attendance_id: 30, employee_id: 4, date: today, check_in: '07:55:00', check_out: null, status: 'Present', notes: null },
  { attendance_id: 31, employee_id: 5, date: today, check_in: '08:00:00', check_out: null, status: 'Present', notes: null },
  { attendance_id: 32, employee_id: 6, date: today, check_in: '08:55:00', check_out: null, status: 'Present', notes: null },
  { attendance_id: 33, employee_id: 7, date: today, check_in: '07:30:00', check_out: null, status: 'Present', notes: null },
  { attendance_id: 34, employee_id: 8, date: today, check_in: '07:40:00', check_out: null, status: 'Present', notes: null },
  { attendance_id: 35, employee_id: 9, date: today, check_in: '08:00:00', check_out: null, status: 'Present', notes: null },
  { attendance_id: 36, employee_id: 10, date: today, check_in: '07:50:00', check_out: null, status: 'Present', notes: null },
  { attendance_id: 37, employee_id: 11, date: today, check_in: '08:00:00', check_out: null, status: 'Present', notes: null },
];

export const mockLeaveTypes: LeaveType[] = [
  { type_id: 1, type_name: 'Cuti Tahunan', description: 'Cuti tahunan 12 hari per tahun', paid: true },
  { type_id: 2, type_name: 'Cuti Sakit', description: 'Cuti sakit dengan surat dokter', paid: true },
  { type_id: 3, type_name: 'Cuti Melahirkan', description: 'Cuti melahirkan 3 bulan', paid: true },
  { type_id: 4, type_name: 'Cuti Besar', description: 'Cuti besar setiap 6 tahun', paid: true },
  { type_id: 5, type_name: 'Izin Tidak Masuk', description: 'Izin tidak masuk kerja', paid: false },
];

export const mockLeaveRequests: LeaveRequest[] = [
  { request_id: 1, employee_id: 7, leave_type_id: 1, start_date: '2025-07-01', end_date: '2025-07-05', reason: 'Liburan keluarga', status: 'Approved', approved_by: null, approval_date: null },
  { request_id: 2, employee_id: 8, leave_type_id: 2, start_date: '2025-06-28', end_date: '2025-06-30', reason: 'Sakit flu', status: 'Approved', approved_by: null, approval_date: null },
  { request_id: 3, employee_id: 10, leave_type_id: 1, start_date: '2025-07-10', end_date: '2025-07-14', reason: 'Cuti tahunan', status: 'Pending', approved_by: null, approval_date: null },
  { request_id: 4, employee_id: 12, leave_type_id: 3, start_date: '2025-08-01', end_date: '2025-10-31', reason: 'Cuti melahirkan', status: 'Approved', approved_by: null, approval_date: null },
];

export const mockBilling: Billing[] = [
  { bill_id: 1, patient_id: 1, visit_type: 'Rawat Jalan', bill_date: d(5), total_amount: 250000, payment_status: 'Paid', payment_method: 'BPJS' },
  { bill_id: 2, patient_id: 2, visit_type: 'Rawat Jalan', bill_date: d(5), total_amount: 350000, payment_status: 'Paid', payment_method: 'BPJS' },
  { bill_id: 3, patient_id: 3, visit_type: 'Rawat Jalan', bill_date: d(4), total_amount: 1500000, payment_status: 'Pending', payment_method: null },
  { bill_id: 4, patient_id: 4, visit_type: 'Rawat Jalan', bill_date: d(4), total_amount: 500000, payment_status: 'Pending', payment_method: null },
  { bill_id: 5, patient_id: 5, visit_type: 'IGD', bill_date: d(3), total_amount: 800000, payment_status: 'Paid', payment_method: 'Cash' },
];

export const mockBillingDetails: BillingDetail[] = [
  { bill_detail_id: 1, bill_id: 1, item_type: 'Consultation', item_name: 'Konsultasi Dokter Umum', quantity: 1, unit_price: 150000, total_price: 150000 },
  { bill_detail_id: 2, bill_id: 1, item_type: 'Medication', item_name: 'Paracetamol 500mg', quantity: 20, unit_price: 5000, total_price: 100000 },
  { bill_detail_id: 3, bill_id: 2, item_type: 'Consultation', item_name: 'Konsultasi Spesialis Anak', quantity: 1, unit_price: 250000, total_price: 250000 },
  { bill_detail_id: 4, bill_id: 2, item_type: 'Laboratory', item_name: 'Cek Darah Lengkap', quantity: 1, unit_price: 100000, total_price: 100000 },
];

export const mockLaboratoryResults: LaboratoryResult[] = [
  { result_id: 1, medical_record_id: 2, test_id: 1, result_date: d(5), result_value: 'Trombosit: 180.000', reference_range: '150.000-400.000', status: 'Completed' },
  { result_id: 2, medical_record_id: 3, test_id: 2, result_date: d(4), result_value: 'Leukosit: 15.000', reference_range: '5.000-10.000', status: 'Completed' },
];

export const mockRadiologyResults: RadiologyResult[] = [
  { result_id: 1, medical_record_id: 3, test_id: 1, result_date: d(4), result_value: 'USG Abdomen: Appendix membesar', radiologist_id: null, status: 'Completed' },
];

export const mockProcedures: Procedure[] = [
  { procedure_id: 1, name: 'Konsultasi Umum', description: 'Konsultasi dokter umum', price: 150000, category: 'Konsultasi' },
  { procedure_id: 2, name: 'Konsultasi Spesialis', description: 'Konsultasi dokter spesialis', price: 300000, category: 'Konsultasi' },
  { procedure_id: 3, name: 'EKG', description: 'Elektrokardiogram', price: 200000, category: 'Diagnostik' },
  { procedure_id: 4, name: 'USG Abdomen', description: 'Ultrasonografi Abdomen', price: 500000, category: 'Diagnostik' },
  { procedure_id: 5, name: 'Nebulizer', description: 'Terapi uap', price: 100000, category: 'Tindakan' },
];

export const mockVisitProcedures: VisitProcedure[] = [
  { visit_procedure_id: 1, visit_id: 1, procedure_id: 1, quantity: 1, notes: null },
  { visit_procedure_id: 2, visit_id: 5, procedure_id: 5, quantity: 2, notes: null },
];

export const mockBMHP: BMHP[] = [
  { bmhp_id: 1, name: 'Sarung Tangan Latex', description: 'Sarung tangan medis', unit: 'Box', price: 50000, stock: 200 },
  { bmhp_id: 2, name: 'Masker Bedah', description: 'Masker medis', unit: 'Box', price: 35000, stock: 300 },
  { bmhp_id: 3, name: 'Kasa Steril', description: 'Kasa steril 10x10cm', unit: 'Pack', price: 15000, stock: 150 },
];

export const mockVisitBMHP: VisitBMHP[] = [
  { visit_bmhp_id: 1, visit_id: 5, bmhp_id: 1, quantity: 2, notes: null },
  { visit_bmhp_id: 2, visit_id: 5, bmhp_id: 3, quantity: 5, notes: null },
];

export const mockSOAPNotes: SOAPNote[] = [
  { soap_id: 1, visit_id: 1, subjective: 'Demam tinggi 3 hari, batuk berdahak', objective: 'Suhu 38.5°C, tenggorokan merah', assessment: 'ISPA', plan: 'Paracetamol, istirahat', created_at: d(5), created_by: 2 },
];

export const mockCPPT: CPPT[] = [
  { cppt_id: 1, visit_id: 1, content: 'Pasien datang dengan keluhan demam tinggi 3 hari. Diberikan terapi simptomatik.', created_at: d(5), created_by: 2 },
];

export const mockVerbalOrders: VerbalOrder[] = [
  { order_id: 1, visit_id: 5, order_type: 'Medication', content: 'Berikan Nebulizer 2x', status: 'Executed', created_at: d(3), created_by: 2, executed_at: d(3), executed_by: 8 },
];

export const mockFollowUpAppointments: FollowUpAppointment[] = [
  { appointment_id: 1, visit_id: 2, patient_id: 2, doctor_id: 2, appointment_date: today, appointment_time: '10:00', notes: 'Kontrol trombosit', status: 'Scheduled' },
  { appointment_id: 2, visit_id: 4, patient_id: 4, doctor_id: 4, appointment_date: d(-7), appointment_time: '09:00', notes: 'Kontrol kehamilan', status: 'Scheduled' },
];

export const mockInvoices: Invoice[] = [
  { invoice_id: 1, invoice_number: 'INV2025060001', patient_id: 1, invoice_date: d(5), subtotal: 250000, tax: 25000, insurance_coverage: 200000, total: 75000, status: 'Paid' },
  { invoice_id: 2, invoice_number: 'INV2025060002', patient_id: 2, invoice_date: d(5), subtotal: 350000, tax: 35000, insurance_coverage: 280000, total: 105000, status: 'Paid' },
  { invoice_id: 3, invoice_number: 'INV2025060003', patient_id: 3, invoice_date: d(4), subtotal: 1500000, tax: 150000, insurance_coverage: 1350000, total: 300000, status: 'Pending' },
];

export const mockPayments: Payment[] = [
  { payment_id: 1, invoice_id: 1, payment_method: 'BPJS', amount: 200000, payment_date: d(5), reference_number: 'BPJS-001' },
  { payment_id: 2, invoice_id: 1, payment_method: 'Cash', amount: 75000, payment_date: d(5), reference_number: 'CASH-001' },
  { payment_id: 3, invoice_id: 2, payment_method: 'BPJS', amount: 280000, payment_date: d(5), reference_number: 'BPJS-002' },
];

export const mockMedicalConditions: MedicalCondition[] = [
  { condition_id: 1, patient_id: 1, condition_name: 'Hipertensi', diagnosis_date: '2023-01-15', notes: 'Tekanan darah tinggi stage 1' },
  { condition_id: 2, patient_id: 1, condition_name: 'Diabetes Mellitus Tipe 2', diagnosis_date: '2024-03-20', notes: null },
  { condition_id: 3, patient_id: 5, condition_name: 'Asma Bronkial', diagnosis_date: '2020-05-10', notes: 'Riwayat asma sejak kecil' },
];

export const mockAllergies: Allergy[] = [
  { allergy_id: 1, patient_id: 1, allergen: 'Penisilin', severity: 'Berat', notes: 'Reaksi anafilaksis' },
  { allergy_id: 2, patient_id: 5, allergen: 'Debu', severity: 'Ringan', notes: 'Bersin-bersin' },
];



export const mockShiftSwapRequests: ShiftSwapRequest[] = [
  {
    request_id: 'SWAP-001',
    requester_id: 'N-001',
    requester_role: 'perawat',
    requester_name: 'Ns. Budi Santoso',
    department_name: 'IGD',
    current_date: '2026-07-06',
    current_shift: 'Malam',
    requested_date: '2026-07-07',
    requested_shift: 'Pagi',
    reason: 'Urusan keluarga mendesak, orang tua dirawat di RS lain.',
    urgency: 'Tinggi',
    status: 'PENDING_KADIV',
    ai_suitability_score: 92,
    ai_recommendation: 'Approved',
    ai_constraint_message: 'Tidak ada pelanggaran hard constraints.',
    created_at: '2026-07-04 08:00:00',
    updated_at: '2026-07-04 08:00:00',
  },
  {
    request_id: 'SWAP-002',
    requester_id: 'D-002',
    requester_role: 'dokter',
    requester_name: 'dr. Siti Rahayu',
    department_name: 'Poli Anak',
    current_date: '2026-07-08',
    current_shift: 'Pagi',
    requested_date: '2026-07-09',
    requested_shift: 'Sore',
    reason: 'Jadwal seminar medis nasional yang tidak dapat diundur.',
    urgency: 'Sedang',
    status: 'PENDING_KADIV',
    ai_suitability_score: 45,
    ai_recommendation: 'Review',
    ai_constraint_message: 'Melanggar aturan istirahat 11 jam antar-shift.',
    created_at: '2026-07-04 09:15:00',
    updated_at: '2026-07-04 09:15:00',
  },
  {
    request_id: 'SWAP-003',
    requester_id: 'N-003',
    requester_role: 'perawat',
    requester_name: 'Ns. Andi Pratama',
    department_name: 'ICU',
    current_date: '2026-07-10',
    current_shift: 'Sore',
    requested_date: '2026-07-11',
    requested_shift: 'Pagi',
    reason: 'Anak sakit dan membutuhkan pendampingan ke dokter.',
    urgency: 'Tinggi',
    status: 'PENDING_KADIV',
    ai_suitability_score: 85,
    ai_recommendation: 'Approved',
    ai_constraint_message: 'Tidak ada pelanggaran hard constraints.',
    created_at: '2026-07-04 10:30:00',
    updated_at: '2026-07-04 10:30:00',
  },
  {
    request_id: 'SWAP-004',
    requester_id: 'N-005',
    requester_role: 'perawat',
    requester_name: 'Ns. Rina Susanti',
    department_name: 'Rawat Inap VIP',
    current_date: '2026-07-12',
    current_shift: 'Malam',
    requested_date: '2026-07-13',
    requested_shift: 'Malam',
    reason: 'Acara keagamaan keluarga besar yang sudah dijadwalkan.',
    urgency: 'Sedang',
    status: 'PENDING_ADMIN',
    ai_suitability_score: 20,
    ai_recommendation: 'Rejected',
    ai_constraint_message: 'Melebihi batas maksimal 2 shift malam beruntun.',
    kadiv_note: 'Sudah dikonfirmasi ada perawat pengganti. Disetujui untuk diteruskan.',
    kadiv_approved_at: '2026-07-05 10:00:00',
    created_at: '2026-07-04 11:45:00',
    updated_at: '2026-07-05 10:00:00',
  },
  {
    request_id: 'SWAP-005',
    requester_id: 'D-004',
    requester_role: 'dokter',
    requester_name: 'dr. Joko Widodo',
    department_name: 'Poli Penyakit Dalam',
    current_date: '2026-07-15',
    current_shift: 'Pagi',
    requested_date: '2026-07-16',
    requested_shift: 'Pagi',
    reason: 'Checkup kesehatan rutin tahunan.',
    urgency: 'Rendah',
    status: 'REJECTED',
    ai_suitability_score: 78,
    ai_recommendation: 'Review',
    ai_constraint_message: 'Membutuhkan konfirmasi ketersediaan dokter pengganti.',
    kadiv_note: 'Tidak ada dokter pengganti yang available pada tanggal tersebut. Mohon dijadwal ulang.',
    created_at: '2026-07-04 13:00:00',
    updated_at: '2026-07-05 11:00:00',
  },
  {
    request_id: 'SWAP-006',
    requester_id: 'N-006',
    requester_role: 'perawat',
    requester_name: 'Ns. Fitri Handayani',
    department_name: 'Isolasi',
    current_date: '2026-07-18',
    current_shift: 'Pagi',
    requested_date: '2026-07-18',
    requested_end_date: '2026-07-20',
    requested_shift: 'Cuti',
    reason: 'Cuti tahunan untuk liburan bersama keluarga.',
    urgency: 'Rendah',
    status: 'PENDING_KADIV',
    ai_suitability_score: 95,
    ai_recommendation: 'Approved',
    ai_constraint_message: 'Tidak ada pelanggaran, kuota cuti tahunan masih tersedia.',
    created_at: '2026-07-05 09:00:00',
    updated_at: '2026-07-05 09:00:00',
  },
  {
    request_id: 'SWAP-007',
    requester_id: 'D-003',
    requester_role: 'dokter',
    requester_name: 'dr. Hendra Gunawan',
    department_name: 'Bedah Umum',
    current_date: '2026-07-20',
    current_shift: 'Pagi',
    requested_date: '2026-07-21',
    requested_shift: 'Sore',
    reason: 'Prosedur operasi darurat yang tidak bisa ditunda digeser ke hari berikutnya.',
    urgency: 'Tinggi',
    status: 'PENDING_KADIV',
    ai_suitability_score: 88,
    ai_recommendation: 'Approved',
    ai_constraint_message: 'Kapasitas shift sore masih mencukupi.',
    created_at: '2026-07-06 07:30:00',
    updated_at: '2026-07-06 07:30:00',
  },
  {
    request_id: 'SWAP-008',
    requester_id: 'N-008',
    requester_role: 'perawat',
    requester_name: 'Ns. Dewi Lestari',
    department_name: 'Kamar Operasi',
    current_date: '2026-07-22',
    current_shift: 'Malam',
    requested_date: '2026-07-22',
    requested_end_date: '2026-07-25',
    requested_shift: 'Cuti',
    reason: 'Cuti melahirkan — sudah mendekati HPL.',
    urgency: 'Tinggi',
    status: 'PENDING_ADMIN',
    ai_suitability_score: 98,
    ai_recommendation: 'Approved',
    ai_constraint_message: 'Cuti melahirkan bersifat wajib sesuai regulasi.',
    kadiv_note: 'Disetujui penuh. Telah dikoordinasikan dengan tim OK untuk penggantian.',
    kadiv_approved_at: '2026-07-06 09:00:00',
    created_at: '2026-07-06 08:00:00',
    updated_at: '2026-07-06 09:00:00',
  },
  {
    request_id: 'SWAP-009',
    requester_id: 'N-002',
    requester_role: 'perawat',
    requester_name: 'Ns. Agus Setiawan',
    department_name: 'Rawat Inap Kelas 1',
    current_date: '2026-07-02',
    current_shift: 'Pagi',
    requested_date: '2026-07-03',
    requested_shift: 'Sore',
    reason: 'Keperluan administrasi kependudukan.',
    urgency: 'Rendah',
    status: 'Disetujui',
    ai_suitability_score: 80,
    ai_recommendation: 'Approved',
    ai_constraint_message: 'Tidak ada pelanggaran hard constraints.',
    kadiv_note: 'Disetujui.',
    kadiv_approved_at: '2026-07-02 10:00:00',
    admin_note: 'Approved. Jadwal sudah diperbarui di sistem.',
    created_at: '2026-07-01 14:00:00',
    updated_at: '2026-07-02 11:00:00',
  },
];
