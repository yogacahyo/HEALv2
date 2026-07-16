// ============================================================
// SIMRS Database Types — Based on actual database_schema.sql & database.sql
// ============================================================

// === Core Auth & Users ===
export interface User {
  user_id: number;
  username: string;
  password: string;
  role: 'admin' | 'dokter' | 'perawat' | 'apoteker' | 'kasir' | 'staff';
  created_at: string;
  updated_at: string;
}

// === Patients ===
export interface Patient {
  patient_id: number;
  registration_number: string;
  medical_record_number: string;
  first_name: string;
  last_name: string;
  full_name: string;
  birth_date: string;
  gender: 'L' | 'P';
  blood_type: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | null;
  marital_status: 'Belum Menikah' | 'Menikah' | 'Cerai Hidup' | 'Cerai Mati' | null;
  religion: string | null;
  occupation: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  emergency_contact: string | null;
  emergency_phone: string | null;
  insurance_id: number | null;
  insurance_number: string | null;
  insurance_type: 'BPJS' | 'Non-BPJS' | 'Umum' | null;
  created_at: string;
  updated_at: string;
}

// === Doctors ===
export interface Doctor {
  doctor_id: number;
  user_id: number | null;
  full_name: string;
  specialization: string | null;
  license_number: string | null;
}

// === Rooms ===
export interface Room {
  room_id: number;
  room_number: string;
  room_type: 'VIP' | 'Kelas 1' | 'Kelas 2' | 'Kelas 3' | 'IGD' | 'ICU' | 'NICU';
  floor: number | null;
  status: 'Available' | 'Occupied' | 'Maintenance';
  price: number;
}

// === Appointments ===
export interface Appointment {
  appointment_id: number;
  patient_id: number;
  doctor_id: number;
  appointment_date: string;
  appointment_time: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  queue_number: number | null;
}

// === Medical Records ===
export interface MedicalRecord {
  record_id: number;
  patient_id: number;
  doctor_id: number;
  visit_type: 'Rawat Jalan' | 'Rawat Inap' | 'IGD';
  visit_date: string;
  diagnosis: string | null;
  treatment: string | null;
  notes: string | null;
}

// === Registration ===
export interface Registration {
  registration_id: number;
  patient_id: number;
  registration_number: string;
  registration_type: 'Rawat Jalan' | 'Rawat Inap' | 'Gawat Darurat' | 'Penunjang';
  registration_date: string;
  doctor_id: number | null;
  department: string | null;
  bpjs_number: string | null;
  bpjs_status: 'Active' | 'Inactive' | 'Pending' | null;
  status: 'Active' | 'Completed' | 'Cancelled';
  notes: string | null;
}

// === Outpatient Visits ===
export interface OutpatientVisit {
  visit_id: number;
  patient_id: number;
  registration_id: number | null;
  visit_date: string;
  visit_type: 'First Visit' | 'Follow Up' | 'Emergency' | 'Routine Checkup';
  department_id: number;
  doctor_id: number;
  symptoms: string | null;
  diagnosis: string | null;
  treatment_plan: string | null;
  notes: string | null;
  status: 'Waiting' | 'In Progress' | 'Completed' | 'Cancelled';
  created_at: string;
  updated_at: string;
}

// === Patient Visits ===
export interface PatientVisit {
  visit_id: number;
  patient_id: number;
  visit_date: string;
  visit_type: 'First Visit' | 'Follow Up' | 'Emergency' | 'Routine Checkup';
  department_id: number;
  doctor_id: number;
  symptoms: string | null;
  diagnosis: string | null;
  treatment_plan: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// === Patient Measurements ===
export interface PatientMeasurement {
  measurement_id: number;
  visit_id: number;
  height: number | null;
  weight: number | null;
  blood_pressure: string | null;
  temperature: number | null;
  pulse_rate: number | null;
  respiratory_rate: number | null;
  oxygen_saturation: number | null;
  notes: string | null;
}

// === Queue Management ===
export interface QueueType {
  type_id: number;
  type_name: string;
  description: string | null;
  is_active: boolean;
}

export interface QueueCounter {
  counter_id: number;
  type_id: number;
  counter_name: string;
  is_active: boolean;
}

export interface QueueNumber {
  queue_id: number;
  type_id: number;
  counter_id: number | null;
  patient_id: number;
  queue_number: string;
  status: 'Waiting' | 'Called' | 'Served' | 'Cancelled';
  priority: 'Normal' | 'Priority' | 'Emergency';
  created_at: string;
  updated_at: string;
}

// === Doctor Schedules ===
export interface DoctorSchedule {
  schedule_id: number;
  doctor_id: number;
  day_of_week: number; // 0=Monday, 6=Sunday
  start_time: string;
  end_time: string;
  max_patients: number;
  is_active: boolean;
}

// === Doctor Queue Quotas ===
export interface DoctorQueueQuota {
  quota_id: number;
  doctor_id: number;
  date: string;
  max_patients: number;
  current_patients: number;
}

// === HR Module ===
export interface Department {
  department_id: number;
  department_name: string;
  description: string | null;
}

export interface Position {
  position_id: number;
  position_name: string;
  department_id: number;
  description: string | null;
  base_salary: number;
}

export interface Employee {
  employee_id: number;
  employee_number: string;
  first_name: string;
  last_name: string;
  position_id: number;
  hire_date: string;
  birth_date: string | null;
  gender: 'L' | 'P';
  address: string | null;
  phone: string | null;
  email: string | null;
  emergency_contact: string | null;
  emergency_phone: string | null;
  status: 'Active' | 'Inactive' | 'On Leave';
}

export interface Attendance {
  attendance_id: number;
  employee_id: number;
  date: string;
  check_in: string | null;
  check_out: string | null;
  status: 'Present' | 'Late' | 'Early Leave' | 'Absent';
  notes: string | null;
}

export interface LeaveType {
  type_id: number;
  type_name: string;
  description: string | null;
  paid: boolean;
}

export interface LeaveRequest {
  request_id: number;
  employee_id: number;
  leave_type_id: number;
  start_date: string;
  end_date: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approved_by: number | null;
  approval_date: string | null;
}

// === Billing ===
export interface Billing {
  bill_id: number;
  patient_id: number;
  visit_type: 'Rawat Jalan' | 'Rawat Inap' | 'IGD';
  bill_date: string;
  total_amount: number | null;
  payment_status: 'Pending' | 'Partial' | 'Paid';
  payment_method: 'Cash' | 'BPJS' | 'Insurance' | null;
}

export interface BillingDetail {
  bill_detail_id: number;
  bill_id: number;
  item_type: 'Consultation' | 'Medication' | 'Room' | 'Procedure' | 'Laboratory' | 'Radiology';
  item_name: string | null;
  quantity: number | null;
  unit_price: number | null;
  total_price: number | null;
}

// === Laboratory ===
export interface LaboratoryTest {
  test_id: number;
  name: string;
  category: string | null;
  price: number | null;
  turnaround_time: string | null;
}

export interface LaboratoryResult {
  result_id: number;
  medical_record_id: number;
  test_id: number;
  result_date: string;
  result_value: string | null;
  reference_range: string | null;
  status: 'Pending' | 'Completed' | 'Cancelled';
}

// === Radiology ===
export interface RadiologyTest {
  test_id: number;
  name: string;
  category: string | null;
  price: number | null;
  turnaround_time: string | null;
}

export interface RadiologyResult {
  result_id: number;
  medical_record_id: number;
  test_id: number;
  result_date: string;
  result_value: string | null;
  radiologist_id: number | null;
  status: 'Pending' | 'Completed' | 'Cancelled';
}

// === Clinical Notes ===
export interface SOAPNote {
  soap_id: number;
  visit_id: number;
  subjective: string | null;
  objective: string | null;
  assessment: string | null;
  plan: string | null;
  created_at: string;
  created_by: number | null;
}

export interface CPPT {
  cppt_id: number;
  visit_id: number;
  content: string | null;
  created_at: string;
  created_by: number | null;
}

export interface VerbalOrder {
  order_id: number;
  visit_id: number;
  order_type: 'Medication' | 'Procedure' | 'Laboratory' | 'Radiology' | 'Other';
  content: string | null;
  status: 'Pending' | 'Executed' | 'Cancelled';
  created_at: string;
  created_by: number | null;
  executed_at: string | null;
  executed_by: number | null;
}

// === Procedures & BMHP ===
export interface Procedure {
  procedure_id: number;
  name: string;
  description: string | null;
  price: number | null;
  category: string | null;
}

export interface VisitProcedure {
  visit_procedure_id: number;
  visit_id: number;
  procedure_id: number;
  quantity: number;
  notes: string | null;
}

export interface BMHP {
  bmhp_id: number;
  name: string;
  description: string | null;
  unit: string | null;
  price: number | null;
  stock: number;
}

export interface VisitBMHP {
  visit_bmhp_id: number;
  visit_id: number;
  bmhp_id: number;
  quantity: number;
  notes: string | null;
}

// === Prescriptions ===
export interface Prescription {
  prescription_id: number;
  visit_id: number;
  prescription_date: string;
  notes: string | null;
  status: 'Active' | 'Completed' | 'Cancelled';
}

export interface PrescriptionItem {
  item_id: number;
  prescription_id: number;
  item_code: string;
  item_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  notes: string | null;
}

// === Treatment ===
export interface TreatmentPlan {
  plan_id: number;
  visit_id: number;
  plan_type: string;
  description: string;
  start_date: string;
  end_date: string | null;
  status: 'Active' | 'Completed' | 'Cancelled';
}

export interface FollowUpAppointment {
  appointment_id: number;
  visit_id: number;
  patient_id: number;
  doctor_id: number;
  appointment_date: string;
  appointment_time: string;
  notes: string | null;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No Show';
}

// === Medical Records Module ===
export interface MedicalCondition {
  condition_id: number;
  patient_id: number;
  condition_name: string;
  diagnosis_date: string;
  notes: string | null;
}

export interface Allergy {
  allergy_id: number;
  patient_id: number;
  allergen: string;
  severity: 'Ringan' | 'Sedang' | 'Berat';
  notes: string | null;
}

export interface FamilyHistory {
  history_id: number;
  patient_id: number;
  relation: string;
  condition_name: string;
  onset_age: number | null;
  notes: string | null;
}

export interface MedicalDocument {
  document_id: number;
  patient_id: number;
  document_type: string;
  upload_date: string;
  file_path: string;
  description: string | null;
}

export interface MedicalExamination {
  examination_id: number;
  visit_id: number;
  examination_type: string;
  findings: string | null;
  notes: string | null;
}

// === Inventory ===
export interface Medication {
  medication_id: number;
  name: string;
  generic_name: string | null;
  category: string | null;
  unit: string | null;
  price: number | null;
  stock: number;
  minimum_stock: number;
}

export interface Inventory {
  item_id: number;
  name: string;
  category: string | null;
  unit: string | null;
  stock: number;
  minimum_stock: number;
  price: number | null;
}

export interface InventoryTransaction {
  transaction_id: number;
  item_id: number;
  transaction_type: 'In' | 'Out' | 'Adjustment';
  quantity: number;
  transaction_date: string;
  notes: string | null;
}

export interface Supplier {
  supplier_id: number;
  name: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
}

export interface Insurance {
  insurance_id: number;
  insurance_name: string;
  coverage_percentage: number;
  description: string | null;
}

export interface Service {
  service_id: number;
  service_name: string;
  price: number;
  description: string | null;
  category: string | null;
}

export interface Invoice {
  invoice_id: number;
  invoice_number: string;
  patient_id: number;
  invoice_date: string;
  subtotal: number;
  tax: number;
  insurance_coverage: number;
  total: number;
  status: 'Draft' | 'Pending' | 'Paid' | 'Overdue' | 'Cancelled';
}

export interface InvoiceItem {
  item_id: number;
  invoice_id: number;
  service_name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Payment {
  payment_id: number;
  invoice_id: number;
  payment_method: string;
  amount: number;
  payment_date: string;
  reference_number: string | null;
}

// ============================================================
// Simulation & Derived Types
// ============================================================

export type ShiftType = 'Pagi' | 'Sore' | 'Malam' | 'Off' | 'Cuti';

export interface ShiftSwapRequest {
  request_id: string;
  requester_id: string;
  requester_role: 'dokter' | 'perawat';
  requester_name?: string;
  department_name?: string;
  current_date: string;
  current_shift: ShiftType;
  requested_date: string;
  requested_end_date?: string; // Untuk Cuti rentang tanggal
  requested_shift: ShiftType;
  reason: string;
  urgency: 'Rendah' | 'Sedang' | 'Tinggi';
  /**
   * Two-tier approval status flow:
   * PENDING_KADIV → (Kadiv Approve) → PENDING_ADMIN → (Admin Approve) → Disetujui
   *                                                  → (Admin Reject) → Ditolak
   *              → (Kadiv Reject) → REJECTED
   * Legacy: 'Menunggu Persetujuan' = same as PENDING_ADMIN (Admin review stage)
   */
  status:
    | 'PENDING_KADIV'
    | 'PENDING_ADMIN'
    | 'REJECTED'
    | 'Menunggu Persetujuan'
    | 'Disetujui'
    | 'Ditolak'
    | 'Perlu Perbaikan';
  ai_suitability_score?: number;
  ai_recommendation?: 'Approved' | 'Review' | 'Rejected';
  ai_constraint_message?: string;
  kadiv_note?: string;          // Catatan Kepala Unit
  kadiv_approved_at?: string;   // Timestamp Kadiv approval
  admin_note?: string;
  created_at: string;
  updated_at: string;
}

export interface BurnoutAssessment {
  assessment_id: string;
  employee_id: number;
  date: string;
  shift: ShiftType;
  answers: boolean[]; // 7 Yes/No answers
  burnout_score: number;
  burnout_category: 'Rendah' | 'Sedang' | 'Tinggi';
  created_at: string;
}

export interface AttendanceSimulation {
  employee_id: number;
  date: string;
  check_in: string | null;
  check_out: string | null;
  status: 'Belum Absen' | 'Sudah Absen Masuk' | 'Shift Selesai' | 'Tidak Hadir' | 'Terlambat';
  burnout_completed: boolean;
}

export interface SimulationParameters {
  highCapacityPressureThreshold: number;
  criticalBorThreshold: number;
  highEmergencyQueueThreshold: number;
  highPatientLoadThreshold: number;
  lateAlertThreshold: number;
  absentAlertThreshold: number;
  nightScheduleStartHour: number;
  nightScheduleEndHour: number;
  burnoutHighRiskThreshold: number;
  burnoutMediumRiskThreshold: number;
}

export interface SmartAction {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  category: string;
  source: string;
  value?: number;
  threshold?: number;
}

export interface ForecastResult {
  date: string;
  predicted_patients: number;
  predicted_emergency: number;
  predicted_appointments: number;
  predicted_follow_ups: number;
  confidence: number;
}

export interface RosterEntry {
  employee_id: number;
  employee_name: string;
  role: 'dokter' | 'perawat';
  department: string;
  date: string;
  shift: ShiftType;
  start_time: string;
  end_time: string;
  is_leave: boolean;
  has_alert: boolean;
  alert_message?: string;
}

export interface StaffRecommendation {
  department: string;
  patient_load: number;
  emergency_load: number;
  doctor_capacity: number;
  current_patients: number;
  available_doctors: number;
  available_nurses: number;
  absent_staff: number;
  staffing_gap: number;
  priority: 'High' | 'Medium' | 'Low';
  recommendation: string;
}

export type DatasetSource = 'dummy' | 'uploaded_sql' | 'uploaded_csv' | 'uploaded_xlsx';

export interface SchemaHealth {
  total_tables: number;
  matched_tables: number;
  missing_tables: string[];
  extra_tables: string[];
  column_mismatches: Record<string, string[]>;
}
