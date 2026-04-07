// 豆包chat

const express = require('express');
const fetch = require('node-fetch');
const app = express();

// 解析JSON请求体
app.use(express.json());

// 代理接口：前端调用这个接口，转发到火山方舟
app.post('/trip', async (req, res) => {
  try {
    const { messages, model, apiKey } = req.body;
    
    // 转发请求到火山方舟官方API
    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        stream: false
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('代理转发失败：', err);
    res.status(500).json({ error: err.message });
  }
});

// 启动代理服务
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`代理服务已启动：http://localhost:${PORT}`);
});

// 最后 const DOUBAO_BASE_URL = "http://localhost:5173/trip";