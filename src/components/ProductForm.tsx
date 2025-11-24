import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Product } from '../models/product';
import { addProduct, updateProduct, isValidUrl, handleImageUpload } from '../services/productService';

interface ProductFormProps {
  product?: Product | null;
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

// 产品分类列表
const CATEGORIES = [
  '精选',
  '优质',
  '实用',
  '小众',
  '宝藏',
  '干货',
  '高分',
  '口碑'
];

export const ProductForm = ({ product, onSubmitSuccess, onCancel }: ProductFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('精选');
  const [isLoading, setIsLoading] = useState(false);
  const [dragging, setDragging] = useState(false);

  // 当编辑现有产品时，加载产品数据
  useEffect(() => {
    if (product) {
      setTitle(product.title);
      setDescription(product.description);
      setUrl(product.url);
      setImageUrl(product.imageUrl);
      setCategory(product.category || '精选');
    } else {
      resetForm();
    }
  }, [product]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setUrl('');
    setImageUrl('');
    setCategory('精选');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 表单验证
    if (!title.trim()) {
      toast.error('请输入产品标题');
      return;
    }
    if (!description.trim()) {
      toast.error('请输入产品描述');
      return;
    }
    if (!url.trim()) {
      toast.error('请输入产品网址');
      return;
    }
    if (!isValidUrl(url)) {
      toast.error('请输入有效的网址格式');
      return;
    }
    if (!imageUrl) {
      toast.error('请上传产品图片');
      return;
    }

    setIsLoading(true);

    try {
      if (product) {
        // 更新现有产品
        const updatedProduct = updateProduct(product.id, {
          title,
          description,
          url,
          imageUrl,
          category
        });
        if (updatedProduct) {
          toast.success('产品更新成功');
        } else {
          toast.error('产品更新失败：未找到指定产品');
        }
      } else {
        // 添加新产品
        const newProduct = addProduct({
          title,
          description,
          url,
          imageUrl,
          category
        });
        toast.success('产品添加成功');
      }

      resetForm();
      onSubmitSuccess();
    } catch (error) {
      // 显示更具体的错误信息
      const errorMessage = error instanceof Error ? error.message : '操作失败';
      toast.error(product ? `产品更新失败: ${errorMessage}` : `产品添加失败: ${errorMessage}`);
      
      // 对于localStorage权限相关的错误，提供额外的解决方案提示
      if (error instanceof Error && error.message.includes('存储') && error.message.includes('受限')) {
        setTimeout(() => {
          toast.info('提示：如浏览器隐私模式下存储受限，建议在普通模式下使用或调整浏览器存储设置');
        }, 1500);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processImageFile(file);
    }
    // 重置input值，允许重复选择同一文件
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processImageFile(file);
    }
  };

  const processImageFile = async (file: File) => {
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      toast.error('请上传图片文件');
      return;
    }

    // 检查文件大小（限制10MB）
    if (file.size > 10 * 1024 * 1024) {
      toast.error('图片文件大小不能超过10MB');
      return;
    }

    setIsLoading(true);
    try {
      const imageData = await handleImageUpload(file);
      setImageUrl(imageData);
      toast.success('图片上传成功');
    } catch (error) {
      toast.error('图片上传失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        {product ? '编辑产品' : '添加新产品'}
      </h3>
      
      <form onSubmit={handleSubmit}>
        {/* 图片上传区域 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            产品图片
          </label>
          
          {imageUrl ? (
            <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
              <img 
                src={imageUrl} 
                alt="产品预览" 
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                aria-label="删除图片"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          ) : (
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                dragging 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-300 dark:border-gray-700 hover:border-blue-500'
              } transition-all cursor-pointer`}
              onClick={() => document.getElementById('image-upload')?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-3"></i>
              <p className="text-gray-600 dark:text-gray-400 mb-1">
                点击上传或拖拽图片到此处
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                支持 JPG、PNG、GIF 格式，最大 10MB
              </p>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={isLoading}
              />
            </div>
          )}
        </div>

         {/* 标题输入 */}
         <div className="mb-4">
           <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
             产品标题
           </label>
           <input
             type="text"
             id="title"
             value={title}
             onChange={(e) => setTitle(e.target.value)}
             className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
             placeholder="请输入产品标题"
             disabled={isLoading}
           />
         </div>
         
         {/* 分类选择 */}
         <div className="mb-4">
           <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
             产品分类
           </label>
           <select
             id="category"
             value={category}
             onChange={(e) => setCategory(e.target.value)}
             className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
             disabled={isLoading}
           >
             {CATEGORIES.map((cat) => (
               <option key={cat} value={cat}>{cat}</option>
             ))}
           </select>
         </div>

        {/* 网址输入 */}
        <div className="mb-4">
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            产品网址
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            placeholder="https://example.com"
            disabled={isLoading}
          />
        </div>

        {/* 描述输入 */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            产品描述
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none"
            placeholder="请输入产品描述"
            disabled={isLoading}
          ></textarea>
        </div>

        {/* 按钮区域 */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            disabled={isLoading}
          >
            取消
          </button>
          <button
            type="submit"
            className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-1"></i> 保存中...
              </>
            ) : (
              '保存'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};