import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Swiper, Image } from 'react-vant'
import SvgSearch from '@react-vant/icons/es/Search'
import Waterfall from '@/components/Waterfall'
import { getDiscountBanners, getDiscountList } from '@/api/discount'
import styles from './discount.module.css'

const Discount = () => {
  const navigate = useNavigate()
  const bannerHeight = 220
  const [banners, setBanners] = useState([])
  const [leftImages, setLeftImages] = useState([])
  const [rightImages, setRightImages] = useState([])
  const [leftHeight, setLeftHeight] = useState(0)
  const [rightHeight, setRightHeight] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [locationText, setLocationText] = useState('上海市浦东新区')

  const appendDiscountItems = (items) => {
    let nextLeftHeight = leftHeight
    let nextRightHeight = rightHeight
    const nextLeft = [...leftImages]
    const nextRight = [...rightImages]

    items.forEach((item) => {
      const h = Number(item?.height) || 0
      if (nextLeftHeight <= nextRightHeight) {
        nextLeft.push(item)
        nextLeftHeight += h
      } else {
        nextRight.push(item)
        nextRightHeight += h
      }
    })

    setLeftImages(nextLeft)
    setRightImages(nextRight)
    setLeftHeight(nextLeftHeight)
    setRightHeight(nextRightHeight)
  }

  const fetchMore = async () => {
    if (loading) return
    setLoading(true)
    try {
      const res = await getDiscountList(page, 10)
      const list = res.data || []
      appendDiscountItems(list)
      if (list.length > 0) {
        setPage((prev) => prev + 1)
        if (page === 1 && list[0]?.city) {
          setLocationText(`${list[0].city}市热门景区`)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const initPage = async () => {
      const [bannerRes, listRes] = await Promise.all([
        getDiscountBanners(),
        getDiscountList(1, 10)
      ])
      const bannerList = bannerRes.data || []
      const firstList = listRes.data || []
      setBanners(bannerList)
      appendDiscountItems(firstList)
      setPage(2)
      if (firstList[0]?.city) {
        setLocationText(`${firstList[0].city}市热门景区`)
      }
    }

    initPage()
  }, [])

  const handleSearchPage = (event) => {
    event.preventDefault()
    console.log('[Discount] search box clicked')
    const goSearch = () => {
      console.log('[Discount] navigating to /search')
      navigate('/search')
    }
    console.log('[Discount] startViewTransition support:', Boolean(document.startViewTransition))
    if (document.startViewTransition) {
      try {
        console.log('[Discount] start view transition')
        document.startViewTransition(goSearch)
        return
      } catch (error) {
        console.error('[Discount] view transition failed, fallback navigate', error)
      }
    }
    console.log('[Discount] fallback navigate without transition')
    goSearch()
  }

  return (
    <div className={styles.page}>
      <section className={styles.searchBar}>
        <button
          type="button"
          className={styles.searchWrap}
          onClick={handleSearchPage}
        >
          <span className={styles.searchIcon}>
            <SvgSearch />
          </span>
          <span className={styles.searchInput}>搜索景点、城市或优惠</span>
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

      <section className={styles.banner} style={{ height: `${bannerHeight}px` }}>
        <Swiper autoplay={3000} indicatorColor="#ffffff" height={bannerHeight}>
          {banners.map((banner) => (
            <Swiper.Item key={banner.id}>
              <Image className={styles.bannerImage} fit="cover" src={banner.url} />
            </Swiper.Item>
          ))}
        </Swiper>
      </section>

      <section className={styles.zone}>
        <div className={styles.zoneHeader}>
          <h3 className={styles.zoneTitle}>特惠专区</h3>
          <span className={styles.zoneSubTitle}>每日更新优惠</span>
        </div>
        <Waterfall
          leftImages={leftImages}
          rightImages={rightImages}
          loading={loading}
          fetchMore={fetchMore}
        />
      </section>
    </div>
  )
}

export default Discount