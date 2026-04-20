import useTitle from '@/hooks/useTitle';
import {
  useRef,
  useState
} from 'react';
import {
  Image,
  Cell,
  CellGroup,
  ActionSheet,
  Search,
} from 'react-vant';
import {
  ServiceO,
  SettingO,
  FriendsO,
  StarO,
  AddO,
  CartO,
  ChatO,
  FireO,
  LikeO,
  HomeO,
  UserO
} from '@react-vant/icons';
import styles from './account.module.css';
import {
  generateAvatar
} from '@/llm';
import SvgSearch from '@react-vant/icons/es/Search';

const Account = () => {
  const [userInfo, setUserInfo] = useState({
    nickname: '张三',
    level: '6级',
    slogan: '令令令申申申申申，不要熬夜',
    avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',

  })
  useTitle('我的');

  const [showActionSheet, setShowActionSheet] = useState(false)
  const fileInputRef = useRef(null)

  const updateAvatar = (avatar) => {
    setUserInfo((prev) => ({
      ...prev,
      avatar,
    }))
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    updateAvatar(url)
    setShowActionSheet(false)
    event.target.value = ''
  }
  const handleAction = async (e) => {
    console.log(e)
    if (e.type === 1) {
      // AI 生成头像
      const text = `
        昵称：${userInfo.nickname}
        slogan: ${userInfo.slogan}
      `
      const newAvatar = await generateAvatar(text);
      if (newAvatar) {
        updateAvatar(newAvatar)
      }
      setShowActionSheet(false)
    } else if (e.type === 2) {
      // 图片上传
      fileInputRef.current?.click()
    }
  }
  const actions = [
    {
      name: '根据昵称生成AI头像',
      color: '#123123',
      type: 1
    },
    {
      name: '上传头像',
      color: '#123123',
      type: 2
    }
  ]
  const gridData = [
    { icon: <AddO />, text: '添加' },
    { icon: <CartO />, text: '购物车' },
    { icon: <ChatO />, text: '聊天' },
    { icon: <FireO />, text: '热门' },
    { icon: <LikeO />, text: '喜欢' },
    { icon: <StarO />, text: '收藏' },
    { icon: <SvgSearch />, text: '搜索' },
    { icon: <HomeO />, text: '首页' },
    { icon: <UserO />, text: '我的' },
  ]
  return (

    <div className={styles.container}>
      <div className={styles.user}>
        <Image
          round
          width="64px"
          height="64px"
          src={userInfo.avatar}
          style={{ cursor: 'pointer' }}
          onClick={() => setShowActionSheet(true)}
        />
        <div className="ml4">
          <div className={styles.nickname}>昵称：{userInfo.nickname}</div>
          <div className={styles.level}>等级：{userInfo.level}</div>
          <div className={styles.slogan}>个性签名：{userInfo.slogan}</div>
        </div>

      </div>

      <div className="mt3">
        <CellGroup inset>
          <Cell title="服务" icon={<ServiceO />} isLink />
        </CellGroup>
        <CellGroup inset className="mt2">
          <Cell title="收藏" icon={<StarO />} isLink />
          <Cell title="朋友圈" icon={<FriendsO />} isLink />
        </CellGroup>
        <CellGroup inset className="mt2">
          <Cell title="设置" icon={<SettingO />} isLink />
        </CellGroup>
      </div>
      <ActionSheet
        visible={showActionSheet}
        actions={actions}
        duration={0.3}
        cancelText='取消'
        onCancel={() => setShowActionSheet(false)}
        onSelect={(e) => handleAction(e)}
      >
      </ActionSheet>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      
      <div className={styles.gridContainer}>
        {
          gridData.map((item, index) => (
            <div key={index} className={styles.gridItem}>
              <div className={styles.icon}>{item.icon}</div>
              <div className={styles.text}>{item.text}</div>
            </div>
          ))
        }
      </div>

    </div>

  )
}

export default Account