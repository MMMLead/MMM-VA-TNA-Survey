import { Role, Section, SurveySchema, ClientSurveySchema, SupportSurveySchema, FullSurveySchema } from "./types";

export const TASK_EXPERIENCE_COLUMNS = [
  "No experience",
  "Exposure only (observed or assisted)",
  "Basic experience (can perform with guidance)",
  "Moderate experience (can perform independently)",
  "Advanced experience (can perform confidently and handle complex scenarios)",
];

export const TASK_WORKFLOW_COLUMNS = ["NA", "1", "2", "3", "4"];
export const TASK_WORKFLOW_LEGEND = "Legend:\nNA – Not Applicable / Not part of my role\n1 – Very Difficult – I often struggle and need help\n2 – Difficult – I can do it but sometimes need support\n3 – Manageable – I can perform the task independently\n4 – Easy – I can perform the task quickly and confidently";

export const EXPERIENCE_OPTIONS = [
  "Not Applicable / Current BCT Trainee",
  "No prior Business VA experience",
  "Less than 1 year",
  "1–2 years",
  "3–4 years",
  "5+ years",
];

export const TRAINING_PREFERENCES = [
  "Live webinar",
  "Self-paced video modules",
  "Written guides/manuals",
  "One-on-one coaching",
  "Group workshops",
  "Interactive simulations",
];

export const WORKLOAD_OPTIONS = [
  "Very light",
  "Manageable",
  "Busy but manageable",
  "Overloaded",
  "Consistently overwhelmed",
];

const getCommunicationSection = (role: Role): Section => ({
  id: `${role}-communication-skills`,
  title: "Part IV - Communication Skills",
  questions: [
    {
      id: "comm_difficulty_grid",
      type: "grid",
      label: "How easy or difficult is it for you to perform the following tasks in your role?",
      description: TASK_WORKFLOW_LEGEND,
      rows: [
        "Handling client calls → Clear and professional verbal communication",
        "Responding to client emails/messages → Timely and accurate written communication",
        "Posting updates on group chats / team channels → Effective team communication and coordination",
        "Preparing and submitting reports → Clear reporting and information sharing",
        "Managing appointment scheduling & changes → Accurate coordination of schedules and expectations",
        "Updating documentation & records accurately → Reliable and clear documentation for workflow continuity"
      ],
      columns: TASK_WORKFLOW_COLUMNS,
      required: true,
    },
    {
      id: "verbal_comm_confidence",
      type: "radio",
      label: "How confident are you that clients or patients clearly understand you when you speak?",
      options: [
        "Very confident – I am easily understood",
        "Confident – Minor repetition may sometimes be needed",
        "Somewhat confident – I occasionally worry about accent or clarity",
        "Not confident – I often feel misunderstood"
      ],
      required: true,
    }
  ]
});

const getAISection = (role: Role): Section => ({
  id: `${role}-ai-essentials`,
  title: "Part V - AI Essentials",
  questions: [
    {
      id: "ai_automation_level",
      type: "radio",
      label: "How much of your current workflow involves the use of AI tools?",
      options: [
        "None – My work is mostly manual",
        "A little – I occasionally use AI to assist with tasks",
        "Moderate – AI helps with several parts of my workflow",
        "A lot – AI is integrated into many of my tasks"
      ],
      required: true,
    },
    {
      id: "ai_tool_proficiency",
      type: "grid",
      label: "How comfortable are you using the following AI tools in your work?",
      description: "Legend:\nNA – Not applicable / I do not use this\n1 – Not comfortable – I need guidance to use it\n2 – Somewhat comfortable – I can use it with occasional help\n3 – Comfortable – I can use it independently\n4 – Very comfortable – I can use it efficiently and creatively",
      rows: [
        "Generative AI (e.g., ChatGPT, Claude, Gemini)",
        "Healthcare-specific AI / EMR systems (e.g., Dentrix, Epic, Athenahealth)",
        "Data analysis & reporting tools with AI (e.g., Excel / Sheets AI features, dashboards)",
        "Task & workflow automation AI (e.g., scheduling bots, reminders)"
      ],
      columns: ["NA", "1", "2", "3", "4"],
      required: true,
    },
    {
      id: "ai_usage_areas",
      type: "checkbox",
      label: "In which areas do you currently use AI the most? (Select all that apply)",
      options: [
        "Writing or drafting emails/messages",
        "Summarizing notes or documentation",
        "Research or information lookup",
        "Data analysis or reporting",
        "Task automation or workflow support",
        "Organizing information or documentation",
        "I currently do not use AI tools"
      ],
      required: true,
    },
    {
      id: "ai_skills_to_learn",
      type: "checkbox",
      label: "What AI-related skills would you like to learn to improve your work? (Select all that apply)",
      options: [
        "Writing emails or messages faster with AI",
        "Summarizing patient/client notes",
        "Automating repetitive tasks",
        "Creating reports using AI tools",
        "Workflow automation",
        "Prompt writing / prompting techniques",
        "Other"
      ],
      optionsWithInputs: ["Other"],
      required: true,
    }
  ]
});

const getVASectionVI = (role: string): Section => ({
  id: `${role.toLowerCase().replace(/ /g, '-')}-readiness-preferences`,
  title: "Part VI - VA Learning Preferences & Role Readiness",
  questions: [
    {
      id: `${role.toLowerCase().replace(/ /g, '_')}_upskilling_interest`,
      type: "radio",
      label: "1. Would you be interested in participating in a VA Upskilling Program if it were offered by MMM?",
      options: [
        "Yes – I would definitely join",
        "Maybe – depends on the format or time commitment",
        "No – I don’t think I would join"
      ],
      required: true,
    },
    {
      id: `${role.toLowerCase().replace(/ /g, '_')}_upskilling_no_reason`,
      type: "textarea",
      label: "If no, why not:",
      dependsOn: `${role.toLowerCase().replace(/ /g, '_')}_upskilling_interest`,
      dependsOnValue: "No – I don’t think I would join",
      required: false,
    },
    {
      id: `${role.toLowerCase().replace(/ /g, '_')}_program_incentives`,
      type: "checkbox",
      label: "2. What would make this program a “no-brainer” for you to join? (Select top 2)",
      options: [
        "A certificate or credential after completing the program",
        "Training focused on real VA tasks and workflows",
        "Learning tools and systems used by clients (EMR, CRM, AI tools)",
        "Opportunities to qualify for better clients or higher-level roles",
        "Flexible or self-paced training schedule",
        "Other"
      ],
      optionsWithInputs: ["Other"],
      maxSelections: 2,
      required: true,
    },
    {
      id: `${role.toLowerCase().replace(/ /g, '_')}_time_commitment`,
      type: "radio",
      label: "3. How much time per week can you realistically commit to training?",
      options: ["1–2 hours", "3–5 hours", "5+ hours", "Other"],
      optionsWithInputs: ["Other"],
      required: true,
    },
    {
      id: `${role.toLowerCase().replace(/ /g, '_')}_training_format_preference`,
      type: "checkbox",
      label: "4. What type of training format would help you the most? (Select up to 2)",
      options: [
        "Step-by-step walkthroughs of real VA tasks",
        "Real-world scenarios or case studies",
        "Practice exercises or simulations",
        "Video lessons you can watch anytime",
        "Live coaching or Q&A sessions",
        "Other"
      ],
      optionsWithInputs: ["Other"],
      maxSelections: 2,
      required: true,
    },
    {
      id: `${role.toLowerCase().replace(/ /g, '_')}_role_readiness`,
      type: "radio",
      label: "5. Do you feel fully prepared to handle a Medical VA role today?",
      options: [
        "Yes – I feel fully confident",
        "Somewhat – I can perform most tasks but still need guidance in some areas",
        "No – I feel I still need more preparation or training"
      ],
      required: true,
    },
    {
      id: `${role.toLowerCase().replace(/ /g, '_')}_missing_skills_for_confidence`,
      type: "checkbox",
      label: "6. What do you feel is missing before you can confidently perform at a high level as a VA?",
      options: [
        "Communication with clients and teams",
        "Understanding client instructions and requirements",
        "Medical or dental workflow knowledge",
        "Documentation, reporting, or attention to detail",
        "Time management and task prioritization",
        "AI tools or digital tools used for work",
        "Confidence in handling client interactions",
        "Other"
      ],
      optionsWithInputs: ["Other"],
      required: true,
    }
  ]
});

const getDesiredImprovementsQuestion = (roleId: string) => ({
  id: `${roleId}_desired_improvements`,
  type: "checkbox" as const,
  label: "What skills would your client like you to improve or further develop? (Select up to 3)",
  options: [
    "Communication with clients and/or patients (calls, emails, messaging)",
    "Understanding and following instructions accurately",
    "Medical/dental workflow knowledge (e.g., insurance, scheduling, coordination)",
    "Attention to detail in documentation and reporting",
    "Time management and task prioritization",
    "Use of tools and systems (EMR, CRM, scheduling tools, etc.)",
    "AI or digital tool usage (e.g., ChatGPT, automation tools)",
    "Proactiveness and ownership of tasks",
    "Confidence in handling client interactions independently",
    "Problem-solving and critical thinking",
    "Other"
  ],
  optionsWithInputs: ["Other"],
  maxSelections: 3,
  required: true,
});

const getMedicalReceptionistSections = (): Section[] => {
  const role: Role = "Medical Receptionist";

  return [
    {
      id: `${role}-background`,
      title: "Background & Experience",
      description: `Tell us about your professional background and the environment you work in as a ${role}.`,
      questions: [
        {
          id: "experience_type",
          type: "radio",
          label: "What type of experience do you have?",
          options: [
            "BPO experience",
            "Direct Client / Independent VA (working directly with U.S. providers or practices)",
            "Mixed experience (combination of the above)",
            "First time VA",
          ],
          required: true,
        },
        {
          id: "practice_types",
          type: "checkbox",
          label: "What type of practices do you support? (Select all that apply)",
          options: [
            "Primary Care",
            "Specialty Clinics (Cardio, Ortho, etc.)",
            "Behavioral Health",
            "Urgent Care",
            "Telehealth",
            "Multi-specialty",
            "Other",
          ],
          optionsWithInputs: ["Other"],
          required: true,
        },
        {
          id: "software_tools",
          type: "checkbox",
          label: "Which software or tools do you use regularly? (Select all that apply)",
          options: [
            "Athenahealth",
            "Kareo / Tebra",
            "AdvancedMD",
            "eClinicalWorks",
            "NextGen",
            "Epic",
            "Availity / Clearinghouses",
            "Dentrix",
            "Eaglesoft",
            "Open Dental",
            "Other",
          ],
          optionsWithInputs: ["Other"],
          required: true,
        },
      ],
    },
    {
      id: `${role}-tasks-workflow`,
      title: "Part II - Tasks and Workflow",
      description: `How easy or difficult is it for you to complete the following tasks in your role?\n\n${TASK_WORKFLOW_LEGEND}`,
      questions: [
        {
          id: "task_grid",
          type: "grid",
          label: "How easy or difficult is it for you to complete the following tasks in your role?",
          rows: [
            "Appointment scheduling → Booking and managing appointments",
            "Patient calls and inquiries → Answering calls and assisting patients",
            "Insurance verification → Checking eligibility and benefits",
            "Patient intake → Collecting and entering patient information",
            "Appointment reminders & follow-ups → Confirmations and recalls",
            "Data entry / record updates → Updating patient information",
            "Payment collection → Collecting co-pays and payments",
            "Referral coordination → Sending and tracking referrals",
            "Medical records handling → Managing records and requests",
            "Team coordination → Communicating with providers and staff"
          ],
          columns: TASK_WORKFLOW_COLUMNS,
          required: true,
        },
        {
          id: "time_consuming_tasks",
          type: "checkbox",
          label: "Which tasks take the most time or effort in your workflow? (Select up to 3)",
          options: [
            "Appointment scheduling → Managing bookings and changes",
            "Patient calls and inquiries → Handling high call volume",
            "Insurance verification → Checking coverage and benefits",
            "Patient intake → Entering patient details",
            "Appointment reminders & follow-ups → Managing confirmations",
            "Managing no-shows → Tracking and rescheduling patients",
            "Data entry / updates → Maintaining accurate records",
            "Payment collection → Processing patient payments",
            "Referral coordination → Managing referrals",
            "Medical records handling → Processing records requests",
            "Team coordination → Communicating with staff",
            "Other"
          ],
          optionsWithInputs: ["Other"],
          maxSelections: 3,
          required: true,
        },
      ],
    },
    {
      id: `${role}-training-needs`,
      title: "Part III – Competencies / Skills",
      description: "Which skills or topics would help you perform your role more effectively if you received additional training? (Select the areas where you feel additional support or learning would help you the most.)",
      questions: [
        {
          id: "competencies_skills",
          type: "checkbox",
          label: "Core Skills",
          options: [
            "Professional Call Handling & Patient Communication",
            "Appointment Scheduling & Calendar Management",
            "Managing Cancellations, No-Shows & Same-Day Changes",
            "Patient Intake & Accurate Data Entry",
            "Medical Records Handling & HIPAA Compliance",
            "Internal Communication & Task Coordination",
            "Other"
          ],
          optionsWithInputs: ["Other"],
          required: true,
        },
        {
          id: "specialized_skills",
          type: "checkbox",
          label: "Specialized Skills",
          options: [
            "Insurance Verification (Eligibility & Benefits Breakdown)",
            "Patient Financial Communication (Copay, Deductible, OOP Costs)",
            "Pre-Authorizations & Referral Coordination",
            "EMR/EHR Navigation & Workflow Efficiency",
            "Handling Billing Inquiries & Front Desk Support in RCM",
            "Other"
          ],
          optionsWithInputs: ["Other"],
          required: true,
        },
      ],
    },
    getCommunicationSection(role),
    getAISection(role),
    {
      id: `${role}-final`,
      title: "Final Open Feedback",
      description: `Your final thoughts on how we can better support your success in the ${role} role.`,
      questions: [
        {
          id: "biggest_challenge",
          type: "textarea",
          label: "What is your biggest challenge in your current role?",
          required: true,
        },
        {
          id: "skill_improvement",
          type: "textarea",
          label: "If you could improve one skill right now, what would it be and why?",
          required: true,
        },
      ],
    },
  ];
};

const getMedicalAdminSections = (): Section[] => {
  const role: Role = "Medical Administrative Assistant";

  return [
    {
      id: `${role}-background`,
      title: "Background & Experience",
      description: `Tell us about your professional background and the environment you work in as a ${role}.`,
      questions: [
        {
          id: "experience_type",
          type: "radio",
          label: "What type of experience do you have?",
          options: [
            "BPO experience",
            "Direct Client / Independent VA (working directly with U.S. providers or practices)",
            "Mixed experience (combination of the above)",
            "First time VA",
          ],
          required: true,
        },
        {
          id: "practice_types",
          type: "checkbox",
          label: "What type of practices do you support? (Select all that apply)",
          options: [
            "Primary Care",
            "Specialty Clinics (Cardio, Ortho, etc.)",
            "Behavioral Health",
            "Urgent Care",
            "Telehealth",
            "Multi-specialty",
            "Other",
          ],
          optionsWithInputs: ["Other"],
          required: true,
        },
        {
          id: "software_tools",
          type: "checkbox",
          label: "Which software or tools do you use regularly? (Select all that apply)",
          options: [
            "Athenahealth",
            "Kareo / Tebra",
            "AdvancedMD",
            "eClinicalWorks",
            "NextGen",
            "Epic",
            "Availity / Clearinghouses",
            "Dentrix",
            "Eaglesoft",
            "Open Dental",
            "Other",
          ],
          optionsWithInputs: ["Other"],
          required: true,
        },
      ],
    },
    {
      id: `${role}-tasks-workflow`,
      title: "Part II – Tasks and Workflow",
      description: `How easy or difficult is it for you to complete the following tasks in your role?\n\n${TASK_WORKFLOW_LEGEND}`,
      questions: [
        {
          id: "task_grid",
          type: "grid",
          label: "How easy or difficult is it for you to complete the following tasks in your role?",
          rows: [
            "Inbox/email management → Managing emails and communication",
            "Scheduling & coordination → Organizing meetings, calendars, tasks",
            "Patient coordination → Communicating with patients for updates",
            "Insurance support → Assisting with verification and follow-ups",
            "Billing support → Collecting co-pays, handling invoices, and basic reconciliations",
            "Documentation & reports → Preparing reports and records",
            "Data entry / system updates → Maintaining accurate information",
            "Medical records handling → Managing files and documentation",
            "Prior authorization support → Assisting with authorization requests",
            "Team coordination → Supporting internal workflow"
          ],
          columns: TASK_WORKFLOW_COLUMNS,
          required: true,
        },
        {
          id: "time_consuming_tasks",
          type: "checkbox",
          label: "Which tasks take the most time or effort in your workflow? (Select up to 3)",
          options: [
            "Appointment scheduling → Managing bookings and changes",
            "Patient calls and inquiries → Handling high call volume",
            "Insurance verification → Checking coverage and benefits",
            "Patient intake → Entering patient details",
            "Appointment reminders & follow-ups → Managing confirmations",
            "Managing no-shows → Tracking and rescheduling patients",
            "Data entry / updates → Maintaining accurate records",
            "Payment collection → Processing patient payments",
            "Referral coordination → Managing referrals",
            "Medical records handling → Processing records requests",
            "Team coordination → Communicating with staff",
            "Other"
          ],
          optionsWithInputs: ["Other"],
          maxSelections: 3,
          required: true,
        },
      ],
    },
    {
      id: `${role}-training-needs`,
      title: "Part III – Competencies / Skills",
      description: "Which skills or topics would help you perform your role more effectively if you received additional training? (Select the areas where you feel additional support or learning would help you the most.)",
      questions: [
        {
          id: "competencies_skills",
          type: "checkbox",
          label: "Core Skills",
          options: [
            "Inbox & Email Management (Prioritization, Routing, Follow-Ups)",
            "Calendar Management & Provider Coordination",
            "Document Handling & File Organization (Accuracy & Compliance)",
            "Task Management & Follow-Up Tracking",
            "Professional Written & Internal Communication",
            "Meeting Coordination & Basic Minutes Documentation",
            "Other"
          ],
          optionsWithInputs: ["Other"],
          required: true,
        },
        {
          id: "specialized_skills",
          type: "checkbox",
          label: "Specialized Skills",
          options: [
            "Insurance Verification & Benefits Review (Admin-Level Support)",
            "Prior Authorizations (Submission, Tracking & Follow-Up)",
            "Medical Records Requests (ROI) & Documentation Processing",
            "Referral Coordination & Specialist Scheduling",
            "Basic Billing Support (Copays, Statements, Patient Inquiries)",
            "Form Processing (FMLA, Disability, Medical Forms)",
            "EMR/EHR Navigation & Workflow Management",
            "Supporting Provider Workflow (Pre-visit Prep & Task Queues)",
            "Other"
          ],
          optionsWithInputs: ["Other"],
          required: true,
        },
      ],
    },
    getCommunicationSection(role),
    getAISection(role),
    {
      id: `${role}-final`,
      title: "Final Open Feedback",
      description: `Your final thoughts on how we can better support your success in the ${role} role.`,
      questions: [
        {
          id: "biggest_challenge",
          type: "textarea",
          label: "What is your biggest challenge in your current role?",
          required: true,
        },
        {
          id: "skill_improvement",
          type: "textarea",
          label: "If you could improve one skill right now, what would it be and why?",
          required: true,
        },
      ],
    },
  ];
};

const getMedicalBillerSections = (): Section[] => {
  const role: Role = "Medical Biller";

  return [
    {
      id: `${role}-background`,
      title: "Background & Experience",
      description: `Tell us about your professional background and the environment you work in as a ${role}.`,
      questions: [
        {
          id: "experience_type",
          type: "radio",
          label: "What type of experience do you have?",
          options: [
            "BPO experience",
            "Direct Client / Independent VA (working directly with U.S. providers or practices)",
            "Mixed experience (combination of the above)",
            "First time VA",
          ],
          required: true,
        },
        {
          id: "practice_types",
          type: "checkbox",
          label: "What type of practices do you support? (Select all that apply)",
          options: [
            "Primary Care",
            "Specialty Clinics (Cardio, Ortho, etc.)",
            "Behavioral Health",
            "Urgent Care",
            "Telehealth",
            "Multi-specialty",
            "Other",
          ],
          optionsWithInputs: ["Other"],
          required: true,
        },
        {
          id: "software_tools",
          type: "checkbox",
          label: "Which software or tools do you use regularly? (Select all that apply)",
          options: [
            "Athenahealth",
            "Kareo / Tebra",
            "AdvancedMD",
            "eClinicalWorks",
            "NextGen",
            "Epic",
            "Availity / Clearinghouses",
            "Dentrix",
            "Eaglesoft",
            "Open Dental",
            "Other",
          ],
          optionsWithInputs: ["Other"],
          required: true,
        },
      ],
    },
    {
      id: `${role}-tasks-workflow`,
      title: "Part II – Tasks and Workflow",
      description: `How easy or difficult is it for you to complete the following tasks in your role?\n\n${TASK_WORKFLOW_LEGEND}`,
      questions: [
        {
          id: "task_grid",
          type: "grid",
          label: "How easy or difficult is it for you to complete the following tasks in your role?",
          rows: [
            "Charge Entry & Coding Accuracy → Entering CPT, ICD-10, modifiers; ensuring documentation supports billed services",
            "Insurance Verification (Billing-Focused) → Validating coverage, payer requirements, and billing-related eligibility before claim submission",
            "Pre-Billing Review / Claim Scrubbing → Reviewing claims for errors (coding, demographics, modifiers) prior to submission",
            "Claim Creation & Submission → Submitting claims via clearinghouse (CMS 1500 / UB-04)",
            "Clearinghouse Rejection Handling → Correcting and resubmitting claims that failed at the clearinghouse level",
            "Payer Portal Navigation & Claim Tracking → Monitoring claim status via Availity and payer portals",
            "Payment Posting & Reconciliation → Posting EOB/ERA payments and identifying underpayments",
            "Denial Management & Appeals → Resolving denials and submitting formal appeals",
            "AR Follow-Up & Aging Management → Following up on unpaid claims and managing aging buckets (30/60/90+)",
            "Patient Billing & Financial Communication → Managing statements, explaining balances, and OOP costs",
            "Billing Reports & KPI Tracking → Tracking collection rates, denial trends, and financial performance"
          ],
          columns: TASK_WORKFLOW_COLUMNS,
          required: true,
        },
        {
          id: "time_consuming_tasks",
          type: "checkbox",
          label: "Which tasks take the most time or effort in your workflow? (Select up to 3)",
          options: [
            "Charge Entry & Coding Accuracy",
            "Insurance Verification (Billing-Focused)",
            "Pre-Billing Review / Claim Scrubbing",
            "Claim Creation & Submission",
            "Clearinghouse Rejection Handling",
            "Payer Portal Navigation & Claim Tracking",
            "Payment Posting & Reconciliation",
            "Denial Management & Appeals",
            "AR Follow-Up & Aging Management",
            "Patient Billing & Financial Communication",
            "Billing Reports & KPI Tracking",
            "Other"
          ],
          optionsWithInputs: ["Other"],
          maxSelections: 3,
          required: true,
        },
      ],
    },
    {
      id: `${role}-training-needs`,
      title: "Part III – Competencies / Skills",
      description: "Which skills or topics would help you perform your role more effectively if you received additional training? (Select the areas where you feel additional support or learning would help you the most.)",
      questions: [
        {
          id: "competencies_skills",
          type: "checkbox",
          label: "Core Skills",
          options: [
            "Charge Entry Accuracy & Documentation Review",
            "Medical Coding Basics (CPT, ICD-10, Modifiers)",
            "Medical Terminology for Billing & Coding Accuracy",
            "Claim Submission & Clearinghouse Workflow",
            "Payment Posting (EOB/ERA Interpretation)",
            "AR Follow-Up Fundamentals (Aging Buckets & Prioritization)",
            "Denial Identification & Basic Resolution",
            "Other"
          ],
          optionsWithInputs: ["Other"],
          required: true,
        },
        {
          id: "specialized_skills",
          type: "checkbox",
          label: "Specialized Skills",
          options: [
            "Advanced Denial Management & Appeals Process",
            "AR Recovery Strategies (Reducing 60–90+ Day AR)",
            "Insurance Verification for Billing Accuracy",
            "Prior Authorizations & Medical Necessity Checks",
            "Patient Billing & Financial Communication",
            "Payer-Specific Workflows (Medicare, Medicaid, Commercial)",
            "EMR/PM & Clearinghouse Navigation (End-to-End Billing Flow)",
            "Reporting & KPI Tracking (Collections, Denial Trends, AR Analysis)",
            "Other"
          ],
          optionsWithInputs: ["Other"],
          required: true,
        },
      ],
    },
    getCommunicationSection(role),
    getAISection(role),
    {
      id: `${role}-final`,
      title: "Final Open Feedback",
      description: `Your final thoughts on how we can better support your success in the ${role} role.`,
      questions: [
        {
          id: "biggest_challenge",
          type: "textarea",
          label: "What is your biggest challenge in your current role?",
          required: true,
        },
        {
          id: "skill_improvement",
          type: "textarea",
          label: "If you could improve one skill right now, what would it be and why?",
          required: true,
        },
      ],
    },
  ];
};

const getMedicalScribeSections = (): Section[] => {
  const role: Role = "Medical Scribe";

  return [
    {
      id: `${role}-background`,
      title: "Background & Experience",
      description: `Tell us about your professional background and the environment you work in as a ${role}.`,
      questions: [
        {
          id: "experience_type",
          type: "radio",
          label: "What type of experience do you have?",
          options: [
            "BPO experience",
            "Direct Client / Independent VA (working directly with U.S. providers or practices)",
            "Mixed experience (combination of the above)",
            "First time VA",
          ],
          required: true,
        },
        {
          id: "practice_types",
          type: "checkbox",
          label: "What type of practices do you support? (Select all that apply)",
          options: [
            "Primary Care",
            "Specialty Clinics (Cardio, Ortho, etc.)",
            "Behavioral Health",
            "Urgent Care",
            "Telehealth",
            "Multi-specialty",
            "Other",
          ],
          optionsWithInputs: ["Other"],
          required: true,
        },
        {
          id: "software_tools",
          type: "checkbox",
          label: "Which software or tools do you use regularly? (Select all that apply)",
          options: [
            "Athenahealth",
            "Kareo / Tebra",
            "AdvancedMD",
            "eClinicalWorks",
            "NextGen",
            "Epic",
            "Availity / Clearinghouses",
            "Dentrix",
            "Eaglesoft",
            "Open Dental",
            "Other",
          ],
          optionsWithInputs: ["Other"],
          required: true,
        },
      ],
    },
    {
      id: `${role}-tasks-workflow`,
      title: "Part II – Tasks and Workflow",
      description: `How easy or difficult is it for you to complete the following tasks in your role?\n\n${TASK_WORKFLOW_LEGEND}`,
      questions: [
        {
          id: "task_grid",
          type: "grid",
          label: "How easy or difficult is it for you to complete the following tasks in your role?",
          rows: [
            "Pre-Charting & Chart Setup → Reviewing history, notes, meds, and preparing templates",
            "Real-Time Scribing & Transcription → Documenting visits and converting audio to notes",
            "Clinical Note Structuring & Terminology → Accurate HPI, ROS, PE, A&P with proper medical terms",
            "Active Listening & Information Filtering → Capturing relevant details during encounters",
            "Chart Completion, Editing & TAT → Finalizing, proofreading, and completing notes on time",
            "Order Entry & Task Management → Supporting labs, imaging, prescriptions, and EMR tasks",
            "Care Coordination Support → Communicating follow-ups with clinical team",
            "HIPAA & Documentation Standards → Ensuring privacy, accuracy, and provider-specific formatting"
          ],
          columns: TASK_WORKFLOW_COLUMNS,
          required: true,
        },
        {
          id: "time_consuming_tasks",
          type: "checkbox",
          label: "Which tasks take the most time or effort in your workflow? (Select up to 3)",
          options: [
            "Accurate Real-Time Scribing (Live Documentation) → Reduces provider documentation burden during visits",
            "Medical Transcription Accuracy & Turnaround Time → Ensures timely and precise conversion of dictations into billable notes",
            "Documentation Accuracy (HPI, A&P, Clinical Details) → Critical for compliance, billing, and patient safety",
            "Chart Completion & Turnaround Time (TAT) → Enables faster billing and continuity of care",
            "Pre-Charting & Chart Readiness → Improves visit efficiency and provider preparedness",
            "Medical Terminology & Structured Note Writing → Ensures professional, compliant, and readable documentation",
            "Order Entry & Clinical Task Support → Prevents missed orders and improves workflow",
            "EMR Task & Alert Management → Ensures follow-ups and clinical actions are completed",
            "Compliance & HIPAA Adherence → Protects patient data and reduces legal risk",
            "Other"
          ],
          optionsWithInputs: ["Other"],
          maxSelections: 3,
          required: true,
        },
      ],
    },
    {
      id: `${role}-training-needs`,
      title: "Part III – Competencies / Skills",
      description: "Which skills or topics would help you perform your role more effectively if you received additional training? (Select the areas where you feel additional support or learning would help you the most.)",
      questions: [
        {
          id: "competencies_skills",
          type: "checkbox",
          label: "Core Skills",
          options: [
            "Live Scribing & Real-Time Documentation Accuracy",
            "Medical Terminology & Clinical Abbreviations",
            "Charting Structure & Note Completion (HPI, ROS, PE, A&P)",
            "Pre-Charting & Post-Visit Documentation Workflow",
            "EMR/EHR Navigation & Templates",
            "Provider Communication & Workflow Support",
            "Other"
          ],
          optionsWithInputs: ["Other"],
          required: true,
        },
        {
          id: "specialized_skills",
          type: "checkbox",
          label: "Specialized Skills",
          options: [
            "Advanced Chart Review & Clinical Data Extraction",
            "Order Entry Support (Labs, Imaging, Prescriptions)",
            "Care Coordination & Task/Follow-Up Management",
            "Documentation Compliance & Legal Accuracy (HIPAA)",
            "Specialty-Specific Scribing (e.g., Primary Care, Cardiology, Ortho)",
            "Other"
          ],
          optionsWithInputs: ["Other"],
          required: true,
        },
      ],
    },
    getCommunicationSection(role),
    getAISection(role),
    {
      id: `${role}-final`,
      title: "Final Open Feedback",
      description: `Your final thoughts on how we can better support your success in the ${role} role.`,
      questions: [
        {
          id: "biggest_challenge",
          type: "textarea",
          label: "What is your biggest challenge in your current role?",
          required: true,
        },
        {
          id: "skill_improvement",
          type: "textarea",
          label: "If you could improve one skill right now, what would it be and why?",
          required: true,
        },
      ],
    },
  ];
};

const getHealthEducatorSections = (): Section[] => {
  const role: Role = "Health Educator";

  return [
    {
      id: `${role}-background`,
      title: "Background & Experience",
      description: `Tell us about your professional background and the environment you work in as a ${role}.`,
      questions: [
        {
          id: "experience_type",
          type: "radio",
          label: "What type of experience do you have?",
          options: [
            "BPO experience",
            "Direct Client / Independent VA (working directly with U.S. providers or practices)",
            "Mixed experience (combination of the above)",
            "First time VA",
          ],
          required: true,
        },
        {
          id: "practice_types",
          type: "checkbox",
          label: "What type of practices do you support? (Select all that apply)",
          options: [
            "Primary Care",
            "Specialty Clinics (Cardio, Ortho, etc.)",
            "Behavioral Health",
            "Urgent Care",
            "Telehealth",
            "Multi-specialty",
            "Other",
          ],
          optionsWithInputs: ["Other"],
          required: true,
        },
        {
          id: "software_tools",
          type: "checkbox",
          label: "Which software or tools do you use regularly? (Select all that apply)",
          options: [
            "Athenahealth",
            "Kareo / Tebra",
            "AdvancedMD",
            "eClinicalWorks",
            "NextGen",
            "Epic",
            "Availity / Clearinghouses",
            "Dentrix",
            "Eaglesoft",
            "Open Dental",
            "Other",
          ],
          optionsWithInputs: ["Other"],
          required: true,
        },
      ],
    },
    {
      id: `${role}-tasks-workflow`,
      title: "Part II – Tasks and Workflow",
      description: `How easy or difficult is it for you to complete the following tasks in your role?\n\n${TASK_WORKFLOW_LEGEND}`,
      questions: [
        {
          id: "task_grid",
          type: "grid",
          label: "How easy or difficult is it for you to complete the following tasks in your role?",
          rows: [
            "Patient Education & Health Coaching → Explaining care plans and supporting lifestyle changes",
            "Motivational Support & Engagement → Encouraging adherence and building patient trust",
            "Follow-Ups & Patient Support → Monitoring progress, addressing concerns, escalating when needed",
            "Care Plan Reinforcement & Documentation → Simplifying recommendations and documenting interactions",
            "Care Coordination & Appointment Management → Communicating with care team and scheduling follow-ups",
            "Progress Tracking, Reporting & Intake Support → Monitoring outcomes, updating reports, assisting with screenings",
            "Education Delivery & Risk Escalation → Sharing resources and identifying/escalating patient risks"
          ],
          columns: TASK_WORKFLOW_COLUMNS,
          required: true,
        },
        {
          id: "time_consuming_tasks",
          type: "checkbox",
          label: "Which tasks take the most time or effort in your workflow? (Select up to 3)",
          options: [
            "Patient Education Delivery (Clear & Effective Communication) → Core driver of patient understanding and program value",
            "Patient Engagement & Follow-Ups → Directly impacts retention, adherence, and outcomes",
            "Health Coaching & Behavior Change Support → Drives measurable lifestyle improvements",
            "Documentation Accuracy & Progress Tracking → Ensures continuity of care and program evaluation",
            "Care Plan Reinforcement → Improves adherence to provider recommendations",
            "Coordination with Clinical Team → Prevents gaps in care and improves patient experience",
            "Program Reporting & Outcome Tracking → Supports business insights and client reporting",
            "Other"
          ],
          optionsWithInputs: ["Other"],
          maxSelections: 3,
          required: true,
        },
      ],
    },
    {
      id: `${role}-training-needs`,
      title: "Part III – Competencies / Skills",
      description: "Which skills or topics would help you perform your role more effectively if you received additional training? (Select the areas where you feel additional support or learning would help you the most.)",
      questions: [
        {
          id: "competencies_skills",
          type: "checkbox",
          label: "Core Skills",
          options: [
            "Patient Education & Health Coaching Communication",
            "Lifestyle Coaching (Nutrition, Sleep, Exercise)",
            "Care Plan Support, Goal Setting & Progress Tracking",
            "Patient Engagement & Follow-Up Communication",
            "Documentation & EMR/EHR Updates",
            "Program Coordination & Scheduling",
            "Other"
          ],
          optionsWithInputs: ["Other"],
          required: true,
        },
        {
          id: "specialized_skills",
          type: "checkbox",
          label: "Specialized Skills",
          options: [
            "Behavior Change Techniques & Motivational Interviewing",
            "Chronic Condition Education (e.g., Diabetes, Hypertension)",
            "Personalized Care Planning & Risk Stratification",
            "Patient Compliance Monitoring & Outcome Tracking",
            "Health Program Delivery & Resource Coordination",
            "Other"
          ],
          optionsWithInputs: ["Other"],
          required: true,
        },
      ],
    },
    getCommunicationSection(role),
    getAISection(role),
    {
      id: `${role}-final`,
      title: "Final Open Feedback",
      description: `Your final thoughts on how we can better support your success in the ${role} role.`,
      questions: [
        {
          id: "biggest_challenge",
          type: "textarea",
          label: "What is your biggest challenge in your current role?",
          required: true,
        },
        {
          id: "skill_improvement",
          type: "textarea",
          label: "If you could improve one skill right now, what would it be and why?",
          required: true,
        },
      ],
    },
  ];
};

const getDentalReceptionistSections = (): Section[] => {
  const role: Role = "Dental Receptionist";

  return [
    {
      id: `${role}-background`,
      title: "Background & Experience",
      description: `Tell us about your professional background and the environment you work in as a ${role}.`,
      questions: [
        {
          id: "experience_type",
          type: "radio",
          label: "What type of experience do you have?",
          options: [
            "BPO experience",
            "Direct Client / Independent VA (working directly with U.S. providers or practices)",
            "Mixed experience (combination of the above)",
            "First time VA",
          ],
          required: true,
        },
        {
          id: "practice_types",
          type: "checkbox",
          label: "What type of practices do you support? (Select all that apply)",
          options: [
            "General Dentistry",
            "Orthodontics",
            "Periodontics",
            "Endodontics",
            "Oral Surgery",
            "Pediatric Dentistry",
            "Other",
          ],
          optionsWithInputs: ["Other"],
          required: true,
        },
        {
          id: "software_tools",
          type: "checkbox",
          label: "Which software or tools do you use regularly? (Select all that apply)",
          options: [
            "Dentrix",
            "Eaglesoft",
            "Open Dental",
            "Curve Dental",
            "SoftDent",
            "PracticeWeb",
            "Other",
          ],
          optionsWithInputs: ["Other"],
          required: true,
        },
      ],
    },
    {
      id: `${role}-tasks-workflow`,
      title: "Part II – Tasks and Workflow",
      description: `How easy or difficult is it for you to complete the following tasks in your role?\n\n${TASK_WORKFLOW_LEGEND}`,
      questions: [
        {
          id: "task_grid",
          type: "grid",
          label: "How easy or difficult is it for you to complete the following tasks in your role?",
          rows: [
            "Scheduling, Calendar Optimization & Rescheduling → Managing bookings, provider schedules, and minimizing gaps/no-shows",
            "Call Handling, Patient Intake & Expectations → Managing calls, registering patients, and explaining next steps",
            "Payment Collection & Posting Support → Collecting copays, balances, and recording payments",
            "Pre-Authorizations (if applicable) → Submitting and following up on approvals",
            "Basic Ledger Review → Understanding patient balances and transactions",
            "Chart Review & Document Management → Maintaining accurate patient records and treatment updates",
            "Care Coordination & Follow-Up Management → Aligning with clinical team, managing recalls and pending treatments"
          ],
          columns: TASK_WORKFLOW_COLUMNS,
          required: true,
        },
        {
          id: "time_consuming_tasks",
          type: "checkbox",
          label: "Which tasks take the most time or effort in your workflow? (Select up to 3)",
          options: [
            "Appointment Scheduling & Calendar Optimization → Directly impacts production and provider utilization",
            "Insurance Verification (Accuracy & Completeness) → Prevents billing issues and patient dissatisfaction",
            "Patient Financial Communication (Estimates & OOP) → Drives case acceptance and reduces confusion",
            "Treatment Plan Scheduling & Case Acceptance Support → Converts recommended treatments into booked production",
            "Recall Management (Hygiene & Continuing Care) → Ensures recurring revenue and patient retention",
            "Handling Cancellations & Backfilling the Schedule → Minimizes downtime and lost revenue",
            "Patient Intake & Chart Accuracy → Prevents delays and errors during visits",
            "Payment Collection Support → Improves cash flow and reduces outstanding balances",
            "Other"
          ],
          optionsWithInputs: ["Other"],
          maxSelections: 3,
          required: true,
        },
      ],
    },
    {
      id: `${role}-training-needs`,
      title: "Part III – Competencies / Skills",
      description: "Which skills or topics would help you perform your role more effectively if you received additional training? (Select the areas where you feel additional support or learning would help you the most.)",
      questions: [
        {
          id: "competencies_skills",
          type: "checkbox",
          label: "Core Skills",
          options: [
            "Call Handling & Patient Communication",
            "Appointment Scheduling & Calendar Management",
            "Managing Cancellations, No-Shows & Same-Day Changes",
            "Patient Intake & Chart Review",
            "Dental Records Handling & Documentation Accuracy",
            "Internal Communication & Treatment Coordination",
            "Other"
          ],
          optionsWithInputs: ["Other"],
          required: true,
        },
        {
          id: "specialized_skills",
          type: "checkbox",
          label: "Specialized Skills",
          options: [
            "Dental Insurance Verification (PPO, Frequencies, Limitations)",
            "Treatment Estimates & Patient Financial Communication (OOP, Copay)",
            "Pre-Authorizations & Referral Coordination",
            "Dental PMS Navigation (Dentrix/Eaglesoft) & Workflow Efficiency",
            "Handling Billing Inquiries & Front Desk Support in Dental RCM",
            "Other"
          ],
          optionsWithInputs: ["Other"],
          required: true,
        },
      ],
    },
    getCommunicationSection(role),
    getAISection(role),
    {
      id: `${role}-final`,
      title: "Final Open Feedback",
      description: `Your final thoughts on how we can better support your success in the ${role} role.`,
      questions: [
        {
          id: "biggest_challenge",
          type: "textarea",
          label: "What is your biggest challenge in your current role?",
          required: true,
        },
        {
          id: "skill_improvement",
          type: "textarea",
          label: "If you could improve one skill right now, what would it be and why?",
          required: true,
        },
      ],
    },
  ];
};

const getDentalBillerSections = (): Section[] => {
  const role: Role = "Dental Biller";

  return [
    {
      id: `${role}-background`,
      title: "Background & Experience",
      description: `Tell us about your professional background and the environment you work in as a ${role}.`,
      questions: [
        {
          id: "experience_type",
          type: "radio",
          label: "What type of experience do you have?",
          options: [
            "BPO experience",
            "Direct Client / Independent VA (working directly with U.S. providers or practices)",
            "Mixed experience (combination of the above)",
            "First time VA",
          ],
          required: true,
        },
        {
          id: "practice_types",
          type: "checkbox",
          label: "What type of practices do you support? (Select all that apply)",
          options: [
            "General Dentistry",
            "Orthodontics",
            "Periodontics",
            "Endodontics",
            "Oral Surgery",
            "Pediatric Dentistry",
            "Other",
          ],
          optionsWithInputs: ["Other"],
          required: true,
        },
        {
          id: "software_tools",
          type: "checkbox",
          label: "Which software or tools do you use regularly? (Select all that apply)",
          options: [
            "Dentrix",
            "Eaglesoft",
            "Open Dental",
            "Curve Dental",
            "SoftDent",
            "PracticeWeb",
            "Other",
          ],
          optionsWithInputs: ["Other"],
          required: true,
        },
      ],
    },
    {
      id: `${role}-tasks-workflow`,
      title: "Part II – Tasks and Workflow",
      description: `How easy or difficult is it for you to complete the following tasks in your role?\n\n${TASK_WORKFLOW_LEGEND}`,
      questions: [
        {
          id: "task_grid",
          type: "grid",
          label: "How easy or difficult is it for you to complete the following tasks in your role?",
          rows: [
            "Claim Creation, Submission & Attachments → Submitting clean claims with correct codes and documentation",
            "Rejection Handling → Fixing clearinghouse/payer rejections before processing",
            "Payment Posting & Reconciliation → Posting EOB/ERA and patient payments, verifying accuracy",
            "Denials, Appeals & AR Follow-Up → Resolving denials, resubmitting claims, tracking unpaid balances",
            "Aging Management → Prioritizing claims based on aging (30/60/90+)",
            "Patient Billing & Collections Support → Managing statements, balances, and front desk coordination",
            "Reporting, Compliance & Process Improvement → Tracking KPIs, ensuring coding accuracy, reducing denials"
          ],
          columns: TASK_WORKFLOW_COLUMNS,
          required: true,
        },
        {
          id: "time_consuming_tasks",
          type: "checkbox",
          label: "Which tasks take the most time or effort in your workflow? (Select up to 3)",
          options: [
            "Claim Submission Accuracy (Clean Claims with Attachments) → Directly impacts approval rate and reimbursement speed",
            "Denial Management & Resolution → Recovers lost revenue and reduces write-offs",
            "Accounts Receivable (AR) Follow-Up → Drives collections and reduces aging",
            "Insurance Verification & Accurate Estimates → Prevents claim denials and patient dissatisfaction",
            "Payment Posting Accuracy (Insurance & Patient) → Ensures financial accuracy and reporting integrity",
            "Attachment Management (X-rays, Narratives) → Critical for approval of major procedures",
            "Appeals & Resubmissions → Recovers high-value denied claims",
            "Patient Billing & Collections Support → Improves cash flow and reduces outstanding balances",
            "Other"
          ],
          optionsWithInputs: ["Other"],
          maxSelections: 3,
          required: true,
        },
      ],
    },
    {
      id: `${role}-training-needs`,
      title: "Part III - Training Needs",
      description: "Which skills or topics would help you perform your role more effectively if you received additional training? (Select the areas where you feel additional support or learning would help you the most.)",
      questions: [
        {
          id: "competencies_skills",
          type: "checkbox",
          label: "Dental Biller – Core Skills",
          options: [
            "CDT Coding Basics & Procedure Knowledge",
            "Claim Creation & Clearinghouse Workflows",
            "Insurance Verification & Eligibility Checks",
            "Payment Posting (EOB/ERA Interpretation)",
            "Basic Denial Identification & Resubmission",
            "EMR/PMS Navigation (Dentrix, Eaglesoft, etc.)",
            "Other"
          ],
          optionsWithInputs: ["Other"],
          required: true,
        },
        {
          id: "specialized_skills",
          type: "checkbox",
          label: "Dental Biller – Specialized Skills",
          options: [
            "Advanced Denial Management & Appeal Strategies",
            "AR Aging Management & Collection Tactics",
            "Attachment Optimization & Narrative Writing",
            "Coordination of Benefits (COB) & Secondary Claims",
            "Ledger Review & Payment Reconciliation",
            "Revenue Cycle Reporting & KPI Analysis",
            "Other"
          ],
          optionsWithInputs: ["Other"],
          required: true,
        },
      ],
    },
    getCommunicationSection(role),
    getAISection(role),
    {
      id: `${role}-final`,
      title: "Final Open Feedback",
      description: `Your final thoughts on how we can better support your success in the ${role} role.`,
      questions: [
        {
          id: "biggest_challenge",
          type: "textarea",
          label: "What is your biggest challenge in your current role?",
          required: true,
        },
        {
          id: "skill_improvement",
          type: "textarea",
          label: "If you could improve one skill right now, what would it be and why?",
          required: true,
        },
      ],
    },
  ];
};

const getGeneralBusinessVASections = (): Section[] => {
  const role: Role = "General Business VA";
  
  return [
    {
      id: `${role}-background`,
      title: "Background Information",
      description: "Tell us about your professional background and the type of experience you have as a Business VA.",
      questions: [
        {
          id: "experience_function",
          type: "radio",
          label: "Which function best matches your experience? (Select one)",
          options: [
            "Sales VA",
            "Logistics / Operations VA",
            "Marketing VA",
            "Multi-function (handled multiple areas)",
          ],
          required: true,
        },
        {
          id: "client_types_supported",
          type: "checkbox",
          label: "What type of clients have you supported? (Select all that apply)",
          options: [
            "E-commerce",
            "Logistics / Supply Chain",
            "Marketing / Agency",
            "Real Estate",
            "SaaS / Tech",
            "Coaching / Consulting",
            "Healthcare",
            "Other",
          ],
          optionsWithInputs: ["Other"],
          required: true,
        },
      ],
    },
    {
      id: `${role}-tasks-workflow`,
      title: "Part II – Tasks and Workflow",
      description: `How easy or difficult is it for you to complete the following tasks in your role?\n\n${TASK_WORKFLOW_LEGEND}`,
      questions: [
        {
          id: "task_grid",
          type: "grid",
          label: "What is your level of hands-on experience in performing the following tasks?",
          rows: [
            "Lead Generation, CRM & Outreach → Sourcing leads, managing pipeline, and conducting outreach/follow-ups",
            "Social Media, Content & Email Marketing → Managing posts, campaigns, and basic performance tracking",
            "Order, Inventory & Vendor Coordination → Managing orders, stock, and supplier communication",
            "Inbox, Calendar & Data Management → Handling emails, scheduling, records, and documentation",
            "Customer Communication & Issue Handling → Responding to inquiries, resolving concerns, escalating when needed",
            "Task Tracking, Reporting & Workflow Coordination → Monitoring tasks, updating dashboards, and ensuring process flow"
          ],
          columns: TASK_WORKFLOW_COLUMNS,
          required: true,
        },
        {
          id: "time_consuming_tasks",
          type: "checkbox",
          label: "Which tasks take the most time or effort in your workflow? (Select up to 3)",
          options: [
            "Lead Generation & Sales Follow-Ups → Directly impacts revenue and pipeline growth",
            "CRM Management & Pipeline Tracking → Ensures visibility and conversion of leads",
            "Customer Support & Client Communication → Drives customer satisfaction and retention",
            "Order Processing & Operations Coordination → Ensures smooth business operations and delivery",
            "Email & Inbox Management → Maintains communication flow and responsiveness",
            "Marketing Support & Lead Generation Activities → Supports brand growth and demand generation",
            "Task Tracking & Follow-Up Management → Ensures execution and prevents missed opportunities",
            "Reporting & Performance Tracking → Supports data-driven decisions",
            "Other"
          ],
          optionsWithInputs: ["Other"],
          maxSelections: 3,
          required: true,
        },
      ],
    },
    {
      id: `${role}-competencies`,
      title: "Part III – Competencies / Skills",
      description: "Which skills or topics would help you perform your role more effectively if you received additional training? (Select the areas where you feel additional support or learning would help you the most.)",
      questions: [
        {
          id: "competencies_skills",
          type: "checkbox",
          label: "Core Skills",
          options: [
            "Lead Generation, Research & Data Entry",
            "CRM Management & Pipeline Tracking",
            "Customer Communication (Email, Chat, Basic Calls)",
            "Administrative Support & Task Coordination",
            "Order Processing & Basic Operations Support",
            "Professional Written Communication",
            "Other"
          ],
          optionsWithInputs: ["Other"],
          required: false,
        },
        {
          id: "specialized_skills",
          type: "checkbox",
          label: "Specialized Skills",
          options: [
            "Outbound Outreach & Sales Follow-Ups (Email, Calls, LinkedIn)",
            "Marketing Support (Social Media, Email Campaigns, Content Coordination)",
            "Logistics, Inventory & Vendor Coordination",
            "Basic Analytics & Performance Tracking",
            "Reporting, Documentation & Workflow Optimization",
            "Other"
          ],
          optionsWithInputs: ["Other"],
          required: false,
        },
      ],
    },
    {
      id: `${role}-challenges`,
      title: "Challenges & Scenarios",
      description: "Tell us about the challenges you face and how you handle specific business scenarios.",
      questions: [
        {
          id: "daily_challenges",
          type: "checkbox",
          label: "What are the most common challenges you face in your role? (Select up to 3)",
          options: [
            "Managing multiple tasks",
            "Unclear instructions from clients",
            "Lack of process or workflow",
            "Communication challenges",
            "Lack of system/tool familiarity",
            "Difficulty prioritizing tasks",
            "Handling high workload",
            "Adapting to new tools",
          ],
          maxSelections: 3,
          required: true,
        },
        {
          id: "scenario_handling",
          type: "textarea",
          label: "Describe a challenging situation you handled as a Business VA and how you resolved it.",
          required: true,
        },
      ],
    },
    {
      id: `${role}-training`,
      title: "Training & Development",
      description: "Help us understand your training needs and preferences.",
      questions: [
        {
          id: "training_needs",
          type: "checkbox",
          label: "What areas of training would be most beneficial for your growth? (Select all that apply)",
          options: [
            "Lead generation strategies",
            "CRM management and automation",
            "Digital marketing fundamentals",
            "Operations and logistics management",
            "Advanced communication skills",
            "Project management tools",
            "Data analysis and reporting",
            "Time management and productivity",
          ],
          required: true,
        },
        {
          id: "training_preference",
          type: "radio",
          label: "How do you prefer to receive training?",
          options: [
            "Live webinars / workshops",
            "Self-paced online courses",
            "One-on-one coaching",
            "Peer learning / group sessions",
            "Written guides and SOPs",
          ],
          required: true,
        },
      ],
    },
    {
      id: `${role}-preferences`,
      title: "Work Preferences",
      description: "Tell us about your ideal work environment and preferences.",
      questions: [
        {
          id: "workload_preference",
          type: "radio",
          label: "What is your preferred workload level?",
          options: [
            "High volume, fast-paced",
            "Moderate volume, steady pace",
            "Low volume, focused tasks",
          ],
          required: true,
        },
        {
          id: "client_communication_preference",
          type: "radio",
          label: "How do you prefer to communicate with your clients?",
          options: [
            "Frequent check-ins (daily)",
            "Regular updates (weekly)",
            "As needed / ad-hoc",
            "Primarily via email/chat",
          ],
          required: true,
        },
      ],
    },
    {
      id: `${role}-final`,
      title: "Final Thoughts",
      description: "Your final insights on succeeding as a Business VA.",
      questions: [
        {
          id: "success_factors",
          type: "textarea",
          label: "What do you believe are the key factors for success in this role?",
          required: true,
        },
        {
          id: "additional_feedback",
          type: "textarea",
          label: "Is there anything else you'd like to share about your experience or needs?",
          required: true,
        },
      ],
    },
  ];
};

const getExecutiveAssistantVASections = (): Section[] => {
  const role: Role = "Executive Assistant VA";
  
  return [
    {
      id: `${role}-background`,
      title: "Background Information",
      description: "Tell us about your professional background and the type of support you have provided as an Executive Assistant.",
      questions: [
        {
          id: "client_types_supported",
          type: "checkbox",
          label: "What type of clients have you supported? (Select all that apply)",
          options: [
            "Healthcare / Medical",
            "Dental",
            "E-commerce",
            "Real Estate",
            "Coaching / Consulting",
            "Marketing / Agency",
            "Logistics / Operations",
            "SaaS / Tech",
            "Other",
          ],
          optionsWithInputs: ["Other"],
          required: true,
        },
        {
          id: "support_type",
          type: "radio",
          label: "What type of support have you primarily provided? (Select one)",
          options: [
            "Executive Assistant (direct executive support)",
            "Administrative Assistant",
            "Operations Support",
            "Multi-role",
          ],
          required: true,
        },
      ],
    },
    {
      id: `${role}-tasks-workflow`,
      title: "Part II – Tasks and Workflow",
      description: `How easy or difficult is it for you to complete the following tasks in your role?\n\n${TASK_WORKFLOW_LEGEND}`,
      questions: [
        {
          id: "task_grid",
          type: "grid",
          label: "What is your level of hands-on experience in performing the following tasks?",
          rows: [
            "Calendar, Scheduling & Priority Management → Managing meetings, conflicts, and executive priorities",
            "Email, Stakeholder Communication & Drafting → Managing inbox, responding, and preparing communications",
            "Document Management & Meeting Notes → Preparing reports, maintaining files, and capturing action items",
            "Task Tracking, Project & Cross-Team Coordination → Managing deadlines, follow-ups, and team alignment",
            "Reporting, Briefs & Research → Preparing summaries, dashboards, and insights",
            "Travel & Event Coordination → Managing itineraries and meeting logistics"
          ],
          columns: TASK_WORKFLOW_COLUMNS,
          required: true,
        },
        {
          id: "time_consuming_tasks",
          type: "checkbox",
          label: "Which tasks take the most time or effort in your workflow? (Select up to 3)",
          options: [
            "Calendar & Priority Management → Directly impacts executive productivity and time utilization",
            "Inbox & Communication Management → Ensures timely responses and effective communication flow",
            "Task Tracking & Follow-Up Management → Prevents missed deadlines and ensures execution",
            "Meeting Coordination & Preparation → Keeps operations organized and efficient",
            "Executive Briefing & Reporting → Supports decision-making with clear insights",
            "Cross-Functional Coordination → Ensures alignment across teams and projects",
            "Document & Information Management → Maintains organization and accessibility of key information",
            "Other"
          ],
          optionsWithInputs: ["Other"],
          maxSelections: 3,
          required: true,
        },
      ],
    },
    {
      id: `${role}-competencies`,
      title: "Part III – Competencies / Skills",
      description: "Which skills or topics would help you perform your role more effectively if you received additional training? (Select the areas where you feel additional support or learning would help you the most.)",
      questions: [
        {
          id: "competencies_skills",
          type: "checkbox",
          label: "Core Skills",
          options: [
            "Inbox & Email Management (Prioritization, Drafting, Follow-Ups)",
            "Calendar Management & Scheduling Coordination",
            "Task Management & Executive Support Workflow",
            "Professional Written Communication & Stakeholder Coordination",
            "Document Creation, File Management & Organization",
            "Meeting Coordination & Minutes Documentation",
            "Other"
          ],
          optionsWithInputs: ["Other"],
          required: false,
        },
        {
          id: "specialized_skills",
          type: "checkbox",
          label: "Specialized Skills",
          options: [
            "Travel Planning & Itinerary Management",
            "Research, Data Gathering & Executive Brief Preparation",
            "Presentation & Report Preparation (Slides, Summaries)",
            "Project Coordination & Cross-Functional Support",
            "CRM & Business Tools Management (as applicable)",
            "Other"
          ],
          optionsWithInputs: ["Other"],
          required: false,
        },
      ],
    },
    {
      id: `${role}-challenges`,
      title: "Challenges & Scenarios",
      description: "Tell us about the challenges you face and how you handle specific EA scenarios.",
      questions: [
        {
          id: "daily_challenges",
          type: "checkbox",
          label: "What are the most common challenges you face in your role? (Select up to 3)",
          options: [
            "Managing a high volume of emails",
            "Handling frequent schedule changes",
            "Coordinating across different time zones",
            "Managing multiple projects simultaneously",
            "Communicating with difficult stakeholders",
            "Using complex software or tools",
            "Balancing urgent vs. important tasks",
            "Maintaining confidentiality and discretion",
          ],
          maxSelections: 3,
          required: true,
        },
        {
          id: "scenario_handling",
          type: "textarea",
          label: "Describe a challenging situation you handled as an EA and how you resolved it.",
          required: true,
        },
      ],
    },
    {
      id: `${role}-training`,
      title: "Training & Development",
      description: "Help us understand your training needs and preferences.",
      questions: [
        {
          id: "training_needs",
          type: "checkbox",
          label: "What areas of training would be most beneficial for your growth? (Select all that apply)",
          options: [
            "Advanced calendar management",
            "Project management tools",
            "Executive communication",
            "Data analysis and reporting",
            "Time management techniques",
            "Software-specific training (e.g., Slack, Asana, Notion)",
            "Strategic planning support",
            "Leadership and influence",
          ],
          required: true,
        },
        {
          id: "training_preference",
          type: "radio",
          label: "How do you prefer to receive training?",
          options: [
            "Live webinars / workshops",
            "Self-paced online courses",
            "One-on-one coaching",
            "Peer learning / group sessions",
            "Written guides and SOPs",
          ],
          required: true,
        },
      ],
    },
    {
      id: `${role}-preferences`,
      title: "Work Preferences",
      description: "Tell us about your ideal work environment and preferences.",
      questions: [
        {
          id: "workload_preference",
          type: "radio",
          label: "What is your preferred workload level?",
          options: [
            "High volume, fast-paced",
            "Moderate volume, steady pace",
            "Low volume, focused tasks",
          ],
          required: true,
        },
        {
          id: "communication_preference",
          type: "radio",
          label: "How do you prefer to communicate with your executive?",
          options: [
            "Frequent check-ins (daily)",
            "Regular updates (weekly)",
            "As needed / ad-hoc",
            "Primarily via email/text",
          ],
          required: true,
        },
      ],
    },
    {
      id: `${role}-final`,
      title: "Final Insights",
      description: "Your final insights on succeeding as an Executive Assistant.",
      questions: [
        {
          id: "important_skills",
          type: "textarea",
          label: "What skills do you believe are most important to succeed as an Executive Assistant?",
          required: true,
        },
        {
          id: "additional_training",
          type: "textarea",
          label: "What additional training would help you improve your performance?",
          required: true,
        },
      ],
    },
  ];
};

const getStandardSections = (role: Role, tasks: string[]): Section[] => [
  {
    id: `${role}-background`,
    title: "Background & Experience",
    description: `Tell us about your professional background and the environment you work in as a ${role}.`,
    questions: [
      {
        id: "experience_type",
        type: "radio",
        label: "What type of experience do you have?",
        options: [
          "BPO experience",
          "Direct Client / Independent VA (working directly with U.S. providers or practices)",
          "Mixed experience (combination of the above)",
          "First time VA",
        ],
        required: true,
      },
      {
        id: "practice_types",
        type: "checkbox",
        label: "What type of practices do you support? (Select all that apply)",
        options: [
          "Primary Care",
          "Specialty Clinics (Cardio, Ortho, etc.)",
          "Behavioral Health",
          "Urgent Care",
          "Telehealth",
          "Multi-specialty",
          "Other",
        ],
        required: true,
      },
      {
        id: "software_tools",
        type: "checkbox",
        label: "Which software or tools do you use regularly? (Select all that apply)",
        options: [
          "Athenahealth",
          "Kareo / Tebra",
          "AdvancedMD",
          "eClinicalWorks",
          "NextGen",
          "Epic",
          "Availity / Clearinghouses",
          "Dentrix",
          "Eaglesoft",
          "Open Dental",
          "Other",
        ],
        required: true,
      },
    ],
  },
  {
    id: `${role}-task-experience`,
    title: "Task Experience",
    description: `Rate your hands-on proficiency in the core tasks expected of a ${role}.`,
    questions: [
      {
        id: "task_grid",
        type: "grid",
        label: "What is your level of hands-on experience in performing the following tasks?",
        rows: tasks,
        columns: TASK_EXPERIENCE_COLUMNS,
        required: true,
      },
    ],
  },
  {
    id: `${role}-daily-responsibilities`,
    title: "Daily Responsibilities",
    description: `Help us understand your typical day-to-day workflow and time management as a ${role}.`,
    questions: [
      {
        id: "daily_tasks",
        type: "checkbox",
        label: "Which of these tasks do you perform on a daily basis?",
        options: tasks,
        required: true,
      },
      {
        id: "main_task",
        type: "radio",
        label: "Which single task takes up the most of your time?",
        options: tasks,
        required: true,
      },
    ],
  },
  {
    id: `${role}-challenges`,
    title: "Challenges & Pain Points",
    description: `Identify the specific obstacles and pressure points you encounter in your role as a ${role}.`,
    questions: [
      {
        id: "daily_challenges",
        type: "checkbox",
        label: "Which areas do you find most challenging in your daily work? (Select up to 3)",
        options: [
          "Communicating with patients (calls/messages)",
          "Explaining insurance or authorization requirements",
          "Managing multiple providers or calendars",
          "Coordinating between patients, providers, and insurance",
          "Insurance verification (detailed eligibility & benefits)",
          "Prior authorization processes",
          "Following up with insurance/payers",
          "Organizing and managing medical records",
          "Managing high workload or multiple tasks",
          "Multi-tasking across systems/tools",
          "Other",
        ],
        maxSelections: 3,
        required: true,
      },
      {
        id: "challenge_reasons",
        type: "checkbox",
        label: "What makes these areas challenging for you? (Select all that apply)",
        options: [
          "Lack of structured training or clear guidelines",
          "Limited hands-on experience",
          "Difficulty understanding real-world scenarios",
          "Inconsistent workflows across clients",
          "Lack of clear SOPs or workflows",
          "Lack of feedback or coaching",
          "Too many systems/tools to manage",
          "Limited access to systems for practice",
          "High workload or time pressure",
          "Other",
        ],
        required: true,
      },
      {
        id: "least_confident_tasks",
        type: "checkbox",
        label: "When handling administrative tasks, where do you feel least confident? (Select up to 2)",
        options: [
          "Submitting prior authorizations",
          "Following up with insurance/payers",
          "Coordinating with providers or teams",
          "Reviewing and organizing documentation",
          "Handling urgent or time-sensitive requests",
          "Communicating with patients or clients",
          "Managing multiple tasks simultaneously",
          "Other",
        ],
        maxSelections: 2,
        required: true,
      },
    ],
  },
  {
    id: `${role}-scenarios`,
    title: "Real-World Scenarios",
    description: `Share your experience with complex, high-pressure situations common to the ${role} role.`,
    questions: [
      {
        id: "struggle_scenarios",
        type: "checkbox",
        label: "What types of real-world scenarios do you struggle with the most? (Select all that apply)",
        options: [
          "Prior authorization denials or delays",
          "Delayed insurance responses",
          "Urgent scheduling or coordination issues",
          "Managing multiple clients or providers",
          "Escalations from providers or patients",
          "Handling complex insurance requirements",
          "Other",
        ],
        required: true,
      },
    ],
  },
  {
    id: `${role}-training-skill`,
    title: "Training & Confidence",
    description: `Assess your current confidence levels and identify specific areas where specialized training would benefit your growth as a ${role}.`,
    questions: [
      {
        id: "overall_confidence",
        type: "scale",
        label: "How would you rate your overall confidence in your current role?",
        min: 1,
        max: 5,
        minLabel: "Not confident",
        maxLabel: "Very confident",
        required: true,
      },
      {
        id: "specialized_training_needs",
        type: "checkbox",
        label: "What areas would you like to receive more specialized training in? Select all that apply.",
        options: [
          "Insurance verification (detailed eligibility & benefits)",
          "Prior authorization processes",
          "Appointment scheduling & provider coordination",
          "Front office coordination & operations",
          "Workflow and task management across multiple clients",
          "Medical records management & organization",
          "System/software training (EMR, portals, tools)",
          "Basic billing support (claims follow-up, inquiries)",
          "Other",
        ],
        required: true,
      },
      {
        id: "priority_training",
        type: "textarea",
        label: "Which ONE area should be prioritized for training first?",
        required: true,
      },
    ],
  },
  {
    id: `${role}-preferences`,
    title: "Training Preferences",
    description: `Tell us how you prefer to learn and what elements make a training program effective for you as a ${role}.`,
    questions: [
      {
        id: "training_preference",
        type: "checkbox",
        label: "What is your preferred method of training? (Select up to 2)",
        options: TRAINING_PREFERENCES,
        maxSelections: 2,
        required: true,
      },
      {
        id: "effective_training_elements",
        type: "checkbox",
        label: "If a training program were designed for you, what would make it most effective? (Select all that apply)",
        options: [
          "Certification program",
          "Step-by-step workflows (SOP-based)",
          "Real claim walkthroughs (start to finish)",
          "Denial case studies with solutions",
          "Hands-on practice using actual scenarios",
          "Live coaching or feedback sessions",
          "Templates/scripts for AR and appeals",
          "System training (Athena, Availity, etc.)",
          "Other",
        ],
        required: true,
      },
    ],
  },
  {
    id: `${role}-final`,
    title: "Final Open Feedback",
    description: `Your final thoughts on how we can better support your success in the ${role} role.`,
    questions: [
      {
        id: "biggest_challenge",
        type: "textarea",
        label: "What is your biggest challenge in your current role?",
        required: true,
      },
      {
        id: "skill_improvement",
        type: "textarea",
        label: "If you could improve one skill right now, what would it be and why?",
        required: true,
      },
    ],
  },
];

export const VA_SURVEY_SCHEMA: SurveySchema = {
  profile: {
    id: "profile",
    title: "Profile Information",
    questions: [
      {
        id: "full_name",
        type: "text",
        label: "Full Name",
        required: true,
      },
      {
        id: "email",
        type: "text",
        label: "Email Address",
        required: true,
      },
      {
        id: "role",
        type: "radio",
        label: "What is your primary VA role?",
        options: [
          "Medical Receptionist",
          "Medical Administrative Assistant",
          "Medical Biller",
          "Medical Scribe",
          "Health Educator",
          "Dental Receptionist",
          "Dental Biller",
          "Executive Assistant VA",
          "General Business VA",
        ],
        required: true,
      },
      {
        id: "experience_years",
        type: "radio",
        label: "Years of healthcare experience",
        options: EXPERIENCE_OPTIONS,
        required: true,
      },
    ],
  },
  roleSections: {
    "Medical Receptionist": getMedicalReceptionistSections(),
    "Medical Administrative Assistant": getMedicalAdminSections(),
    "Medical Biller": getMedicalBillerSections(),
    "Medical Scribe": getMedicalScribeSections(),
    "Health Educator": getHealthEducatorSections(),
    "Dental Receptionist": getDentalReceptionistSections(),
    "Dental Biller": getDentalBillerSections(),
    "Executive Assistant VA": getExecutiveAssistantVASections(),
    "General Business VA": getGeneralBusinessVASections(),
  },
};

export const CLIENT_SURVEY_SCHEMA: ClientSurveySchema = {
  initial: {
    id: "client-initial",
    title: "Part I – Virtual Assistant Information",
    description: "Dear Virtual Assistant,\n\nWe’re excited to share that we’re developing a VA Upskilling Program designed to support your professional growth, strengthen your skills, and help you succeed in your role.\n\nYour feedback will help us:\n• Identify the skills that matter most in your daily work\n• Understand where additional training or support is needed\n• Design practical modules that help you perform confidently and efficiently\n\nThis survey will take 3–5 minutes to complete.\n\nThank you for sharing your insights!",
    questions: [
      {
        id: "full_name",
        type: "text",
        label: "Name (First Name, Last Name)",
        required: true,
      },
      {
        id: "email",
        type: "text",
        label: "Email Address",
        required: true,
      },
      {
        id: "practice_type",
        type: "radio",
        label: "What industry does your client belong to?",
        options: [
          "Dental",
          "Medical",
          "Business",
          "E-commerce",
          "Real Estate",
          "Other"
        ],
        optionsWithInputs: ["Other"],
        required: true,
      },
      {
        id: "va_tenure",
        type: "radio",
        label: "How long have you been working with your current client?",
        options: [
          "Not Applicable / Current BCT Trainee",
          "Less than 3 months",
          "3–6 months",
          "6–12 months",
          "1 year or more"
        ],
        required: true,
      },
      {
        id: "va_role_feedback",
        type: "checkbox",
        label: "What is your current VA role? (Select all that apply)",
        options: [
          "Medical Receptionist",
          "Medical Administrative Assistant",
          "Medical Biller",
          "Medical Scribe",
          "Health Educator",
          "Dental Receptionist",
          "Dental Biller",
          "Executive Assistant VA",
          "General Business VA",
        ],
        required: true,
      },
    ],
  },
  roleSections: {
    "Medical Biller": [
      {
        id: "biller-tasks-workflow",
        title: "PART II - Tasks and Workflow",
        questions: [
          {
            id: "biller_task_difficulty",
            type: "grid",
            label: "How easy or difficult is it for you to complete the following tasks in your role?",
            description: "Legend:\nNA – Not Applicable / Not part of my role\n1 – Very Difficult – I often struggle and need help\n2 – Difficult – I can do it but sometimes need support\n3 – Manageable – I can perform the task independently\n4 – Easy – I can perform the task quickly and confidently",
            rows: [
              "Charge Entry, Coding & Pre-Billing Review → Entering CPT, ICD-10, modifiers; validating documentation and scrubbing claims before submission",
              "Insurance Verification (Billing-Focused) → Validating coverage, payer requirements, and eligibility before billing",
              "Claim Creation, Submission & Rejection Handling → Submitting claims (CMS 1500 / UB-04) and correcting clearinghouse rejections",
              "Payer Portal Navigation & Claim Tracking → Monitoring claim status via Availity and payer portals",
              "Payment Posting & Reconciliation → Posting EOB/ERA and identifying underpayments",
              "Denial Management, Appeals & AR Follow-Up → Resolving denials, submitting appeals, and following up on unpaid claims",
              "Aging & Work Queue Management → Prioritizing claims based on aging buckets (30/60/90+)",
              "Patient Billing & Financial Communication → Managing statements, explaining balances, OOP costs, and payment options",
              "Billing Reports, Compliance & Process Improvement → Tracking KPIs, ensuring HIPAA compliance, and optimizing workflows"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          getDesiredImprovementsQuestion("biller"),
          {
            id: "biller_time_consuming_tasks",
            type: "checkbox",
            label: "Which tasks take the most time or effort in your workflow? (Select up to 3)",
            options: [
              "Claim Submission Accuracy & Volume → Clean claims, minimal rejections, timely submission",
              "Denial Management & Resolution → Reducing denials and recovering lost revenue",
              "Accounts Receivable (AR) Follow-Up → Driving collections and reducing aging",
              "Payment Posting Accuracy → Ensuring correct revenue tracking and reconciliation",
              "Clearinghouse Rejection Management → Preventing delays before claims reach payer",
              "Insurance Verification (Billing Impact) → Preventing eligibility-related denials",
              "Patient Billing & Collections → Improving patient payments and reducing outstanding balances",
              "Reporting & Revenue Insights → Identifying trends and improving financial performance",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            maxSelections: 3,
            required: true,
          },
          {
            id: "biller_medical_systems",
            dependsOn: "practice_type",
            dependsOnValue: "Medical",
            type: "checkbox",
            label: "Electronic Medical Record (Medical): (Select all that apply)",
            description: "Please select the systems and tools you actively use in your current role. This helps us understand your actual system exposure and proficiency, so we can provide the right training and support.",
            variant: "grid",
            options: [
              "Athena (AthenaOne / AthenaNet)",
              "Practice Fusion",
              "eClinicalWorks (eCW)",
              "Epic",
              "Cerner",
              "NextGen Healthcare",
              "Kareo / Tebra",
              "DrChrono",
              "AdvancedMD",
              "Office Ally",
              "Meditech",
              "Allscripts",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: false,
          },
          {
            id: "biller_dental_systems",
            dependsOn: "practice_type",
            dependsOnValue: "Dental",
            type: "checkbox",
            label: "Dental PMS: (Select all that apply)",
            description: "Please select the systems and tools you actively use in your current role. This helps us understand your actual system exposure and proficiency, so we can provide the right training and support.",
            variant: "grid",
            options: [
              "Dentrix",
              "Eaglesoft",
              "Open Dental",
              "Curve Dental",
              "ClearDent",
              "ABELDent",
              "Tracker",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: false,
          },
          {
            id: "biller_insurance_tools",
            dependsOn: "practice_type",
            dependsOnValue: ["Medical", "Dental"],
            type: "checkbox",
            label: "Insurance & Eligibility Tools: (Select all that apply)",
            description: "Please select the systems and tools you actively use in your current role. This helps us understand your actual system exposure and proficiency, so we can provide the right training and support.",
            variant: "grid",
            options: [
              "Availity",
              "NaviNet",
              "Waystar",
              "Change Healthcare",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: false,
          },
          {
            id: "biller_other_tools_selection",
            dependsOn: "practice_type",
            dependsOnValue: ["Medical", "Dental"],
            type: "checkbox",
            label: "Other Tools: (Select all that apply)",
            description: "Please select the systems and tools you actively use in your current role. This helps us understand your actual system exposure and proficiency, so we can provide the right training and support.",
            variant: "grid",
            options: [
              "RingCentral",
              "8x8",
              "Zoom",
              "Microsoft Teams",
              "Slack",
              "Google Workspace (Docs, Sheets, Calendar)",
              "Microsoft Office (Outlook, Excel)",
              "Trello",
              "Asana",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: false,
          },
          {
            id: "biller_tool_difficulty",
            type: "grid",
            label: "How easy or difficult is it for you to use the following tools in your daily work?",
            description: "Legend:\nNA – Not Applicable / Not part of my role\n1 – Very Difficult – I often struggle and need help\n2 – Difficult – I can do it but sometimes need support\n3 – Manageable – I can perform the task independently\n4 – Easy – I can perform the task quickly and confidently",
            dynamicRowsFrom: [
              "biller_medical_systems",
              "biller_dental_systems",
              "biller_insurance_tools",
              "biller_other_tools_selection"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          {
            id: "biller_other_tools",
            type: "checkbox",
            label: "What other systems or tools do you use in your workflow? (Select all that apply)",
            options: [
              "VoIP / Phone Systems",
              "CRM Systems",
              "Reporting / Analytics Tools",
              "Spreadsheets (Google Sheets, Excel)",
              "Project Management Tools",
              "Scheduling / Calendar Tools",
              "HRIS / HR Management Systems",
              "Email Management Tools",
              "File Management / Cloud Storage (Google Drive, Dropbox)",
              "Internal Communication Tools (Slack, Microsoft Teams)",
              "Task Management Tools",
              "Documentation / Knowledge Base Tools",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: true,
          }
        ]
      },
      {
        id: "biller-competencies-skills",
        title: "Part III – Competencies / Skills",
        description: "Which skills or topics would help you perform your role more effectively if you received additional training? (Select the areas where you feel additional support or learning would help you the most.)",
        questions: [
          {
            id: "competencies_skills",
            type: "checkbox",
            label: "Core Skills",
            options: [
              "Charge Entry Accuracy & Documentation Review",
              "Medical Coding Basics (CPT, ICD-10, Modifiers)",
              "Medical Terminology for Billing & Coding Accuracy",
              "Claim Submission & Clearinghouse Workflow",
              "Payment Posting (EOB/ERA Interpretation)",
              "AR Follow-Up Fundamentals (Aging Buckets & Prioritization)",
              "Denial Identification & Basic Resolution",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: true,
          },
          {
            id: "specialized_skills",
            type: "checkbox",
            label: "Specialized Skills",
            options: [
              "Advanced Denial Management & Appeals Process",
              "AR Recovery Strategies (Reducing 60–90+ Day AR)",
              "Insurance Verification for Billing Accuracy",
              "Prior Authorizations & Medical Necessity Checks",
              "Patient Billing & Financial Communication",
              "Payer-Specific Workflows (Medicare, Medicaid, Commercial)",
              "EMR/PM & Clearinghouse Navigation (End-to-End Billing Flow)",
              "Reporting & KPI Tracking (Collections, Denial Trends, AR Analysis)",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: true,
          }
        ]
      },
      {
        id: "biller-communication-skills",
        title: "Part IV - Communication Skills",
        questions: [
          {
            id: "biller_comm_difficulty",
            type: "grid",
            label: "How easy or difficult is it for you to perform the following tasks in your role?",
            description: "Legend:\nNA – Not Applicable / Not part of my role\n1 – Very Difficult – I often struggle and need help\n2 – Difficult – I can do it but sometimes need support\n3 – Manageable – I can perform the task independently\n4 – Easy – I can perform the task quickly and confidently",
            rows: [
              "Handling client calls → Communicating clearly, professionally, and confidently during calls",
              "Responding to client emails/messages → Providing timely, accurate, and well-written responses",
              "Posting updates on group chats / team channels → Sharing clear, concise, and actionable updates with the team",
              "Preparing and submitting reports → Presenting information, updates, and data in a clear and organized manner",
              "Managing appointment scheduling & changes → Communicating schedules, updates, and changes accurately and clearly",
              "Updating documentation & records accurately → Recording complete, accurate, and easy-to-understand information"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          {
            id: "biller_speaking_confidence",
            type: "radio",
            label: "How confident are you that clients or patients clearly understand you when you speak?",
            options: [
              "Very confident – I am easily understood",
              "Confident – Minor repetition may sometimes be needed",
              "Somewhat confident – I occasionally worry about accent or clarity",
              "Not confident – I often feel misunderstood"
            ],
            required: true,
          }
        ]
      },
      {
        id: "biller-ai-essentials",
        title: "Part V - AI Essentials",
        questions: [
          {
            id: "biller_ai_usage",
            type: "radio",
            label: "How much of your current workflow involves the use of AI tools?",
            options: [
              "None – My work is mostly manual",
              "A little – I occasionally use AI to assist with tasks",
              "Moderate – AI helps with several parts of my workflow",
              "A lot – AI is integrated into many of my tasks"
            ],
            required: true,
          },
          {
            id: "biller_ai_tool_comfort",
            type: "grid",
            label: "How comfortable are you using the following AI tools in your work?",
            description: "Legend\nNA – Not applicable / I do not use this\n1 – Not comfortable – I need guidance to use it\n2 – Somewhat comfortable – I can use it with occasional help\n3 – Comfortable – I can use it independently\n4 – Very comfortable – I can use it efficiently and creatively",
            rows: [
              "Generative AI (e.g., ChatGPT, Claude, Gemini)",
              "Healthcare-specific AI / EMR systems (e.g., Dentrix, Epic, Athenahealth)",
              "Data analysis & reporting tools with AI (e.g., Excel / Sheets AI features, dashboards)",
              "Task & workflow automation AI (e.g., scheduling bots, reminders)"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          {
            id: "biller_ai_usage_areas",
            type: "checkbox",
            label: "In which areas do you currently use AI the most? (Select all that apply)",
            options: [
              "Writing or drafting emails/messages",
              "Summarizing notes or documentation",
              "Research or information lookup",
              "Data analysis or reporting",
              "Task automation or workflow support",
              "Organizing information or documentation",
              "I currently do not use AI tools"
            ],
            required: true,
          },
          {
            id: "biller_ai_skills_to_learn",
            type: "checkbox",
            label: "What AI-related skills would you like to learn to improve your work?",
            options: [
              "Writing emails or messages faster with AI",
              "Summarizing patient/client notes",
              "Automating repetitive tasks",
              "Creating reports using AI tools",
              "Workflow automation",
              "Prompt writing / prompting techniques",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: true,
          }
        ],
      },
      getVASectionVI("Medical Biller")
    ],
    "Medical Receptionist": [
      {
        id: "receptionist-tasks-workflow",
        title: "PART II - Tasks and Workflow",
        questions: [
          {
            id: "receptionist_task_difficulty",
            type: "grid",
            label: "How easy or difficult is it for you to complete the following tasks in your role?",
            description: "Legend:\nNA – Not Applicable / Not part of my role\n1 – Very Difficult – I often struggle and need help\n2 – Difficult – I can do it but sometimes need support\n3 – Manageable – I can perform the task independently\n4 – Easy – I can perform the task quickly and confidently",
            rows: [
              "Appointment scheduling → Booking and managing appointments",
              "Patient calls and inquiries → Answering calls and assisting patients",
              "Insurance verification → Checking eligibility and benefits",
              "Patient intake → Collecting and entering patient information",
              "Appointment reminders & follow-ups → Confirmations and recalls",
              "Data entry / record updates → Updating patient information",
              "Payment collection → Collecting co-pays and payments",
              "Referral coordination → Sending and tracking referrals",
              "Medical records handling → Managing records and requests",
              "Team coordination → Communicating with providers and staff"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          getDesiredImprovementsQuestion("receptionist"),
          {
            id: "receptionist_time_consuming_tasks",
            type: "checkbox",
            label: "Which tasks take the most time or effort in your workflow? (Select up to 3)",
            options: [
              "Appointment scheduling → Managing bookings and changes",
              "Patient calls and inquiries → Handling high call volume",
              "Insurance verification → Checking coverage and benefits",
              "Patient intake → Entering patient details",
              "Appointment reminders & follow-ups → Managing confirmations",
              "Managing no-shows → Tracking and rescheduling patients",
              "Data entry / updates → Maintaining accurate records",
              "Payment collection → Processing patient payments",
              "Referral coordination → Managing referrals",
              "Medical records handling → Processing records requests",
              "Team coordination → Communicating with staff",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            maxSelections: 3,
            required: true,
          },
          {
            id: "receptionist_medical_systems",
            dependsOn: "practice_type",
            dependsOnValue: "Medical",
            type: "checkbox",
            label: "Electronic Medical Record (Medical): (Select all that apply)",
            description: "Please select the systems and tools you actively use in your current role. This helps us understand your actual system exposure and proficiency, so we can provide the right training and support.",
            variant: "grid",
            options: [
              "Athena (AthenaOne / AthenaNet)",
              "Practice Fusion",
              "eClinicalWorks (eCW)",
              "Epic",
              "Cerner",
              "NextGen Healthcare",
              "Kareo / Tebra",
              "DrChrono",
              "AdvancedMD",
              "Office Ally",
              "Meditech",
              "Allscripts",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: false,
          },
          {
            id: "receptionist_dental_systems",
            dependsOn: "practice_type",
            dependsOnValue: "Dental",
            type: "checkbox",
            label: "Dental PMS: (Select all that apply)",
            description: "Please select the systems and tools you actively use in your current role. This helps us understand your actual system exposure and proficiency, so we can provide the right training and support.",
            variant: "grid",
            options: [
              "Dentrix",
              "Eaglesoft",
              "Open Dental",
              "Curve Dental",
              "ClearDent",
              "ABELDent",
              "Tracker",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: false,
          },
          {
            id: "receptionist_insurance_tools",
            dependsOn: "practice_type",
            dependsOnValue: ["Medical", "Dental"],
            type: "checkbox",
            label: "Insurance & Eligibility Tools: (Select all that apply)",
            description: "Please select the systems and tools you actively use in your current role. This helps us understand your actual system exposure and proficiency, so we can provide the right training and support.",
            variant: "grid",
            options: [
              "Availity",
              "NaviNet",
              "Waystar",
              "Change Healthcare",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: false,
          },
          {
            id: "receptionist_other_tools_selection",
            dependsOn: "practice_type",
            dependsOnValue: ["Medical", "Dental"],
            type: "checkbox",
            label: "Other Tools: (Select all that apply)",
            description: "Please select the systems and tools you actively use in your current role. This helps us understand your actual system exposure and proficiency, so we can provide the right training and support.",
            variant: "grid",
            options: [
              "RingCentral",
              "8x8",
              "Zoom",
              "Microsoft Teams",
              "Slack",
              "Google Workspace (Docs, Sheets, Calendar)",
              "Microsoft Office (Outlook, Excel)",
              "Trello",
              "Asana",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: false,
          },
          {
            id: "receptionist_tool_difficulty",
            type: "grid",
            label: "How easy or difficult is it for you to use the following tools in your daily work?",
            description: "Legend:\nNA – Not Applicable / Not part of my role\n1 – Very Difficult – I often struggle and need help\n2 – Difficult – I can do it but sometimes need support\n3 – Manageable – I can perform the task independently\n4 – Easy – I can perform the task quickly and confidently",
            dynamicRowsFrom: [
              "receptionist_medical_systems",
              "receptionist_dental_systems",
              "receptionist_insurance_tools",
              "receptionist_other_tools_selection"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          {
            id: "receptionist_other_tools",
            type: "checkbox",
            label: "What other systems or tools do you use in your workflow? (Select all that apply)",
            options: [
              "VoIP / Phone Systems",
              "CRM Systems",
              "Reporting / Analytics Tools",
              "Spreadsheets (Google Sheets, Excel)",
              "Project Management Tools",
              "Scheduling / Calendar Tools",
              "HRIS / HR Management Systems",
              "Email Management Tools",
              "File Management / Cloud Storage (Google Drive, Dropbox)",
              "Internal Communication Tools (Slack, Microsoft Teams)",
              "Task Management Tools",
              "Documentation / Knowledge Base Tools",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: true,
          }
        ]
      },
      {
        id: "receptionist-competencies-skills",
        title: "Part III – Competencies / Skills",
        description: "Which skills or topics would help you perform your role more effectively if you received additional training? (Select the areas where you feel additional support or learning would help you the most.)",
        questions: [
          {
            id: "competencies_skills",
            type: "checkbox",
            label: "Core Skills",
            options: [
              "Professional Call Handling & Patient Communication",
              "Appointment Scheduling & Calendar Management",
              "Managing Cancellations, No-Shows & Same-Day Changes",
              "Patient Intake & Accurate Data Entry",
              "Medical Records Handling & HIPAA Compliance",
              "Internal Communication & Task Coordination",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: true,
          },
          {
            id: "specialized_skills",
            type: "checkbox",
            label: "Specialized Skills",
            options: [
              "Insurance Verification (Eligibility & Benefits Breakdown)",
              "Patient Financial Communication (Copay, Deductible, OOP Costs)",
              "Pre-Authorizations & Referral Coordination",
              "EMR/EHR Navigation & Workflow Efficiency",
              "Handling Billing Inquiries & Front Desk Support in RCM",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: true,
          }
        ]
      },
      {
        id: "receptionist-communication-skills",
        title: "Part IV - Communication Skills",
        questions: [
          {
            id: "receptionist_comm_difficulty",
            type: "grid",
            label: "How easy or difficult is it for you to perform the following tasks in your role?",
            description: "Legend:\nNA – Not Applicable / Not part of my role\n1 – Very Difficult – I often struggle and need help\n2 – Difficult – I can do it but sometimes need support\n3 – Manageable – I can perform the task independently\n4 – Easy – I can perform the task quickly and confidently",
            rows: [
              "Handling client calls → Communicating clearly, professionally, and confidently during calls",
              "Responding to client emails/messages → Providing timely, accurate, and well-written responses",
              "Posting updates on group chats / team channels → Sharing clear, concise, and actionable updates with the team",
              "Preparing and submitting reports → Presenting information, updates, and data in a clear and organized manner",
              "Managing appointment scheduling & changes → Communicating schedules, updates, and changes accurately and clearly",
              "Updating documentation & records accurately → Recording complete, accurate, and easy-to-understand information"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          {
            id: "receptionist_speaking_confidence",
            type: "radio",
            label: "How confident are you that clients or patients clearly understand you when you speak?",
            options: [
              "Very confident – I am easily understood",
              "Confident – Minor repetition may sometimes be needed",
              "Somewhat confident – I occasionally worry about accent or clarity",
              "Not confident – I often feel misunderstood"
            ],
            required: true,
          }
        ]
      },
      {
        id: "receptionist-ai-essentials",
        title: "Part V - AI Essentials",
        questions: [
          {
            id: "receptionist_ai_usage",
            type: "radio",
            label: "How much of your current workflow involves the use of AI tools?",
            options: [
              "None – My work is mostly manual",
              "A little – I occasionally use AI to assist with tasks",
              "Moderate – AI helps with several parts of my workflow",
              "A lot – AI is integrated into many of my tasks"
            ],
            required: true,
          },
          {
            id: "receptionist_ai_tool_comfort",
            type: "grid",
            label: "How comfortable are you using the following AI tools in your work?",
            description: "Legend\nNA – Not applicable / I do not use this\n1 – Not comfortable – I need guidance to use it\n2 – Somewhat comfortable – I can use it with occasional help\n3 – Comfortable – I can use it independently\n4 – Very comfortable – I can use it efficiently and creatively",
            rows: [
              "Generative AI (e.g., ChatGPT, Claude, Gemini)",
              "Healthcare-specific AI / EMR systems (e.g., Dentrix, Epic, Athenahealth)",
              "Data analysis & reporting tools with AI (e.g., Excel / Sheets AI features, dashboards)",
              "Task & workflow automation AI (e.g., scheduling bots, reminders)"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          {
            id: "receptionist_ai_usage_areas",
            type: "checkbox",
            label: "In which areas do you currently use AI the most? (Select all that apply)",
            options: [
              "Writing or drafting emails/messages",
              "Summarizing notes or documentation",
              "Research or information lookup",
              "Data analysis or reporting",
              "Task automation or workflow support",
              "Organizing information or documentation",
              "I currently do not use AI tools"
            ],
            required: true,
          },
          {
            id: "receptionist_ai_skills_to_learn",
            type: "checkbox",
            label: "What AI-related skills would you like to learn to improve your work?",
            options: [
              "Writing emails or messages faster with AI",
              "Summarizing patient/client notes",
              "Automating repetitive tasks",
              "Creating reports using AI tools",
              "Workflow automation",
              "Prompt writing / prompting techniques",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: true,
          }
        ],
      },
      getVASectionVI("Medical Receptionist")
    ],
    "Medical Administrative Assistant": [
      {
        id: "admin-tasks-workflow",
        title: "PART II - Tasks and Workflow",
        questions: [
          {
            id: "admin_task_difficulty",
            type: "grid",
            label: "How easy or difficult is it for you to complete the following tasks in your role?",
            description: "Legend:\nNA – Not Applicable / Not part of my role\n1 – Very Difficult – I often struggle and need help\n2 – Difficult – I can do it but sometimes need support\n3 – Manageable – I can perform the task independently\n4 – Easy – I can perform the task quickly and confidently",
            rows: [
              "Inbox/email management → Managing emails and communication",
              "Scheduling & coordination → Organizing meetings, calendars, tasks",
              "Patient coordination → Communicating with patients for updates",
              "Insurance support → Assisting with verification and follow-ups",
              "Billing support → Collecting co-pays, handling invoices, and basic reconciliations",
              "Documentation & reports → Preparing reports and records",
              "Data entry / system updates → Maintaining accurate information",
              "Medical records handling → Managing files and documentation",
              "Prior authorization support → Assisting with authorization requests",
              "Team coordination → Communicating with providers and staff"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          getDesiredImprovementsQuestion("admin"),
          {
            id: "admin_crucial_tasks",
            type: "checkbox",
            label: "Which tasks take the most time or effort in your workflow? (Select up to 3)",
            options: [
              "Appointment scheduling → Managing bookings and changes",
              "Patient calls and inquiries → Handling high call volume",
              "Insurance verification → Checking coverage and benefits",
              "Patient intake → Entering patient details",
              "Appointment reminders & follow-ups → Managing confirmations",
              "Managing no-shows → Tracking and rescheduling patients",
              "Data entry / updates → Maintaining accurate records",
              "Payment collection → Processing patient payments",
              "Referral coordination → Managing referrals",
              "Medical records handling → Processing records requests",
              "Team coordination → Communicating with staff"
            ],
            maxSelections: 3,
            required: true,
          },
          {
            id: "admin_medical_systems",
            dependsOn: "practice_type",
            dependsOnValue: "Medical",
            type: "checkbox",
            label: "Electronic Medical Record (Medical): (Select all that apply)",
            description: "Please select the systems and tools you actively use in your current role. This helps us understand your actual system exposure and proficiency, so we can provide the right training and support.",
            variant: "grid",
            options: [
              "Athena (AthenaOne / AthenaNet)",
              "Practice Fusion",
              "eClinicalWorks (eCW)",
              "Epic",
              "Cerner",
              "NextGen Healthcare",
              "Kareo / Tebra",
              "DrChrono",
              "AdvancedMD",
              "Office Ally",
              "Meditech",
              "Allscripts",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: false,
          },
          {
            id: "admin_dental_systems",
            dependsOn: "practice_type",
            dependsOnValue: "Dental",
            type: "checkbox",
            label: "Dental PMS: (Select all that apply)",
            description: "Please select the systems and tools you actively use in your current role. This helps us understand your actual system exposure and proficiency, so we can provide the right training and support.",
            variant: "grid",
            options: [
              "Dentrix",
              "Eaglesoft",
              "Open Dental",
              "Curve Dental",
              "ClearDent",
              "ABELDent",
              "Tracker",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: false,
          },
          {
            id: "admin_insurance_tools",
            dependsOn: "practice_type",
            dependsOnValue: ["Medical", "Dental"],
            type: "checkbox",
            label: "Insurance & Eligibility Tools: (Select all that apply)",
            description: "Please select the systems and tools you actively use in your current role. This helps us understand your actual system exposure and proficiency, so we can provide the right training and support.",
            variant: "grid",
            options: [
              "Availity",
              "NaviNet",
              "Waystar",
              "Change Healthcare",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: false,
          },
          {
            id: "admin_other_tools_selection",
            dependsOn: "practice_type",
            dependsOnValue: ["Medical", "Dental"],
            type: "checkbox",
            label: "Other Tools: (Select all that apply)",
            description: "Please select the systems and tools you actively use in your current role. This helps us understand your actual system exposure and proficiency, so we can provide the right training and support.",
            variant: "grid",
            options: [
              "RingCentral",
              "8x8",
              "Zoom",
              "Microsoft Teams",
              "Slack",
              "Google Workspace (Docs, Sheets, Calendar)",
              "Microsoft Office (Outlook, Excel)",
              "Trello",
              "Asana",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: false,
          },
          {
            id: "admin_tool_proficiency",
            type: "grid",
            label: "Please rate your proficiency in using the following tools:",
            description: "1 – Basic: Minimal knowledge; requires close guidance.\n2 – Developing: Partial understanding; needs occasional support.\n3 – Proficient: Performs tasks independently; meets expectations.\n4 – Advanced: Demonstrates strong mastery; handles complex tasks independently.",
            dynamicRowsFrom: [
              "admin_medical_systems",
              "admin_dental_systems",
              "admin_insurance_tools",
              "admin_other_tools_selection"
            ],
            columns: ["1", "2", "3", "4"],
            required: true,
          },
          {
            id: "admin_other_tools",
            type: "checkbox",
            label: "What other systems or tools do you use in your workflow? (Select all that apply)",
            options: [
              "VoIP / Phone Systems",
              "CRM Systems",
              "Reporting / Analytics Tools",
              "Spreadsheets (Google Sheets, Excel)",
              "Project Management Tools",
              "Scheduling / Calendar Tools",
              "HRIS / HR Management Systems",
              "Email Management Tools",
              "File Management / Cloud Storage (Google Drive, Dropbox)",
              "Internal Communication Tools (Slack, Microsoft Teams)",
              "Task Management Tools",
              "Documentation / Knowledge Base Tools",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: true,
          }
        ],
      },
      {
        id: "admin-competencies-skills",
        title: "Part III – Competencies / Skills",
        description: "Which skills or topics would help you perform your role more effectively if you received additional training? (Select the areas where you feel additional support or learning would help you the most.)",
        questions: [
          {
            id: "competencies_skills",
            type: "checkbox",
            label: "Core Skills",
            options: [
              "Inbox & Email Management (Prioritization & Response)",
              "Advanced Calendar & Provider Coordination",
              "Patient Intake & Accurate Data Entry",
              "Medical Records Handling & HIPAA Compliance",
              "Internal Communication & Task Coordination",
              "Managing Cancellations, No-Shows & Same-Day Changes",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: true,
          },
          {
            id: "specialized_skills",
            type: "checkbox",
            label: "Specialized Skills",
            options: [
              "Insurance Verification (Eligibility & Benefits Breakdown)",
              "Patient Financial Communication (Copay, Deductible, OOP Costs)",
              "Pre-Authorizations & Referral Coordination",
              "EMR/EHR Navigation & Workflow Efficiency",
              "Handling Billing Inquiries & Front Desk Support in RCM",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: true,
          }
        ]
      },
      {
        id: "admin-communication-skills",
        title: "Part IV - Communication Skills",
        questions: [
          {
            id: "admin_comm_difficulty",
            type: "grid",
            label: "How easy or difficult is it for you to perform the following tasks in your role?",
            description: "Legend:\nNA – Not Applicable / Not part of my role\n1 – Very Difficult – I often struggle and need help\n2 – Difficult – I can do it but sometimes need support\n3 – Manageable – I can perform the task independently\n4 – Easy – I can perform the task quickly and confidently",
            rows: [
              "Handling client calls → Communicating clearly, professionally, and confidently during calls",
              "Responding to client emails/messages → Providing timely, accurate, and well-written responses",
              "Posting updates on group chats / team channels → Sharing clear, concise, and actionable updates with the team",
              "Preparing and submitting reports → Presenting information, updates, and data in a clear and organized manner",
              "Managing appointment scheduling & changes → Communicating schedules, updates, and changes accurately and clearly",
              "Updating documentation & records accurately → Recording complete, accurate, and easy-to-understand information"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          {
            id: "admin_speaking_confidence",
            type: "radio",
            label: "How confident are you that clients or patients clearly understand you when you speak?",
            options: [
              "Very confident – I am easily understood",
              "Confident – Minor repetition may sometimes be needed",
              "Somewhat confident – I occasionally worry about accent or clarity",
              "Not confident – I often feel misunderstood"
            ],
            required: true,
          }
        ],
      },
      {
        id: "admin-ai-essentials",
        title: "Part V - AI Essentials",
        questions: [
          {
            id: "admin_ai_usage",
            type: "radio",
            label: "How much of your current workflow involves the use of AI tools?",
            options: [
              "None – My work is mostly manual",
              "A little – I occasionally use AI to assist with tasks",
              "Moderate – AI helps with several parts of my workflow",
              "A lot – AI is integrated into many of my tasks"
            ],
            required: true,
          },
          {
            id: "admin_ai_tool_comfort",
            type: "grid",
            label: "How comfortable are you using the following AI tools in your work?",
            description: "Legend\nNA – Not applicable / I do not use this\n1 – Not comfortable – I need guidance to use it\n2 – Somewhat comfortable – I can use it with occasional help\n3 – Comfortable – I can use it independently\n4 – Very comfortable – I can use it efficiently and creatively",
            rows: [
              "Generative AI (e.g., ChatGPT, Claude, Gemini)",
              "Healthcare-specific AI / EMR systems (e.g., Dentrix, Epic, Athenahealth)",
              "Data analysis & reporting tools with AI (e.g., Excel / Sheets AI features, dashboards)",
              "Task & workflow automation AI (e.g., scheduling bots, reminders)"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          {
            id: "admin_ai_usage_areas",
            type: "checkbox",
            label: "In which areas do you currently use AI the most? (Select all that apply)",
            options: [
              "Writing or drafting emails/messages",
              "Summarizing notes or documentation",
              "Research or information lookup",
              "Data analysis or reporting",
              "Task automation or workflow support",
              "Organizing information or documentation",
              "I currently do not use AI tools"
            ],
            required: true,
          },
          {
            id: "admin_ai_skills_to_learn",
            type: "checkbox",
            label: "What AI-related skills would you like to learn to improve your work?",
            options: [
              "Writing emails or messages faster with AI",
              "Summarizing patient/client notes",
              "Automating repetitive tasks",
              "Creating reports using AI tools",
              "Workflow automation",
              "Prompt writing / prompting techniques",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: true,
          }
        ],
      },
      getVASectionVI("Medical Administrative Assistant")
    ],
    "Medical Scribe": [
      {
        id: "scribe-tasks-workflow",
        title: "PART II - Tasks and Workflow",
        questions: [
          {
            id: "scribe_task_difficulty",
            type: "grid",
            label: "How easy or difficult is it for you to complete the following tasks in your role?",
            description: "Legend:\nNA – Not Applicable / Not part of my role\n1 – Very Difficult – I often struggle and need help\n2 – Difficult – I can do it but sometimes need support\n3 – Manageable – I can perform the task independently\n4 – Easy – I can perform the task quickly and confidently",
            rows: [
              "Pre-Charting & Chart Setup → Reviewing history, notes, meds, and preparing templates",
              "Real-Time Scribing & Transcription → Documenting visits and converting audio to notes",
              "Clinical Note Structuring & Terminology → Accurate HPI, ROS, PE, A&P with proper medical terms",
              "Active Listening & Information Filtering → Capturing relevant details during encounters",
              "Chart Completion, Editing & TAT → Finalizing, proofreading, and completing notes on time",
              "Order Entry & Task Management → Supporting labs, imaging, prescriptions, and EMR tasks",
              "Care Coordination Support → Communicating follow-ups with clinical team",
              "HIPAA & Documentation Standards → Ensuring privacy, accuracy, and provider-specific formatting"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          getDesiredImprovementsQuestion("scribe"),
          {
            id: "scribe_time_consuming_tasks",
            type: "checkbox",
            label: "Which tasks take the most time or effort in your workflow? (Select up to 3)",
            options: [
              "Accurate Real-Time Scribing (Live Documentation) → Reduces provider documentation burden during visits",
              "Medical Transcription Accuracy & Turnaround Time → Ensures timely and precise conversion of dictations into billable notes",
              "Documentation Accuracy (HPI, A&P, Clinical Details) → Critical for compliance, billing, and patient safety",
              "Chart Completion & Turnaround Time (TAT) → Enables faster billing and continuity of care",
              "Pre-Charting & Chart Readiness → Improves visit efficiency and provider preparedness",
              "Medical Terminology & Structured Note Writing → Ensures professional, compliant, and readable documentation",
              "Order Entry & Clinical Task Support → Prevents missed orders and improves workflow",
              "EMR Task & Alert Management → Ensures follow-ups and clinical actions are completed",
              "Compliance & HIPAA Adherence → Protects patient data and reduces legal risk",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            maxSelections: 3,
            required: true,
          },
          {
            id: "scribe_medical_systems",
            dependsOn: "practice_type",
            dependsOnValue: "Medical",
            type: "checkbox",
            label: "Electronic Medical Record (Medical): (Select all that apply)",
            description: "Please select the systems and tools you actively use in your current role. This helps us understand your actual system exposure and proficiency, so we can provide the right training and support.",
            variant: "grid",
            options: [
              "Athena (AthenaOne / AthenaNet)",
              "Practice Fusion",
              "eClinicalWorks (eCW)",
              "Epic",
              "Cerner",
              "NextGen Healthcare",
              "Kareo / Tebra",
              "DrChrono",
              "AdvancedMD",
              "Office Ally",
              "Meditech",
              "Allscripts",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: false,
          },
          {
            id: "scribe_dental_systems",
            dependsOn: "practice_type",
            dependsOnValue: "Dental",
            type: "checkbox",
            label: "Dental PMS: (Select all that apply)",
            description: "Please select the systems and tools you actively use in your current role. This helps us understand your actual system exposure and proficiency, so we can provide the right training and support.",
            variant: "grid",
            options: [
              "Dentrix",
              "Eaglesoft",
              "Open Dental",
              "Curve Dental",
              "ClearDent",
              "ABELDent",
              "Tracker",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: false,
          },
          {
            id: "scribe_insurance_tools",
            dependsOn: "practice_type",
            dependsOnValue: ["Medical", "Dental"],
            type: "checkbox",
            label: "Insurance & Eligibility Tools: (Select all that apply)",
            description: "Please select the systems and tools you actively use in your current role. This helps us understand your actual system exposure and proficiency, so we can provide the right training and support.",
            variant: "grid",
            options: [
              "Availity",
              "NaviNet",
              "Waystar",
              "Change Healthcare",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: false,
          },
          {
            id: "scribe_other_tools_selection",
            dependsOn: "practice_type",
            dependsOnValue: ["Medical", "Dental"],
            type: "checkbox",
            label: "Other Tools: (Select all that apply)",
            description: "Please select the systems and tools you actively use in your current role. This helps us understand your actual system exposure and proficiency, so we can provide the right training and support.",
            variant: "grid",
            options: [
              "RingCentral",
              "8x8",
              "Zoom",
              "Microsoft Teams",
              "Slack",
              "Google Workspace (Docs, Sheets, Calendar)",
              "Microsoft Office (Outlook, Excel)",
              "Trello",
              "Asana",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: false,
          },
          {
            id: "scribe_tool_proficiency",
            type: "grid",
            label: "Please rate your proficiency in using the following tools:",
            description: "1 – Basic: Minimal knowledge; requires close guidance.\n2 – Developing: Partial understanding; needs occasional support.\n3 – Proficient: Performs tasks independently; meets expectations.\n4 – Advanced: Demonstrates strong mastery; handles complex tasks independently.",
            dynamicRowsFrom: [
              "scribe_medical_systems",
              "scribe_dental_systems",
              "scribe_insurance_tools",
              "scribe_other_tools_selection"
            ],
            columns: ["1", "2", "3", "4"],
            required: true,
          },
          {
            id: "scribe_other_tools",
            type: "checkbox",
            label: "What other systems or tools do you use in your workflow? (Select all that apply)",
            options: [
              "VoIP / Phone Systems",
              "CRM Systems",
              "Reporting / Analytics Tools",
              "Spreadsheets (Google Sheets, Excel)",
              "Project Management Tools",
              "Scheduling / Calendar Tools",
              "HRIS / HR Management Systems",
              "Email Management Tools",
              "File Management / Cloud Storage (Google Drive, Dropbox)",
              "Internal Communication Tools (Slack, Microsoft Teams)",
              "Task Management Tools",
              "Documentation / Knowledge Base Tools",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: true,
          }
        ],
      },
      {
        id: "scribe-competencies-skills",
        title: "Part III – Competencies / Skills",
        description: "Which skills or topics would help you perform your role more effectively if you received additional training? (Select the areas where you feel additional support or learning would help you the most.)",
        questions: [
          {
            id: "competencies_skills",
            type: "checkbox",
            label: "Core Skills",
            options: [
              "Real-Time Charting & Note Accuracy",
              "Medical Terminology & Anatomy Knowledge",
              "HPI (History of Present Illness) Documentation",
              "Review of Systems (ROS) & Physical Exam Entry",
              "EMR/EHR Navigation & Workflow Efficiency",
              "HIPAA Compliance & Documentation Standards",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: true,
          },
          {
            id: "specialized_skills",
            type: "checkbox",
            label: "Specialized Skills",
            options: [
              "Specialty-Specific Documentation (e.g., Cardiology, Ortho, Derm)",
              "Coding Support (ICD-10 & CPT Selection Basics)",
              "Managing Orders (Labs, Imaging, Referrals)",
              "Patient Education & Discharge Summary Support",
              "Advanced Clinical Workflow Optimization",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: true,
          }
        ]
      },
      {
        id: "scribe-communication-skills",
        title: "Part IV - Communication Skills",
        questions: [
          {
            id: "scribe_comm_difficulty",
            type: "grid",
            label: "How easy or difficult is it for you to perform the following tasks in your role?",
            description: "Legend:\nNA – Not Applicable / Not part of my role\n1 – Very Difficult – I often struggle and need help\n2 – Difficult – I can do it but sometimes need support\n3 – Manageable – I can perform the task independently\n4 – Easy – I can perform the task quickly and confidently",
            rows: [
              "Handling client calls → Communicating clearly, professionally, and confidently during calls",
              "Responding to client emails/messages → Providing timely, accurate, and well-written responses",
              "Posting updates on group chats / team channels → Sharing clear, concise, and actionable updates with the team",
              "Preparing and submitting reports → Presenting information, updates, and data in a clear and organized manner",
              "Managing appointment scheduling & changes → Communicating schedules, updates, and changes accurately and clearly",
              "Updating documentation & records accurately → Recording complete, accurate, and easy-to-understand information"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          {
            id: "scribe_speaking_confidence",
            type: "radio",
            label: "How confident are you that clients or patients clearly understand you when you speak?",
            options: [
              "Very confident – I am easily understood",
              "Confident – Minor repetition may sometimes be needed",
              "Somewhat confident – I occasionally worry about accent or clarity",
              "Not confident – I often feel misunderstood"
            ],
            required: true,
          }
        ],
      },
      {
        id: "scribe-ai-essentials",
        title: "Part V - AI Essentials",
        questions: [
          {
            id: "scribe_ai_usage",
            type: "radio",
            label: "How much of your current workflow involves the use of AI tools?",
            options: [
              "None – My work is mostly manual",
              "A little – I occasionally use AI to assist with tasks",
              "Moderate – AI helps with several parts of my workflow",
              "A lot – AI is integrated into many of my tasks"
            ],
            required: true,
          },
          {
            id: "scribe_ai_tool_comfort",
            type: "grid",
            label: "How comfortable are you using the following AI tools in your work?",
            description: "Legend\nNA – Not applicable / I do not use this\n1 – Not comfortable – I need guidance to use it\n2 – Somewhat comfortable – I can use it with occasional help\n3 – Comfortable – I can use it independently\n4 – Very comfortable – I can use it efficiently and creatively",
            rows: [
              "Generative AI (e.g., ChatGPT, Claude, Gemini)",
              "Healthcare-specific AI / EMR systems (e.g., Dentrix, Epic, Athenahealth)",
              "Data analysis & reporting tools with AI (e.g., Excel / Sheets AI features, dashboards)",
              "Task & workflow automation AI (e.g., scheduling bots, reminders)"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          {
            id: "scribe_ai_usage_areas",
            type: "checkbox",
            label: "In which areas do you currently use AI the most? (Select all that apply)",
            options: [
              "Writing or drafting emails/messages",
              "Summarizing notes or documentation",
              "Research or information lookup",
              "Data analysis or reporting",
              "Task automation or workflow support",
              "Organizing information or documentation",
              "I currently do not use AI tools"
            ],
            required: true,
          },
          {
            id: "scribe_ai_skills_to_learn",
            type: "checkbox",
            label: "What AI-related skills would you like to learn to improve your work?",
            options: [
              "Writing emails or messages faster with AI",
              "Summarizing patient/client notes",
              "Automating repetitive tasks",
              "Creating reports using AI tools",
              "Workflow automation",
              "Prompt writing / prompting techniques",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: true,
          }
        ],
      },
      getVASectionVI("Medical Scribe")
    ],
    "Health Educator": [
      {
        id: "educator-tasks-workflow",
        title: "PART II - Tasks and Workflow",
        questions: [
          {
            id: "educator_task_difficulty",
            type: "grid",
            label: "How easy or difficult is it for you to complete the following tasks in your role?",
            description: "Legend:\nNA – Not Applicable / Not part of my role\n1 – Very Difficult – I often struggle and need help\n2 – Difficult – I can do it but sometimes need support\n3 – Manageable – I can perform the task independently\n4 – Easy – I can perform the task quickly and confidently",
            rows: [
              "Patient Education & Health Coaching → Explaining care plans and supporting lifestyle changes",
              "Motivational Support & Engagement → Encouraging adherence and building patient trust",
              "Follow-Ups & Patient Support → Monitoring progress, addressing concerns, escalating when needed",
              "Care Plan Reinforcement & Documentation → Simplifying recommendations and documenting interactions",
              "Care Coordination & Appointment Management → Communicating with care team and scheduling follow-ups",
              "Progress Tracking, Reporting & Intake Support → Monitoring outcomes, updating reports, assisting with screenings",
              "Education Delivery & Risk Escalation → Sharing resources and identifying/escalating patient risks"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          getDesiredImprovementsQuestion("educator"),
          {
            id: "educator_time_consuming_tasks",
            type: "checkbox",
            label: "Which tasks take the most time or effort in your workflow? (Select up to 3)",
            options: [
              "Patient Education Delivery (Clear & Effective Communication) → Core driver of patient understanding and program value",
              "Patient Engagement & Follow-Ups → Directly impacts retention, adherence, and outcomes",
              "Health Coaching & Behavior Change Support → Drives measurable lifestyle improvements",
              "Documentation Accuracy & Progress Tracking → Ensures continuity of care and program evaluation",
              "Care Plan Reinforcement → Improves adherence to provider recommendations",
              "Coordination with Clinical Team → Prevents gaps in care and improves patient experience",
              "Program Reporting & Outcome Tracking → Supports business insights and client reporting",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            maxSelections: 3,
            required: true,
          },
          {
            id: "health_educator_medical_systems",
            dependsOn: "practice_type",
            dependsOnValue: "Medical",
            type: "checkbox",
            label: "Electronic Medical Record (Medical): (Select all that apply)",
            description: "Please select the systems and tools you actively use in your current role. This helps us understand your actual system exposure and proficiency, so we can provide the right training and support.",
            variant: "grid",
            options: [
              "Athena (AthenaOne / AthenaNet)",
              "Practice Fusion",
              "eClinicalWorks (eCW)",
              "Epic",
              "Cerner",
              "NextGen Healthcare",
              "Kareo / Tebra",
              "DrChrono",
              "AdvancedMD",
              "Office Ally",
              "Meditech",
              "Allscripts",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: false,
          },
          {
            id: "health_educator_dental_systems",
            dependsOn: "practice_type",
            dependsOnValue: "Dental",
            type: "checkbox",
            label: "Dental PMS: (Select all that apply)",
            description: "Please select the systems and tools you actively use in your current role. This helps us understand your actual system exposure and proficiency, so we can provide the right training and support.",
            variant: "grid",
            options: [
              "Dentrix",
              "Eaglesoft",
              "Open Dental",
              "Curve Dental",
              "ClearDent",
              "ABELDent",
              "Tracker",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: false,
          },
          {
            id: "health_educator_insurance_tools",
            dependsOn: "practice_type",
            dependsOnValue: ["Medical", "Dental"],
            type: "checkbox",
            label: "Insurance & Eligibility Tools: (Select all that apply)",
            description: "Please select the systems and tools you actively use in your current role. This helps us understand your actual system exposure and proficiency, so we can provide the right training and support.",
            variant: "grid",
            options: [
              "Availity",
              "NaviNet",
              "Waystar",
              "Change Healthcare",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: false,
          },
          {
            id: "health_educator_other_tools_selection",
            dependsOn: "practice_type",
            dependsOnValue: ["Medical", "Dental"],
            type: "checkbox",
            label: "Other Tools: (Select all that apply)",
            description: "Please select the systems and tools you actively use in your current role. This helps us understand your actual system exposure and proficiency, so we can provide the right training and support.",
            variant: "grid",
            options: [
              "RingCentral",
              "8x8",
              "Zoom",
              "Microsoft Teams",
              "Slack",
              "Google Workspace (Docs, Sheets, Calendar)",
              "Microsoft Office (Outlook, Excel)",
              "Trello",
              "Asana",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: false,
          },
          {
            id: "health_educator_tool_difficulty",
            type: "grid",
            label: "How easy or difficult is it for you to use the following tools in your daily work?",
            description: "Legend:\nNA – Not Applicable / Not part of my role\n1 – Very Difficult – I often struggle and need help\n2 – Difficult – I can do it but sometimes need support\n3 – Manageable – I can perform the task independently\n4 – Easy – I can perform the task quickly and confidently",
            dynamicRowsFrom: [
              "health_educator_medical_systems",
              "health_educator_dental_systems",
              "health_educator_insurance_tools",
              "health_educator_other_tools_selection"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          {
            id: "health_educator_other_tools",
            type: "checkbox",
            label: "What other systems or tools do you use in your workflow? (Select all that apply)",
            options: [
              "VoIP / Phone Systems",
              "CRM Systems",
              "Reporting / Analytics Tools",
              "Spreadsheets (Google Sheets, Excel)",
              "Project Management Tools",
              "Scheduling / Calendar Tools",
              "HRIS / HR Management Systems",
              "Email Management Tools",
              "File Management / Cloud Storage (Google Drive, Dropbox)",
              "Internal Communication Tools (Slack, Microsoft Teams)",
              "Task Management Tools",
              "Documentation / Knowledge Base Tools",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: true,
          }
        ],
      },
      {
        id: "health-educator-competencies-skills",
        title: "Part III – Competencies / Skills",
        description: "Which skills or topics would help you perform your role more effectively if you received additional training? (Select the areas where you feel additional support or learning would help you the most.)",
        questions: [
          {
            id: "competencies_skills",
            type: "checkbox",
            label: "Core Skills",
            options: [
              "Patient Education & Health Literacy Communication",
              "Chronic Disease Management Support (Diabetes, Hypertension, etc.)",
              "Motivational Interviewing & Behavioral Change Coaching",
              "Creating & Organizing Patient Education Materials",
              "EMR Documentation & Patient Progress Tracking",
              "HIPAA Compliance & Patient Privacy",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: true,
          },
          {
            id: "specialized_skills",
            type: "checkbox",
            label: "Specialized Skills",
            options: [
              "Specialty-Specific Health Education (e.g., Nutrition, Mental Health)",
              "Community Resource Coordination & Referrals",
              "Telehealth Platform Navigation & Virtual Coaching",
              "Data Tracking & Health Outcome Reporting",
              "Developing Wellness Programs & Outreach Strategies",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: true,
          }
        ]
      },
      {
        id: "health-educator-communication-skills",
        title: "Part IV - Communication Skills",
        questions: [
          {
            id: "health_educator_comm_difficulty",
            type: "grid",
            label: "How easy or difficult is it for you to perform the following tasks in your role?",
            description: "Legend:\nNA – Not Applicable / Not part of my role\n1 – Very Difficult – I often struggle and need help\n2 – Difficult – I can do it but sometimes need support\n3 – Manageable – I can perform the task independently\n4 – Easy – I can perform the task quickly and confidently",
            rows: [
              "Handling client calls → Communicating clearly, professionally, and confidently during calls",
              "Responding to client emails/messages → Providing timely, accurate, and well-written responses",
              "Posting updates on group chats / team channels → Sharing clear, concise, and actionable updates with the team",
              "Preparing and submitting reports → Presenting information, updates, and data in a clear and organized manner",
              "Managing appointment scheduling & changes → Communicating schedules, updates, and changes accurately and clearly",
              "Updating documentation & records accurately → Recording complete, accurate, and easy-to-understand information"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          {
            id: "health_educator_speaking_confidence",
            type: "radio",
            label: "How confident are you that clients or patients clearly understand you when you speak?",
            options: [
              "Very confident – I am easily understood",
              "Confident – Minor repetition may sometimes be needed",
              "Somewhat confident – I occasionally worry about accent or clarity",
              "Not confident – I often feel misunderstood"
            ],
            required: true,
          }
        ],
      },
      {
        id: "health-educator-ai-essentials",
        title: "Part V - AI Essentials",
        questions: [
          {
            id: "health_educator_ai_usage",
            type: "radio",
            label: "How much of your current workflow involves the use of AI tools?",
            options: [
              "None – My work is mostly manual",
              "A little – I occasionally use AI to assist with tasks",
              "Moderate – AI helps with several parts of my workflow",
              "A lot – AI is integrated into many of my tasks"
            ],
            required: true,
          },
          {
            id: "health_educator_ai_tool_comfort",
            type: "grid",
            label: "How comfortable are you using the following AI tools in your work?",
            description: "Legend\nNA – Not applicable / I do not use this\n1 – Not comfortable – I need guidance to use it\n2 – Somewhat comfortable – I can use it with occasional help\n3 – Comfortable – I can use it independently\n4 – Very comfortable – I can use it efficiently and creatively",
            rows: [
              "Generative AI (e.g., ChatGPT, Claude, Gemini)",
              "Healthcare-specific AI / EMR systems (e.g., Dentrix, Epic, Athenahealth)",
              "Data analysis & reporting tools with AI (e.g., Excel / Sheets AI features, dashboards)",
              "Task & workflow automation AI (e.g., scheduling bots, reminders)"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          {
            id: "health_educator_ai_usage_areas",
            type: "checkbox",
            label: "In which areas do you currently use AI the most? (Select all that apply)",
            options: [
              "Writing or drafting emails/messages",
              "Summarizing notes or documentation",
              "Research or information lookup",
              "Data analysis or reporting",
              "Task automation or workflow support",
              "Organizing information or documentation",
              "I currently do not use AI tools"
            ],
            required: true,
          },
          {
            id: "health_educator_ai_skills_to_learn",
            type: "checkbox",
            label: "What AI-related skills would you like to learn to improve your work?",
            options: [
              "Writing emails or messages faster with AI",
              "Summarizing patient/client notes",
              "Automating repetitive tasks",
              "Creating reports using AI tools",
              "Workflow automation",
              "Prompt writing / prompting techniques",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: true,
          }
        ],
      },
      getVASectionVI("Health Educator")
    ],
    "Dental Receptionist": [
      {
        id: "dental-receptionist-tasks-workflow",
        title: "PART II - Tasks and Workflow",
        questions: [
          {
            id: "dental_receptionist_task_difficulty",
            type: "grid",
            label: "How easy or difficult is it for you to complete the following tasks in your role?",
            description: "Legend:\nNA – Not Applicable / Not part of my role\n1 – Very Difficult – I often struggle and need help\n2 – Difficult – I can do it but sometimes need support\n3 – Manageable – I can perform the task independently\n4 – Easy – I can perform the task quickly and confidently",
            rows: [
              "Scheduling, Calendar Optimization & Rescheduling → Managing bookings, provider schedules, and minimizing gaps/no-shows",
              "Call Handling, Patient Intake & Expectations → Managing calls, registering patients, and explaining next steps",
              "Payment Collection & Posting Support → Collecting copays, balances, and recording payments",
              "Pre-Authorizations (if applicable) → Submitting and following up on approvals",
              "Basic Ledger Review → Understanding patient balances and transactions",
              "Chart Review & Document Management → Maintaining accurate patient records and treatment updates",
              "Care Coordination & Follow-Up Management → Aligning with clinical team, managing recalls and pending treatments"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          getDesiredImprovementsQuestion("dental_receptionist"),
          {
            id: "dental_receptionist_time_consuming_tasks",
            type: "checkbox",
            label: "Which tasks take the most time or effort in your workflow? (Select up to 3)",
            options: [
              "Appointment Scheduling & Calendar Optimization → Directly impacts production and provider utilization",
              "Insurance Verification (Accuracy & Completeness) → Prevents billing issues and patient dissatisfaction",
              "Patient Financial Communication (Estimates & OOP) → Drives case acceptance and reduces confusion",
              "Treatment Plan Scheduling & Case Acceptance Support → Converts recommended treatments into booked production",
              "Recall Management (Hygiene & Continuing Care) → Ensures recurring revenue and patient retention",
              "Handling Cancellations & Backfilling the Schedule → Minimizes downtime and lost revenue",
              "Patient Intake & Chart Accuracy → Prevents delays and errors during visits",
              "Payment Collection Support → Improves cash flow and reduces outstanding balances",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            maxSelections: 3,
            required: true,
          },
          {
            id: "dental_receptionist_medical_systems",
            dependsOn: "practice_type",
            dependsOnValue: "Medical",
            type: "checkbox",
            label: "Electronic Medical Record (Medical): (Select all that apply)",
            description: "Please select the systems and tools you actively use in your current role. This helps us understand your actual system exposure and proficiency, so we can provide the right training and support.",
            variant: "grid",
            options: [
              "Athena (AthenaOne / AthenaNet)",
              "Practice Fusion",
              "eClinicalWorks (eCW)",
              "Epic",
              "Cerner",
              "NextGen Healthcare",
              "Kareo / Tebra",
              "DrChrono",
              "AdvancedMD",
              "Office Ally",
              "Meditech",
              "Allscripts",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: false,
          },
          {
            id: "dental_receptionist_dental_systems",
            dependsOn: "practice_type",
            dependsOnValue: "Dental",
            type: "checkbox",
            label: "Dental PMS: (Select all that apply)",
            description: "Please select the systems and tools you actively use in your current role. This helps us understand your actual system exposure and proficiency, so we can provide the right training and support.",
            variant: "grid",
            options: [
              "Dentrix",
              "Eaglesoft",
              "Open Dental",
              "Curve Dental",
              "ClearDent",
              "ABELDent",
              "Tracker",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: false,
          },
          {
            id: "dental_receptionist_insurance_tools",
            dependsOn: "practice_type",
            dependsOnValue: ["Medical", "Dental"],
            type: "checkbox",
            label: "Insurance & Eligibility Tools: (Select all that apply)",
            description: "Please select the systems and tools you actively use in your current role. This helps us understand your actual system exposure and proficiency, so we can provide the right training and support.",
            variant: "grid",
            options: [
              "Availity",
              "NaviNet",
              "Waystar",
              "Change Healthcare",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: false,
          },
          {
            id: "dental_receptionist_other_tools_selection",
            dependsOn: "practice_type",
            dependsOnValue: ["Medical", "Dental"],
            type: "checkbox",
            label: "Other Tools: (Select all that apply)",
            description: "Please select the systems and tools you actively use in your current role. This helps us understand your actual system exposure and proficiency, so we can provide the right training and support.",
            variant: "grid",
            options: [
              "RingCentral",
              "8x8",
              "Zoom",
              "Microsoft Teams",
              "Slack",
              "Google Workspace (Docs, Sheets, Calendar)",
              "Microsoft Office (Outlook, Excel)",
              "Trello",
              "Asana",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: false,
          },
          {
            id: "dental_receptionist_tool_difficulty",
            type: "grid",
            label: "How easy or difficult is it for you to use the following tools in your daily work?",
            description: "Legend:\nNA – Not Applicable / Not part of my role\n1 – Very Difficult – I often struggle and need help\n2 – Difficult – I can do it but sometimes need support\n3 – Manageable – I can perform the task independently\n4 – Easy – I can perform the task quickly and confidently",
            dynamicRowsFrom: [
              "dental_receptionist_medical_systems",
              "dental_receptionist_dental_systems",
              "dental_receptionist_insurance_tools",
              "dental_receptionist_other_tools_selection"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          {
            id: "dental_receptionist_other_tools",
            type: "checkbox",
            label: "What other systems or tools do you use in your workflow? (Select all that apply)",
            options: [
              "VoIP / Phone Systems",
              "CRM Systems",
              "Reporting / Analytics Tools",
              "Spreadsheets (Google Sheets, Excel)",
              "Project Management Tools",
              "Scheduling / Calendar Tools",
              "HRIS / HR Management Systems",
              "Email Management Tools",
              "File Management / Cloud Storage (Google Drive, Dropbox)",
              "Internal Communication Tools (Slack, Microsoft Teams)",
              "Task Management Tools",
              "Documentation / Knowledge Base Tools",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: true,
          }
        ],
      },
      {
        id: "dental-receptionist-competencies-skills",
        title: "Part III – Competencies / Skills",
        description: "Which skills or topics would help you perform your role more effectively if you received additional training? (Select the areas where you feel additional support or learning would help you the most.)",
        questions: [
          {
            id: "competencies_skills",
            type: "checkbox",
            label: "Core Skills",
            options: [
              "Professional Call Handling & Patient Communication",
              "Appointment Scheduling & Calendar Management (Dentrix, Eaglesoft, etc.)",
              "Managing Cancellations, No-Shows & Same-Day Changes",
              "Patient Intake & Accurate Data Entry",
              "Medical/Dental Records Handling & HIPAA Compliance",
              "Internal Communication & Task Coordination",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: true,
          },
          {
            id: "specialized_skills",
            type: "checkbox",
            label: "Specialized Skills",
            options: [
              "Insurance Verification (Eligibility & Benefits Breakdown)",
              "Patient Financial Communication (Copay, Deductible, OOP Costs)",
              "Pre-Authorizations & Referral Coordination",
              "EMR/EHR Navigation & Workflow Efficiency",
              "Handling Billing Inquiries & Front Desk Support in RCM",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: true,
          }
        ]
      },
      {
        id: "dental-receptionist-communication-skills",
        title: "Part IV - Communication Skills",
        questions: [
          {
            id: "dental_receptionist_comm_difficulty",
            type: "grid",
            label: "How easy or difficult is it for you to perform the following tasks in your role?",
            description: "Legend:\nNA – Not Applicable / Not part of my role\n1 – Very Difficult – I often struggle and need help\n2 – Difficult – I can do it but sometimes need support\n3 – Manageable – I can perform the task independently\n4 – Easy – I can perform the task quickly and confidently",
            rows: [
              "Handling client calls → Communicating clearly, professionally, and confidently during calls",
              "Responding to client emails/messages → Providing timely, accurate, and well-written responses",
              "Posting updates on group chats / team channels → Sharing clear, concise, and actionable updates with the team",
              "Preparing and submitting reports → Presenting information, updates, and data in a clear and organized manner",
              "Managing appointment scheduling & changes → Communicating schedules, updates, and changes accurately and clearly",
              "Updating documentation & records accurately → Recording complete, accurate, and easy-to-understand information"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          {
            id: "dental_receptionist_speaking_confidence",
            type: "radio",
            label: "How confident are you that clients or patients clearly understand you when you speak?",
            options: [
              "Very confident – I am easily understood",
              "Confident – Minor repetition may sometimes be needed",
              "Somewhat confident – I occasionally worry about accent or clarity",
              "Not confident – I often feel misunderstood"
            ],
            required: true,
          }
        ],
      },
      {
        id: "dental-receptionist-ai-essentials",
        title: "Part V - AI Essentials",
        questions: [
          {
            id: "dental_receptionist_ai_usage",
            type: "radio",
            label: "How much of your current workflow involves the use of AI tools?",
            options: [
              "None – My work is mostly manual",
              "A little – I occasionally use AI to assist with tasks",
              "Moderate – AI helps with several parts of my workflow",
              "A lot – AI is integrated into many of my tasks"
            ],
            required: true,
          },
          {
            id: "dental_receptionist_ai_tool_comfort",
            type: "grid",
            label: "How comfortable are you using the following AI tools in your work?",
            description: "Legend\nNA – Not applicable / I do not use this\n1 – Not comfortable – I need guidance to use it\n2 – Somewhat comfortable – I can use it with occasional help\n3 – Comfortable – I can use it independently\n4 – Very comfortable – I can use it efficiently and creatively",
            rows: [
              "Generative AI (e.g., ChatGPT, Claude, Gemini)",
              "Healthcare-specific AI / EMR systems (e.g., Dentrix, Epic, Athenahealth)",
              "Data analysis & reporting tools with AI (e.g., Excel / Sheets AI features, dashboards)",
              "Task & workflow automation AI (e.g., scheduling bots, reminders)"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          {
            id: "dental_receptionist_ai_usage_areas",
            type: "checkbox",
            label: "In which areas do you currently use AI the most? (Select all that apply)",
            options: [
              "Writing or drafting emails/messages",
              "Summarizing notes or documentation",
              "Research or information lookup",
              "Data analysis or reporting",
              "Task automation or workflow support",
              "Organizing information or documentation",
              "I currently do not use AI tools"
            ],
            required: true,
          },
          {
            id: "dental_receptionist_ai_skills_to_learn",
            type: "checkbox",
            label: "What AI-related skills would you like to learn to improve your work?",
            options: [
              "Writing emails or messages faster with AI",
              "Summarizing patient/client notes",
              "Automating repetitive tasks",
              "Creating reports using AI tools",
              "Workflow automation",
              "Prompt writing / prompting techniques",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: true,
          }
        ],
      },
      getVASectionVI("Dental Receptionist")
    ],
    "Dental Biller": [
      {
        id: "dental-biller-tasks-workflow",
        title: "PART II - Tasks and Workflow",
        questions: [
          {
            id: "dental_biller_task_difficulty",
            type: "grid",
            label: "How easy or difficult is it for you to complete the following tasks in your role?",
            description: "Legend:\nNA – Not Applicable / Not part of my role\n1 – Very Difficult – I often struggle and need help\n2 – Difficult – I can do it but sometimes need support\n3 – Manageable – I can perform the task independently\n4 – Easy – I can perform the task quickly and confidently",
            rows: [
              "Claim Creation, Submission & Attachments → Submitting clean claims with correct codes and documentation",
              "Rejection Handling → Fixing clearinghouse/payer rejections before processing",
              "Payment Posting & Reconciliation → Posting EOB/ERA and patient payments, verifying accuracy",
              "Denials, Appeals & AR Follow-Up → Resolving denials, resubmitting claims, tracking unpaid balances",
              "Aging Management → Prioritizing claims based on aging (30/60/90+)",
              "Patient Billing & Collections Support → Managing statements, balances, and front desk coordination",
              "Reporting, Compliance & Process Improvement → Tracking KPIs, ensuring coding accuracy, reducing denials"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          getDesiredImprovementsQuestion("dental_biller"),
          {
            id: "dental_biller_time_consuming_tasks",
            type: "checkbox",
            label: "Which tasks take the most time or effort in your workflow? (Select up to 3)",
            options: [
              "Claim Submission Accuracy (Clean Claims with Attachments) → Directly impacts approval rate and reimbursement speed",
              "Denial Management & Resolution → Recovers lost revenue and reduces write-offs",
              "Accounts Receivable (AR) Follow-Up → Drives collections and reduces aging",
              "Insurance Verification & Accurate Estimates → Prevents claim denials and patient dissatisfaction",
              "Payment Posting Accuracy (Insurance & Patient) → Ensures financial accuracy and reporting integrity",
              "Attachment Management (X-rays, Narratives) → Critical for approval of major procedures",
              "Appeals & Resubmissions → Recovers high-value denied claims",
              "Patient Billing & Collections Support → Improves cash flow and reduces outstanding balances",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            maxSelections: 3,
            required: true,
          },
          {
            id: "dental_biller_medical_systems",
            dependsOn: "practice_type",
            dependsOnValue: "Medical",
            type: "checkbox",
            label: "Electronic Medical Record (Medical): (Select all that apply)",
            description: "Please select the systems and tools you actively use in your current role. This helps us understand your actual system exposure and proficiency, so we can provide the right training and support.",
            variant: "grid",
            options: [
              "Athena (AthenaOne / AthenaNet)",
              "Practice Fusion",
              "eClinicalWorks (eCW)",
              "Epic",
              "Cerner",
              "NextGen Healthcare",
              "Kareo / Tebra",
              "DrChrono",
              "AdvancedMD",
              "Office Ally",
              "Meditech",
              "Allscripts",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: false,
          },
          {
            id: "dental_biller_dental_systems",
            dependsOn: "practice_type",
            dependsOnValue: "Dental",
            type: "checkbox",
            label: "Dental PMS: (Select all that apply)",
            description: "Please select the systems and tools you actively use in your current role. This helps us understand your actual system exposure and proficiency, so we can provide the right training and support.",
            variant: "grid",
            options: [
              "Dentrix",
              "Eaglesoft",
              "Open Dental",
              "Curve Dental",
              "ClearDent",
              "ABELDent",
              "Tracker",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: false,
          },
          {
            id: "dental_biller_insurance_tools",
            dependsOn: "practice_type",
            dependsOnValue: ["Medical", "Dental"],
            type: "checkbox",
            label: "Insurance & Eligibility Tools: (Select all that apply)",
            description: "Please select the systems and tools you actively use in your current role. This helps us understand your actual system exposure and proficiency, so we can provide the right training and support.",
            variant: "grid",
            options: [
              "Availity",
              "NaviNet",
              "Waystar",
              "Change Healthcare",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: false,
          },
          {
            id: "dental_biller_other_tools_selection",
            dependsOn: "practice_type",
            dependsOnValue: ["Medical", "Dental"],
            type: "checkbox",
            label: "Other Tools: (Select all that apply)",
            description: "Please select the systems and tools you actively use in your current role. This helps us understand your actual system exposure and proficiency, so we can provide the right training and support.",
            variant: "grid",
            options: [
              "RingCentral",
              "8x8",
              "Zoom",
              "Microsoft Teams",
              "Slack",
              "Google Workspace (Docs, Sheets, Calendar)",
              "Microsoft Office (Outlook, Excel)",
              "Trello",
              "Asana",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: false,
          },
          {
            id: "dental_biller_tool_difficulty",
            type: "grid",
            label: "How easy or difficult is it for you to use the following tools in your daily work?",
            description: "Legend:\nNA – Not Applicable / Not part of my role\n1 – Very Difficult – I often struggle and need help\n2 – Difficult – I can do it but sometimes need support\n3 – Manageable – I can perform the task independently\n4 – Easy – I can perform the task quickly and confidently",
            dynamicRowsFrom: [
              "dental_biller_medical_systems",
              "dental_biller_dental_systems",
              "dental_biller_insurance_tools",
              "dental_biller_other_tools_selection"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          {
            id: "dental_biller_other_tools",
            type: "checkbox",
            label: "What other systems or tools do you use in your workflow? (Select all that apply)",
            options: [
              "VoIP / Phone Systems",
              "CRM Systems",
              "Reporting / Analytics Tools",
              "Spreadsheets (Google Sheets, Excel)",
              "Project Management Tools",
              "Scheduling / Calendar Tools",
              "HRIS / HR Management Systems",
              "Email Management Tools",
              "File Management / Cloud Storage (Google Drive, Dropbox)",
              "Internal Communication Tools (Slack, Microsoft Teams)",
              "Task Management Tools",
              "Documentation / Knowledge Base Tools",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: true,
          }
        ],
      },
      {
        id: "dental-biller-competencies-skills",
        title: "Part III – Competencies / Skills",
        description: "What skills or modules would you like to further strengthen based on your professional growth? (Select the areas where additional upskilling would create the most impact.)",
        questions: [
          {
            id: "dental_biller_core_skills_upskill",
            type: "checkbox",
            label: "Dental Biller – Core Skills\n(Day-to-day billing execution and foundational RCM tasks)",
            options: [
              "Insurance Verification (Basic Eligibility & Coverage Checks)",
              "Treatment Estimate Preparation (Basic OOP calculation)",
              "Claim Creation & Submission (CDT Codes – Basic)",
              "Attachment Upload (X-rays, Narratives – Basic Requirements)",
              "Payment Posting (EOB/ERA – Insurance & Patient)",
              "Basic Denial Identification (Common issues: missing info, eligibility)",
              "Claims Status Follow-Up (Payer portals, basic calls)",
              "EMR/Billing System Navigation (Dentrix, Eaglesoft, etc.)",
              "Patient Billing (Statements, balances)",
              "Basic Accounts Receivable (AR) Follow-Up",
              "Documentation Review for Billing Accuracy",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: true,
          },
          {
            id: "dental_biller_specialized_skills_upskill",
            type: "checkbox",
            label: "Dental Biller – Specialized Skills (Advanced)\n(End-to-end RCM ownership, insurance expertise, and revenue optimization)",
            options: [
              "Advanced Insurance Verification & Benefits Breakdown (Frequencies, limitations, downgrades, waiting periods, annual maximums)",
              "Pre-Authorizations & Insurance Coordination (Submission, follow-ups, approvals for major procedures)",
              "Advanced Claim Submission (Complex Cases: Multi-surface restorations, perio, prosthodontics, ortho)",
              "Attachment & Narrative Optimization (Ensuring proper documentation to maximize approvals)",
              "Denial Management & Appeals (Root cause analysis, resubmissions, and recovery strategies)",
              "Advanced AR Management (Aging & Collections Strategy: Prioritizing high-value claims, reducing 90+ AR)",
              "Payment Reconciliation & Underpayment Analysis (Comparing expected vs actual reimbursement)",
              "Patient Financial Communication (OOP, Estimates, Payment Plans)",
              "Ledger Review & Adjustment Management (Understanding transactions, write-offs, and corrections)",
              "Coordination with Front Desk & Clinical Team (Aligning estimates, procedures, and billing accuracy)",
              "Reporting & KPI Tracking (Monitoring collections, denial trends, case acceptance impact)",
              "Workflow Optimization & Revenue Improvement (Reducing denials, improving clean claim rate, increasing collections)",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: true,
          }
        ],
      },
      {
        id: "dental-biller-communication-skills",
        title: "Part IV - Communication Skills",
        questions: [
          {
            id: "dental_biller_comm_difficulty",
            type: "grid",
            label: "How easy or difficult is it for you to perform the following tasks in your role?",
            description: "Legend:\nNA – Not Applicable / Not part of my role\n1 – Very Difficult – I often struggle and need help\n2 – Difficult – I can do it but sometimes need support\n3 – Manageable – I can perform the task independently\n4 – Easy – I can perform the task quickly and confidently",
            rows: [
              "Handling client calls → Communicating clearly, professionally, and confidently during calls",
              "Responding to client emails/messages → Providing timely, accurate, and well-written responses",
              "Posting updates on group chats / team channels → Sharing clear, concise, and actionable updates with the team",
              "Preparing and submitting reports → Presenting information, updates, and data in a clear and organized manner",
              "Managing appointment scheduling & changes → Communicating schedules, updates, and changes accurately and clearly",
              "Updating documentation & records accurately → Recording complete, accurate, and easy-to-understand information"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          {
            id: "dental_biller_speaking_confidence",
            type: "radio",
            label: "How confident are you that clients or patients clearly understand you when you speak?",
            options: [
              "Very confident – I am easily understood",
              "Confident – Minor repetition may sometimes be needed",
              "Somewhat confident – I occasionally worry about accent or clarity",
              "Not confident – I often feel misunderstood"
            ],
            required: true,
          }
        ],
      },
      {
        id: "dental-biller-ai-essentials",
        title: "Part V - AI Essentials",
        questions: [
          {
            id: "dental_biller_ai_usage",
            type: "radio",
            label: "How much of your current workflow involves the use of AI tools?",
            options: [
              "None – My work is mostly manual",
              "A little – I occasionally use AI to assist with tasks",
              "Moderate – AI helps with several parts of my workflow",
              "A lot – AI is integrated into many of my tasks"
            ],
            required: true,
          },
          {
            id: "dental_biller_ai_tool_comfort",
            type: "grid",
            label: "How comfortable are you using the following AI tools in your work?",
            description: "Legend\nNA – Not applicable / I do not use this\n1 – Not comfortable – I need guidance to use it\n2 – Somewhat comfortable – I can use it with occasional help\n3 – Comfortable – I can use it independently\n4 – Very comfortable – I can use it efficiently and creatively",
            rows: [
              "Generative AI (e.g., ChatGPT, Claude, Gemini)",
              "Healthcare-specific AI / EMR systems (e.g., Dentrix, Epic, Athenahealth)",
              "Data analysis & reporting tools with AI (e.g., Excel / Sheets AI features, dashboards)",
              "Task & workflow automation AI (e.g., scheduling bots, reminders)"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          {
            id: "dental_biller_ai_usage_areas",
            type: "checkbox",
            label: "In which areas do you currently use AI the most? (Select all that apply)",
            options: [
              "Writing or drafting emails/messages",
              "Summarizing notes or documentation",
              "Research or information lookup",
              "Data analysis or reporting",
              "Task automation or workflow support",
              "Organizing information or documentation",
              "I currently do not use AI tools"
            ],
            required: true,
          },
          {
            id: "dental_biller_ai_skills_to_learn",
            type: "checkbox",
            label: "What AI-related skills would you like to learn to improve your work?",
            options: [
              "Writing emails or messages faster with AI",
              "Summarizing patient/client notes",
              "Automating repetitive tasks",
              "Creating reports using AI tools",
              "Workflow automation",
              "Prompt writing / prompting techniques",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: true,
          }
        ],
      },
      getVASectionVI("Dental Biller")
    ],
    "Executive Assistant VA": [
      {
        id: "ea-tasks-workflow",
        title: "PART II - Tasks and Workflow",
        questions: [
          {
            id: "ea_task_difficulty",
            type: "grid",
            label: "How easy or difficult is it for you to complete the following tasks in your role?",
            description: "Legend:\nNA – Not Applicable / Not part of my role\n1 – Very Difficult – I often struggle and need help\n2 – Difficult – I can do it but sometimes need support\n3 – Manageable – I can perform the task independently\n4 – Easy – I can perform the task quickly and confidently",
            rows: [
              "Calendar & Priority Management → Managing executive calendar, meetings, and resolving conflicts",
              "Email & Inbox Management → Organizing inbox, drafting replies, and prioritizing messages",
              "Client & Stakeholder Communication → Professional communication with clients and internal teams",
              "Document Preparation & Management → Creating reports, presentations, and maintaining files",
              "Meeting Support & Documentation → Capturing notes, minutes, and action items",
              "Task Tracking & Follow-Up Management → Monitoring deadlines, deliverables, and projects",
              "Executive Briefing & Reporting → Summarizing key updates and conducting research",
              "Logistics & Travel Coordination → Planning travel, events, and meeting logistics"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          getDesiredImprovementsQuestion("ea"),
          {
            id: "ea_time_consuming_tasks",
            type: "checkbox",
            label: "Which tasks take the most time or effort in your workflow? (Select up to 3)",
            options: [
              "Calendar & Priority Management → Directly impacts executive productivity and time utilization",
              "Inbox & Communication Management → Ensures timely responses and effective communication flow",
              "Task Tracking & Follow-Up Management → Prevents missed deadlines and ensures execution",
              "Meeting Coordination & Preparation → Keeps operations organized and efficient",
              "Executive Briefing & Reporting → Supports decision-making with clear insights",
              "Cross-Functional Coordination → Ensures alignment across teams and projects",
              "Document & Information Management → Maintains organization and accessibility of key information",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            maxSelections: 3,
            required: true,
          },
          {
            id: "ea_medical_systems",
            dependsOn: "practice_type",
            dependsOnValue: "Medical",
            type: "checkbox",
            label: "Electronic Medical Record (Medical): (Select all that apply)",
            description: "Please select the systems and tools you actively use in your current role. This helps us understand your actual system exposure and proficiency, so we can provide the right training and support.",
            variant: "grid",
            options: [
              "Athena (AthenaOne / AthenaNet)",
              "Practice Fusion",
              "eClinicalWorks (eCW)",
              "Epic",
              "Cerner",
              "NextGen Healthcare",
              "Kareo / Tebra",
              "DrChrono",
              "AdvancedMD",
              "Office Ally",
              "Meditech",
              "Allscripts",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: false,
          },
          {
            id: "ea_dental_systems",
            dependsOn: "practice_type",
            dependsOnValue: "Dental",
            type: "checkbox",
            label: "Dental PMS: (Select all that apply)",
            description: "Please select the systems and tools you actively use in your current role. This helps us understand your actual system exposure and proficiency, so we can provide the right training and support.",
            variant: "grid",
            options: [
              "Dentrix",
              "Eaglesoft",
              "Open Dental",
              "Curve Dental",
              "ClearDent",
              "ABELDent",
              "Tracker",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: false,
          },
          {
            id: "ea_insurance_tools",
            dependsOn: "practice_type",
            dependsOnValue: ["Medical", "Dental"],
            type: "checkbox",
            label: "Insurance & Eligibility Tools: (Select all that apply)",
            description: "Please select the systems and tools you actively use in your current role. This helps us understand your actual system exposure and proficiency, so we can provide the right training and support.",
            variant: "grid",
            options: [
              "Availity",
              "NaviNet",
              "Waystar",
              "Change Healthcare",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: false,
          },
          {
            id: "ea_other_tools_selection",
            dependsOn: "practice_type",
            dependsOnValue: ["Medical", "Dental"],
            type: "checkbox",
            label: "Other Tools: (Select all that apply)",
            description: "Please select the systems and tools you actively use in your current role. This helps us understand your actual system exposure and proficiency, so we can provide the right training and support.",
            variant: "grid",
            options: [
              "RingCentral",
              "8x8",
              "Zoom",
              "Microsoft Teams",
              "Slack",
              "Google Workspace (Docs, Sheets, Calendar)",
              "Microsoft Office (Outlook, Excel)",
              "Trello",
              "Asana",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: false,
          },
          {
            id: "ea_tool_difficulty",
            type: "grid",
            label: "How easy or difficult is it for you to use the following tools in your daily work?",
            description: "Legend:\nNA – Not Applicable / Not part of my role\n1 – Very Difficult – I often struggle and need help\n2 – Difficult – I can do it but sometimes need support\n3 – Manageable – I can perform the task independently\n4 – Easy – I can perform the task quickly and confidently",
            dynamicRowsFrom: [
              "ea_medical_systems",
              "ea_dental_systems",
              "ea_insurance_tools",
              "ea_other_tools_selection"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          {
            id: "ea_other_tools",
            type: "checkbox",
            label: "What other systems or tools do you use in your workflow? (Select all that apply)",
            options: [
              "VoIP / Phone Systems",
              "CRM Systems",
              "Reporting / Analytics Tools",
              "Spreadsheets (Google Sheets, Excel)",
              "Project Management Tools",
              "Scheduling / Calendar Tools",
              "HRIS / HR Management Systems",
              "Email Management Tools",
              "File Management / Cloud Storage (Google Drive, Dropbox)",
              "Internal Communication Tools (Slack, Microsoft Teams)",
              "Task Management Tools",
              "Documentation / Knowledge Base Tools",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: true,
          }
        ],
      },
      {
        id: "ea-competencies-skills",
        title: "Part III – Competencies / Skills",
        description: "Which skills or topics would help you perform your role more effectively if you received additional training? (Select the areas where you feel additional support or learning would help you the most.)",
        questions: [
          {
            id: "competencies_skills",
            type: "checkbox",
            label: "Core Skills",
            options: [
              "Inbox & Email Management (Prioritization & Response)",
              "Complex Calendar Management & Meeting Coordination",
              "Travel Planning & Logistics Management",
              "Document Preparation & Presentation Support",
              "Task Tracking & Project Coordination",
              "Professional Communication & Stakeholder Management",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: true,
          },
          {
            id: "specialized_skills",
            type: "checkbox",
            label: "Specialized Skills",
            options: [
              "Executive Reporting & Data Summarization",
              "Event Planning & Coordination",
              "Social Media Management & Personal Branding Support",
              "Basic Financial Tracking & Expense Management",
              "Workflow Automation & Process Optimization",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: true,
          }
        ]
      },
      {
        id: "ea-communication-skills",
        title: "Part IV - Communication Skills",
        questions: [
          {
            id: "ea_comm_difficulty",
            type: "grid",
            label: "How easy or difficult is it for you to perform the following tasks in your role?",
            description: "Legend:\nNA – Not Applicable / Not part of my role\n1 – Very Difficult – I often struggle and need help\n2 – Difficult – I can do it but sometimes need support\n3 – Manageable – I can perform the task independently\n4 – Easy – I can perform the task quickly and confidently",
            rows: [
              "Handling client calls → Communicating clearly, professionally, and confidently during calls",
              "Responding to client emails/messages → Providing timely, accurate, and well-written responses",
              "Posting updates on group chats / team channels → Sharing clear, concise, and actionable updates with the team",
              "Preparing and submitting reports → Presenting information, updates, and data in a clear and organized manner",
              "Managing appointment scheduling & changes → Communicating schedules, updates, and changes accurately and clearly",
              "Updating documentation & records accurately → Recording complete, accurate, and easy-to-understand information"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          {
            id: "ea_speaking_confidence",
            type: "radio",
            label: "How confident are you that clients or patients clearly understand you when you speak?",
            options: [
              "Very confident – I am easily understood",
              "Confident – Minor repetition may sometimes be needed",
              "Somewhat confident – I occasionally worry about accent or clarity",
              "Not confident – I often feel misunderstood"
            ],
            required: true,
          }
        ],
      },
      {
        id: "ea-ai-essentials",
        title: "Part V - AI Essentials",
        questions: [
          {
            id: "ea_ai_usage",
            type: "radio",
            label: "How much of your current workflow involves the use of AI tools?",
            options: [
              "None – My work is mostly manual",
              "A little – I occasionally use AI to assist with tasks",
              "Moderate – AI helps with several parts of my workflow",
              "A lot – AI is integrated into many of my tasks"
            ],
            required: true,
          },
          {
            id: "ea_ai_tool_comfort",
            type: "grid",
            label: "How comfortable are you using the following AI tools in your work?",
            description: "Legend\nNA – Not applicable / I do not use this\n1 – Not comfortable – I need guidance to use it\n2 – Somewhat comfortable – I can use it with occasional help\n3 – Comfortable – I can use it independently\n4 – Very comfortable – I can use it efficiently and creatively",
            rows: [
              "Generative AI (e.g., ChatGPT, Claude, Gemini)",
              "Healthcare-specific AI / EMR systems (e.g., Dentrix, Epic, Athenahealth)",
              "Data analysis & reporting tools with AI (e.g., Excel / Sheets AI features, dashboards)",
              "Task & workflow automation AI (e.g., scheduling bots, reminders)"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          {
            id: "ea_ai_usage_areas",
            type: "checkbox",
            label: "In which areas do you currently use AI the most? (Select all that apply)",
            options: [
              "Writing or drafting emails/messages",
              "Summarizing notes or documentation",
              "Research or information lookup",
              "Data analysis or reporting",
              "Task automation or workflow support",
              "Organizing information or documentation",
              "I currently do not use AI tools"
            ],
            required: true,
          },
          {
            id: "ea_ai_skills_to_learn",
            type: "checkbox",
            label: "What AI-related skills would you like to learn to improve your work?",
            options: [
              "Writing emails or messages faster with AI",
              "Summarizing patient/client notes",
              "Automating repetitive tasks",
              "Creating reports using AI tools",
              "Workflow automation",
              "Prompt writing / prompting techniques",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: true,
          }
        ],
      },
      getVASectionVI("Executive Assistant VA")
    ],
    "General Business VA": [
      {
        id: "business-tasks-workflow",
        title: "PART II - Tasks and Workflow",
        questions: [
          {
            id: "business_task_difficulty",
            type: "grid",
            label: "How easy or difficult is it for you to complete the following tasks in your role?",
            description: "Legend:\nNA – Not Applicable / Not part of my role\n1 – Very Difficult – I often struggle and need help\n2 – Difficult – I can do it but sometimes need support\n3 – Manageable – I can perform the task independently\n4 – Easy – I can perform the task quickly and confidently",
            rows: [
              "Lead Generation, CRM & Outreach → Sourcing leads, managing pipeline, and conducting outreach/follow-ups",
              "Social Media, Content & Email Marketing → Managing posts, campaigns, and basic performance tracking",
              "Order, Inventory & Vendor Coordination → Managing orders, stock, and supplier communication",
              "Inbox, Calendar & Data Management → Handling emails, scheduling, records, and documentation",
              "Customer Communication & Issue Handling → Responding to inquiries, resolving concerns, escalating when needed",
              "Task Tracking, Reporting & Workflow Coordination → Monitoring tasks, updating dashboards, and ensuring process flow"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          getDesiredImprovementsQuestion("gb"),
          {
            id: "business_time_consuming_tasks",
            type: "checkbox",
            label: "Which tasks take the most time or effort in your workflow? (Select up to 3)",
            options: [
              "Lead Generation & Sales Follow-Ups → Directly impacts revenue and pipeline growth",
              "CRM Management & Pipeline Tracking → Ensures visibility and conversion of leads",
              "Customer Support & Client Communication → Drives customer satisfaction and retention",
              "Order Processing & Operations Coordination → Ensures smooth business operations and delivery",
              "Email & Inbox Management → Maintains communication flow and responsiveness",
              "Marketing Support & Lead Generation Activities → Supports brand growth and demand generation",
              "Task Tracking & Follow-Up Management → Ensures execution and prevents missed opportunities",
              "Reporting & Performance Tracking → Supports data-driven decisions",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            maxSelections: 3,
            required: true,
          },
          {
            id: "gb_medical_systems",
            dependsOn: "practice_type",
            dependsOnValue: "Medical",
            type: "checkbox",
            label: "Electronic Medical Record (Medical): (Select all that apply)",
            description: "Please select the systems and tools you actively use in your current role. This helps us understand your actual system exposure and proficiency, so we can provide the right training and support.",
            variant: "grid",
            options: [
              "Athena (AthenaOne / AthenaNet)",
              "Practice Fusion",
              "eClinicalWorks (eCW)",
              "Epic",
              "Cerner",
              "NextGen Healthcare",
              "Kareo / Tebra",
              "DrChrono",
              "AdvancedMD",
              "Office Ally",
              "Meditech",
              "Allscripts",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: false,
          },
          {
            id: "gb_dental_systems",
            dependsOn: "practice_type",
            dependsOnValue: "Dental",
            type: "checkbox",
            label: "Dental PMS: (Select all that apply)",
            description: "Please select the systems and tools you actively use in your current role. This helps us understand your actual system exposure and proficiency, so we can provide the right training and support.",
            variant: "grid",
            options: [
              "Dentrix",
              "Eaglesoft",
              "Open Dental",
              "Curve Dental",
              "ClearDent",
              "ABELDent",
              "Tracker",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: false,
          },
          {
            id: "gb_insurance_tools",
            dependsOn: "practice_type",
            dependsOnValue: ["Medical", "Dental"],
            type: "checkbox",
            label: "Insurance & Eligibility Tools: (Select all that apply)",
            description: "Please select the systems and tools you actively use in your current role. This helps us understand your actual system exposure and proficiency, so we can provide the right training and support.",
            variant: "grid",
            options: [
              "Availity",
              "NaviNet",
              "Waystar",
              "Change Healthcare",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: false,
          },
          {
            id: "gb_other_tools_selection",
            dependsOn: "practice_type",
            dependsOnValue: ["Medical", "Dental"],
            type: "checkbox",
            label: "Other Tools: (Select all that apply)",
            description: "Please select the systems and tools you actively use in your current role. This helps us understand your actual system exposure and proficiency, so we can provide the right training and support.",
            variant: "grid",
            options: [
              "RingCentral",
              "8x8",
              "Zoom",
              "Microsoft Teams",
              "Slack",
              "Google Workspace (Docs, Sheets, Calendar)",
              "Microsoft Office (Outlook, Excel)",
              "Trello",
              "Asana",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: false,
          },
          {
            id: "gb_tool_difficulty",
            type: "grid",
            label: "How easy or difficult is it for you to use the following tools in your daily work?",
            description: "Legend:\nNA – Not Applicable / Not part of my role\n1 – Very Difficult – I often struggle and need help\n2 – Difficult – I can do it but sometimes need support\n3 – Manageable – I can perform the task independently\n4 – Easy – I can perform the task quickly and confidently",
            dynamicRowsFrom: [
              "gb_medical_systems",
              "gb_dental_systems",
              "gb_insurance_tools",
              "gb_other_tools_selection"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          {
            id: "gb_other_tools",
            type: "checkbox",
            label: "What other systems or tools do you use in your workflow? (Select all that apply)",
            options: [
              "VoIP / Phone Systems",
              "CRM Systems",
              "Reporting / Analytics Tools",
              "Spreadsheets (Google Sheets, Excel)",
              "Project Management Tools",
              "Scheduling / Calendar Tools",
              "HRIS / HR Management Systems",
              "Email Management Tools",
              "File Management / Cloud Storage (Google Drive, Dropbox)",
              "Internal Communication Tools (Slack, Microsoft Teams)",
              "Task Management Tools",
              "Documentation / Knowledge Base Tools",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: true,
          }
        ],
      },
      {
        id: "gb-competencies-skills",
        title: "Part III – Competencies / Skills",
        description: "Which skills or topics would help you perform your role more effectively if you received additional training? (Select the areas where you feel additional support or learning would help you the most.)",
        questions: [
          {
            id: "competencies_skills",
            type: "checkbox",
            label: "Core Skills",
            options: [
              "General Administrative Support & Data Entry",
              "Customer Service & Inquiry Handling (Email/Chat)",
              "Basic Social Media Management & Posting",
              "Research & Information Organization",
              "Task Management & Daily Reporting",
              "Professional Communication & Team Collaboration",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: true,
          },
          {
            id: "specialized_skills",
            type: "checkbox",
            label: "Specialized Skills",
            options: [
              "Lead Generation & Basic CRM Management",
              "Content Creation & Basic Graphic Design (Canva, etc.)",
              "Email Marketing & Newsletter Support",
              "E-commerce Support (Order Processing, Product Listing)",
              "Basic Bookkeeping & Invoice Management",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: true,
          }
        ]
      },
      {
        id: "gb-communication-skills",
        title: "Part IV - Communication Skills",
        questions: [
          {
            id: "gb_comm_difficulty",
            type: "grid",
            label: "How easy or difficult is it for you to perform the following tasks in your role?",
            description: "Legend:\nNA – Not Applicable / Not part of my role\n1 – Very Difficult – I often struggle and need help\n2 – Difficult – I can do it but sometimes need support\n3 – Manageable – I can perform the task independently\n4 – Easy – I can perform the task quickly and confidently",
            rows: [
              "Handling client calls → Communicating clearly, professionally, and confidently during calls",
              "Responding to client emails/messages → Providing timely, accurate, and well-written responses",
              "Posting updates on group chats / team channels → Sharing clear, concise, and actionable updates with the team",
              "Preparing and submitting reports → Presenting information, updates, and data in a clear and organized manner",
              "Managing appointment scheduling & changes → Communicating schedules, updates, and changes accurately and clearly",
              "Updating documentation & records accurately → Recording complete, accurate, and easy-to-understand information"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          {
            id: "gb_speaking_confidence",
            type: "radio",
            label: "How confident are you that clients or patients clearly understand you when you speak?",
            options: [
              "Very confident – I am easily understood",
              "Confident – Minor repetition may sometimes be needed",
              "Somewhat confident – I occasionally worry about accent or clarity",
              "Not confident – I often feel misunderstood"
            ],
            required: true,
          }
        ],
      },
      {
        id: "gb-ai-essentials",
        title: "Part V - AI Essentials",
        questions: [
          {
            id: "gb_ai_usage",
            type: "radio",
            label: "How much of your current workflow involves the use of AI tools?",
            options: [
              "None – My work is mostly manual",
              "A little – I occasionally use AI to assist with tasks",
              "Moderate – AI helps with several parts of my workflow",
              "A lot – AI is integrated into many of my tasks"
            ],
            required: true,
          },
          {
            id: "gb_ai_tool_comfort",
            type: "grid",
            label: "How comfortable are you using the following AI tools in your work?",
            description: "Legend\nNA – Not applicable / I do not use this\n1 – Not comfortable – I need guidance to use it\n2 – Somewhat comfortable – I can use it with occasional help\n3 – Comfortable – I can use it independently\n4 – Very comfortable – I can use it efficiently and creatively",
            rows: [
              "Generative AI (e.g., ChatGPT, Claude, Gemini)",
              "Healthcare-specific AI / EMR systems (e.g., Dentrix, Epic, Athenahealth)",
              "Data analysis & reporting tools with AI (e.g., Excel / Sheets AI features, dashboards)",
              "Task & workflow automation AI (e.g., scheduling bots, reminders)"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          {
            id: "gb_ai_usage_areas",
            type: "checkbox",
            label: "In which areas do you currently use AI the most? (Select all that apply)",
            options: [
              "Writing or drafting emails/messages",
              "Summarizing notes or documentation",
              "Research or information lookup",
              "Data analysis or reporting",
              "Task automation or workflow support",
              "Organizing information or documentation",
              "I currently do not use AI tools"
            ],
            required: true,
          },
          {
            id: "gb_ai_skills_to_learn",
            type: "checkbox",
            label: "What AI-related skills would you like to learn to improve your work?",
            options: [
              "Writing emails or messages faster with AI",
              "Summarizing patient/client notes",
              "Automating repetitive tasks",
              "Creating reports using AI tools",
              "Workflow automation",
              "Prompt writing / prompting techniques",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: true,
          }
        ],
      },
    ],
  },
};

export const SUPPORT_SURVEY_SCHEMA: SupportSurveySchema = {
  initial: {
    id: "support-role",
    title: "Support Role Information",
    description: "Dear Team,\n\nWe’re excited to announce that for this quarter, we are starting the development of our VA Upskilling Program! \n\nThis program will focus on strengthening VA skills, boosting retention, and creating practical training that truly supports them in their roles. Your insights in this survey will help us design a program that addresses real challenges and maximizes VA impact for our clients.\n\nThis survey will take 3–5 minutes to complete.\n\nThank you for sharing your insights!",
    questions: [
      {
        id: "full_name",
        type: "text",
        label: "Name (First Name, Last Name)",
        required: true,
      },
      {
        id: "support_email",
        type: "text",
        label: "Email",
        required: true,
      },
      {
        id: "support_role",
        type: "radio",
        label: "What is your role in MMM Support?",
        options: ["CDVO / OS", "Sales and Placement"],
        required: true,
      },
    ],
  },
  roleSections: {
    "CDVO / OS": [
      {
        id: "cdvo-client-feedback",
        title: "Part II - Client Feedback & Skill Patterns",
        questions: [
          {
            id: "cdvo_skills_meet_expectations",
            type: "checkbox",
            label: "Based on client feedback, which VA skills most often meet expectations? (Select all that apply)",
            options: [
              "Role-specific technical skills",
              "Communication skills (verbal/written clarity, client-facing tone)",
              "AI/tool proficiency",
              "Scheduling or workflow proficiency",
              "Documentation / reporting proficiency",
              "Other"
            ],
            optionsWithInputs: ["Role-specific technical skills", "Other"],
            required: true,
          },
          {
            id: "cdvo_skills_need_improvement",
            type: "checkbox",
            label: "Based on client feedback, which VA skills are most often flagged as needing improvement? (Select all that apply)",
            options: [
              "Role-specific technical skill gaps",
              "Communication skills gaps (verbal/written clarity, client-facing tone)",
              "AI/tool proficiency gaps",
              "Scheduling or workflow errors",
              "Documentation / reporting errors",
              "Other"
            ],
            optionsWithInputs: ["Role-specific technical skill gaps", "Other"],
            required: true,
          },
          {
            id: "cdvo_skill_gaps_dissatisfaction",
            type: "checkbox",
            label: "Which skill gaps identified from client feedback most often lead to client dissatisfaction, replacement, or cancellations? (Select up to 3)",
            options: [
              "Role-specific technical skill gaps",
              "Communication skills gaps (verbal/written clarity, client-facing tone)",
              "Lack of proactive communication",
              "Poor understanding of instructions",
              "Inconsistent output quality / attention to detail",
              "Slow response time / lack of urgency",
              "Weak ownership and accountability",
              "Inability to ask the right questions",
              "Tool/process gaps",
              "Workflow errors",
              "Documentation / reporting errors",
              "AI proficiency gaps"
            ],
            optionsWithInputs: ["Role-specific technical skill gaps"],
            maxSelections: 3,
            required: true,
          },
          {
            id: "cdvo_additional_suggestions",
            type: "text",
            label: "Is there any other skill, training topic, or support that was not covered that you believe would help you place more VAs successfully? Please share your suggestions.",
            required: false,
          }
        ]
      },
      {
        id: "cdvo-communication-skills",
        title: "Part III - Communication Skills",
        questions: [
          {
            id: "cdvo_comm_criticality_grid",
            type: "grid",
            label: "Based on your client interactions and their feedback, how critical are the following communication skills for a VA to succeed in their role and avoid cancellations or replacements?",
            description: "Legend:\n1 – Not so critical: VA can still succeed even if weak in this area\n2 – Somewhat critical: Weakness may cause minor challenges\n3 – Critical: Weakness may lead to cancellation or replacement\n4 – Extremely critical: Poor performance in this area likely leads to cancellation or replacement",
            rows: [
              "Handling client calls → Communicating clearly, professionally, and confidently during calls",
              "Responding to client emails/messages → Providing timely, accurate, and well-written responses",
              "Posting updates on group chats / team channels → Sharing clear, concise, and actionable updates with the team",
              "Preparing and submitting reports → Presenting information, updates, and data in a clear and organized manner",
              "Managing appointment scheduling & changes → Communicating schedules, updates, and changes accurately and clearly",
              "Updating documentation & records accurately → Recording complete, accurate, and easy-to-understand information"
            ],
            columns: ["1", "2", "3", "4"],
            required: true,
          },
          {
            id: "cdvo_comm_improvement_impact",
            type: "checkbox",
            label: "Which communication skills, if strengthened, would most improve VA performance and client satisfaction? (Select up to 3)",
            options: [
              "Clear & Concise Written Communication (emails, chat updates, task summaries that are easy to understand and actionable)",
              "Active Listening & Accurate Understanding of Client Needs (capturing requirements correctly the first time, minimizing rework)",
              "Proactive Communication & Status Updates (providing timely updates, flagging risks early, not waiting to be asked)",
              "Professional Tone & Client-Facing Etiquette (polished, respectful, and appropriate communication across channels)",
              "Asking Clarifying Questions (knowing when and how to ask the right questions to avoid assumptions)",
              "Verbal Communication & Confidence (calls/meetings)",
              "Responsiveness & Turnaround Time in Communication (speed and reliability in replies without sacrificing quality)",
              "Cross-Cultural Communication Awareness (adapting tone, expectations, and style based on client background)"
            ],
            maxSelections: 3,
            required: true,
          }
        ]
      },
      {
        id: "cdvo-ai-essentials",
        title: "Part IV - AI Essentials",
        questions: [
          {
            id: "cdvo_critical_ai_tools",
            type: "checkbox",
            label: "Based on your observations, which AI/tools are most critical for VA performance in their role? (Select all that apply)",
            options: [
              "Generative AI (ChatGPT, Claude, Gemini)",
              "Role-specific systems (EMR, CRM, Dentrix, etc.)",
              "Reporting / dashboards / analytics tools with AI",
              "Scheduling / workflow automation tools"
            ],
            required: true,
          },
          {
            id: "cdvo_lacking_ai_skills",
            type: "checkbox",
            label: "Which AI/tool skills do VAs most often lack, affecting their performance or client satisfaction? (Select all that apply)",
            options: [
              "Generative AI (ChatGPT, Claude, Gemini)",
              "Role-specific systems (EMR, CRM, Dentrix, etc.)",
              "Reporting / dashboards / analytics tools with AI",
              "Scheduling / workflow automation tools"
            ],
            required: true,
          },
          {
            id: "cdvo_ai_improvement_impact",
            type: "checkbox",
            label: "Which AI/tool skills, if strengthened, would most improve VA performance and client satisfaction? (Select up to 3)",
            options: [
              "Generative AI (ChatGPT, Claude, Gemini)",
              "Role-specific systems (EMR, CRM, Dentrix, etc.)",
              "Reporting / dashboards / analytics tools with AI",
              "Scheduling / workflow automation tools"
            ],
            maxSelections: 3,
            required: true,
          }
        ]
      }
    ],
    "Sales and Placement": [
      {
        id: "sales-placement-ease",
        title: "Part II - Placement Ease, Challenge, and Recommendation",
        questions: [
          {
            id: "placement_difficulty_grid",
            type: "grid",
            label: "Rate how easy or difficult it is to place the following VA roles successfully, based on skills and client needs:",
            description: "Legend:\n1 – Very difficult\n2 – Difficult\n3 – Easy\n4 – Very easy",
            rows: [
              "Medical Admin Assistant",
              "Medical Biller",
              "Medical Receptionist",
              "Dental Biller",
              "Dental Receptionist",
              "Medical Scribe",
              "Health Educator"
            ],
            columns: ["1", "2", "3", "4"],
            required: true,
          },
          {
            id: "challenging_roles_skill_gaps",
            type: "textarea",
            label: "For the challenging role(s), which skill areas tend to be lacking and make placements harder? (Write all in the space provided below)",
            required: true,
          },
          {
            id: "skill_gaps_frequency",
            type: "radio",
            label: "How often do these skills gaps prevent placements from closing?",
            options: [
              "Almost always – placements fail if gap exists",
              "Frequently – gaps create challenges but can sometimes work around",
              "Occasionally – gaps cause minor delays/issues",
              "Rarely – gaps don’t affect placements significantly"
            ],
            required: true,
          },
          {
            id: "impactful_skill_areas",
            type: "checkbox",
            label: "Which skill areas, if strengthened, would have the biggest impact on placement success? (Select up to 3)",
            options: [
              "Core VA Skills (scheduling, task/workflow management, data accuracy, system navigation)",
              "Communication Skills (verbal, written, comprehension, client interaction)",
              "Role-Specific / Technical Skills (insurance, billing, intake, pre-auth, scribing)",
              "AI & Digital Skills (AI tools, automation, system adaptability)",
              "Professional Readiness (accountability, attention to detail, problem-solving)",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            maxSelections: 3,
            required: true,
          },
          {
            id: "va_roles_difficult_to_place",
            type: "checkbox",
            label: "Which VA roles are most difficult to place due to current skill gaps? (Select all that apply and indicate missing skills per role)",
            options: [
              "Dental Biller",
              "Dental Receptionist",
              "Medical Scribe",
              "Health Educator",
              "Medical Biller",
              "Medical Receptionist",
              "Medical Administrative Assistant",
              "Other roles"
            ],
            optionsWithInputs: [
              "Dental Biller",
              "Dental Receptionist",
              "Medical Scribe",
              "Health Educator",
              "Medical Biller",
              "Medical Receptionist",
              "Medical Administrative Assistant",
              "Other roles"
            ],
            required: true,
          },
          {
            id: "fix_va_readiness",
            type: "radio",
            label: "If you could fix one thing about VA readiness that would immediately improve placements, what would it be? (Select one)",
            options: [
              "Stronger communication skills (clarity, confidence, written/verbal communication)",
              "Better understanding of client workflows and real-world tasks",
              "Higher technical proficiency (EMR, CRM, billing, scheduling systems, etc.)",
              "Improved critical thinking and problem-solving",
              "Greater confidence and independence in handling tasks without supervision",
              "Faster responsiveness and sense of urgency",
              "Better attention to detail and accuracy in outputs",
              "Stronger AI/tool usage skills (ChatGPT, automation, reporting tools, etc.)",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: true,
          },
          {
            id: "top_hiring_factors",
            type: "checkbox",
            label: "When clients decide to hire a VA, what are the TOP 3 factors they prioritize most? (Select up to 3)",
            options: [
              "Strong communication skills (spoken/written)",
              "Relevant experience in their field",
              "Confidence & independence",
              "Technical skills (billing, prior auth, EMR/CRM systems, etc.)",
              "Personality / culture fit",
              "Speed / responsiveness",
              "Cost / budget",
              "Attention to detail / accuracy",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            maxSelections: 3,
            required: true,
          }
        ]
      },
      {
        id: "sales-communication-skills",
        title: "Part III - Communication Skills",
        questions: [
          {
            id: "sales_comm_criticality_grid",
            type: "grid",
            label: "Based on your client interactions and their feedback, how critical are the following verbal communication skills for a VA to succeed in client interviews and be placed?",
            description: "Legend:\n1 – Not so critical: VA can still be placed even if weak in this area\n2 – Somewhat critical: Weakness may cause minor challenges\n3 – Critical: Weakness may prevent smooth placement\n4 – Extremely Critical: Poor performance in this area likely prevents placement",
            rows: [
              "Clarity of thought – Expresses ideas logically and clearly",
              "Comprehension – Understands client instructions or questions accurately",
              "Neutral accent / Pronunciation – Easily understandable to clients",
              "Confidence & Professional Tone – Speaks assertively and politely",
              "Grammar / Sentence Accuracy – Uses correct grammar and structures sentences properly"
            ],
            columns: ["1", "2", "3", "4"],
            required: true,
          },
          {
            id: "sales_comm_fail_reasons",
            type: "checkbox",
            label: "Based on your observation , what common verbal or communication issues lead VAs to fail client interviews? (Select all that apply)",
            options: [
              "Does not comprehend questions fully",
              "Vague or unclear responses about skills/experience",
              "Excessive fillers / long pauses / frequent “um,” “uh,” or awkward pauses.",
              "Grammar lapses / sentence structure issues",
              "Thick accent / pronunciation issues",
              "Lacks confidence / hesitant speaking"
            ],
            required: true,
          }
        ]
      },
      {
        id: "sales-ai-essentials",
        title: "Part IV - AI Essentials",
        questions: [
          {
            id: "sales_expected_ai_tools",
            type: "checkbox",
            label: "Based on your conversations with clients, which AI/tools do they expect VAs to be proficient in? (Select all that apply)",
            options: [
              "Generative AI (ChatGPT, Claude, Gemini)",
              "Role-specific systems (EMR, CRM, Dentrix, etc.)",
              "Reporting / dashboards / analytics tools with AI",
              "Scheduling / workflow automation tools",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: true,
          },
          {
            id: "sales_lacking_ai_skills",
            type: "checkbox",
            label: "Which AI/tool skills are most often lacking in VAs and make placements or closing opportunities harder? (Select all that apply)",
            options: [
              "Generative AI (ChatGPT, Claude, Gemini)",
              "Role-specific systems (EMR, CRM, Dentrix, etc.)",
              "Reporting / dashboards / analytics tools with AI",
              "Scheduling / workflow automation tools",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            required: true,
          },
          {
            id: "sales_ai_improvement_impact",
            type: "checkbox",
            label: "Which AI/tool skills, if strengthened, would most improve VA performance and client satisfaction? (Select up to 3)",
            options: [
              "Generative AI (ChatGPT, Claude, Gemini)",
              "Role-specific systems (EMR, CRM, Dentrix, etc.)",
              "Reporting / dashboards / analytics tools with AI",
              "Scheduling / workflow automation tools",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            maxSelections: 3,
            required: true,
          }
        ]
      }
    ]
  }
};

export const FULL_SURVEY_SCHEMA: FullSurveySchema = {
  client: CLIENT_SURVEY_SCHEMA,
  support: SUPPORT_SURVEY_SCHEMA,
};
