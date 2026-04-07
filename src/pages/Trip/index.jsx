import {
  useEffect,
  useState
} from 'react'
import useTitle from '@/hooks/useTitle';
import {
  chat,
  qwenChat
} from '@/llm';
import styles from './trip.module.css'
import {
  Button,
  Input,
  Loading,
  Toast
} from 'react-vant';
import {
  ChatO,
  UserO
} from '@react-vant/icons';

const Trip = () => {
  /* useEffect(() => {
    const fetchChat = async () => {
      const res = await chat([
        {
          role: 'user',
          content: '我想去重庆旅游，帮我推荐几个地点'
        }
      ],);
      console.log(res, 'result-----');
    }
    fetchChat();
  }, [])
  */

  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const isDisabled = isSending || text.trim().length === 0;
  // 数组驱动界面
  // 静态界面
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: '你好，我是你的专属行程顾问，有什么可以帮您的吗？',
      role: 'assistant'
    },
    {
      id: 2,
      content: 'hello~',
      role: 'user'
    },
    {
      id: 1,
      content: '你好，我是你的专属行程顾问，有什么可以帮您的吗？',
      role: 'assistant'
    },
    {
      id: 2,
      content: 'hello~',
      role: 'user'
    },
    {
      id: 1,
      content: '你好，我是你的专属行程顾问，有什么可以帮您的吗？',
      role: 'assistant'
    },
    {
      id: 2,
      content: 'hello~',
      role: 'user'
    },
    {
      id: 1,
      content: '你好，我是你的专属行程顾问，有什么可以帮您的吗？',
      role: 'assistant'
    },
    {
      id: 2,
      content: 'hello~',
      role: 'user'
    },
  ]);

  const handleChat = async () => {
    if (text.trim() === "") {
      Toast.onfo({
        message: '内容不能为空'
      })
      return;
    }
    setIsSending(true)
    setText("")
    setMessages((prev) => {
      return [
        ...prev,
        {
          role:'user',
          content:text
        }
      ]
    })
    const newMessage = await chat([{
      role: 'user',
      content: text
    }]);
    setMessages((prev) => {
      return [
        ...prev,
        newMessage.data
      ]
    });
    setIsSending(false);
  }
  useTitle('行程智能客服 您的专属行程顾问');
  return (
    <div className="flex flex-col h-all">
      <div className={`flex-1 ${styles.chatArea}`}>
        {
          messages.map((msg, index) => (
            <div
              key={index}
              className={
                msg.role === 'user' ? styles.messageRight : styles.messageLeft
              }
            >
              {
                msg.role === 'assistant' ? <ChatO /> : <UserO />
              }
              {msg.content}
            </div>
          ))
        }
      </div>
      <div className={`flex ${styles.inputArea}`}>
        <Input
          value={text}
          onChange={(e) => setText(e)}
          placeholder="请输入消息"
          className={`flex-1 ${styles.input}`}
        />
        <Button disabled={isDisabled} type="primary" onClick={handleChat} className={styles.btn} aria-label="发送">
          ↑
        </Button>
      </div>
      {isSending && (<div className="fixed-loading"><Loading type="ball" /></div>)}
    </div>
  )
}

export default Trip