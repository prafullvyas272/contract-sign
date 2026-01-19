import cron from "node-cron";
import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/mysql";
import { sendMail } from "@/lib/node-mailer";
let cronStarted = false;

export function callScheduler() {
  if (cronStarted) return;
  cronStarted = true;
  console.log("Cron job started");
  cron.schedule("30 0 * * *", async () => {
    console.log("Runs in 12: 30 AM");
    const dateStart = moment()
      .add(30, "days")
      .startOf("day")
      .format("YYYY-MM-DD");
    const dateEnd = moment().add(30, "days").endOf("day").format("YYYY-MM-DD");

    // Contracts expiring in exactly 30 days (using start and end of day)
    const [contractsExpiring]: any = await pool.query(`
        SELECT * FROM Contracts
        WHERE contract_expiry BETWEEN '${dateStart}' AND '${dateEnd}'
      `);

    // Send emails for these contracts

    for (const contract of contractsExpiring) {
      await sendMail(
        contract.userEmail, // adjust field name
        "Notice - contract will expire in 30 days",
        `Hello, your contract "${contract.title}" will expire on ${moment(contract.contract_expiry).format("DD MMM YYYY")}.`,
      );
    }

    ///send email for 7 days

    const sevenDaysStart = moment()
      .add(7, "days")
      .startOf("day")
      .format("YYYY-MM-DD");
    const sevenDaysEnd = moment()
      .add(7, "days")
      .endOf("day")
      .format("YYYY-MM-DD");

    const [contractsExpiring7]: any = await pool.query(`
  SELECT * FROM Contracts
  WHERE contract_expiry BETWEEN '${sevenDaysStart}' AND '${sevenDaysEnd}'
`);

    for (const contract of contractsExpiring7) {
      await sendMail(
        contract.userEmail,
        "Notice - contract will expire in 7 days",
        `Hello, your contract "${contract.title}" will expire on ${moment(contract.contract_expiry).format("DD MMM YYYY")}.`,
      );
    }

    // Delete expired contracts
    const todayStart = moment().startOf("day").format("YYYY-MM-DD");
    await pool.query(`
        DELETE FROM Contracts
        WHERE contract_expiry < '${todayStart}'
      `);
  });
}
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ status: "Cron job endpoint." });
}
