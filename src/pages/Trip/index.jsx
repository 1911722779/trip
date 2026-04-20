import { useRef, useState } from 'react'
import useTitle from '@/hooks/useTitle';
import { chat } from '@/llm';
import { runCozeWorkflow } from '@/services/cozeWorkflow';
import styles from './trip.module.css'
import { ActionSheet, Button, Input, Loading, Toast } from 'react-vant';
import { AddO, ChatO, ServiceO, UserO } from '@react-vant/icons';

const Trip = () => {
  const uploadImageRef = useRef(null);
  const [text, setText] = useState("");
  const [mode, setMode] = useState('coze'); // 建议默认设为 coze
  const [isSending, setIsSending] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [showModelSheet, setShowModelSheet] = useState(false);
  const [showMoreSheet, setShowMoreSheet] = useState(false);

  // 禁用逻辑优化：只要有字或有图，就可以发送
  const isDisabled = isSending || (!text.trim() && !selectedFileName);

  const createMessage = (role, content) => ({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    role,
    content
  });

  const [messages, setMessages] = useState([
    createMessage('assistant', '你好！我是你的专属行程顾问。你可以直接告诉我你想去哪里，或者上传一张风景照让我为你规划。'),
  ]);

  // 格式化输出：处理代码节点返回的复杂对象
  const normalizeWorkflowResult = (result) => {
    // 1. 安全检查
    if (!result) return '抱歉，未能生成行程。';

    try {
      // 2. 剥开第一层：如果 result 是字符串，先转成对象
      let obj = typeof result === 'string' ? JSON.parse(result) : result;

      // 3. 剥开第二层：针对你截图的情况，文字在 obj.data 里面
      // 如果 obj.data 还是个 JSON 字符串，我们继续解析它
      let content = obj.data || obj.summary_text || obj;

      if (typeof content === 'string') {
        try {
          // 尝试看看 content 是不是也是个 JSON 字符串（有时候 Coze 会套两层）
          const innerObj = JSON.parse(content);
          if (innerObj.data) content = innerObj.data;
        } catch (e) {
          // 解析失败说明 content 就是我们要的普通字符串，保持原样即可
        }
      }

      // 4. 最终清理：处理换行符，确保它在 UI 上正常显示
      if (typeof content === 'string') {
        return content.replace(/\\n/g, '\n').replace(/^"|"$/g, '');
      }

      // 如果最后是个对象（没找到 data 字段），就转成字符串显示，防止崩溃
      return JSON.stringify(content);

    } catch (error) {
      console.error("解析返回结果失败:", error);
      // 万一解析全失败了，返回原始结果的字符串形式，保证页面不崩
      return typeof result === 'string' ? result : '数据解析异常';
    }
  };
  const handleFileChange = (event) => {
    const file = event?.target?.files?.[0];
    setSelectedFileName(file ? file.name : '');
  };

  const handleChat = async () => {
    const currentText = text.trim();
    const selectedFile = uploadImageRef.current?.files?.[0];

    // 1. 本地 UI 更新
    setIsSending(true);
    setText(""); // 清空输入框

    // 构造用户看的消息内容
    let displayContent = currentText;
    if (selectedFile) {
      displayContent = currentText
        ? `${currentText} (已上传图片: ${selectedFile.name})`
        : `[图片] ${selectedFile.name}`;
    }
    setMessages((prev) => [...prev, createMessage('user', displayContent)]);

    try {
      if (mode === 'coze') {
        // 2. 调用工作流服务
        const workflowResult = await runCozeWorkflow({
          text: currentText,
          file: selectedFile
        });

        setMessages((prev) => [
          ...prev,
          createMessage('assistant', normalizeWorkflowResult(workflowResult))
        ]);
      } else {
        // 普通 LLM 聊天逻辑
        const newMessage = await chat([{ role: 'user', content: currentText }]);
        setMessages((prev) => [...prev, createMessage('assistant', newMessage.data.content)]);
      }
    } catch (error) {
      Toast.fail(error.message || '请求失败');
      setMessages((prev) => [...prev, createMessage('assistant', '抱歉，我遇到了一点技术问题，请稍后再试。')]);
    } finally {
      // 3. 重置状态
      setIsSending(false);
      setSelectedFileName('');
      if (uploadImageRef.current) uploadImageRef.current.value = '';
    }
  }

  // 其他 UI 逻辑保持不变...
  const modelActions = [
    { name: '普通聊天', mode: 'chat' },
    { name: 'Coze 工作流', mode: 'coze' }
  ];
  const moreActions = [{ name: '上传图片', type: 'upload' }];
  const handleModelSelect = (action) => { setMode(action.mode); setShowModelSheet(false); };
  const handleMoreSelect = (action) => {
    if (action.type === 'upload') uploadImageRef.current?.click();
    setShowMoreSheet(false);
  };

  useTitle('行程智能客服');

  return (
    <div className="flex flex-col h-all">
      {/* 消息展示区 */}
      <div className={`flex-1 ${styles.chatArea}`}>
        {messages.map((msg, index) => (
          <div key={msg.id} className={msg.role === 'user' ? styles.messageRowRight : styles.messageRowLeft}>
            {msg.role === 'assistant' && <span className={styles.messageIcon}><ChatO /></span>}
            <div className={msg.role === 'user' ? styles.messageRight : styles.messageLeft} style={{ whiteSpace: 'pre-wrap' }}>
              {msg.content}
            </div>
            {msg.role === 'user' && <span className={styles.messageIcon}><UserO /></span>}
          </div>
        ))}
      </div>

      {/* 输入区 */}
      <div className={styles.inputArea}>
        {selectedFileName && <div className={styles.fileTag}>📎 已选图片: {selectedFileName}</div>}
        <div className={styles.inputRow}>
          <Button className={styles.iconBtn} onClick={() => setShowModelSheet(true)} disabled={isSending}><ServiceO /></Button>
          <Input
            value={text}
            onChange={setText}
            placeholder={mode === 'coze' ? '告诉我想去哪或上传图片...' : '聊聊旅行想法...'}
            className={styles.input}
          />
          <Button disabled={isDisabled} type="primary" onClick={handleChat} className={styles.btn}>↑</Button>
          <Button className={styles.iconBtn} onClick={() => setShowMoreSheet(true)} disabled={isSending}><AddO /></Button>
        </div>
      </div>

      <ActionSheet
        visible={showModelSheet}
        actions={modelActions}
        duration={0.3}
        cancelText="取消"
        onSelect={handleModelSelect}
        onCancel={() => setShowModelSheet(false)}
      />
      <ActionSheet
        visible={showMoreSheet}
        actions={moreActions}
        duration={0.3}
        cancelText="取消"
        onSelect={handleMoreSelect}
        onCancel={() => setShowMoreSheet(false)}
      />

      <input type="file" ref={uploadImageRef} accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
      {isSending && <div className="fixed-loading"><Loading type="ball" /></div>}
    </div>
  )
}

export default Trip;