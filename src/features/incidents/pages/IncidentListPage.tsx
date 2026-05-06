import { useMemo } from "react";
import { Link } from "react-router-dom";

import { Button } from "../../../components/ui/Button/Button";
import { LoadingBlock } from "../../../components/ui/Spinner/Spinner";
import { ErrorState } from "../../../components/ui/States/ErrorState";
import { EmptyState } from "../../../components/ui/States/EmptyState";
import { IncidentFilters } from "../components/IncidentFilters/IncidentFilters";
import { IncidentList } from "../components/IncidentList/IncidentList";
import { useIncidents } from "../hooks/useIncidents";
import { useUsers } from "../hooks/useUsers";
import { useIncidentSearchParams } from "../hooks/useIncidentSearchParams";
import { defaultFilters, filterIncidents } from "../utils/filterIncidents";
import { sortIncidents } from "../utils/sortIncidents";

import type { Incident, User } from "../../../api/types";

import styles from "./IncidentListPage.module.css";

const EMPTY_INCIDENTS: Incident[] = [];
const EMPTY_USERS: User[] = [];

export function IncidentListPage() {
  const incidentsQuery = useIncidents();
  const usersQuery = useUsers();
  const { filters, sort, setFilters, setSort } = useIncidentSearchParams();

  const incidents = incidentsQuery.data ?? EMPTY_INCIDENTS;
  const users = usersQuery.data ?? EMPTY_USERS;

  const visible = useMemo(
    () => sortIncidents(filterIncidents(incidents, filters), sort),
    [incidents, filters, sort],
  );

  const isFiltering =
    JSON.stringify(filters) !== JSON.stringify(defaultFilters);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Incidents</h1>
          <p className={styles.subtitle}>
            Track, triage, and resolve issues across your team.
          </p>
        </div>
        <Link to="/incidents/new">
          <Button>+ New incident</Button>
        </Link>
      </header>

      <IncidentFilters filters={filters} users={users} onChange={setFilters} />

      {incidentsQuery.isPending ? (
        <LoadingBlock label="Loading incidents…" />
      ) : incidentsQuery.isError ? (
        <ErrorState
          title="Couldn't load incidents"
          message={
            incidentsQuery.error instanceof Error
              ? incidentsQuery.error.message
              : "Please try again."
          }
          onRetry={() => incidentsQuery.refetch()}
        />
      ) : incidents.length === 0 ? (
        <EmptyState
          title="No incidents yet"
          message="Create the first incident to start tracking issues for your team."
          action={
            <Link to="/incidents/new">
              <Button>Create incident</Button>
            </Link>
          }
        />
      ) : visible.length === 0 ? (
        <EmptyState
          title="No incidents match these filters"
          message="Try clearing some filters or refining your search."
          action={
            isFiltering ? (
              <Button
                variant="secondary"
                onClick={() => setFilters(defaultFilters)}
              >
                Reset filters
              </Button>
            ) : null
          }
        />
      ) : (
        <IncidentList
          incidents={visible}
          users={users}
          sort={sort}
          onSortChange={setSort}
          totalCount={incidents.length}
        />
      )}
    </div>
  );
}
