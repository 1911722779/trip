// miit 用来做自定义事件 让组建基于事件机制来通信
import mitt from 'mitt';

// 实例化
export const toastEvents = mitt();

export function showToast(user = 0, bell = 0, mail = 0) {
  toastEvents.emit('show', { user, bell, mail });
}
