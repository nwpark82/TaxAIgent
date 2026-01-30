'use client';

import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { chatApi } from '@/lib/api';
import { Icons, Badge, Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  isDeductible?: boolean | null;
  categoryName?: string | null;
  confidence?: number | null;
  timestamp: Date;
}

const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 0.8) return 'bg-success-500';
  if (confidence >= 0.6) return 'bg-warning-500';
  return 'bg-error-500';
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const askMutation = useMutation({
    mutationFn: (question: string) =>
      chatApi.ask({ question, session_id: sessionId || undefined }),
    onSuccess: (response) => {
      const data = response.data;
      setSessionId(data.session_id);

      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          type: 'assistant',
          content: data.answer,
          isDeductible: data.is_deductible,
          categoryName: data.category_name,
          confidence: data.confidence,
          timestamp: new Date(),
        },
      ]);
    },
    onError: (error: any) => {
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          type: 'assistant',
          content: error.response?.data?.detail || '죄송합니다. 오류가 발생했습니다.',
          timestamp: new Date(),
        },
      ]);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || askMutation.isPending) return;

    const question = input.trim();
    setInput('');

    setMessages((prev) => [
      ...prev,
      { id: generateId(), type: 'user', content: question, timestamp: new Date() },
    ]);

    askMutation.mutate(question);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
    inputRef.current?.focus();
  };

  const suggestedQuestions = [
    { id: 'meal', text: '거래처 식사비용', full: '거래처와 식사한 비용은 경비처리 되나요?' },
    { id: 'internet', text: '재택근무 인터넷', full: '재택근무 인터넷 요금은 경비처리 가능한가요?' },
    { id: 'laptop', text: '노트북 구매비용', full: '노트북 구매비용은 어떻게 처리하나요?' },
    { id: 'fuel', text: '차량 유류비', full: '사업용 차량 유류비는 전액 경비인정 되나요?' },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] lg:h-[calc(100vh-4rem)] pb-20 lg:pb-0">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">AI 세무 상담</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">경비처리와 세무 관련 질문에 AI가 답변해드립니다</p>
        </div>
        {sessionId && (
          <Badge variant="info" size="sm">
            대화 진행 중
          </Badge>
        )}
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4 scrollbar-hide">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 animate-fade-in">
            {/* 빈 상태 */}
            <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 rounded-2xl flex items-center justify-center mb-6 shadow-soft">
              <Icons.Chat className="w-10 h-10 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">무엇이든 물어보세요</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
              경비처리 가능 여부, 계정과목 분류 등<br />
              세무 관련 질문에 AI가 답변해드립니다
            </p>

            {/* 추천 질문 */}
            <div className="w-full max-w-md">
              <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                추천 질문
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {suggestedQuestions.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => handleSuggestedQuestion(q.full)}
                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-400 transition-all duration-200 shadow-sm hover:shadow"
                  >
                    {q.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex animate-slide-up',
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {/* 어시스턴트 아바타 */}
                {message.type === 'assistant' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mr-2 shadow-soft">
                    <span className="text-white text-xs font-bold">AI</span>
                  </div>
                )}

                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-3',
                    message.type === 'user'
                      ? 'message-bubble-user'
                      : 'message-bubble-assistant'
                  )}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>

                  {/* 경비 인정 결과 */}
                  {message.type === 'assistant' && message.isDeductible !== null && message.isDeductible !== undefined && (
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant={message.isDeductible ? 'success' : 'error'}>
                          {message.isDeductible ? (
                            <span className="flex items-center gap-1">
                              <Icons.Check className="w-3 h-3" />
                              경비인정 가능
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Icons.Close className="w-3 h-3" />
                              경비인정 불가
                            </span>
                          )}
                        </Badge>
                        {message.categoryName && (
                          <Badge variant="default">
                            {message.categoryName}
                          </Badge>
                        )}
                      </div>
                      {message.confidence !== null && message.confidence !== undefined && (
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                'h-full rounded-full transition-all duration-500',
                                getConfidenceColor(message.confidence || 0)
                              )}
                              style={{ width: `${(message.confidence || 0) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            신뢰도 {Math.round((message.confidence || 0) * 100)}%
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 사용자 아바타 */}
                {message.type === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-lg flex items-center justify-center ml-2">
                    <Icons.User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </div>
                )}
              </div>
            ))}

            {/* 타이핑 인디케이터 */}
            {askMutation.isPending && (
              <div className="flex justify-start animate-fade-in">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mr-2 shadow-soft">
                  <span className="text-white text-xs font-bold">AI</span>
                </div>
                <div className="message-bubble-assistant px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <form onSubmit={handleSubmit} className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="세무 관련 질문을 입력하세요..."
            className="w-full px-4 py-3 pr-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:border-primary-400 transition-all"
            disabled={askMutation.isPending}
          />
        </div>
        <Button
          type="submit"
          disabled={!input.trim() || askMutation.isPending}
          className="px-4"
        >
          {askMutation.isPending ? (
            <Icons.Loader className="w-5 h-5" />
          ) : (
            <Icons.Send className="w-5 h-5" />
          )}
        </Button>
      </form>
    </div>
  );
}
