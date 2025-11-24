// 增强版产品服务 - 解决localStorage权限问题

import { Product } from '../models/product';

const STORAGE_KEY = 'products';

// 添加内存中的临时存储作为备选方案
let memoryStorage: Product[] | null = null;

// 检测localStorage是否可用
const isLocalStorageAvailable = (): boolean => {
  try {
    // 尝试一个简单的localStorage操作
    const testKey = '__test_storage__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    console.warn('localStorage不可用，将使用内存存储作为备选方案', error);
    return false;
  }
};

// 获取所有产品
export const getProducts = (): Product[] => {
  try {
    // 优先尝试从localStorage获取
    if (isLocalStorageAvailable()) {
      const storedProducts = localStorage.getItem(STORAGE_KEY);
      if (storedProducts) {
        try {
          // 确保解析后的数据是有效的产品数组
          const parsedProducts = JSON.parse(storedProducts);
          if (Array.isArray(parsedProducts)) {
            // 验证每个产品是否包含必要字段
            const validProducts = parsedProducts.filter((product: any): product is Product => 
              product && 
              typeof product.id === 'string' && 
              typeof product.title === 'string' &&
              typeof product.description === 'string' &&
              typeof product.url === 'string' &&
              typeof product.imageUrl === 'string' &&
              typeof product.category === 'string'
            );
            
            // 如果localStorage数据有效，同步到内存存储
            if (validProducts.length > 0) {
              memoryStorage = [...validProducts];
            }
            return validProducts;
          }
        } catch (error) {
          console.error('Error parsing products JSON:', error);
          // 如果解析出错，清除损坏的数据
          try {
            localStorage.removeItem(STORAGE_KEY);
          } catch (removeError) {
            console.error('无法清除损坏的localStorage数据:', removeError);
          }
        }
      }
    }
    
    // 如果localStorage不可用或没有数据，检查内存存储
    if (memoryStorage && memoryStorage.length > 0) {
      return [...memoryStorage];
    }
    
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    // 在localStorage不可用的情况下也能继续运行
    
    // 如果内存中有数据，返回内存中的数据
    if (memoryStorage && memoryStorage.length > 0) {
      return [...memoryStorage];
    }
  }
  
  // 返回默认的mock数据 - 电影海报风格
  const defaultProducts: Product[] = [
    {
      id: '1',
      title: '星际探险：未知边界',
      description: '一场穿越银河系的冒险，探索未知星球与文明，揭开宇宙奥秘的科幻史诗',
      url: '/product/1',
      imageUrl: 'data:image/png;base64,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',
      category: '精选'
    },
    {
      id: '2',
      title: '城市暗影：终极追击',
      description: '在繁华都市的阴影下，一名侦探与神秘罪犯展开惊心动魄的智力较量',
      url: '/product/2',
      imageUrl: 'data:image/png;base64,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',
      category: '优质'
    },
    {
      id: '3',
      title: '魔法学院：传承之力',
      description: '年轻魔法师们在古老学院中学习魔法技艺，面对黑暗势力的威胁',
      url: '/product/3',
      imageUrl: 'data:image/png;base64,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',
      category: '实用'
    }
  ];
  
  // 保存到内存存储
  memoryStorage = [...defaultProducts];
  
  // 尝试保存默认数据到localStorage
  try {
    if (isLocalStorageAvailable()) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
    }
  } catch (error) {
    console.error('Error saving default products to localStorage:', error);
    // 即使保存失败也继续返回默认数据
  }
  
  return defaultProducts;
};

// 添加新产品
export const addProduct = (product: Omit<Product, 'id'>): Product => {
  try {
    console.log('尝试添加新产品:', product.title);
    
    // 验证产品数据的完整性
    if (!product.title || !product.description || !product.url || !product.imageUrl || !product.category) {
      throw new Error('产品信息不完整，请填写所有必填字段');
    }
    
    // 尝试获取现有产品
    let products: Product[] = [];
    try {
      products = getProducts();
      console.log('获取现有产品列表成功，共', products.length, '个产品');
    } catch (getError) {
      console.warn('获取现有产品失败，将创建新列表', getError);
      products = [];
    }
    
    // 为图片URL添加时间戳防止缓存
    const productWithTimestamp = {
      ...product,
      imageUrl: addTimestampToImageUrl(product.imageUrl)
    };
    
    // 创建新产品
    const newProduct: Product = {
      ...productWithTimestamp,
      id: Date.now().toString()
    };
    
    // 添加到列表
    products.push(newProduct);
    
    // 更新内存存储
    memoryStorage = [...products];
    console.log('更新内存存储成功，新产品ID:', newProduct.id);
    
    // 尝试保存到localStorage
    try {
      if (isLocalStorageAvailable()) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
        console.log('产品添加成功并保存到localStorage:', newProduct);
      } else {
        console.log('产品添加成功（使用内存存储）:', newProduct);
      }
      return newProduct;
    } catch (storageError) {
      console.error('保存产品到localStorage失败，但已保存到内存存储:', storageError);
      // 即使localStorage保存失败，也视为成功，因为数据已保存到内存
      return newProduct;
    }
  } catch (error) {
    console.error('添加产品失败:', error);
    // 提供更友好的错误信息
    const userFriendlyError = error instanceof Error ? 
      error.message.includes('localStorage') ? 
        '产品添加失败：浏览器存储可能受限，请检查浏览器设置或稍后再试' : 
        error.message : 
      '产品添加失败，请稍后再试';
    throw new Error(userFriendlyError);
  }
};

// 更新产品
export const updateProduct = (id: string, updatedProduct: Partial<Product>): Product | null => {
  try {
    const products = getProducts();
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error('未找到要更新的产品');
    }
    
    // 如果更新了图片URL，添加时间戳防止缓存
    const productWithUpdatedImage = { ...updatedProduct };
    if (productWithUpdatedImage.imageUrl) {
      productWithUpdatedImage.imageUrl = addTimestampToImageUrl(productWithUpdatedImage.imageUrl);
    }
    
    // 合并更新的产品数据
    products[index] = { ...products[index], ...productWithUpdatedImage };
    
    // 更新内存存储
    memoryStorage = [...products];
    
    // 尝试保存到localStorage
    try {
      if (isLocalStorageAvailable()) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
        console.log('产品更新成功并保存到localStorage:', products[index]);
      } else {
        console.log('产品更新成功（使用内存存储）:', products[index]);
      }
      return products[index];
    } catch (storageError) {
      console.error('更新产品到localStorage失败，但已更新到内存存储:', storageError);
      // 即使localStorage保存失败，也视为成功，因为数据已更新到内存
      return products[index];
    }
  } catch (error) {
    console.error('更新产品失败:', error);
    // 提供更友好的错误信息
    const userFriendlyError = error instanceof Error ? 
      error.message.includes('localStorage') ? 
        '产品更新失败：浏览器存储可能受限，请检查浏览器设置或稍后再试' : 
        error.message : 
      '产品更新失败，请稍后再试';
    throw new Error(userFriendlyError);
  }
};

// 删除产品
export const deleteProduct = (id: string): boolean => {
  try {
    console.log('尝试删除产品，ID:', id);
    
    // 先尝试获取当前产品列表
    let products = [];
    try {
      products = getProducts();
      console.log('获取当前产品列表成功，共', products.length, '个产品');
    } catch (getError) {
      console.error('获取产品列表失败:', getError);
      throw new Error('产品删除失败：无法获取产品列表');
    }
    
    const initialLength = products.length;
    
    // 过滤掉要删除的产品
    const filteredProducts = products.filter(p => p.id !== id);
    
    // 检查是否有产品被删除
    if (filteredProducts.length === initialLength) {
      console.warn('未找到要删除的产品，ID:', id);
      return false;
    }
    
    // 更新内存存储
    memoryStorage = [...filteredProducts];
    console.log('更新内存存储成功，剩余产品数:', memoryStorage.length);
    
    // 尝试保存到localStorage
    try {
      if (isLocalStorageAvailable()) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProducts));
        console.log('产品删除成功并保存到localStorage，ID:', id);
      } else {
        console.log('产品删除成功（使用内存存储），ID:', id);
      }
      return true;
    } catch (storageError) {
      console.error('从localStorage删除产品失败，但已从内存存储中删除:', storageError);
      // 即使localStorage保存失败，也视为成功，因为数据已从内存中删除
      return true;
    }
  } catch (error) {
    console.error('删除产品失败:', error);
    // 提供更友好的错误信息
    const userFriendlyError = error instanceof Error ? 
      error.message.includes('localStorage') ? 
        '产品删除失败：浏览器存储可能受限，请检查浏览器设置或稍后再试' : 
        error.message : 
      '产品删除失败，请稍后再试';
    throw new Error(userFriendlyError);
  }
};

// 验证URL格式
export const isValidUrl = (url: string): boolean => {
  try {
    // 确保URL包含协议
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

// 处理图片上传
export const handleImageUpload = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        // 这里返回的是base64编码的图片数据
        if (e.target?.result) {
          // 对于base64图片，我们不需要额外处理，因为每次上传的base64内容都会不同
          // 但对于URL类型的图片，我们会在updateProduct中添加时间戳
          resolve(e.target.result as string);
        } else {
          const errorMsg = '无法读取图片文件内容';
          console.error(errorMsg);
          reject(new Error(errorMsg));
        }
      };
      
      reader.onerror = (errorEvent) => {
        const errorMsg = '读取图片文件失败';
        console.error(errorMsg, errorEvent);
        reject(new Error(errorMsg));
      };
      
      reader.onabort = () => {
        const errorMsg = '图片上传被中止';
        console.warn(errorMsg);
        reject(new Error(errorMsg));
      };
      
      // 开始读取文件
      reader.readAsDataURL(file);
    } catch (error) {
      const errorMsg = '图片上传处理过程中发生错误';
      console.error(errorMsg, error);
      reject(new Error(errorMsg));
    }
  });
};

// 添加时间戳到图片URL以防止浏览器缓存
const addTimestampToImageUrl = (imageUrl: string): string => {
  // 如果是base64编码的图片，不需要添加时间戳
  if (imageUrl.startsWith('data:image/')) {
    return imageUrl;
  }
  
  // 检查URL是否已经包含查询参数
  const separator = imageUrl.includes('?') ? '&' : '?';
  // 添加时间戳作为查询参数
  return `${imageUrl}${separator}t=${Date.now()}`;
};