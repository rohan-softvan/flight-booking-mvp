interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function SpellingConfirmCheckbox({ checked, onChange }: Props) {
  return (
    <label className="flex items-start gap-2 text-sm text-slate-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
      />
      <span>I confirm my name is spelled exactly as it appears on my passport/ID.</span>
    </label>
  );
}
