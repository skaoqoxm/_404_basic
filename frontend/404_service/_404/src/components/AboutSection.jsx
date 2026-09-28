export default function AboutSection() {
  return (
    <>
      <section className="panel" id="about">
        <div className="dots" style={{ bottom: '70px', right: '8%', width: '100px', height: '50px' }} />
        <div className="wrap">
          <div className="reveal">
            <p className="kicker">SECTION 02 <span>///</span> ABOUT ME</p>
            <h2 className="sec-title">ABOUT</h2>
          </div>

          <div className="about-grid">
            <div className="reveal">
              <p className="ab-en">
                A frontend developer who treats every <b>error</b> as a style.
                I build interfaces with strong typography, geometric masks and a bit of noise —
                <b>black, purple and a flash of lime.</b>
              </p>
              <p className="ab-jp">Black, purple, and green. Turning errors into personality. I create a 404 world through typography and geometry.</p>
            </div>

            <div className="reveal">
              <div className="stats">
                <div className="stat"><b>03+</b><span>YEARS / EXPERIENCE</span></div>
                <div className="stat"><b>10+</b><span>PROJECTS / BUILT</span></div>
                <div className="stat"><b>24/7</b><span>ONLINE / CONNECTED</span></div>
              </div>

              <div className="skills">
                <span>HTML/CSS</span><span>JAVASCRIPT</span><span>VUE</span><span>LLM APP</span><span>UI/UX</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="panel" id="contact">
        <span className="panel-side">CONTACT — GET IN TOUCH ///</span>
        <div className="wrap">
          <div className="reveal">
            <p className="kicker">SECTION 03 <span>///</span> GET IN TOUCH</p>
            <h2 className="sec-title">SAY <b>HELLO</b></h2>
            <p className="sec-sub">Feel free to reach out anytime. DROP A LINE ANYTIME.</p>
          </div>

          <div className="actions reveal">
            <a className="btn" href="mailto:hello@404.web">
              HELLO@404.WEB <span className="arr">⟶</span>
            </a>
            <a className="btn ghost" href="#home">
              BACK TO TOP <span className="arr">↑</span>
            </a>
          </div>
        </div>
      </section>

      <footer className="end-bar">
        <span>© 2026 <b>404.WEB</b> — JUST A PERSONAL WEBSITE / NOT A REAL ERROR</span>
        <span>PERSONAL PAGE <b>=</b> PAGE NOT LOST</span>
      </footer>
    </>
  );
}
