export const LOGIN_FLAG_KEY = 'trip_login_status'

export const isLoggedIn = () => {
  return localStorage.getItem(LOGIN_FLAG_KEY) === '1'
}

export const markLoggedIn = () => {
  localStorage.setItem(LOGIN_FLAG_KEY, '1')
}

export const requireLogin = (navigate, redirectPath = '/home') => {
  if (isLoggedIn()) return true
  navigate('/login', { state: { redirect: redirectPath } })
  return false
}
