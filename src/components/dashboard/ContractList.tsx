import React from "react";
import { FileText, Clock, CheckCircle } from "lucide-react";
import type { Contract } from "@/types/dashboard";

interface ContractListProps {
  contracts: Contract[];
}

export function ContractList({ contracts }: ContractListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {contracts.map((contract) => (
        <div
          key={contract.id}
          className="rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-blue-500" />
              <div>
                <h3 className="font-medium">{contract.title}</h3>
                <p className="text-sm text-gray-500">
                  Created on {new Date(contract.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <span
              className={`rounded-full px-2 py-1 text-xs ${contract.status === "signed" ? "bg-green-100 text-green-800" : ""} ${contract.status === "pending" ? "bg-yellow-100 text-yellow-800" : ""} ${contract.status === "expired" ? "bg-red-100 text-red-800" : ""} `}
            >
              {contract.status.charAt(0).toUpperCase() +
                contract.status.slice(1)}
            </span>
          </div>

          <div className="mt-4">
            <h4 className="mb-2 text-sm font-medium text-gray-700">Signers</h4>
            <div className="space-y-2">
              {contract.signers.map((signer, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-600">{signer.email}</span>
                  {signer.status === "signed" ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="mr-1 h-4 w-4" />
                      <span>Signed</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-yellow-600">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>Pending</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
