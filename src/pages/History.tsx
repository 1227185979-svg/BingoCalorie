import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { getMealsByDate, formatDate, deleteMealRecord, type MealRecord } from '@/lib/storage';

const weekDays = ['一', '二', '三', '四', '五', '六', '日'];

export default function History() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [meals, setMeals] = useState<MealRecord[]>([]);

  useEffect(() => {
    setMeals(getMealsByDate(selectedDate));
  }, [selectedDate]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // 获取当月天数
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // 获取当月第一天是周几 (0=周日, 1=周一)
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDeleteMeal = (id: string) => {
    deleteMealRecord(id);
    setMeals(getMealsByDate(selectedDate));
  };

  const getDayCalories = (day: number): number => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayMeals = getMealsByDate(dateStr);
    return dayMeals.reduce((sum, m) => sum + m.totalCalories, 0);
  };

  const mealTypeLabels: Record<string, string> = {
    breakfast: '🌅 早餐',
    lunch: '☀️ 午餐',
    dinner: '🌙 晚餐',
    snack: '🍿 加餐',
  };

  const totalDayCalories = meals.reduce((sum, m) => sum + m.totalCalories, 0);

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4">
      {/* 日历头部 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-orange-50 transition-colors">
            <ChevronLeft size={18} className="text-gray-600" />
          </button>
          <h3 className="text-base font-bold text-gray-800">
            {year} 年 {month + 1} 月
          </h3>
          <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-orange-50 transition-colors">
            <ChevronRight size={18} className="text-gray-600" />
          </button>
        </div>

        {/* 星期头部 */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-400 py-1">
              {day}
            </div>
          ))}
        </div>

        {/* 日历格子 */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isSelected = dateStr === selectedDate;
            const isToday = dateStr === formatDate(new Date());
            const calories = getDayCalories(day);
            const hasRecords = calories > 0;

            return (
              <button
                key={day}
                onClick={() => setSelectedDate(dateStr)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition-all relative ${
                  isSelected
                    ? 'bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-md scale-105'
                    : isToday
                      ? 'bg-orange-50 text-orange-700 font-semibold border border-orange-200'
                      : 'text-gray-700 hover:bg-orange-50'
                }`}
              >
                <span className={`text-xs ${isSelected ? 'font-bold' : ''}`}>{day}</span>
                {hasRecords && (
                  <div className={`w-1 h-1 rounded-full mt-0.5 ${
                    isSelected ? 'bg-white' : 'bg-orange-400'
                  }`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 选中日期的记录 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-semibold text-gray-800">
            {selectedDate === formatDate(new Date()) ? '今日' : selectedDate} 记录
          </h3>
          {totalDayCalories > 0 && (
            <span className="text-sm font-bold text-orange-600">{totalDayCalories} kcal</span>
          )}
        </div>

        {meals.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-orange-100">
            <p className="text-4xl mb-2">🍽️</p>
            <p className="text-sm text-gray-500">这一天还没有记录</p>
          </div>
        ) : (
          meals.map(meal => (
            <div key={meal.id} className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  {mealTypeLabels[meal.mealType]}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-orange-600">{meal.totalCalories} kcal</span>
                  <button
                    onClick={() => handleDeleteMeal(meal.id)}
                    className="p-1 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {meal.foods.map((food, idx) => (
                  <span key={idx} className="px-2 py-1 bg-orange-50 rounded-lg text-xs text-gray-700">
                    {food.icon} {food.name} {food.grams}g ({food.calories}kcal)
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
