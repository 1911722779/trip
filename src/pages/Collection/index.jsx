import { useEffect, useMemo, useState } from 'react'
import Waterfall from '@/components/Waterfall/index.jsx'
import { PullRefresh } from 'react-vant'
import styles from './collection.module.css'

const MOCK_COLLECTION_IMAGES = [
  {
    id: 'c1',
    url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80',
    height: 260,
    scenicName: '云海森林木屋',
    city: '阿那亚',
    discountTag: '限时特惠',
    discountPrice: 699,
    originPrice: 899
  },
  {
    id: 'c2',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    height: 220,
    scenicName: '落日海湾下午茶',
    city: '三亚',
    discountTag: '热门',
    discountPrice: 168,
    originPrice: 238
  },
  {
    id: 'c3',
    url: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=800&q=80',
    height: 280,
    scenicName: '古城夜游联票',
    city: '西安',
    discountTag: 'Top',
    discountPrice: 129,
    originPrice: 169
  },
  {
    id: 'c4',
    url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80',
    height: 240,
    scenicName: '山谷漂流一日',
    city: '清远',
    discountTag: '亲子优选',
    discountPrice: 199,
    originPrice: 299
  },
  {
    id: 'c5',
    url: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=800&q=80',
    height: 230,
    scenicName: '星空露营体验',
    city: '大理',
    discountTag: '周末爆款',
    discountPrice: 329,
    originPrice: 459
  },
  {
    id: 'c6',
    url: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=800&q=80',
    height: 270,
    scenicName: '湖畔温泉双人票',
    city: '腾冲',
    discountTag: '温泉季',
    discountPrice: 268,
    originPrice: 368
  }
]

const buildColumns = (images) => {
  const leftImages = []
  const rightImages = []
  let leftHeight = 0
  let rightHeight = 0

  images.forEach((img) => {
    const h = Number(img?.height) || 0
    if (leftHeight <= rightHeight) {
      leftImages.push(img)
      leftHeight += h
    } else {
      rightImages.push(img)
      rightHeight += h
    }
  })

  return { leftImages, rightImages }
}

const BATCH_SIZE = 6

const Collection = () => {
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [seed, setSeed] = useState(0)
  const [cursor, setCursor] = useState(0)
  const [allImages, setAllImages] = useState([])

  const createBatch = (startCursor, nextSeed, size = BATCH_SIZE) => {
    return Array.from({ length: size }, (_, index) => {
      const loopIndex = (startCursor + index) % MOCK_COLLECTION_IMAGES.length
      const base = MOCK_COLLECTION_IMAGES[loopIndex]
      return {
        ...base,
        id: `${base.id}-${nextSeed}-${startCursor + index}`
      }
    })
  }

  const fetchMore = async () => {
    if (loading) return
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 220))
      const batch = createBatch(cursor, seed)
      setAllImages((prev) => [...prev, ...batch])
      setCursor((prev) => prev + BATCH_SIZE)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMore()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { leftImages, rightImages } = useMemo(() => {
    return buildColumns(allImages)
  }, [allImages])

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h2 className={styles.title}>我的收藏</h2>
        <p className={styles.subTitle}>常看常新，随时回顾你喜欢的目的地</p>
      </header>

      <section className={styles.cardsSection}>
        <PullRefresh
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true)
            try {
              await new Promise((resolve) => setTimeout(resolve, 400))
              const nextSeed = seed + 1
              setSeed(nextSeed)
              setCursor(BATCH_SIZE)
              setAllImages(createBatch(0, nextSeed))
            } finally {
              setRefreshing(false)
            }
          }}
        >
          <div className={styles.cardsInner}>
            <Waterfall
              leftImages={leftImages}
              rightImages={rightImages}
              fetchMore={fetchMore}
              loading={loading}
            />
          </div>
        </PullRefresh>
      </section>
    </div>
  )
}

export default Collection