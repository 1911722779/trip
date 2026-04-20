import { useState, useEffect } from 'react';
import styles from './toast.module.css';
import { toastEvents } from './toastController';

const Toast = (props) => {
  const [visible, setIsVisible] = useState(false)
  const [data, setData] = useState({
    user: 0,
    bell: 0,
    mail: 0
  })

  useEffect(() => {
    const show = (info) => {
      setData(info);
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 3000);
    }
    // toastEvents 是mitt 的示例
    // 自定义事件
    // on 监听一个事件
    // 订阅了show 的事件，订阅者
    toastEvents.on('show', show);
    // 卸载组件时，取消订阅
    return () => {
      toastEvents.off('show', show);
    }
  }, []);

  // 如果不可见，则不渲染 等待通信来控制可见性
  if (!visible) return null;

  return (
    <div className={styles.toastWrapper}>
      <div className={styles.toastItem}>👤{data.user}</div>
      <div className={styles.toastItem}>🔔{data.bell}</div>
      <div className={styles.toastItem}>✉️{data.mail}</div>
      <div className={styles.toastArrow}></div>
    </div>
  )
}

export default Toast