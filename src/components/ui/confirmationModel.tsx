import React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

interface ConfirmationModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
  heading?: string;
  confirmationBtn: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onConfirm,
  onCancel,
  message,
  heading = "Confirm Action",
  confirmationBtn = "Confirm",
}) => {
  return (
    <AlertDialog.Root open={open}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <AlertDialog.Content className="fixed inset-0 flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
            <AlertDialog.Title className="text-center text-lg font-semibold">
              {heading}
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-2 text-sm text-gray-600">
              {message}
            </AlertDialog.Description>
            <div className="mt-4 flex justify-evenly space-x-2">
              <AlertDialog.Cancel asChild>
                <button
                  onClick={onCancel}
                  className="rounded-md bg-gray-200 px-4 py-2"
                >
                  Cancel
                </button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button
                  onClick={onConfirm}
                  className="rounded-md bg-red-500 px-4 py-2 text-white"
                >
                  {confirmationBtn}
                </button>
              </AlertDialog.Action>
            </div>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export default ConfirmationModal;
