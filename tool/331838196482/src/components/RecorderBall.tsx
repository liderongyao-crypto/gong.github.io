import { motion } from 'framer-motion';

interface RecorderBallProps {
  isRecording: boolean;
  volume: number;
  finalVolume: number;
  recordingTime: number;
  phaseText: string;
}

// 树图片地址
const TREE_IMAGE_URL = "https://lf-code-agent.coze.cn/obj/x-ai-cn/331838196482/attachment/小六壬解释 (1)_20251117200510.png";

// 计算树的当前缩放比例
const calculateTreeScale = (recordingTime: number, volume: number, isRecording: boolean) => {
  // 根据录音时间和音量计算总分
  let score = 0;
  
  // 时间因素 (0-100)
  const timeScore = Math.min(recordingTime * 5, 100);
  
  // 音量因素 (0-100)
  const volumeScore = volume * 100;
  
  // 综合得分 (0-1)
  score = (timeScore * 0.6 + volumeScore * 0.4) / 100;
  
  // 最小缩放比例为0.2，最大为1.0
  return 0.2 + (score * 0.8);
};

export function RecorderBall({ isRecording, volume, finalVolume, recordingTime, phaseText }: RecorderBallProps) {
  // 确定当前使用的音量值
  const currentVolume = isRecording ? volume : finalVolume;
  
  // 计算当前树的缩放比例
  const treeScale = calculateTreeScale(recordingTime, currentVolume, isRecording);
  
  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* 背景装饰效果 */}
      {isRecording && (
        <>
          <motion.div
            className="absolute rounded-full border-2 border-green-100"
            animate={{ 
              scale: [1, 1.02, 1],
              opacity: 0.7
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2,
              ease: "easeInOut" 
            }}
            style={{ 
              width: 250 * treeScale, 
              height: 300 * treeScale,
              transformOrigin: 'center bottom'
            }}
          />
          
          <motion.div
            className="absolute rounded-full border-2 border-green-100"
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: 0.5
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 3,
              ease: "easeInOut",
              delay: 0.5 
            }}
            style={{ 
              width: 300 * treeScale, 
              height: 350 * treeScale,
              transformOrigin: 'center bottom'
            }}
          />
        </>
      )}
      
      {/* 树的容器 - 使用图片实现 */}
      <motion.div
        className="relative flex flex-col items-center justify-center"
        initial={{ scale: 0.2, opacity: 0 }}
        animate={{ 
          scale: treeScale,
          opacity: 1
        }}
        transition={{ 
          duration: 0.5,
          ease: "easeOut" 
        }}
        style={{ transformOrigin: 'center bottom' }}
      >
        {/* 使用图片作为树的样式 */}
        <img
          src={TREE_IMAGE_URL}
          alt="Tree"
          className="w-auto h-auto max-h-[300px] object-contain"
          style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
        />
      </motion.div>
      
      {/* 树下面的描述文字 */}
      <motion.div
        className="text-gray-700 font-medium text-center px-4 mt-6"
        animate={{ 
          scale: isRecording ? [1, 1.02, 1] : 1,
          opacity: 1
        }}
        transition={{ 
          repeat: isRecording ? Infinity : 0, 
          duration: 2,
          ease: "easeInOut" 
        }}
      >
        <p className="text-lg">{phaseText}</p>
        
        {/* 录音时显示音量指示 */}
        {isRecording && (
          <div className="mt-4 flex flex-col items-center">
            {/* 音量图标 */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 1,
                ease: "easeInOut"
              }}
              className="mb-2"
            >
              <i className={`fas ${currentVolume < 0.33 ? 'fa-volume-down' : currentVolume < 0.66 ? 'fa-volume' : 'fa-volume-up'} text-2xl text-green-600`}></i>
            </motion.div>
            
            {/* 音量条形指示器 */}
            <div className="flex space-x-1 justify-center w-full max-w-xs">
              {[...Array(7)].map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-2 rounded-full ${currentVolume > index * (1/7) ? 'bg-green-500' : 'bg-green-200'}`}
                  animate={{
                    height: currentVolume > index * (1/7) ? (index + 1) * 6 + currentVolume * 15 : 4,
                    opacity: currentVolume > index * (1/7) ? 1 : 0.3
                  }}
                  transition={{ duration: 0.2 }}
                />
              ))}
            </div>
            
            {/* 音量百分比 */}
            <p className="mt-2 text-sm text-green-600">{Math.round(currentVolume * 100)}%</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}