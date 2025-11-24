import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { getProducts } from "../services/productService";
import { Product } from "../models/product";

export default function Home() {
     const [products, setProducts] = useState<Product[]>([]);
    const [availableCategories, setAvailableCategories] = useState<string[]>([]);


    useEffect(() => {
        const loadedProducts = getProducts();
        setProducts(loadedProducts);
        
        // 提取所有不重复的分类
        const categories = Array.from(new Set(loadedProducts.map(product => product.category)));
        // 按预定义的顺序对分类进行排序
        const categoryOrder = ['精选', '优质', '实用', '小众', '宝藏', '干货', '高分', '口碑'];
        const sortedCategories = categoryOrder.filter(cat => categories.includes(cat));
        
        setAvailableCategories(sortedCategories);
    }, []);

    return (
        <div
            className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
            {}
            <header
                className="bg-black/50 backdrop-blur-md sticky top-0 z-10 border-b border-gray-800">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                     <div className="flex items-center space-x-2">
                        <i className="fas fa-star text-blue-400 text-2xl"></i>
                        <h1
                            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">一人公司
                                                                    </h1>

                    </div>
                     <div className="flex items-center space-x-4">
                         {/* 分类菜单 - 动态显示存在的分类 */}
                         <nav className="overflow-x-auto whitespace-nowrap flex gap-1 py-1 flex-shrink-0 hide-scrollbar">
                             {availableCategories.map((category) => (
                                 <Link
                                     key={category}
                                     to={`/category/${encodeURIComponent(category)}`}
                                     className="px-3 py-1.5 text-xs text-white hover:bg-blue-600/20 hover:text-blue-400 rounded-full transition-colors flex-shrink-0"
                                 >
                                     {category}
                                 </Link>
                             ))}
                         </nav>
                         {/* 移动端分类下拉菜单占位 */}

                        <Link
                            to="/login"
                            className="p-2 text-white font-medium rounded-full hover:bg-gray-800 transition-colors flex items-center justify-center"
                            title="后台管理">
                            <i className="fas fa-tools text-lg"></i>
                        </Link>
                    </div>
                </div>
            </header>
            {}
            <main className="flex-grow container mx-auto px-4 py-12">
                {}
                <div className="text-center mb-16">
                    <div
                        className="inline-block mb-4 px-5 py-1.5 bg-blue-600/20 text-blue-400 text-sm font-semibold rounded-full border border-blue-600/30">全球体验 · 好品推荐</div>
                    <h2
                        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">探索精彩世界
                                                          </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">发现我们精心挑选的优质产品，每一款都经过严格筛选，为您带来卓越体验
                                                          </p>
                </div>
                {}
                {products.length > 0 ? <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products.map(product => <ProductCard key={product.id} product={product} />)}
                </div> : <div className="text-center py-20">
                    <div
                        className="inline-flex items-center justify-center w-20 h-20 bg-gray-800/50 rounded-full mb-6">
                        <i className="fas fa-film text-3xl text-gray-500"></i>
                    </div>
                    <h3 className="text-2xl font-medium text-white mb-3">暂无产品</h3>
                    <p className="text-gray-500 max-w-md mx-auto">管理员尚未添加任何产品，请稍后再来查看
                                                             </p>
                </div>}
            </main>
            {}
            <footer className="bg-black/80 border-t border-gray-800 py-8">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex justify-center items-center space-x-3 mb-4">
                        <i className="fas fa-star text-blue-400 text-xl"></i>
                        <h2
                            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">一人公司
                                                                    </h2>
                    </div>
                    <p className="text-gray-500 text-sm">© 2025 精选信息平台. 保留所有权利.{new Date().getFullYear()}精选产品平台. 保留所有权利.
                                                          </p>
                </div>
            </footer>
        </div>
    );
}