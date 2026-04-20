import { useState, useEffect, useLayoutEffect } from 'react';
import styles from './toast.module.css';
import { toastEvents } from './toastController';

/** 与 MainLayout 最后一项「我的账户」图标中心对齐（实测 DOM，避免网页端 Tab 非等分时 90% 不准） */
function measureUserTabIconCenterX() {
  const icon = document.querySelector(
    '.rv-tabbar .rv-tabbar-item:last-child .rv-tabbar-item__icon',
  );
  if (icon) {
    const r = icon.getBoundingClientRect();
    return r.left + r.width / 2;
  }
  const item = document.querySelector('.rv-tabbar .rv-tabbar-item:last-child');
  if (item) {
    const r = item.getBoundingClientRect();
    return r.left + r.width / 2;
  }
  return window.innerWidth * 0.9;
}

const Toast = () => {
  const [visible, setIsVisible] = useState(false);
  const [data, setData] = useState({
    user: 0,
    bell: 0,
    mail: 0,
  });
  const [centerXPx, setCenterXPx] = useState(0);

  useEffect(() => {
    const show = (info) => {
      setData(info);
      setCenterXPx(measureUserTabIconCenterX());
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    };
    toastEvents.on('show', show);
    return () => {
      toastEvents.off('show', show);
    };
  }, []);

  useLayoutEffect(() => {
    if (!visible) return undefined;

    const update = () => {
      setCenterXPx(measureUserTabIconCenterX());
    };

    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={styles.toastWrapper}
      style={{ left: `${centerXPx}px` }}
    >
      <div className={styles.toastItem}>👤{data.user}</div>
      <div className={styles.toastItem}>🔔{data.bell}</div>
      <div className={styles.toastItem}>✉️{data.mail}</div>
      <div className={styles.toastArrow} aria-hidden />
    </div>
  );
};

export default Toast;
