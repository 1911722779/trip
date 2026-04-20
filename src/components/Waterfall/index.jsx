import styles from './waterfall.module.css'
import { Loading } from 'react-vant'
import {
  useEffect,
  useRef
} from 'react';
import ImageCard from '@/components/ImageCard';

const Waterfall = (props) => {
  const loader = useRef(null);
  const fetchMoreRef = useRef(() => Promise.resolve());
  const isFetchingRef = useRef(false);

  const {
    loading,
    fetchMore,
    leftImages = [],
    rightImages = []
  } = props

  useEffect(() => {
    fetchMoreRef.current = fetchMore
  }, [fetchMore])

  useEffect(() => {
    // ref 出现在视窗了 intersectionObserver
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return
        if (isFetchingRef.current) return
        if (loading) return
        isFetchingRef.current = true
        try {
          await Promise.resolve(fetchMoreRef.current())
        } finally {
          isFetchingRef.current = false
        }
      },
      { root: null, rootMargin: '200px 0px', threshold: 0.01 }
    )
    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect()
  }, [loading])

  return (
    <div className={styles.wrapper}>
      <div className={styles.column}>
        {
          leftImages.map((image) => (
            <ImageCard key={image.id} {...image} />
          ))
        }
      </div>
      <div className={styles.column}>
        {
          rightImages.map((image) => (
            <ImageCard key={image.id} {...image} />
          ))
        }
      </div>
      <div ref={loader} className={styles.loader}>
        {loading ? <Loading size="24px" /> : null}
      </div>
    </div>
  )

}

export default Waterfall