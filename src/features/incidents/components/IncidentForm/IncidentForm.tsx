import { useState } from "react";
import type { FormEvent } from "react";

import { Button } from "../../../../components/ui/Button/Button";
import { Input, Textarea } from "../../../../components/ui/Input/Input";
import { Select } from "../../../../components/ui/Select/Select";
import { Spinner } from "../../../../components/ui/Spinner/Spinner";
import {
  SEVERITY_OPTIONS,
  createIncidentSchema,
} from "../../schemas/incidentSchema";
import type { CreateIncidentValues } from "../../schemas/incidentSchema";
import { AssigneePicker } from "../AssigneePicker/AssigneePicker";
import type { CreateIncidentInput, User } from "../../../../api/types";

import styles from "./IncidentForm.module.css";

interface IncidentFormProps {
  users: User[];
  submitting?: boolean;
  serverError?: string | null;
  onSubmit: (values: CreateIncidentInput) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

interface FormState {
  title: string;
  description: string;
  severity: "" | (typeof SEVERITY_OPTIONS)[number];
  assigneeId: string | null;
}

type Errors = Partial<Record<keyof CreateIncidentValues, string>>;

const initialState: FormState = {
  title: "",
  description: "",
  severity: "",
  assigneeId: null,
};

export function IncidentForm({
  users,
  submitting,
  serverError,
  onSubmit,
  onCancel,
  submitLabel = "Create incident",
}: IncidentFormProps) {
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Set<keyof FormState>>(new Set());

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (touched.has(key)) {
      validateField(key, { ...values, [key]: value });
    }
  };

  const validateField = <K extends keyof FormState>(
    key: K,
    nextValues: FormState,
  ) => {
    const result = createIncidentSchema.safeParse(nextValues);
    if (result.success) {
      setErrors((prev) => {
        if (!prev[key as keyof CreateIncidentValues]) return prev;
        const next = { ...prev };
        delete next[key as keyof CreateIncidentValues];
        return next;
      });
      return;
    }
    const issue = result.error.issues.find((i) => i.path[0] === key);
    setErrors((prev) => ({
      ...prev,
      [key]: issue?.message,
    }));
  };

  const markTouched = (key: keyof FormState) => {
    setTouched((prev) => {
      if (prev.has(key)) return prev;
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = createIncidentSchema.safeParse(values);

    setTouched(new Set(["title", "description", "severity", "assigneeId"]));

    if (!result.success) {
      const newErrors: Errors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof CreateIncidentValues;
        if (!newErrors[key]) newErrors[key] = issue.message;
      }
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit({
      title: result.data.title,
      description: result.data.description,
      severity: result.data.severity,
      assigneeId: result.data.assigneeId,
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {serverError ? (
        <div className={styles.serverError} role="alert">
          {serverError}
        </div>
      ) : null}

      <Input
        label="Title"
        required
        value={values.title}
        onChange={(e) => setField("title", e.target.value)}
        onBlur={() => {
          markTouched("title");
          validateField("title", values);
        }}
        error={errors.title}
        placeholder="e.g. Database connection timeout"
        autoFocus
        maxLength={100}
      />

      <Textarea
        label="Description"
        value={values.description}
        onChange={(e) => setField("description", e.target.value)}
        onBlur={() => {
          markTouched("description");
          validateField("description", values);
        }}
        error={errors.description}
        hint="Optional. Add context, repro steps, affected scope."
        rows={4}
      />

      <div className={styles.row}>
        <Select
          label="Severity"
          required
          value={values.severity}
          onValueChange={(v) => {
            markTouched("severity");
            setField("severity", v as FormState["severity"]);
          }}
          options={SEVERITY_OPTIONS.map((s) => ({ value: s, label: s }))}
          placeholder="Select severity"
          error={errors.severity}
        />

        <AssigneePicker
          users={users}
          value={values.assigneeId}
          onChange={(v) => setField("assigneeId", v)}
        />
      </div>

      <div className={styles.actions}>
        {onCancel ? (
          <Button variant="ghost" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        ) : null}
        <Button
          type="submit"
          disabled={submitting}
          leftIcon={
            submitting ? <Spinner size="sm" label="Submitting" /> : undefined
          }
        >
          {submitting ? "Creating…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
