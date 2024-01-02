import { useState } from "react";

const useAlertWindows = ({
  message,
  handleConfirm,
}: {
  message: string;
  // eslint-disable-next-line no-unused-vars
  handleConfirm: (closeAlert: Function) => void | Promise<void>;
}) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const openAlert = () => {
    setIsAlertOpen(true);
    setAlertMessage(message);
  };

  const closeAlert = () => {
    setIsAlertOpen(false);
  };

  return {
    isAlertOpen,
    alertMessage,
    openAlert,
    closeAlert,
    handleConfirm,
  };
};

export default useAlertWindows;
