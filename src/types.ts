export type Role =
  | "Medical Receptionist"
  | "Medical Administrative Assistant"
  | "Medical Biller"
  | "Medical Scribe"
  | "Health Educator"
  | "Dental Receptionist"
  | "Dental Biller"
  | "Executive Assistant VA"
  | "General Business VA";

export type SupportRole = "CDVO and OS" | "Sales and Placement";

export type UserType = "Virtual Assistant (Medical & Business)" | "Support Team";

export type UserRole = "admin" | "responder";

export type QuestionType =
  | "text"
  | "textarea"
  | "radio"
  | "checkbox"
  | "scale"
  | "grid";

export interface Question {
  id: string;
  type: QuestionType;
  label: string;
  description?: string;
  variant?: "default" | "grid";
  options?: string[]; // For radio and checkbox
  optionsWithInputs?: string[]; // Options that should trigger a text input
  rows?: string[]; // For grid
  rowsWithInputs?: string[]; // Grid rows that should trigger a text input
  columns?: string[]; // For grid
  required?: boolean;
  maxSelections?: number;
  min?: number; // For scale
  max?: number; // For scale
  minLabel?: string; // For scale
  maxLabel?: string; // For scale
  stepLabels?: Record<number, string>; // For scale
  dynamicRowsFrom?: string | string[]; // ID(s) of checkbox question(s) to pull rows from
  dependsOn?: string; // ID of the question this question depends on
  dependsOnValue?: string | string[]; // Specific value(s) from dependsOn that trigger visibility
  optionsMap?: Record<string, string[]>; // Map of values from dependsOn to options for this question
}

export interface Section {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

export interface SurveySchema {
  profile: Section;
  roleSections: Record<Role, Section[]>;
}

export interface ClientSurveySchema {
  initial: Section;
  roleSections: Record<Role, Section[]>;
}

export interface SupportSurveySchema {
  initial: Section;
  roleSections: Record<string, Section[]>;
}

export interface FullSurveySchema {
  client: ClientSurveySchema;
  support: SupportSurveySchema;
}

export interface SurveyResponse {
  [questionId: string]: string | string[] | Record<string, string>;
}
