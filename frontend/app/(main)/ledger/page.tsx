'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ledgerApi } from '@/lib/api';
import { format } from 'date-fns';
import {
  Icons,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Button,
  StatsCard,
} from '@/components/ui';
import { cn, formatCurrency } from '@/lib/utils';

export default function LedgerPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState<number | null>(currentMonth);

  const { data: ledger, isLoading } = useQuery({
    queryKey: ['ledger', year, month],
    queryFn: () => ledgerApi.getLedger({ year, month: month || undefined }),
  });

  const handleExport = async (exportFormat: 'excel' | 'csv') => {
    try {
      const response = await ledgerApi.exportLedger({
        year,
        month: month || undefined,
        format: exportFormat,
      });

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ledger_${year}${month ? `_${month.toString().padStart(2, '0')}` : ''}.${exportFormat === 'excel' ? 'xlsx' : 'csv'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert('내보내기에 실패했습니다');
    }
  };

  const data = ledger?.data;

  return (
    <div className="space-y-6 pb-20 lg:pb-0 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">간편장부</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">수입과 지출을 한눈에 확인하세요</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="pl-4 pr-10 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl appearance-none text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:border-primary-400 transition-all"
            >
              {[...Array(5)].map((_, i) => {
                const y = currentYear - i;
                return (
                  <option key={y} value={y}>
                    {y}년
                  </option>
                );
              })}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
              <Icons.ChevronDown className="w-4 h-4" />
            </div>
          </div>
          <div className="relative">
            <select
              value={month || ''}
              onChange={(e) => setMonth(e.target.value ? parseInt(e.target.value) : null)}
              className="pl-4 pr-10 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl appearance-none text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:border-primary-400 transition-all"
            >
              <option value="">연간</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}월
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
              <Icons.ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* 요약 통계 */}
      {data?.summary && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatsCard
            title="총 수입"
            value={formatCurrency(data.summary.total_income)}
            icon={<Icons.TrendingUp className="w-6 h-6" />}
            variant="primary"
          />
          <StatsCard
            title="총 지출"
            value={formatCurrency(data.summary.total_expense)}
            icon={<Icons.TrendingDown className="w-6 h-6" />}
            variant="default"
          />
          <StatsCard
            title="경비인정액"
            value={formatCurrency(data.summary.deductible_expense)}
            icon={<Icons.Success className="w-6 h-6" />}
            variant="success"
          />
          <StatsCard
            title="비인정액"
            value={formatCurrency(data.summary.non_deductible_expense)}
            icon={<Icons.Error className="w-6 h-6" />}
            variant="error"
          />
          <StatsCard
            title="순이익"
            value={formatCurrency(data.summary.net_income)}
            icon={<Icons.Calculator className="w-6 h-6" />}
            variant="default"
          />
          <StatsCard
            title="예상 세금"
            value={formatCurrency(data.summary.estimated_tax)}
            icon={<Icons.Warning className="w-6 h-6" />}
            variant="warning"
          />
        </div>
      )}

      {/* 내보내기 버튼 */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => handleExport('excel')}
          leftIcon={<Icons.Download className="w-4 h-4" />}
        >
          엑셀 다운로드
        </Button>
        <Button
          variant="outline"
          onClick={() => handleExport('csv')}
          leftIcon={<Icons.Download className="w-4 h-4" />}
        >
          CSV 다운로드
        </Button>
      </div>

      {/* 거래 내역 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.Ledger className="w-5 h-5 text-primary-500" />
            거래 내역
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">날짜</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">내용</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">수입</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">지출</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400 hidden md:table-cell">계정과목</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600 dark:text-gray-400 hidden md:table-cell">경비</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12">
                      <Icons.Loader className="w-8 h-8 text-primary-600 mx-auto" />
                    </td>
                  </tr>
                ) : data?.entries?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icons.Ledger className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400">해당 기간에 데이터가 없습니다</p>
                    </td>
                  </tr>
                ) : (
                  data?.entries?.map((entry: any, index: number) => (
                    <tr
                      key={`${entry.date}-${index}`}
                      className="border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="py-3 px-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                        {format(new Date(entry.date), 'MM.dd')}
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                        {entry.description}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {entry.income > 0 && (
                          <span className="text-primary-600 dark:text-primary-400 font-semibold">
                            +{formatCurrency(entry.income)}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {entry.expense > 0 && (
                          <span className="text-gray-900 dark:text-gray-100 font-semibold">
                            -{formatCurrency(entry.expense)}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        {entry.category_name ? (
                          <Badge variant="default">{entry.category_name}</Badge>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center hidden md:table-cell">
                        {entry.is_deductible === null ? (
                          <span className="text-gray-400 dark:text-gray-500">-</span>
                        ) : entry.is_deductible ? (
                          <Icons.Check className="w-5 h-5 text-success-500 mx-auto" />
                        ) : (
                          <Icons.Close className="w-5 h-5 text-error-500 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
