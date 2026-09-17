import { useEffect, useRef, useState } from 'react';

const styles = `
  :root{
    --bg: #060607;
    --panel: #0a0a0d;
    --ink: #ededf0;
    --gray: #8b8b95;
    --purple: #8b5cf6;
    --purple-deep: #5b21b6;
    --lime: #c8f542;
    --line: rgba(255,255,255,.12);
  }
  *{ margin:0; padding:0; box-sizing:border-box; }
  html,body{ height:100%; }
  body{
    background: var(--bg);
    color: var(--ink);
    font-family: "Space Grotesk", "Noto Sans JP", sans-serif;
    overflow: hidden;
  }

  .chat-app{
    height: 100vh;
    display: grid;
    grid-template:
      "top top top" 62px
      "conv chat meta" 1fr
      / 284px 1fr 300px;
  }
  .chat-app > *{ min-height: 0; }

  .kicker{ font: 700 10px/1 "Space Mono", monospace; letter-spacing: 3px; color: var(--purple); }
  .kicker span{ color: var(--lime); }
  .mono{ font-family: "Space Mono", monospace; }
  .bracket{ position: absolute; width: 18px; height: 18px; pointer-events: none; z-index: 5; }
  .bracket.tl{ border-top: 2px solid var(--ink); border-left: 2px solid var(--ink); }
  .bracket.br{ border-bottom: 2px solid var(--ink); border-right: 2px solid var(--ink); }
  .dots{
    position: absolute;
    background-image: radial-gradient(rgba(255,255,255,.3) 1px, transparent 1.2px);
    background-size: 10px 10px;
    pointer-events: none;
  }

  .topbar{
    grid-area: top;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 22px;
    border-bottom: 1px solid var(--line);
    background: var(--panel);
    z-index: 10;
  }
  .brand{ display: flex; align-items: center; gap: 14px; }
  .brand .logo{
    font: 400 26px/1 "Archivo Black", sans-serif;
    color: transparent;
    -webkit-text-stroke: 1.6px var(--purple);
    letter-spacing: 1px;
  }
  .brand .logo b{ color: var(--lime); -webkit-text-stroke: 0; }
  .brand-meta b{ display: block; font: 700 11px/1.4 "Space Mono", monospace; letter-spacing: 3px; }
  .brand-meta span{ display: block; font: 400 9px/1.4 "Noto Sans JP", sans-serif; letter-spacing: 2px; color: var(--gray); }
  .sys{ display: flex; align-items: center; gap: 14px; font: 700 10px/1 "Space Mono", monospace; letter-spacing: 2px; color: var(--gray); }
  .sys .live{ color: var(--lime); display: flex; align-items: center; gap: 7px; }
  .sys .live i{
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--lime);
    box-shadow: 0 0 10px rgba(200,245,66,.9);
    animation: pulse 1.6s infinite;
  }
  @keyframes pulse{ 50%{ opacity: .3; } }
  .sys .sep{ width: 1px; height: 14px; background: var(--line); }
  .sys .off{ color: var(--purple); }
  .clock{ font: 700 13px/1 "Space Mono", monospace; letter-spacing: 2px; color: var(--ink); }

  .conv{
    grid-area: conv;
    border-right: 1px solid var(--line);
    background: var(--panel);
    display: flex; flex-direction: column;
    position: relative;
  }
  .conv-head{ padding: 18px 16px 12px; display: flex; flex-direction: column; gap: 12px; }
  .new-chat{
    align-self: flex-start;
    font: 700 10px/1 "Space Mono", monospace;
    letter-spacing: 2px;
    color: #0a0a0a;
    background: var(--lime);
    border: 0; cursor: pointer;
    padding: 9px 13px;
    clip-path: polygon(0 0, calc(100% - 9px) 0, 100% 9px, 100% 100%, 9px 100%, 0 calc(100% - 9px));
    transition: transform .15s, box-shadow .15s;
  }
  .new-chat:hover{ transform: translate(-2px,-2px); box-shadow: 3px 3px 0 var(--purple); }
  .search{ padding: 0 16px 12px; }
  .search input{
    width: 100%;
    background: rgba(255,255,255,.03);
    border: 1px solid var(--line);
    color: var(--ink);
    font: 400 11px/1 "Space Mono", monospace;
    letter-spacing: 1px;
    padding: 9px 11px;
    outline: none;
    transition: border-color .2s;
  }
  .search input:focus{ border-color: rgba(139,92,246,.6); }
  .search input::placeholder{ color: var(--gray); }
  .conv-list{ flex: 1; overflow-y: auto; }
  .conv-item{
    display: flex; align-items: center; gap: 11px;
    padding: 13px 16px;
    cursor: pointer;
    border-left: 2px solid transparent;
    transition: background .15s, border-color .15s;
    position: relative;
  }
  .conv-item:hover{ background: rgba(255,255,255,.03); }
  .conv-item.active{ background: rgba(139,92,246,.08); border-left-color: var(--purple); }
  .av{
    flex: none;
    width: 34px; height: 34px;
    display: grid; place-items: center;
    font: 700 11px/1 "Space Mono", monospace;
    color: var(--purple);
    border: 1px solid rgba(139,92,246,.5);
    background: rgba(139,92,246,.08);
  }
  .ci-m{ flex: 1; min-width: 0; }
  .ci-top{ display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
  .ci-top b{ font: 700 11px/1 "Space Mono", monospace; letter-spacing: 1px; }
  .ci-top time{ font: 400 9px/1 "Space Mono", monospace; color: var(--gray); }
  .ci-m p{
    margin-top: 6px;
    font: 400 10px/1.5 "Noto Sans JP", sans-serif;
    letter-spacing: .5px;
    color: var(--gray);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .badge{
    flex: none;
    min-width: 16px; height: 16px;
    display: grid; place-items: center;
    font: 700 9px/1 "Space Mono", monospace;
    color: #0a0a0a; background: var(--lime);
  }
  .conv-foot{
    padding: 12px 16px;
    border-top: 1px solid var(--line);
    font: 400 9px/1.7 "Space Mono", monospace;
    letter-spacing: 1.5px;
    color: var(--gray);
  }
  .conv-foot b{ color: var(--lime); }

  .chat{
    grid-area: chat;
    display: flex; flex-direction: column;
    position: relative;
    background:
      radial-gradient(ellipse 60% 40% at 70% 0%, rgba(139,92,246,.06), transparent),
      var(--bg);
  }
  .chat-head{
    display: flex; align-items: center; gap: 13px;
    padding: 14px 22px;
    border-bottom: 1px solid var(--line);
    background: rgba(10,10,13,.6);
    backdrop-filter: blur(6px);
    z-index: 4;
  }
  .av.big{ width: 40px; height: 40px; font-size: 12px; }
  .chat-head .who b{ display: block; font: 700 13px/1.3 "Space Mono", monospace; letter-spacing: 2px; }
  .chat-head .who .st{
    display: flex; align-items: center; gap: 7px;
    font: 400 9px/1.4 "Noto Sans JP", sans-serif;
    letter-spacing: 1.5px; color: var(--lime);
  }
  .chat-head .who .st i{
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--lime); box-shadow: 0 0 8px rgba(200,245,66,.8);
  }
  .chat-head .no{
    margin-left: auto;
    font: 400 22px/1 "Archivo Black", sans-serif;
    color: transparent;
    -webkit-text-stroke: 1.2px rgba(200,245,66,.45);
    letter-spacing: 1px;
  }
  .ch-acts{ display: flex; gap: 8px; margin-left: 18px; }
  .ch-acts button{
    width: 26px; height: 26px;
    display: grid; place-items: center;
    background: transparent;
    border: 1px solid var(--line);
    color: var(--gray);
    font: 400 12px/1 "Space Mono", monospace;
    cursor: pointer;
    transition: all .15s;
  }
  .ch-acts button:hover{ color: #000; background: var(--lime); border-color: var(--lime); }

  .msgs{
    flex: 1;
    overflow-y: auto;
    padding: 26px 26px 14px;
    display: flex; flex-direction: column; gap: 18px;
    scroll-behavior: smooth;
  }
  .msg{ display: flex; gap: 11px; max-width: 76%; animation: rise .35s ease both; }
  @keyframes rise{ from{ opacity: 0; transform: translateY(14px); } }
  .msg .av{ width: 30px; height: 30px; font-size: 9px; align-self: flex-end; }
  .msg.user{ margin-left: auto; flex-direction: row-reverse; }
  .msg.user .av{ color: var(--lime); border-color: rgba(200,245,66,.5); background: rgba(200,245,66,.07); }
  .bubble{ padding: 12px 15px 13px; position: relative; }
  .msg.ai .bubble{
    background: rgba(139,92,246,.08);
    border: 1px solid rgba(139,92,246,.32);
    border-left: 3px solid var(--purple);
  }
  .msg.user .bubble{
    background: rgba(200,245,66,.06);
    border: 1px solid rgba(200,245,66,.3);
    border-right: 3px solid var(--lime);
  }
  .bubble .b-meta{
    display: flex; gap: 10px; align-items: baseline;
    margin-bottom: 7px;
    font: 700 8px/1 "Space Mono", monospace; letter-spacing: 2px;
  }
  .msg.ai .b-meta{ color: var(--purple); }
  .msg.user .b-meta{ color: var(--lime); }
  .bubble .b-meta time{ color: var(--gray); font-weight: 400; }
  .bubble p{ font: 400 13px/1.9 "Noto Sans JP", "Space Grotesk", sans-serif; letter-spacing: .4px; }
  .bubble p b{ color: var(--lime); }
  .bubble p em{ color: var(--purple); font-style: normal; }

  .typing{ display: inline-flex; gap: 5px; padding: 6px 2px; }
  .typing i{
    width: 6px; height: 6px;
    background: var(--purple);
    animation: tp 1.2s infinite;
  }
  .typing i:nth-child(2){ animation-delay: .18s; }
  .typing i:nth-child(3){ animation-delay: .36s; }
  @keyframes tp{ 0%,60%,100%{ transform: translateY(0); opacity: .4; } 30%{ transform: translateY(-5px); opacity: 1; } }

  .divider{
    display: flex; align-items: center; gap: 12px;
    font: 400 9px/1 "Space Mono", monospace;
    letter-spacing: 3px; color: var(--gray);
  }
  .divider::before, .divider::after{ content:""; flex: 1; height: 1px; background: var(--line); }

  .quick{
    display: flex; gap: 10px; flex-wrap: wrap;
    padding: 0 26px 12px;
  }
  .quick button{
    font: 700 10px/1 "Space Mono", "Noto Sans JP", monospace;
    letter-spacing: 1.5px;
    color: var(--ink);
    background: transparent;
    border: 1px solid var(--line);
    padding: 9px 13px;
    cursor: pointer;
    transition: all .15s;
  }
  .quick button:hover{ color: #000; background: var(--lime); border-color: var(--lime); }
  .quick button span{ color: var(--purple); }
  .quick button:hover span{ color: #000; }

  .inputer{
    display: flex; align-items: center; gap: 12px;
    padding: 14px 26px 10px;
  }
  .attach{
    width: 42px; height: 46px;
    flex: none;
    background: transparent;
    border: 1px solid var(--line);
    color: var(--gray);
    font: 400 16px/1 "Space Mono", monospace;
    cursor: pointer;
    transition: all .15s;
  }
  .attach:hover{ color: var(--purple); border-color: rgba(139,92,246,.6); }
  .inputer input{
    flex: 1;
    height: 46px;
    background: rgba(255,255,255,.03);
    border: 1px solid var(--line);
    color: var(--ink);
    font: 400 13px/1 "Space Grotesk", "Noto Sans JP", sans-serif;
    letter-spacing: .5px;
    padding: 0 16px;
    outline: none;
    transition: border-color .2s, box-shadow .2s;
  }
  .inputer input:focus{ border-color: rgba(139,92,246,.65); box-shadow: 0 0 18px rgba(139,92,246,.12); }
  .inputer input::placeholder{ color: var(--gray); }
  .send{
    height: 46px;
    flex: none;
    display: inline-flex; align-items: center; gap: 10px;
    padding: 0 20px;
    font: 700 11px/1 "Space Mono", monospace;
    letter-spacing: 2px;
    color: #0a0a0a;
    background: var(--lime);
    border: 0; cursor: pointer;
    clip-path: polygon(0 0, calc(100% - 11px) 0, 100% 11px, 100% 100%, 11px 100%, 0 calc(100% - 11px));
    transition: transform .15s, box-shadow .15s;
  }
  .send:hover{ transform: translate(-2px,-2px); box-shadow: 4px 4px 0 var(--purple); }
  .hint{
    padding: 0 26px 14px;
    font: 400 9px/1 "Space Mono", monospace;
    letter-spacing: 1.5px; color: var(--gray);
  }
  .hint b{ color: var(--purple); }

  .meta{
    grid-area: meta;
    border-left: 1px solid var(--line);
    background: var(--panel);
    padding: 18px;
    display: flex; flex-direction: column; gap: 14px;
    overflow-y: auto;
    position: relative;
  }
  .m-card{
    border: 1px solid var(--line);
    background: rgba(255,255,255,.02);
    padding: 14px;
    position: relative;
  }
  .m-card::after{
    content:""; position: absolute; right: -26px; top: -26px;
    width: 90px; height: 90px;
    background: linear-gradient(200deg, rgba(139,92,246,.45), rgba(91,33,182,.12));
    clip-path: polygon(100% 0, 100% 100%, 0 0);
    opacity: .22; pointer-events: none;
  }
  .m-card h4{ font: 700 10px/1 "Space Mono", monospace; letter-spacing: 2.5px; color: var(--ink); margin-bottom: 12px; }
  .kv{ display: flex; justify-content: space-between; gap: 10px; padding: 6px 0; border-bottom: 1px dashed rgba(255,255,255,.08); }
  .kv:last-child{ border-bottom: 0; }
  .kv span{ font: 400 9px/1.6 "Space Mono", monospace; letter-spacing: 1px; color: var(--gray); }
  .kv b{ font: 700 10px/1.6 "Space Mono", "Noto Sans JP", monospace; letter-spacing: 1px; color: var(--ink); text-align: right; }
  .kv b.p{ color: var(--purple); }
  .kv b.l{ color: var(--lime); }

  .bar{ margin-top: 4px; }
  .bar .bl{ display: flex; justify-content: space-between; font: 700 9px/1 "Space Mono", monospace; letter-spacing: 1.5px; color: var(--gray); margin-bottom: 7px; }
  .bar .bl b{ color: var(--lime); }
  .bar .tr{ height: 7px; background: rgba(255,255,255,.06); position: relative; overflow: hidden; }
  .bar .tr i{
    position: absolute; inset: 0;
    width: var(--w, 80%);
    background: repeating-linear-gradient(115deg, var(--lime) 0 6px, rgba(200,245,66,.35) 6px 9px);
    animation: grow 1.2s ease both;
  }
  @keyframes grow{ from{ width: 0; } }
  .bar.pu .tr i{ background: repeating-linear-gradient(115deg, var(--purple) 0 6px, rgba(139,92,246,.35) 6px 9px); }

  .log{ font: 400 9px/2 "Space Mono", monospace; letter-spacing: .5px; color: var(--gray); }
  .log div{ white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .log b{ color: var(--purple); font-weight: 400; }
  .log em{ color: var(--lime); font-style: normal; }

  .meta .vjp{
    margin-top: auto;
    writing-mode: vertical-rl;
    align-self: center;
    font: 500 13px/1 "Noto Sans JP", sans-serif;
    letter-spacing: 8px;
    color: var(--purple);
    text-shadow: 0 0 14px rgba(139,92,246,.5);
    padding-bottom: 6px;
  }

  ::-webkit-scrollbar{ width: 8px; height: 8px; }
  ::-webkit-scrollbar-track{ background: transparent; }
  ::-webkit-scrollbar-thumb{ background: rgba(139,92,246,.35); border: 2px solid var(--bg); }
  ::-webkit-scrollbar-thumb:hover{ background: rgba(139,92,246,.6); }

  .grain{
    position: fixed; inset: 0; z-index: 90; pointer-events: none;
    opacity: .06;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E");
  }
  .scan{
    position: fixed; inset: 0; z-index: 90; pointer-events: none;
    background: repeating-linear-gradient(0deg, rgba(255,255,255,.02) 0 1px, transparent 1px 4px);
  }

  @media (max-width: 1180px){
    .chat-app{ grid-template: "top top" 62px "conv chat" 1fr / 260px 1fr; }
    .meta{ display: none; }
  }
  @media (max-width: 820px){
    .chat-app{ grid-template: "top" 62px "chat" 1fr / 1fr; }
    .conv{ display: none; }
    .msg{ max-width: 92%; }
  }
`;

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

const QUICK_PROMPTS = [
  { label: '料金 / PRICING', value: '料金プランを知りたい / 想了解价格方案' },
  { label: 'HOW TO / 使い方', value: '使い方を教えてください / 请教我怎么使用' },
  { label: 'HUMAN / 转人工', value: '人間のオペレーターと話したい / 我想转人工' },
];

const SESSION_LIST = [
  { id: '77', name: 'GUEST_7742', time: '21:47', preview: '料金プランについて教えてください…', badge: 2, active: true },
  { id: 'MK', name: 'MIKA_T', time: '20:12', preview: 'ありがとうございます、解決しました！' },
  { id: 'DN', name: 'DEV_NULL', time: '18:03', preview: 'API のレート制限はどうなって…', badge: 1 },
  { id: 'HM', name: 'HUMAN_REQ', time: '16:40', preview: '担当者に代わっていただけますか…' },
  { id: '40', name: 'GUEST_4004', time: '昨日', preview: 'ページが見つかりません…' },
];

const MOCK_REPLIES = [
  "【MOCK】バックエンド未接続のため、デモ応答を表示中。后端尚未接入，这是前端内置的演示回复 — 接入 <b>sendToBackend()</b> 后将由真实模型回答。",
  "ご質問ありがとうございます！这是演示回复 <em>// DEMO REPLY</em>：真实场景下，这里会由 LLM + RAG 知识库生成答案。",
  "リクエストを記録しました ✓（本地演示）。人工客服工作时间 <b>10:00 - 19:00 JST</b>，也可在 WORKS 页关注开发进度。",
];

const formatTime = () => new Date().toTimeString().slice(0, 5);
const formatStamp = () => new Date().toTimeString().slice(0, 8);

async function sendToBackend(message) {
  const safeMessage = (message || '').trim();
  if (!safeMessage) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend request failed: ${response.status}`);
    }

    const data = await response.json();
    const statusText = data?.status === 'ok' ? '正常' : '异常';
    return `【真实后端响应】${data?.service || 'Nexus API'} / status: ${statusText} / database: ${data?.database || 'unknown'} / cache: ${data?.cache || 'unknown'}`;
  } catch (error) {
    console.error('sendToBackend error:', error);
    return null;
  }
}

export default function Chat() {
  const messagesRef = useRef(null);
  const inputRef = useRef(null);
  const [clock, setClock] = useState(formatStamp());
  const [backendStatus, setBackendStatus] = useState('CHECKING');
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'ai',
      time: formatTime(),
      html: `こんにちは！ここは <b>AICS 智能客服</b> のデモフロントエンドです。<br />我是基于 LLM 的智能客服前端演示 — 现在后端还没接入，回复都是本地演示。下方的快捷标签可以直接体验，或直接输入消息。<em>// お気軽にどうぞ！</em>`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [logs, setLogs] = useState([
    { id: 1, text: 'SESSION START / 接続', ok: true },
    { id: 2, text: 'AI GREETING SENT', ok: true },
  ]);
  const [confidence, setConfidence] = useState(87);
  const [intent, setIntent] = useState('billing / 料金');
  const [sessionName, setSessionName] = useState('GUEST_7742');

  useEffect(() => {
    const timer = setInterval(() => setClock(formatStamp()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const checkBackend = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        });

        if (!cancelled) {
          setBackendStatus(response.ok ? 'ONLINE' : 'OFFLINE');
        }
      } catch {
        if (!cancelled) setBackendStatus('OFFLINE');
      }
    };

    checkBackend();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const addLog = (text, ok = false) => {
    setLogs((prev) => [{ id: Date.now() + Math.random(), text, ok }, ...prev].slice(0, 6));
  };

  const addMessage = (role, html) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        role,
        time: formatTime(),
        html,
      },
    ]);
  };

  const sendMessage = async (text) => {
    const value = (text || '').trim();
    if (!value || isTyping) return;

    addMessage('user', value);
    addLog(`MSG SENT: "${value.slice(0, 18)}${value.length > 18 ? '…' : ''}"`);
    setInput('');
    setIsTyping(true);

    const reply = await sendToBackend(value);

    await new Promise((resolve) => setTimeout(resolve, 700 + Math.random() * 500));
    setIsTyping(false);

    if (reply) {
      addMessage('ai', reply);
      addLog('BACKEND REPLY OK', true);
    } else {
      const demoReply = MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)];
      addMessage('ai', demoReply);
      addLog('BACKEND SKIPPED (OFF) → MOCK');
    }

    const nextConfidence = 72 + Math.floor(Math.random() * 25);
    setConfidence(nextConfidence);
    setIntent('billing / 料金');
    inputRef.current?.focus();
  };

  const handleQuickReply = (value) => {
    sendMessage(value);
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: Date.now(),
        role: 'ai',
        time: formatTime(),
        html: `こんにちは！ここは <b>AICS 智能客服</b> のデモフロントエンドです。<br />我是基于 LLM 的智能客服前端演示 — 现在后端还没接入，回复都是本地演示。下方的快捷标签可以直接体验，或直接输入消息。<em>// お気軽にどうぞ！</em>`,
      },
    ]);
    addLog('NEW SESSION STARTED', true);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="chat-app">
        <header className="topbar">
          <div className="brand">
            <span className="logo">AI<b>CS</b></span>
            <div className="brand-meta">
              <b>SMART SUPPORT</b>
              <span>智能客服 · AI カスタマーサポート v0.1</span>
            </div>
          </div>

          <div className="sys">
            <span className="live"><i />FRONTEND ONLINE / 接続中</span>
            <span className="sep" />
            <span>
              BACKEND:{' '}
              <b
                className={backendStatus === 'ONLINE' ? 'on' : 'off'}
                style={{ color: backendStatus === 'ONLINE' ? 'var(--lime)' : 'var(--purple)' }}
              >
                {backendStatus === 'ONLINE' ? 'ON // 已连接' : backendStatus === 'OFFLINE' ? 'OFF // 未连接' : 'CHECKING // 检查中'}
              </b>
            </span>
            <span className="sep" />
            <span>MODEL: <b style={{ color: 'var(--ink)' }}>REAL API</b></span>
          </div>

          <div className="clock">{clock}</div>
        </header>

        <aside className="conv">
          <div className="dots" style={{ top: '8px', right: '10px', width: '56px', height: '30px', opacity: '.4' }} />
          <div className="conv-head">
            <p className="kicker">SESSIONS <span>///</span> 履歴</p>
            <button className="new-chat" onClick={handleNewChat}>+ NEW CHAT / 新規</button>
          </div>

          <div className="search">
            <input type="text" placeholder="検索 / SEARCH..." />
          </div>

          <div className="conv-list">
            {SESSION_LIST.map((item) => (
              <div
                key={item.id}
                className={`conv-item ${item.active ? 'active' : ''}`}
                onClick={() => setSessionName(item.name)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSessionName(item.name);
                  }
                }}
              >
                <span className="av">{item.id}</span>
                <div className="ci-m">
                  <div className="ci-top">
                    <b>{item.name}</b>
                    <time>{item.time}</time>
                  </div>
                  <p>{item.preview}</p>
                </div>
                {item.badge ? <i className="badge">{item.badge}</i> : null}
              </div>
            ))}
          </div>

          <div className="conv-foot">
            AI AUTO REPLY: <b>ON</b> — 自動応答中<br />
            QUEUE: <b>0</b> WAITING / 待機なし
          </div>
        </aside>

        <main className="chat">
          <span className="bracket tl" style={{ top: '10px', left: '10px' }} />
          <span className="bracket br" style={{ bottom: '10px', right: '10px' }} />
          <div className="dots" style={{ top: '84px', right: '26px', width: '90px', height: '44px', opacity: '.35' }} />

          <div className="chat-head">
            <span className="av big">77</span>
            <div className="who">
              <b>{sessionName}</b>
              <span className="st"><i />AI PICKED UP — 自動応答中 / AI 已接入</span>
            </div>
            <span className="no">NO.7742</span>
            <div className="ch-acts">
              <button type="button" title="Transfer / 転送">⇄</button>
              <button type="button" title="Close / 閉じる">✕</button>
            </div>
          </div>

          <div ref={messagesRef} className="msgs">
            {messages.map((msg) => (
              <div key={msg.id} className={`msg ${msg.role}`}>
                <span className="av">{msg.role === 'ai' ? 'AI' : 'YOU'}</span>
                <div className="bubble">
                  <div className="b-meta">
                    <span>{msg.role === 'ai' ? 'AICS BOT' : 'GUEST_7742'}</span>
                    <time>{msg.time}</time>
                  </div>
                  <p dangerouslySetInnerHTML={{ __html: msg.html }} />
                </div>
              </div>
            ))}

            {isTyping ? (
              <div className="msg ai">
                <span className="av">AI</span>
                <div className="bubble">
                  <div className="b-meta">
                    <span>AICS BOT</span>
                    <time>{formatTime()}</time>
                  </div>
                  <span className="typing"><i /><i /><i /></span>
                </div>
              </div>
            ) : null}
          </div>

          <div className="quick">
            {QUICK_PROMPTS.map((entry) => (
              <button key={entry.label} type="button" onClick={() => handleQuickReply(entry.value)}>
                {entry.label.split(' / ')[0]} <span>/</span> {entry.label.split(' / ')[1]}
              </button>
            ))}
          </div>

          <div className="inputer">
            <button type="button" className="attach" title="Attach / 添付">＋</button>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendMessage(input);
              }}
              placeholder="メッセージを入力… / 输入消息，Enter 发送"
              autoComplete="off"
            />
            <button type="button" className="send" onClick={() => sendMessage(input)}>
              SEND <span>⟶</span>
            </button>
          </div>

          <p className="hint">
            * DEMO BUILD — 后端接口预留 <b>sendToBackend()</b> · バックエンド未接続 / 目前为本地演示回复
          </p>
        </main>

        <aside className="meta">
          <p className="kicker">INFO <span>///</span> 情報</p>

          <div className="m-card">
            <h4>VISITOR / 来訪者</h4>
            <div className="kv"><span>NAME</span><b>{sessionName}</b></div>
            <div className="kv"><span>LANG</span><b className="p">JP / 中 / EN</b></div>
            <div className="kv"><span>JOINED</span><b>今日 21:47</b></div>
            <div className="kv"><span>STATUS</span><b className="l">未ログイン</b></div>
          </div>

          <div className="m-card">
            <h4>AI STATUS / 状態</h4>
            <div className="bar pu">
              <div className="bl"><span>CONFIDENCE / 信頼度</span><b>{confidence}%</b></div>
              <div className="tr"><i style={{ width: `${confidence}%` }} /></div>
            </div>
            <div className="bar" style={{ marginTop: '12px' }}>
              <div className="bl"><span>LOAD / 負荷</span><b>32%</b></div>
              <div className="tr"><i style={{ width: '32%' }} /></div>
            </div>
            <div className="kv" style={{ marginTop: '10px' }}>
              <span>INTENT</span>
              <b className="p">{intent}</b>
            </div>
          </div>

          <div className="m-card">
            <h4>SYS LOG / ログ</h4>
            <div className="log">
              {logs.map((line) => (
                <div key={line.id} dangerouslySetInnerHTML={{ __html: `[${formatStamp()}] <b>></b> ${line.ok ? '<em>' + line.text + '</em>' : line.text}` }} />
              ))}
            </div>
          </div>

          <span className="vjp">ただいま自動応答中</span>
        </aside>
      </div>

      <div className="grain" />
      <div className="scan" />
    </>
  );
}
