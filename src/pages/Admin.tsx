import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthContext } from '../contexts/authContext';
import { ProductTable } from '../components/ProductTable';
import { ProductForm } from '../components/ProductForm';
import { getProducts } from '../services/productService';
import { Product } from '../models/product';
import { useTheme } from '../hooks/useTheme';

export default function Admin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { isDark } = useTheme();

  // 检查用户是否已认证
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // 加载产品数据
  useEffect(() => {
    if (isAuthenticated) {
      loadProducts();
    }
  }, [isAuthenticated, showForm, isEditing]);

  const loadProducts = () => {
    try {
      console.log('正在加载产品列表...');
      const loadedProducts = getProducts();
      setProducts(loadedProducts);
      console.log('产品列表加载成功，共', loadedProducts.length, '个产品');
    } catch (error) {
      console.error('加载产品列表失败:', error);
      toast.error('加载产品列表失败，请刷新页面重试');
      setProducts([]);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('已成功退出登录');
  };

  const handleAddProduct = () => {
    setIsEditing(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setIsEditing(product);
    setShowForm(true);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setIsEditing(null);
  };

  const handleSubmitSuccess = () => {
    loadProducts();
    setShowForm(false);
    setIsEditing(null);
  };

  const handleDeleteSuccess = () => {
    loadProducts();
  };

  // 如果未认证，不渲染管理界面
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'dark' : ''}`}>
      {/* 顶部导航 */}
      <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <i className="fas fa-tachometer-alt text-blue-600 text-2xl"></i>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">后台管理系统</h1>
          </div>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors flex items-center"
          >
            <i className="fas fa-sign-out-alt mr-2"></i>
            <span>退出登录</span>
          </button>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {!showForm ? (
          // 产品列表视图
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">产品管理</h2>
              <button
                onClick={handleAddProduct}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center"
              >
                <i className="fas fa-plus mr-2"></i>
                <span>添加产品</span>
              </button>
            </div>
            <ProductTable 
              products={products} 
              onEdit={handleEditProduct} 
              onDeleteSuccess={handleDeleteSuccess} 
            />
          </div>
        ) : (
          // 产品表单视图
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center mb-6">
              <button
                onClick={handleFormCancel}
                className="mr-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <i className="fas fa-arrow-left"></i>
              </button>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isEditing ? '编辑产品' : '添加产品'}
              </h2>
            </div>
            <ProductForm 
              product={isEditing} 
              onSubmitSuccess={handleSubmitSuccess} 
              onCancel={handleFormCancel} 
            />
          </div>
        )}
      </main>

      {/* 页脚 */}
      <footer className="bg-white dark:bg-gray-900 shadow-inner py-4">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>后台管理系统 &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}