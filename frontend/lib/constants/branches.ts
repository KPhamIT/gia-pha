/** The three lineage branches of the family (nhánh / tôn). */
export type BranchValue = 1 | 2 | 3;

export const BRANCH_OPTIONS: { value: BranchValue; label: string }[] = [
  { value: 1, label: 'Đại Tôn' },
  { value: 2, label: 'Trung Tôn' },
  { value: 3, label: 'Tiểu Tôn' },
];

export function getBranchLabel(value?: number | null): string {
  return BRANCH_OPTIONS.find((b) => b.value === value)?.label ?? `Nhánh ${value ?? ''}`;
}

export function isBranchValue(value: unknown): value is BranchValue {
  return value === 1 || value === 2 || value === 3;
}
