// ==========================================
// AI Planner — LocalStorage 数据管理
// ==========================================

import type { AppData, UserProfile, Checkin, MorningBrief } from '@/types';

const STORAGE_KEY = 'ai-planner-data';

/** 获取今天的日期字符串 */
export function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

/** 读取完整应用数据 */
export function loadData(): AppData {
  if (typeof window === 'undefined') {
    return getDefaultData();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultData();
    return JSON.parse(raw) as AppData;
  } catch {
    return getDefaultData();
  }
}

/** 保存完整应用数据 */
export function saveData(data: AppData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('保存数据失败:', e);
  }
}

/** 获取默认空数据 */
function getDefaultData(): AppData {
  return {
    profile: null,
    checkins: [],
    briefs: [],
    lastActiveDate: '',
  };
}

/** 检查是否已完成初始化 */
export function hasProfile(): boolean {
  const data = loadData();
  return data.profile !== null;
}

/** 保存用户初始化信息 */
export function saveProfile(profile: UserProfile): void {
  const data = loadData();
  data.profile = profile;
  saveData(data);
}

/** 获取用户初始化信息 */
export function getProfile(): UserProfile | null {
  return loadData().profile;
}

/** 检查今天是否已 Check-in */
export function hasCheckedInToday(): boolean {
  const data = loadData();
  return data.lastActiveDate === getToday() && data.checkins.some((c) => c.date === getToday());
}

/** 保存今日 Check-in */
export function saveCheckin(checkin: Checkin): void {
  const data = loadData();
  const existingIndex = data.checkins.findIndex((c) => c.date === checkin.date);
  if (existingIndex >= 0) {
    data.checkins[existingIndex] = checkin;
  } else {
    data.checkins.push(checkin);
  }
  data.lastActiveDate = getToday();
  saveData(data);
}

/** 获取今日 Check-in */
export function getTodayCheckin(): Checkin | null {
  const data = loadData();
  return data.checkins.find((c) => c.date === getToday()) ?? null;
}

/** 保存今日 Brief */
export function saveBrief(brief: MorningBrief): void {
  const data = loadData();
  const existingIndex = data.briefs.findIndex((b) => b.date === brief.date);
  if (existingIndex >= 0) {
    data.briefs[existingIndex] = brief;
  } else {
    data.briefs.push(brief);
  }
  saveData(data);
}

/** 获取今日 Brief */
export function getTodayBrief(): MorningBrief | null {
  const data = loadData();
  return data.briefs.find((b) => b.date === getToday()) ?? null;
}

/** 获取最近 N 天的 Brief（用于 AI 上下文） */
export function getRecentBriefs(days: number = 3): MorningBrief[] {
  const data = loadData();
  return data.briefs.slice(-days);
}

/** 获取最近 N 天的 Check-in（用于 AI 上下文） */
export function getRecentCheckins(days: number = 3): Checkin[] {
  const data = loadData();
  return data.checkins.slice(-days);
}

/** 切换任务完成状态 */
export function toggleTaskComplete(taskId: string): void {
  const data = loadData();
  const today = getToday();
  const brief = data.briefs.find((b) => b.date === today);
  if (!brief) return;
  const task = brief.tasks.find((t) => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    saveData(data);
  }
}

/** 清空所有数据（调试用） */
export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
