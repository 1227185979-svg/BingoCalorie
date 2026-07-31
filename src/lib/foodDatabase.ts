// 食物热量数据库 (每100g的热量 kcal)
export interface FoodItem {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  caloriesPer100g: number;
  typicalServing: number; // 典型一份的克数
  icon: string;
}

export const foodDatabase: FoodItem[] = [
  // 主食类
  { id: 'rice', name: '白米饭', nameEn: 'Rice', category: '主食', caloriesPer100g: 116, typicalServing: 200, icon: '🍚' },
  { id: 'noodles', name: '面条', nameEn: 'Noodles', category: '主食', caloriesPer100g: 110, typicalServing: 200, icon: '🍜' },
  { id: 'bread', name: '面包', nameEn: 'Bread', category: '主食', caloriesPer100g: 265, typicalServing: 60, icon: '🍞' },
  { id: 'mantou', name: '馒头', nameEn: 'Steamed Bun', category: '主食', caloriesPer100g: 221, typicalServing: 100, icon: '🫓' },
  { id: 'congee', name: '白粥', nameEn: 'Congee', category: '主食', caloriesPer100g: 46, typicalServing: 300, icon: '🥣' },
  { id: 'dumpling', name: '水饺', nameEn: 'Dumplings', category: '主食', caloriesPer100g: 196, typicalServing: 200, icon: '🥟' },
  { id: 'friedrice', name: '炒饭', nameEn: 'Fried Rice', category: '主食', caloriesPer100g: 174, typicalServing: 300, icon: '🍛' },
  
  // 肉类
  { id: 'chicken_breast', name: '鸡胸肉', nameEn: 'Chicken Breast', category: '肉类', caloriesPer100g: 133, typicalServing: 150, icon: '🍗' },
  { id: 'pork', name: '猪肉', nameEn: 'Pork', category: '肉类', caloriesPer100g: 242, typicalServing: 100, icon: '🥩' },
  { id: 'beef', name: '牛肉', nameEn: 'Beef', category: '肉类', caloriesPer100g: 250, typicalServing: 100, icon: '🥩' },
  { id: 'fish', name: '鱼', nameEn: 'Fish', category: '肉类', caloriesPer100g: 104, typicalServing: 150, icon: '🐟' },
  { id: 'shrimp', name: '虾', nameEn: 'Shrimp', category: '肉类', caloriesPer100g: 85, typicalServing: 100, icon: '🦐' },
  { id: 'egg', name: '鸡蛋', nameEn: 'Egg', category: '肉类', caloriesPer100g: 144, typicalServing: 60, icon: '🥚' },
  { id: 'duck', name: '鸭肉', nameEn: 'Duck', category: '肉类', caloriesPer100g: 240, typicalServing: 100, icon: '🦆' },
  
  // 蔬菜类
  { id: 'broccoli', name: '西兰花', nameEn: 'Broccoli', category: '蔬菜', caloriesPer100g: 34, typicalServing: 100, icon: '🥦' },
  { id: 'tomato', name: '番茄', nameEn: 'Tomato', category: '蔬菜', caloriesPer100g: 18, typicalServing: 150, icon: '🍅' },
  { id: 'cucumber', name: '黄瓜', nameEn: 'Cucumber', category: '蔬菜', caloriesPer100g: 16, typicalServing: 150, icon: '🥒' },
  { id: 'spinach', name: '菠菜', nameEn: 'Spinach', category: '蔬菜', caloriesPer100g: 23, typicalServing: 100, icon: '🥬' },
  { id: 'potato', name: '土豆', nameEn: 'Potato', category: '蔬菜', caloriesPer100g: 77, typicalServing: 150, icon: '🥔' },
  { id: 'corn', name: '玉米', nameEn: 'Corn', category: '蔬菜', caloriesPer100g: 112, typicalServing: 200, icon: '🌽' },
  { id: 'carrot', name: '胡萝卜', nameEn: 'Carrot', category: '蔬菜', caloriesPer100g: 41, typicalServing: 100, icon: '🥕' },
  
  // 水果类
  { id: 'apple', name: '苹果', nameEn: 'Apple', category: '水果', caloriesPer100g: 52, typicalServing: 200, icon: '🍎' },
  { id: 'banana', name: '香蕉', nameEn: 'Banana', category: '水果', caloriesPer100g: 89, typicalServing: 120, icon: '🍌' },
  { id: 'orange', name: '橙子', nameEn: 'Orange', category: '水果', caloriesPer100g: 47, typicalServing: 180, icon: '🍊' },
  { id: 'grape', name: '葡萄', nameEn: 'Grape', category: '水果', caloriesPer100g: 69, typicalServing: 100, icon: '🍇' },
  { id: 'watermelon', name: '西瓜', nameEn: 'Watermelon', category: '水果', caloriesPer100g: 30, typicalServing: 300, icon: '🍉' },
  { id: 'strawberry', name: '草莓', nameEn: 'Strawberry', category: '水果', caloriesPer100g: 32, typicalServing: 150, icon: '🍓' },
  
  // 饮品类
  { id: 'milk', name: '牛奶', nameEn: 'Milk', category: '饮品', caloriesPer100g: 42, typicalServing: 250, icon: '🥛' },
  { id: 'soymilk', name: '豆浆', nameEn: 'Soy Milk', category: '饮品', caloriesPer100g: 33, typicalServing: 300, icon: '🧋' },
  { id: 'coffee', name: '咖啡(无糖)', nameEn: 'Black Coffee', category: '饮品', caloriesPer100g: 2, typicalServing: 240, icon: '☕' },
  { id: 'latte', name: '拿铁', nameEn: 'Latte', category: '饮品', caloriesPer100g: 56, typicalServing: 350, icon: '☕' },
  { id: 'juice', name: '果汁', nameEn: 'Juice', category: '饮品', caloriesPer100g: 45, typicalServing: 250, icon: '🧃' },
  { id: 'cola', name: '可乐', nameEn: 'Cola', category: '饮品', caloriesPer100g: 42, typicalServing: 330, icon: '🥤' },
  { id: 'milktea', name: '奶茶', nameEn: 'Milk Tea', category: '饮品', caloriesPer100g: 58, typicalServing: 500, icon: '🧋' },
  
  // 零食/甜品类
  { id: 'chocolate', name: '巧克力', nameEn: 'Chocolate', category: '零食', caloriesPer100g: 546, typicalServing: 40, icon: '🍫' },
  { id: 'cake', name: '蛋糕', nameEn: 'Cake', category: '零食', caloriesPer100g: 348, typicalServing: 80, icon: '🍰' },
  { id: 'cookie', name: '饼干', nameEn: 'Cookie', category: '零食', caloriesPer100g: 502, typicalServing: 30, icon: '🍪' },
  { id: 'icecream', name: '冰淇淋', nameEn: 'Ice Cream', category: '零食', caloriesPer100g: 207, typicalServing: 100, icon: '🍦' },
  { id: 'chips', name: '薯片', nameEn: 'Chips', category: '零食', caloriesPer100g: 547, typicalServing: 50, icon: '🥔' },
  
  // 快餐类
  { id: 'burger', name: '汉堡', nameEn: 'Burger', category: '快餐', caloriesPer100g: 295, typicalServing: 200, icon: '🍔' },
  { id: 'pizza', name: '披萨', nameEn: 'Pizza', category: '快餐', caloriesPer100g: 266, typicalServing: 150, icon: '🍕' },
  { id: 'friedchicken', name: '炸鸡', nameEn: 'Fried Chicken', category: '快餐', caloriesPer100g: 296, typicalServing: 150, icon: '🍗' },
  { id: 'hotdog', name: '热狗', nameEn: 'Hot Dog', category: '快餐', caloriesPer100g: 290, typicalServing: 120, icon: '🌭' },
  { id: 'fries', name: '薯条', nameEn: 'French Fries', category: '快餐', caloriesPer100g: 312, typicalServing: 120, icon: '🍟' },
  
  // 豆制品
  { id: 'tofu', name: '豆腐', nameEn: 'Tofu', category: '豆制品', caloriesPer100g: 76, typicalServing: 150, icon: '🫘' },
  { id: 'soybean', name: '黄豆', nameEn: 'Soybean', category: '豆制品', caloriesPer100g: 390, typicalServing: 50, icon: '🫘' },
  
  // 汤类
  { id: 'miso_soup', name: '味增汤', nameEn: 'Miso Soup', category: '汤类', caloriesPer100g: 21, typicalServing: 200, icon: '🍲' },
  { id: 'egg_soup', name: '蛋花汤', nameEn: 'Egg Drop Soup', category: '汤类', caloriesPer100g: 25, typicalServing: 200, icon: '🍲' },
  { id: 'bone_soup', name: '骨头汤', nameEn: 'Bone Broth', category: '汤类', caloriesPer100g: 35, typicalServing: 300, icon: '🍲' },
];

export const foodCategories = [...new Set(foodDatabase.map(f => f.category))];

export function searchFood(keyword: string): FoodItem[] {
  const lower = keyword.toLowerCase();
  return foodDatabase.filter(f => 
    f.name.includes(keyword) || 
    f.nameEn.toLowerCase().includes(lower) ||
    f.category.includes(keyword)
  );
}

export function getFoodsByCategory(category: string): FoodItem[] {
  return foodDatabase.filter(f => f.category === category);
}

// 模拟AI识别 - 随机返回2-4个食物作为识别结果
export function simulateAIRecognition(): FoodItem[] {
  const count = Math.floor(Math.random() * 3) + 2;
  const shuffled = [...foodDatabase].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
