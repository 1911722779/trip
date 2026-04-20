import { useEffect, useRef, useState } from 'react'
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

  const pageRef = useRef(1)
  const loadingRef = useRef(false)
  const leftHeightRef = useRef(0)
  const rightHeightRef = useRef(0)
  const leftImagesRef = useRef([])
  const rightImagesRef = useRef([])

  const appendDiscountItems = (items) => {
    let nextLeftHeight = leftHeightRef.current
    let nextRightHeight = rightHeightRef.current
    const nextLeft = [...leftImagesRef.current]
    const nextRight = [...rightImagesRef.current]

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

    leftImagesRef.current = nextLeft
    rightImagesRef.current = nextRight
    leftHeightRef.current = nextLeftHeight
    rightHeightRef.current = nextRightHeight
  }

  const fetchMore = async () => {
    if (loadingRef.current) return
    loadingRef.current = true
    setLoading(true)
    try {
      const currentPage = pageRef.current
      const res = await getDiscountList(currentPage, 10)
      const list = res.data || []
      appendDiscountItems(list)
      if (list.length > 0) {
        const nextPage = currentPage + 1
        pageRef.current = nextPage
        setPage(nextPage)
        if (currentPage === 1 && list[0]?.city) {
          setLocationText(`${list[0].city}市热门景区`)
        }
      }
    } finally {
      setLoading(false)
      loadingRef.current = false
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
      pageRef.current = 2
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