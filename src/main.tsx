import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from 'sonner';
import App from "./App.tsx";
import "./index.css";

// 检查用户系统偏好的主题模式
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
// 从localStorage获取保存的主题模式
const savedTheme = localStorage.getItem('theme');
// 设置初始主题
if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster 
        position="top-right"
        duration={3000}
        className="z-50"
      />
    </BrowserRouter>
  </StrictMode>
);
