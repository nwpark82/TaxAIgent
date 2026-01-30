'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expenseApi, ledgerApi } from '@/lib/api';
import { format } from 'date-fns';
import {
  Icons,
  Card,
  CardContent,
  Badge,
  Button,
  Input,
  Modal,
  ModalFooter,
} from '@/components/ui';
import { cn, formatCurrency } from '@/lib/utils';

export default function ExpensesPage() {
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [page, setPage] = useState(1);

  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    description: '',
    amount: '',
    vendor: '',
    category_id: '',
    evidence_type: 'card',
    memo: '',
  });

  const { data: expenses, isLoading } = useQuery({
    queryKey: ['expenses', page],
    queryFn: () => expenseApi.getList({ page, size: 20 }),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => ledgerApi.getCategories(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => expenseApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      setShowAddModal(false);
      resetForm();
    },
  });

  const classifyMutation = useMutation({
    mutationFn: (data: { description: string; amount?: number; vendor?: string }) =>
      expenseApi.classifyPreview(data),
    onSuccess: (response) => {
      const result = response.data;
      const category = categories?.data?.find((c: any) => c.code === result.category_code);
      if (category) {
        setFormData(prev => ({ ...prev, category_id: category.id.toString() }));
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => expenseApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });

  const resetForm = () => {
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      description: '',
      amount: '',
      vendor: '',
      category_id: '',
      evidence_type: 'card',
      memo: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      amount: parseFloat(formData.amount),
      category_id: formData.category_id ? parseInt(formData.category_id) : undefined,
    });
  };

  const handleAutoClassify = () => {
    if (formData.description) {
      classifyMutation.mutate({
        description: formData.description,
        amount: formData.amount ? parseFloat(formData.amount) : undefined,
        vendor: formData.vendor || undefined,
      });
    }
  };

  const evidenceTypes = [
    { value: 'card', label: '카드' },
    { value: 'cash_receipt', label: '현금영수증' },
    { value: 'tax_invoice', label: '세금계산서' },
    { value: 'none', label: '없음' },
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-0 animate-fade-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">지출 관리</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">비용을 등록하고 관리하세요</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          leftIcon={<Icons.Add className="w-4 h-4" />}
        >
          지출 등록
        </Button>
      </div>

      {/* 요약 카드 */}
      {expenses?.data && (
        <Card className="bg-gradient-to-r from-primary-500 to-primary-600">
          <CardContent className="py-5">
            <div className="flex justify-between items-center text-white">
              <div>
                <p className="text-sm text-white/80">총 {expenses.data.total}건</p>
                <p className="text-2xl font-bold mt-1">
                  {formatCurrency(expenses.data.total_amount)}
                </p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Icons.Expense className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 지출 목록 */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Icons.Loader className="w-8 h-8 text-primary-600" />
          </div>
        ) : expenses?.data?.items?.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icons.Expense className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 mb-4">등록된 지출이 없습니다</p>
              <Button
                onClick={() => setShowAddModal(true)}
                leftIcon={<Icons.Add className="w-4 h-4" />}
              >
                첫 지출 등록하기
              </Button>
            </CardContent>
          </Card>
        ) : (
          expenses?.data?.items?.map((expense: any) => (
            <Card key={expense.id} className="hover:shadow-soft transition-shadow">
              <CardContent className="py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-sm font-medium text-gray-400 dark:text-gray-500">
                        {format(new Date(expense.date), 'MM.dd')}
                      </span>
                      {expense.category && (
                        <Badge variant="default">{expense.category.name}</Badge>
                      )}
                      {expense.is_deductible !== null && (
                        <Badge variant={expense.is_deductible ? 'success' : 'error'}>
                          {expense.is_deductible ? '경비O' : '경비X'}
                        </Badge>
                      )}
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{expense.description}</p>
                    {expense.vendor && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{expense.vendor}</p>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                      {formatCurrency(expense.amount)}
                    </p>
                    <button
                      onClick={() => {
                        if (confirm('이 지출을 삭제하시겠습니까?')) {
                          deleteMutation.mutate(expense.id);
                        }
                      }}
                      className="text-sm text-gray-400 dark:text-gray-500 hover:text-error-600 dark:hover:text-error-400 mt-1 transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      {expenses?.data?.total > 20 && (
        <div className="flex justify-center items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            leftIcon={<Icons.ChevronLeft className="w-4 h-4" />}
          >
            이전
          </Button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {page} / {Math.ceil(expenses.data.total / 20)}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => p + 1)}
            disabled={page * 20 >= expenses.data.total}
            rightIcon={<Icons.ChevronRight className="w-4 h-4" />}
          >
            다음
          </Button>
        </div>
      )}

      {/* 지출 등록 모달 */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="지출 등록"
        description="새로운 지출 내역을 등록하세요"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="date"
            label="날짜"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              내용
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="flex-1 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:border-primary-400 transition-all"
                placeholder="지출 내용을 입력하세요"
                required
              />
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={handleAutoClassify}
                disabled={!formData.description || classifyMutation.isPending}
                isLoading={classifyMutation.isPending}
              >
                AI 분류
              </Button>
            </div>
          </div>

          <Input
            type="number"
            label="금액"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="0"
            required
          />

          <Input
            type="text"
            label="가맹점"
            value={formData.vendor}
            onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
            placeholder="가맹점명 (선택)"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              계정과목
            </label>
            <div className="relative">
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl appearance-none text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:border-primary-400 transition-all"
              >
                <option value="">선택하세요</option>
                {categories?.data?.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.code})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                <Icons.ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              증빙유형
            </label>
            <div className="flex flex-wrap gap-2">
              {evidenceTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, evidence_type: type.value })}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    formData.evidence_type === type.value
                      ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 ring-2 ring-primary-500'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  )}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              메모
            </label>
            <textarea
              value={formData.memo}
              onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:border-primary-400 transition-all resize-none"
              rows={2}
              placeholder="메모 (선택)"
            />
          </div>

          <ModalFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowAddModal(false)}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              type="submit"
              isLoading={createMutation.isPending}
              className="flex-1"
            >
              저장
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}
