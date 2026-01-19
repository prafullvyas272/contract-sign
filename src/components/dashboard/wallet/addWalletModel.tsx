"use client";

import React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Input } from "../Input";

interface AddWalletModelProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (amount:number) => void;
}

const AddWalletModel: React.FC<AddWalletModelProps> = ({ open, onClose,onConfirm }) => {
  const [amount, setAmount] = React.useState<string>("");
  const [error, setError] = React.useState<string | null>(null);

  const handleAddAmount = () => {
    const parsedAmount = parseFloat(amount);

    // Validation logic
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid amount greater than 0.");
      return;
    }

    onConfirm(parsedAmount);
    setAmount("");
    setError(null);
  };

  return (
    <AlertDialog.Root open={open}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <AlertDialog.Content className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <AlertDialog.Title className="text-center text-lg font-semibold">
              Add Amount
            </AlertDialog.Title>
            <div className="mt-4">
              <Input
                label="Amount"
                type="number"
                placeholder="$"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError(null); // Clear error on change
                }}
              />
              {error && (
                <p className="text-red-500 text-sm mt-2">
                  {error}
                </p>
              )}
            </div>
            <div className="mt-6 flex justify-evenly space-x-2">
              <AlertDialog.Cancel asChild>
                <button
                  onClick={onClose}
                  className="rounded-md bg-gray-200 px-4 py-2"
                >
                  Cancel
                </button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button
                  onClick={handleAddAmount}
                  className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Add
                </button>
              </AlertDialog.Action>
            </div>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export default AddWalletModel;
