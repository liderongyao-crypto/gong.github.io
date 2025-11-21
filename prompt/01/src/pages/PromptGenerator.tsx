import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, RefreshCcw, Image, Users, Video, Palette, Smile, Zap } from "lucide-react";

// 类型定义
type PromptOptions = {
    pose: string;
    scene: string;
    shotType: string;
    style: string;
    expression: string;
    lighting: string;
    clarity: string;
    noiseEnvironment: string;
    noiseSkin: string;
    noiseClothes: string;
    onlyReferenceThisImage: boolean;
    resetStyleAssociation: boolean;
    removeElements: boolean;
};

// 选项数据
const poseOptions = [
    "站姿正面",
    "坐姿侧倾",
    "行走动态",
    "交叉腿坐姿",
    "单手叉腰",
    "双手背后",
    "自然垂放",
    "托腮思考",
    "倚墙姿势",
    "抬腿坐姿",
    "跳跃动态",
    "转身回眸",
    "拥抱姿势",
    "伸展双臂",
    "盘腿而坐",
    "扶额表情",
    "挥手致意",
    "插兜站姿",
    "翘腿坐姿",
    "踮脚姿势",
    "低头沉思",
    "后仰大笑",
    "双手抱臂",
    "叉腰侧身",
    "弯腰动作",
    "静坐阅读",
    "跑步动态",
    "舞蹈姿势",
    "冥想姿势",
    "瑜伽动作"
];

const expressionOptions = [
    "微笑",
    "大笑",
    "严肃",
    "思考",
    "惊讶",
    "愤怒",
    "悲伤",
    "恐惧",
    "害羞",
    "调皮",
    "专注",
    "放松",
    "疲惫",
    "兴奋",
    "平静",
    "不屑",
    "嘲讽",
    "温柔",
    "亲切",
    "冷漠",
    "坚毅",
    "迷茫",
    "欣慰",
    "痛苦",
    "愉悦",
    "好奇",
    "怀疑",
    "自信",
    "满足",
    "期待"
];

const sceneOptions = [
    "城市街头",
    "森林深处",
    "办公室内",
    "海滩日落",
    "山间小径",
    "咖啡馆中",
    "博物馆里",
    "公园长椅",
    "家庭客厅",
    "校园教室",
    "图书馆内",
    "餐厅环境",
    "医院病房",
    "机场大厅",
    "车站月台",
    "购物中心",
    "艺术画廊",
    "健身中心",
    "电影院内",
    "音乐会现场",
    "酒店房间",
    "会议室中",
    "游乐园里",
    "滑雪场道",
    "农田景观",
    "工厂车间",
    "建筑工地",
    "太空站里",
    "古代城堡",
    "未来城市"
];

const shotTypeOptions = ["特写", "近景", "中景", "全景", "远景", "大特写", "中近景", "中全景", "大全景", "超远景"];

const styleOptions = [
    "写实主义",
    "超现实主义",
    "极简主义",
    "复古风",
    "未来主义",
    "抽象表现",
    "印象派",
    "波普艺术",
    "新古典主义",
    "后现代主义",
    "浪漫主义",
    "自然主义",
    "荒诞派",
    "象征主义",
    "装饰艺术",
    "概念艺术",
    "街头艺术",
    "数字艺术",
    "蒸汽朋克",
    "赛博朋克",
    "电影写真",
    "人像摄影"
];

// 摄影灯光选项
const lightingOptions = [
    "自然光",
    "柔光箱",
    "闪光灯",
    "柔光罩",
    "聚光灯",
    "柔光伞",
    "反光板",
    "背景灯",
    "轮廓光",
    "主光",
    "辅助光",
    "伦勃朗光",
    "蝴蝶光",
    "分割光",
    "侧光",
    "顶光",
    "底光",
    "背光",
    "三点布光",
    "高反差光",
    "低反差光",
    "柔光效果",
    "硬光效果",
    "散射光",
    "直射光",
    "暖光",
    "冷光",
    "中性光",
    "环境光",
    "混合光源"
];

// 清晰度选项
const clarityOptions = [
    "8K超高清",
    "极致锐化",
    "高分辨率",
    "AI超分",
    "超清纹理",
    "无损放大",
    "动态对比度增强",
    "降噪高清",
    "专业级锐化滤镜",
    "超清画质",
    "细节增强",
    "高清重制",
    "超清晰处理",
    "像素级优化",
    "高动态范围",
    "超清修复",
    "智能增强清晰度",
    "锐化增强",
    "8K分辨率",
    "细节强化"
];

const noiseLevelOptions = [
     { value: "", label: "选择程度..." },
     { value: "轻度瑕疵", label: "轻度瑕疵" },
     { value: "中度瑕疵", label: "中度瑕疵" },
     { value: "重度瑕疵", label: "重度瑕疵" }
];

// 合并类名的工具函数
const cn = (...inputs: any[]) => {
    return inputs.filter(Boolean).join(' ');
};

// 主组件
const PromptGenerator: React.FC = () => {
    const [basePrompt, setBasePrompt] = useState<string>("");

    const [options, setOptions] = useState<PromptOptions>({
        pose: "",
        scene: "",
        shotType: "",
        style: "",
        expression: "",
        lighting: "",
        clarity: "",
        noiseEnvironment: "",
        noiseSkin: "",
        noiseClothes: "",
        onlyReferenceThisImage: false,
        resetStyleAssociation: false,
        removeElements: false
    });

    const [generatedPrompt, setGeneratedPrompt] = useState<string>("");
    const [copySuccess, setCopySuccess] = useState<boolean>(false);

    // 生成提示词的逻辑
    useEffect(() => {
        let fullPrompt = basePrompt.trim();

        // 辅助函数：添加选项到提示词，处理逗号逻辑
        const addOption = (option: string, prefix: string = '') => {
            if (option) {
                if (fullPrompt) {
                    fullPrompt += `，${prefix}${option}`;
                } else {
                    fullPrompt += `${prefix}${option}`;
                }
            }
        };

        addOption(options.pose);
        addOption(options.expression, '');
        addOption(options.scene, '在');
        addOption(options.shotType);
        addOption(options.style, '');
        addOption(options.lighting);
        addOption(options.clarity);
        addOption(options.noiseEnvironment, '环境');
        addOption(options.noiseSkin, '皮肤');
        addOption(options.noiseClothes, '衣服');

        if (options.onlyReferenceThisImage) {
            addOption('完全以本次提供的参考图为视觉基准，忽略之前所有生成内容，按照此图的风格、元素、构图逻辑进行创作，不得沿用之前的样式');
        }

        if (options.resetStyleAssociation) {
            addOption('重置风格记忆，仅聚焦当前参考图，从画面元素、色调、质感等方面严格匹配此图的特征进行创作');
        }

        if (options.removeElements) {
            addOption('去除文字、英文、图标、水印、LOGO');
        }

        setGeneratedPrompt(fullPrompt);
    }, [basePrompt, options]);

    // 处理选项变化
    const handleOptionChange = (category: keyof PromptOptions, value: string | boolean) => {
        setOptions(prev => ({
            ...prev,
            [category]: value
        }));
    };

  // 复制到剪贴板
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      alert("复制失败，请手动复制");
      console.error("复制失败:", err);
    }
  };

    // 重置所有输入
    const handleReset = () => {
        setBasePrompt("");
        setOptions({
            pose: "",
            scene: "",
            shotType: "",
            style: "",
            expression: "",
            lighting: "",
            clarity: "",
            noiseEnvironment: "",
            noiseSkin: "",
            noiseClothes: "",
            onlyReferenceThisImage: false,
            resetStyleAssociation: false,
            removeElements: false
        });
        // 使用简单的alert替代toast
        setTimeout(() => alert("已清空所有输入"), 100);
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 text-gray-800 dark:text-gray-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{
                        opacity: 0,
                        y: -20
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    transition={{
                        duration: 0.6
                    }}
                    className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-3">豆包（商用）提示词生成器</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300">创建精准、生动的提示词，释放您的创作潜力</p>
                </motion.div>
                
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 20
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    transition={{
                        duration: 0.6,
                        delay: 0.2
                    }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 sm:p-8">
                    <div className="mb-8">
                        <label
                            htmlFor="basePrompt"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">基础提示词</label>
                        <textarea
                            id="basePrompt"
                            value={basePrompt}
                            onChange={e => setBasePrompt(e.target.value)}
                            placeholder="请输入基础提示词，例如：一个穿着西装的商务人士..."
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none h-32" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="relative">
                            <label
                                htmlFor="pose"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                                <Users className="mr-2 h-4 w-4" />人物姿势
                            </label>
                            <select
                                id="pose"
                                value={options.pose}
                                onChange={e => handleOptionChange("pose", e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none">
                                <option value="">选择姿势...</option>
                                {poseOptions.map((pose, index) => <option key={index} value={pose}>{pose}</option>)}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                                <svg
                                    className="h-5 w-5 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </motion.div>
                        
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="relative">
                            <label
                                htmlFor="expression"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                                <Smile className="mr-2 h-4 w-4" />人物表情
                            </label>
                            <select
                                id="expression"
                                value={options.expression}
                                onChange={e => handleOptionChange("expression", e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none">
                                <option value="">选择表情...</option>
                                {expressionOptions.map(
                                    (expression, index) => <option key={index} value={expression}>{expression}</option>
                                )}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                                <svg
                                    className="h-5 w-5 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </motion.div>
                        
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="relative">
                            <label
                                htmlFor="scene"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                                <Image className="mr-2 h-4 w-4" />场景
                            </label>
                            <select
                                id="scene"
                                value={options.scene}
                                onChange={e => handleOptionChange("scene", e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none">
                                <option value="">选择场景...</option>
                                {sceneOptions.map((scene, index) => <option key={index} value={scene}>{scene}</option>)}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                                <svg
                                    className="h-5 w-5 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </motion.div>
                        
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="relative">
                            <label
                                htmlFor="shotType"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                                <Video className="mr-2 h-4 w-4" />景别
                            </label>
                            <select
                                id="shotType"
                                value={options.shotType}
                                onChange={e => handleOptionChange("shotType", e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none">
                                <option value="">选择景别...</option>
                                {shotTypeOptions.map(
                                    (shotType, index) => <option key={index} value={shotType}>{shotType}</option>
                                )}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                                <svg
                                    className="h-5 w-5 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </motion.div>
                        
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="relative">
                            <label
                                htmlFor="style"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                                <Palette className="mr-2 h-4 w-4" />风格
                            </label>
                            <select
                                id="style"
                                value={options.style}
                                onChange={e => handleOptionChange("style", e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none">
                                <option value="">选择风格...</option>
                                {styleOptions.map((style, index) => <option key={index} value={style}>{style}</option>)}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                                <svg
                                    className="h-5 w-5 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </motion.div>
                        
                         <motion.div
                            whileHover={{ scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="relative">
                            <label
                                htmlFor="lighting"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                                <Zap className="mr-2 h-4 w-4" />灯光
                            </label>
                            <select
                                id="lighting"
                                value={options.lighting}
                                onChange={e => handleOptionChange("lighting", e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none">
                                <option value="">选择灯光...</option>
                                {lightingOptions.map((lighting, index) => <option key={index} value={lighting}>{lighting}</option>)}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                                <svg
                                    className="h-5 w-5 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </motion.div>
                        
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="relative">
                            <label
                                htmlFor="clarity"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                                <Zap className="mr-2 h-4 w-4" />清晰度
                            </label>
                             <select
                                id="clarity"
                                value={options.clarity}
                                onChange={e => handleOptionChange("clarity", e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none">
                                <option value="">选择清晰度...</option>
                                {clarityOptions.map((option, index) => (
                                    <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                                <svg
                                    className="h-5 w-5 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </motion.div>
                        
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="relative">
                            <label
                                htmlFor="noiseEnvironment"
                                 className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                                 <Zap className="mr-2 h-4 w-4" />环境瑕疵程度
                            </label>
                            <select
                                id="noiseEnvironment"
                                value={options.noiseEnvironment}
                                onChange={e => handleOptionChange("noiseEnvironment", e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none">
                                {noiseLevelOptions.map(
                                    (option, index) => <option key={index} value={option.value}>{option.label}</option>
                                )}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                                <svg
                                    className="h-5 w-5 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </motion.div>
                        
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="relative">
                            <label
                                htmlFor="noiseSkin"
                                 className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                                 <Zap className="mr-2 h-4 w-4" />皮肤瑕疵程度
                            </label>
                            <select
                                id="noiseSkin"
                                value={options.noiseSkin}
                                onChange={e => handleOptionChange("noiseSkin", e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none">
                                {noiseLevelOptions.map(
                                    (option, index) => <option key={index} value={option.value}>{option.label}</option>
                                )}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                                <svg
                                    className="h-5 w-5 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </motion.div>
                        
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="relative">
                            <label
                                htmlFor="noiseClothes"
                                 className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                                 <Zap className="mr-2 h-4 w-4" />衣服瑕疵程度
                            </label>
                            <select
                                id="noiseClothes"
                                value={options.noiseClothes}
                                onChange={e => handleOptionChange("noiseClothes", e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none">
                                {noiseLevelOptions.map(
                                    (option, index) => <option key={index} value={option.value}>{option.label}</option>
                                )}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                                <svg
                                    className="h-5 w-5 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </motion.div>
                        
                        <div className="md:col-span-2">
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="mb-4">
                                <label
                                    htmlFor="onlyReferenceThisImage"
                                    className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        id="onlyReferenceThisImage"
                                        checked={options.onlyReferenceThisImage}
                                        onChange={e => handleOptionChange("onlyReferenceThisImage", e.target.checked)}
                                        className="w-5 h-5 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    <span className="ml-2 text-gray-700 dark:text-gray-300">仅参考本次图</span>
                                </label>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                transition={{ type: "spring", stiffness: 300 }}>
                                <label
                                    htmlFor="resetStyleAssociation"
                                    className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        id="resetStyleAssociation"
                                        checked={options.resetStyleAssociation}
                                        onChange={e => handleOptionChange("resetStyleAssociation", e.target.checked)}
                                        className="w-5 h-5 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    <span className="ml-2 text-gray-700 dark:text-gray-300">重置风格关联</span>
                                </label>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="mt-4">
                                <label htmlFor="removeElements" className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        id="removeElements"
                                        checked={options.removeElements}
                                        onChange={e => handleOptionChange("removeElements", e.target.checked)}
                                        className="w-5 h-5 rounded-md border-gray-600 text-blue-500 focus:ring-blue-500 bg-gray-800" />
                                    <span className="ml-2 text-gray-300">去除元素</span>
                                </label>
                            </motion.div>
                        </div>
                    </div>
                    
                    <div className="mb-6">
                        <label
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">生成的提示词</label>
                        <div
                            className={`w-full px-4 py-5 rounded-lg border ${generatedPrompt ? "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-gray-700/50" : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"} min-h-[100px] transition-all duration-300`}>
                            {generatedPrompt ? <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{generatedPrompt}</p> : <p className="text-gray-400 italic text-center leading-[100px]">输入基础提示词并选择选项，生成的提示词将显示在这里</p>}
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleCopy}
                            disabled={!generatedPrompt}
                            className={cn(
                                "flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-300",
                                generatedPrompt ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            )}>
                            {copySuccess ? <>
                                <svg
                                    className="h-5 w-5 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7" />
                                </svg>已复制
                            </> : <>
                                <Copy className="h-5 w-5 mr-2" />复制提示词
                            </>}
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleReset}
                            className="flex items-center justify-center px-6 py-3 rounded-lg font-medium bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 transition-all duration-300">
                            <RefreshCcw className="h-5 w-5 mr-2" />清空所有
                        </motion.button>
                    </div>
                </motion.div>
                
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-10 text-sm text-gray-500 dark:text-gray-400">
                    <p>提示词生成器 © {new Date().getFullYear()}</p>
                    <p className="mt-1">释放创意，生成精准描述</p>
                </motion.div>
            </div>
        </div>
    );
};

export default PromptGenerator;