import { Link } from "react-router-dom";

import { Button } from "../../../components/ui/Button/Button";
import { EmptyState } from "../../../components/ui/States/EmptyState";

export function NotFoundPage() {
  return (
    <EmptyState
      title="Page not found"
      message="The page you're looking for doesn't exist."
      action={
        <Link to="/">
          <Button>Back to incidents</Button>
        </Link>
      }
    />
  );
}
