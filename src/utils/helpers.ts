import { PaginatedResponse, PaginationParams } from '@/types';

/**
 * 날짜를 포맷팅하는 함수
 * @param date - 포맷팅할 날짜
 * @param locale - 로케일 (기본값: 'ko-KR')
 * @returns 포맷팅된 날짜 문자열
 */
export const formatDate = (date: Date | string, locale = 'ko-KR'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
};

/**
 * 숫자를 통화 형식으로 포맷팅하는 함수
 * @param amount - 포맷팅할 금액
 * @param currency - 통화 코드 (기본값: 'KRW')
 * @returns 포맷팅된 통화 문자열
 */
export const formatCurrency = (amount: number, currency = 'KRW'): string => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * 문자열을 자르고 말줄임표를 추가하는 함수
 * @param text - 원본 문자열
 * @param maxLength - 최대 길이
 * @returns 잘린 문자열
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

/**
 * 아이디 유효성을 검사하는 함수
 * @param email - 검사할 아이디
 * @returns 유효성 여부
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 비밀번호 강도를 확인하는 함수
 * @param password - 검사할 비밀번호
 * @returns 비밀번호 강도 (weak, medium, strong)
 */
export const checkPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  const hasLetters = /[A-Za-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < 8) return 'weak';
  if (hasLetters && hasNumbers && hasSpecialChars) return 'strong';
  return 'medium';
};

/**
 * 로컬 스토리지에서 값을 안전하게 가져오는 함수
 * @param key - 스토리지 키
 * @returns 저장된 값 또는 null
 */
export const getFromStorage = <T>(key: string): T | null => {
  if (typeof window === 'undefined') return null;

  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error getting item ${key} from localStorage:`, error);
    return null;
  }
};

/**
 * 로컬 스토리지에 값을 안전하게 저장하는 함수
 * @param key - 스토리지 키
 * @param value - 저장할 값
 */
export const saveToStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving item ${key} to localStorage:`, error);
  }
};

/**
 * 로컬 스토리지에서 항목을 안전하게 제거하는 함수
 * @param key - 스토리지 키
 */
export const removeFromStorage = (key: string): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item ${key} from localStorage:`, error);
  }
};

/**
 * 쿼리 파라미터를 URL 문자열로 변환하는 함수
 * @param params - 파라미터 객체
 * @returns 쿼리 문자열
 */
export const createQueryString = (params: Record<string, string | number | boolean>): string => {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');
};

/**
 * 페이지네이션 응답을 생성하는 헬퍼 함수
 * @param items - 항목 배열
 * @param total - 전체 항목 수
 * @param params - 페이지네이션 파라미터
 * @returns 페이지네이션 응답 객체
 */
export const createPaginatedResponse = <T>(
  items: T[],
  total: number,
  params: PaginationParams
): PaginatedResponse<T> => {
  const { page, limit } = params;

  return {
    items,
    total,
    page,
    limit,
    hasMore: total > page * limit,
  };
};

/**
 * 고유한 ID를 생성하는 함수
 * @returns 고유 ID 문자열
 */
export const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * 객체의 깊은 복사본을 만드는 함수
 * @param obj - 복사할 객체
 * @returns 복사된 객체
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * debounce 유틸리티 함수
 * @param fn - 디바운스할 함수
 * @param delay - 지연 시간 (ms)
 * @returns 디바운스된 함수
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(fn: T, delay: number) => {
  let timeoutId: NodeJS.Timeout;

  return function (this: unknown, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
};
