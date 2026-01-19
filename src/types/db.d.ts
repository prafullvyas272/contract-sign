export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "individual" | "company" | "admin";
  company_id: number | null;
  is_verified: number;
  created_at: string;
  updated_at: string;
}

export interface Contract {
  id: number;
  title: string;
  description: string;
  file_path: string;
  created_by: number;
  status: "pending" | "signed" | "rejected";
  company_id: number | null;
  created_at: string;
  updated_at: string;
}
