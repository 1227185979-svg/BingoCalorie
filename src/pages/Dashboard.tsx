import { useState, useEffect } from 'react';
import { Plus, Flame, TrendingUp, Utensils } from 'lucide-react';
import { getMealsByDate, formatDate, getUserProfile, type MealRecord } from '@/lib/storage';
import { calculateTDEE } from '@/lib/calorieCalculator';

type DashboardProps = {
  onNavigate: (page: 'upload') => void;
};

const mealTypeLabels = {
  breakfast: { label: '早餐', icon: '🌅', color: 'from-amber-400 to-orange-400' },
  lunch: { label: '午餐', icon: '☀️', color: 'from-orange-400 to-rose-400' },
  dinner: { label: '晚餐', icon: '🌙', color: 'from-purple-400 to-indigo-400' },
  snack: { label: '加餐', icon: '🍿', color: 'from-green-400 to-teal-400' },
};

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [todayMeals, setTodayMeals] = useState<MealRecord[]>([]);
  const [dailyTarget, setDailyTarget] = useState(2000);
  const today = formatDate(new Date());

  useEffect(() => {
    const meals = getMealsByDate(today);
    setTodayMeals(meals);
    
    const profile = getUserProfile();
    if (profile) {
      setDailyTarget(calculateTDEE(profile));
    }
  }, [today]);

  const totalCalories = todayMeals.reduce((sum, m) => sum + m.totalCalories, 0);
  const progress = Math.min((totalCalories / dailyTarget) * 100, 100);
  const remaining = Math.max(dailyTarget - totalCalories, 0);

  const getMealCalories = (type: string) => {
    return todayMeals
      .filter(m => m.mealType === type)
      .reduce((sum, m) => sum + m.totalCalories, 0);
  };

  return (
    <div className="p-4 space-y-5 max-w-lg mx-auto">
      {/* 今日热量卡片 */}
      <div className="bg-gradient-to-br from-orange-500 via-rose-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl shadow-orange-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/80 text-sm font-medium">今日已摄入</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-4xl font-bold">{totalCalories}</span>
              <span className="text-white/70 text-sm">kcal</span>
            </div>
          </div>
          <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border-2 border-white/20">
            <div className="text-center">
              <Flame size={24} className="mx-auto mb-0.5" />
              <span className="text-xs font-medium">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-white/80">
            <span>进度</span>
            <span>目标 {dailyTarget} kcal</span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white/90 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-white/70 text-xs mt-2">
            {remaining > 0 ? `还可以摄入 ${remaining} kcal` : '🎉 今日目标已达成！'}
          </p>
        </div>
      </div>

      {/* 快捷统计 */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-orange-100">
          <Utensils size={18} className="mx-auto mb-1 text-orange-500" />
          <p className="text-2xl font-bold text-gray-800">{todayMeals.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">记录餐次</p>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-orange-100">
          <Flame size={18} className="mx-auto mb-1 text-rose-500" />
          <p className="text-2xl font-bold text-gray-800">{totalCalories}</p>
          <p className="text-xs text-gray-500 mt-0.5">总热量</p>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-orange-100">
          <TrendingUp size={18} className="mx-auto mb-1 text-emerald-500" />
          <p className="text-2xl font-bold text-gray-800">{remaining}</p>
          <p className="text-xs text-gray-500 mt-0.5">剩余可摄</p>
        </div>
      </div>

      {/* 各餐记录 */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-gray-800 px-1">今日餐食</h3>
        {(Object.keys(mealTypeLabels) as Array<keyof typeof mealTypeLabels>).map(type => {
          const info = mealTypeLabels[type];
          const calories = getMealCalories(type);
          const meals = todayMeals.filter(m => m.mealType === type);
          
          return (
            <div key={type} className="bg-white rounded-2xl p-4 shadow-sm border border-orange-50 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center shadow-sm`}>
                    <span className="text-lg">{info.icon}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{info.label}</p>
                    {meals.length > 0 ? (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {meals.flatMap(m => m.foods).map(f => f.icon).join(' ')}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400 mt-0.5">暂无记录</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  {calories > 0 ? (
                    <span className="text-sm font-bold text-gray-700">{calories} kcal</span>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 添加按钮 */}
      <button
        onClick={() => onNavigate('upload')}
        className="fixed bottom-20 right-6 w-14 h-14 bg-gradient-to-br from-orange-500 to-rose-500 rounded-full flex items-center justify-center shadow-xl shadow-orange-300 hover:scale-110 transition-transform z-40"
      >
        <Plus size={24} className="text-white" />
      </button>
    </div>
  );
}
