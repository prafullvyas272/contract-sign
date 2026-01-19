export interface User {
  id: string;
  name: string;
  email: string;
  role: "individual" | "company";
}

export interface Contract {
  id: string;
  title: string;
  status: "pending" | "signed" | "expired";
  createdAt: string;
  signers: Array<{
    email: string;
    status: "pending" | "signed";
    signedAt?: string;
  }>;
}

export interface Field {
  id: string;
  type: "signature" | "name" | "initials" | "date"|"" | "text";
  position: { x: number; y: number };
  value?: string;
  viewPage: number;
  user?: string;
}
