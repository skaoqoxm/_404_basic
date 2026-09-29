import { Link } from 'react-router-dom';

const works = [
  {
    idx: '01',
    chip: 'IN DEV / IN DEVELOPMENT',
    chipClass: 'dev',
    title: 'AI CUSTOMER SERVICE',
    jp: '智能客服 · AI CUSTOMER SUPPORT',
    desc: '我的下一个项目——一个基于大型语言模型的支持代理，配有RAG知识库：全天候即时回复，类似人类的语气，适合嵌入任何网站的小部件。',
    tags: ['LLM', 'RAG', 'WIDGET', 'NEXT ↗'],
    featured: true,
  },
  {
    idx: '02',
    chip: 'ONLINE / LIVE',
    chipClass: 'online',
    title: 'PERSONAL PAGE',
    jp: '个人主页 · THIS WEBSITE',
    desc: '你所在的页面——',
    tags: ['HTML', 'CSS', 'JS'],
    featured: false,
  },
  {
    idx: '03',
    chip: 'PLANNED / IN PLANNING',
    chipClass: 'plan',
    title: 'DATA DASHBOARD',
    jp: '数据看板 · DATA DASHBOARD',
    desc: '一个深色模式的分析仪表盘，带有实时图表和紫色字体黑色背景的数据可视化。正在草图阶段。',
    tags: ['VUE', 'ECHARTS', 'API'],
    featured: false,
  },
  {
    idx: '??',
    chip: 'COMING SOON / COMING SOON',
    chipClass: 'soon',
    title: 'PROJECT: ????',
    jp: '秘密企画 · CLASSIFIED',
    desc: '寻找想法ing..',
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
