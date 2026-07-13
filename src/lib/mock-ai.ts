// ==========================================
// AI Planner — Mock AI 简报生成（阶段 3 使用，后续替换为真实 API）
// ==========================================

import type { UserProfile, Checkin, MorningBrief, Task } from '@/types';
import { getToday } from '@/lib/storage';

function generateId(): string {
  return `task_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * 冷启动：仅根据用户 Profile 生成首份 Morning Brief（无 Check-in 数据）
 * 后续替换为 DeepSeek API 调用
 */
export async function generateColdStartBrief(
  profile: UserProfile
): Promise<MorningBrief> {
  // 模拟 2 秒 AI 思考延迟
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const stageMap: Record<string, string> = {
    idea: '想法验证',
    mvp: 'MVP 开发',
    launched: '已上线运营',
    profitable: '已开始盈利',
  };

  const goalMap: Record<string, string> = {
    first_users: '获取首批用户',
    improve_product: '完善产品',
    increase_revenue: '提高收入',
    validate_model: '验证商业模式',
  };

  const stageLabel = stageMap[profile.stage] || '创业';
  const goalLabel = goalMap[profile.primaryGoal] || profile.primaryGoal;

  const tasks: Task[] = [];

  // high priority tasks (最多 2 个)
  if (profile.stage === 'idea' || profile.stage === 'mvp') {
    tasks.push({
      id: generateId(),
      title: '明确本周最关键的一个验证指标',
      priority: 'high',
      estimatedTime: '1小时',
      whyThisMatters: '早期阶段最大的浪费是做了没人要的功能。先定义验证指标，再动手，能省下大量时间。',
      executionTip: '拿出一张纸，写下：如果这周只能验证一个假设，它应该是什么？然后设计最简单的验证方式。',
      aiPrompt: `我正在${stageLabel}阶段做${profile.businessType || '产品'}，目标是${goalLabel}。请帮我设计一个本周可以完成的、最小成本的验证实验，来测试我的核心假设是否成立。`,
      completed: false,
    });
    tasks.push({
      id: generateId(),
      title: '直接联系 5 个目标用户对话',
      priority: 'high',
      estimatedTime: '1.5小时',
      whyThisMatters: '在这个阶段，用户对话是性价比最高的信息来源。5 次对话通常足够发现明显的需求模式。',
      executionTip: '不要发问卷。直接发消息约 15 分钟电话或咖啡，聊他们的真实问题和当前解决方案。',
      aiPrompt: '帮我起草 3 条约用户聊天的消息模板，要求简短、真诚、不推销，适合发给 [我的目标用户群体]。',
      completed: false,
    });
  } else {
    tasks.push({
      id: generateId(),
      title: '复盘本月关键经营指标',
      priority: 'high',
      estimatedTime: '1小时',
      whyThisMatters: '已经上线运营后，数据是最客观的决策依据。先看清现状，再定今天的优先级。',
      executionTip: '打开分析工具，重点关注：用户增长趋势、付费转化率、用户流失率三个核心指标。',
      aiPrompt: `我目前在${stageLabel}阶段做${profile.businessType || '业务'}，目标是${goalLabel}。请帮我设计一个经营数据复盘框架，包含最需要关注的 3-5 个关键指标和每个指标的判断标准。`,
      completed: false,
    });
    tasks.push({
      id: generateId(),
      title: '列出本周能驱动收入增长的 3 个动作',
      priority: 'high',
      estimatedTime: '45分钟',
      whyThisMatters: '有收入后，聚焦能直接驱动增长的杠杆点，比铺开做很多事更有效。',
      executionTip: '回顾过去一周的收入来源，找出最大的增长贡献点，然后设计放大方案。',
      aiPrompt: `我的业务是${profile.businessType || '未指定'}，当前目标是${goalLabel}。请帮我头脑风暴 5 个能直接驱动收入增长的具体动作，并按投入产出比排序。`,
      completed: false,
    });
  }

  // medium priority task
  tasks.push({
    id: generateId(),
    title: profile.stage === 'idea'
      ? '用一句话描述你的目标用户画像'
      : '整理今日工作环境和工具链',
    priority: 'medium',
    estimatedTime: '30分钟',
    whyThisMatters: profile.stage === 'idea'
      ? '清晰的目标用户画像是所有后续决策的基础。说不清用户是谁，就说不清该做什么。'
      : '一个干净有序的工作环境能显著提高今天的专注度和产出。',
    executionTip: profile.stage === 'idea'
      ? '写下：谁最需要我的产品？他们现在是怎么解决这个问题的？我比现有方案好在哪里？'
      : '整理桌面、关闭不必要的标签页、设置手机免打扰模式。',
    aiPrompt: profile.stage === 'idea'
      ? '帮我设计一个目标用户画像模板，包含：人口特征、痛点、现有解决方案、购买动机、使用场景。'
      : '帮我整理一份创业者每日高效工作的环境准备清单。',
    completed: false,
  });

  // low priority task
  tasks.push({
    id: generateId(),
    title: '为明天预留 30 分钟复盘时间',
    priority: 'low',
    estimatedTime: '5分钟',
    whyThisMatters: '每天花 5 分钟记录今天做了什么、学到什么，长期积累的认知复利远超想象。',
    executionTip: '在日历上 block 明天结束前的 30 分钟，标题就叫「每日复盘」。',
    aiPrompt: '帮我设计一个简洁的每日复盘模板，只需要 3 个问题，5 分钟能填完。',
    completed: false,
  });

  return {
    date: getToday(),
    businessJudgment: `你目前处于${stageLabel}阶段，业务类型为${profile.businessType || '未指定'}，核心目标是${goalLabel}。在这个阶段，最重要的是把有限的精力集中在最能推动业务前进的 1-2 件事上，而不是铺开做很多事情。`,
    todayFocus: profile.stage === 'idea' || profile.stage === 'mvp'
      ? '用最低成本验证你的核心假设'
      : '聚焦驱动增长的关键杠杆动作',
    tasks,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * 根据用户 Profile 和 Check-in 生成模拟 Morning Brief
 * 后续替换为 DeepSeek API 调用
 */
export async function generateMockBrief(
  profile: UserProfile,
  checkin: Checkin
): Promise<MorningBrief> {
  // 模拟 2 秒 AI 思考延迟
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const stageMap: Record<string, string> = {
    idea: '想法验证',
    mvp: 'MVP 开发',
    launched: '已上线运营',
    profitable: '已开始盈利',
  };

  const tasks: Task[] = [
    {
      id: generateId(),
      title: checkin.todayMustDo
        ? `优先处理：${checkin.todayMustDo.slice(0, 12)}${checkin.todayMustDo.length > 12 ? '...' : ''}`
        : '完成今日核心任务',
      priority: 'high',
      estimatedTime: '2小时',
      whyThisMatters: '你昨天已经标记这是今天必须完成的事项，先解决它能为后续工作扫清障碍。',
      executionTip: '上午精力最好，建议 9:00-11:00 集中处理，关闭通知，用番茄钟保持专注。',
      aiPrompt: '帮我规划完成这个任务的具体步骤，拆分为 3-5 个子任务，并预估每个子任务的时间。',
      completed: false,
    },
    {
      id: generateId(),
      title: checkin.biggestChallenge
        ? `突破瓶颈：${checkin.biggestChallenge.slice(0, 12)}${checkin.biggestChallenge.length > 12 ? '...' : ''}`
        : '解决当前卡点',
      priority: 'high',
      estimatedTime: '1.5小时',
      whyThisMatters: `你当前处于${stageMap[profile.stage] || '创业'}阶段，这个瓶颈如果不解决，后续推进都会受影响。`,
      executionTip: '建议先写下问题的具体表现，再列出 3 种可能的解决方案，然后选最快的那个先试。',
      aiPrompt: `我目前遇到的问题是：${checkin.biggestChallenge || '推进困难'}。请作为创业教练，帮我分析可能的解决方案，并给出最推荐的一个行动方案。`,
      completed: false,
    },
    {
      id: generateId(),
      title: profile.stage === 'idea' || profile.stage === 'mvp'
        ? '与 3 个潜在用户对话获取反馈'
        : '复盘关键指标数据',
      priority: 'medium',
      estimatedTime: '1小时',
      whyThisMatters: profile.stage === 'idea' || profile.stage === 'mvp'
        ? '产品早期最怕闭门造车，用户的真实反馈比任何猜测都值钱。'
        : '数据是经营决策的基础，今天的决策质量取决于你对现状的理解深度。',
      executionTip: profile.stage === 'idea' || profile.stage === 'mvp'
        ? '打开微信通讯录，找到 3 个目标用户，发一条消息约 15 分钟电话。'
        : '打开你的分析工具，重点关注转化率和留存这两个指标的变化。',
      aiPrompt: profile.stage === 'idea' || profile.stage === 'mvp'
        ? '帮我起草 3 条邀请用户访谈的消息模板，要求自然、不推销、真诚。'
        : '帮我设计一个简单的经营数据复盘模板，包含关键指标、趋势分析和行动建议。',
      completed: false,
    },
    {
      id: generateId(),
      title: checkin.yesterdayDone
        ? '巩固昨日成果，确保不反弹'
        : '为昨日工作做收尾',
      priority: 'medium',
      estimatedTime: '30分钟',
      whyThisMatters: '做完不等于做好。花半小时检查昨天的成果，能避免今天重蹈覆辙。',
      executionTip: '快速回顾昨天完成的事项，确认没有遗留问题，如有需要跟进的立即记下来。',
      aiPrompt: '帮我整理一份简洁的项目进展日志模板，包含：完成事项、遗留问题、明日计划三部分。',
      completed: false,
    },
    {
      id: generateId(),
      title: checkin.newChanges
        ? `应对新变化：${checkin.newChanges.slice(0, 12)}${checkin.newChanges.length > 12 ? '...' : ''}`
        : '预留30分钟应对突发事项',
      priority: 'low',
      estimatedTime: '30分钟',
      whyThisMatters: checkin.newChanges
        ? '市场环境的变化可能带来机会或风险，今天花一点时间评估影响。'
        : '每天都会有意外，预留缓冲时间比排满日程更高效。',
      executionTip: checkin.newChanges
        ? '花 15 分钟评估这个变化对业务的影响，另外 15 分钟想想如何利用或应对。'
        : '这段时间不安排具体任务，用来处理今天临时出现的紧急事项。',
      aiPrompt: checkin.newChanges
        ? `我的业务最近发生了这个变化：${checkin.newChanges}。请帮我分析这可能是机会还是风险，以及我应该怎么应对。`
        : '帮我头脑风暴，看看我的业务有哪些潜在的增长机会可能被我忽略了。',
      completed: false,
    },
  ];

  const completedCount = checkin.yesterdayDone ? 1 : 0;
  const challengeHint = checkin.biggestChallenge
    ? `你提到当前最大的困难是"${checkin.biggestChallenge.slice(0, 20)}"，这很可能是今天最需要突破的瓶颈。`
    : '';

  return {
    date: getToday(),
    businessJudgment: `你目前处于${stageMap[profile.stage] || '创业'}阶段，业务类型为${profile.businessType || '未指定'}，当前目标是${profile.primaryGoal || '未设定'}。${challengeHint}今天建议把精力集中在解决核心瓶颈上，同时为长期目标保持稳定推进节奏。`,
    todayFocus: checkin.biggestChallenge
      ? `集中突破：${checkin.biggestChallenge.slice(0, 25)}${checkin.biggestChallenge.length > 25 ? '...' : ''}`
      : checkin.todayMustDo
        ? `优先完成：${checkin.todayMustDo.slice(0, 25)}${checkin.todayMustDo.length > 25 ? '...' : ''}`
        : '聚焦今日核心任务，减少碎片化工作',
    tasks,
    generatedAt: new Date().toISOString(),
  };
}
