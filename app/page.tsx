'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const stages = [
  {
    remaining: '100%',
    short: '满',
    kicker: '先闻一闻',
    thought: <>奶白色的汤冒着热气。<br />往下滑，让我尝第一口。</>,
    image: '/images/ramen-100.png',
    alt: '木屋晨光中，一只手正用筷子夹起满碗豚骨拉面的面条',
    fullness: 8,
    warmth: 20,
    thirst: 4,
    labels: ['空腹', '平静', '没有'],
    note: '还没吃。胃里很轻，手心感到碗边传来的温度。',
  },
  {
    remaining: '75%',
    short: '¾',
    kicker: '第一口',
    thought: <>汤比看上去更厚。<br />猪骨的脂香先铺满舌面，咸味随后跟上来。</>,
    image: '/images/ramen-75.png',
    alt: '豚骨拉面剩下四分之三，筷子夹起一束面条',
    fullness: 28,
    warmth: 42,
    thirst: 18,
    labels: ['初饱', '微热', '轻微'],
    note: '热汤落进胃里，胸口慢慢暖起来，食欲被彻底打开。',
  },
  {
    remaining: '50%',
    short: '½',
    kicker: '吃到一半',
    thought: <>面条仍然有弹性。<br />木耳的脆、蒜香和葱的清气，把浓汤撑开了。</>,
    image: '/images/ramen-50.png',
    alt: '吃到一半的豚骨拉面，碗内露出汤痕',
    fullness: 53,
    warmth: 68,
    thirst: 38,
    labels: ['半饱', '暖和', '想喝水'],
    note: '额头有一点热，胃里变得踏实，浓郁感开始累积。',
  },
  {
    remaining: '25%',
    short: '¼',
    kicker: '最后几口',
    thought: <>好吃，但厚重感开始留下来。<br />最后几口，我吃得比刚才慢了一些。</>,
    image: '/images/ramen-25.png',
    alt: '只剩四分之一的豚骨拉面，筷子夹着最后几口面',
    fullness: 78,
    warmth: 84,
    thirst: 64,
    labels: ['很饱', '发热', '明显'],
    note: '身体已经满足。嘴唇留着一点油润，呼吸里还有蒜香。',
  },
  {
    remaining: '0%',
    short: '空',
    kicker: '碗底见了',
    thought: <>吃完了。留下的是咸味、脂香和一点蒜味。<br />很满足，也真的想喝口水。</>,
    image: '/images/ramen-0.png',
    alt: '吃完的豚骨拉面空碗，筷子搁在碗沿上',
    fullness: 96,
    warmth: 88,
    thirst: 82,
    labels: ['饱足', '温热', '很想'],
    note: '胃里沉稳而温暖，动作停下来，味道还没有立刻离开。',
  },
];

export default function Home() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const stage = stages[activeStage];

  useEffect(() => {
    let frame = 0;
    const update = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const total = trackRef.current.offsetHeight - window.innerHeight;
      const nextProgress = Math.min(1, Math.max(0, -rect.top / Math.max(total, 1)));
      setProgress(nextProgress);
      setActiveStage(Math.min(4, Math.round(nextProgress * 4)));
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <main className="tasting-page">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="赏味首页">
          <span className="brand-mark">味</span>
          <span>赏味</span>
          <small>SHŌMI</small>
        </a>
        <p className="dish-counter"><span>一</span> / 五味</p>
        <p className="header-note">把一道菜，慢慢尝明白</p>
      </header>

      <div className="scroll-track" ref={trackRef} id="top">
        <section className="tasting-stage" aria-labelledby="dish-title">
          <div className="scene-wash" />
          <div className="dish-heading">
            <p>第一席 · 温暖的浓汤</p>
            <h1 id="dish-title">豚骨拉面</h1>
            <span lang="ja">とんこつラーメン</span>
          </div>

          <aside className="thought-bubble" key={activeStage} aria-live="polite">
            <span className="bubble-kicker">{stage.kicker}</span>
            <p>{stage.thought}</p>
            {activeStage === 0 && (
              <span className="scroll-cue" aria-hidden="true"><i />向下赏味</span>
            )}
          </aside>

          <figure className="ramen-figure">
            {stages.map((item, index) => (
              <Image
                key={item.remaining}
                className={index === activeStage ? 'active' : ''}
                src={item.image}
                alt={index === activeStage ? item.alt : ''}
                aria-hidden={index !== activeStage}
                fill
                sizes="100vw"
                priority={index === 0}
              />
            ))}
            <figcaption>{activeStage === 0 ? '尚未动筷' : activeStage === 4 ? '已经吃完' : '碗中剩余'} · {stage.remaining}</figcaption>
          </figure>

          <aside className="body-card" aria-label="食客当前身体状态">
            <div className="body-card-heading">
              <span>身体的回声</span>
              <b>现在</b>
            </div>
            <dl>
              <BodyMetric name="饱腹" value={stage.fullness} label={stage.labels[0]} />
              <BodyMetric name="暖意" value={stage.warmth} label={stage.labels[1]} />
              <BodyMetric name="口渴" value={stage.thirst} label={stage.labels[2]} />
            </dl>
            <p className="body-note">{stage.note}</p>
          </aside>

          <nav className="taste-progress" aria-label="进食进度">
            {stages.map((item, index) => (
              <span className={index === activeStage ? 'active' : index < activeStage ? 'passed' : ''} key={item.remaining}>
                {item.short}
              </span>
            ))}
          </nav>

          <div className="scroll-line" aria-hidden="true">
            <i style={{ height: `${progress * 100}%` }} />
          </div>
        </section>
      </div>

      <section className="aftertaste" aria-labelledby="aftertaste-title">
        <p className="section-kicker">余味 · AFTERTASTE</p>
        <h2 id="aftertaste-title">浓，不只是一种味道。</h2>
        <p className="aftertaste-copy">它是猪骨脂香的厚度、蒜与葱的锐气，也是热汤落进胃里以后，那阵缓慢升起的暖意。</p>
        <ul className="taste-tags" aria-label="味觉关键词">
          <li>浓郁</li><li>咸鲜</li><li>脂香</li><li>蒜香</li><li>温热</li>
        </ul>
        <div className="next-dish">
          <span>下一席</span>
          <p>另一道味道，正在准备中。</p>
        </div>
        <a className="taste-again" href="#top">再尝一次 <span aria-hidden="true">↑</span></a>
      </section>
    </main>
  );
}

function BodyMetric({ name, value, label }: { name: string; value: number; label: string }) {
  return (
    <div>
      <dt>{name}</dt>
      <dd>
        <span className="meter"><i style={{ width: `${value}%` }} /></span>
        <em>{label}</em>
      </dd>
    </div>
  );
}
