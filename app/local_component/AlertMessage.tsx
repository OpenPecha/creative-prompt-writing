import { Alert, AlertDescription, AlertTitle } from "~/components/ui";
import { AlertCircle } from "lucide-react";
function AlertMessage({ message }) {
  return (
    <Alert variant="default">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Info</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

export default AlertMessage;
