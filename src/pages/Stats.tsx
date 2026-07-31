import { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, Area, AreaChart } from 'recharts';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Flame, Target } from 'lucide-react';
import { getMealRecords, formatDate, getWeekRange, getUserProfile, type MealRecord } from '@/lib/storage';
import { calculateTDEE } from '@/lib/calorieCalculator';

type Period = 'week' | 'month' | 'year';

export default function Stats() {
  const [period, setPeriod] = useState<Period>('week');
  const [records, setRecords] = useState<MealRecord[]>([]);
  const [dailyTarget, setDailyTarget] = useState(2000);

  useEffect(() => {
    setRecords(getMealRecords());
    const profile = getUserProfile();
    if (profile) {
      setDailyTarget(calculateTDEE(profile));
    }
  }, []);

  const chartData = useMemo(() => {
    const today = new Date();
    
    if (period === 'week') {
      const { start } = getWeekRange(today);
      const data = [];
      const startDate = new Date(start);
      const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dateStr = formatDate(date);
        const dayRecords = records.filter(r => r.date === dateStr);
        const calories = dayRecords.reduce((sum, r) => sum + r.totalCalories, 0);
        data.push({
          label: weekDays[i],
          date: dateStr,
          calories,
          target: dailyTarget,
        });
      }
      return data;
    }
    
    if (period === 'month') {
      const data = [];
      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      
      for (let i = 1; i <= daysInMonth; i++) {
        const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const dayRecords = records.filter(r => r.date === dateStr);
        const calories = dayRecords.reduce((sum, r) => sum + r.totalCalories, 0);
        data.push({
          label: `${i}日`,
          date: dateStr,
          calories,
          target: dailyTarget,
        });
      }
      return data;
    }
    
    // year - 按月汇总
    const data = [];
    for (let m = 0; m < 12; m++) {
      const monthStart = `${today.getFullYear()}-${String(m + 1).padStart(2, '0')}-01`;
      const monthEnd = `${today.getFullYear()}-${String(m + 1).padStart(2, '0')}-${new Date(today.getFullYear(), m + 1, 0).getDate()}`;
      const monthRecords = records.filter(r => r.date >= monthStart && r.date <= monthEnd);
      const calories = monthRecords.reduce((sum, r) => sum + r.totalCalories, 0);
      const daysWithRecords = new Set(monthRecords.map(r => r.date)).size;
      data.push({
        label: `${m + 1}月`,
        calories,
        avgCalories: daysWithRecords > 0 ? Math.round(calories / daysWithRecords) : 0,
        target: dailyTarget * daysWithRecords,
      });
    }
    return data;
  }, [period, records, dailyTarget]);

  const stats = useMemo(() => {
    const activeDays = chartData.filter(d => d.calories > 0);
    const totalCalories = chartData.reduce((sum, d) => sum + d.calories, 0);
    const avgCalories = activeDays.length > 0 ? Math.round(totalCalories / activeDays.length) : 0;
    const maxCalories = Math.max(...chartData.map(d => d.calories), 0);
    const minCalories = activeDays.length > 0 ? Math.min(...activeDays.map(d => d.calories)) : 0;
    const overDays = activeDays.filter(d => d.calories > dailyTarget).length;
    
    return { totalCalories, avgCalories, maxCalories, minCalories, activeDays: activeDays.length, overDays };
  }, [chartData, dailyTarget]);

  const periodLabel = {
    week: '本周',
    month: '本月',
    year: '本年',
  };

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4">
      {/* 周期切换 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100">
        <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
          <TabsList className="grid grid-cols-3 w-full bg-orange-50">
            <TabsTrigger value="week" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">周报</TabsTrigger>
            <TabsTrigger value="month" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">月报</TabsTrigger>
            <TabsTrigger value="year" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">年报</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* 摘要卡片 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
              <Flame size={16} className="text-orange-500" />
            </div>
            <span className="text-xs text-gray-500">总摄入</span>
          </div>
          <p className="text-xl font-bold text-gray-800">{stats.totalCalories.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-0.5">kcal</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Target size={16} className="text-blue-500" />
            </div>
            <span className="text-xs text-gray-500">日均摄入</span>
          </div>
          <p className="text-xl font-bold text-gray-800">{stats.avgCalories.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-0.5">kcal/天</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingDown size={16} className="text-green-500" />
            </div>
            <span className="text-xs text-gray-500">最低摄入</span>
          </div>
          <p className="text-xl font-bold text-gray-800">{stats.minCalories.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-0.5">kcal</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
              <TrendingUp size={16} className="text-rose-500" />
            </div>
            <span className="text-xs text-gray-500">超标天数</span>
          </div>
          <p className="text-xl font-bold text-gray-800">{stats.overDays}</p>
          <p className="text-xs text-gray-400 mt-0.5">天</p>
        </div>
      </div>

      {/* 图表 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100">
        <h4 className="text-sm font-semibold text-gray-800 mb-4">{periodLabel[period]}热量趋势</h4>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            {period === 'year' ? (
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #fed7aa', fontSize: '12px' }}
                  formatter={(value: number) => [`${value.toLocaleString()} kcal`, '热量']}
                />
                <Bar dataKey="avgCalories" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} name="日均热量" />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#fb923c" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
              </BarChart>
            ) : (
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #fed7aa', fontSize: '12px' }}
                  formatter={(value: number) => [`${value.toLocaleString()} kcal`, '热量']}
                />
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="calories" stroke="#f97316" strokeWidth={2.5} fill="url(#areaGradient)" />
                <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name="目标" />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-4 mt-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-xs text-gray-500">实际摄入</span>
          </div>
          {period !== 'year' && (
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-gray-400 border-dashed" style={{ borderTop: '2px dashed #94a3b8', width: '12px', height: '0' }} />
              <span className="text-xs text-gray-500">每日目标</span>
            </div>
          )}
        </div>
      </div>

      {/* 详细数据表 */}
      {period === 'week' && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100">
          <h4 className="text-sm font-semibold text-gray-800 mb-3">每日明细</h4>
          <div className="space-y-2">
            {chartData.map(day => (
              <div key={day.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-600">{day.label}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        day.calories > dailyTarget ? 'bg-rose-500' : 'bg-orange-400'
                      }`}
                      style={{ width: `${Math.min((day.calories / dailyTarget) * 100, 100)}%` }}
                    />
                  </div>
                  <span className={`text-sm font-medium w-16 text-right ${
                    day.calories > dailyTarget ? 'text-rose-600' : 'text-gray-700'
                  }`}>
                    {day.calories || '—'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
