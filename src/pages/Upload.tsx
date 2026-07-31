import { useState, useRef } from 'react';
import { Camera, Search, Plus, Minus, Check, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { foodDatabase, foodCategories, searchFood, simulateAIRecognition, type FoodItem } from '@/lib/foodDatabase';
import { saveMealRecord, generateId, formatDate, type MealFood } from '@/lib/storage';

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export default function Upload() {
  const [step, setStep] = useState<'upload' | 'select' | 'confirm'>('upload');
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFoods, setSelectedFoods] = useState<Map<string, { food: FoodItem; grams: number }>>(new Map());
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [recognizedFoods, setRecognizedFoods] = useState<FoodItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('全部');
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target?.result as string);
        // 模拟AI识别
        setIsRecognizing(true);
        setTimeout(() => {
          const recognized = simulateAIRecognition();
          setRecognizedFoods(recognized);
          setIsRecognizing(false);
          // 自动添加识别的食物
          const newMap = new Map(selectedFoods);
          recognized.forEach(food => {
            if (!newMap.has(food.id)) {
              newMap.set(food.id, { food, grams: food.typicalServing });
            }
          });
          setSelectedFoods(newMap);
          setStep('select');
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSkipUpload = () => {
    setStep('select');
  };

  const toggleFood = (food: FoodItem) => {
    const newMap = new Map(selectedFoods);
    if (newMap.has(food.id)) {
      newMap.delete(food.id);
    } else {
      newMap.set(food.id, { food, grams: food.typicalServing });
    }
    setSelectedFoods(newMap);
  };

  const updateGrams = (foodId: string, delta: number) => {
    const newMap = new Map(selectedFoods);
    const item = newMap.get(foodId);
    if (item) {
      const newGrams = Math.max(10, item.grams + delta);
      newMap.set(foodId, { ...item, grams: newGrams });
      setSelectedFoods(newMap);
    }
  };

  const calculateCalories = (food: FoodItem, grams: number) => {
    return Math.round((food.caloriesPer100g * grams) / 100);
  };

  const totalCalories = Array.from(selectedFoods.values()).reduce(
    (sum, item) => sum + calculateCalories(item.food, item.grams), 0
  );

  const handleSave = () => {
    const foods: MealFood[] = Array.from(selectedFoods.values()).map(item => ({
      foodId: item.food.id,
      name: item.food.name,
      icon: item.food.icon,
      grams: item.grams,
      calories: calculateCalories(item.food, item.grams),
    }));

    const record = {
      id: generateId(),
      date: formatDate(new Date()),
      mealType,
      foods,
      totalCalories,
      imageUrl: imagePreview || undefined,
      createdAt: new Date().toISOString(),
    };

    saveMealRecord(record);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setStep('upload');
      setSelectedFoods(new Map());
      setImagePreview(null);
      setRecognizedFoods([]);
    }, 2000);
  };

  const filteredFoods = searchQuery
    ? searchFood(searchQuery)
    : activeCategory === '全部'
      ? foodDatabase
      : foodDatabase.filter(f => f.category === activeCategory);

  if (saved) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4 animate-bounce">
          <Check size={40} className="text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">记录成功！</h3>
        <p className="text-sm text-gray-500 mt-1">已记录 {totalCalories} kcal</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4">
      {/* 餐次选择 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100">
        <p className="text-sm font-medium text-gray-600 mb-3">选择餐次</p>
        <Tabs value={mealType} onValueChange={(v) => setMealType(v as MealType)}>
          <TabsList className="grid grid-cols-4 w-full bg-orange-50">
            <TabsTrigger value="breakfast" className="text-xs data-[state=active]:bg-orange-500 data-[state=active]:text-white">🌅 早餐</TabsTrigger>
            <TabsTrigger value="lunch" className="text-xs data-[state=active]:bg-orange-500 data-[state=active]:text-white">☀️ 午餐</TabsTrigger>
            <TabsTrigger value="dinner" className="text-xs data-[state=active]:bg-orange-500 data-[state=active]:text-white">🌙 晚餐</TabsTrigger>
            <TabsTrigger value="snack" className="text-xs data-[state=active]:bg-orange-500 data-[state=active]:text-white">🍿 加餐</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {step === 'upload' && (
        <div className="space-y-4">
          {/* 图片上传区域 */}
          <div
            className="bg-white rounded-2xl p-8 shadow-sm border-2 border-dashed border-orange-200 hover:border-orange-400 transition-colors cursor-pointer text-center"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-100 to-rose-100 flex items-center justify-center mx-auto mb-4">
              <Camera size={28} className="text-orange-500" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">上传饮食照片</h3>
            <p className="text-sm text-gray-500">拍照或选择相册图片，AI 智能识别食物</p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Sparkles size={14} className="text-orange-500" />
              <span className="text-xs text-orange-600 font-medium">AI 自动识别食物及热量</span>
            </div>
          </div>

          {/* 或者手动选择 */}
          <div className="text-center">
            <button
              onClick={handleSkipUpload}
              className="text-sm text-orange-600 font-medium hover:text-orange-700 underline underline-offset-4"
            >
              跳过上传，手动选择食物
            </button>
          </div>
        </div>
      )}

      {step === 'select' && (
        <div className="space-y-4">
          {/* AI识别结果 */}
          {imagePreview && (
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-orange-100">
              <div className="relative h-40">
                <img src={imagePreview} alt="meal" className="w-full h-full object-cover" />
                {isRecognizing && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-white">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm font-medium">AI 识别中...</span>
                    </div>
                  </div>
                )}
              </div>
              {recognizedFoods.length > 0 && (
                <div className="p-3 bg-orange-50">
                  <div className="flex items-center gap-1 mb-2">
                    <Sparkles size={14} className="text-orange-500" />
                    <span className="text-xs font-medium text-orange-700">AI 识别结果（可调整）</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {recognizedFoods.map(food => (
                      <span key={food.id} className="px-2 py-1 bg-white rounded-full text-xs font-medium text-gray-700 border border-orange-200">
                        {food.icon} {food.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 搜索框 */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="搜索食物..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 bg-white border-orange-200 focus:border-orange-400 rounded-xl"
            />
          </div>

          {/* 分类标签 */}
          {!searchQuery && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {['全部', ...foodCategories].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* 食物列表 */}
          <div className="bg-white rounded-2xl shadow-sm border border-orange-100 divide-y divide-orange-50 max-h-64 overflow-y-auto">
            {filteredFoods.map(food => {
              const isSelected = selectedFoods.has(food.id);
              return (
                <div
                  key={food.id}
                  className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-orange-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => toggleFood(food)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{food.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{food.name}</p>
                      <p className="text-xs text-gray-400">{food.caloriesPer100g} kcal/100g</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected ? 'bg-orange-500 border-orange-500' : 'border-gray-300'
                  }`}>
                    {isSelected && <Check size={12} className="text-white" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 已选食物和克数调整 */}
          {selectedFoods.size > 0 && (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-800">已选食物</h4>
                <span className="text-sm font-bold text-orange-600">{totalCalories} kcal</span>
              </div>
              {Array.from(selectedFoods.values()).map(({ food, grams }) => (
                <div key={food.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <span>{food.icon}</span>
                    <span className="text-sm text-gray-700">{food.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); updateGrams(food.id, -10); }}
                      className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-medium w-12 text-center">{grams}g</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); updateGrams(food.id, 10); }}
                      className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                    >
                      <Plus size={12} />
                    </button>
                    <span className="text-xs text-gray-500 w-14 text-right">
                      {calculateCalories(food, grams)} kcal
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFood(food); }}
                      className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 ml-1"
                    >
                      <X size={10} className="text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
              
              <Button
                onClick={handleSave}
                className="w-full mt-3 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white rounded-xl h-11 font-semibold shadow-lg shadow-orange-200"
              >
                <Check size={16} className="mr-1" />
                保存记录 ({totalCalories} kcal)
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
