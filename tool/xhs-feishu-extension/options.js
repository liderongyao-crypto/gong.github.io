const form = document.getElementById('settingsForm');
const statusEl = document.getElementById('status');

init();

async function init() {
  const settings = await sendMessage({ type: 'LOAD_SETTINGS' });
  Object.entries(settings).forEach(([key, value]) => {
    if (form.elements[key]) {
      form.elements[key].value = value || '';
    }
  });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  statusEl.textContent = '保存中...';

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  try {
    await sendMessage({ type: 'SAVE_SETTINGS', payload });
    statusEl.textContent = '保存成功';
  } catch (error) {
    statusEl.textContent = error.message || '保存失败';
  }
});

function sendMessage(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      if (!response?.ok) {
        reject(new Error(response?.message || '操作失败'));
        return;
      }
      resolve(response.data);
    });
  });
}
