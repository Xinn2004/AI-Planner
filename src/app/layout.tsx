import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Planner — Know exactly what to do next',
  description: 'AI COO 每天根据经营状态自动生成今日经营计划',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased min-h-screen bg-white text-neutral-900">
        {children}
      </body>
    </html>
  );
}
