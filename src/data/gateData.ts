export type Subject = {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  questions: number;
  tests: number;
  color: string;
};

export type TestItem = {
  id: string;
  title: string;
  subtitle: string;
  questions: number;
  duration: number;
  marks: number;
  price: number;
  oldPrice?: number;
  badge?: string;
  difficulty: "Easy" | "Moderate" | "Hard" | "Mixed";
  isFree?: boolean;
};

export const gateSubjects: Subject[] = [
  { id: "dsa", name: "Data Structures & Algorithms", shortName: "DSA", icon: "🧠", questions: 1500, tests: 120, color: "#EEF2FF" },
  { id: "os", name: "Operating Systems", shortName: "OS", icon: "💻", questions: 1200, tests: 100, color: "#ECFEFF" },
  { id: "cn", name: "Computer Networks", shortName: "CN", icon: "🌐", questions: 1100, tests: 100, color: "#ECFDF5" },
  { id: "dbms", name: "Database Management Systems", shortName: "DBMS", icon: "🗄️", questions: 1000, tests: 80, color: "#FFF7ED" },
  { id: "coa", name: "Computer Organization", shortName: "COA", icon: "⚙️", questions: 950, tests: 90, color: "#F5F3FF" },
  { id: "toc", name: "Theory of Computation", shortName: "TOC", icon: "∑", questions: 900, tests: 70, color: "#FDF2F8" },
  { id: "cd", name: "Compiler Design", shortName: "CD", icon: "</>", questions: 750, tests: 60, color: "#EFF6FF" },
  { id: "dm", name: "Discrete Mathematics", shortName: "DM", icon: "π", questions: 1000, tests: 80, color: "#F0FDFA" },
];

export const dsaTests: TestItem[] = [
  {
    id: "dsa-complete",
    title: "Data Structures & Algorithms Complete Test Series",
    subtitle: "Full syllabus + topic-wise tests + detailed solutions",
    questions: 50,
    duration: 180,
    marks: 100,
    price: 499,
    oldPrice: 799,
    badge: "Best Seller",
    difficulty: "Mixed",
  },
  {
    id: "dsa-topic",
    title: "Topic-wise DSA Test Series",
    subtitle: "Arrays, Linked Lists, Trees, Graphs and more",
    questions: 40,
    duration: 60,
    marks: 80,
    price: 299,
    oldPrice: 499,
    badge: "40% OFF",
    difficulty: "Mixed",
  },
  {
    id: "dsa-pyq",
    title: "DSA Previous Year Questions",
    subtitle: "GATE previous year questions with solutions",
    questions: 50,
    duration: 90,
    marks: 100,
    price: 199,
    oldPrice: 299,
    badge: "PYQ",
    difficulty: "Hard",
  },
  {
    id: "dsa-free",
    title: "Quick DSA Practice",
    subtitle: "Start practicing with a free mini test",
    questions: 20,
    duration: 30,
    marks: 40,
    price: 0,
    badge: "FREE",
    difficulty: "Moderate",
    isFree: true,
  },
];

export const testQuestions = [
  {
    id: 1,
    question: "Which of the following best describes a stack?",
    options: [
      "A data structure that follows FIFO",
      "A data structure that follows LIFO",
      "A sorted data structure",
      "A graph traversal algorithm",
    ],
    answer: 1,
    marks: 2,
  },
  {
    id: 2,
    question: "What is the average time complexity of searching in a balanced BST?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    answer: 1,
    marks: 2,
  },
  {
    id: 3,
    question: "Which data structure is commonly used for BFS?",
    options: ["Stack", "Queue", "Heap", "Hash table"],
    answer: 1,
    marks: 2,
  },
  {
    id: 4,
    question: "Which traversal of a BST produces sorted order?",
    options: ["Preorder", "Postorder", "Inorder", "Level order"],
    answer: 2,
    marks: 2,
  },
  {
    id: 5,
    question: "Which structure is best suited for implementing recursion?",
    options: ["Queue", "Stack", "Graph", "Hash map"],
    answer: 1,
    marks: 2,
  },
];