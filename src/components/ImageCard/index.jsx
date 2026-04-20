import styles from './card.module.css';
import {
  useRef,
  useEffect
} from 'react';
import { useNavigate } from 'react-router-dom'

const ImageCard = (props) => {
  const navigate = useNavigate()
  const {
    id,
    url,
    height,
    scenicName,
    city,
    discountTag,
    discountPrice,
    originPrice
  } = props;
  const hasGoodsInfo = Boolean(scenicName || discountPrice)
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024
  const desktopScale = isDesktop ? 1.28 : 1
  const imageHeight = hasGoodsInfo
    ? Math.max(96, Math.floor((Number(height) || 180) * 0.52 * desktopScale))
    : Math.floor((Number(height) || 180) * desktopScale)
  const imgRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry], obs) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const oImg = document.createElement('img');
        oImg.src = img.dataset.src;
        oImg.onload = function () {
          img.src = img.dataset.src;
        }
        // img.src = img.dataset.src || '';
        obs.unobserve(img);
      }
    })
    if (imgRef.current) observer.observe(imgRef.current);
  }, [])

  const handleGoDetail = () => {
    navigate(`/detail/${id ?? ''}`)
  }

  return (
    <div className={styles.card} onClick={handleGoDetail} role="button" tabIndex={0}>
      <div style={{ height: imageHeight }} className={styles.imageWrap}>
        <img ref={imgRef} data-src={url} className={styles.img} />
        {discountTag ? <span className={styles.tag}>{discountTag}</span> : null}
      </div>
      {hasGoodsInfo ? (
        <div className={styles.info}>
          <div className={styles.title}>{city ? `${city} · ${scenicName}` : scenicName}</div>
          <div className={styles.priceRow}>
            <span className={styles.priceLabel}>¥</span>
            <span className={styles.priceValue}>{discountPrice ?? '--'}</span>
            {originPrice ? <span className={styles.originPrice}>¥{originPrice}</span> : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default ImageCard;