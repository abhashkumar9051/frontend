// const API_URL = "http://10.0.2.2:6001";

// export interface Exam {
//   _id: string;
//   name: string;
//   shortName: string;
//   description: string;
//   logo: string;
//   order: number;
// }

// export const getExams = async (): Promise<Exam[]> => {
//   const response = await fetch(
//     `${API_URL}/api/v1/exams`
//   );

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(
//       data.message ||
//         "Unable to fetch exams."
//     );
//   }

//   return data.exams;
// };

const API_URL =
  "http://10.0.2.2:6001";

export interface Exam {
  _id: string;
  name: string;
  shortName: string;
  description: string;
  logo: string;
  order: number;
}

// ==========================================
// GET ALL EXAMS
// ==========================================

export const getExams =
  async (): Promise<Exam[]> => {
    const response = await fetch(
      `${API_URL}/api/v1/exams`
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Unable to fetch exams."
      );
    }

    return data.exams;
  };

// ==========================================
// GET SINGLE EXAM
// ==========================================

export const getExamById = async (
  examId: string
): Promise<Exam> => {
  const response = await fetch(
    `${API_URL}/api/v1/exams/${examId}`
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to fetch exam."
    );
  }

  return data.exam;
};