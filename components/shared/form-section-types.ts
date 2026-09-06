/**
 * The contract every multi-section form uses.
 *
 * A long form (add a class, add a student, add a member of staff) is split into collapsible sections. Each
 * section shows part of one state object and reports edits back to the page that owns it. That shape was
 * written out by hand in every section as `formData: any; onChange: (field: string, value: any) => void`,
 * which is 71 `any`s saying the same thing — and it meant a typo in a field name, or a value of the wrong
 * kind, reached the page silently.
 *
 * Generic over the form's own state type, so `onChange("capacity", 30)` is checked against what `capacity`
 * actually is.
 */
export interface FormSectionProps<T> {
  /** The whole form's current values. A section reads only the fields it shows. */
  formData: T;
  /** Report one field's new value. The value's type is tied to the field, so the pair cannot disagree. */
  onChange: <K extends keyof T>(field: K, value: T[K]) => void;
  /** Validation messages, keyed by field name. Absent while the form has not been submitted. */
  errors?: Partial<Record<keyof T, string>>;
}

/**
 * The handler a page passes as `onChange`. Written once here because every page's version was identical —
 * and because writing it inline invited `(field: string, value: any)`, which defeats the point.
 */
export type FormFieldSetter<T> = <K extends keyof T>(field: K, value: T[K]) => void;
