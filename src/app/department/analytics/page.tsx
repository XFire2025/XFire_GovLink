// src/app/department/analytics/page.tsx
"use client";
import DepartmentAnalyticsLayout from '@/components/department/analytics/DepartmentAnalyticsLayout';
import DepartmentAnalyticsDashboard from '@/components/department/analytics/DepartmentAnalyticsDashboard';
import { useTranslation } from '@/lib/i18n/hooks/useTranslation';

export default function DepartmentAnalyticsPage() {
  const { t } = useTranslation('department');

  return (
    <DepartmentAnalyticsLayout
      title={
        <span className="animate-title-wave">
          <span className="text-foreground">{t('analytics.title').split(' ')[0]}</span>{' '}
          <span className="text-gradient">
            {t('analytics.title').split(' ')[1] || ''}
          </span>
        </span>
      }
      subtitle={t('analytics.subtitle')}
    >
      <DepartmentAnalyticsDashboard />
    </DepartmentAnalyticsLayout>
  );
}