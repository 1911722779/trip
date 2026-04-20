import {
  useParams
} from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  useEffect,
  memo,
  useMemo,
  useState
} from 'react';
import useDetailStore from '@/store/useDetailStore';
import {
  Skeleton
} from 'react-vant';
import useTitle from '@/hooks/useTitle';
import styles from './detail.module.css';
import {
  ArrowLeft,
  Cart,
  Description,
  LikeO,
  Logistics,
  ServiceO,
  ShopO,
  StarO,
} from '@react-vant/icons';
import SvgSearch from '@react-vant/icons/es/Search';
import {
  Swiper,
  Image
} from 'react-vant';
import { debounce } from '@/utils';
import { requireLogin } from '@/utils/authGuard'

const RANDOM_ADDRESS_INFOS = [
  '上海浦东新区 · 同城配送 · 满99免运费',
  '北京朝阳区 · 快递发货 · 免运费',
  '浙江杭州 · 次日达 · 满2件包邮',
  '广东广州 · 门店自提/快递 · 免运费',
  '四川成都 · 当日闪送 · 满59免运费',
  '云南大理 · 商家直发 · 偏远地区补邮'
]

const RANDOM_TRAVEL_TYPES = [
  '酒店',
  '景区',
  '餐厅',
  '民宿',
  '咖啡馆',
  '温泉馆',
  '露营地',
  '游船码头',
  '主题乐园',
  '伴手礼店',
  '旅拍店',
  '文创市集'
]

const BottomBar = memo(({ onAuthAction }) => {
  return (
    <div className={styles.bottomBar}>
      <div className={styles.left}>
        <div className={styles.iconBlock} onClick={onAuthAction}>
          <ShopO/>
          <span>店铺</span>
        </div>
        <div className={styles.iconBlock} onClick={onAuthAction}>
          <ServiceO/>
          <span>客服</span>
        </div>
        <div className={styles.iconBlock} onClick={onAuthAction}>
          <StarO/>
          <span>收藏</span>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.carBtn} onClick={onAuthAction}>加入购物车</div>
        <div className={styles.buyBtn} onClick={onAuthAction}>立即购买</div>
      </div>
    </div>
  )
})

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, detail, setDetail } = useDetailStore();
  const [query, setQuery] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const showSearchBtn = query.trim().length > 0;
  const randomAddressInfo = useMemo(() => {
    const index = Math.floor(Math.random() * RANDOM_ADDRESS_INFOS.length)
    return RANDOM_ADDRESS_INFOS[index]
  }, [])
  const randomTravelTypesText = useMemo(() => {
    const shuffled = [...RANDOM_TRAVEL_TYPES].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 4).join(' · ')
  }, [])

  const handleQueryDebounce = useMemo(() => {
    return debounce((value) => {
      setSearchKeyword(value.trim());
    }, 300);
  }, []);

  useEffect(() => {
    handleQueryDebounce(query);
  }, [query, handleQueryDebounce]);

  useEffect(() => {
    useTitle(detail?.title);
  }, [detail])
  useEffect(() => {
    setDetail()
  }, [])

  const handleGuardAction = () => {
    const ok = requireLogin(navigate, location.pathname)
    if (!ok) return
    window.alert('已登录，可继续操作')
  }

  if (loading) {
    return <Skeleton />
  }
  return (
    <div>
      <nav className={styles.nav}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={() => navigate(-1)}
          aria-label="返回"
        >
          <ArrowLeft fontSize={28} />
        </button>
        <div className={styles.searchWrap}>
          <SvgSearch className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索商品关键词"
          />
          {showSearchBtn ? (
            <button
              type="button"
              className={styles.searchBtn}
              onClick={() => setSearchKeyword(query.trim())}
            >
              搜索
            </button>
          ) : null}
        </div>
        <Cart fontSize={28} onClick={handleGuardAction} />
      </nav>
      {/* 图片轮播 幻灯片 */}
      <div className={styles.container}>
        {searchKeyword ? (
          <div className={styles.searchTip}>当前搜索关键词：{searchKeyword}</div>
        ) : null}
        <Swiper>
          {
            detail.images.map((item, index) => (
              <Swiper.Item key={index}>
                <Image lazyload src={item.url} />
              </Swiper.Item>
            ))
          }
        </Swiper>
        <div className={styles.priceRow}>
          <div className={styles.price}>￥{detail.price}</div>
          <div className={styles.couponBtn} onClick={handleGuardAction}>登录查看更多</div>
        </div>
        <div className={styles.titleRow}>
          <span className={styles.tag}>IFASHION</span>
          <span className={styles.title}>{detail.title}</span>
        </div>
        <div className={styles.deliveryRow}>
          <Logistics className={styles.icon} fontSize={30}/>
          <span className={styles.deliveryYext}>
            预计3小时发货 | 承诺48小时内发货
          </span>
          <br />
          <span className={styles.extraInfon}>{randomAddressInfo}</span>
        </div>
        <div className={styles.row}>
          <LikeO className={styles.icon}/>
          <span>7天无理由退货</span>
        </div>
        <div className={styles.row}>
          <Description className={styles.icon}/>
          <span>{randomTravelTypesText}</span>
        </div>
      </div>
      <BottomBar onAuthAction={handleGuardAction} />
    </div>
  );
};

export default Detail;