// 本地存储工具

export interface MealRecord {
  id: string;
  date: string; // YYYY-MM-DD
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: MealFood[];
  totalCalories: number;
  imageUrl?: string;
  createdAt: string;
}

export interface MealFood {
  foodId: string;
  name: string;
  icon: string;
  grams: number;
  calories: number;
}

export interface UserProfile {
  gender: 'male' | 'female';
  age: number;
  height: number; // cm
  weight: number; // kg
  targetWeight?: number; // kg
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
}

const MEALS_KEY = 'bingo_calorie_meals';
const PROFILE_KEY = 'bingo_calorie_profile';

// Meal Records
export function getMealRecords(): MealRecord[] {
  const data = localStorage.getItem(MEALS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveMealRecord(record: MealRecord): void {
  const records = getMealRecords();
  records.push(record);
  localStorage.setItem(MEALS_KEY, JSON.stringify(records));
}

export function deleteMealRecord(id: string): void {
  const records = getMealRecords().filter(r => r.id !== id);
  localStorage.setItem(MEALS_KEY, JSON.stringify(records));
}

export function getMealsByDate(date: string): MealRecord[] {
  return getMealRecords().filter(r => r.date === date);
}

export function getMealsByDateRange(startDate: string, endDate: string): MealRecord[] {
  return getMealRecords().filter(r => r.date >= startDate && r.date <= endDate);
}

export function getDailyCalories(date: string): number {
  return getMealsByDate(date).reduce((sum, r) => sum + r.totalCalories, 0);
}

// User Profile
export function getUserProfile(): UserProfile | null {
  const data = localStorage.getItem(PROFILE_KEY);
  return data ? JSON.parse(data) : null;
}

export function saveUserProfile(profile: UserProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

// 生成唯一ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 日期工具
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getWeekRange(date: Date): { start: string; end: string } {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date);
  monday.setDate(diff);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { start: formatDate(monday), end: formatDate(sunday) };
}

export function getMonthRange(date: Date): { start: string; end: string } {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return { start: formatDate(start), end: formatDate(end) };
}

export function getYearRange(date: Date): { start: string; end: string } {
  const start = new Date(date.getFullYear(), 0, 1);
  const end = new Date(date.getFullYear(), 11, 31);
  return { start: formatDate(start), end: formatDate(end) };
}
