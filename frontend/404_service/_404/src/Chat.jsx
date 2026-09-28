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
  button:focus-visible, input:focus-visible, [role="button"]:focus-visible{ outline: 2px solid var(--lime); outline-offset: 3px; }
  button:disabled{ cursor: not-allowed; opacity: .45; }
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
  .chat-head .who .st.transferred{ color: var(--purple); }
  .chat-head .who .st.transferred i{ background: var(--purple); box-shadow: 0 0 8px rgba(139,92,246,.8); }
  .chat-head .who .st.closed{ color: var(--gray); }
  .chat-head .who .st.closed i{ background: var(--gray); box-shadow: none; }
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
  .msg.system{ max-width: 100%; width: 100%; justify-content: center; }
  .msg.system .divider{ width: 100%; }
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
  .bubble p{ font: 400 13px/1.9 "Noto Sans JP", "Space Grotesk", sans-serif; letter-spacing: .4px; white-space: pre-wrap; overflow-wrap: anywhere; }
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
  .empty-state{ padding: 16px; color: var(--gray); font: 400 10px/1.6 "Space Mono", monospace; }
  .file-input{ display: none; }
  .mobile-session-toggle{ display: none; }

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
  .log .success{ color: var(--lime); }
  .mobile-scrim{ display: none; }

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
    .conv.mobile-open{ display: flex; position: fixed; z-index: 30; top: 62px; bottom: 0; left: 0; width: min(320px, 86vw); box-shadow: 12px 0 32px rgba(0,0,0,.5); }
    .mobile-scrim{ display: block; position: fixed; z-index: 20; inset: 62px 0 0; border: 0; background: rgba(0,0,0,.55); }
    .mobile-session-toggle{ display: inline-flex; align-items: center; justify-content: center; min-height: 32px; padding: 0 8px; border: 1px solid var(--line); color: var(--ink); background: transparent; font: 700 9px/1 "Space Mono", monospace; letter-spacing: 1px; cursor: pointer; }
    .brand{ gap: 8px; }
    .brand-meta b{ letter-spacing: 1px; }
    .brand-meta span{ display: none; }
    .topbar{ padding: 0 10px; }
    .sys{ gap: 6px; font-size: 8px; letter-spacing: .5px; }
    .sys .sep{ display: none; }
    .clock{ display: none; }
    .msgs{ padding: 18px 14px 12px; }
    .quick{ padding: 0 14px 10px; gap: 6px; }
    .quick button{ padding: 8px; font-size: 8px; }
    .inputer{ padding: 10px 14px 8px; gap: 7px; }
    .attach{ width: 36px; }
    .send{ padding: 0 12px; }
    .hint{ padding: 0 14px 10px; font-size: 8px; }
    .msg{ max-width: 92%; }
  }
`;

const QUICK_PROMPTS = [
  { label: '费用 / 价格', value: '我想了解价格方案' },
  { label: '使用 / 指南', value: '请介绍一下如何使用' },
  { label: '人工 / 客服', value: '我想联系人工客服' },
];

const formatTime = () => new Date().toTimeString().slice(0, 5);
const formatStamp = () => new Date().toTimeString().slice(0, 8);
const STORAGE_KEY = 'aics-chat-sessions-v1';
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
const WELCOME_MESSAGE = '你好！这里是 AICS 智能客服的本地演示。发送消息或选择下方快捷提问，体验聊天功能。';

const createMessage = (role, content) => ({
  id: crypto.randomUUID(),
  role,
  content,
  time: formatTime(),
});

const createSeedMessage = (id, role, content, time) => ({ id, role, content, time });

const BUILT_IN_TRANSLATIONS = new Map([
  ['Hello! This is a local demo of AICS Smart Support. Send a message or choose a quick prompt to try the interface.', WELCOME_MESSAGE],
  ['Could you tell me about the pricing plans?', '想了解一下价格方案？'],
  ['Sure. This demo has no live pricing API, but the complete chat flow is running locally.', '目前尚未接入实时价格 API，不过聊天流程已可在本地完整体验。'],
  ['How do I get help with pricing?', '我该如何咨询价格？'],
  ['Pricing details are not connected to a live service yet. This local demo confirms your message was received.', '目前尚未接入实时价格服务，本地演示已收到你的消息。'],
  ['Thank you, that solved it!', '谢谢，问题解决了！'],
  ['You are welcome. Let me know if you need anything else.', '不客气！如果还有其他问题，欢迎随时告诉我。'],
  ['What are the API rate limits?', 'API 的调用频率限制是多少？'],
  ['This is a local demo, so live API limits are not available yet.', '这是本地演示，目前还无法查询实时 API 调用限制。'],
  ['Could you connect me with an agent?', '可以帮我转接人工客服吗？'],
  ['Conversation transferred to a human agent.', '会话已转接给人工客服。'],
  ['Page not found…', '页面未找到……'],
  ['This is a sample conversation in the local demo.', '这是一段本地演示会话。'],
  ['New conversation', '新会话'],
  ['Conversation closed.', '会话已关闭。'],
  ['Conversation reopened.', '会话已重新开启。'],
  ['AI auto-reply resumed.', 'AI 自动回复已恢复。'],
  ['LOCAL DEMO READY', '本地演示已就绪'],
  ['API NOT CONFIGURED', 'API 尚未配置'],
  ['LOCAL DEMO REPLY SENT', '本地演示回复已发送'],
  ['NEW SESSION STARTED', '已新建会话'],
  ['TRANSFERRED TO HUMAN', '已转接人工客服'],
  ['AI AUTO-REPLY RESUMED', 'AI 自动回复已恢复'],
  ['SESSION CLOSED', '会话已关闭'],
  ['SESSION REOPENED', '会话已重新开启'],
  ['pricing', '价格咨询'],
  ['general inquiry', '一般咨询'],
  ['API support', 'API 支持'],
  ['human support', '人工客服'],
  ['page support', '页面问题'],
]);

function translateBuiltInText(text) {
  if (text.startsWith('Attached file: ')) return `已添加附件：${text.slice('Attached file: '.length)}`;
  return BUILT_IN_TRANSLATIONS.get(text) ?? text;
}

const createInitialSessions = () => [
  {
    id: '77', name: 'GUEST_7742', time: '21:47', preview: '想了解一下价格方案？', unread: 2,
    status: 'active', intent: '价格咨询', confidence: 87,
    messages: [
      createSeedMessage('77-welcome', 'ai', WELCOME_MESSAGE, '21:47'),
      createSeedMessage('77-user-1', 'user', '想了解一下价格方案？', '21:47'),
      createSeedMessage('77-ai-1', 'ai', '目前尚未接入实时价格 API，不过聊天流程已可在本地完整体验。', '21:47'),
    ],
  },
  {
    id: 'MK', name: 'MIKA_T', time: '20:12', preview: '谢谢，问题解决了！', unread: 0,
    status: 'active', intent: '一般咨询', confidence: 92,
    messages: [
      createSeedMessage('mk-user-1', 'user', '谢谢，问题解决了！', '20:12'),
      createSeedMessage('mk-ai-1', 'ai', '不客气！如果还有其他问题，欢迎随时告诉我。', '20:12'),
    ],
  },
  {
    id: 'DN', name: 'DEV_NULL', time: '18:03', preview: 'API 的调用频率限制是多少？', unread: 1,
    status: 'active', intent: 'API 支持', confidence: 78,
    messages: [
      createSeedMessage('dn-user-1', 'user', 'API 的调用频率限制是多少？', '18:03'),
      createSeedMessage('dn-ai-1', 'ai', '这是本地演示，目前还无法查询实时 API 调用限制。', '18:03'),
    ],
  },
  {
    id: 'HM', name: 'HUMAN_REQ', time: '16:40', preview: '可以帮我转接人工客服吗？', unread: 0,
    status: 'transferred', intent: '人工客服', confidence: 96,
    messages: [
      createSeedMessage('hm-user-1', 'user', '可以帮我转接人工客服吗？', '16:40'),
      createSeedMessage('hm-system-1', 'system', '会话已转接给人工客服。', '16:40'),
    ],
  },
  {
    id: '40', name: 'GUEST_4004', time: '昨天', preview: '页面未找到……', unread: 0,
    status: 'closed', intent: '页面问题', confidence: 84,
    messages: [
      createSeedMessage('40-user-1', 'user', '页面未找到……', '昨天'),
      createSeedMessage('40-ai-1', 'ai', '这是一段本地演示会话。', '昨天'),
    ],
  },
];

function loadSessions() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved) && saved.length && saved.every((session) => Array.isArray(session.messages))) {
      return saved.map((session) => ({
        ...session,
        time: session.time === 'YESTERDAY' ? '昨天' : session.time,
        preview: translateBuiltInText(session.preview),
        intent: translateBuiltInText(session.intent),
        messages: session.messages.map((message) => ({ ...message, content: translateBuiltInText(message.content) })),
      }));
    }
  } catch {
    // Use the sample sessions when browser storage is unavailable or invalid.
  }
  return createInitialSessions();
}

function getLocalReply(message, status) {
  if (status === 'transferred') return '人工客服已收到你的消息。当前为本地演示，暂未连接真实客服。';

  const text = message.toLowerCase();
  if (/price|pricing|cost|费用|价格/.test(text)) return '目前尚未接入实时价格服务，本地演示已收到你的消息。';
  if (/how to|how do|guide|使用|怎么|介绍/.test(text)) return '你可以选择快捷提问，也可以直接输入消息。接入 API 后即可使用实时智能回复。';
  if (/human|agent|人工|客服/.test(text)) return '已为你标记人工客服需求。你也可以使用会话顶部的转接按钮切换处理状态。';
  return '谢谢你的消息！这是本地演示回复，接入 API 后即可使用实时智能助手。';
}

export default function Chat() {
  const messagesRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const activeSessionIdRef = useRef('77');
  const [clock, setClock] = useState(formatStamp());
  const [sessions, setSessions] = useState(() => loadSessions().map((session) => session.id === '77' ? { ...session, unread: 0 } : session));
  const [activeSessionId, setActiveSessionId] = useState('77');
  const [searchQuery, setSearchQuery] = useState('');
  const [input, setInput] = useState('');
  const [typingSessionId, setTypingSessionId] = useState(null);
  const [isSessionListOpen, setIsSessionListOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState('等待调用');
  const [logs, setLogs] = useState([
    { id: 1, text: '本地演示已就绪', ok: true },
    { id: 2, text: 'API 尚未配置', ok: false },
  ]);
  const activeSession = sessions.find((session) => session.id === activeSessionId) || sessions[0];
  const visibleSessions = sessions.filter((session) => `${session.name} ${session.preview}`.toLowerCase().includes(searchQuery.toLowerCase()));
  const isTyping = typingSessionId === activeSession?.id;

  useEffect(() => {
    const timer = setInterval(() => setClock(formatStamp()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    activeSessionIdRef.current = activeSessionId;
  }, [activeSessionId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch {
      // Chat remains usable for the current page even if storage is unavailable.
    }
  }, [sessions]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [activeSession?.messages, isTyping]);

  const addLog = (text, ok = false) => {
    setLogs((prev) => [{ id: Date.now() + Math.random(), text, ok }, ...prev].slice(0, 6));
  };

  const appendToSession = (sessionId, message, preview = message.content, incrementUnread = false) => {
    setSessions((previous) => previous.map((session) => session.id === sessionId
      ? {
        ...session,
        messages: [...session.messages, message],
        preview,
        time: formatTime(),
        unread: incrementUnread && activeSessionIdRef.current !== sessionId ? session.unread + 1 : session.unread,
      }
      : session));
  };

  const sendMessage = async (text) => {
    const value = (text || '').trim();
    if (!value || typingSessionId || !activeSession || activeSession.status === 'closed') return;

    const sessionId = activeSession.id;
    const status = activeSession.status;
    const userMessage = createMessage('user', value);
    appendToSession(sessionId, userMessage);
    addLog(`已发送消息：“${value.slice(0, 18)}${value.length > 18 ? '…' : ''}”`);
    setInput('');
    setTypingSessionId(sessionId);

    let replyText;
    let usedFallback = false;
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ message: value, session_id: sessionId }),
      });
      if (!response.ok) throw new Error(`Chat API returned ${response.status}`);
      const data = await response.json();
      if (typeof data.reply !== 'string' || !data.reply.trim()) throw new Error('Chat API returned an empty reply');
      replyText = data.reply;
      setApiStatus('已连接');
    } catch (error) {
      console.warn('Chat API unavailable; using local fallback:', error);
      replyText = getLocalReply(value, status);
      usedFallback = true;
      setApiStatus('未连接');
    }

    window.setTimeout(() => {
      const reply = createMessage('ai', replyText);
      appendToSession(sessionId, reply, reply.content, true);
      setTypingSessionId(null);
      addLog(usedFallback ? '后端不可用，已使用本地回复' : '后端回复已接收', !usedFallback);
      setSessions((previous) => previous.map((session) => session.id === sessionId
        ? { ...session, confidence: 72 + (value.length % 25), intent: value.slice(0, 24) }
        : session));
      inputRef.current?.focus();
    }, 800);
  };

  const handleQuickReply = (value) => {
    sendMessage(value);
  };

  const handleNewChat = () => {
    const id = String(Date.now()).slice(-4);
    const session = {
      id,
      name: `GUEST_${id}`,
      time: formatTime(),
      preview: 'New conversation',
      unread: 0,
      status: 'active',
      intent: '一般咨询',
      confidence: 100,
      messages: [createMessage('ai', WELCOME_MESSAGE)],
    };
    setSessions((previous) => [session, ...previous]);
    activeSessionIdRef.current = id;
    setActiveSessionId(id);
    setIsSessionListOpen(false);
    setInput('');
    addLog('已新建会话', true);
  };

  const handleSelectSession = (sessionId) => {
    activeSessionIdRef.current = sessionId;
    setActiveSessionId(sessionId);
    setSessions((previous) => previous.map((session) => session.id === sessionId ? { ...session, unread: 0 } : session));
    setIsSessionListOpen(false);
  };

  const handleTransfer = () => {
    if (!activeSession || activeSession.status === 'closed') return;
    const status = activeSession.status === 'transferred' ? 'active' : 'transferred';
    const notice = status === 'transferred' ? '会话已转接给人工客服。' : 'AI 自动回复已恢复。';
    appendToSession(activeSession.id, createMessage('system', notice), notice);
    setSessions((previous) => previous.map((session) => session.id === activeSession.id ? { ...session, status } : session));
    addLog(status === 'transferred' ? '已转接人工客服' : 'AI 自动回复已恢复', true);
  };

  const handleToggleClosed = () => {
    if (!activeSession) return;
    const status = activeSession.status === 'closed' ? 'active' : 'closed';
    const notice = status === 'closed' ? '会话已关闭。' : '会话已重新开启。';
    appendToSession(activeSession.id, createMessage('system', notice), notice);
    setSessions((previous) => previous.map((session) => session.id === activeSession.id ? { ...session, status } : session));
    addLog(status === 'closed' ? '会话已关闭' : '会话已重新开启', true);
  };

  const handleFilesSelected = (event) => {
    const files = Array.from(event.target.files || []);
    files.forEach((file) => {
      const message = createMessage('user', `已添加附件：${file.name}`);
      appendToSession(activeSession.id, message);
      addLog(`已添加附件：${file.name}`);
    });
    event.target.value = '';
  };

  return (
    <>
      <style>{styles}</style>
      <div className="chat-app">
        <header className="topbar">
          <button className="mobile-session-toggle" type="button" onClick={() => setIsSessionListOpen((open) => !open)} aria-expanded={isSessionListOpen}>
            会话
          </button>
          <div className="brand">
            <span className="logo">AI<b>CS</b></span>
            <div className="brand-meta">
              <b>智能客服</b>
              <span>AICS 智能客服 v0.1</span>
            </div>
          </div>

          <div className="sys">
            <span className="live"><i />前端运行中 / 已连接</span>
            <span className="sep" />
            <span>
              <b className={apiStatus === '已连接' ? 'on' : 'off'}>{apiStatus === '已连接' ? '后端已连接' : `后端：${apiStatus}`}</b>
            </span>
            <span>回复：<b style={{ color: 'var(--ink)' }}>{apiStatus === '已连接' ? 'FastAPI' : '本地兜底'}</b></span>
          </div>

          <div className="clock">{clock}</div>
        </header>

        {isSessionListOpen ? <button className="mobile-scrim" type="button" aria-label="关闭会话列表" onClick={() => setIsSessionListOpen(false)} /> : null}

        <aside className={`conv ${isSessionListOpen ? 'mobile-open' : ''}`}>
          <div className="dots" style={{ top: '8px', right: '10px', width: '56px', height: '30px', opacity: '.4' }} />
          <div className="conv-head">
            <p className="kicker">会话 <span>///</span> 历史</p>
            <button className="new-chat" onClick={handleNewChat}>+ 新建会话</button>
          </div>

          <div className="search">
            <input type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="搜索会话……" aria-label="搜索会话" />
          </div>

          <div className="conv-list">
            {visibleSessions.length ? visibleSessions.map((item) => (
              <div
                key={item.id}
                className={`conv-item ${item.id === activeSession?.id ? 'active' : ''}`}
                onClick={() => handleSelectSession(item.id)}
                role="button"
                tabIndex={0}
                aria-pressed={item.id === activeSession?.id}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectSession(item.id);
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
                {item.unread ? <i className="badge">{item.unread}</i> : null}
              </div>
            )) : <p className="empty-state">没有找到匹配的会话</p>}
          </div>

          <div className="conv-foot">
            AI 自动回复：<b>{sessions.filter((session) => session.status === 'active').length}</b> 个进行中<br />
            未读消息：<b>{sessions.reduce((total, session) => total + session.unread, 0)}</b> 条
          </div>
        </aside>

        <main className="chat">
          <span className="bracket tl" style={{ top: '10px', left: '10px' }} />
          <span className="bracket br" style={{ bottom: '10px', right: '10px' }} />
          <div className="dots" style={{ top: '84px', right: '26px', width: '90px', height: '44px', opacity: '.35' }} />

          <div className="chat-head">
            <span className="av big">{activeSession.id}</span>
            <div className="who">
              <b>{activeSession.name}</b>
              <span className={`st ${activeSession.status}`}>
                <i />
                {activeSession.status === 'closed' ? '会话已关闭' : activeSession.status === 'transferred' ? '人工客服处理中' : 'AI 自动回复中'}
              </span>
            </div>
            <span className="no">会话编号：{activeSession.id}</span>
            <div className="ch-acts">
              <button type="button" title={activeSession.status === 'transferred' ? '恢复 AI 自动回复' : '转接人工客服'} onClick={handleTransfer} disabled={activeSession.status === 'closed'}>
                ⇄
              </button>
              <button type="button" title={activeSession.status === 'closed' ? '重新开启会话' : '关闭会话'} onClick={handleToggleClosed}>
                {activeSession.status === 'closed' ? '↻' : '✕'}
              </button>
            </div>
          </div>

          <div ref={messagesRef} className="msgs">
            {activeSession.messages.map((msg) => (
              msg.role === 'system' ? (
                <div key={msg.id} className="msg system"><div className="divider">{msg.content}</div></div>
              ) : (
                <div key={msg.id} className={`msg ${msg.role}`}>
                  <span className="av">{msg.role === 'ai' ? 'AI' : '访客'}</span>
                  <div className="bubble">
                    <div className="b-meta">
                      <span>{msg.role === 'ai' ? 'AICS 客服' : activeSession.name}</span>
                      <time>{msg.time}</time>
                    </div>
                    <p>{msg.content}</p>
                  </div>
                </div>
              )
            ))}

            {isTyping ? (
              <div className="msg ai">
                <span className="av">AI</span>
                <div className="bubble">
                  <div className="b-meta">
                    <span>AICS 客服</span>
                    <time>{formatTime()}</time>
                  </div>
                  <span className="typing"><i /><i /><i /></span>
                </div>
              </div>
            ) : null}
          </div>

          <div className="quick">
            {QUICK_PROMPTS.map((entry) => (
              <button key={entry.label} type="button" onClick={() => handleQuickReply(entry.value)} disabled={isTyping || activeSession.status === 'closed'}>
                {entry.label}
              </button>
            ))}
          </div>

          <div className="inputer">
            <button type="button" className="attach" title="添加附件" onClick={() => fileInputRef.current?.click()} disabled={activeSession.status === 'closed'}>＋</button>
            <input ref={fileInputRef} className="file-input" type="file" multiple onChange={handleFilesSelected} />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder="输入消息，按 Enter 发送……"
              autoComplete="off"
              disabled={activeSession.status === 'closed' || isTyping}
            />
            <button type="button" className="send" onClick={() => sendMessage(input)} disabled={!input.trim() || isTyping || activeSession.status === 'closed'}>
              发送 <span>⟶</span>
            </button>
          </div>

          <p className="hint">
            {activeSession.status === 'closed' ? '会话已关闭 — 重新开启后即可发送消息' : '本地演示 — 消息保存在当前浏览器中'}
          </p>
        </main>

        <aside className="meta">
          <p className="kicker">信息 <span>///</span> 状态</p>

          <div className="m-card">
            <h4>访客信息</h4>
            <div className="kv"><span>名称</span><b>{activeSession.name}</b></div>
            <div className="kv"><span>语言</span><b className="p">中文</b></div>
            <div className="kv"><span>最近活跃</span><b>{activeSession.time}</b></div>
            <div className="kv"><span>状态</span><b className="l">{activeSession.status === 'closed' ? '已关闭' : activeSession.status === 'transferred' ? '人工处理中' : '进行中'}</b></div>
          </div>

          <div className="m-card">
            <h4>AI 状态</h4>
            <div className="bar pu">
              <div className="bl"><span>置信度</span><b>{activeSession.confidence}%</b></div>
              <div className="tr"><i style={{ width: `${activeSession.confidence}%` }} /></div>
            </div>
            <div className="bar" style={{ marginTop: '12px' }}>
              <div className="bl"><span>负载</span><b>32%</b></div>
              <div className="tr"><i style={{ width: '32%' }} /></div>
            </div>
            <div className="kv" style={{ marginTop: '10px' }}>
              <span>意图</span>
              <b className="p">{activeSession.intent}</b>
            </div>
          </div>

          <div className="m-card">
            <h4>系统日志</h4>
            <div className="log">
              {logs.map((line) => (
                <div key={line.id} className={line.ok ? 'success' : ''}>[{formatStamp()}] &gt; {line.text}</div>
              ))}
            </div>
          </div>

          <span className="vjp">AI 自动回复中</span>
        </aside>
      </div>

      <div className="grain" />
      <div className="scan" />
    </>
  );
}
