/**
 * Mock notification data simulating a real campus notification feed.
 * In production this would be fetched from the backend API.
 */

import { Notification } from "./priorityScore";

const now = Date.now();
const hr = 3600_000;

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-001",
    title: "TCS NQT Drive – Register Now",
    body: "TCS National Qualifier Test registration is open for 2025 batch. Last date: 10th June.",
    category: "placement",
    timestamp: now - 0.5 * hr,
    isRead: false,
  },
  {
    id: "notif-002",
    title: "Infosys InfyTQ Campus Drive",
    body: "Infosys will be conducting an on-campus drive on 15th June. Eligible branches: CSE, ECE, IT.",
    category: "placement",
    timestamp: now - 2 * hr,
    isRead: false,
  },
  {
    id: "notif-003",
    title: "Semester End Exam Results Published",
    body: "Results for Semester VI have been published on the student portal. GPA letters will be dispatched by 30th May.",
    category: "result",
    timestamp: now - 1 * hr,
    isRead: false,
  },
  {
    id: "notif-004",
    title: "Hackathon 2025 – Team Registrations Open",
    body: "The annual inter-college hackathon is open for team registrations. Theme: AI for Social Good.",
    category: "event",
    timestamp: now - 3 * hr,
    isRead: false,
  },
  {
    id: "notif-005",
    title: "Wipro ELITE NLTH Drive",
    body: "Wipro is hiring for the ELITE NLTH program. Package: 3.5 LPA. Apply before 5th June.",
    category: "placement",
    timestamp: now - 5 * hr,
    isRead: false,
  },
  {
    id: "notif-006",
    title: "Internal Assessment Marks – CS401",
    body: "Marks for the Mid-Semester assessment of CS401 (Operating Systems) have been uploaded.",
    category: "result",
    timestamp: now - 6 * hr,
    isRead: false,
  },
  {
    id: "notif-007",
    title: "Alumni Networking Event",
    body: "The Alumni Association invites students for a networking session on 20th May at the Main Auditorium.",
    category: "event",
    timestamp: now - 8 * hr,
    isRead: false,
  },
  {
    id: "notif-008",
    title: "Accenture ASE Hiring – Batch 2025",
    body: "Accenture is recruiting for the ASE role. CTC: 4.5 LPA. Eligible: All branches with 60%+ aggregate.",
    category: "placement",
    timestamp: now - 10 * hr,
    isRead: false,
  },
  {
    id: "notif-009",
    title: "Cognizant GenC Spark Drive",
    body: "Cognizant is conducting campus recruitment for GenC Spark. Aptitude test on 18th May.",
    category: "placement",
    timestamp: now - 14 * hr,
    isRead: false,
  },
  {
    id: "notif-010",
    title: "Guest Lecture: Cloud Computing with AWS",
    body: "A guest lecture by an AWS Solutions Architect is scheduled for 22nd May, 2 PM in Seminar Hall B.",
    category: "event",
    timestamp: now - 18 * hr,
    isRead: false,
  },
  {
    id: "notif-011",
    title: "Capstone Project Evaluation Results",
    body: "Final year capstone project evaluation results have been declared. Check the notice board for details.",
    category: "result",
    timestamp: now - 20 * hr,
    isRead: false,
  },
  {
    id: "notif-012",
    title: "HCL Tech Bee Campus Recruitment",
    body: "HCL Technologies is recruiting freshers. Package: 3 LPA. Drive date: 25th May.",
    category: "placement",
    timestamp: now - 22 * hr,
    isRead: false,
  },
  {
    id: "notif-013",
    title: "Technical Fest – Technova 2025",
    body: "Annual technical fest Technova 2025 registrations are open. Events include coding, robotics, and UI design.",
    category: "event",
    timestamp: now - 30 * hr,
    isRead: false,
  },
  {
    id: "notif-014",
    title: "Lab Exam Results – CS Lab II",
    body: "Practical exam results for CS Lab II (DBMS Lab) have been published on the portal.",
    category: "result",
    timestamp: now - 36 * hr,
    isRead: false,
  },
  {
    id: "notif-015",
    title: "Amazon SDE Off-Campus Drive",
    body: "Amazon is conducting an off-campus drive for SDE-1 roles. Apply via the placement portal.",
    category: "placement",
    timestamp: now - 48 * hr,
    isRead: true, // already read - should not appear in priority inbox
  },
];
