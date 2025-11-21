import React from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 text-center"
      >
        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">提示词生成器</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          请在左侧导航中选择"提示词生成器"开始使用
        </p>
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            onClick={() => window.location.href = "/"}
          >
            立即开始
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}