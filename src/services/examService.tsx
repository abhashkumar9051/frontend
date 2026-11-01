import { API_BASE_URL } from "../config/api";

const API_URL = API_BASE_URL;

// ==========================================
// EXAM
// ==========================================

export interface Exam {
  _id: string;
  name: string;
  shortName: string;
  description: string;
  logo: string;
  order: number;
}

// ==========================================
// SUBJECT
// ==========================================

export interface Subject {
  _id: string;
  examId: string;

  name: string;
  shortName?: string;

  description?: string;
  logo?: string;

  icon?: string;
  color?: string;

  order?: number;
  isActive?: boolean;

  tests?: number;
  questions?: number;
}

export interface ContentSection {
  _id: string;
  examId: string;
  subjectId:
    | string
    | { _id: string; name: string }
    | null;
  title: string;
  placement?: "exam_tab" | "subject_tests";
  order?: number;
  isActive?: boolean;
}

// ==========================================
// TEST SERIES
// ==========================================

export interface TestSeries {
  _id: string;

  examId: string;

  subjectId:
    | string
    | {
        _id: string;
        name: string;
        examId?: string;
      }
    | null;

  sectionId?:
    | string
    | { _id: string; title: string }
    | null;

  title: string;
  name?: string;
  description?: string;

  type?: string;

  price?: number;
  originalPrice?: number;
  isPremium?: boolean;
  isUnlocked?: boolean;

  isActive?: boolean;
}

// ==========================================
// EXAM DETAILS RESPONSE
// ==========================================

export interface ExamDetails {
  exam: Exam;
  subjects: Subject[];
  series: TestSeries[];
  sections: ContentSection[];
}

// ==========================================
// GET ALL EXAMS
// ==========================================

export const getExams =
  async (): Promise<Exam[]> => {
    const response = await fetch(
      `${API_URL}/api/v1/exams`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Unable to fetch exams."
      );
    }

    return data.exams;
  };

// ==========================================
// GET SINGLE EXAM + SUBJECTS + SERIES
// ==========================================

export const getExamById = async (
  examId: string
): Promise<ExamDetails> => {
  const response = await fetch(
    `${API_URL}/api/v1/exams/${examId}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to fetch exam details."
    );
  }

  return {
    exam: data.exam,
    subjects: data.subjects || [],
    series: data.series || [],
    sections: data.sections || [],
  };
};
