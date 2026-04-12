/**
 * chat 聊天
 */
// import 'dotenv/config';

const OPENAI_BASE_URL = import.meta.env.VITE_OPENAI_BASE_URL;
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const MODEL_NAME = import.meta.env.VITE_MODEL_NAME;
const VITE_QWEN_BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";

export const chat = async (
  messages,
  api_url = OPENAI_BASE_URL,
  api_key = OPENAI_API_KEY,
  model = MODEL_NAME) => {
  try {
    const response = await fetch(api_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${api_key}`
      },
      body: JSON.stringify({
        model: model,
        messages,
        stream: false,
      })
    })
    const data = await response.json();
    return {
      code: 0,
      data: {
        role: 'assistant',
        content: data.choices[0].message.content
      },
    }
  } catch (err) {
    console.log(err, 'err////')
    return {
      code: 400,
      msg: err?.message || '出错了...',
    }
  }
}

// 重构
export const qwenChat = async (messages) => {
  const res = await chat(
    messages,
    VITE_QWEN_BASE_URL,
    import.meta.env.VITE_QWEN_BASE_URL,
    'qwen3.5-plus'
  )
  return res;
}

export const generateAvatar = async (text) => {
  // 设计prompt
  const prompt = `
    你是一个漫画设计师，需要为用户设计头像，主打速写简约的水墨风格
    用户的信息是${text}
    要求有个性，有设计感。
  `
}