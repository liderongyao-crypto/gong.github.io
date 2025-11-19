import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Sun, Moon, ChevronRight } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { Link } from 'react-router-dom';

// 功能卡片组件
interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  link?: string;
  onClick?: () => void;
}

function FeatureCard({ title, description, icon, link, onClick }: FeatureCardProps) {
  const CardContent = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700"
    >
      <div className="text-2xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">{title}</h3>
      <p className="text-slate-600 dark:text-slate-300 mb-4 flex-grow">{description}</p>
      <div className="text-blue-600 dark:text-blue-400 font-medium text-sm flex items-center">
        了解更多
        <ChevronRight className="w-4 h-4 ml-1" />
      </div>
    </motion.div>
  );

  if (link) {
    return (
      <Link to={link} className="block hover:shadow-xl transition-shadow">
        <CardContent />
      </Link>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="block hover:shadow-xl transition-shadow"
    >
      <CardContent />
    </motion.button>
  );
}

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
  
  const currentTime = currentDate.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      {/* 头部 */}
      <header className="sticky top-0 z-10 w-full backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">模板应用</h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label={theme === 'light' ? '切换到暗色模式' : '切换到亮色模式'}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-slate-700" />
            ) : (
              <Sun className="w-5 h-5 text-yellow-400" />
            )}
          </button>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* 欢迎卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700"
        >
          <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">欢迎使用</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            这是一个基于 React 和 TypeScript 的模板应用，您可以在这里开发各种功能丰富的页面。
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <Calendar className="w-5 h-5 text-blue-500 mr-3" />
              <span className="text-slate-700 dark:text-slate-200">{formattedDate}</span>
            </div>
            <div className="flex items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <Clock className="w-5 h-5 text-green-500 mr-3" />
              <span className="text-slate-700 dark:text-slate-200">{currentTime}</span>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center"
          >
            <span>开始探索</span>
            <ChevronRight className="w-4 h-4 ml-2" />
          </motion.button>
        </motion.div>

        {/* 功能卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureCard
            title="提示词生成器"
            description="创建和管理您的 AI 提示词，提升 AI 交互体验。"
            icon="✨"
            link="/prompt-generator"
          />
          
          <FeatureCard
            title="主题切换"
            description="根据您的喜好或环境切换明暗主题。"
            icon="🎨"
            onClick={toggleTheme}
          />
        </div>
      </main>

      {/* 页脚 */}
      <footer className="w-full bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-4">
        <div className="container mx-auto px-4 text-center text-slate-500 dark:text-slate-400 text-sm">
          © {currentDate.getFullYear()} 模板应用 - 版权所有
        </div>
      </footer>
    </div>
  );
}