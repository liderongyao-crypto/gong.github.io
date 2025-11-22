import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthContext } from '../contexts/authContext';
import { useTheme } from '../hooks/useTheme';

// 模拟的管理员账号信息
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'password'
};

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 简单的表单验证
    if (!username || !password) {
      toast.error('请输入用户名和密码');
      return;
    }

    setIsLoading(true);
    
    // 模拟登录请求延迟
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 验证用户名和密码
      if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        setIsAuthenticated(true);
        toast.success('登录成功！');
        navigate('/admin');
      } else {
        toast.error('用户名或密码错误');
      }
    } catch (error) {
      toast.error('登录失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'dark' : ''}`}>
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
            <i className="fas fa-lock text-2xl text-blue-600 dark:text-blue-400"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">后台管理系统</h2>
          <p className="text-gray-600 dark:text-gray-400">请输入您的账号信息</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              用户名
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-user text-gray-400"></i>
              </div>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                placeholder="请输入用户名"
                autoComplete="username"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              密码
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-key text-gray-400"></i>
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                placeholder="请输入密码"
                autoComplete="current-password"
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                <span>登录中...</span>
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt mr-2"></i>
                <span>登录</span>
              </>
            )}
           </button>
           
           <div className="mt-6">
             <Link
               to="/"
               className="block w-full py-3 px-4 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors flex items-center justify-center"
             >
               <i className="fas fa-home mr-2"></i>
               <span>返回首页</span>
             </Link>
           </div>
        </form>
      </div>
    </div>
  );
}