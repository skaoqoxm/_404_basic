const works = [
  {
    idx: '01',
    chip: 'IN DEV / 開発中',
    chipClass: 'dev',
    title: 'AI CUSTOMER SERVICE',
    jp: '智能客服 · AI カスタマーサポート',
    desc: 'My next build — an LLM-powered support agent with a RAG knowledge base: 24/7 instant replies, human-like tone, embeddable widget for any site.',
    tags: ['LLM', 'RAG', 'WIDGET', 'NEXT ↗'],
    featured: true,
  },
  {
    idx: '02',
    chip: 'ONLINE / 公開中',
    chipClass: 'online',
    title: 'PERSONAL PAGE',
    jp: '个人主页 · このページ',
    desc: 'The page you are on — hollow typography, inverted masks, pure HTML/CSS/JS. Error as an aesthetic.',
    tags: ['HTML', 'CSS', 'JS'],
    featured: false,
  },
  {
    idx: '03',
    chip: 'PLANNED / 企画中',
    chipClass: 'plan',
    title: 'DATA DASHBOARD',
    jp: '数据看板 · データパネル',
    desc: 'A dark-mode analytics dashboard with real-time charts and purple-on-black data viz. Sketching stage.',
    tags: ['VUE', 'ECHARTS', 'API'],
    featured: false,
  },
  {
    idx: '??',
    chip: 'COMING SOON / 予告',
    chipClass: 'soon',
    title: 'PROJECT: ????',
    jp: '秘密企画 · ひみつ',
    desc: 'Classified. Something between a game and a toy. Will appear here when it stops returning 404.',
    tags: ['TBA', 'TBA', 'TBA'],
    featured: false,
    mystery: true,
  },
];

export default function WorksSection() {
  return (
    <section className="panel" id="works">
      <div className="dots" style={{ top: '60px', left: '6%', width: '120px', height: '54px' }} />
      <span className="panel-side">SELECTED WORKS — 2026 ///種</span>
      <div className="wrap">
        <div className="reveal">
          <p className="kicker">SECTION 01 <span>///</span> 制作物</p>
          <h2 className="sec-title">WORKS</h2>
          <p className="sec-sub">作ったもの、これから作るもの — SELECTED &amp; UPCOMING PROJECTS</p>
        </div>

        <div className="cards">
          {works.map((item) => (
            <a
              key={item.idx}
              href={item.idx === '01' ? '/chat' : '#'}
              className={`card ${item.featured ? 'featured' : ''} ${item.mystery ? 'mystery' : ''} reveal`}
            >
              <div className="c-top">
                <span className="idx">{item.idx}</span>
                <span className={`chip ${item.chipClass}`}>{item.chip}</span>
              </div>
              <h3>{item.title}<span className="jp-t">{item.jp}</span></h3>
              <p className="en-d">{item.desc}</p>
              <div className="tags">
                {item.tags.map((tag, index) => (
                  <span key={`${item.idx}-${tag}-${index}`}>{tag}</span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
