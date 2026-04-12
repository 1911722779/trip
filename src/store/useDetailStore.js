import {
  create
} from 'zustand';
import { getDetail } from '@/api/detail';

const useDetailStore = create((set) => ({
  detail: {
    title: '',
    desc: '',
    images: [
      {
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGQ2DAnuw5QuVhABXr1dUwUBTr2G5vJn7bP0clCNs62pT5PpkYhsiRHWMQIYv3_vCvSHfpKjAN1UsuSTuK9T3zleX2Ik4aadUlQi9TCsX0vQ&s=10',
        alt: ''
      }
    ],
    price: ''
  },
  loading: true,
  setDetail: async () => {
    set({ loading: true });
    const res = await getDetail();
    set({
      loading: false,
      detail: res.data
    });
  }
}))

export default useDetailStore