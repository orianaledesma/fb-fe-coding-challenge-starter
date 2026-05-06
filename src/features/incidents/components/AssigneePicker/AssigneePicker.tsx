import { Select } from "../../../../components/ui/Select/Select";
import type { User } from "../../../../api/types";

const UNASSIGNED = "__unassigned__";

interface AssigneePickerProps {
  users: User[];
  value: string | null;
  onChange: (value: string | null) => void;
  label?: string;
  visuallyHiddenLabel?: boolean;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  id?: string;
  /** When true, "Unassigned" is included as a valid option. */
  allowUnassigned?: boolean;
}

export function AssigneePicker({
  users,
  value,
  onChange,
  label = "Assignee",
  visuallyHiddenLabel,
  disabled,
  required,
  error,
  id,
  allowUnassigned = true,
}: AssigneePickerProps) {
  const options = [
    ...(allowUnassigned
      ? [{ value: UNASSIGNED, label: "Unassigned" }]
      : []),
    ...users.map((u) => ({ value: u.id, label: u.name })),
  ];

  return (
    <Select
      id={id}
      label={label}
      visuallyHiddenLabel={visuallyHiddenLabel}
      value={value ?? UNASSIGNED}
      onValueChange={(v) => onChange(v === UNASSIGNED ? null : v)}
      options={options}
      disabled={disabled}
      required={required}
      error={error}
      placeholder="Select assignee"
    />
  );
}
