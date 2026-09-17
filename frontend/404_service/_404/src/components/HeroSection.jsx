import character from '../assets/character.png';

export default function HeroSection() {
  return (
    <main className="page" id="home">
      <div className="noise" />
      <div className="scan" />

      <aside className="left-rail">
        <div className="rail-icons">
          <span />
          <span />
          <span />
        </div>
        <div className="rail-line" />
        <p>PAGE NOT FOUND</p>
        <div className="rail-line low" />
        <b>↙</b>
      </aside>

      <header className="topbar">
        <div className="brand reveal-top">
          <strong>404</strong>
          <span>ERROR</span>
        </div>
        <div className="top-glitch reveal-top">メモリ ::</div>
        <div className="top-line reveal-line" />
        <a href="#home" className="home reveal-top">
          HOME <i />
        </a>
      </header>

      <section className="copy">
        <div className="tiny-x reveal-copy">× × ×</div>
        <p className="jp-small reveal-copy">ページが見つかりません</p>
        <div className="slashes reveal-copy" />

        <div className="number" aria-label="404">
          <span className="digit">4</span>
          <span className="digit zero">0</span>
          <span className="digit">4</span>
        </div>

        <h1 className="reveal-copy">PAGE <em>NOT</em> FOUND</h1>
        <p className="message reveal-copy">
          THE PAGE YOU ARE LOOKING FOR<br />
          MIGHT HAVE BEEN REMOVED OR IS TEMPORARILY UNAVAILABLE.
        </p>

        <nav className="actions reveal-copy">
          <a href="#home" className="primary">GO BACK HOME <span>→</span></a>
          <a href="#contact" className="secondary">CONTACT ME <span>›</span></a>
        </nav>
      </section>

      <section className="hero" aria-hidden="true">
        <div className="violet shard-a shard" />
        <div className="violet shard-b shard" />
        <div className="violet shard-c shard" />
        <div className="violet shard-d shard" />
        <div className="violet shard-e shard" />
        <img className="character" src={character} alt="" />
        <div className="shade cut-one" />
        <div className="shade cut-two" />
      </section>

      <aside className="right-copy reveal-right">
        <p>見つかりません</p>
        <div className="right-line" />
      </aside>

      <div className="side-note reveal-right">
        <p>
          お探しのページは<br />
          削除されたか<br />
          利用できません。
        </p>
        <div className="slashes wide" />
      </div>

      <div className="green-dot pulse" />
      <div className="dot-column pulse">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="diag-line one ambient" />
      <div className="diag-line two ambient" />
      <div className="micro micro-a ambient" />
      <div className="micro micro-b ambient" />

      <footer>
        <p><span>© 2026</span> &nbsp; | &nbsp; DESIGN BY CYBER-HZ</p>
        <div className="social"><span>⌁</span><span>◖</span><span>✉</span></div>
      </footer>
    </main>
  );
}
