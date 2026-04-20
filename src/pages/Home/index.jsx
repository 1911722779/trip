import useTitle from '@/hooks/useTitle'
import {
  Image,
  Swiper
} from 'react-vant';
import {
  HomeO,
  ServiceO,
  LocationO,
  GiftO,
  GuideO,
  FriendsO,
  ClusterO,
  Description,
  UserO
} from '@react-vant/icons'
import SvgSearch from '@react-vant/icons/es/Search'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { showToast } from '@/components/Toast/toastController';
import { requireLogin } from '@/utils/authGuard'
import styles from './home.module.css'

const SEARCH_KEYWORDS = ['五一去哪儿', '京都赏樱攻略', '海岛轻奢度假', '周末亲子出逃']

const STORY_TOPICS = [
  { title: '藏在山林里的避世民宿', subTitle: '清晨云雾和晚间炉火，都在等你放慢脚步' },
  { title: '人均 2000 元的跨国之旅', subTitle: '用轻预算开启异国风景与美食探索' },
  { title: '沿海小城慢旅行', subTitle: '在海风和日落里，找回生活节奏' }
]

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1200&q=80'
]

const QUICK_ENTRIES = [
  { icon: HomeO, label: '酒店', type: 'core' },
  { icon: ServiceO, label: '机票', type: 'core' },
  { icon: ClusterO, label: '火车票', type: 'core' },
  { icon: GiftO, label: '门票', type: 'core' },
  { icon: GuideO, label: '攻略', type: 'feature' },
  { icon: LocationO, label: '周边游', type: 'feature' },
  { icon: FriendsO, label: '定制团', type: 'feature' },
  { icon: Description, label: '签证助手', type: 'feature' }
]

const NOW_CARDS = [
  { id: 'n1', title: '京都', subTitle: '樱花前线正当时', tag: 'No.1', image: HERO_IMAGES[0] },
  { id: 'n2', title: '清迈', subTitle: '28°C 的慢节奏夏天', tag: 'No.2', image: HERO_IMAGES[1] },
  { id: 'n3', title: '三亚', subTitle: '海边日落与椰林晚风', tag: 'No.3', image: HERO_IMAGES[2] },
  { id: 'n4', title: '喀纳斯', subTitle: '高山湖泊进入最佳观景期', tag: 'No.4', image: HERO_IMAGES[0] },
  { id: 'n5', title: '福冈', subTitle: '小众城市散步路线', tag: 'No.5', image: HERO_IMAGES[1] },
  { id: 'n6', title: '大理', subTitle: '风花雪月的日常', tag: 'No.6', image: HERO_IMAGES[2] },
  { id: 'n7', title: '伊斯坦布尔', subTitle: '跨越欧亚的夜色', tag: 'No.7', image: HERO_IMAGES[0] },
  { id: 'n8', title: '青岛', subTitle: '海岸线与啤酒花', tag: 'No.8', image: HERO_IMAGES[1] },
  { id: 'n9', title: '厦门', subTitle: '岛城慢生活清单', tag: 'No.9', image: HERO_IMAGES[2] },
  { id: 'n10', title: '阿那亚', subTitle: '海边艺术度假', tag: 'No.10', image: HERO_IMAGES[0] },
  { id: 'n11', title: '新西兰南岛', subTitle: '湖光雪山公路片', tag: 'No.11', image: HERO_IMAGES[1] },
  { id: 'n12', title: '哈尔滨', subTitle: '春日松花江边', tag: 'No.12', image: HERO_IMAGES[2] }
]

const RANK_CARDS = [
  { id: 'r1', title: '曼谷', subTitle: '本周热度 Top 1', tag: 'Top 1', image: HERO_IMAGES[1] },
  { id: 'r2', title: '大阪', subTitle: '本周热度 Top 2', tag: 'Top 2', image: HERO_IMAGES[0] },
  { id: 'r3', title: '成都', subTitle: '本周热度 Top 3', tag: 'Top 3', image: HERO_IMAGES[2] },
  { id: 'r4', title: '丽江', subTitle: '本周热度 Top 4', tag: 'Top 4', image: HERO_IMAGES[0] },
  { id: 'r5', title: '首尔', subTitle: '本周热度 Top 5', tag: 'Top 5', image: HERO_IMAGES[1] },
  { id: 'r6', title: '重庆', subTitle: '本周热度 Top 6', tag: 'Top 6', image: HERO_IMAGES[2] },
  { id: 'r7', title: '东京', subTitle: '本周热度 Top 7', tag: 'Top 7', image: HERO_IMAGES[0] },
  { id: 'r8', title: '澳门', subTitle: '本周热度 Top 8', tag: 'Top 8', image: HERO_IMAGES[1] },
  { id: 'r9', title: '西安', subTitle: '本周热度 Top 9', tag: 'Top 9', image: HERO_IMAGES[2] },
  { id: 'r10', title: '桂林', subTitle: '本周热度 Top 10', tag: 'Top 10', image: HERO_IMAGES[0] },
  { id: 'r11', title: '普吉岛', subTitle: '本周热度 Top 11', tag: 'Top 11', image: HERO_IMAGES[1] },
  { id: 'r12', title: '乌镇', subTitle: '本周热度 Top 12', tag: 'Top 12', image: HERO_IMAGES[2] }
]

const Home = () => {
  useTitle("首页 去想去的地方");
  const navigate = useNavigate()
  const [keywordIndex, setKeywordIndex] = useState(0)
  const [locationText] = useState('上海市浦东新区 · 实时灵感推荐')
  const [nowVisible, setNowVisible] = useState(0)
  const [rankVisible, setRankVisible] = useState(0)

  const NOW_PAGE_SIZE = 9
  const RANK_PAGE_SIZE = 9

  const openNowMore = () => setNowVisible((prev) => (prev > 0 ? prev : NOW_PAGE_SIZE))
  const openRankMore = () => setRankVisible((prev) => (prev > 0 ? prev : RANK_PAGE_SIZE))
  const loadMoreNow = () => setNowVisible((prev) => Math.min(NOW_CARDS.length, prev + 6))
  const loadMoreRank = () => setRankVisible((prev) => Math.min(RANK_CARDS.length, prev + 6))

  const handleSearchPage = (event) => {
    event.preventDefault()
    const goSearch = () => {
      navigate('/search')
    }
    if (document.startViewTransition) {
      try {
        document.startViewTransition(goSearch)
        return
      } catch {
        // 不支持或异常时直接跳转
      }
    }
    goSearch()
  }

  const goDetailPage = (id) => {
    navigate(`/detail/${id}`)
  }

  const handleGoAccount = () => {
    const ok = requireLogin(navigate, '/account')
    if (!ok) return
    navigate('/account')
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setKeywordIndex((prev) => (prev + 1) % SEARCH_KEYWORDS.length)
    }, 2200)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className={styles.page}>
      <header className={styles.topHeader}>
        <div className={styles.userBlock}>
          <Image
            className={styles.userAvatar}
            fit="cover"
            src="https://img.yzcdn.cn/vant/cat.jpeg"
          />
          <div className={styles.userMeta}>
            <div className={styles.userGreeting}>Hi，欢迎回来</div>
            <div className={styles.userHint}>登录后解锁专属优惠与行程提醒</div>
          </div>
        </div>
        <button
          type="button"
          className={styles.loginTipBtn}
          onClick={handleGoAccount}
        >
          去登录
        </button>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroBanner}>
          <Swiper autoplay={3200} indicatorColor="#ffffff" height={220}>
            {HERO_IMAGES.map((image, idx) => (
              <Swiper.Item key={image}>
                <Image className={styles.bannerImage} fit="cover" src={image} />
                <div className={styles.storyOverlay}>
                  <h3 className={styles.storyTitle}>{STORY_TOPICS[idx % STORY_TOPICS.length].title}</h3>
                  <p className={styles.storyText}>{STORY_TOPICS[idx % STORY_TOPICS.length].subTitle}</p>
                </div>
              </Swiper.Item>
            ))}
          </Swiper>
        </div>

        {/* 不用 react-vant Button：其 .rv-button::before 会占满按钮，与红点/气泡的 ::before 冲突，预览里样式会像“改不动” */}
        <button
          type="button"
          className={styles.cornerButton}
          onClick={() => showToast(3, 6, 9)}
        >
          <span className={styles.cornerBubble}>
            <span className={styles.cornerUser} aria-hidden>
              <UserO />
            </span>
            <span className={styles.cornerBubbleText}>点击弹消息</span>
            <span className={styles.cornerTail} aria-hidden />
          </span>
        </button>

      </section>

      <section className={styles.searchBar}>
        <button
          type="button"
          className={styles.searchWrap}
          onClick={handleSearchPage}
        >
          <span className={styles.searchIcon}>
            <SvgSearch />
          </span>
          <span className={styles.searchInput}>试试“{SEARCH_KEYWORDS[keywordIndex]}”</span>
        </button>
      </section>

      <header className={styles.locationBar}>
        <div className={styles.locationLeft}>
          <span className={styles.locationDot} />
          <span className={styles.locationText}>{locationText}</span>
        </div>
        <button className={styles.locationAction} type="button">
          切换
        </button>
      </header>

      <section className={styles.quickZone}>
        {QUICK_ENTRIES.map((entry, idx) => (
          <button key={entry.label} type="button" className={styles.quickItem}>
            <span
              className={`${styles.quickIcon} ${
                entry.type === 'core' ? styles.coreIcon : styles.featureIcon
              }`}
              style={{ animationDelay: `${idx * 0.08}s` }}
            >
              <entry.icon />
            </span>
            <span className={styles.quickLabel}>{entry.label}</span>
          </button>
        ))}
      </section>

      <section className={styles.zone}>
        <div className={styles.zoneHeader}>
          <div className={styles.zoneHeaderLeft}>
            <h3 className={styles.zoneTitle}>此时此刻</h3>
            <span className={styles.zoneSubTitle}>适合现在出发的目的地</span>
          </div>
          <button type="button" className={styles.zoneMoreBtn} onClick={openNowMore}>
            更多<span className={styles.zoneMoreArrow} aria-hidden>›</span>
          </button>
        </div>
        <div className={styles.exploreScroller}>
          {NOW_CARDS.map((card) => (
            <article className={styles.exploreCard} key={card.id} onClick={() => goDetailPage(card.id)}>
              <Image fit="cover" src={card.image} className={styles.cardImage} />
              <div className={styles.cardMask}>
                <span className={styles.cardTag}>{card.tag}</span>
                <h4 className={styles.cardTitle}>{card.title}</h4>
                <p className={styles.cardSubTitle}>{card.subTitle}</p>
              </div>
            </article>
          ))}
          <article
            className={`${styles.exploreCard} ${styles.moreCard}`}
            key="now-more"
            onClick={openNowMore}
          >
            <div className={styles.moreInner}>
              <div className={styles.moreTitle}>更多</div>
              <div className={styles.moreSubTitle}>查看更多目的地</div>
            </div>
          </article>
        </div>
        {nowVisible > 0 ? (
          <div className={styles.moreGridWrap}>
            <div className={styles.moreGrid}>
              {NOW_CARDS.slice(0, nowVisible).map((card) => (
                <article className={styles.gridCard} key={`now-grid-${card.id}`} onClick={() => goDetailPage(card.id)}>
                  <Image fit="cover" src={card.image} className={styles.cardImage} />
                  <div className={styles.cardMask}>
                    <span className={styles.cardTag}>{card.tag}</span>
                    <h4 className={styles.cardTitle}>{card.title}</h4>
                    <p className={styles.cardSubTitle}>{card.subTitle}</p>
                  </div>
                </article>
              ))}
            </div>
            {nowVisible < NOW_CARDS.length ? (
              <button type="button" className={styles.loadMoreBtn} onClick={loadMoreNow}>
                加载更多
              </button>
            ) : null}
          </div>
        ) : null}
      </section>

      <section className={styles.zone}>
        <div className={styles.zoneHeader}>
          <div className={styles.zoneHeaderLeft}>
            <h3 className={styles.zoneTitle}>排行榜</h3>
            <span className={styles.zoneSubTitle}>本周热门目的地 Top</span>
          </div>
          <button type="button" className={styles.zoneMoreBtn} onClick={openRankMore}>
            更多<span className={styles.zoneMoreArrow} aria-hidden>›</span>
          </button>
        </div>
        <div className={styles.exploreScroller}>
          {RANK_CARDS.map((card) => (
            <article className={styles.exploreCard} key={card.id} onClick={() => goDetailPage(card.id)}>
              <Image fit="cover" src={card.image} className={styles.cardImage} />
              <div className={styles.cardMask}>
                <span className={styles.cardTag}>{card.tag}</span>
                <h4 className={styles.cardTitle}>{card.title}</h4>
                <p className={styles.cardSubTitle}>{card.subTitle}</p>
              </div>
            </article>
          ))}
          <article
            className={`${styles.exploreCard} ${styles.moreCard}`}
            key="rank-more"
            onClick={openRankMore}
          >
            <div className={styles.moreInner}>
              <div className={styles.moreTitle}>更多</div>
              <div className={styles.moreSubTitle}>查看 Top 榜单</div>
            </div>
          </article>
        </div>
        {rankVisible > 0 ? (
          <div className={styles.moreGridWrap}>
            <div className={styles.moreGrid}>
              {RANK_CARDS.slice(0, rankVisible).map((card) => (
                <article className={styles.gridCard} key={`rank-grid-${card.id}`} onClick={() => goDetailPage(card.id)}>
                  <Image fit="cover" src={card.image} className={styles.cardImage} />
                  <div className={styles.cardMask}>
                    <span className={styles.cardTag}>{card.tag}</span>
                    <h4 className={styles.cardTitle}>{card.title}</h4>
                    <p className={styles.cardSubTitle}>{card.subTitle}</p>
                  </div>
                </article>
              ))}
            </div>
            {rankVisible < RANK_CARDS.length ? (
              <button type="button" className={styles.loadMoreBtn} onClick={loadMoreRank}>
                加载更多
              </button>
            ) : null}
          </div>
        ) : null}
      </section>
    </div>
  )
}

export default Home