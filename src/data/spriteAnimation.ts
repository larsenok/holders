export type SpriteAnim = {
  key: string
  src: string
  width: number
  height: number;
  frames: number;
  viewWidth?: number
  viewHeight?: number
  cropTop?: number
  cropBottom?: number 
}

export const spriteAnimations: SpriteAnim[] = [
  {
    key: 'hero_idle_0',
    src: '/assets/anim/crusader_idle_0.png',
    width: 112,
    height: 96,
    frames: 6
  },
  {
    key: 'hero_idle_1',
    src: '/assets/anim/crusader_idle_1.png',
    width: 112,
    height: 96,
    frames: 6
  },  
  {
    key: 'hero_idle_2',
    src: '/assets/anim/crusader_idle_2.png',
    width: 112,
    height: 96,
    frames: 6
  },
  {
    key: 'hero_idle_3',
    src: '/assets/anim/crusader_idle_3.png',
    width: 112,
    height: 96,
    frames: 6
  },
  {
    key: 'candle_0',
    src: '/assets/anim/flames.gif',
    width: 64,
    height: 48,
    frames: 4
  },
  {
    key: 'hero_knight_idle_0',
    src: '/assets/anim/knight_idle_0.png',
    width: 42,
    height: 42,
    frames: 4
  },
  {
    key: 'hero_samurai_idle_0',
    src: '/assets/anim/samurai_idle_0.png',
    width: 200,
    height: 200,
    frames: 8,
    viewWidth: 80,
    viewHeight: 80,
    cropTop: 0,
    cropBottom: 20
  },
  {
    key: 'hero_warrior_0',
    src: '/assets/anim/warrior_idle_0.png',
    width: 162,
    height: 162,
    frames: 10,
    viewWidth: 70,
    viewHeight: 70
  },
  {
    key: 'hero_wizard_0',
    src: '/assets/anim/wizard_idle_0.png',
    width: 231,
    height: 190,
    frames: 6,
    viewWidth: 100,
    viewHeight: 100
  },
  {
    key: 'hero_warrior_1',
    src: '/assets/anim/warrior_idle_1.png',
    width: 135,
    height: 135,
    frames: 10,
    viewWidth: 80,
    viewHeight: 80
  },
  {
    key: 'hero_huntress_0',
    src: '/assets/anim/huntress_idle_0.png',
    width: 150,
    height: 150,
    frames: 8,
    viewWidth: 80,
    viewHeight: 80
  },
  {
    key: 'hero_knight_1',
    src: '/assets/anim/knight_idle_1.png',
    width: 140,
    height: 140,
    frames: 11,
    viewWidth: 60,
    viewHeight: 60
  }
]
