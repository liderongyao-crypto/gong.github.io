import { useState } from 'react';
import { motion } from 'framer-motion';
import { RecorderBall } from '../components/RecorderBall';
import { useAudioRecorder } from '../hooks/useAudioRecorder';

export default function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);
  const [savedRecordingTime, setSavedRecordingTime] = useState(0); // 保存录音结束时的时间
  const [savedVolume, setSavedVolume] = useState(0); // 保存录音结束时的音量
  const { startRecording, stopRecording, volume, finalVolume, recordingTime } = useAudioRecorder(
    setIsRecording
  );

  const handleStartRecording = () => {
    setShowResult(false);
    setTotalDuration(0);
    setSavedRecordingTime(0);
    setSavedVolume(0);
    startRecording();
  };

  const handleStopRecording = () => {
    stopRecording();
    // 直接使用实际录音时长，确保准确
    setTotalDuration(recordingTime);
    // 保存录音结束时的时间和音量，用于显示最终状态
    setSavedRecordingTime(recordingTime);
    setSavedVolume(finalVolume);
    setShowResult(true);
  };

  // 根据录音时间和音量确定当前阶段
  const getCurrentPhase = () => {
    if (!isRecording) return 0;
    
    if (recordingTime < 5) return 1;
    if (recordingTime < 10) return 2;
    if (recordingTime < 15) return 3;
    if (recordingTime < 20) return 4;
    return 5;
  };

  // 根据阶段获取提示词语
  const getPhaseText = () => {
    const phase = getCurrentPhase();
    const phaseTexts = [
      '准备开始',
      '开始朗读吧',
      '声音再大一点',
      '非常好！',
      '继续保持',
      '加油！'
    ];
    return phaseTexts[phase];
  };
  
  // 格式化时长显示（秒转换为分:秒格式）
  const formatDuration = (seconds: number) => {
    // 确保秒数有效
    if (isNaN(seconds) || seconds < 0) return "0秒";
    
    // 确保seconds是一个有效的数字
    const validSeconds = Math.max(0, seconds);
    
    if (validSeconds < 60) {
      return `${validSeconds.toFixed(1)}秒`;
    } else {
      const minutes = Math.floor(validSeconds / 60);
      const remainingSeconds = validSeconds % 60;
      return `${minutes}分${remainingSeconds.toFixed(0)}秒`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center p-6">
      {/* 头部标题 */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">早读录音助手</h1>
        <p className="text-gray-500">点击开始按钮，记录学生的朗读声音</p>
      </motion.div>

      {/* 主要内容区 */}
      <motion.div 
        className="relative flex flex-col items-center justify-center w-full max-w-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        {!showResult ? (
          <>
          {/* 树可视化组件 */}
          <RecorderBall 
            isRecording={isRecording} 
            volume={volume} 
            finalVolume={finalVolume}
            recordingTime={recordingTime}
            phaseText={getPhaseText()}
          />

            {/* 控制按钮 */}
            <motion.div 
              className="mt-12 flex space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {isRecording ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStopRecording}
                  className="px-8 py-3 bg-red-500 text-white font-medium rounded-full shadow-lg hover:bg-red-600 transition-all duration-300 flex items-center"
                >
                  <i className="fas fa-stop mr-2"></i>
                  停止
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStartRecording}
                  className="px-8 py-3 bg-blue-500 text-white font-medium rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 flex items-center"
                >
                  <i className="fas fa-microphone mr-2"></i>
                  开始
                </motion.button>
              )}
              
              {!isRecording && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {}}
                  className="px-8 py-3 bg-gray-100 text-gray-700 font-medium rounded-full shadow-md hover:bg-gray-200 transition-all duration-300 flex items-center"
                >
                  <i className="fas fa-history mr-2"></i>
                  历史
                </motion.button>
              )}
            </motion.div>

            {/* 录音时间显示 */}
            {isRecording && (
              <motion.div 
                className="mt-6 text-gray-500 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                录音时间: {recordingTime.toFixed(1)}秒
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full flex flex-col items-center"
          >
            {/* 显示录音结束时的树状态 */}
            <RecorderBall 
              isRecording={false} 
              volume={0} 
              finalVolume={savedVolume}
              recordingTime={savedRecordingTime}
              phaseText="录音已结束"
            />
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-6 text-center">录音结果</h2>
            
            {/* 总时长 */}
            <motion.div 
              className="bg-white p-8 rounded-2xl shadow-lg text-center mb-8"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <p className="text-gray-600 font-medium mb-4">总朗读时长</p>
              <p className="text-4xl font-bold text-blue-600">{formatDuration(totalDuration)}</p>
            </motion.div>
            
            {/* 重新开始按钮 */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartRecording}
              className="px-8 py-3 bg-blue-500 text-white font-medium rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 flex items-center"
            >
              <i className="fas fa-redo mr-2"></i>
              重新开始
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      {/* 页脚 */}
      <motion.footer 
        className="mt-auto text-center text-gray-400 text-sm py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <p>早读录音工具 © 2025</p>
      </motion.footer>
    </div>
  );
}