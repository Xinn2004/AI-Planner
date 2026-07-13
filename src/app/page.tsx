'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { hasProfile, getTodayBrief, loadData, toggleTaskComplete as toggleStorage, getToday } from '@/lib/storage';
import type { MorningBrief, Task } from '@/types';

/** 中文星期 */
const WEEKDAY_NAMES = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

/** 格式化日期为中文 */
function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const w = WEEKDAY_NAMES[d.getDay()];
  return `${y}年${m}月${day}日 ${w}`;
}

/** 优先级配置 */
const PRIORITY_CONFIG: Record<Task['priority'], { color: string; bg: string; label: string }> = {
  high: { color: 'text-red-600', bg: 'bg-red-50 border-red-200', label: '🔴 高优先级' },
  medium: { color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', label: '🟡 中优先级' },
  low: { color: 'text-green-600', bg: 'bg-green-50 border-green-200', label: '🟢 低优先级' },
};

/** 单条任务卡片 */
function TaskCard({
  task,
  onToggle,
}: {
  task: Task;
  onToggle: (id: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(task.aiPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: 选中文本让用户手动复制
      const textarea = document.createElement('textarea');
      textarea.value = task.aiPrompt;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const config = PRIORITY_CONFIG[task.priority];

  return (
    <div
      className={`border rounded-xl p-4 transition-all ${
        task.completed ? 'opacity-60' : ''
      } ${config.bg}`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          type="button"
          onClick={() => onToggle(task.id)}
          className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all cursor-pointer ${
            task.completed
              ? 'bg-neutral-900 border-neutral-900'
              : 'border-neutral-300 hover:border-neutral-500'
          }`}
        >
          {task.completed && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 6L5 9L10 3"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4
            className={`text-sm font-medium text-neutral-900 ${
              task.completed ? 'line-through' : ''
            }`}
          >
            {task.title}
          </h4>

          <div className="mt-2 flex flex-wrap gap-2 text-xs text-neutral-500">
            <span className="inline-flex items-center gap-1">
              ⏱ {task.estimatedTime}
            </span>
          </div>

          <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
            <span className="font-medium">为什么做：</span>
            {task.whyThisMatters}
          </p>

          <p className="mt-1 text-xs text-neutral-600 leading-relaxed">
            <span className="font-medium">执行建议：</span>
            {task.executionTip}
          </p>

          {/* AI Prompt */}
          <div className="mt-3 rounded-lg bg-white/80 border border-neutral-200 p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-neutral-500">
                🤖 AI Prompt
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
              >
                {copied ? '✓ 已复制' : '📋 复制'}
              </button>
            </div>
            <p className="text-xs text-neutral-700 leading-relaxed whitespace-pre-wrap">
              {task.aiPrompt}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [brief, setBrief] = useState<MorningBrief | null>(null);
  const [isHistorical, setIsHistorical] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    // 路由守卫：无 profile 时重定向到 onboarding
    if (!hasProfile()) {
      router.replace('/onboarding');
      return;
    }

    const today = getToday();
    const todayBrief = getTodayBrief();

    if (todayBrief) {
      // 情况 1：存在当日简报
      setBrief(todayBrief);
      setIsHistorical(false);
      setIsEmpty(false);
    } else {
      // 尝试获取最近的简报
      const allData = loadData();
      const allBriefs = allData.briefs;
      if (allBriefs.length > 0) {
        // 情况 2：无当日简报但存在历史简报
        setBrief(allBriefs[allBriefs.length - 1]);
        setIsHistorical(true);
        setIsEmpty(false);
      } else {
        // 情况 3：完全无简报数据
        setBrief(null);
        setIsHistorical(false);
        setIsEmpty(true);
      }
    }
  }, [router, tick]);

  const handleToggle = (taskId: string) => {
    toggleStorage(taskId);
    setTick((t) => t + 1); // 触发重新读取
  };

  // 渲染空状态
  if (isEmpty) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-4xl mb-4">☀️</div>
          <h1 className="text-xl font-bold text-neutral-900 mb-2">
            欢迎使用 AI Planner
          </h1>
          <p className="text-sm text-neutral-500 mb-6 leading-relaxed">
            你已完成初始化，现在开始第一次每日签到，
            <br />
            让 AI COO 帮你规划今天最重要的事。
          </p>
          <button
            type="button"
            onClick={() => router.push('/checkin')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            ⚡ 开始今天的 Check-in
          </button>
        </div>
      </main>
    );
  }

  if (!brief) return null;

  // 按优先级分组
  const highTasks = brief.tasks.filter((t) => t.priority === 'high');
  const mediumTasks = brief.tasks.filter((t) => t.priority === 'medium');
  const lowTasks = brief.tasks.filter((t) => t.priority === 'low');

  const taskGroups = [
    { tasks: highTasks, ...PRIORITY_CONFIG.high },
    { tasks: mediumTasks, ...PRIORITY_CONFIG.medium },
    { tasks: lowTasks, ...PRIORITY_CONFIG.low },
  ].filter((g) => g.tasks.length > 0);

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Historical data提示 */}
        {isHistorical && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800 text-center">
            ⚠️ 你还没 Check-in，以下是最近一份简报。
            <button
              type="button"
              onClick={() => router.push('/checkin')}
              className="ml-2 underline font-medium hover:text-amber-900 cursor-pointer"
            >
              点击开始今日签到
            </button>
          </div>
        )}

        {/* 日期头 */}
        <div className="mb-6">
          <h1 className="text-lg font-bold text-neutral-900">
            📅 {formatDate(brief.date)}
          </h1>
        </div>

        {/* 📊 今日经营判断 */}
        <div className="mb-4 p-5 rounded-xl border border-neutral-200 bg-white">
          <h2 className="text-sm font-medium text-neutral-500 mb-2">
            📊 今日经营判断
          </h2>
          <p className="text-sm text-neutral-800 leading-relaxed">
            {brief.businessJudgment}
          </p>
        </div>

        {/* 🎯 Today Focus */}
        <div className="mb-6 p-5 rounded-xl border-2 border-neutral-900 bg-neutral-50">
          <h2 className="text-sm font-medium text-neutral-500 mb-2">
            🎯 Today Focus
          </h2>
          <p className="text-base font-bold text-neutral-900">
            {brief.todayFocus}
          </p>
        </div>

        {/* 📋 今日任务 */}
        <div className="mb-8">
          <h2 className="text-sm font-medium text-neutral-700 mb-4">
            📋 今日任务
          </h2>

          <div className="space-y-4">
            {taskGroups.map((group) => (
              <div key={group.label}>
                <h3
                  className={`text-xs font-medium mb-2 ${group.color}`}
                >
                  {group.label}
                </h3>
                <div className="space-y-3">
                  {group.tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={handleToggle}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 底部 Check-in 按钮 */}
        {!isHistorical && (
          <div className="pb-8">
            <button
              type="button"
              onClick={() => router.push('/checkin')}
              className="w-full py-3 rounded-xl bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              ⚡ 开始今天的 Check-in
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
