import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { LoadingBlock } from "../../../components/ui/Spinner/Spinner";
import { ErrorState } from "../../../components/ui/States/ErrorState";
import { useToast } from "../../../components/ui/Toast/ToastProvider";

import { IncidentForm } from "../components/IncidentForm/IncidentForm";
import { useCreateIncident } from "../hooks/useCreateIncident";
import { useUsers } from "../hooks/useUsers";

import styles from "./NewIncidentPage.module.css";

export function NewIncidentPage() {
  const usersQuery = useUsers();
  const createMutation = useCreateIncident();
  const navigate = useNavigate();
  const toast = useToast();
  const [serverError, setServerError] = useState<string | null>(null);

  if (usersQuery.isPending) return <LoadingBlock label="Loading…" />;

  if (usersQuery.isError) {
    return (
      <ErrorState
        title="Couldn't load form"
        message={
          usersQuery.error instanceof Error
            ? usersQuery.error.message
            : "Please try again."
        }
        onRetry={() => usersQuery.refetch()}
      />
    );
  }

  return (
    <div className={styles.page}>
      <Link to="/" className={styles.backLink}>
        <BackIcon /> Back to incidents
      </Link>

      <header>
        <h1 className={styles.title}>New incident</h1>
        <p className={styles.subtitle}>
          Capture the issue, set severity, and assign an owner so the team can
          act.
        </p>
      </header>

      <div className={styles.card}>
        <IncidentForm
          users={usersQuery.data}
          submitting={createMutation.isPending}
          serverError={serverError}
          onCancel={() => navigate("/")}
          onSubmit={(values) => {
            setServerError(null);
            createMutation.mutate(values, {
              onSuccess: (created) => {
                toast.success("Incident created", created.title);
                navigate(`/incidents/${created.id}`);
              },
              onError: (err) => {
                setServerError(err.message);
                toast.error("Couldn't create incident", err.message);
              },
            });
          }}
        />
      </div>
    </div>
  );
}

function BackIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="10 4 6 8 10 12" />
    </svg>
  );
}
