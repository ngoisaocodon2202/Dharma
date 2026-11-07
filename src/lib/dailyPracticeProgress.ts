export type DailyTaskId = 'niem-phat' | 'tri-chu' | 'toa-thien' | 'lay-phat' | 'doc-kinh';

export const DAILY_TASK_TARGETS: Record<DailyTaskId, { required: number; unit: string }> = {
  'niem-phat': { required: 108, unit: 'câu' },
  'tri-chu': { required: 21, unit: 'biến' },
  'toa-thien': { required: 15, unit: 'phút' },
  'lay-phat': { required: 12, unit: 'lạy' },
  'doc-kinh': { required: 1, unit: 'biến' },
};

const DEFAULT_PROGRESS: Record<DailyTaskId, number> = {
  'niem-phat': 0,
  'tri-chu': 0,
  'toa-thien': 0,
  'lay-phat': 0,
  'doc-kinh': 0,
};

function getTodayStorageKey(): string {
  const today = new Date().toISOString().split('T')[0];
  return `phatphap_daily_tasks_v2_${today}`;
}

export function getDailyPracticeProgress(): Record<DailyTaskId, number> {
  if (typeof window === 'undefined') return { ...DEFAULT_PROGRESS };
  try {
    const raw = localStorage.getItem(getTodayStorageKey());
    if (!raw) return { ...DEFAULT_PROGRESS };
    const parsed = JSON.parse(raw);
    return {
      'niem-phat': Number(parsed['niem-phat']) || 0,
      'tri-chu': Number(parsed['tri-chu']) || 0,
      'toa-thien': Number(parsed['toa-thien']) || 0,
      'lay-phat': Number(parsed['lay-phat']) || 0,
      'doc-kinh': Number(parsed['doc-kinh']) || 0,
    };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function incrementDailyPractice(
  taskId: DailyTaskId,
  amount = 1
): Record<DailyTaskId, number> {
  if (typeof window === 'undefined') return { ...DEFAULT_PROGRESS };
  const current = getDailyPracticeProgress();
  const updated: Record<DailyTaskId, number> = {
    ...current,
    [taskId]: Math.max(0, (current[taskId] || 0) + amount),
  };
  try {
    localStorage.setItem(getTodayStorageKey(), JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('phatphap-daily-practice-updated', { detail: updated }));
  } catch {}
  return updated;
}

