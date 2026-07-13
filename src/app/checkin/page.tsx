'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { hasProfile, getProfile, saveCheckin, saveBrief, getToday } from '@/lib/storage';
import { generateMockBrief } from '@/lib/mock-ai';
import type { Checkin } from '@/types';

export default function CheckinPage() {
  const router = useRouter();

  const [yesterdayDone, setYesterdayDone] = useState('');
  const [todayMustDo, setTodayMustDo] = useState('');
  const [biggestChallenge, setBiggestChallenge] = useState('');
  const [newChanges, setNewChanges] = useState('');
  const [loading, setLoading] = useState(false);

  // 路由守卫：无 profile 则跳转 onboarding
  useEffect(() => {
    if (!hasProfile()) {
      router.replace('/onboarding');
    }
  }, [router]);

  const allFilled =
    yesterdayDone.trim() !== '' &&
    todayMustDo.trim() !== '' &&
    biggestChallenge.trim() !== '' &&
    newChanges.trim() !== '';

  const handleSubmit = async () => {
    if (!allFilled || loading) return;

    setLoading(true);

    const profile = getProfile();
    if (!profile) {
      router.replace('/onboarding');
      return;
    }

    const checkin: Checkin = {
      date: getToday(),
      yesterdayDone: yesterdayDone.trim(),
      todayMustDo: todayMustDo.trim(),
      biggestChallenge: biggestChallenge.trim(),
      newChanges: newChanges.trim(),
    };

    // 保存 Check-in
    saveCheckin(checkin);

    // 生成 mock 简报（后续替换为真实 AI API）
    const brief = await generateMockBrief(profile, checkin);
    saveBrief(brief);

    // 跳转首页
    router.push('/');
  };

  // 如果无 profile，不渲染（useEffect 会处理跳转）
  if (typeof window !== 'undefined' && !hasProfile()) {
    return null;
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            ☀️ 早上好，花 1 分钟同步一下
          </h1>
        </div>

        {/* Question 1 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            1. 昨天完成了什么？
          </label>
          <textarea
            value={yesterdayDone}
            onChange={(e) => setYesterdayDone(e.target.value)}
            placeholder="比如：修复了登录页的 bug、和 3 个用户聊了需求、把定价页上线了"
            rows={3}
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm text-neutral-900 placeholder:text-neutral-400 resize-none focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all disabled:opacity-50"
          />
        </div>

        {/* Question 2 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            2. 今天有哪些必须处理的事？
          </label>
          <textarea
            value={todayMustDo}
            onChange={(e) => setTodayMustDo(e.target.value)}
            placeholder="比如：交付客户的方案书、服务器续费"
            rows={3}
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm text-neutral-900 placeholder:text-neutral-400 resize-none focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all disabled:opacity-50"
          />
        </div>

        {/* Question 3 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            3. 当前最大的困难是什么？
          </label>
          <textarea
            value={biggestChallenge}
            onChange={(e) => setBiggestChallenge(e.target.value)}
            placeholder="比如：不知道下一步该做什么功能、付费转化率太低不知道怎么改"
            rows={3}
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm text-neutral-900 placeholder:text-neutral-400 resize-none focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all disabled:opacity-50"
          />
        </div>

        {/* Question 4 */}
        <div className="mb-10">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            4. 有没有新的业务变化？
          </label>
          <textarea
            value={newChanges}
            onChange={(e) => setNewChanges(e.target.value)}
            placeholder="比如：昨天来了一个大客户、竞品上线了新功能、准备开始做内容营销"
            rows={3}
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm text-neutral-900 placeholder:text-neutral-400 resize-none focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all disabled:opacity-50"
          />
        </div>

        {/* Submit Button */}
        <button
          type="button"
          disabled={!allFilled || loading}
          onClick={handleSubmit}
          className={`w-full py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
            allFilled && !loading
              ? 'bg-neutral-900 text-white hover:bg-neutral-800'
              : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
          }`}
        >
          {loading ? 'AI 正在分析你的经营状态...' : '生成今日简报'}
        </button>
      </div>
    </main>
  );
}
