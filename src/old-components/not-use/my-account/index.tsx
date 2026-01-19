"use client";

import React, { Suspense, useEffect, useState } from "react";
import apiClient from "@/old-http/apiClient";
import moment from "moment";

const MyAccountList = (data: any) => {
  const [filteredRecords, setFilteredRecords] = useState<any>([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await apiClient.get("/get-ids");
        const filtered = data?.data?.filter((record: any) =>
          response.data?.data?.items.includes(record.id),
        );
        setFilteredRecords(filtered);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []);

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Document Name</th>
          <th>Signatories</th>
          <th>Date Completed</th>
          <th>Download</th>
        </tr>
      </thead>
      <tbody>
        {filteredRecords?.length > 0 ? (
          filteredRecords?.map((document: any) => {
            const signatories = document?.recipients
              .map((recipient: any) => recipient.name)
              .join(", ");

            return (
              <tr key={document?.id}>
                <td>{document?.title || "No Title"}</td>
                <td>{signatories || "No Signatories"}</td>
                <td>
                  {moment(document.completed_at).format("MM/DD/YYYY h:mm:ss A")}
                </td>
                <td>
                  {document?.deliverable?.url ? (
                    <a
                      href={document?.deliverable?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </a>
                  ) : (
                    "File Generation in Progress..."
                  )}
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={4} className="fw-bold text-center">
              No Records Found!
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
export default MyAccountList;
