'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { STAGE_OPTIONS, BUSINESS_TYPE_OPTIONS, GOAL_OPTIONS } from '@/types';
import { saveProfile, saveBrief } from '@/lib/storage';
import { generateColdStartBrief } from '@/lib/mock-ai';
import type { UserProfile } from '@/types';

export default function OnboardingPage() {
  const router = useRouter();

  const [stage, setStage] = useState<string>('');
  const [businessType, setBusinessType] = useState<string>('');
  const [primaryGoal, setPrimaryGoal] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const allSelected = stage !== '' && businessType !== '' && primaryGoal !== '';

  const handleStart = async () => {
    if (!allSelected || loading) return;

    setLoading(true);

    const profile: UserProfile = {
      stage: stage as UserProfile['stage'],
      businessType,
      primaryGoal,
      createdAt: new Date().toISOString(),
    };

    saveProfile(profile);

    // 冷启动：生成首份 Mock Brief
    const brief = await generateColdStartBrief(profile);
    saveBrief(brief);

    router.push('/');
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
            AI Planner
          </h1>
          <p className="mt-2 text-sm text-neutral-500 leading-relaxed">
            Every morning, know exactly what to do next.
            <br />
            每天醒来，都知道今天最该做什么。
          </p>
        </div>

        {/* Question 1: Stage */}
        <div className="mb-8">
          <h2 className="text-sm font-medium text-neutral-700 mb-3">
            当前创业阶段
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {STAGE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setStage(option.value)}
                className={`text-sm px-4 py-3 rounded-xl border text-left transition-all cursor-pointer ${
                  stage === option.value
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Question 2: Business Type */}
        <div className="mb-8">
          <h2 className="text-sm font-medium text-neutral-700 mb-3">
            业务类型
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {BUSINESS_TYPE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setBusinessType(option.value)}
                className={`text-sm px-4 py-3 rounded-xl border text-left transition-all cursor-pointer ${
                  businessType === option.value
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Question 3: Goal */}
        <div className="mb-10">
          <h2 className="text-sm font-medium text-neutral-700 mb-3">
            当前主要目标
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {GOAL_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setPrimaryGoal(option.value)}
                className={`text-sm px-4 py-3 rounded-xl border text-left transition-all cursor-pointer ${
                  primaryGoal === option.value
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <button
          type="button"
          disabled={!allSelected || loading}
          onClick={handleStart}
          className={`w-full py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
            allSelected && !loading
              ? 'bg-neutral-900 text-white hover:bg-neutral-800'
              : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
          }`}
        >
          {loading ? 'AI 正在生成你的首份经营简报...' : '开始使用'}
        </button>
      </div>
    </main>
  );
}
