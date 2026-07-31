import { useState, useEffect } from 'react';
import { Save, Calculator, Activity, Heart, Scale, Ruler, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { getUserProfile, saveUserProfile, type UserProfile } from '@/lib/storage';
import {
  calculateBMR,
  calculateTDEE,
  calculateBMI,
  getBMICategory,
  getDailyRecommendation,
  calculateWeightLossCalories,
  activityLabels,
} from '@/lib/calorieCalculator';

type Props = {
  userName?: string;
};

export default function Profile({ userName }: Props) {
  const [profile, setProfile] = useState<UserProfile>({
    gender: 'male',
    age: 25,
    height: 170,
    weight: 70,
    targetWeight: undefined,
    activityLevel: 'light',
  });
  const [saved, setSaved] = useState(false);
  const [weeksToGoal, setWeeksToGoal] = useState(12);

  useEffect(() => {
    const stored = getUserProfile();
    if (stored) setProfile(stored);
  }, []);

  const handleSave = () => {
    saveUserProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const bmr = calculateBMR(profile);
  const tdee = calculateTDEE(profile);
  const bmi = calculateBMI(profile.height, profile.weight);
  const bmiCategory = getBMICategory(bmi);
  const recommendation = getDailyRecommendation(profile);
  const weightLoss = profile.targetWeight ? calculateWeightLossCalories(profile, weeksToGoal) : null;

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4 pb-8">
      {/* 个人信息头部 */}
      <div className="bg-gradient-to-br from-orange-500 via-rose-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl shadow-orange-200">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            <UserIcon size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{userName || '用户'}</h2>
            <p className="text-white/70 text-sm mt-0.5">
              BMI: {bmi} · <span style={{ color: bmiCategory.color }}>{bmiCategory.label}</span>
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-5">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
            <p className="text-2xl font-bold">{Math.round(bmr)}</p>
            <p className="text-xs text-white/70 mt-0.5">基础代谢</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
            <p className="text-2xl font-bold">{tdee}</p>
            <p className="text-xs text-white/70 mt-0.5">每日消耗</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
            <p className="text-2xl font-bold">{bmi}</p>
            <p className="text-xs text-white/70 mt-0.5">BMI指数</p>
          </div>
        </div>
      </div>

      {/* 身体数据表单 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-orange-100 space-y-4">
        <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
          <Activity size={18} className="text-orange-500" />
          身体数据
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs text-gray-500">性别</Label>
            <Select value={profile.gender} onValueChange={v => setProfile({ ...profile, gender: v as 'male' | 'female' })}>
              <SelectTrigger className="border-orange-200 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">♂ 男</SelectItem>
                <SelectItem value="female">♀ 女</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-gray-500">年龄</Label>
            <Input
              type="number"
              value={profile.age}
              onChange={e => setProfile({ ...profile, age: Number(e.target.value) })}
              className="border-orange-200 rounded-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs text-gray-500 flex items-center gap-1">
              <Ruler size={12} /> 身高 (cm)
            </Label>
            <Input
              type="number"
              value={profile.height}
              onChange={e => setProfile({ ...profile, height: Number(e.target.value) })}
              className="border-orange-200 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-gray-500 flex items-center gap-1">
              <Scale size={12} /> 体重 (kg)
            </Label>
            <Input
              type="number"
              value={profile.weight}
              onChange={e => setProfile({ ...profile, weight: Number(e.target.value) })}
              className="border-orange-200 rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-gray-500">活动水平</Label>
          <Select value={profile.activityLevel} onValueChange={v => setProfile({ ...profile, activityLevel: v as UserProfile['activityLevel'] })}>
            <SelectTrigger className="border-orange-200 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(activityLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-gray-500 flex items-center gap-1">
            <Heart size={12} /> 目标体重 (kg，选填)
          </Label>
          <Input
            type="number"
            value={profile.targetWeight || ''}
            onChange={e => setProfile({ ...profile, targetWeight: e.target.value ? Number(e.target.value) : undefined })}
            placeholder="不填则仅计算维持体重所需热量"
            className="border-orange-200 rounded-xl"
          />
        </div>

        {profile.targetWeight && profile.targetWeight < profile.weight && (
          <div className="space-y-2">
            <Label className="text-xs text-gray-500">
              预计达成时间：{weeksToGoal} 周
            </Label>
            <Slider
              value={[weeksToGoal]}
              onValueChange={v => setWeeksToGoal(v[0])}
              min={4}
              max={52}
              step={1}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>4周</span>
              <span>52周</span>
            </div>
          </div>
        )}

        <Button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white rounded-xl h-11 font-semibold shadow-lg shadow-orange-200"
        >
          <Save size={16} className="mr-1" />
          {saved ? '✓ 已保存' : '保存数据'}
        </Button>
      </div>

      {/* 热量建议 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-orange-100 space-y-4">
        <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
          <Calculator size={18} className="text-orange-500" />
          每日热量建议
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100">
            <div>
              <p className="text-sm font-medium text-gray-800">维持体重</p>
              <p className="text-xs text-gray-500">保持当前体重</p>
            </div>
            <span className="text-lg font-bold text-green-600">{recommendation.maintenance} kcal</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
            <div>
              <p className="text-sm font-medium text-gray-800">轻度减脂</p>
              <p className="text-xs text-gray-500">每周减 0.25kg</p>
            </div>
            <span className="text-lg font-bold text-blue-600">{recommendation.mildLoss} kcal</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl border border-orange-100">
            <div>
              <p className="text-sm font-medium text-gray-800">中度减脂</p>
              <p className="text-xs text-gray-500">每周减 0.5kg</p>
            </div>
            <span className="text-lg font-bold text-orange-600">{recommendation.moderateLoss} kcal</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-rose-50 rounded-xl border border-rose-100">
            <div>
              <p className="text-sm font-medium text-gray-800">强力减脂</p>
              <p className="text-xs text-gray-500">每周减 0.75kg</p>
            </div>
            <span className="text-lg font-bold text-rose-600">{recommendation.intenseLoss} kcal</span>
          </div>
        </div>
      </div>

      {/* 减肥计划 */}
      {weightLoss && (
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-5 shadow-sm border border-purple-100 space-y-3">
          <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <Heart size={18} className="text-purple-500" />
            减重计划
          </h3>
          <p className="text-sm text-gray-600">
            目标：从 <strong>{profile.weight}kg</strong> 减到 <strong>{profile.targetWeight}kg</strong>，
            计划 <strong>{weeksToGoal} 周</strong> 达成
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/80 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-purple-600">{weightLoss.dailyCalories}</p>
              <p className="text-xs text-gray-500 mt-0.5">每日摄入 (kcal)</p>
            </div>
            <div className="bg-white/80 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-purple-600">{weightLoss.monthlyLoss}</p>
              <p className="text-xs text-gray-500 mt-0.5">月均减重 (kg)</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 bg-white/60 rounded-lg p-2">
            💡 提示：建议每日摄入不低于基础代谢的 80%（{Math.round(bmr * 0.8)} kcal），过度节食反而会降低代谢。
          </p>
        </div>
      )}
    </div>
  );
}
