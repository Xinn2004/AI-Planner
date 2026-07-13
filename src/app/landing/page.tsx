'use client';

import { useRouter } from 'next/navigation';

// ==========================================
// AI Planner Landing Page — 文案集中定义
// 所有面向用户的文字集中于此，方便后续修改
// ==========================================

const COPY = {
  hero: {
    productName: 'AI Planner',
    slogan: 'Every morning, know exactly what to do next.',
    description: '给创业者的 AI 晨间经营简报，每天 1 分钟，告诉你今天最该做什么',
    cta: '立即体验',
  },
  features: {
    title: '核心功能',
    items: [
      {
        title: '每日经营诊断',
        body: '基于创业阶段与当日进度，AI 精准判断核心瓶颈，告别盲目忙碌。',
      },
      {
        title: '分级任务清单',
        body: '高 / 中 / 低优先级清晰划分，附带执行建议与可直接复用的 AI 提示词。',
      },
      {
        title: '轻量每日签到',
        body: '每天 1 分钟 4 个问题同步状态，无需复杂操作，专注行动本身。',
      },
    ],
  },
  about: {
    title: '关于我们',
    body: 'AI Planner 是面向早期创业者的轻量决策工具，致力于帮你减少日常决策内耗，把精力聚焦在真正推动业务前进的事情上。',
  },
  footer: {
    productName: 'AI Planner',
    copyright: `© ${new Date().getFullYear()} AI Planner`,
  },
} as const;

// ==========================================
// 页面组件
// ==========================================

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <div className="mx-auto max-w-3xl px-6">

        {/* ── Hero ── */}
        <section className="pt-24 pb-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            {COPY.hero.productName}
          </h1>
          <p className="mt-4 text-lg text-neutral-500 leading-relaxed">
            {COPY.hero.slogan}
          </p>
          <p className="mt-3 text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
            {COPY.hero.description}
          </p>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="mt-8 inline-flex items-center px-8 py-3 rounded-xl bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            {COPY.hero.cta}
          </button>
        </section>

        {/* ── 功能亮点 ── */}
        <section className="py-16">
          <h2 className="text-center text-lg font-semibold text-neutral-500 mb-8">
            {COPY.features.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {COPY.features.items.map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-xl border border-neutral-200 bg-white"
              >
                <h3 className="text-sm font-semibold text-neutral-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 关于我们 ── */}
        <section className="py-16">
          <h2 className="text-center text-lg font-semibold text-neutral-500 mb-6">
            {COPY.about.title}
          </h2>
          <p className="text-sm text-neutral-500 leading-relaxed max-w-xl mx-auto text-center">
            {COPY.about.body}
          </p>
        </section>

        {/* ── 页脚 ── */}
        <footer className="py-12 border-t border-neutral-100 text-center">
          <p className="text-sm font-medium text-neutral-900">
            {COPY.footer.productName}
          </p>
          <p className="mt-1 text-xs text-neutral-400">
            {COPY.footer.copyright}
          </p>
        </footer>

      </div>
    </div>
  );
}
