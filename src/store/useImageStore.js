import {
  create
} from 'zustand'
import {
  getImages
} from '../api/home'

export const useImageStore = create((set, get) => ({
  leftImages: [],
  rightImages: [],
  leftHeight: 0,
  rightHeight: 0,
  page: 1,
  loading: false,
  reset: () =>
    set({
      leftImages: [],
      rightImages: [],
      leftHeight: 0,
      rightHeight: 0,
      page: 1,
      loading: false
    }),
  refresh: async () => {
    // 允许刷新打断“加载更多”，直接回到第一页
    set({
      leftImages: [],
      rightImages: [],
      leftHeight: 0,
      rightHeight: 0,
      page: 1,
      loading: true
    })

    const res = await getImages(1)
    const newImages = res.data

    set((state) => {
      const leftImages = []
      const rightImages = []
      let leftHeight = 0
      let rightHeight = 0

      for (const img of newImages) {
        const h = Number(img?.height) || 0
        if (leftHeight <= rightHeight) {
          leftImages.push(img)
          leftHeight += h
        } else {
          rightImages.push(img)
          rightHeight += h
        }
      }

      return {
        ...state,
        leftImages,
        rightImages,
        leftHeight,
        rightHeight,
        page: 2,
        loading: false
      }
    })
  },
  fetchMore: async () => {
    // 如果还在请求中，不再发起新的请求
    if (get().loading) return;
    set({ loading: true }); // 请求中
    const res = await getImages(get().page)
    console.log(res);
    const newImages = res.data

    set((state) => {
      const leftImages = [...state.leftImages]
      const rightImages = [...state.rightImages]
      let leftHeight = state.leftHeight
      let rightHeight = state.rightHeight

      for (const img of newImages) {
        const h = Number(img?.height) || 0
        if (leftHeight <= rightHeight) {
          leftImages.push(img)
          leftHeight += h
        } else {
          rightImages.push(img)
          rightHeight += h
        }
      }

      return {
        leftImages,
        rightImages,
        leftHeight,
        rightHeight,
        page: state.page + 1,
        loading: false
      }
    })
  }
}))