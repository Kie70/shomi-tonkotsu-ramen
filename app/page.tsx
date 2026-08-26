'use client';

/* eslint-disable @next/next/no-img-element */

import { CSSProperties, useEffect, useRef, useState } from 'react';

type FrameKind = 'wide' | 'action' | 'close';
type BodyState = { fullness: number; warmth: number; thirst: number };
type TastingFrame = {
  id: string;
  image: string;
  mobileImage: string;
  alt: string;
  kind: FrameKind;
  kicker: string;
  copy: string;
  remaining: number;
  state: BodyState;
  desktopFocus: string;
  mobileFocus: string;
};

type TransitionMode = 'shoji' | 'washi';
type FrameSlot = { frameIndex: number | null; ready: boolean; loading: boolean; token: number };
type RunningTransition = {
  token: number;
  fromSlot: number;
  toSlot: number;
  fromIndex: number;
  toIndex: number;
  finish: () => void;
  timer: number;
};

const assetPath = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${path}`;
const state = (fullness: number, warmth: number, thirst: number): BodyState => ({ fullness, warmth, thirst });

const frames: TastingFrame[] = [
  {
    id: '00', image: assetPath('/images/ramen-100.webp'), mobileImage: assetPath('/images/ramen-100-mobile.webp'), alt: '晨光木屋中，一碗完整豚骨拉面，筷子停在汤面上方', kind: 'wide', kicker: '未动筷 · 香气',
    copy: '先别急着动筷。汤面并不平静，细小的脂泡挨在一起，像一层刚落下的雾。热气里先是葱的青辛，随后才浮出猪骨久炊后的气息——不清淡，却也没有直冲鼻腔的腥臊，更像肉汤在锅边熬久以后留下的、微甜而厚的香。',
    remaining: 100, state: state(0, 1, 0), desktopFocus: '50% 53%', mobileFocus: '63% 50%',
  },
  {
    id: '01', image: assetPath('/images/ramen-01.webp'), mobileImage: assetPath('/images/ramen-01-mobile.webp'), alt: '筷子伸入豚骨汤中拨开面条', kind: 'action', kicker: '探入 · 触感',
    copy: '筷子探进碗里，阻力比清汤面更明显。面条从乳白色的汤里分开时，表面已经挂住一层薄薄的脂与胶质。还没有入口，指尖便能从筷子上传来一点沉甸甸的感觉。',
    remaining: 100, state: state(0, 1, 0), desktopFocus: '52% 53%', mobileFocus: '65% 50%',
  },
  {
    id: '02', image: assetPath('/images/ramen-02.webp'), mobileImage: assetPath('/images/ramen-02-mobile.webp'), alt: '第一束细面被筷子提起，汤汁滴回碗中', kind: 'action', kicker: '提起 · 挂汤',
    copy: '第一束面离开汤面，汤汁没有立刻滑落，而是沿着面身缓慢聚成小滴。葱香跟着热气往上走，猪骨的气味则留得更低、更沉，像是贴着碗沿慢慢靠近。',
    remaining: 100, state: state(0, 1, 0), desktopFocus: '55% 50%', mobileFocus: '68% 48%',
  },
  {
    id: '03', image: assetPath('/images/ramen-03.webp'), mobileImage: assetPath('/images/ramen-03-mobile.webp'), alt: '挂着浓汤的细面向第一人称镜头靠近', kind: 'close', kicker: '第一口 · 汤先到',
    copy: '面入口时，最先碰到舌头的不是麦香，而是汤。它滑、热，带一点近似奶油的稠，却没有真正的奶味。紧接着，盐味和酱油的边缘浮出来，把原本圆润的猪骨甜鲜轻轻收紧。',
    remaining: 100, state: state(0, 1, 0), desktopFocus: '67% 48%', mobileFocus: '72% 45%',
  },
  {
    id: '04', image: assetPath('/images/ramen-75.webp'), mobileImage: assetPath('/images/ramen-75-mobile.webp'), alt: '回到广角，豚骨拉面吃过第一口后剩余四分之三', kind: 'wide', kicker: '一口之后 · 面',
    copy: '细面咬下去很利落，并不是夸张的弹，而是在齿间短短地断开。麦香只露出一瞬，就又被骨汤包了回去。咽下以后，嘴唇上留下极薄的一层油润，喉咙却没有想象中沉；这碗汤浓，但还没有失去分寸。',
    remaining: 75, state: state(1, 2, 1), desktopFocus: '50% 53%', mobileFocus: '63% 50%',
  },
  {
    id: '05', image: assetPath('/images/ramen-05.webp'), mobileImage: assetPath('/images/ramen-05-mobile.webp'), alt: '筷子转向并夹住一半溏心蛋', kind: 'action', kicker: '转筷 · 蛋白',
    copy: '筷尖碰到蛋白时，外层有一点柔软的弹性。浸过酱汁的颜色只停在表面，入口先是淡淡的酱油咸香，随后才出现味醂似的温甜。它没有汤那么张扬，却把下一层味道安静地铺好了。',
    remaining: 75, state: state(1, 2, 1), desktopFocus: '54% 53%', mobileFocus: '68% 50%',
  },
  {
    id: '06', image: assetPath('/images/ramen-06.webp'), mobileImage: assetPath('/images/ramen-06-mobile.webp'), alt: '溏心蛋被提至碗上方，蛋黄和汤汁清晰可见', kind: 'close', kicker: '特写 · 蛋黄',
    copy: '切开的蛋黄没有流淌，而是停在将凝未凝的状态，像一小团稠软的酱。它看起来比汤更浓，真正入口时却更温和：蛋黄贴上舌面，慢慢化开，把骨汤里锋利的盐味磨圆了一圈。',
    remaining: 75, state: state(1, 2, 1), desktopFocus: '68% 48%', mobileFocus: '72% 45%',
  },
  {
    id: '07', image: assetPath('/images/ramen-07.webp'), mobileImage: assetPath('/images/ramen-07-mobile.webp'), alt: '溏心蛋向第一人称镜头靠近', kind: 'close', kicker: '入口 · 绵厚',
    copy: '这一口的厚，与刚才的汤并不相同。汤的厚来自脂与胶质铺开的包裹感；蛋黄的厚则更绵、更慢。葱的辛香被暂时压低，藏在猪骨深处的那点甘味，反而清楚起来。',
    remaining: 75, state: state(1, 2, 1), desktopFocus: '70% 47%', mobileFocus: '74% 44%',
  },
  {
    id: '08', image: assetPath('/images/ramen-50.webp'), mobileImage: assetPath('/images/ramen-50-mobile.webp'), alt: '回到广角，碗中拉面剩下一半', kind: 'wide', kicker: '半碗 · 余味',
    copy: '再喝一口，蛋黄已经有一小部分散进汤里。汤色似乎暖了一点，口感也更软，但余味同时被拉长：鲜味停在舌根，咸味留在舌侧，嘴里像仍含着一口没有完全咽下去的汤。',
    remaining: 50, state: state(2, 3, 2), desktopFocus: '50% 53%', mobileFocus: '63% 50%',
  },
  {
    id: '09', image: assetPath('/images/ramen-09.webp'), mobileImage: assetPath('/images/ramen-09-mobile.webp'), alt: '筷子伸入半碗拉面中夹住叉烧', kind: 'action', kicker: '夹取 · 叉烧',
    copy: '叉烧已经在热汤里泡了半程。原本白色的脂肪变得微微透明，瘦肉的纹理也被汤浸松。筷子刚夹住边缘，肉便顺着纤维弯下去，不需要用力。',
    remaining: 50, state: state(2, 3, 2), desktopFocus: '58% 54%', mobileFocus: '70% 50%',
  },
  {
    id: '10', image: assetPath('/images/ramen-10.webp'), mobileImage: assetPath('/images/ramen-10-mobile.webp'), alt: '叉烧被提起，脂肪与肉纤维形成特写', kind: 'close', kicker: '特写 · 肉与脂',
    copy: '先化开的是脂，带着卤汁里酱油和糖的温甜；随后才轮到瘦肉。它柔软，却没有软到失去肉感，细小的纤维在齿间散开，把一股比骨汤更直接的猪肉香留在口中。',
    remaining: 50, state: state(2, 3, 2), desktopFocus: '68% 50%', mobileFocus: '73% 47%',
  },
  {
    id: '11', image: assetPath('/images/ramen-11.webp'), mobileImage: assetPath('/images/ramen-11-mobile.webp'), alt: '柔软叉烧向第一人称镜头靠近', kind: 'close', kicker: '入口 · 肉香',
    copy: '叉烧让整碗面的肉味又深了一层。就在浓厚快要挤满舌面的时候，木耳在下一次咀嚼里清脆地断开，葱花也留下一点青凉。两种很轻的味道，短短地把口腔擦净了一次。',
    remaining: 50, state: state(2, 3, 2), desktopFocus: '70% 48%', mobileFocus: '75% 45%',
  },
  {
    id: '12', image: assetPath('/images/ramen-25.webp'), mobileImage: assetPath('/images/ramen-25-mobile.webp'), alt: '回到广角，碗中只剩四分之一拉面', kind: 'wide', kicker: '碗底 · 集中',
    copy: '吃到这里，面已经比第一口软了一些，也吸进了更多汤。碗底的味道开始集中：盐、骨香、脂香和卤肉的甜不再一层层出现，而是挨得很近。额头有一点热，嘴唇的油润更明显，饱意也终于有了重量。',
    remaining: 25, state: state(3, 4, 3), desktopFocus: '50% 53%', mobileFocus: '63% 50%',
  },
  {
    id: '13', image: assetPath('/images/ramen-13.webp'), mobileImage: assetPath('/images/ramen-13-mobile.webp'), alt: '最后一束挂着浓汤的细面向第一人称镜头靠近', kind: 'close', kicker: '最后一束 · 浓处',
    copy: '最后一束面从变浅的汤里提起来，挂住的却是整碗里最浓的一层。入口比第一口更咸，也更香；蒜与葱已经退到后面，只剩猪骨的甜鲜、酱汁的咸和一点藏得很深的微苦，在舌根处慢慢合到一起。',
    remaining: 25, state: state(3, 4, 3), desktopFocus: '69% 48%', mobileFocus: '73% 45%',
  },
  {
    id: '14', image: assetPath('/images/ramen-0.webp'), mobileImage: assetPath('/images/ramen-0-mobile.webp'), alt: '汤面已经吃完，空碗里只留汤痕，筷子放在碗沿', kind: 'wide', kicker: '碗空 · 身体记得',
    copy: '碗空了以后，味道并没有立刻结束。嘴唇仍留着一层很薄的油膜，鼻息里是温热的猪骨香，舌侧还压着盐味。胃里是沉稳的暖，不到撑，却足够让人坐慢一点。此刻最想要的，是一口很冷、没有味道的水。',
    remaining: 0, state: state(4, 4, 4), desktopFocus: '50% 53%', mobileFocus: '63% 50%',
  },
];

export default function Home() {
  const figureRef = useRef<HTMLElement>(null);
  const frameRefs = useRef<Array<HTMLImageElement | null>>([]);
  const seamRef = useRef<HTMLDivElement>(null);
  const transitionModeRef = useRef<TransitionMode>('shoji');
  const navigateRef = useRef<(direction: -1 | 1) => void>(() => undefined);
  const resetRef = useRef<() => void>(() => undefined);
  const aftertasteRef = useRef(false);
  const gestureRef = useRef({ active: false, pointerId: -1, x: 0, y: 0 });
  const wheelLockRef = useRef(0);
  const [activeFrameIndex, setActiveFrameIndex] = useState(0);
  const [showAftertaste, setShowAftertaste] = useState(false);
  const [transitionMode, setTransitionMode] = useState<TransitionMode>('shoji');

  useEffect(() => {
    const readMode = () => {
      const value = new URLSearchParams(window.location.search).get('transition');
      const mode: TransitionMode = value === 'washi' ? 'washi' : 'shoji';
      transitionModeRef.current = mode;
      setTransitionMode(mode);
    };
    readMode();
    window.addEventListener('popstate', readMode);
    return () => window.removeEventListener('popstate', readMode);
  }, []);

  useEffect(() => {
    const images = frameRefs.current;
    const figure = figureRef.current;
    const seam = seamRef.current;
    if (images.length !== 3 || images.some((image) => !image) || !figure || !seam) return;
    const stageFigure = figure;
    const frameSeam = seam;

    let destroyed = false;
    let transitionToken = 0;
    let currentSlot = 0;
    let committedIndex = 0;
    let desiredIndex = 0;
    let running: RunningTransition | null = null;
    const slots: FrameSlot[] = [0, 1, 2].map(() => ({ frameIndex: null, ready: false, loading: false, token: 0 }));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const useMobileImages = window.matchMedia('(max-width: 640px)').matches;
    const sourceForFrame = (index: number) => useMobileImages ? frames[index].mobileImage : frames[index].image;

    const baseClass = 'ramen-frame-buffer';
    const resetSeam = () => { frameSeam.className = 'frame-seam'; };
    const setCurrentVisual = (slot: number) => {
      images.forEach((image, index) => {
        if (!image) return;
        image.className = index === slot ? `${baseClass} is-current` : baseClass;
      });
      resetSeam();
    };
    const applyFrame = (image: HTMLImageElement, index: number) => {
      image.style.setProperty('--desktop-focus', frames[index].desktopFocus);
      image.style.setProperty('--mobile-focus', frames[index].mobileFocus);
      image.dataset.frame = frames[index].id;
      image.removeAttribute('srcset');
      image.removeAttribute('sizes');
    };
    const findSlot = (index: number) => slots.findIndex((slot) => slot.frameIndex === index);
    const sleep = (milliseconds: number) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));

    const pickDisposableSlot = (targetIndex: number) => {
      const blocked = new Set<number>([currentSlot]);
      if (running) {
        blocked.add(running.fromSlot);
        blocked.add(running.toSlot);
      }
      const candidates = slots
        .map((slot, index) => ({ slot, index }))
        .filter(({ index }) => !blocked.has(index));
      candidates.sort((a, b) => {
        const aDistance = a.slot.frameIndex === null ? Number.POSITIVE_INFINITY : Math.abs(a.slot.frameIndex - targetIndex);
        const bDistance = b.slot.frameIndex === null ? Number.POSITIVE_INFINITY : Math.abs(b.slot.frameIndex - targetIndex);
        return bDistance - aDistance;
      });
      return candidates[0]?.index ?? -1;
    };

    const prepareNeighbors = () => {
      if (destroyed || running) return;
      const targets = committedIndex === 0
        ? [1, 2]
        : committedIndex === frames.length - 1
          ? [frames.length - 2, frames.length - 3]
          : [committedIndex - 1, committedIndex + 1];
      targets.forEach((target) => {
        if (target >= 0 && target < frames.length && findSlot(target) < 0) assignSlot(target);
      });
    };

    const promoteInstantly = (slot: number, index: number) => {
      transitionToken += 1;
      if (running) {
        window.clearTimeout(running.timer);
        images[running.toSlot]?.removeEventListener('animationend', running.finish);
      }
      running = null;
      currentSlot = slot;
      committedIndex = index;
      setCurrentVisual(slot);
      setActiveFrameIndex(index);
      if (desiredIndex !== committedIndex) requestFrame(desiredIndex);
      else prepareNeighbors();
    };

    const cancelTransition = () => {
      if (!running) return;
      transitionToken += 1;
      window.clearTimeout(running.timer);
      images[running.toSlot]?.removeEventListener('animationend', running.finish);
      currentSlot = running.fromSlot;
      committedIndex = running.fromIndex;
      running = null;
      setCurrentVisual(currentSlot);
      setActiveFrameIndex(committedIndex);
      prepareNeighbors();
    };

    const startTransition = (slot: number, index: number) => {
      if (destroyed || running || index !== desiredIndex || slot === currentSlot || !slots[slot].ready) return;
      const distance = Math.abs(index - committedIndex);
      if (reducedMotion.matches || distance > 1) {
        promoteInstantly(slot, index);
        return;
      }

      const fromSlot = currentSlot;
      const fromIndex = committedIndex;
      const toImage = images[slot];
      const fromImage = images[fromSlot];
      if (!toImage || !fromImage) return;
      const direction = index > committedIndex ? 'forward' : 'reverse';
      const mode = transitionModeRef.current;
      const duration = mode === 'shoji' ? 160 : 220;
      const token = ++transitionToken;
      const shared = `${baseClass} is-transitioning transition-${mode} direction-${direction}`;

      fromImage.className = `${shared} is-outgoing`;
      toImage.className = `${shared} is-incoming`;
      frameSeam.className = `frame-seam transition-${mode} direction-${direction}`;
      void toImage.offsetWidth;

      const finish = () => {
        if (destroyed || !running || running.token !== token) return;
        window.clearTimeout(running.timer);
        toImage.removeEventListener('animationend', finish);
        running = null;
        currentSlot = slot;
        committedIndex = index;
        setCurrentVisual(slot);
        setActiveFrameIndex(index);
        if (desiredIndex !== committedIndex) requestFrame(desiredIndex);
        else prepareNeighbors();
      };

      toImage.addEventListener('animationend', finish);
      const timer = window.setTimeout(finish, duration + 120);
      running = { token, fromSlot, toSlot: slot, fromIndex, toIndex: index, finish, timer };
      requestAnimationFrame(() => {
        if (!running || running.token !== token) return;
        fromImage.classList.add('is-running');
        toImage.classList.add('is-running');
        frameSeam.classList.add('is-running');
      });
    };

    async function decodeSlot(slotIndex: number, frameIndex: number, token: number) {
      const image = images[slotIndex];
      if (!image) return;
      let decoded = false;
      for (let attempt = 0; attempt < 2 && !decoded; attempt += 1) {
        if (attempt === 1) {
          await sleep(360);
          if (destroyed || slots[slotIndex].token !== token) return;
          image.src = `${sourceForFrame(frameIndex)}?decode-retry=1`;
        }
        try {
          await image.decode();
          decoded = true;
        } catch {
          decoded = false;
        }
      }
      if (destroyed || slots[slotIndex].token !== token) return;
      slots[slotIndex].loading = false;
      slots[slotIndex].ready = decoded;
      if (!decoded) {
        slots[slotIndex].frameIndex = null;
        image.removeAttribute('src');
        image.className = baseClass;
        return;
      }
      if (frameIndex === 0) stageFigure.classList.add('is-ready');
      if (frameIndex === desiredIndex && slotIndex !== currentSlot && !running) startTransition(slotIndex, frameIndex);
      if (slotIndex === currentSlot) prepareNeighbors();
    }

    function assignSlot(frameIndex: number, preferredSlot?: number) {
      if (destroyed || frameIndex < 0 || frameIndex >= frames.length) return;
      const existing = findSlot(frameIndex);
      if (existing >= 0) {
        if (slots[existing].ready && frameIndex === desiredIndex && existing !== currentSlot && !running) startTransition(existing, frameIndex);
        return;
      }
      const slotIndex = preferredSlot ?? pickDisposableSlot(frameIndex);
      if (slotIndex < 0 || slotIndex === currentSlot) return;
      const image = images[slotIndex];
      if (!image) return;
      const token = slots[slotIndex].token + 1;
      slots[slotIndex] = { frameIndex, ready: false, loading: true, token };
      image.className = baseClass;
      applyFrame(image, frameIndex);
      image.src = sourceForFrame(frameIndex);
      void decodeSlot(slotIndex, frameIndex, token);
    }

    function requestFrame(index: number) {
      desiredIndex = index;
      if (running) {
        if (index === running.fromIndex) {
          cancelTransition();
          return;
        }
        if (index !== running.toIndex) assignSlot(index);
        return;
      }
      if (index === committedIndex) return;
      const slot = findSlot(index);
      if (slot >= 0) {
        if (slots[slot].ready) startTransition(slot, index);
        else if (!slots[slot].loading) assignSlot(index, slot);
        return;
      }
      assignSlot(index);
    }

    const prefetchRemaining = async () => {
      const queue = frames.slice(3).map((_, index) => sourceForFrame(index + 3));
      let cursor = 0;
      const worker = async () => {
        while (!destroyed && cursor < queue.length) {
          const source = queue[cursor];
          cursor += 1;
          try {
            const response = await fetch(source, { cache: 'force-cache' });
            if (response.ok) await response.blob();
          } catch {
            // The visible buffer performs its own retry when this frame is requested.
          }
        }
      };
      await Promise.all([worker(), worker()]);
    };

    navigateRef.current = (direction) => {
      if (aftertasteRef.current) {
        if (direction === -1) {
          aftertasteRef.current = false;
          setShowAftertaste(false);
        }
        return;
      }

      const origin = running?.toIndex ?? desiredIndex;
      if (direction === 1 && origin >= frames.length - 1) {
        if (!running && committedIndex === frames.length - 1) {
          aftertasteRef.current = true;
          setShowAftertaste(true);
        }
        return;
      }
      if (direction === -1 && origin <= 0) return;
      requestFrame(Math.min(frames.length - 1, Math.max(0, origin + direction)));
    };

    resetRef.current = () => {
      aftertasteRef.current = false;
      setShowAftertaste(false);
      requestFrame(0);
    };

    images.forEach((image) => { if (image) image.className = baseClass; });
    setCurrentVisual(0);
    slots[0] = { frameIndex: 0, ready: false, loading: true, token: 1 };
    applyFrame(images[0]!, 0);
    void decodeSlot(0, 0, 1);
    assignSlot(1, 1);
    assignSlot(2, 2);
    const prefetchTimer = window.setTimeout(() => { void prefetchRemaining(); }, 800);

    return () => {
      destroyed = true;
      window.clearTimeout(prefetchTimer);
      navigateRef.current = () => undefined;
      resetRef.current = () => undefined;
      if (running) {
        window.clearTimeout(running.timer);
        images[running.toSlot]?.removeEventListener('animationend', running.finish);
      }
    };
  }, []);

  const active = frames[activeFrameIndex];
  const figureStyle = {
    '--lqip-image': `url("${assetPath('/images/ramen-100-lqip.webp')}")`,
    '--frame-backdrop-desktop': `url("${active.image}")`,
    '--frame-backdrop-mobile': `url("${active.mobileImage}")`,
  } as CSSProperties;
  const selectTransitionMode = (mode: TransitionMode) => {
    transitionModeRef.current = mode;
    setTransitionMode(mode);
    const url = new URL(window.location.href);
    url.searchParams.set('transition', mode);
    window.history.replaceState(null, '', url);
  };
  const navigate = (direction: -1 | 1) => navigateRef.current(direction);
  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (!event.isPrimary || event.button !== 0 || (event.target as Element).closest('button, a')) return;
    gestureRef.current = { active: true, pointerId: event.pointerId, x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerUp = (event: React.PointerEvent<HTMLElement>) => {
    const gesture = gestureRef.current;
    if (!gesture.active || gesture.pointerId !== event.pointerId) return;
    gestureRef.current.active = false;
    const distanceX = event.clientX - gesture.x;
    const distanceY = event.clientY - gesture.y;
    if (Math.abs(distanceX) >= 42 && Math.abs(distanceX) > Math.abs(distanceY) * 1.15) {
      navigate(distanceX < 0 ? 1 : -1);
    }
  };
  const onWheel = (event: React.WheelEvent<HTMLElement>) => {
    const horizontalDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY) * 0.7
      ? event.deltaX
      : event.shiftKey
        ? event.deltaY
        : 0;
    if (Math.abs(horizontalDelta) < 18 || Date.now() < wheelLockRef.current) return;
    wheelLockRef.current = Date.now() + 320;
    navigate(horizontalDelta > 0 ? 1 : -1);
  };

  return (
    <main className="tasting-page">
      <div className="scroll-track" id="top">
        <section
          className="tasting-stage"
          aria-label="赏味豚骨拉面横向品尝体验"
          data-aftertaste={showAftertaste ? 'true' : 'false'}
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'ArrowRight') navigate(1);
            if (event.key === 'ArrowLeft') navigate(-1);
          }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => { gestureRef.current.active = false; }}
          onWheel={onWheel}
        >
          <header className="site-header">
            <a className="brand" href="#top" aria-label="赏味首页" onClick={() => resetRef.current()}>
              <span className="brand-mark">味</span><span>赏味</span><small>SHŌMI</small>
            </a>
            <div className="transition-switch" role="group" aria-label="切换图片动效">
              <button type="button" aria-pressed={transitionMode === 'shoji'} onClick={() => selectTransitionMode('shoji')}>障子</button>
              <i aria-hidden="true" />
              <button type="button" aria-pressed={transitionMode === 'washi'} onClick={() => selectTransitionMode('washi')}>和纸</button>
            </div>
            <p className="dish-counter"><span>第一席</span> / 豚骨</p>
          </header>

          <div className="dish-heading" aria-hidden={showAftertaste}>
            <p>第一席 · 温暖的浓汤</p>
            <h1 id="dish-title">豚骨拉面</h1>
            <span lang="ja">とんこつラーメン</span>
          </div>

          <figure className="ramen-figure" aria-label={active.alt} aria-hidden={showAftertaste} ref={figureRef} style={figureStyle} data-active-frame={active.id} data-transition-mode={transitionMode}>
            {[0, 1, 2].map((slot) => (
              <img
                className="ramen-frame-buffer"
                src={slot === 0 ? frames[0].image : undefined}
                srcSet={slot === 0 ? `${frames[0].mobileImage} 768w, ${frames[0].image} 1536w` : undefined}
                sizes={slot === 0 ? '(max-width: 640px) 256px, 100vw' : undefined}
                alt=""
                aria-hidden="true"
                draggable="false"
                decoding="async"
                fetchPriority={slot === 0 ? 'high' : 'auto'}
                key={slot}
                ref={(image) => { frameRefs.current[slot] = image; }}
                data-buffer-slot={slot}
              />
            ))}
            <div className="frame-seam" ref={seamRef} aria-hidden="true" />
          </figure>

          <aside className="thought-bubble" aria-label="食客此刻的感受" aria-hidden={showAftertaste}>
            <div className="thought-layer" key={active.id}>
              <div className="bubble-heading">
                <span className="bubble-kicker">{active.kicker}</span>
                {activeFrameIndex === 0 && (
                  <span className="swipe-cue" aria-hidden="true"><i><b /></i>左右滑动</span>
                )}
              </div>
              <p>{active.copy}</p>
            </div>
            <span className="sr-only" aria-live="polite">{active.copy}</span>
            <BodyStatus frame={active} />
          </aside>

          {showAftertaste && (
            <section className="aftertaste" aria-labelledby="aftertaste-title">
              <p className="section-kicker">余味</p>
              <h2 id="aftertaste-title">汤痕留在碗底。<br />暖意留在身体里。</h2>
              <p className="aftertaste-copy">猪骨的脂香退得很慢。蒜与葱已经散了，盐味还在。此刻最想要的，是一口冷水。</p>
              <div className="next-dish"><span>下一席</span><p>尚在火上。</p></div>
              <button className="taste-again" type="button" onClick={() => resetRef.current()}>再赏一回 <span aria-hidden="true">↺</span></button>
            </section>
          )}
        </section>
      </div>
    </main>
  );
}

function BodyStatus({ frame }: { frame: TastingFrame }) {
  return (
    <aside className="body-status" aria-label="食客当前身体状态">
      <StatusMetric label="饱" value={frame.state.fullness} />
      <StatusMetric label="暖" value={frame.state.warmth} />
      <StatusMetric label="渴" value={frame.state.thirst} />
      <StatusMetric label="残量" value={Math.round(frame.remaining / 25)} />
    </aside>
  );
}

function StatusMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="status-metric">
      <span>{label}</span>
      <i aria-hidden="true">{[1, 2, 3, 4].map((step) => <b className={step <= value ? 'filled' : ''} key={step} />)}</i>
      <em>{value}/4</em>
    </div>
  );
}
