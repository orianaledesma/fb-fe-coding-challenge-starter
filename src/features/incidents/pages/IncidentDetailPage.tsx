import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Button } from "../../../components/ui/Button/Button";
import { Dialog } from "../../../components/ui/Dialog/Dialog";
import { Select } from "../../../components/ui/Select/Select";
import { LoadingBlock } from "../../../components/ui/Spinner/Spinner";
import { StatusBadge } from "../../../components/ui/Badge/StatusBadge";
import { SeverityBadge } from "../../../components/ui/Badge/SeverityBadge";
import { ErrorState } from "../../../components/ui/States/ErrorState";
import { useToast } from "../../../components/ui/Toast/ToastProvider";
import { HttpError } from "../../../lib/http";

import { useIncident } from "../hooks/useIncident";
import { useUsers } from "../hooks/useUsers";
import { useUpdateIncident } from "../hooks/useUpdateIncident";
import { useDeleteIncident } from "../hooks/useDeleteIncident";
import { STATUS_OPTIONS } from "../schemas/incidentSchema";
import { AssigneePicker } from "../components/AssigneePicker/AssigneePicker";
import { StatusTimeline } from "../components/StatusTimeline/StatusTimeline";
import { formatDateTime, relativeTime } from "../utils/formatDate";

import styles from "./IncidentDetailPage.module.css";

export function IncidentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const incidentQuery = useIncident(id);
  const usersQuery = useUsers();
  const updateMutation = useUpdateIncident();
  const deleteMutation = useDeleteIncident();

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  if (incidentQuery.isPending) {
    return <LoadingBlock label="Loading incident…" />;
  }

  if (incidentQuery.isError) {
    const isNotFound =
      incidentQuery.error instanceof HttpError &&
      incidentQuery.error.status === 404;
    return (
      <ErrorState
        title={isNotFound ? "Incident not found" : "Couldn't load incident"}
        message={
          isNotFound
            ? "The incident you're looking for doesn't exist or was deleted."
            : incidentQuery.error instanceof Error
              ? incidentQuery.error.message
              : "Please try again."
        }
        onRetry={isNotFound ? undefined : () => incidentQuery.refetch()}
      />
    );
  }

  const incident = incidentQuery.data;
  const users = usersQuery.data ?? [];
  const assignee = incident.assigneeId
    ? users.find((u) => u.id === incident.assigneeId)
    : null;

  const handleStatusChange = (status: string) => {
    if (!id || status === incident.status) return;
    updateMutation.mutate(
      { id, input: { status: status as typeof incident.status } },
      {
        onSuccess: () =>
          toast.success("Status updated", `Now ${status}.`),
        onError: (err) =>
          toast.error("Couldn't update status", err.message),
      },
    );
  };

  const handleAssigneeChange = (assigneeId: string | null) => {
    if (!id || assigneeId === incident.assigneeId) return;
    updateMutation.mutate(
      { id, input: { assigneeId } },
      {
        onSuccess: () => {
          const name = assigneeId
            ? users.find((u) => u.id === assigneeId)?.name ?? "user"
            : "Unassigned";
          toast.success("Assignee updated", `Now: ${name}.`);
        },
        onError: (err) =>
          toast.error("Couldn't update assignee", err.message),
      },
    );
  };

  const handleDelete = () => {
    if (!id) return;
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Incident deleted");
        navigate("/", { replace: true });
      },
      onError: (err) => {
        toast.error("Couldn't delete incident", err.message);
        setConfirmDeleteOpen(false);
      },
    });
  };

  return (
    <div className={styles.page}>
      <Link to="/" className={styles.backLink}>
        <BackIcon /> Back to incidents
      </Link>

      <header className={styles.header}>
        <div className={styles.titleRow}>
          <div className={styles.titleGroup}>
            <h1 className={styles.title}>{incident.title}</h1>
            <div className={styles.headerBadges}>
              <StatusBadge status={incident.status} />
              <SeverityBadge severity={incident.severity} />
            </div>
          </div>
        </div>

        <div className={styles.metadata}>
          <span className={styles.metaItem}>
            <strong>ID:</strong> {incident.id}
          </span>
          <span className={styles.metaItem}>
            <strong>Created:</strong>{" "}
            <time dateTime={incident.createdAt}>
              {formatDateTime(incident.createdAt)}
            </time>
          </span>
          <span className={styles.metaItem}>
            <strong>Updated:</strong> {relativeTime(incident.updatedAt)}
          </span>
          <span className={styles.metaItem}>
            <strong>Assigned to:</strong>{" "}
            {assignee ? assignee.name : "Unassigned"}
          </span>
        </div>
      </header>

      <div className={styles.layout}>
        <section className={styles.section} aria-labelledby="desc-heading">
          <h2 id="desc-heading" className={styles.sectionTitle}>
            Description
          </h2>
          {incident.description ? (
            <p className={styles.description}>{incident.description}</p>
          ) : (
            <p className={[styles.description, styles.descriptionEmpty].join(" ")}>
              No description provided.
            </p>
          )}

          <h2 className={styles.sectionTitle} style={{ marginTop: 12 }}>
            Status history
          </h2>
          <StatusTimeline history={incident.statusHistory} users={users} />
        </section>

        <aside className={styles.section} aria-label="Incident actions">
          <h2 className={styles.sectionTitle}>Manage</h2>
          <div className={styles.controls}>
            <div className={styles.controlRow}>
              <Select
                label="Status"
                value={incident.status}
                onValueChange={handleStatusChange}
                options={STATUS_OPTIONS.map((s) => ({ value: s, label: s }))}
                disabled={updateMutation.isPending}
              />
            </div>
            <div className={styles.controlRow}>
              <AssigneePicker
                users={users}
                value={incident.assigneeId}
                onChange={handleAssigneeChange}
                disabled={updateMutation.isPending}
              />
            </div>
          </div>

          <div className={styles.dangerZone}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirmDeleteOpen(true)}
              disabled={deleteMutation.isPending}
            >
              Delete incident
            </Button>
          </div>
        </aside>
      </div>

      <Dialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        title="Delete this incident?"
        description="This action can't be undone. The incident and its history will be permanently removed."
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setConfirmDeleteOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete incident"}
            </Button>
          </>
        }
      >
        <p style={{ fontSize: 14, color: "var(--color-text-muted)" }}>
          You are about to delete <strong>{incident.title}</strong>.
        </p>
      </Dialog>
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
