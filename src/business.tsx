import { useState } from 'react';
import { Home, Camera, BarChart3, User, CalendarDays } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import History from './pages/History';
import Stats from './pages/Stats';
import Profile from './pages/Profile';

type SimpleUser = {
  name?: string;
  username?: string;
};

type BusinessProps = {
  user: SimpleUser | null;
};

type PageType = 'dashboard' | 'upload' | 'history' | 'stats' | 'profile';

const navItems: { id: PageType; label: string; icon: typeof Home }[] = [
  { id: 'dashboard', label: '今日', icon: Home },
  { id: 'upload', label: '记录', icon: Camera },
  { id: 'history', label: '日历', icon: CalendarDays },
  { id: 'stats', label: '统计', icon: BarChart3 },
  { id: 'profile', label: '我的', icon: User },
];

function Business({ user }: BusinessProps) {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'upload':
        return <Upload />;
      case 'history':
        return <History />;
      case 'stats':
        return <Stats />;
      case 'profile':
        return <Profile userName={user?.name} />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-white/80 backdrop-blur-md border-b border-orange-100 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center shadow-md">
            <span className="text-white text-sm font-bold">B</span>
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
            BingoCalorie
          </h1>
        </div>
        <span className="text-sm text-gray-500">
          {user ? `Hi, ${user.name}` : '智能饮食管理'}
        </span>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {renderPage()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-orange-100 shadow-lg z-50">
        <div className="flex items-center justify-around py-2 px-4 max-w-lg mx-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-orange-600 bg-orange-50 scale-105'
                    : 'text-gray-400 hover:text-orange-500'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className={`text-xs ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default Business;
