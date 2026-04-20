import useTitle from '@/hooks/useTitle'
import {
  Button
} from 'react-vant';
import { showToast } from '@/components/Toast/toastController';

const Home = () => {
  useTitle("首页 去想去的地方");
  return (
    <>
      <Button type="primary" onClick={() => showToast(3, 6, 9)}>
        点击弹出消息提示
      </Button>
    </>
  )
}

export default Home