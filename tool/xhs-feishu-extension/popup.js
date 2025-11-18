const collectBtn = document.getElementById('collectBtn');
const syncBtn = document.getElementById('syncBtn');
const countEl = document.getElementById('count');
const updatedEl = document.getElementById('updated');
const tbody = document.querySelector('#resultTable tbody');
const toast = document.getElementById('toast');
const openOptionsBtn = document.getElementById('openOptions');

let currentRecords = [];

collectBtn.addEventListener('click', handleCollect);
syncBtn.addEventListener('click', handleSync);
openOptionsBtn.addEventListener('click', () => chrome.runtime.openOptionsPage());

document.addEventListener('DOMContentLoaded', init);

async function init() {
  try {
    const cache = await sendToActiveTab({ type: 'READ_CACHE' });
    if (cache?.data?.records?.length) {
      currentRecords = cache.data.records;
      render();
    }
  } catch (error) {
    console.warn('读取缓存失败', error);
  }
}

async function handleCollect() {
  toggleLoading(true);
  try {
    const res = await sendToActiveTab({ type: 'COLLECT_PRODUCTS' });
    currentRecords = res.data || [];
    render();
    showToast(`已抓取 ${currentRecords.length} 条`);
  } catch (error) {
    showToast(error.message || '抓取失败');
  } finally {
    toggleLoading(false);
  }
}

async function handleSync() {
  if (!currentRecords.length) {
    showToast('请先抓取数据');
    return;
  }

  toggleSync(true);
  try {
    const res = await sendToBackground({
      type: 'SYNC_TO_FEISHU',
      payload: { records: currentRecords },
    });
    showToast(`同步成功：${res.data.synced} 条`);
  } catch (error) {
    showToast(error.message || '同步失败');
  } finally {
    toggleSync(false);
  }
}

function render() {
  countEl.textContent = currentRecords.length;
  updatedEl.textContent = currentRecords.length
    ? new Date().toLocaleTimeString()
    : '--';

  tbody.innerHTML = '';
  currentRecords.slice(0, 15).forEach((item) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.productId}</td>
      <td><img src="${item.cover}" alt="cover" /></td>
    `;
    tbody.appendChild(tr);
  });

  syncBtn.disabled = currentRecords.length === 0;
}

function toggleLoading(loading) {
  collectBtn.textContent = loading ? '抓取中...' : '抓取当前页面';
  collectBtn.disabled = loading;
}

function toggleSync(loading) {
  syncBtn.textContent = loading ? '同步中...' : '同步到飞书';
  syncBtn.disabled = loading;
}

async function sendToActiveTab(message) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) throw new Error('未找到活动标签页');
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tab.id, message, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error('请先打开小红书商品页面并刷新后重试'));
        return;
      }
      if (!response?.ok) {
        reject(new Error(response?.message || '执行失败'));
        return;
      }
      resolve(response);
    });
  });
}

async function sendToBackground(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      if (!response?.ok) {
        reject(new Error(response?.message || '执行失败'));
        return;
      }
      resolve(response);
    });
  });
}

function showToast(text) {
  toast.textContent = text;
  toast.hidden = false;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.hidden = true;
  }, 2200);
}
