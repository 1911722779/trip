import {
  useParams
} from 'react-router-dom';
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

const BottomBar = memo(() => {
  return (
    <div className={styles.bottomBar}>
      <div className={styles.left}>
        <div className={styles.iconBlock}>
          <ShopO/>
          <span>店铺</span>
        </div>
        <div className={styles.iconBlock}>
          <ServiceO/>
          <span>客服</span>
        </div>
        <div className={styles.iconBlock}>
          <StarO/>
          <span>收藏</span>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.carBtn}>加入购物车</div>
        <div className={styles.buyBtn}>立即购买</div>
      </div>
    </div>
  )
})

const Detail = () => {
  const { id } = useParams();
  const { loading, detail, setDetail } = useDetailStore();
  const [query, setQuery] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const showSearchBtn = query.trim().length > 0;

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
  if (loading) {
    return <Skeleton />
  }
  return (
    <div>
      <nav className={styles.nav}>
        <ArrowLeft fontSize={28} />
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
        <Cart fontSize={28} />
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
          <div className={styles.couponBtn}>登录查看更多</div>
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
          <span className={styles.extraInfon}>河北保定 · 快递 · 免运费</span>
        </div>
        <div className={styles.row}>
          <LikeO className={styles.icon}/>
          <span>7天无理由退货</span>
        </div>
        <div className={styles.row}>
          <Description className={styles.icon}/>
          <span>风格 有无夹层 是否防水</span>
        </div>
      </div>
      <BottomBar />
    </div>
  );
};

export default Detail;