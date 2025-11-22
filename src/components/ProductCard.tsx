import { Product } from '../models/product';

interface ProductCardProps {
  product: Product;
}

// 根据分类返回不同的样式
const getCategoryStyle = (category: string): string => {
  const categoryStyles: Record<string, string> = {
    '精选': 'bg-gradient-to-r from-blue-600 to-blue-800',
    '优质': 'bg-gradient-to-r from-purple-600 to-purple-800',
    '实用': 'bg-gradient-to-r from-green-600 to-green-800',
    '小众': 'bg-gradient-to-r from-yellow-600 to-yellow-800',
    '宝藏': 'bg-gradient-to-r from-pink-600 to-pink-800',
    '干货': 'bg-gradient-to-r from-orange-600 to-orange-800',
    '高分': 'bg-gradient-to-r from-red-600 to-red-800',
    '口碑': 'bg-gradient-to-r from-indigo-600 to-indigo-800'
  };
  
  return categoryStyles[category] || categoryStyles['精选'];
};

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="group relative rounded-xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-[1.02] hover:shadow-blue-500/20">
      {/* 背景图片 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
      
      {/* 产品图片 */}
      <img 
        src={product.imageUrl} 
        alt={product.title} 
        className="w-full aspect-[2/3] object-cover transform transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />
      
      {/* 内容覆盖层 */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 z-20">
         {/* 标签 - 根据分类显示不同颜色 */}
         <div className="mb-2 inline-block">
           <span className={`px-3 py-1 text-white text-xs font-semibold rounded-full ${
             getCategoryStyle(product.category)
           }`}>
             {product.category}
           </span>
         </div>
        
        {/* 标题 */}
        <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-md">
          {product.title}
        </h3>
        
        {/* 描述 */}
        <p className="text-gray-200 mb-4 line-clamp-3 text-sm drop-shadow">
          {product.description}
        </p>
        
        {/* 按钮 */}
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-5 py-2.5 bg-white text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-all duration-300 transform hover:translate-y-[-2px] group"
        >
          <span>立即探索</span>
          <i className="fas fa-chevron-right ml-2 text-xs group-hover:translate-x-[2px] transition-transform"></i>
        </a>
      </div>
    </div>
  );
};