import { useState } from 'react';
import { toast } from 'sonner';
import { Product } from '../models/product';
import { deleteProduct } from '../services/productService';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDeleteSuccess: () => void;
}

// 表格中分类的样式
const getCategoryTableStyle = (category: string): string => {
  const categoryStyles: Record<string, string> = {
    '精选': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    '优质': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    '实用': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    '小众': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    '宝藏': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
    '干货': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    '高分': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    '口碑': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
  };
  
  return categoryStyles[category] || categoryStyles['精选'];
};

export const ProductTable = ({ products, onEdit, onDeleteSuccess }: ProductTableProps) => {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        const success = deleteProduct(deleteId);
        if (success) {
          toast.success('产品删除成功');
          onDeleteSuccess();
        } else {
          toast.error('产品删除失败：未找到指定产品');
        }
      } catch (error) {
        // 显示更具体的错误信息
        const errorMessage = error instanceof Error ? error.message : '产品删除失败';
        toast.error(errorMessage);
      } finally {
        setDeleteId(null);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteId(null);
  };

  const getProductById = (id: string): Product | undefined => {
    return products.find(product => product.id === id);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
             <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
               <tr>
                 <th scope="col" className="px-6 py-3 w-24">图片</th>
                 <th scope="col" className="px-6 py-3">标题</th>
                 <th scope="col" className="px-6 py-3">分类</th>
                 <th scope="col" className="px-6 py-3">网址</th>
                 <th scope="col" className="px-6 py-3">描述</th>
                 <th scope="col" className="px-6 py-3 text-right">操作</th>
               </tr>
             </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center">
                      <i className="fas fa-box-open text-4xl mb-3 text-gray-300 dark:text-gray-600"></i>
                      <p>暂无产品数据</p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr 
                    key={product.id} 
                    className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
                  >
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded overflow-hidden">
                        <img 
                          src={product.imageUrl} 
                          alt={product.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                     <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                       {product.title}
                     </td>
                     <td className="px-6 py-4">
                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                         getCategoryTableStyle(product.category)
                       }`}>
                         {product.category}
                       </span>
                     </td>
                     <td className="px-6 py-4">
                       <a 
                         href={product.url} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[150px] inline-block"
                       >
                         {product.url}
                       </a>
                     </td>
                    <td className="px-6 py-4">
                      <div className="line-clamp-2 max-w-[250px]">
                        {product.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => onEdit(product)}
                          className="p-1 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded transition-colors"
                          aria-label="编辑"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30 rounded transition-colors"
                          aria-label="删除"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 删除确认对话框 */}
      {deleteId && getProductById(deleteId) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full mb-3">
                <i className="fas fa-exclamation-triangle text-xl text-red-600 dark:text-red-400"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">确认删除</h3>
              <p className="text-gray-600 dark:text-gray-400">
                您确定要删除产品"
                <span className="font-medium">{getProductById(deleteId)?.title}</span>"吗？
                此操作不可撤销。
              </p>
            </div>
            <div className="flex justify-center space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};