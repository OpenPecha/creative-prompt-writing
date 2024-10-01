import { Alert, AlertDescription, AlertTitle } from "~/components/ui";
import { AlertCircle } from "lucide-react";
function AlertMessage({ message }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

export default AlertMessage;
