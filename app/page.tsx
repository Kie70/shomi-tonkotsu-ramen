'use client';

import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';

type FrameKind = 'wide' | 'action' | 'close';
type BodyState = { fullness: number; warmth: number; thirst: number };
type TastingFrame = {
  id: string;
  image: string;
  alt: string;
  kind: FrameKind;
  kicker: string;
  copy: string;
  remaining: number;
  state: BodyState;
  desktopFocus: string;
  mobileFocus: string;
};

const state = (fullness: number, warmth: number, thirst: number): BodyState => ({ fullness, warmth, thirst });

const frames: TastingFrame[] = [
  {
    id: '00', image: '/images/ramen-100.webp', alt: '晨光木屋中，一碗完整豚骨拉面，筷子停在汤面上方', kind: 'wide', kicker: '未动筷 · 香气',
    copy: '先别急着动筷。汤面并不平静，细小的脂泡挨在一起，像一层刚落下的雾。热气里先是葱的青辛，随后才浮出猪骨久炊后的气息——不清淡，却也没有直冲鼻腔的腥臊，更像肉汤在锅边熬久以后留下的、微甜而厚的香。',
    remaining: 100, state: state(0, 1, 0), desktopFocus: '50% 53%', mobileFocus: '63% 50%',
  },
  {
    id: '01', image: '/images/ramen-01.webp', alt: '筷子伸入豚骨汤中拨开面条', kind: 'action', kicker: '探入 · 触感',
    copy: '筷子探进碗里，阻力比清汤面更明显。面条从乳白色的汤里分开时，表面已经挂住一层薄薄的脂与胶质。还没有入口，指尖便能从筷子上传来一点沉甸甸的感觉。',
    remaining: 100, state: state(0, 1, 0), desktopFocus: '52% 53%', mobileFocus: '65% 50%',
  },
  {
    id: '02', image: '/images/ramen-02.webp', alt: '第一束细面被筷子提起，汤汁滴回碗中', kind: 'action', kicker: '提起 · 挂汤',
    copy: '第一束面离开汤面，汤汁没有立刻滑落，而是沿着面身缓慢聚成小滴。葱香跟着热气往上走，猪骨的气味则留得更低、更沉，像是贴着碗沿慢慢靠近。',
    remaining: 100, state: state(0, 1, 0), desktopFocus: '55% 50%', mobileFocus: '68% 48%',
  },
  {
    id: '03', image: '/images/ramen-03.webp', alt: '挂着浓汤的细面向第一人称镜头靠近', kind: 'close', kicker: '第一口 · 汤先到',
    copy: '面入口时，最先碰到舌头的不是麦香，而是汤。它滑、热，带一点近似奶油的稠，却没有真正的奶味。紧接着，盐味和酱油的边缘浮出来，把原本圆润的猪骨甜鲜轻轻收紧。',
    remaining: 100, state: state(0, 1, 0), desktopFocus: '67% 48%', mobileFocus: '72% 45%',
  },
  {
    id: '04', image: '/images/ramen-75.webp', alt: '回到广角，豚骨拉面吃过第一口后剩余四分之三', kind: 'wide', kicker: '一口之后 · 面',
    copy: '细面咬下去很利落，并不是夸张的弹，而是在齿间短短地断开。麦香只露出一瞬，就又被骨汤包了回去。咽下以后，嘴唇上留下极薄的一层油润，喉咙却没有想象中沉；这碗汤浓，但还没有失去分寸。',
    remaining: 75, state: state(1, 2, 1), desktopFocus: '50% 53%', mobileFocus: '63% 50%',
  },
  {
    id: '05', image: '/images/ramen-05.webp', alt: '筷子转向并夹住一半溏心蛋', kind: 'action', kicker: '转筷 · 蛋白',
    copy: '筷尖碰到蛋白时，外层有一点柔软的弹性。浸过酱汁的颜色只停在表面，入口先是淡淡的酱油咸香，随后才出现味醂似的温甜。它没有汤那么张扬，却把下一层味道安静地铺好了。',
    remaining: 75, state: state(1, 2, 1), desktopFocus: '54% 53%', mobileFocus: '68% 50%',
  },
  {
    id: '06', image: '/images/ramen-06.webp', alt: '溏心蛋被提至碗上方，蛋黄和汤汁清晰可见', kind: 'close', kicker: '特写 · 蛋黄',
    copy: '切开的蛋黄没有流淌，而是停在将凝未凝的状态，像一小团稠软的酱。它看起来比汤更浓，真正入口时却更温和：蛋黄贴上舌面，慢慢化开，把骨汤里锋利的盐味磨圆了一圈。',
    remaining: 75, state: state(1, 2, 1), desktopFocus: '68% 48%', mobileFocus: '72% 45%',
  },
  {
    id: '07', image: '/images/ramen-07.webp', alt: '溏心蛋向第一人称镜头靠近', kind: 'close', kicker: '入口 · 绵厚',
    copy: '这一口的厚，与刚才的汤并不相同。汤的厚来自脂与胶质铺开的包裹感；蛋黄的厚则更绵、更慢。葱的辛香被暂时压低，藏在猪骨深处的那点甘味，反而清楚起来。',
    remaining: 75, state: state(1, 2, 1), desktopFocus: '70% 47%', mobileFocus: '74% 44%',
  },
  {
    id: '08', image: '/images/ramen-50.webp', alt: '回到广角，碗中拉面剩下一半', kind: 'wide', kicker: '半碗 · 余味',
    copy: '再喝一口，蛋黄已经有一小部分散进汤里。汤色似乎暖了一点，口感也更软，但余味同时被拉长：鲜味停在舌根，咸味留在舌侧，嘴里像仍含着一口没有完全咽下去的汤。',
    remaining: 50, state: state(2, 3, 2), desktopFocus: '50% 53%', mobileFocus: '63% 50%',
  },
  {
    id: '09', image: '/images/ramen-09.webp', alt: '筷子伸入半碗拉面中夹住叉烧', kind: 'action', kicker: '夹取 · 叉烧',
    copy: '叉烧已经在热汤里泡了半程。原本白色的脂肪变得微微透明，瘦肉的纹理也被汤浸松。筷子刚夹住边缘，肉便顺着纤维弯下去，不需要用力。',
    remaining: 50, state: state(2, 3, 2), desktopFocus: '58% 54%', mobileFocus: '70% 50%',
  },
  {
    id: '10', image: '/images/ramen-10.webp', alt: '叉烧被提起，脂肪与肉纤维形成特写', kind: 'close', kicker: '特写 · 肉与脂',
    copy: '先化开的是脂，带着卤汁里酱油和糖的温甜；随后才轮到瘦肉。它柔软，却没有软到失去肉感，细小的纤维在齿间散开，把一股比骨汤更直接的猪肉香留在口中。',
    remaining: 50, state: state(2, 3, 2), desktopFocus: '68% 50%', mobileFocus: '73% 47%',
  },
  {
    id: '11', image: '/images/ramen-11.webp', alt: '柔软叉烧向第一人称镜头靠近', kind: 'close', kicker: '入口 · 肉香',
    copy: '叉烧让整碗面的肉味又深了一层。就在浓厚快要挤满舌面的时候，木耳在下一次咀嚼里清脆地断开，葱花也留下一点青凉。两种很轻的味道，短短地把口腔擦净了一次。',
    remaining: 50, state: state(2, 3, 2), desktopFocus: '70% 48%', mobileFocus: '75% 45%',
  },
  {
    id: '12', image: '/images/ramen-25.webp', alt: '回到广角，碗中只剩四分之一拉面', kind: 'wide', kicker: '碗底 · 集中',
    copy: '吃到这里，面已经比第一口软了一些，也吸进了更多汤。碗底的味道开始集中：盐、骨香、脂香和卤肉的甜不再一层层出现，而是挨得很近。额头有一点热，嘴唇的油润更明显，饱意也终于有了重量。',
    remaining: 25, state: state(3, 4, 3), desktopFocus: '50% 53%', mobileFocus: '63% 50%',
  },
  {
    id: '13', image: '/images/ramen-13.webp', alt: '最后一束挂着浓汤的细面向第一人称镜头靠近', kind: 'close', kicker: '最后一束 · 浓处',
    copy: '最后一束面从变浅的汤里提起来，挂住的却是整碗里最浓的一层。入口比第一口更咸，也更香；蒜与葱已经退到后面，只剩猪骨的甜鲜、酱汁的咸和一点藏得很深的微苦，在舌根处慢慢合到一起。',
    remaining: 25, state: state(3, 4, 3), desktopFocus: '69% 48%', mobileFocus: '73% 45%',
  },
  {
    id: '14', image: '/images/ramen-0.webp', alt: '汤面已经吃完，空碗里只留汤痕，筷子放在碗沿', kind: 'wide', kicker: '碗空 · 身体记得',
    copy: '碗空了以后，味道并没有立刻结束。嘴唇仍留着一层很薄的油膜，鼻息里是温热的猪骨香，舌侧还压着盐味。胃里是沉稳的暖，不到撑，却足够让人坐慢一点。此刻最想要的，是一口很冷、没有味道的水。',
    remaining: 0, state: state(4, 4, 4), desktopFocus: '50% 53%', mobileFocus: '63% 50%',
  },
];

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smoothstep = (value: number) => {
  const x = clamp01(value);
  return x * x * (3 - 2 * x);
};

export default function Home() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set([0]));
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReducedMotion(media.matches);
    updateMotion();
    media.addEventListener('change', updateMotion);
    return () => media.removeEventListener('change', updateMotion);
  }, []);

  useEffect(() => {
    let animationFrame = 0;
    const update = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const total = trackRef.current.offsetHeight - window.innerHeight;
      setProgress(clamp01(-rect.top / Math.max(total, 1)));
    };
    const onScroll = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let idleId = 0;
    const known = new Set<number>([0]);
    const load = (index: number) => {
      if (known.has(index)) return;
      const image = new window.Image();
      image.decoding = 'async';
      image.src = frames[index].image;
      image.onload = () => {
        if (cancelled) return;
        known.add(index);
        setLoaded(new Set(known));
      };
    };
    [1, 2, 3].forEach(load);
    let nextIndex = 4;
    const runIdle = () => {
      if (cancelled || nextIndex >= frames.length) return;
      load(nextIndex);
      nextIndex += 1;
      const idleWindow = window as Window & {
        requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      };
      idleId = idleWindow.requestIdleCallback
        ? idleWindow.requestIdleCallback(runIdle, { timeout: 800 })
        : window.setTimeout(runIdle, 120);
    };
    runIdle();
    return () => {
      cancelled = true;
      const idleWindow = window as Window & { cancelIdleCallback?: (id: number) => void };
      if (idleWindow.cancelIdleCallback) idleWindow.cancelIdleCallback(idleId);
      else window.clearTimeout(idleId);
    };
  }, []);

  const scene = useMemo(() => {
    const raw = progress * (frames.length - 1);
    const base = Math.min(frames.length - 1, Math.floor(raw));
    const next = Math.min(frames.length - 1, base + 1);
    const local = raw - base;
    const fluidBlend = smoothstep((local - 0.18) / 0.64);
    const blend = reducedMotion ? (local >= 0.5 ? 1 : 0) : fluidBlend;
    let from = base;
    while (from > 0 && !loaded.has(from)) from -= 1;
    const canAdvance = loaded.has(base) && loaded.has(next);
    const to = canAdvance ? next : from;
    const visibleBlend = canAdvance ? blend : 0;
    const active = visibleBlend >= 0.5 ? to : from;
    return { from, to, blend: visibleBlend, active };
  }, [progress, reducedMotion, loaded]);

  const current = frames[scene.from];
  const upcoming = frames[scene.to];
  const active = frames[scene.active];
  const bodyFrame = frames[scene.blend >= 0.92 ? scene.to : scene.from];
  const headerFade = clamp01((progress - 0.02) / 0.04);
  const isCloseTransition = upcoming.kind === 'close';
  const trackStyle = { '--track-height': `${100 + (frames.length - 1) * 65}svh` } as CSSProperties;
  const currentStyle = {
    '--desktop-focus': current.desktopFocus,
    '--mobile-focus': current.mobileFocus,
    opacity: 1 - scene.blend,
    transform: `scale(${1 + scene.blend * 0.012})`,
    filter: isCloseTransition ? `blur(${scene.blend * 1.2}px)` : undefined,
  } as CSSProperties;
  const upcomingStyle = {
    '--desktop-focus': upcoming.desktopFocus,
    '--mobile-focus': upcoming.mobileFocus,
    opacity: scene.blend,
    transform: `scale(${isCloseTransition ? 1.025 - scene.blend * 0.025 : 1})`,
  } as CSSProperties;

  return (
    <main className="tasting-page">
      <div className="scroll-track" ref={trackRef} id="top" style={trackStyle}>
        <section className="tasting-stage" aria-labelledby="dish-title">
          <header className="site-header" style={{ opacity: 1 - headerFade, pointerEvents: headerFade > 0.95 ? 'none' : 'auto' }}>
            <a className="brand" href="#top" aria-label="赏味首页">
              <span className="brand-mark">味</span><span>赏味</span><small>SHŌMI</small>
            </a>
            <p className="dish-counter"><span>第一席</span> / 豚骨</p>
          </header>

          <div className="dish-heading" style={{ opacity: 1 - headerFade, transform: `translate(-50%, ${headerFade * -10}px)` }}>
            <p>第一席 · 温暖的浓汤</p><h1 id="dish-title">豚骨拉面</h1><span lang="ja">とんこつラーメン</span>
          </div>

          <figure className="ramen-figure" aria-label={active.alt}>
            <Image className="ramen-frame current" src={current.image} alt="" aria-hidden="true" draggable="false" style={currentStyle} fill sizes="100vw" priority={scene.from === 0} unoptimized />
            {scene.to !== scene.from && (
              <Image className="ramen-frame upcoming" src={upcoming.image} alt="" aria-hidden="true" draggable="false" style={upcomingStyle} fill sizes="100vw" unoptimized />
            )}
            <div className="scene-tone" />
          </figure>

          <aside className="thought-bubble" aria-label="食客此刻的感受">
            <div className="thought-layer" style={{ opacity: 1 - scene.blend }}>
              <span className="bubble-kicker">{current.kicker}</span><p>{current.copy}</p>
            </div>
            {scene.to !== scene.from && (
              <div className="thought-layer" style={{ opacity: scene.blend }}>
                <span className="bubble-kicker">{upcoming.kicker}</span><p>{upcoming.copy}</p>
              </div>
            )}
            {progress < 0.012 && <span className="scroll-cue" aria-hidden="true"><i />向下赏味</span>}
            <span className="sr-only" aria-live="polite">{active.copy}</span>
          </aside>

          <BodyStatus frame={bodyFrame} />
        </section>
      </div>

      <section className="aftertaste" aria-labelledby="aftertaste-title">
        <p className="section-kicker">余味</p>
        <h2 id="aftertaste-title">汤痕留在碗底。<br />暖意留在身体里。</h2>
        <p className="aftertaste-copy">猪骨的脂香退得很慢。蒜与葱已经散了，盐味还在。此刻最想要的，是一口冷水。</p>
        <div className="next-dish"><span>下一席</span><p>尚在火上。</p></div>
        <a className="taste-again" href="#top">再赏一回 <span aria-hidden="true">↑</span></a>
      </section>
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
