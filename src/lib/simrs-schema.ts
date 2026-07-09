// ============================================================
// SIMRS Schema — Table and column definitions for validation
// ============================================================

export interface TableColumn {
  name: string;
  type: string;
  nullable: boolean;
  description: string;
}

export interface TableSchema {
  name: string;
  description: string;
  columns: TableColumn[];
  usedFor: {
    patientLoad: boolean;
    clinicalLoad: boolean;
    staffingSimulation: boolean;
    burnoutSimulation: boolean;
    executiveInsight: boolean;
  };
  privacyNote?: string;
}

export const SIMRS_TABLES: TableSchema[] = [
  {
    name: 'users',
    description: 'Tabel pengguna dan autentikasi sistem SIMRS',
    columns: [
      { name: 'user_id', type: 'INT', nullable: false, description: 'ID unik pengguna' },
      { name: 'username', type: 'VARCHAR(50)', nullable: false, description: 'Username login' },
      { name: 'password', type: 'VARCHAR(255)', nullable: false, description: 'Password terenkripsi' },
      { name: 'role', type: 'ENUM', nullable: false, description: 'Role: admin, dokter, perawat, apoteker, kasir, staff' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: true, description: 'Tanggal pembuatan' },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: true, description: 'Tanggal update terakhir' },
    ],
    usedFor: { patientLoad: false, clinicalLoad: false, staffingSimulation: true, burnoutSimulation: true, executiveInsight: true },
  },
  {
    name: 'patients',
    description: 'Data pasien — ditampilkan secara agregat tanpa informasi sensitif',
    columns: [
      { name: 'patient_id', type: 'INT', nullable: false, description: 'ID unik pasien' },
      { name: 'registration_number', type: 'VARCHAR(20)', nullable: false, description: 'Nomor registrasi' },
      { name: 'medical_record_number', type: 'VARCHAR(20)', nullable: true, description: 'Nomor rekam medis' },
      { name: 'full_name', type: 'VARCHAR(100)', nullable: false, description: 'Nama lengkap (tidak ditampilkan pada dashboard)' },
      { name: 'birth_date', type: 'DATE', nullable: false, description: 'Tanggal lahir' },
      { name: 'gender', type: 'ENUM', nullable: false, description: 'Jenis kelamin: L/P' },
      { name: 'blood_type', type: 'ENUM', nullable: true, description: 'Golongan darah' },
      { name: 'insurance_type', type: 'ENUM', nullable: true, description: 'Tipe asuransi: BPJS, Non-BPJS, Umum' },
      { name: 'insurance_number', type: 'VARCHAR(50)', nullable: true, description: 'Nomor asuransi' },
    ],
    usedFor: { patientLoad: true, clinicalLoad: true, staffingSimulation: false, burnoutSimulation: false, executiveInsight: true },
    privacyNote: 'Nama, alamat, telepon, email, dan emergency contact pasien tidak ditampilkan pada dashboard AI Shifting.',
  },
  {
    name: 'doctors',
    description: 'Data dokter yang terdaftar di SIMRS',
    columns: [
      { name: 'doctor_id', type: 'INT', nullable: false, description: 'ID unik dokter' },
      { name: 'user_id', type: 'INT', nullable: true, description: 'FK ke users' },
      { name: 'full_name', type: 'VARCHAR(100)', nullable: false, description: 'Nama lengkap dokter' },
      { name: 'specialization', type: 'VARCHAR(100)', nullable: true, description: 'Spesialisasi' },
      { name: 'license_number', type: 'VARCHAR(50)', nullable: true, description: 'Nomor SIP' },
    ],
    usedFor: { patientLoad: true, clinicalLoad: true, staffingSimulation: true, burnoutSimulation: true, executiveInsight: true },
  },
  {
    name: 'rooms',
    description: 'Data kamar dan ruangan rumah sakit',
    columns: [
      { name: 'room_id', type: 'INT', nullable: false, description: 'ID unik kamar' },
      { name: 'room_number', type: 'VARCHAR(20)', nullable: false, description: 'Nomor kamar' },
      { name: 'room_type', type: 'ENUM', nullable: false, description: 'Tipe: VIP, Kelas 1-3, IGD, ICU, NICU' },
      { name: 'floor', type: 'INT', nullable: true, description: 'Lantai' },
      { name: 'status', type: 'ENUM', nullable: false, description: 'Status: Available, Occupied, Maintenance' },
      { name: 'price', type: 'DECIMAL', nullable: false, description: 'Harga per malam' },
    ],
    usedFor: { patientLoad: true, clinicalLoad: false, staffingSimulation: false, burnoutSimulation: false, executiveInsight: true },
  },
  {
    name: 'appointments',
    description: 'Jadwal appointment pasien',
    columns: [
      { name: 'appointment_id', type: 'INT', nullable: false, description: 'ID unik appointment' },
      { name: 'patient_id', type: 'INT', nullable: false, description: 'FK ke patients' },
      { name: 'doctor_id', type: 'INT', nullable: false, description: 'FK ke doctors' },
      { name: 'appointment_date', type: 'DATE', nullable: false, description: 'Tanggal appointment' },
      { name: 'appointment_time', type: 'TIME', nullable: false, description: 'Waktu appointment' },
      { name: 'status', type: 'ENUM', nullable: false, description: 'Status: Scheduled, Completed, Cancelled' },
      { name: 'queue_number', type: 'INT', nullable: true, description: 'Nomor antrean' },
    ],
    usedFor: { patientLoad: true, clinicalLoad: true, staffingSimulation: true, burnoutSimulation: false, executiveInsight: true },
  },
  {
    name: 'medical_records',
    description: 'Rekam medis pasien',
    columns: [
      { name: 'record_id', type: 'INT', nullable: false, description: 'ID unik rekam medis' },
      { name: 'patient_id', type: 'INT', nullable: false, description: 'FK ke patients' },
      { name: 'doctor_id', type: 'INT', nullable: false, description: 'FK ke doctors' },
      { name: 'visit_type', type: 'ENUM', nullable: false, description: 'Tipe: Rawat Jalan, Rawat Inap, IGD' },
      { name: 'visit_date', type: 'TIMESTAMP', nullable: false, description: 'Tanggal kunjungan' },
      { name: 'diagnosis', type: 'TEXT', nullable: true, description: 'Diagnosis' },
      { name: 'treatment', type: 'TEXT', nullable: true, description: 'Tindakan' },
    ],
    usedFor: { patientLoad: true, clinicalLoad: true, staffingSimulation: false, burnoutSimulation: true, executiveInsight: true },
  },
  {
    name: 'registration',
    description: 'Data pendaftaran pasien',
    columns: [
      { name: 'registration_id', type: 'INT', nullable: false, description: 'ID unik pendaftaran' },
      { name: 'patient_id', type: 'INT', nullable: false, description: 'FK ke patients' },
      { name: 'registration_number', type: 'VARCHAR(20)', nullable: false, description: 'Nomor registrasi' },
      { name: 'registration_type', type: 'ENUM', nullable: false, description: 'Tipe: Rawat Jalan, Rawat Inap, Gawat Darurat, Penunjang' },
      { name: 'registration_date', type: 'TIMESTAMP', nullable: false, description: 'Tanggal registrasi' },
      { name: 'doctor_id', type: 'INT', nullable: true, description: 'FK ke doctors' },
      { name: 'department', type: 'VARCHAR(50)', nullable: true, description: 'Department tujuan' },
      { name: 'status', type: 'ENUM', nullable: false, description: 'Status: Active, Completed, Cancelled' },
    ],
    usedFor: { patientLoad: true, clinicalLoad: true, staffingSimulation: true, burnoutSimulation: true, executiveInsight: true },
  },
  {
    name: 'outpatient_visits',
    description: 'Data kunjungan rawat jalan',
    columns: [
      { name: 'visit_id', type: 'INT', nullable: false, description: 'ID unik kunjungan' },
      { name: 'patient_id', type: 'INT', nullable: false, description: 'FK ke patients' },
      { name: 'registration_id', type: 'INT', nullable: true, description: 'FK ke registration' },
      { name: 'visit_date', type: 'DATE', nullable: false, description: 'Tanggal kunjungan' },
      { name: 'visit_type', type: 'ENUM', nullable: false, description: 'Tipe kunjungan' },
      { name: 'department_id', type: 'INT', nullable: false, description: 'FK ke departments' },
      { name: 'doctor_id', type: 'INT', nullable: false, description: 'FK ke employees' },
      { name: 'status', type: 'ENUM', nullable: false, description: 'Status: Waiting, In Progress, Completed, Cancelled' },
    ],
    usedFor: { patientLoad: true, clinicalLoad: true, staffingSimulation: false, burnoutSimulation: false, executiveInsight: true },
  },
  {
    name: 'patient_visits',
    description: 'Data kunjungan pasien (modul pendaftaran)',
    columns: [
      { name: 'visit_id', type: 'INT', nullable: false, description: 'ID unik kunjungan' },
      { name: 'patient_id', type: 'INT', nullable: false, description: 'FK ke patients' },
      { name: 'visit_date', type: 'DATE', nullable: false, description: 'Tanggal kunjungan' },
      { name: 'visit_type', type: 'ENUM', nullable: false, description: 'Tipe kunjungan' },
      { name: 'department_id', type: 'INT', nullable: false, description: 'FK ke departments' },
      { name: 'doctor_id', type: 'INT', nullable: false, description: 'FK ke employees' },
    ],
    usedFor: { patientLoad: true, clinicalLoad: true, staffingSimulation: false, burnoutSimulation: false, executiveInsight: true },
  },
  {
    name: 'queue_numbers',
    description: 'Data antrean pasien',
    columns: [
      { name: 'queue_id', type: 'INT', nullable: false, description: 'ID unik antrean' },
      { name: 'type_id', type: 'INT', nullable: false, description: 'FK ke queue_types' },
      { name: 'counter_id', type: 'INT', nullable: true, description: 'FK ke queue_counters' },
      { name: 'patient_id', type: 'INT', nullable: false, description: 'FK ke patients' },
      { name: 'queue_number', type: 'VARCHAR(20)', nullable: false, description: 'Nomor antrean' },
      { name: 'status', type: 'ENUM', nullable: false, description: 'Status: Waiting, Called, Served, Cancelled' },
      { name: 'priority', type: 'ENUM', nullable: false, description: 'Prioritas: Normal, Priority, Emergency' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: true, description: 'Waktu pembuatan' },
    ],
    usedFor: { patientLoad: true, clinicalLoad: true, staffingSimulation: true, burnoutSimulation: true, executiveInsight: true },
  },
  {
    name: 'queue_types',
    description: 'Tipe antrean',
    columns: [
      { name: 'type_id', type: 'INT', nullable: false, description: 'ID unik tipe' },
      { name: 'type_name', type: 'VARCHAR(50)', nullable: false, description: 'Nama tipe antrean' },
      { name: 'description', type: 'TEXT', nullable: true, description: 'Deskripsi' },
      { name: 'is_active', type: 'BOOLEAN', nullable: false, description: 'Status aktif' },
    ],
    usedFor: { patientLoad: true, clinicalLoad: false, staffingSimulation: false, burnoutSimulation: false, executiveInsight: false },
  },
  {
    name: 'queue_counters',
    description: 'Counter/loket antrean',
    columns: [
      { name: 'counter_id', type: 'INT', nullable: false, description: 'ID unik counter' },
      { name: 'type_id', type: 'INT', nullable: false, description: 'FK ke queue_types' },
      { name: 'counter_name', type: 'VARCHAR(50)', nullable: false, description: 'Nama counter' },
      { name: 'is_active', type: 'BOOLEAN', nullable: false, description: 'Status aktif' },
    ],
    usedFor: { patientLoad: true, clinicalLoad: false, staffingSimulation: false, burnoutSimulation: false, executiveInsight: false },
  },
  {
    name: 'doctor_schedules',
    description: 'Jadwal praktik dokter (berbasis hari dalam seminggu)',
    columns: [
      { name: 'schedule_id', type: 'INT', nullable: false, description: 'ID unik jadwal' },
      { name: 'doctor_id', type: 'INT', nullable: false, description: 'FK ke employees' },
      { name: 'day_of_week', type: 'INT', nullable: false, description: 'Hari: 0=Senin, 6=Minggu' },
      { name: 'start_time', type: 'TIME', nullable: false, description: 'Jam mulai' },
      { name: 'end_time', type: 'TIME', nullable: false, description: 'Jam selesai' },
      { name: 'max_patients', type: 'INT', nullable: false, description: 'Maksimum pasien' },
      { name: 'is_active', type: 'BOOLEAN', nullable: false, description: 'Status aktif' },
    ],
    usedFor: { patientLoad: false, clinicalLoad: true, staffingSimulation: true, burnoutSimulation: true, executiveInsight: true },
  },
  {
    name: 'doctor_queue_quotas',
    description: 'Kuota harian pasien per dokter',
    columns: [
      { name: 'quota_id', type: 'INT', nullable: false, description: 'ID unik kuota' },
      { name: 'doctor_id', type: 'INT', nullable: false, description: 'FK ke employees' },
      { name: 'date', type: 'DATE', nullable: false, description: 'Tanggal' },
      { name: 'max_patients', type: 'INT', nullable: false, description: 'Maksimum pasien' },
      { name: 'current_patients', type: 'INT', nullable: false, description: 'Jumlah pasien saat ini' },
    ],
    usedFor: { patientLoad: true, clinicalLoad: true, staffingSimulation: true, burnoutSimulation: true, executiveInsight: true },
  },
  {
    name: 'departments',
    description: 'Data departemen rumah sakit',
    columns: [
      { name: 'department_id', type: 'INT', nullable: false, description: 'ID unik departemen' },
      { name: 'department_name', type: 'VARCHAR(100)', nullable: false, description: 'Nama departemen' },
      { name: 'description', type: 'TEXT', nullable: true, description: 'Deskripsi' },
    ],
    usedFor: { patientLoad: true, clinicalLoad: true, staffingSimulation: true, burnoutSimulation: true, executiveInsight: true },
  },
  {
    name: 'positions',
    description: 'Data jabatan/posisi',
    columns: [
      { name: 'position_id', type: 'INT', nullable: false, description: 'ID unik posisi' },
      { name: 'position_name', type: 'VARCHAR(100)', nullable: false, description: 'Nama posisi' },
      { name: 'department_id', type: 'INT', nullable: false, description: 'FK ke departments' },
      { name: 'description', type: 'TEXT', nullable: true, description: 'Deskripsi' },
      { name: 'base_salary', type: 'DECIMAL', nullable: false, description: 'Gaji pokok' },
    ],
    usedFor: { patientLoad: false, clinicalLoad: false, staffingSimulation: true, burnoutSimulation: true, executiveInsight: true },
  },
  {
    name: 'employees',
    description: 'Data pegawai rumah sakit',
    columns: [
      { name: 'employee_id', type: 'INT', nullable: false, description: 'ID unik pegawai' },
      { name: 'employee_number', type: 'VARCHAR(20)', nullable: false, description: 'Nomor pegawai' },
      { name: 'first_name', type: 'VARCHAR(50)', nullable: false, description: 'Nama depan' },
      { name: 'last_name', type: 'VARCHAR(50)', nullable: false, description: 'Nama belakang' },
      { name: 'position_id', type: 'INT', nullable: false, description: 'FK ke positions' },
      { name: 'hire_date', type: 'DATE', nullable: false, description: 'Tanggal mulai kerja' },
      { name: 'gender', type: 'ENUM', nullable: false, description: 'Jenis kelamin: L/P' },
      { name: 'status', type: 'ENUM', nullable: false, description: 'Status: Active, Inactive, On Leave' },
    ],
    usedFor: { patientLoad: false, clinicalLoad: false, staffingSimulation: true, burnoutSimulation: true, executiveInsight: true },
    privacyNote: 'Alamat, telepon, email, dan emergency contact pegawai tidak ditampilkan pada dashboard publik.',
  },
  {
    name: 'attendance',
    description: 'Data absensi pegawai',
    columns: [
      { name: 'attendance_id', type: 'INT', nullable: false, description: 'ID unik absensi' },
      { name: 'employee_id', type: 'INT', nullable: false, description: 'FK ke employees' },
      { name: 'date', type: 'DATE', nullable: false, description: 'Tanggal' },
      { name: 'check_in', type: 'TIME', nullable: true, description: 'Jam masuk' },
      { name: 'check_out', type: 'TIME', nullable: true, description: 'Jam keluar' },
      { name: 'status', type: 'ENUM', nullable: false, description: 'Status: Present, Late, Early Leave, Absent' },
    ],
    usedFor: { patientLoad: false, clinicalLoad: false, staffingSimulation: true, burnoutSimulation: true, executiveInsight: true },
  },
  {
    name: 'leave_types',
    description: 'Tipe cuti yang tersedia',
    columns: [
      { name: 'type_id', type: 'INT', nullable: false, description: 'ID unik tipe cuti' },
      { name: 'type_name', type: 'VARCHAR(50)', nullable: false, description: 'Nama tipe cuti' },
      { name: 'description', type: 'TEXT', nullable: true, description: 'Deskripsi' },
      { name: 'paid', type: 'BOOLEAN', nullable: false, description: 'Apakah cuti berbayar' },
    ],
    usedFor: { patientLoad: false, clinicalLoad: false, staffingSimulation: true, burnoutSimulation: false, executiveInsight: false },
  },
  {
    name: 'leave_requests',
    description: 'Pengajuan cuti pegawai',
    columns: [
      { name: 'request_id', type: 'INT', nullable: false, description: 'ID unik pengajuan' },
      { name: 'employee_id', type: 'INT', nullable: false, description: 'FK ke employees' },
      { name: 'leave_type_id', type: 'INT', nullable: false, description: 'FK ke leave_types' },
      { name: 'start_date', type: 'DATE', nullable: false, description: 'Tanggal mulai' },
      { name: 'end_date', type: 'DATE', nullable: false, description: 'Tanggal selesai' },
      { name: 'reason', type: 'TEXT', nullable: false, description: 'Alasan cuti' },
      { name: 'status', type: 'ENUM', nullable: false, description: 'Status: Pending, Approved, Rejected' },
    ],
    usedFor: { patientLoad: false, clinicalLoad: false, staffingSimulation: true, burnoutSimulation: true, executiveInsight: true },
  },
  {
    name: 'billing',
    description: 'Data tagihan pasien',
    columns: [
      { name: 'bill_id', type: 'INT', nullable: false, description: 'ID unik tagihan' },
      { name: 'patient_id', type: 'INT', nullable: false, description: 'FK ke patients' },
      { name: 'visit_type', type: 'ENUM', nullable: false, description: 'Tipe kunjungan' },
      { name: 'bill_date', type: 'TIMESTAMP', nullable: false, description: 'Tanggal tagihan' },
      { name: 'total_amount', type: 'DECIMAL', nullable: true, description: 'Total tagihan' },
      { name: 'payment_status', type: 'ENUM', nullable: false, description: 'Status pembayaran' },
      { name: 'payment_method', type: 'ENUM', nullable: true, description: 'Metode pembayaran' },
    ],
    usedFor: { patientLoad: false, clinicalLoad: false, staffingSimulation: false, burnoutSimulation: false, executiveInsight: true },
  },
  {
    name: 'billing_details',
    description: 'Detail item tagihan',
    columns: [
      { name: 'bill_detail_id', type: 'INT', nullable: false, description: 'ID unik detail' },
      { name: 'bill_id', type: 'INT', nullable: false, description: 'FK ke billing' },
      { name: 'item_type', type: 'ENUM', nullable: false, description: 'Tipe item' },
      { name: 'item_name', type: 'VARCHAR(100)', nullable: true, description: 'Nama item' },
      { name: 'quantity', type: 'INT', nullable: true, description: 'Jumlah' },
      { name: 'unit_price', type: 'DECIMAL', nullable: true, description: 'Harga satuan' },
      { name: 'total_price', type: 'DECIMAL', nullable: true, description: 'Total harga' },
    ],
    usedFor: { patientLoad: false, clinicalLoad: false, staffingSimulation: false, burnoutSimulation: false, executiveInsight: true },
  },
  {
    name: 'laboratory_results',
    description: 'Hasil pemeriksaan laboratorium',
    columns: [
      { name: 'result_id', type: 'INT', nullable: false, description: 'ID unik hasil' },
      { name: 'medical_record_id', type: 'INT', nullable: false, description: 'FK ke medical_records' },
      { name: 'test_id', type: 'INT', nullable: false, description: 'FK ke laboratory_tests' },
      { name: 'result_date', type: 'TIMESTAMP', nullable: false, description: 'Tanggal hasil' },
      { name: 'status', type: 'ENUM', nullable: false, description: 'Status: Pending, Completed, Cancelled' },
    ],
    usedFor: { patientLoad: false, clinicalLoad: true, staffingSimulation: false, burnoutSimulation: false, executiveInsight: true },
  },
  {
    name: 'radiology_results',
    description: 'Hasil pemeriksaan radiologi',
    columns: [
      { name: 'result_id', type: 'INT', nullable: false, description: 'ID unik hasil' },
      { name: 'medical_record_id', type: 'INT', nullable: false, description: 'FK ke medical_records' },
      { name: 'test_id', type: 'INT', nullable: false, description: 'FK ke radiology_tests' },
      { name: 'result_date', type: 'TIMESTAMP', nullable: false, description: 'Tanggal hasil' },
      { name: 'status', type: 'ENUM', nullable: false, description: 'Status: Pending, Completed, Cancelled' },
    ],
    usedFor: { patientLoad: false, clinicalLoad: true, staffingSimulation: false, burnoutSimulation: false, executiveInsight: true },
  },
  {
    name: 'procedures',
    description: 'Daftar tindakan medis',
    columns: [
      { name: 'procedure_id', type: 'INT', nullable: false, description: 'ID unik tindakan' },
      { name: 'name', type: 'VARCHAR(100)', nullable: false, description: 'Nama tindakan' },
      { name: 'price', type: 'DECIMAL', nullable: true, description: 'Harga' },
      { name: 'category', type: 'VARCHAR(50)', nullable: true, description: 'Kategori' },
    ],
    usedFor: { patientLoad: false, clinicalLoad: true, staffingSimulation: false, burnoutSimulation: false, executiveInsight: false },
  },
  {
    name: 'visit_procedures',
    description: 'Tindakan per kunjungan',
    columns: [
      { name: 'visit_procedure_id', type: 'INT', nullable: false, description: 'ID unik' },
      { name: 'visit_id', type: 'INT', nullable: false, description: 'FK ke outpatient_visits' },
      { name: 'procedure_id', type: 'INT', nullable: false, description: 'FK ke procedures' },
      { name: 'quantity', type: 'INT', nullable: false, description: 'Jumlah' },
    ],
    usedFor: { patientLoad: false, clinicalLoad: true, staffingSimulation: false, burnoutSimulation: false, executiveInsight: false },
  },
  {
    name: 'bmhp',
    description: 'Barang Medis Habis Pakai',
    columns: [
      { name: 'bmhp_id', type: 'INT', nullable: false, description: 'ID unik BMHP' },
      { name: 'name', type: 'VARCHAR(100)', nullable: false, description: 'Nama BMHP' },
      { name: 'unit', type: 'VARCHAR(20)', nullable: true, description: 'Satuan' },
      { name: 'price', type: 'DECIMAL', nullable: true, description: 'Harga' },
      { name: 'stock', type: 'INT', nullable: false, description: 'Stok' },
    ],
    usedFor: { patientLoad: false, clinicalLoad: false, staffingSimulation: false, burnoutSimulation: false, executiveInsight: false },
  },
  {
    name: 'visit_bmhp',
    description: 'BMHP per kunjungan',
    columns: [
      { name: 'visit_bmhp_id', type: 'INT', nullable: false, description: 'ID unik' },
      { name: 'visit_id', type: 'INT', nullable: false, description: 'FK ke outpatient_visits' },
      { name: 'bmhp_id', type: 'INT', nullable: false, description: 'FK ke bmhp' },
      { name: 'quantity', type: 'INT', nullable: false, description: 'Jumlah' },
    ],
    usedFor: { patientLoad: false, clinicalLoad: false, staffingSimulation: false, burnoutSimulation: false, executiveInsight: false },
  },
  {
    name: 'soap_notes',
    description: 'Catatan SOAP (Subjective, Objective, Assessment, Plan)',
    columns: [
      { name: 'soap_id', type: 'INT', nullable: false, description: 'ID unik SOAP' },
      { name: 'visit_id', type: 'INT', nullable: false, description: 'FK ke outpatient_visits' },
      { name: 'subjective', type: 'TEXT', nullable: true, description: 'Keluhan subjektif' },
      { name: 'objective', type: 'TEXT', nullable: true, description: 'Temuan objektif' },
      { name: 'assessment', type: 'TEXT', nullable: true, description: 'Penilaian' },
      { name: 'plan', type: 'TEXT', nullable: true, description: 'Rencana' },
      { name: 'created_by', type: 'INT', nullable: true, description: 'FK ke users' },
    ],
    usedFor: { patientLoad: false, clinicalLoad: true, staffingSimulation: false, burnoutSimulation: false, executiveInsight: false },
  },
  {
    name: 'cppt',
    description: 'Catatan Perkembangan Pasien Terintegrasi',
    columns: [
      { name: 'cppt_id', type: 'INT', nullable: false, description: 'ID unik CPPT' },
      { name: 'visit_id', type: 'INT', nullable: false, description: 'FK ke outpatient_visits' },
      { name: 'content', type: 'TEXT', nullable: true, description: 'Isi catatan' },
      { name: 'created_by', type: 'INT', nullable: true, description: 'FK ke users' },
    ],
    usedFor: { patientLoad: false, clinicalLoad: true, staffingSimulation: false, burnoutSimulation: false, executiveInsight: false },
  },
  {
    name: 'verbal_orders',
    description: 'Instruksi verbal dokter',
    columns: [
      { name: 'order_id', type: 'INT', nullable: false, description: 'ID unik instruksi' },
      { name: 'visit_id', type: 'INT', nullable: false, description: 'FK ke outpatient_visits' },
      { name: 'order_type', type: 'ENUM', nullable: false, description: 'Tipe: Medication, Procedure, Lab, Radiology, Other' },
      { name: 'content', type: 'TEXT', nullable: true, description: 'Isi instruksi' },
      { name: 'status', type: 'ENUM', nullable: false, description: 'Status: Pending, Executed, Cancelled' },
    ],
    usedFor: { patientLoad: false, clinicalLoad: true, staffingSimulation: false, burnoutSimulation: false, executiveInsight: false },
  },
  {
    name: 'follow_up_appointments',
    description: 'Jadwal kontrol ulang',
    columns: [
      { name: 'appointment_id', type: 'INT', nullable: false, description: 'ID unik' },
      { name: 'visit_id', type: 'INT', nullable: false, description: 'FK ke outpatient_visits' },
      { name: 'patient_id', type: 'INT', nullable: false, description: 'FK ke patients' },
      { name: 'doctor_id', type: 'INT', nullable: false, description: 'FK ke employees' },
      { name: 'appointment_date', type: 'DATE', nullable: false, description: 'Tanggal kontrol' },
      { name: 'appointment_time', type: 'TIME', nullable: false, description: 'Waktu kontrol' },
      { name: 'status', type: 'ENUM', nullable: false, description: 'Status' },
    ],
    usedFor: { patientLoad: true, clinicalLoad: true, staffingSimulation: false, burnoutSimulation: false, executiveInsight: true },
  },
  {
    name: 'invoices',
    description: 'Data invoice/faktur',
    columns: [
      { name: 'invoice_id', type: 'INT', nullable: false, description: 'ID unik invoice' },
      { name: 'invoice_number', type: 'VARCHAR(20)', nullable: false, description: 'Nomor invoice' },
      { name: 'patient_id', type: 'INT', nullable: false, description: 'FK ke patients' },
      { name: 'total', type: 'DECIMAL', nullable: false, description: 'Total invoice' },
      { name: 'status', type: 'ENUM', nullable: false, description: 'Status invoice' },
    ],
    usedFor: { patientLoad: false, clinicalLoad: false, staffingSimulation: false, burnoutSimulation: false, executiveInsight: true },
  },
  {
    name: 'payments',
    description: 'Data pembayaran',
    columns: [
      { name: 'payment_id', type: 'INT', nullable: false, description: 'ID unik pembayaran' },
      { name: 'invoice_id', type: 'INT', nullable: false, description: 'FK ke invoices' },
      { name: 'payment_method', type: 'VARCHAR(50)', nullable: false, description: 'Metode pembayaran' },
      { name: 'amount', type: 'DECIMAL', nullable: false, description: 'Jumlah pembayaran' },
      { name: 'payment_date', type: 'DATE', nullable: false, description: 'Tanggal pembayaran' },
    ],
    usedFor: { patientLoad: false, clinicalLoad: false, staffingSimulation: false, burnoutSimulation: false, executiveInsight: true },
  },
];

export const SIMRS_TABLE_NAMES = SIMRS_TABLES.map((t) => t.name);

export function validateTableName(name: string): boolean {
  return SIMRS_TABLE_NAMES.includes(name.toLowerCase());
}

export function getTableSchema(name: string): TableSchema | undefined {
  return SIMRS_TABLES.find((t) => t.name === name.toLowerCase());
}
