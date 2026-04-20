import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './login.module.css'
import { markLoggedIn } from '@/utils/authGuard'

const COUNTRY_OPTIONS = [
  { code: '+86', label: '中国', flag: '🇨🇳' },
  { code: '+852', label: '中国香港', flag: '🇭🇰' },
  { code: '+853', label: '中国澳门', flag: '🇲🇴' },
  { code: '+886', label: '中国台湾', flag: '🇹🇼' },
  { code: '+1', label: '美国/加拿大', flag: '🇺🇸' },
  { code: '+81', label: '日本', flag: '🇯🇵' }
]

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [mode, setMode] = useState('sms')
  const [countryCode, setCountryCode] = useState('+86')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [agreed, setAgreed] = useState(true)

  useEffect(() => {
    if (countdown <= 0) return undefined
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [countdown])

  const sendCode = () => {
    if (countdown > 0) return
    if (!phone.trim()) return
    setCountdown(60)
  }

  const onSubmit = () => {
    if (!agreed) return
    markLoggedIn()
    const redirectPath = location.state?.redirect || '/home'
    navigate(redirectPath, { replace: true })
  }

  return (
    <div className={styles.page}>
      <div className={styles.bgSketch} />
      <div className={styles.content}>
        <div className={styles.webLeftVisual} aria-hidden>
          <div className={styles.leftVisualCopy}>
            <div className={styles.leftVisualBrand}>Trip</div>
            <div className={styles.leftVisualSlogan}>把每一次出发，变成值得收藏的风景。</div>
          </div>
        </div>
        <div className={styles.rightPane}>
          <section className={styles.loginCard}>
            <button
              type="button"
              className={styles.skipBtn}
              onClick={() => navigate('/home')}
            >
              跳过
            </button>

            <h1 className={styles.title}>登录 Trip</h1>
            <p className={styles.subTitle}>下一站，就在你的指尖。</p>

            <div className={styles.modeRow}>
              <button
                type="button"
                className={`${styles.modeBtn} ${mode === 'sms' ? styles.modeBtnActive : ''}`}
                onClick={() => setMode('sms')}
              >
                手机号快捷登录
              </button>
              <button
                type="button"
                className={styles.switchTextBtn}
                onClick={() => setMode((prev) => (prev === 'sms' ? 'pwd' : 'sms'))}
              >
                {mode === 'sms' ? '账号密码登录' : '验证码登录'}
              </button>
            </div>

            <div className={styles.inputRow}>
              <select
                className={styles.countrySelect}
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
              >
                {COUNTRY_OPTIONS.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.flag} {item.code}
                  </option>
                ))}
              </select>
              <input
                className={styles.input}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="请输入手机号"
              />
            </div>

            {mode === 'sms' ? (
              <div className={styles.inputRow}>
                <input
                  className={styles.input}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="请输入验证码"
                />
                <button
                  type="button"
                  className={styles.codeBtn}
                  onClick={sendCode}
                  disabled={countdown > 0}
                >
                  {countdown > 0 ? `${countdown}s` : '获取验证码'}
                </button>
              </div>
            ) : (
              <div className={styles.inputRow}>
                <input
                  className={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入账号密码"
                  type="password"
                />
              </div>
            )}

            <button type="button" className={styles.primaryBtn} onClick={onSubmit}>
              手机号一键登录
            </button>

            <div className={styles.socialRow}>
              <button type="button" className={styles.socialBtn}>微信</button>
              <button type="button" className={styles.socialBtn}>抖音</button>
              <button type="button" className={styles.socialBtn}>手机号</button>
            </div>

            <label className={styles.protocolRow}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <span>
                登录即视为同意《服务协议》与《隐私政策》
              </span>
            </label>
          </section>

          <button
            type="button"
            className={styles.guestBtn}
            onClick={() => navigate('/home')}
          >
            先逛逛看（游客模式）
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login