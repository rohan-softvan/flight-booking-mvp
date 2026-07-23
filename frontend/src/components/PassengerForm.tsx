import { passengerSchema } from "@flight-booking/shared";
import { FormEvent, useState } from "react";
import SpellingConfirmCheckbox from "./SpellingConfirmCheckbox";

export interface PassengerFormValues {
  firstName: string;
  lastName: string;
  email: string;
  nationality: string;
}

interface Props {
  onSubmit: (values: PassengerFormValues) => void;
  submitting: boolean;
}

const inputClass =
  "mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";
const labelClass = "block text-sm font-medium text-slate-700";
const errorClass = "mt-1 text-sm text-red-600";

export default function PassengerForm({ onSubmit, submitting }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [nationality, setNationality] = useState("");
  const [spellingConfirmed, setSpellingConfirmed] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: FormEvent): void {
    e.preventDefault();

    const result = passengerSchema.safeParse({ firstName, lastName, email, nationality });
    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0]?.toString() ?? "_root";
        if (!(key in errors)) errors[key] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    onSubmit(result.data);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor="firstName" className={labelClass}>
          First name
        </label>
        <input
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className={inputClass}
        />
        {fieldErrors.firstName && (
          <p role="alert" className={errorClass}>
            {fieldErrors.firstName}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="lastName" className={labelClass}>
          Last name
        </label>
        <input
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className={inputClass}
        />
        {fieldErrors.lastName && (
          <p role="alert" className={errorClass}>
            {fieldErrors.lastName}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
        {fieldErrors.email && (
          <p role="alert" className={errorClass}>
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="nationality" className={labelClass}>
          Nationality (2-letter code)
        </label>
        <input
          id="nationality"
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          placeholder="US"
          maxLength={2}
          className={inputClass}
        />
        {fieldErrors.nationality && (
          <p role="alert" className={errorClass}>
            {fieldErrors.nationality}
          </p>
        )}
      </div>

      <SpellingConfirmCheckbox checked={spellingConfirmed} onChange={setSpellingConfirmed} />

      <button
        type="submit"
        disabled={!spellingConfirmed || submitting}
        className="w-full rounded-md bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {submitting ? "Submitting..." : "Continue to payment"}
      </button>
    </form>
  );
}
