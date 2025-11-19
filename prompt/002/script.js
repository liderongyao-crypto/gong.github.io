document.addEventListener('DOMContentLoaded', function() {
  // 初始化年份
  document.getElementById('currentYear').textContent = new Date().getFullYear();
  
  // 选项数据
  const poseOptions = [
    "站姿正面", "坐姿侧倾", "行走动态", "交叉腿坐姿", "单手叉腰", "双手背后", 
    "自然垂放", "托腮思考", "倚墙姿势", "抬腿坐姿", "跳跃动态", "转身回眸", 
    "拥抱姿势", "伸展双臂", "盘腿而坐", "扶额表情", "挥手致意", "插兜站姿", 
    "翘腿坐姿", "踮脚姿势", "低头沉思", "后仰大笑", "双手抱臂", "叉腰侧身", 
    "弯腰动作", "静坐阅读", "跑步动态", "舞蹈姿势", "冥想姿势", "瑜伽动作"
  ];
  
  const expressionOptions = [
    "微笑", "大笑", "严肃", "思考", "惊讶", "愤怒", "悲伤", "恐惧", "害羞", 
    "调皮", "专注", "放松", "疲惫", "兴奋", "平静", "不屑", "嘲讽", "温柔", 
    "亲切", "冷漠", "坚毅", "迷茫", "欣慰", "痛苦", "愉悦", "好奇", "怀疑", 
    "自信", "满足", "期待"
  ];
  
  const sceneOptions = [
    "城市街头", "森林深处", "办公室内", "海滩日落", "山间小径", "咖啡馆中", 
    "博物馆里", "公园长椅", "家庭客厅", "校园教室", "图书馆内", "餐厅环境", 
    "医院病房", "机场大厅", "车站月台", "购物中心", "艺术画廊", "健身中心", 
    "电影院内", "音乐会现场", "酒店房间", "会议室中", "游乐园里", "滑雪场道", 
    "农田景观", "工厂车间", "建筑工地", "太空站里", "古代城堡", "未来城市"
  ];
  
  const shotTypeOptions = ["特写", "近景", "中景", "全景", "远景", "大特写", "中近景", "中全景", "大全景", "超远景"];
  
  const styleOptions = [
    "写实主义", "超现实主义", "极简主义", "复古风", "未来主义", "抽象表现", 
    "印象派", "波普艺术", "新古典主义", "后现代主义", "浪漫主义", "自然主义", 
    "荒诞派", "象征主义", "装饰艺术", "概念艺术", "街头艺术", "数字艺术", 
    "蒸汽朋克", "赛博朋克", "电影写真", "人像摄影"
  ];
  
  // 填充选择框
  populateSelect('pose', poseOptions);
  populateSelect('expression', expressionOptions);
  populateSelect('scene', sceneOptions);
  populateSelect('shotType', shotTypeOptions);
  populateSelect('style', styleOptions);
  
  // 获取DOM元素
  const basePromptElement = document.getElementById('basePrompt');
  const generatedPromptElement = document.getElementById('generatedPrompt');
  const emptyStateElement = document.getElementById('emptyState');
  const generatedPromptContainer = document.getElementById('generatedPromptContainer');
  const copyButton = document.getElementById('copyButton');
  const resetButton = document.getElementById('resetButton');
  
  // 所有选项元素
  const optionElements = {
    pose: document.getElementById('pose'),
    scene: document.getElementById('scene'),
    shotType: document.getElementById('shotType'),
    style: document.getElementById('style'),
    expression: document.getElementById('expression'),
    noiseEnvironment: document.getElementById('noiseEnvironment'),
    noiseSkin: document.getElementById('noiseSkin'),
    noiseClothes: document.getElementById('noiseClothes'),
    onlyReferenceThisImage: document.getElementById('onlyReferenceThisImage'),
    resetStyleAssociation: document.getElementById('resetStyleAssociation'),
    removeElements: document.getElementById('removeElements')
  };
  
  // 添加事件监听器
  basePromptElement.addEventListener('input', updateGeneratedPrompt);
  
  // 为所有选择框添加事件监听器
  Object.keys(optionElements).forEach(key => {
    if (optionElements[key].type === 'checkbox') {
      optionElements[key].addEventListener('change', updateGeneratedPrompt);
    } else {
      optionElements[key].addEventListener('change', updateGeneratedPrompt);
    }
  });
  
  // 复制按钮事件
  copyButton.addEventListener('click', handleCopy);
  
  // 重置按钮事件
  resetButton.addEventListener('click', handleReset);
  
  // 为选择框添加动画效果
  const selectElements = document.querySelectorAll('select');
  selectElements.forEach(select => {
    select.addEventListener('mouseenter', function() {
      this.classList.add('scale-101');
    });
    
    select.addEventListener('mouseleave', function() {
      this.classList.remove('scale-101');
    });
  });
  
  // 为复选框添加动画效果
  const checkboxLabels = document.querySelectorAll('label[for="onlyReferenceThisImage"], label[for="resetStyleAssociation"], label[for="removeElements"]');
  checkboxLabels.forEach(label => {
    label.addEventListener('mouseenter', function() {
      this.classList.add('scale-101');
    });
    
    label.addEventListener('mouseleave', function() {
      this.classList.remove('scale-101');
    });
  });
  
  // 为按钮添加动画效果
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      if (!this.disabled) {
        this.classList.add('scale-103');
      }
    });
    
    button.addEventListener('mouseleave', function() {
      this.classList.remove('scale-103');
    });
    
    button.addEventListener('mousedown', function() {
      if (!this.disabled) {
        this.classList.remove('scale-103');
        this.classList.add('scale-98');
      }
    });
    
    button.addEventListener('mouseup', function() {
      if (!this.disabled) {
        this.classList.remove('scale-98');
        this.classList.add('scale-103');
      }
    });
  });
  
  // 填充选择框的函数
  function populateSelect(id, options) {
    const select = document.getElementById(id);
    options.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option;
      optionElement.textContent = option;
      select.appendChild(optionElement);
    });
  }
  
  // 更新生成的提示词
  function updateGeneratedPrompt() {
    let fullPrompt = basePromptElement.value.trim();
    
    // 获取所有选项值
    const options = {
      pose: optionElements.pose.value,
      scene: optionElements.scene.value,
      shotType: optionElements.shotType.value,
      style: optionElements.style.value,
      expression: optionElements.expression.value,
      noiseEnvironment: optionElements.noiseEnvironment.value,
      noiseSkin: optionElements.noiseSkin.value,
      noiseClothes: optionElements.noiseClothes.value,
      onlyReferenceThisImage: optionElements.onlyReferenceThisImage.checked,
      resetStyleAssociation: optionElements.resetStyleAssociation.checked,
      removeElements: optionElements.removeElements.checked
    };
    
    // 构建提示词
    if (options.pose)
      fullPrompt += `，${options.pose}`;
    
    if (options.expression)
      fullPrompt += `，${options.expression}表情`;
    
    if (options.scene)
      fullPrompt += `，在${options.scene}`;
    
    if (options.shotType)
      fullPrompt += `，${options.shotType}`;
    
    if (options.style)
      fullPrompt += `，${options.style}风格`;
    
    if (options.noiseEnvironment)
      fullPrompt += `，环境${options.noiseEnvironment}`;
    
    if (options.noiseSkin)
      fullPrompt += `，皮肤${options.noiseSkin}`;
    
    if (options.noiseClothes)
      fullPrompt += `，衣服${options.noiseClothes}`;
    
    if (options.onlyReferenceThisImage)
      fullPrompt += `，完全以本次提供的参考图为视觉基准，忽略之前所有生成内容，按照此图的风格、元素、构图逻辑进行创作，不得沿用之前的样式`;
    
    if (options.resetStyleAssociation)
      fullPrompt += `，重置风格记忆，仅聚焦当前参考图，从画面元素、色调、质感等方面严格匹配此图的特征进行创作`;
    
    if (options.removeElements)
      fullPrompt += `，去除文字、英文、图标、水印、LOGO`;
    
    // 更新UI
    if (fullPrompt) {
      generatedPromptElement.textContent = fullPrompt;
      generatedPromptElement.classList.remove('hidden');
      emptyStateElement.classList.add('hidden');
      generatedPromptContainer.classList.remove('border-gray-200', 'dark:border-gray-700', 'bg-gray-50', 'dark:bg-gray-800/50');
      generatedPromptContainer.classList.add('border-blue-200', 'dark:border-blue-800', 'bg-blue-50', 'dark:bg-gray-700/50');
      copyButton.disabled = false;
      copyButton.classList.remove('bg-gray-300', 'text-gray-500', 'cursor-not-allowed');
      copyButton.classList.add('bg-blue-600', 'hover:bg-blue-700', 'text-white', 'shadow-md', 'hover:shadow-lg');
    } else {
      generatedPromptElement.classList.add('hidden');
      emptyStateElement.classList.remove('hidden');
      generatedPromptContainer.classList.remove('border-blue-200', 'dark:border-blue-800', 'bg-blue-50', 'dark:bg-gray-700/50');
      generatedPromptContainer.classList.add('border-gray-200', 'dark:border-gray-700', 'bg-gray-50', 'dark:bg-gray-800/50');
      copyButton.disabled = true;
      copyButton.classList.remove('bg-blue-600', 'hover:bg-blue-700', 'text-white', 'shadow-md', 'hover:shadow-lg');
      copyButton.classList.add('bg-gray-300', 'text-gray-500', 'cursor-not-allowed');
    }
  }
  
  // 复制到剪贴板
  function handleCopy() {
    const textToCopy = generatedPromptElement.textContent;
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        showToast('提示词已复制到剪贴板！');
        
        // 更改复制按钮文本和图标
        const originalContent = copyButton.innerHTML;
        copyButton.innerHTML = '<i class="fas fa-check mr-2 h-5 w-5"></i>已复制';
        
        // 2秒后恢复原状
        setTimeout(() => {
          copyButton.innerHTML = originalContent;
        }, 2000);
      })
      .catch(err => {
        showToast('复制失败，请手动复制', 'error');
        console.error('复制失败:', err);
      });
  }
  
  // 重置所有输入
  function handleReset() {
    basePromptElement.value = '';
    
    // 重置所有选择框
    Object.keys(optionElements).forEach(key => {
      if (optionElements[key].type === 'checkbox') {
        optionElements[key].checked = false;
      } else {
        optionElements[key].value = '';
      }
    });
    
    // 更新提示词
    updateGeneratedPrompt();
    
    // 显示提示
    showToast('已清空所有输入');
  }
  
  // 显示Toast提示
  function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    
    // 根据类型设置不同样式
    if (type === 'error') {
      toast.classList.add('bg-red-600');
      toast.classList.remove('bg-gray-800');
    } else {
      toast.classList.add('bg-gray-800');
      toast.classList.remove('bg-red-600');
    }
    
    // 显示Toast
    toast.classList.remove('translate-x-full', 'opacity-0');
    toast.classList.add('translate-x-0', 'opacity-100');
    
    // 3秒后隐藏
    setTimeout(() => {
      toast.classList.remove('translate-x-0', 'opacity-100');
      toast.classList.add('translate-x-full', 'opacity-0');
    }, 3000);
  }
});