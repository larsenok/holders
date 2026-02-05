import React, { useEffect, useMemo } from 'react'
import './IdleAnimation.css'
import { spriteAnimations } from '../../data/spriteAnimation'

type Props = {
  animKey: string
  style?: React.CSSProperties
  showTestBorder?: boolean
}

const IdleAnimation: React.FC<Props> = ({ animKey, style, showTestBorder = false }) => {
  const config = spriteAnimations.find(a => a.key === animKey)

  const frameCount = config?.frames ?? 0
  const frameWidth = config?.width ?? 0
  const frameHeight = config?.height ?? 0
  const totalWidth = frameCount * frameWidth

  const viewWidth = config?.viewWidth ?? frameWidth
  const offsetX = Math.floor((frameWidth - viewWidth) / 2)

  const cropTop = config?.cropTop ?? 0
  const cropBottom = config?.cropBottom ?? 0

  const viewHeight = config?.viewHeight ?? frameHeight - cropTop - cropBottom
  const offsetY = Math.floor(
    cropTop + (frameHeight - cropTop - cropBottom - viewHeight) / 2,
  )

  const animationName = `spriteAnim-${animKey}`

  const randomDelay = useMemo(() => {
    const min = 0.025
    const max = 0.75
    return +(Math.random() * (max - min) + min).toFixed(3)
  }, [])

  useEffect(() => {
    if (!config) return

    let styleSheet: CSSStyleSheet | undefined =
      document.styleSheets[0] as CSSStyleSheet | undefined

    if (!styleSheet) {
      const el = document.createElement('style')
      document.head.appendChild(el)
      styleSheet = el.sheet as CSSStyleSheet
    }

    const rule = `
      @keyframes ${animationName} {
        100% { background-position: -${offsetX + totalWidth}px -${offsetY}px; }
      }
    `

    const exists = Array.from(styleSheet.cssRules).some(
      r => r instanceof CSSKeyframesRule && r.name === animationName
    )

    if (!exists) {
      styleSheet.insertRule(rule, styleSheet.cssRules.length)
    }
  }, [animationName, totalWidth, offsetY, config])

  if (!config) return null

  const combinedStyle: React.CSSProperties = {
    ...style,
    width: `${viewWidth}px`,
    height: `${viewHeight}px`,
    backgroundImage: `url(${config.src})`,
    backgroundSize: `${totalWidth}px auto`,
    backgroundPosition: `-${offsetX}px -${offsetY}px`,
    animationName,
    animationDuration: '0.8s',
    animationTimingFunction: `steps(${frameCount})`,
    animationIterationCount: 'infinite',
    animationDelay: `${randomDelay}s`,
    imageRendering: 'pixelated',
    outline: showTestBorder ? '1px dashed lime' : '',
  }

  return <div className="idle-animation" style={combinedStyle} />
}

export default IdleAnimation
