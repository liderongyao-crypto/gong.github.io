import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

export function useAudioRecorder(setIsRecording: (isRecording: boolean) => void) {
  const [volume, setVolume] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [finalVolume, setFinalVolume] = useState(0); // 新增：保存录音结束时的最终音量
  
  // 音频相关引用
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 初始化音频分析器 - 仅用于获取音量以支持小球大小变化
  const setupAnalyser = (stream: MediaStream) => {
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);
      
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      microphoneRef.current.connect(analyserRef.current);
      
      // 开始分析音频
      const analyzeAudio = () => {
        if (!analyserRef.current || !dataArrayRef.current) return;
        
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        
        // 计算平均音量
        let sum = 0;
        for (let i = 0; i < dataArrayRef.current.length; i++) {
          sum += dataArrayRef.current[i];
        }
        
        // 确保分母不为0
        const arrayLength = Math.max(1, dataArrayRef.current.length);
        const average = sum / arrayLength;
        
        // 将音量归一化到 0-1 范围
        const normalizedVolume = isNaN(average) ? 0 : average / 255;
        // 确保音量值有效（非NaN）并在0-1范围内
        const validVolume = Math.max(0, Math.min(1, normalizedVolume));
        setVolume(validVolume);
        
        animationFrameRef.current = requestAnimationFrame(analyzeAudio);
      };
      
      analyzeAudio();
    } catch (error) {
      console.error('音频分析器设置失败:', error);
      toast.error('无法初始化音频分析，请检查浏览器权限');
    }
  };

  // 开始录音
  const startRecording = async () => {
    try {
      // 请求麦克风权限
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      // 设置 MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      // 设置音频分析器（用于获取音量）
      setupAnalyser(stream);
      
      // 开始录音
      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast.success('开始录音');
      
      // 记录开始时间，确保时长计算准确
      startTimeRef.current = Date.now();
      
      // 启动计时器更新录音时间，使用更精确的计时
      timerRef.current = setInterval(() => {
        const elapsedTime = (Date.now() - startTimeRef.current) / 1000;
        setRecordingTime(elapsedTime);
      }, 50); // 每50ms更新一次，提高精度
      
    } catch (error) {
      console.error('录音开始失败:', error);
      toast.error('无法访问麦克风，请检查浏览器权限设置');
      setIsRecording(false);
    }
  };

  // 停止录音
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      // 计算最终精确时长
      const finalDuration = (Date.now() - startTimeRef.current) / 1000;
      setRecordingTime(finalDuration);
      
      // 保存最终音量值，用于保持球体大小
      setFinalVolume(volume);
      
      mediaRecorderRef.current.stop();
      
      // 清理资源
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      
      setIsRecording(false);
      // 不重置volume，这样在切换界面时可以保持最后状态
      
      toast.success('录音已停止');
    }
  };

  // 组件卸载时清理资源
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  return {
    startRecording,
    stopRecording,
    volume,
    finalVolume, // 导出最终音量
    recordingTime
  };
}