import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

// 预设的50种专业风格词
const styleOptions = [
  "写实主义 (Realism)",
  "超现实主义 (Surrealism)",
  "印象派 (Impressionism)",
  "后印象派 (Post-Impressionism)",
  "表现主义 (Expressionism)",
  "抽象表现主义 (Abstract Expressionism)",
  "立体主义 (Cubism)",
  "未来主义 (Futurism)",
  "超现实主义 (Surrealism)",
  "达达主义 (Dada)",
  "波普艺术 (Pop Art)",
  "极简主义 (Minimalism)",
  "新表现主义 (Neo-Expressionism)",
  "数字艺术 (Digital Art)",
  "赛博朋克 (Cyberpunk)",
  "蒸汽波 (Vaporwave)",
  "手绘 (Hand-drawn)",
  "水彩 (Watercolor)",
  "油画 (Oil Painting)",
  "素描 (Sketch)",
  "漫画 (Comic)",
  "卡通 (Cartoon)",
  "像素艺术 (Pixel Art)",
  "赛璐珞动画 (Cel Animation)",
  "3D渲染 (3D Rendering)",
  "电影质感 (Cinematic)",
  "纪录片风格 (Documentary)",
  "科幻 (Sci-Fi)",
  "奇幻 (Fantasy)",
  "复古 (Vintage)",
  "怀旧 (Nostalgic)",
  "洛可可 (Rococo)",
  "巴洛克 (Baroque)",
  "哥特式 (Gothic)",
  "文艺复兴 (Renaissance)",
  "新古典主义 (Neoclassicism)",
  "日本浮世绘 (Ukiyo-e)",
  "中国水墨画 (Ink Wash)",
  "涂鸦 (Graffiti)",
  "街头艺术 (Street Art)",
  "拼贴艺术 (Collage)",
  "分形艺术 (Fractal Art)",
  "光效艺术 (Light Painting)",
  "黑白摄影 (Black and White Photography)",
  "彩色摄影 (Color Photography)",
  "长时间曝光 (Long Exposure)",
  "微距摄影 (Macro Photography)",
  "航拍 (Aerial Photography)",
  "水下摄影 (Underwater Photography)",
  "夜间摄影 (Night Photography)"
];

// 预设的50种专业镜头词
const cameraOptions = [
  "广角镜头 (Wide Angle)",
  "超广角镜头 (Ultra Wide Angle)",
  "标准镜头 (Standard Lens)",
  "中焦镜头 (Medium Telephoto)",
  "长焦镜头 (Telephoto Lens)",
  "超长焦镜头 (Super Telephoto)",
  "鱼眼镜头 (Fisheye Lens)",
  "移轴镜头 (Tilt-Shift Lens)",
  "微距镜头 (Macro Lens)",
  "变焦镜头 (Zoom Lens)",
  "定焦镜头 (Prime Lens)",
  "大光圈镜头 (Fast Lens)",
  "柔焦镜头 (Soft Focus Lens)",
  "针孔相机 (Pinhole Camera)",
  "双镜头反光相机 (Twin Lens Reflex)",
  "单镜头反光相机 (Single Lens Reflex)",
  "无反光镜相机 (Mirrorless Camera)",
  "旁轴相机 (Rangefinder Camera)",
  "大画幅相机 (Large Format Camera)",
  "中画幅相机 (Medium Format Camera)",
  "全画幅相机 (Full Frame Camera)",
  "APS-C画幅相机 (APS-C Camera)",
  "微型4/3画幅相机 (Micro Four Thirds)",
  "手机相机 (Smartphone Camera)",
  "拍立得相机 (Polaroid Camera)",
  "航拍相机 (Drone Camera)",
  "运动相机 (Action Camera)",
  "红外相机 (Infrared Camera)",
  "高速相机 (High Speed Camera)",
  "慢动作相机 (Slow Motion Camera)",
  "全景相机 (Panoramic Camera)",
  "360度相机 (360 Camera)",
  "立体相机 (Stereoscopic Camera)",
  "3D相机 (3D Camera)",
  "黑白相机 (Black and White Camera)",
  "复古相机 (Vintage Camera)",
  "徕卡相机 (Leica Camera)",
  "哈苏相机 (Hasselblad Camera)",
  "尼康相机 (Nikon Camera)",
  "佳能相机 (Canon Camera)",
  "索尼相机 (Sony Camera)",
  "富士相机 (Fujifilm Camera)",
  "宾得相机 (Pentax Camera)",
  "奥林巴斯相机 (Olympus Camera)",
  "松下相机 (Panasonic Camera)",
  "适马相机 (Sigma Camera)",
  "腾龙相机 (Tamron Camera)",
  "蔡司镜头 (Zeiss Lens)",
  "施耐德镜头 (Schneider Lens)"
];

// 预设的图片比例选项
const aspectRatioOptions = [
  "1:1",
  "3:2",
  "4:3",
  "16:9",
  "16:10",
  "21:9",
  "9:16",
  "10:16",
  "3:4",
  "2:3",
  "4:5",
  "5:4",
  "9:21",
  "1:2",
  "2:1",
  "A4 (210×297mm)",
  "A5 (148×210mm)",
  "A6 (105×148mm)",
  "明信片 (100×148mm)",
  "正方形 (2048×2048)",
  "高清 (1920×1080)",
  "全高清 (1920×1080)",
  "2K (2560×1440)",
  "4K (3840×2160)",
  "8K (7680×4320)",
  "社交媒体头像 (180×180)",
  "社交媒体封面 (1200×630)",
  "Instagram帖子 (1080×1080)",
  "Instagram故事 (1080×1920)",
  "Facebook帖子 (1200×630)",
  "Twitter帖子 (1200×675)",
  "LinkedIn帖子 (1200×627)",
  "YouTube缩略图 (1280×720)",
  "Twitch封面 (1920×1080)",
  "Discord头像 (512×512)",
  "Pinterest图片 (1000×1500)",
  "电商产品图 (1000×1000)",
  "印刷海报 (300×400mm)",
  "名片 (85×55mm)",
  "简历照片 (413×531)",
  "护照照片 (413×531)",
  "驾驶证照片 (413×531)",
  "身份证照片 (413×531)",
  "结婚证照片 (413×531)",
  "离婚证照片 (413×531)",
  "学生证照片 (413×531)",
  "工作证照片 (413×531)",
  "体检照片 (413×531)",
  "签证照片 (413×531)"
];

// 预设的50种专业姿势词
const poseOptions = [
  "正面站立 (Frontal Standing)",
  "侧面站立 (Profile Standing)",
  "背面站立 (Back Standing)",
  "坐姿 (Seated)",
  "盘腿坐姿 (Cross-Legged Seated)",
  "跪姿 (Kneeling)",
  "单膝跪姿 (One Knee Kneeling)",
  "蹲姿 (Squatting)",
  "跳跃 (Jumping)",
  "行走 (Walking)",
  "跑步 (Running)",
  "坐姿阅读 (Reading While Seated)",
  "站姿思考 (Standing in Thought)",
  "手势交流 (Gesture Communication)",
  "托腮沉思 (Chin Resting in Contemplation)",
  "双手插兜 (Hands in Pockets)",
  "双臂交叉 (Arms Crossed)",
  "双手背后 (Hands Behind Back)",
  "单手叉腰 (One Hand on Hip)",
  "双手叉腰 (Hands on Hips)",
  "手指指向 (Finger Pointing)",
  "双手合十 (Hands Clasped)",
  "张开双臂 (Arms Outstretched)",
  "拥抱姿势 (Embracing Pose)",
  "握手 (Handshake)",
  "打电话姿势 (Phone Call Pose)",
  "使用电脑姿势 (Computer Usage Pose)",
  "书写姿势 (Writing Pose)",
  "绘画姿势 (Drawing Pose)",
  "弹奏乐器 (Playing Instrument)",
  "舞蹈姿势 (Dance Pose)",
  "瑜伽姿势 (Yoga Pose)",
  "健身姿势 (Fitness Pose)",
  "武术姿势 (Martial Arts Pose)",
  "模特走秀姿势 (Catwalk Pose)",
  "拍照姿势 (Photography Pose)",
  "舞台表演姿势 (Stage Performance Pose)",
  "演讲姿势 (Public Speaking Pose)",
  "冥想姿势 (Meditation Pose)",
  "休息姿势 (Resting Pose)",
  "睡觉姿势 (Sleeping Pose)",
  "正装姿势 (Formal Attire Pose)",
  "休闲姿势 (Casual Pose)",
  "运动姿势 (Sports Pose)",
  "工作姿势 (Working Pose)",
  "学习姿势 (Studying Pose)",
  "用餐姿势 (Dining Pose)",
  "喝水姿势 (Drinking Pose)",
  "吸烟姿势 (Smoking Pose)",
  "化妆姿势 (Makeup Pose)",
  "自拍姿势 (Selfie Pose)"
];

// 预设的50种专业光线词
const lightingOptions = [
  "自然光 (Natural Light)",
  "阳光 (Sunlight)",
  "日出光线 (Sunrise Light)",
  "日落光线 (Sunset Light)",
  "黄昏光线 (Twilight Light)",
  "室内灯光 (Indoor Lighting)",
  "白炽灯 (Incandescent Light)",
  "荧光灯 (Fluorescent Light)",
  "LED灯 (LED Lighting)",
  "钨丝灯 (Tungsten Light)",
  "冷光 (Cool Light)",
  "暖光 (Warm Light)",
  "柔光 (Soft Light)",
  "硬光 (Hard Light)",
  "散射光 (Diffused Light)",
  "直射光 (Direct Light)",
  "侧光 (Side Lighting)",
  "逆光 (Back Lighting)",
  "顺光 (Front Lighting)",
  "顶光 (Top Lighting)",
  "底光 (Bottom Lighting)",
  "三点布光 (Three-Point Lighting)",
  "伦勃朗光 (Rembrandt Lighting)",
  "蝴蝶光 (Butterfly Lighting)",
  "分割光 (Split Lighting)",
  "环形光 (Loop Lighting)",
  "轮廓光 (Rim Lighting)",
  "背景光 (Background Lighting)",
  "填充光 (Fill Light)",
  "主光 (Key Light)",
  "补光 (Fill Light)",
  "聚光灯 (Spotlight)",
  "泛光灯 (Floodlight)",
  "柔光箱 (Softbox Lighting)",
  "反光板 (Reflector)",
  "柔光伞 (Soft Umbrella)",
  "硬光伞 (Hard Umbrella)",
  "格栅灯 (Grid Lighting)",
  "条形柔光箱 (Strip Softbox)",
  "环形闪光灯 (Ring Flash)",
  "手持补光灯 (Handheld Fill Light)",
  "夜景灯光 (Night Scene Lighting)",
  "城市灯光 (City Lighting)",
  "霓虹灯 (Neon Lighting)",
  "烛光 (Candlelight)",
  "篝火 (Bonfire Light)",
  "月光 (Moonlight)",
  "星光 (Starlight)",
  "极光 (Aurora Lighting)",
  "水下光线 (Underwater Lighting)",
  "舞台灯光 (Stage Lighting)",
  "电影灯光 (Cinematic Lighting)",
  "戏剧灯光 (Theatrical Lighting)"
];

// 预设的50种专业滤镜词
const filterOptions = [
  "标准 (Standard)",
  "鲜明 (Vivid)",
  "柔和 (Soft)",
  "高对比度 (High Contrast)",
  "低对比度 (Low Contrast)",
  "黑白 (Black and White)",
  "黑白高对比度 (B&W High Contrast)",
  "黑白低对比度 (B&W Low Contrast)",
  "复古 (Vintage)",
  "怀旧 (Nostalgic)",
  "褐色调 (Sepia)",
  "青色调 (Cyanotype)",
  "蓝调 (Cool)",
  "暖调 (Warm)",
  "高饱和度 (High Saturation)",
  "低饱和度 (Low Saturation)",
  "胶片颗粒 (Film Grain)",
  "褪色 (Faded)",
  "阴影增强 (Shadow Boost)",
  "高光增强 (Highlight Boost)",
  "锐化 (Sharpen)",
  "模糊 (Blur)",
  "柔焦 (Soft Focus)",
  "清晰 (Clarity)",
  "HDR",
  "日落后 (After Sunset)",
  "日出前 (Before Sunrise)",
  "城市夜景 (City Night)",
  "自然 (Nature)",
  "风景 (Landscape)",
  "人像 (Portrait)",
  "特写 (Close-up)",
  "街拍 (Street Photography)",
  "时尚 (Fashion)",
  "电影 (Cinematic)",
  "纪录片 (Documentary)",
  "音乐视频 (Music Video)",
  "科幻 (Sci-Fi)",
  "奇幻 (Fantasy)",
  "恐怖 (Horror)",
  "浪漫 (Romantic)",
  "活力 (Vibrant)",
  "简约 (Minimalist)",
  "抽象 (Abstract)",
  "超现实 (Surreal)",
  "手绘 (Hand-drawn)",
  "油画 (Oil Painting)",
  "水彩 (Watercolor)",
  "素描 (Sketch)",
  "漫画 (Comic)",
  "像素 (Pixel)",
  "蒸汽波 (Vaporwave)",
  "赛博朋克 (Cyberpunk)"
];

export default function Home() {
  // 状态管理
  const [spell, setSpell] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedCamera, setSelectedCamera] = useState('');
  const [selectedPose, setSelectedPose] = useState('');
  const [selectedLighting, setSelectedLighting] = useState('');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [removeElements, setRemoveElements] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  // 生成提示词
  useEffect(() => {
    let promptParts = [];
    
    if (spell) {
      promptParts.push(spell);
    }
    
    if (selectedStyle) {
      promptParts.push(`风格：${selectedStyle}`);
    }
    
     if (selectedCamera) {
      promptParts.push(`镜头：${selectedCamera}`);
    }
    
    if (selectedAspectRatio) {
      promptParts.push(`比例：${selectedAspectRatio}`);
    }
    
    if (selectedPose) {
      promptParts.push(`姿势：${selectedPose}`);
    }
    
    if (selectedLighting) {
      promptParts.push(`光线：${selectedLighting}`);
     }
     
     if (selectedFilter) {
       promptParts.push(`滤镜：${selectedFilter}`);
     }
     
     if (removeElements) {
       promptParts.push('去除LOGO、字、英文、图标');
     }
     
     setGeneratedPrompt(promptParts.join('，'));
   }, [spell, selectedStyle, selectedCamera, selectedAspectRatio, selectedPose, selectedLighting, selectedFilter, removeElements]);

  // 复制功能
  const copyToClipboard = async () => {
    if (!generatedPrompt) {
      toast.warning('请先输入内容生成提示词');
      return;
    }
    
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      toast.success('提示词已复制到剪贴板');
    } catch (err) {
      toast.error('复制失败，请手动选择并复制');
      console.error('Failed to copy:', err);
    }
  };

  // 清除所有输入
   const clearAll = () => {
    setSpell('');
    setSelectedStyle('');
    setSelectedCamera('');
    setSelectedAspectRatio('');
    setSelectedPose('');
    setSelectedLighting('');
    setSelectedFilter('');
    setRemoveElements(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      {/* 顶部导航栏 */}
      <header className="w-full py-6 px-4 sm:px-6 lg:px-8 border-b border-gray-200 dark:border-gray-800 backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.h1 
            className="text-2xl font-semibold text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            SeedReam4.0 提示词
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="text-sm text-gray-500 dark:text-gray-400">本地生成，一键复制</span>
          </motion.div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* 介绍文字 */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">创建专业级图片提示词</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              输入您的创意描述，选择合适的风格和镜头，一键生成高质量的AI绘画提示词
            </p>
          </motion.div>

          {/* 输入表单区域 */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* 咒语输入框 */}
            <div className="mb-8">
              <label htmlFor="spell" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                创意描述
              </label>
              <textarea
                id="spell"
                value={spell}
                onChange={(e) => setSpell(e.target.value)}
                placeholder="请输入您想要生成的内容描述，越详细越好..."
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-all resize-none h-32"
              />
            </div>

             {/* 风格、镜头、比例、姿势和光线下拉选择器 */}
              {/* 下拉选择器网格布局，调整为两排显示 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
               {/* 风格下拉列表 */}
               <div>
                 <label htmlFor="style" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                   艺术风格
                 </label>
                 <select
                   id="style"
                   value={selectedStyle}
                   onChange={(e) => setSelectedStyle(e.target.value)}
                   className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-all appearance-none"
                 >
                   <option value="">请选择艺术风格</option>
                   {styleOptions.map((style, index) => (
                     <option key={index} value={style}>{style}</option>
                   ))}
                 </select>
               </div>

               {/* 镜头下拉列表 */}
               <div>
                 <label htmlFor="camera" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                   镜头类型
                 </label>
                 <select
                   id="camera"
                   value={selectedCamera}
                   onChange={(e) => setSelectedCamera(e.target.value)}
                   className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-all appearance-none"
                 >
                   <option value="">请选择镜头类型</option>
                   {cameraOptions.map((camera, index) => (
                     <option key={index} value={camera}>{camera}</option>
                   ))}
                 </select>
               </div>

               {/* 比例下拉列表 */}
               <div>
                 <label htmlFor="aspectRatio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                   图片比例
                 </label>
                 <select
                   id="aspectRatio"
                   value={selectedAspectRatio}
                   onChange={(e) => setSelectedAspectRatio(e.target.value)}
                   className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-all appearance-none"
                 >
                   <option value="">请选择图片比例</option>
                   {aspectRatioOptions.map((ratio, index) => (
                     <option key={index} value={ratio}>{ratio}</option>
                   ))}
                 </select>
               </div>
             </div>

             {/* 第二排下拉选择器 */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
               {/* 姿势下拉列表 */}
               <div>
                 <label htmlFor="pose" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                   姿势类型
                 </label>
                 <select
                   id="pose"
                   value={selectedPose}
                   onChange={(e) => setSelectedPose(e.target.value)}
                   className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-all appearance-none"
                 >
                   <option value="">请选择姿势类型</option>
                   {poseOptions.map((pose, index) => (
                     <option key={index} value={pose}>{pose}</option>
                   ))}
                 </select>
               </div>

               {/* 光线下拉列表 */}
               <div>
                 <label htmlFor="lighting" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                   光线类型
                 </label>
                 <select
                   id="lighting"
                   value={selectedLighting}
                   onChange={(e) => setSelectedLighting(e.target.value)}
                   className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-all appearance-none"
                 >
                   <option value="">请选择光线类型</option>
                   {lightingOptions.map((lighting, index) => (
                     <option key={index} value={lighting}>{lighting}</option>
                   ))}
                 </select>
               </div>

               {/* 滤镜下拉列表 */}
               <div>
                 <label htmlFor="filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                   滤镜类型
                 </label>
                 <select
                   id="filter"
                   value={selectedFilter}
                   onChange={(e) => setSelectedFilter(e.target.value)}
                   className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-all appearance-none"
                 >
                   <option value="">请选择滤镜类型</option>
                   {filterOptions.map((filter, index) => (
                     <option key={index} value={filter}>{filter}</option>
                   ))}
                 </select>
               </div>
             </div>

             {/* 去除元素复选框 */}
             <div className="mb-8">
               <div className="flex items-center">
                 <input
                   type="checkbox"
                   id="removeElements"
                   checked={removeElements}
                   onChange={(e) => setRemoveElements(e.target.checked)}
                   className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:ring-offset-gray-800 dark:focus:ring-blue-500"
                 />
                 <label
                   htmlFor="removeElements"
                   className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                 >
                   去除LOGO、字、英文、图标
                 </label>
               </div>
             </div>

             {/* 操作按钮 */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={copyToClipboard}
                className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all ${
                  generatedPrompt 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30' 
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
                disabled={!generatedPrompt}
              >
                <i className="fas fa-copy mr-2"></i> 复制提示词
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={clearAll}
                className="px-6 py-3 rounded-xl font-medium transition-all bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
              >
                <i className="fas fa-eraser mr-2"></i> 清除全部
              </motion.button>
            </div>
          </motion.div>

          {/* 生成的提示词展示区域 */}
          <motion.div 
            className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 ${
              generatedPrompt ? '' : 'hidden'
            }`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: generatedPrompt ? 1 : 0,
              height: generatedPrompt ? 'auto' : 0,
              display: generatedPrompt ? 'block' : 'none'
            }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">生成的提示词</h3>
            <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                {generatedPrompt}
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="w-full py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            SeedReam4.0 提示词生成器 © {new Date().getFullYear()} | 仅供本地使用
          </p>
        </div>
      </footer>
    </div>
  );
}