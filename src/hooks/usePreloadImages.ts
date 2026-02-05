import { useEffect } from 'react'

export function usePreloadImages(srcs: string[]) {
  useEffect(() => {
    const images: HTMLImageElement[] = srcs.map(src => {
      const img = new Image()
      img.src = src
      return img
    })
    return () => {
      images.forEach(img => {
        img.src = ''
      })
    }
  }, [srcs])
}