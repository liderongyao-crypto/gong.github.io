const STORAGE_KEY = 'feishuSettings';
const TOKEN_SAFETY_GAP = 60 * 1000; // 1min

chrome.runtime.onInstalled.addListener(() => {
  console.log('[XHS-FEISHU] 插件已安装');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const handlerMap = {
    SAVE_SETTINGS: handleSaveSettings,
    LOAD_SETTINGS: handleLoadSettings,
    SYNC_TO_FEISHU: handleSyncToFeishu,
  };

  const handler = handlerMap[message?.type];
  if (!handler) {
    return;
  }

  (async () => {
    try {
      const result = await handler(message.payload || {});
      sendResponse({ ok: true, data: result });
    } catch (error) {
      console.error('[XHS-FEISHU] background error', error);
      sendResponse({ ok: false, message: error.message || '未知错误' });
    }
  })();

  return true;
});

async function handleSaveSettings(payload) {
  const prev = await getSettings();
  const next = { ...prev, ...payload };
  await chrome.storage.sync.set({ [STORAGE_KEY]: next });
  return next;
}

async function handleLoadSettings() {
  return await getSettings();
}

async function handleSyncToFeishu({ records }) {
  if (!Array.isArray(records) || records.length === 0) {
    throw new Error('没有可同步的数据');
  }

  const settings = await ensureToken(await getSettings());

  const missing = ['appToken', 'tableId', 'fieldProductId', 'fieldCover'].filter(
    (key) => !settings[key]
  );
  if (missing.length) {
    throw new Error(`请在设置页填写: ${missing.join(', ')}`);
  }

  const endpoint = `https://open.feishu.cn/open-apis/bitable/v1/apps/${settings.appToken}/tables/${settings.tableId}/records/batch_create`;
  const chunkSize = 10;
  for (let i = 0; i < records.length; i += chunkSize) {
    const batch = records.slice(i, i + chunkSize);
    const body = {
      records: batch.map((item) => ({
        fields: {
          [settings.fieldProductId]: item.productId,
          [settings.fieldCover]: item.cover,
        },
      })),
    };

    const resp = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${settings.tenantAccessToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await resp.json();
    if (!resp.ok || data.code !== 0) {
      throw new Error(data?.msg || data?.message || '同步失败');
    }
  }

  return { synced: records.length };
}

async function getSettings() {
  const stored = await chrome.storage.sync.get(STORAGE_KEY);
  return (
    stored[STORAGE_KEY] || {
      appId: '',
      appSecret: '',
      appToken: '',
      tableId: '',
      fieldProductId: '商品ID',
      fieldCover: '主图',
      tenantAccessToken: '',
      tokenExpiredAt: 0,
    }
  );
}

async function ensureToken(settings) {
  if (!settings.appId || !settings.appSecret) {
    if (!settings.tenantAccessToken) {
      throw new Error('请在设置页填写应用凭证或手动粘贴租户 Token');
    }
    return settings;
  }

  const now = Date.now();
  if (
    settings.tenantAccessToken &&
    settings.tokenExpiredAt &&
    settings.tokenExpiredAt - TOKEN_SAFETY_GAP > now
  ) {
    return settings;
  }

  const resp = await fetch(
    'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app_id: settings.appId,
        app_secret: settings.appSecret,
      }),
    }
  );

  const data = await resp.json();
  if (!resp.ok || data.code !== 0) {
    throw new Error(`获取租户 Token 失败: ${data?.msg || '未知错误'}`);
  }

  const next = {
    ...settings,
    tenantAccessToken: data.tenant_access_token,
    tokenExpiredAt: now + data.expire * 1000,
  };

  await chrome.storage.sync.set({ [STORAGE_KEY]: next });
  return next;
}
