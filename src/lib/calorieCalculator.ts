// BMR 和 TDEE 计算工具
import type { UserProfile } from './storage';

// 活动系数
const activityMultipliers = {
  sedentary: 1.2,      // 久坐不动
  light: 1.375,        // 轻度运动 (每周1-3天)
  moderate: 1.55,      // 中度运动 (每周3-5天)
  active: 1.725,       // 高强度运动 (每周6-7天)
  very_active: 1.9,    // 极高强度运动
};

export const activityLabels = {
  sedentary: '久坐不动',
  light: '轻度运动 (每周1-3天)',
  moderate: '中度运动 (每周3-5天)',
  active: '高强度运动 (每周6-7天)',
  very_active: '极高强度运动',
};

// Mifflin-St Jeor 公式计算 BMR
export function calculateBMR(profile: UserProfile): number {
  if (profile.gender === 'male') {
    return 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
  } else {
    return 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
  }
}

// 计算 TDEE (每日总能量消耗)
export function calculateTDEE(profile: UserProfile): number {
  const bmr = calculateBMR(profile);
  return Math.round(bmr * activityMultipliers[profile.activityLevel]);
}

// 计算减肥所需每日热量
export function calculateWeightLossCalories(profile: UserProfile, weeksToGoal: number = 12): {
  dailyCalories: number;
  weeklyDeficit: number;
  monthlyLoss: number;
} | null {
  if (!profile.targetWeight || profile.targetWeight >= profile.weight) return null;
  
  const tdee = calculateTDEE(profile);
  const totalWeightToLose = profile.weight - profile.targetWeight; // kg
  const weeklyLoss = totalWeightToLose / weeksToGoal; // kg per week
  
  // 1kg 脂肪 ≈ 7700 kcal
  const weeklyDeficit = weeklyLoss * 7700;
  const dailyDeficit = weeklyDeficit / 7;
  const dailyCalories = Math.round(tdee - dailyDeficit);
  
  // 确保不低于基础代谢
  const bmr = calculateBMR(profile);
  const safeDailyCalories = Math.max(dailyCalories, Math.round(bmr * 0.8));
  
  return {
    dailyCalories: safeDailyCalories,
    weeklyDeficit: Math.round(weeklyDeficit),
    monthlyLoss: Math.round(weeklyLoss * 4 * 10) / 10,
  };
}

// 计算 BMI
export function calculateBMI(height: number, weight: number): number {
  const heightM = height / 100;
  return Math.round((weight / (heightM * heightM)) * 10) / 10;
}

// BMI 等级
export function getBMICategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: '偏瘦', color: '#3b82f6' };
  if (bmi < 24) return { label: '正常', color: '#10b981' };
  if (bmi < 28) return { label: '超重', color: '#f59e0b' };
  return { label: '肥胖', color: '#ef4444' };
}

// 获取每日推荐热量
export function getDailyRecommendation(profile: UserProfile): {
  maintenance: number;
  mildLoss: number;
  moderateLoss: number;
  intenseLoss: number;
} {
  const tdee = calculateTDEE(profile);
  return {
    maintenance: tdee,
    mildLoss: Math.round(tdee * 0.9),     // 轻度减脂 (减少10%)
    moderateLoss: Math.round(tdee * 0.8),  // 中度减脂 (减少20%)
    intenseLoss: Math.round(tdee * 0.7),   // 强力减脂 (减少30%)
  };
}
