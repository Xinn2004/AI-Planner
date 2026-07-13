// ==========================================
// AI Planner — 核心类型定义
// ==========================================

/** 用户初始化信息（仅首次填写一次） */
export interface UserProfile {
  stage: 'idea' | 'mvp' | 'launched' | 'profitable';
  businessType: string;
  primaryGoal: string;
  createdAt: string; // ISO date string
}

/** 阶段选项 */
export const STAGE_OPTIONS = [
  { value: 'idea', label: '想法验证' },
  { value: 'mvp', label: 'MVP 开发' },
  { value: 'launched', label: '已上线运营' },
  { value: 'profitable', label: '已开始盈利' },
] as const;

/** 业务类型选项 */
export const BUSINESS_TYPE_OPTIONS = [
  { value: 'saas', label: 'SaaS' },
  { value: 'knowledge', label: '知识付费' },
  { value: 'content', label: '内容IP' },
  { value: 'consulting', label: '咨询服务' },
  { value: 'ecommerce', label: '电商' },
  { value: 'other', label: '其他' },
] as const;

/** 目标选项 */
export const GOAL_OPTIONS = [
  { value: 'first_users', label: '获取首批用户' },
  { value: 'improve_product', label: '完善产品' },
  { value: 'increase_revenue', label: '提高收入' },
  { value: 'validate_model', label: '验证商业模式' },
] as const;

/** 每日 Check-in 记录 */
export interface Checkin {
  date: string; // '2026-07-14'
  yesterdayDone: string;
  todayMustDo: string;
  biggestChallenge: string;
  newChanges: string;
}

/** 单条任务 */
export interface Task {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
  whyThisMatters: string;
  executionTip: string;
  aiPrompt: string;
  completed: boolean;
}

/** AI 生成的每日简报 */
export interface MorningBrief {
  date: string;
  businessJudgment: string;
  todayFocus: string;
  tasks: Task[];
  generatedAt: string; // ISO timestamp
}

/** 完整的应用数据 */
export interface AppData {
  profile: UserProfile | null;
  checkins: Checkin[];
  briefs: MorningBrief[];
  lastActiveDate: string;
}
