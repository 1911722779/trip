import {
  useImageStore
} from '@/store/useImageStore'
import {
  useEffect
  ,useState
} from 'react'
import Waterfall from '@/components/Waterfall/index.jsx'
import { PullRefresh } from 'react-vant'

const Collection = () => {
  const { loading, leftImages, rightImages, fetchMore, refresh } = useImageStore();
  const [refreshing, setRefreshing] = useState(false)
  useEffect(()=>{
    fetchMore()
  },[])
  return (
    <>
      <PullRefresh
        refreshing={refreshing}
        onRefresh={async () => {
          setRefreshing(true)
          try {
            await refresh()
          } finally {
            setRefreshing(false)
          }
        }}
      >
        <Waterfall leftImages={leftImages} rightImages={rightImages} fetchMore={fetchMore} loading={loading}/>
      </PullRefresh>
    </>
  )
}

export default Collection