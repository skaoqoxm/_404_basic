import { Link } from 'react-router-dom';

const works = [
  {
    idx: '01',
    chip: 'IN DEV / IN DEVELOPMENT',
    chipClass: 'dev',
    title: 'AI CUSTOMER SERVICE',
    jp: '智能客服 · AI CUSTOMER SUPPORT',
    desc: 'My next build — an LLM-powered support agent with a RAG knowledge base: 24/7 instant replies, human-like tone, embeddable widget for any site.',
    tags: ['LLM', 'RAG', 'WIDGET', 'NEXT ↗'],
    featured: true,
  },
  {
    idx: '02',
    chip: 'ONLINE / LIVE',
    chipClass: 'online',
    title: 'PERSONAL PAGE',
    jp: '个人主页 · THIS WEBSITE',
    desc: 'The page you are on — hollow typography, inverted masks, pure HTML/CSS/JS. Error as an aesthetic.',
    tags: ['HTML', 'CSS', 'JS'],
    featured: false,
  },
  {
    idx: '03',
    chip: 'PLANNED / IN PLANNING',
    chipClass: 'plan',
    title: 'DATA DASHBOARD',
    jp: '数据看板 · DATA DASHBOARD',
    desc: 'A dark-mode analytics dashboard with real-time charts and purple-on-black data viz. Sketching stage.',
    tags: ['VUE', 'ECHARTS', 'API'],
    featured: false,
  },
  {
    idx: '??',
    chip: 'COMING SOON / COMING SOON',
    chipClass: 'soon',
    title: 'PROJECT: ????',
    jp: '秘密企画 · CLASSIFIED',
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
      <span className="panel-side">SELECTED WORKS — 2026 /// PROJECTS</span>
      <div className="wrap">
        <div className="reveal">
          <p className="kicker">SECTION 01 <span>///</span> SELECTED WORK</p>
          <h2 className="sec-title">WORKS</h2>
          <p className="sec-sub">CURRENT AND UPCOMING PROJECTS — SELECTED &amp; UPCOMING PROJECTS</p>
        </div>

        <div className="cards">
          {works.map((item) => (
            <Link
              key={item.idx}
              to={item.idx === '01' ? '/chat' : '#'}
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
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
