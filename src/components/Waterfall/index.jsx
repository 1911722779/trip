import styles from './waterfall.module.css'
import { Loading } from 'react-vant'
import {
  useEffect,
  useRef
} from 'react';
import ImageCard from '@/components/ImageCard';

const Waterfall = (props) => {
  const loader = useRef(null);

  const {
    loading,
    fetchMore,
    leftImages = [],
    rightImages = []
  } = props
  useEffect(() => {
    // ref 出现在视窗了 intersectionObserver
    const observer = new IntersectionObserver(([entry],obs) => {
      if (entry.isIntersecting) {
        fetchMore();
      }
      // obs.unobserve(entry.target);
    })
    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect()
  }, [])

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