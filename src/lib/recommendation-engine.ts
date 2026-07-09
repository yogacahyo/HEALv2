// ============================================================
// Recommendation Engine — Dynamic staffing recommendations from SIMRS data
// ============================================================

import type { Registration, QueueNumber, DoctorQueueQuota, Employee, Position, Department, Attendance, Room, StaffRecommendation } from './types';
import { getDoctors, getNurses, calculateBOR } from './simrs-calculations';

/** Generate staffing recommendations per department */
export function generateRecommendations(params: {
  registrations: Registration[];
  queues: QueueNumber[];
  quotas: DoctorQueueQuota[];
  employees: Employee[];
  positions: Position[];
  departments: Department[];
  attendance: Attendance[];
  rooms: Room[];
}): StaffRecommendation[] {
  const { registrations, queues, quotas, employees, positions, departments, attendance, rooms } = params;
  const today = new Date().toISOString().split('T')[0];
  const recommendations: StaffRecommendation[] = [];

  // Clinical departments only
  const clinicalDepts = departments.filter((d) =>
    d.department_name.includes('Poli') || d.department_name === 'IGD'
  );

  for (const dept of clinicalDepts) {
    // Patient load from registrations
    const deptRegs = registrations.filter(
      (r) => r.department === dept.department_name && r.status === 'Active'
    );
    const patientLoad = deptRegs.length;

    // Emergency load
    const emergencyLoad = deptRegs.filter((r) => r.registration_type === 'Gawat Darurat').length +
      queues.filter((q) => q.priority === 'Emergency' && q.status === 'Waiting').length;

    // Doctor capacity in this department
    const deptPositions = positions.filter((p) => p.department_id === dept.department_id);
    const deptEmployees = employees.filter((e) =>
      deptPositions.some((p) => p.position_id === e.position_id) && e.status === 'Active'
    );
    const deptDoctors = deptEmployees.filter((e) => {
      const pos = positions.find((p) => p.position_id === e.position_id);
      return pos && pos.position_name.toLowerCase().includes('doctor');
    });
    const deptNurses = deptEmployees.filter((e) => {
      const pos = positions.find((p) => p.position_id === e.position_id);
      return pos && pos.position_name.toLowerCase().includes('perawat');
    });

    // Capacity utilization
    const deptQuotas = quotas.filter((q) =>
      deptDoctors.some((d) => d.employee_id === q.doctor_id)
    );
    const totalCurrent = deptQuotas.reduce((sum, q) => sum + q.current_patients, 0);
    const totalMax = deptQuotas.reduce((sum, q) => sum + q.max_patients, 0);
    const doctorCapacity = totalMax > 0 ? totalCurrent / totalMax : 0;

    // Absent staff
    const todayAttendance = attendance.filter((a) => a.date === today);
    const absentStaff = deptEmployees.filter((e) => {
      const att = todayAttendance.find((a) => a.employee_id === e.employee_id);
      return !att || att.status === 'Absent';
    }).length;

    // Available staff
    const presentDoctors = deptDoctors.filter((e) => {
      const att = todayAttendance.find((a) => a.employee_id === e.employee_id);
      return att && att.status !== 'Absent';
    }).length;
    const presentNurses = deptNurses.filter((e) => {
      const att = todayAttendance.find((a) => a.employee_id === e.employee_id);
      return att && att.status !== 'Absent';
    }).length;

    // Staffing gap
    const requiredDoctors = Math.ceil(patientLoad / 10);
    const requiredNurses = Math.ceil(patientLoad / 6);
    const staffingGap = Math.max(0, requiredDoctors - presentDoctors) + Math.max(0, requiredNurses - presentNurses);

    // Priority
    let priority: 'High' | 'Medium' | 'Low' = 'Low';
    let recommendation = 'Kondisi masih dalam batas simulasi aman.';

    if (emergencyLoad > 0 || doctorCapacity > 0.85) {
      priority = 'High';
      if (emergencyLoad > 0) {
        recommendation = `Tambahkan dokter jaga pada ${dept.department_name} dengan antrean Emergency tinggi.`;
      }
      if (doctorCapacity > 0.85) {
        recommendation = `Kurangi beban dokter dengan current_patients mendekati max_patients di ${dept.department_name}.`;
      }
    } else if (patientLoad > 3 || absentStaff > 0) {
      priority = 'Medium';
      if (absentStaff > 0) {
        recommendation = `Tinjau ulang jadwal tenaga medis dengan status Late atau Absent berulang di ${dept.department_name}.`;
      } else {
        recommendation = `Prioritaskan dokter dan perawat aktif pada ${dept.department_name} dengan beban pasien meningkat.`;
      }
    }

    recommendations.push({
      department: dept.department_name,
      patient_load: patientLoad,
      emergency_load: emergencyLoad,
      doctor_capacity: Math.round(doctorCapacity * 100),
      current_patients: totalCurrent,
      available_doctors: presentDoctors,
      available_nurses: presentNurses,
      absent_staff: absentStaff,
      staffing_gap: staffingGap,
      priority,
      recommendation,
    });
  }

  // Sort by priority
  const priorityOrder = { High: 0, Medium: 1, Low: 2 };
  return recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}
