const STORAGE_KEY = "neurorefugio.dashboardPrefs.v1";

export interface DashboardPrefs {
  order: string[];
  hidden: string[];
  compact: string[];
}

export function loadDashboardPrefs(defaultOrder: string[]): DashboardPrefs {
  if (typeof window === "undefined") return { order: defaultOrder, hidden: [], compact: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { order: defaultOrder, hidden: [], compact: [] };
    const parsed = JSON.parse(raw) as Partial<DashboardPrefs>;
    const savedOrder = parsed.order?.filter((id) => defaultOrder.includes(id)) ?? [];
    const missing = defaultOrder.filter((id) => !savedOrder.includes(id));
    return {
      order: [...savedOrder, ...missing],
      hidden: parsed.hidden ?? [],
      compact: parsed.compact ?? [],
    };
  } catch {
    return { order: defaultOrder, hidden: [], compact: [] };
  }
}

export function saveDashboardPrefs(prefs: DashboardPrefs): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}
