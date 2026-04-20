import React, { useState, useRef } from 'react';

const Coze = () => {
  const pathToken = import.meta.env.VITE_COZE_PATH_TOKEN;
  const uploadUrl = 'https://api.coze.cn/v1/files';
  const workflowUrl = 'https://api.coze.cn/v1/workflow/run';
  const workflow_id = '7628544541594877979';
  const uploadImageRef = useRef(null);

  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // 核心函数：处理对话逻辑
  const handleStartWorkflow = async () => {
    // 如果用户既没写字也没选图，拦住他
    if (!inputText && !uploadImageRef.current.files[0]) {
      return alert("请输入你的旅行想法或上传一张照片哦");
    }

    setLoading(true);

    try {
      let fileId = ""; // 默认为空字符串

      // 1. 判断：只有当用户选了文件时，才走上传逻辑
      const file = uploadImageRef.current.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        const uploadRes = await fetch(uploadUrl, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${pathToken}` },
          body: formData
        });
        const uploadData = await uploadRes.json();
        fileId = uploadData.data.id;
      }

      // 2. 运行工作流（无论有没有 fileId 都会运行）
      const workflowRes = await fetch(workflowUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${pathToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          workflow_id: workflow_id,
          parameters: {
            input: inputText,
            image: fileId // 如果没传图，这里就是空字符串 ""
          }
        })
      });

      const workflowData = await workflowRes.json();

      if (workflowData.code === 0) {
        // 解析工作流返回的字符串
        const finalOutput = JSON.parse(workflowData.data);
        setResult(finalOutput);
      }

    } catch (error) {
      console.error("执行失败:", error);
      alert("规划出了一点小状况，请稍后再试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="coze-container">
      {/* 这里的布局建议做成类似聊天框的输入区域 */}
      <div className="input-area">
        <textarea
          placeholder="例如：我想去北京天坛玩，帮我规划一下行程"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <input type="file" ref={uploadImageRef} accept="image/*" />
        <button onClick={handleStartWorkflow} disabled={loading}>
          {loading ? "AI 规划中..." : "发送"}
        </button>
      </div>

      {/* 结果展示 */}
      {result && result.success && (
        <div className="itinerary-card">
          <h3>📍 {result.location} 游玩计划</h3>
          <p>{result.summary_text}</p>
        </div>
      )}
    </div>
  );
}

export default Coze;