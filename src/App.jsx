import './App.css'
import {
  Suspense,
  lazy
} from 'react'
import {
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import MainLayout from '@/components/MainLayout';
import BlankLayout from '@/components/BlankLayout';
import Loading from '@/components/Loading';
import Toast from '@/components/Toast';


const Home = lazy(() => import('@/pages/Home'))
const Search = lazy(() => import('@/pages/Search'))
const Discount = lazy(() => import('@/pages/Discount'));
const Collection = lazy(() => import('@/pages/Collection'));
const Trip = lazy(() => import('@/pages/Trip'));
const Account = lazy(() => import('@/pages/Account'));
const Detail = lazy(() => import('@/pages/Detail'));
const Coze = lazy(() => import('@/pages/Coze'));
const Login = lazy(() => import('@/pages/Login'));
function App() {
  return (
    <>
      <Suspense fallback={<div>{<Loading />}</div>}>
        <Routes>
          {/* 带有 tabbar 的 Layout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/discount" element={<Discount />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/trip" element={<Trip />} />
            <Route path="/account" element={<Account />} />

          </Route>

          {/* search 不要 tabbar：只在 /search 匹配 BlankLayout */}
          <Route element={<BlankLayout />}>
            <Route path="/search" element={<Search />} />
            <Route path="/detail/:id" element={<Detail />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/coze" element={<Coze />} />
        </Routes>

      </Suspense>
      <Toast />
    </>
  )
}


export default App
