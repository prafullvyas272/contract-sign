import pool from "@/lib/mysql";

interface CreateLog {
  log: string;
  createdBy?: number;
  type?: number;
  contractId?: number;
  signatureId?: number;
  userId?: number;
}

export async function createLog(body: CreateLog) {
  if (!body.log) {
    throw new Error("Log is required");
  }
  const { log, createdBy, type, contractId, signatureId, userId } = body;

  const query = `
    INSERT INTO Logs (log, createdBy, type, contractId, signatureId, userId)
    VALUES (?, ?, ?, ?, ?, ?)
`;

  const values = [
    log,
    createdBy || null,
    type || 1,
    contractId || null,
    signatureId || null,
    userId || null,
  ];

  const [createLog] = await pool.query(query, values);
  return createLog;
}
