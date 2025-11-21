// 强制设置暗色主题
document.documentElement.classList.add('dark');
document.documentElement.classList.remove('light');
localStorage.setItem('theme', 'dark');

import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// 检查root元素是否存在
const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  console.error("根元素#root未找到，无法渲染应用");
}
