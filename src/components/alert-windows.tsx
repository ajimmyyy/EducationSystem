import React from "react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@/components/material-tailwind";

interface ConfirmModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  onConfirm: (closeAlert: Function) => void | Promise<void>;
}

const AlertWindows: React.FC<ConfirmModalProps> = ({
  isOpen,
  message,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog open={isOpen} handler={onClose} placeholder={undefined}>
      <DialogHeader placeholder={undefined}>退選課程 </DialogHeader>
      <DialogBody placeholder={undefined}>{message}</DialogBody>
      <DialogFooter placeholder={undefined}>
        <Button
          placeholder={undefined}
          variant="gradient"
          color="green"
          onClick={() => onConfirm(onClose)}
          className="mr-1"
        >
          確定
        </Button>
        <Button
          placeholder={undefined}
          variant="text"
          color="red"
          onClick={onClose}
        >
          取消
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default AlertWindows;
