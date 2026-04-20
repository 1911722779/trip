/**
 * 运行 Coze 工作流的通用服务函数
 * @param {string} text - 用户输入的文字需求
 * @param {File} file - 用户选择的图片文件对象 (可选)
 */
export const runCozeWorkflow = async ({ text, file }) => {
  const pathToken = import.meta.env.VITE_COZE_PATH_TOKEN;
  const uploadUrl = 'https://api.coze.cn/v1/files/upload';
  const workflowUrl = 'https://api.coze.cn/v1/workflow/run';
  const workflow_id = '7628544541594877979';

  try {
    let fileId = "";

    // 1. 上传图片逻辑（保持不变，但增加报错详情）
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${pathToken}` },
        body: formData
      });
      const uploadData = await uploadRes.json();
      if (uploadData.code !== 0) throw new Error(`图片上传失败: ${uploadData.msg}`);
      fileId = uploadData.data.id;
    }
    // 2. 运行工作流
    const response = await fetch(workflowUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${pathToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        workflow_id: workflow_id,
        parameters: {
          input: text || "请根据图片规划行程",
          // ！！！关键修改：从 picture: fileId 改为对象格式
          // 注意：请确认你的变量名是 picture 还是 image (截图显示是 picture)
          picture: fileId ? { "file_id": fileId } : null
        }
      })
    });
    const result = await response.json();

    // 针对 Token 过期的特殊处理
    if (result.code === 700012006) {
      throw new Error("API Token 已过期，请更新环境变量 VITE_COZE_PATH_TOKEN");
    }

    if (result.code !== 0) {
      throw new Error(`工作流运行错误: ${result.msg}`);
    }

    // 核心解析逻辑：
    // Coze 的 result.data 是一个字符串，里面包含了代码节点的最终输出
    let finalData = JSON.parse(result.data);

    // 如果你的代码节点返回的是一个嵌套对象，我们直接返回它
    return finalData;

  } catch (error) {
    console.error("Coze Service Error:", error);
    throw error;
  }
}