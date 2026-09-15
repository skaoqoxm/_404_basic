import { useEffect, useState } from 'react'
import { authApi, itemApi } from './api'
import './index.css'

function App() {
  const [activePage, setActivePage] = useState('dashboard')
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [items, setItems] = useState([])
  const [userSearch, setUserSearch] = useState('')
  const [userPage, setUserPage] = useState(1)
  const pageSize = 5
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersError, setUsersError] = useState('')
  const [registerForm, setRegisterForm] = useState({ username: '', email: '', password: '', confirmPassword: '' })
  const [registerError, setRegisterError] = useState('')
  const [registerSuccess, setRegisterSuccess] = useState('')
  const [registerLoading, setRegisterLoading] = useState(false)
  const breadcrumbMap = {
    dashboard: 'Dashboard',
    crud: 'Data Management',
    login: 'Sign In',
    register: 'Sign Up',
    api: 'API Documentation',
    schema: 'Database Design',
  }

  const switchPage = (pageName) => {
    setActivePage(pageName)
  }

  const toggleEndpoint = (event) => {
    event.currentTarget.classList.toggle('open')
  }

  const reloadUsers = async () => {
    const data = await authApi.users()
    setUsers(data)
  }

  useEffect(() => {
    if (activePage !== 'dashboard' && activePage !== 'crud') return

    let cancelled = false
    setUsersLoading(true)
    setUsersError('')
    Promise.all([authApi.users(), itemApi.list()])
      .then(([userData, itemData]) => {
        if (!cancelled) {
          setUsers(userData)
          setItems(itemData)
        }
      })
      .catch((error) => {
        if (!cancelled) setUsersError(error.message)
      })
      .finally(() => {
        if (!cancelled) setUsersLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [activePage])

  const handleLogin = async (event) => {
    event.preventDefault()
    setLoginError('')
    setLoginLoading(true)

    try {
      await authApi.login(loginUsername, loginPassword)
      setActivePage('dashboard')
    } catch (error) {
      setLoginError(error.message)
    } finally {
      setLoginLoading(false)
    }
  }

  const handleRegister = async (event) => {
    event.preventDefault()
    setRegisterError('')
    setRegisterSuccess('')
    if (registerForm.password !== registerForm.confirmPassword) {
      setRegisterError('两次输入的密码不一致')
      return
    }

    setRegisterLoading(true)
    try {
      await authApi.register({
        username: registerForm.username,
        email: registerForm.email,
        password: registerForm.password,
      })
      setRegisterSuccess('注册成功，请返回登录')
      setRegisterForm({ username: '', email: '', password: '', confirmPassword: '' })
    } catch (error) {
      setRegisterError(error.message)
    } finally {
      setRegisterLoading(false)
    }
  }

  const handleViewUser = (user) => {
    window.alert(`用户：${user.username}\n邮箱：${user.email}\n状态：${user.is_active ? '已启用' : '已停用'}`)
  }

  const handleEditUser = async (user) => {
    const username = window.prompt('修改用户名', user.username)
    if (!username || username === user.username) return
    try {
      await authApi.update(user.id, { username })
      await reloadUsers()
    } catch (error) {
      window.alert(error.message)
    }
  }

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`确定删除用户 ${user.username} 吗？`)) return
    try {
      await authApi.remove(user.id)
      await reloadUsers()
    } catch (error) {
      window.alert(error.message)
    }
  }

  const handleExportUsers = () => {
    const csv = ['ID,Username,Email,Active,Created At', ...users.map((user) => [
      user.id,
      user.username,
      user.email,
      user.is_active ? 'true' : 'false',
      user.created_at,
    ].map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','))].join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'users.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const filteredUsers = users.filter((user) => {
    const keyword = userSearch.trim().toLowerCase()
    return !keyword || user.username.toLowerCase().includes(keyword) || user.email.toLowerCase().includes(keyword)
  })
  const totalUserPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize))
  const pagedUsers = filteredUsers.slice((userPage - 1) * pageSize, userPage * pageSize)

  return (


<div className="app">

  
  <aside className="sidebar">
    <div className="sidebar-logo">
      <div className="sidebar-badge">BASIC</div>
      <div className="logo-mark">
        <div className="logo-icon">
          <svg viewBox="0 0 36 36" fill="none">
            <rect x="4" y="4" width="28" height="28" rx="4" stroke="url(#logoGrad)" strokeWidth="2"></rect>
            <path d="M12 20L16 24L24 14" stroke="url(#logoGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path>
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: "#7C3AED"}}></stop>
                <stop offset="100%" style={{stopColor: "#A855F7"}}></stop>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div>
          <div className="logo-text">NEXUS</div>
          <div className="logo-sub">Full-Stack Platform</div>
        </div>
      </div>
    </div>

    <nav className="sidebar-nav">
      <div className="nav-section">
        <div className="nav-label">Overview · 概览</div>
        <div className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`} onClick={() => switchPage('dashboard')}>
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          <span>Dashboard · 数据面板</span>
        </div>
        <div className={`nav-item ${activePage === 'crud' ? 'active' : ''}`} onClick={() => switchPage('crud')}>
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="8" y1="13" x2="16" y2="13"></line>
            <line x1="8" y1="17" x2="16" y2="17"></line>
          </svg>
          <span>Data List · 数据管理</span>
        </div>
      </div>

      <div className="nav-section">
        <div className="nav-label">Auth · 认证</div>
        <div className={`nav-item ${activePage === 'login' ? 'active' : ''}`} onClick={() => switchPage('login')}>
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
            <polyline points="10 17 15 12 10 7"></polyline>
            <line x1="15" y1="12" x2="3" y2="12"></line>
          </svg>
          <span>Sign In · 登录</span>
        </div>
        <div className={`nav-item ${activePage === 'register' ? 'active' : ''}`} onClick={() => switchPage('register')}>
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="8.5" cy="7" r="4"></circle>
            <line x1="20" y1="8" x2="20" y2="14"></line>
            <line x1="23" y1="11" x2="17" y2="11"></line>
          </svg>
          <span>Sign Up · 注册</span>
        </div>
      </div>

      <div className="nav-section">
        <div className="nav-label">Docs · 文档</div>
        <div className={`nav-item ${activePage === 'api' ? 'active' : ''}`} onClick={() => switchPage('api')}>
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
          <span>API Docs · 接口文档</span>
        </div>
        <div className={`nav-item ${activePage === 'schema' ? 'active' : ''}`} onClick={() => switchPage('schema')}>
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
          </svg>
          <span>Database · 数据库设计</span>
        </div>
      </div>

      <div className="nav-section">
        <div className="nav-label">Stack · 技术栈</div>
        <div className="nav-item">
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span>FastAPI · Python后端</span>
        </div>
        <div className="nav-item">
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span>JWT · 用户认证</span>
        </div>
      </div>
    </nav>

    <div className="sidebar-footer">
      <div className="user-card">
        <div className="user-avatar">AD</div>
        <div className="user-info">
          <div className="user-name">Admin User</div>
          <div className="user-role">管理员 · Administrator</div>
        </div>
      </div>
    </div>
  </aside>

  
  <main className="main">
    <div className="geo-bg">
      <div className="geo-grid"></div>
      <div className="geo-shape s1"></div>
      <div className="geo-shape s2"></div>
      <div className="geo-shape s3"></div>
      <div className="geo-shape s4"></div>
    </div>

    
    <header className="topbar">
      <div className="breadcrumb">
        <span className="crumb">NEXUS</span>
        <span className="sep">/</span>
        <span className="crumb current" id="breadcrumb-current">{breadcrumbMap[activePage]}</span>
      </div>
      <div className="topbar-actions">
        <button className="icon-btn" title="通知">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </button>
        <button className="icon-btn" title="设置">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </button>
      </div>
    </header>

    
    <div className="page-content">

      
      <div className={`page ${activePage === 'dashboard' ? 'active' : ''}`} >
        <div className="page-header">
          <div className="page-title-row">
            <h1 className="page-title">
              Dashboard
              <span className="title-en">Data Overview</span>
            </h1>
          </div>
          <p className="page-desc">实时数据概览面板，展示系统核心指标与运行状态。Real-time data overview with core system metrics.</p>
        </div>

        
        <div className="stats-grid">
          <div className="stat-card purple">
            <div className="geo-accent"></div>
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div className="stat-value">{users.length}</div>
            <div className="stat-label">总用户数 · Total Users</div>
            <div className="stat-trend up">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
              12.5%
            </div>
          </div>

          <div className="stat-card dark">
            <div className="geo-accent"></div>
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
              </svg>
            </div>
            <div className="stat-value">{items.length}</div>
            <div className="stat-label">数据条目 · Data Entries</div>
            <div className="stat-trend up">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
              8.2%
            </div>
          </div>

          <div className="stat-card purple">
            <div className="geo-accent"></div>
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div className="stat-value">98.7%</div>
            <div className="stat-label">系统可用 · Uptime</div>
            <div className="stat-trend up">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
              0.3%
            </div>
          </div>

          <div className="stat-card dark">
            <div className="geo-accent"></div>
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <div className="stat-value">24ms</div>
            <div className="stat-label">响应延迟 · Avg Latency</div>
            <div className="stat-trend down">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
              5ms
            </div>
          </div>
        </div>

        
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">
              Recent Data
              <span className="en">· 最新数据</span>
            </div>
            <div className="panel-actions">
              <button className="btn btn-outline btn-sm">查看全部 · View All</button>
            </div>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>名称 · Name</th>
                <th>分类 · Category</th>
                <th>状态 · Status</th>
                <th>创建时间 · Created</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 5).map((user) => (
                <tr key={user.id}>
                  <td><code>#{String(user.id).padStart(3, '0')}</code></td>
                  <td>
                    <div className="cell-with-avatar">
                      <div className="table-avatar">{user.username.slice(0, 2).toUpperCase()}</div>
                      <div>
                        <div className="cell-name">{user.username}</div>
                        <div className="cell-sub">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>User</td>
                  <td><span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>{user.is_active ? 'Active' : 'Inactive'}</span></td>
                  <td style={{color: 'var(--muted)', fontSize: '12px'}}>{new Date(user.created_at).toLocaleString()}</td>
                </tr>
              ))}
              {usersLoading && <tr><td colSpan="5">正在加载用户数据...</td></tr>}
              {usersError && <tr><td colSpan="5">{usersError}</td></tr>}
              {!usersLoading && !usersError && users.length === 0 && <tr><td colSpan="5">数据库中暂无用户</td></tr>}
            </tbody>
            <tbody className="static-demo-data">
              <tr>
                <td><code style={{fontFamily: "'JetBrainsMono',monospace", fontSize: "11px", color: "var(--muted)"}}>#001</code></td>
                <td>
                  <div className="cell-with-avatar">
                    <div className="table-avatar">DA</div>
                    <div>
                      <div className="cell-name">Data Entry Alpha</div>
                      <div className="cell-sub">alpha@example.com</div>
                    </div>
                  </div>
                </td>
                <td>Category A</td>
                <td><span className="status-badge active">Active · 活跃</span></td>
                <td style={{color: "var(--muted)", fontSize: "12px"}}>2024-01-15 09:30</td>
              </tr>
              <tr>
                <td><code style={{fontFamily: "'JetBrainsMono',monospace", fontSize: "11px", color: "var(--muted)"}}>#002</code></td>
                <td>
                  <div className="cell-with-avatar">
                    <div className="table-avatar" style={{background: "linear-gradient(135deg,#FEF3C7,#fff)", color: "#92400E"}}>DB</div>
                    <div>
                      <div className="cell-name">Data Entry Beta</div>
                      <div className="cell-sub">beta@example.com</div>
                    </div>
                  </div>
                </td>
                <td>Category B</td>
                <td><span className="status-badge pending">Pending · 待审核</span></td>
                <td style={{color: "var(--muted)", fontSize: "12px"}}>2024-01-14 14:20</td>
              </tr>
              <tr>
                <td><code style={{fontFamily: "'JetBrainsMono',monospace", fontSize: "11px", color: "var(--muted)"}}>#003</code></td>
                <td>
                  <div className="cell-with-avatar">
                    <div className="table-avatar" style={{background: "linear-gradient(135deg,#D1FAE5,#fff)", color: "#065F46"}}>DG</div>
                    <div>
                      <div className="cell-name">Data Entry Gamma</div>
                      <div className="cell-sub">gamma@example.com</div>
                    </div>
                  </div>
                </td>
                <td>Category A</td>
                <td><span className="status-badge active">Active · 活跃</span></td>
                <td style={{color: "var(--muted)", fontSize: "12px"}}>2024-01-13 11:45</td>
              </tr>
              <tr>
                <td><code style={{fontFamily: "'JetBrainsMono',monospace", fontSize: "11px", color: "var(--muted)"}}>#004</code></td>
                <td>
                  <div className="cell-with-avatar">
                    <div className="table-avatar" style={{background: "linear-gradient(135deg,#FEE2E2,#fff)", color: "#991B1B"}}>DD</div>
                    <div>
                      <div className="cell-name">Data Entry Delta</div>
                      <div className="cell-sub">delta@example.com</div>
                    </div>
                  </div>
                </td>
                <td>Category C</td>
                <td><span className="status-badge inactive">Inactive · 已停用</span></td>
                <td style={{color: "var(--muted)", fontSize: "12px"}}>2024-01-12 16:00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      
      <div className={`page ${activePage === 'crud' ? 'active' : ''}`} id="page-crud">
        <div className="page-header">
          <div className="page-title-row">
            <h1 className="page-title">
              Data Management
              <span className="title-en">CRUD Operations</span>
            </h1>
            <button className="btn btn-primary" onClick={() => switchPage('register')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              新建数据 · New Entry
            </button>
          </div>
          <p className="page-desc">完整的数据增删改查管理界面。Full CRUD operations for data management.</p>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">
              数据列表
              <span className="en">· Data List</span>
            </div>
            <div className="panel-actions">
              <div className="search-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input type="text" placeholder="搜索... Search" value={userSearch} onChange={(event) => { setUserSearch(event.target.value); setUserPage(1) }} />
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => { setUserSearch(''); setUserPage(1) }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
                筛选
              </button>
              <button className="btn btn-outline btn-sm" onClick={handleExportUsers}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                导出
              </button>
            </div>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th style={{width: "40px"}}>
                  <input type="checkbox" style={{accentColor: "var(--accent)"}} />
                </th>
                <th>ID</th>
                <th>名称 · Name</th>
                <th>邮箱 · Email</th>
                <th>角色 · Role</th>
                <th>状态 · Status</th>
                <th>创建时间 · Created At</th>
                <th style={{width: "120px"}}>操作 · Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagedUsers.map((user) => (
                <tr key={user.id}>
                  <td><input type="checkbox" style={{ accentColor: 'var(--accent)' }} /></td>
                  <td><code>USR-{String(user.id).padStart(3, '0')}</code></td>
                  <td>
                    <div className="cell-with-avatar">
                      <div className="table-avatar">{user.username.slice(0, 2).toUpperCase()}</div>
                      <div>
                        <div className="cell-name">{user.username}</div>
                        <div className="cell-sub">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td><span className="role-badge">User</span></td>
                  <td><span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>{user.is_active ? 'Active' : 'Inactive'}</span></td>
                  <td style={{color: 'var(--muted)', fontSize: '12px'}}>{new Date(user.created_at).toLocaleString()}</td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn" title="查看" onClick={() => handleViewUser(user)}>查看</button>
                      <button className="action-btn" title="编辑" onClick={() => handleEditUser(user)}>编辑</button>
                      <button className="action-btn danger" title="删除" onClick={() => handleDeleteUser(user)}>删除</button>
                    </div>
                  </td>
                </tr>
              ))}
              {usersLoading && <tr><td colSpan="8">正在加载用户数据...</td></tr>}
              {usersError && <tr><td colSpan="8">{usersError}</td></tr>}
              {!usersLoading && !usersError && filteredUsers.length === 0 && <tr><td colSpan="8">数据库中暂无用户</td></tr>}
            </tbody>
            <tbody className="static-demo-data">
              <tr>
                <td><input type="checkbox" style={{accentColor: "var(--accent)"}} /></td>
                <td><code style={{fontFamily: "'JetBrainsMono',monospace", fontSize: "11px", color: "var(--muted)"}}>USR-001</code></td>
                <td>
                  <div className="cell-with-avatar">
                    <div className="table-avatar">ZH</div>
                    <div>
                      <div className="cell-name">张三 · Zhang San</div>
                      <div className="cell-sub">@zhangsan</div>
                    </div>
                  </div>
                </td>
                <td style={{fontFamily: "'JetBrainsMono',monospace", fontSize: "12px"}}>zhang@example.com</td>
                <td>
                  <span style={{background: "var(--accent-light)", color: "var(--accent-dark)", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "500"}}>Admin</span>
                </td>
                <td><span className="status-badge active">Active</span></td>
                <td style={{color: "var(--muted)", fontSize: "12px"}}>2024-01-15 09:30</td>
                <td>
                  <div className="action-btns">
                    <button className="action-btn" title="查看">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                    <button className="action-btn" title="编辑">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button className="action-btn danger" title="删除">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td><input type="checkbox" style={{accentColor: "var(--accent)"}} /></td>
                <td><code style={{fontFamily: "'JetBrainsMono',monospace", fontSize: "11px", color: "var(--muted)"}}>USR-002</code></td>
                <td>
                  <div className="cell-with-avatar">
                    <div className="table-avatar" style={{background: "linear-gradient(135deg,#FEF3C7,#fff)", color: "#92400E"}}>LS</div>
                    <div>
                      <div className="cell-name">李四 · Li Si</div>
                      <div className="cell-sub">@lisi</div>
                    </div>
                  </div>
                </td>
                <td style={{fontFamily: "'JetBrainsMono',monospace", fontSize: "12px"}}>li@example.com</td>
                <td>
                  <span style={{background: "rgba(10,10,15,0.08)", color: "var(--ink)", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "500"}}>Editor</span>
                </td>
                <td><span className="status-badge active">Active</span></td>
                <td style={{color: "var(--muted)", fontSize: "12px"}}>2024-01-14 14:20</td>
                <td>
                  <div className="action-btns">
                    <button className="action-btn" title="查看">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                    <button className="action-btn" title="编辑">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button className="action-btn danger" title="删除">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td><input type="checkbox" style={{accentColor: "var(--accent)"}} /></td>
                <td><code style={{fontFamily: "'JetBrainsMono',monospace", fontSize: "11px", color: "var(--muted)"}}>USR-003</code></td>
                <td>
                  <div className="cell-with-avatar">
                    <div className="table-avatar" style={{background: "linear-gradient(135deg,#D1FAE5,#fff)", color: "#065F46"}}>WW</div>
                    <div>
                      <div className="cell-name">王五 · Wang Wu</div>
                      <div className="cell-sub">@wangwu</div>
                    </div>
                  </div>
                </td>
                <td style={{fontFamily: "'JetBrainsMono',monospace", fontSize: "12px"}}>wang@example.com</td>
                <td>
                  <span style={{background: "rgba(107,107,122,0.1)", color: "var(--muted)", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "500"}}>Viewer</span>
                </td>
                <td><span className="status-badge pending">Pending</span></td>
                <td style={{color: "var(--muted)", fontSize: "12px"}}>2024-01-13 11:45</td>
                <td>
                  <div className="action-btns">
                    <button className="action-btn" title="查看">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                    <button className="action-btn" title="编辑">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button className="action-btn danger" title="删除">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td><input type="checkbox" style={{accentColor: "var(--accent)"}} /></td>
                <td><code style={{fontFamily: "'JetBrainsMono',monospace", fontSize: "11px", color: "var(--muted)"}}>USR-004</code></td>
                <td>
                  <div className="cell-with-avatar">
                    <div className="table-avatar" style={{background: "linear-gradient(135deg,#FEE2E2,#fff)", color: "#991B1B"}}>ZL</div>
                    <div>
                      <div className="cell-name">赵六 · Zhao Liu</div>
                      <div className="cell-sub">@zhaoliu</div>
                    </div>
                  </div>
                </td>
                <td style={{fontFamily: "'JetBrainsMono',monospace", fontSize: "12px"}}>zhao@example.com</td>
                <td>
                  <span style={{background: "rgba(107,107,122,0.1)", color: "var(--muted)", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "500"}}>Viewer</span>
                </td>
                <td><span className="status-badge inactive">Inactive</span></td>
                <td style={{color: "var(--muted)", fontSize: "12px"}}>2024-01-12 16:00</td>
                <td>
                  <div className="action-btns">
                    <button className="action-btn" title="查看">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                    <button className="action-btn" title="编辑">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button className="action-btn danger" title="删除">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td><input type="checkbox" style={{accentColor: "var(--accent)"}} /></td>
                <td><code style={{fontFamily: "'JetBrainsMono',monospace", fontSize: "11px", color: "var(--muted)"}}>USR-005</code></td>
                <td>
                  <div className="cell-with-avatar">
                    <div className="table-avatar" style={{background: "linear-gradient(135deg,#DBEAFE,#fff)", color: "#1E40AF"}}>SQ</div>
                    <div>
                      <div className="cell-name">孙七 · Sun Qi</div>
                      <div className="cell-sub">@sunqi</div>
                    </div>
                  </div>
                </td>
                <td style={{fontFamily: "'JetBrainsMono',monospace", fontSize: "12px"}}>sun@example.com</td>
                <td>
                  <span style={{background: "rgba(10,10,15,0.08)", color: "var(--ink)", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "500"}}>Editor</span>
                </td>
                <td><span className="status-badge active">Active</span></td>
                <td style={{color: "var(--muted)", fontSize: "12px"}}>2024-01-11 10:15</td>
                <td>
                  <div className="action-btns">
                    <button className="action-btn" title="查看">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                    <button className="action-btn" title="编辑">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button className="action-btn danger" title="删除">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="pagination">
            <div>
              显示 {filteredUsers.length === 0 ? 0 : (userPage - 1) * pageSize + 1}-{Math.min(userPage * pageSize, filteredUsers.length)} 条，共 {filteredUsers.length} 条
              · Showing {filteredUsers.length === 0 ? 0 : (userPage - 1) * pageSize + 1}-{Math.min(userPage * pageSize, filteredUsers.length)} of {filteredUsers.length} entries
            </div>
            <div className="page-btns">
              <button className="page-btn" disabled={userPage === 1} onClick={() => setUserPage((page) => Math.max(1, page - 1))}>‹</button>
              {Array.from({length: totalUserPages}, (_, index) => index + 1).map((page) => (
                <button key={page} className={`page-btn ${userPage === page ? 'active' : ''}`} onClick={() => setUserPage(page)}>{page}</button>
              ))}
              <button className="page-btn" disabled={userPage === totalUserPages} onClick={() => setUserPage((page) => Math.min(totalUserPages, page + 1))}>›</button>
            </div>
          </div>
        </div>
      </div>

      
      <div className={`page ${activePage === 'login' ? 'active' : ''}`} id="page-login">
        <div className="auth-wrapper">
          <div className="auth-card">
            <div className="auth-logo">
              <div className="logo-icon-lg">
                <svg viewBox="0 0 56 56" fill="none">
                  <rect x="6" y="6" width="44" height="44" rx="6" stroke="url(#logoGrad2)" strokeWidth="2.5"></rect>
                  <path d="M20 32L26 38L40 22" stroke="url(#logoGrad2)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path>
                  <defs>
                    <linearGradient id="logoGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor: "#7C3AED"}}></stop>
                      <stop offset="100%" style={{stopColor: "#A855F7"}}></stop>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h2>WELCOME BACK</h2>
              <p>登录您的账户 · Sign in to your account</p>
            </div>

            <div className="auth-tabs">
              <div className="auth-tab active">登录 · Sign In</div>
              <div className="auth-tab" onClick={() => switchPage('register')}>注册 · Sign Up</div>
            </div>

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">
                  邮箱地址
                  <span className="en">Email</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="请输入用户名"
                  value={loginUsername}
                  onChange={(event) => setLoginUsername(event.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  密码
                  <span className="en">Password</span>
                </label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                />
              </div>

              <div className="form-row">
                <label className="checkbox-wrap">
                  <input type="checkbox" defaultChecked />
                  记住我 · Remember me
                </label>
                <span className="link-text">忘记密码？· Forgot?</span>
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={loginLoading}>
                {loginLoading ? '登录中...' : '登录 · Sign In'}
              </button>
              {loginError && <p style={{color: 'var(--danger)', marginTop: '12px'}}>{loginError}</p>}
            </form>

            <div className="auth-divider">OR · 或者</div>

            <div style={{display: "flex", gap: "10px", marginBottom: "24px"}}>
              <button className="btn btn-outline" style={{flex: "1", justifyContent: "center"}}>
                <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path></svg>
              </button>
              <button className="btn btn-outline" style={{flex: "1", justifyContent: "center"}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"></path></svg>
              </button>
              <button className="btn btn-outline" style={{flex: "1", justifyContent: "center"}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
              </button>
            </div>

            <div className="auth-footer">
              还没有账户？<span className="link-text" onClick={() => switchPage('register')}>立即注册 · Sign Up</span>
            </div>
          </div>
        </div>
      </div>

      
      <div className={`page ${activePage === 'register' ? 'active' : ''}`} id="page-register">
        <div className="auth-wrapper">
          <div className="auth-card">
            <div className="auth-logo">
              <div className="logo-icon-lg">
                <svg viewBox="0 0 56 56" fill="none">
                  <rect x="6" y="6" width="44" height="44" rx="6" stroke="url(#logoGrad3)" strokeWidth="2.5"></rect>
                  <path d="M28 18v20M18 28h20" stroke="url(#logoGrad3)" strokeWidth="3" strokeLinecap="round"></path>
                  <defs>
                    <linearGradient id="logoGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor: "#7C3AED"}}></stop>
                      <stop offset="100%" style={{stopColor: "#A855F7"}}></stop>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h2>CREATE ACCOUNT</h2>
              <p>创建新账户 · Register a new account</p>
            </div>

            <div className="auth-tabs">
              <div className="auth-tab" onClick={() => switchPage('login')}>登录 · Sign In</div>
              <div className="auth-tab active">注册 · Sign Up</div>
            </div>

            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label className="form-label">
                  用户名
                  <span className="en">Username</span>
                </label>
                <input type="text" className="form-input" placeholder="请输入用户名" value={registerForm.username} onChange={(event) => setRegisterForm({...registerForm, username: event.target.value})} />
              </div>

              <div className="form-group">
                <label className="form-label">
                  邮箱地址
                  <span className="en">Email</span>
                </label>
                <input type="email" className="form-input" placeholder="your@email.com" value={registerForm.email} onChange={(event) => setRegisterForm({...registerForm, email: event.target.value})} />
              </div>

              <div className="form-group">
                <label className="form-label">
                  密码
                  <span className="en">Password</span>
                </label>
                <input type="password" className="form-input" placeholder="至少8位字符" value={registerForm.password} onChange={(event) => setRegisterForm({...registerForm, password: event.target.value})} />
              </div>

              <div className="form-group">
                <label className="form-label">
                  确认密码
                  <span className="en">Confirm Password</span>
                </label>
                <input type="password" className="form-input" placeholder="再次输入密码" value={registerForm.confirmPassword} onChange={(event) => setRegisterForm({...registerForm, confirmPassword: event.target.value})} />
              </div>

              <div className="form-row">
                <label className="checkbox-wrap">
                  <input type="checkbox" />
                  我同意 <span className="link-text">服务条款</span> · I agree to Terms
                </label>
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={registerLoading}>
                {registerLoading ? '注册中...' : '注册 · Create Account'}
              </button>
              {registerError && <p style={{color: 'var(--danger)', marginTop: '12px'}}>{registerError}</p>}
              {registerSuccess && <p style={{color: 'var(--success)', marginTop: '12px'}}>{registerSuccess}</p>}
            </form>

            <div className="auth-footer" style={{marginTop: "20px"}}>
              已有账户？<span className="link-text" onClick={() => switchPage('login')}>立即登录 · Sign In</span>
            </div>
          </div>
        </div>
      </div>

      
      <div className={`page ${activePage === 'api' ? 'active' : ''}`} id="page-api">
        <div className="api-hero">
          <div className="api-hero-content">
            <div className="badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              REST API v1.0
            </div>
            <h1>API Documentation</h1>
            <p>完整的 RESTful API 接口文档，基于 FastAPI 自动生成，支持 JWT 认证。Full RESTful API documentation with JWT authentication.</p>
            <div className="api-meta">
              <div className="api-meta-item">
                <span className="label">Base URL</span>
                <span className="value">/api/v1</span>
              </div>
              <div className="api-meta-item">
                <span className="label">Auth</span>
                <span className="value">Bearer JWT</span>
              </div>
              <div className="api-meta-item">
                <span className="label">Format</span>
                <span className="value">JSON</span>
              </div>
            </div>
          </div>
        </div>

        <h2 className="api-section-title">Authentication · 认证接口</h2>

        <div className="endpoint-card open" onClick={toggleEndpoint}>
          <div className="endpoint-header">
            <span className="method-badge post">POST</span>
            <span className="endpoint-path">/api/v1/auth/login</span>
            <span className="endpoint-desc">用户登录获取Token · User login</span>
            <svg className="endpoint-expand" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
          <div className="endpoint-body">
            <h4>请求参数 · Request Body</h4>
            <table className="params-table">
              <thead>
                <tr><th>参数名 · Name</th><th>类型 · Type</th><th>必填 · Required</th><th>说明 · Description</th></tr>
              </thead>
              <tbody>
                <tr><td><span className="param-name">username</span></td><td><span className="param-type">string</span></td><td><span className="required">是</span></td><td>用户名或邮箱</td></tr>
                <tr><td><span className="param-name">password</span></td><td><span className="param-type">string</span></td><td><span className="required">是</span></td><td>用户密码</td></tr>
              </tbody>
            </table>

            <h4>响应示例 · Response Example</h4>
            <div className="code-block">
              <span className="code-label">200 OK</span>
<span className="code-key">"access_token"</span>: <span className="code-string">"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."</span>,
<span className="code-key">"token_type"</span>: <span className="code-string">"bearer"</span>,
<span className="code-key">"expires_in"</span>: <span className="code-number">3600</span>
            </div>
          </div>
        </div>

        <div className="endpoint-card" onClick={toggleEndpoint}>
          <div className="endpoint-header">
            <span className="method-badge post">POST</span>
            <span className="endpoint-path">/api/v1/auth/register</span>
            <span className="endpoint-desc">用户注册 · User registration</span>
            <svg className="endpoint-expand" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
          <div className="endpoint-body">
            <h4>请求参数 · Request Body</h4>
            <table className="params-table">
              <thead>
                <tr><th>参数名 · Name</th><th>类型 · Type</th><th>必填 · Required</th><th>说明 · Description</th></tr>
              </thead>
              <tbody>
                <tr><td><span className="param-name">username</span></td><td><span className="param-type">string</span></td><td><span className="required">是</span></td><td>用户名</td></tr>
                <tr><td><span className="param-name">email</span></td><td><span className="param-type">string</span></td><td><span className="required">是</span></td><td>邮箱地址</td></tr>
                <tr><td><span className="param-name">password</span></td><td><span className="param-type">string</span></td><td><span className="required">是</span></td><td>密码 (min 8 chars)</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="endpoint-card" onClick={toggleEndpoint}>
          <div className="endpoint-header">
            <span className="method-badge get">GET</span>
            <span className="endpoint-path">/api/v1/auth/me</span>
            <span className="endpoint-desc">获取当前用户信息 · Get current user</span>
            <svg className="endpoint-expand" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
          <div className="endpoint-body">
            <h4>请求头 · Headers</h4>
            <table className="params-table">
              <thead>
                <tr><th>参数名 · Name</th><th>类型 · Type</th><th>必填 · Required</th><th>说明 · Description</th></tr>
              </thead>
              <tbody>
                <tr><td><span className="param-name">Authorization</span></td><td><span className="param-type">string</span></td><td><span className="required">是</span></td><td>Bearer {'{token}'}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <h2 className="api-section-title" style={{marginTop: "28px"}}>Data · 数据接口</h2>

        <div className="endpoint-card" onClick={toggleEndpoint}>
          <div className="endpoint-header">
            <span className="method-badge get">GET</span>
            <span className="endpoint-path">/api/v1/items</span>
            <span className="endpoint-desc">获取数据列表 · List items</span>
            <svg className="endpoint-expand" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
          <div className="endpoint-body">
            <h4>查询参数 · Query Parameters</h4>
            <table className="params-table">
              <thead>
                <tr><th>参数名 · Name</th><th>类型 · Type</th><th>必填 · Required</th><th>说明 · Description</th></tr>
              </thead>
              <tbody>
                <tr><td><span className="param-name">skip</span></td><td><span className="param-type">int</span></td><td>否</td><td>跳过数量 (default: 0)</td></tr>
                <tr><td><span className="param-name">limit</span></td><td><span className="param-type">int</span></td><td>否</td><td>返回数量 (default: 10)</td></tr>
                <tr><td><span className="param-name">search</span></td><td><span className="param-type">string</span></td><td>否</td><td>搜索关键词</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="endpoint-card" onClick={toggleEndpoint}>
          <div className="endpoint-header">
            <span className="method-badge post">POST</span>
            <span className="endpoint-path">/api/v1/items</span>
            <span className="endpoint-desc">创建数据 · Create item</span>
            <svg className="endpoint-expand" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
          <div className="endpoint-body">
            <h4>请求体 · Request Body</h4>
            <div className="code-block">
<span className="code-key">"title"</span>: <span className="code-string">"string"</span>,
<span className="code-key">"description"</span>: <span className="code-string">"string (optional)"</span>,
<span className="code-key">"status"</span>: <span className="code-string">"active | pending | inactive"</span>
            </div>
          </div>
        </div>

        <div className="endpoint-card" onClick={toggleEndpoint}>
          <div className="endpoint-header">
            <span className="method-badge get">GET</span>
            <span className="endpoint-path">/api/v1/items/{'{id}'}</span>
            <span className="endpoint-desc">获取单条数据 · Get item by ID</span>
            <svg className="endpoint-expand" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
          <div className="endpoint-body">
            <h4>路径参数 · Path Parameters</h4>
            <table className="params-table">
              <thead>
                <tr><th>参数名 · Name</th><th>类型 · Type</th><th>必填 · Required</th><th>说明 · Description</th></tr>
              </thead>
              <tbody>
                <tr><td><span className="param-name">id</span></td><td><span className="param-type">int</span></td><td><span className="required">是</span></td><td>数据ID</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="endpoint-card" onClick={toggleEndpoint}>
          <div className="endpoint-header">
            <span className="method-badge put">PUT</span>
            <span className="endpoint-path">/api/v1/items/{'{id}'}</span>
            <span className="endpoint-desc">更新数据 · Update item</span>
            <svg className="endpoint-expand" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
          <div className="endpoint-body"></div>
        </div>

        <div className="endpoint-card" onClick={toggleEndpoint}>
          <div className="endpoint-header">
            <span className="method-badge delete">DELETE</span>
            <span className="endpoint-path">/api/v1/items/{'{id}'}</span>
            <span className="endpoint-desc">删除数据 · Delete item</span>
            <svg className="endpoint-expand" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
          <div className="endpoint-body"></div>
        </div>
      </div>

      
      <div className={`page ${activePage === 'schema' ? 'active' : ''}`} id="page-schema">
        <div className="page-header">
          <div className="page-title-row">
            <h1 className="page-title">
              Database Design
              <span className="title-en">Schema Design</span>
            </h1>
          </div>
          <p className="page-desc">数据库表结构设计，包含用户表与业务数据表。Database schema with users and items tables.</p>
        </div>

        <div className="schema-card">
          <div className="schema-title">
            关系图 · ER Diagram
            <span className="schema-badge">2 Tables</span>
          </div>
          <div className="db-diagram">
            <div className="db-table">
              <div className="db-table-header">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                  <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                </svg>
                users · 用户表
              </div>
              <div className="db-table-body">
                <div className="db-field">
                  <span className="pk-icon">◆</span>
                  <span className="field-name">id</span>
                  <span className="field-type">INT PK</span>
                </div>
                <div className="db-field">
                  <span></span>
                  <span className="field-name">username</span>
                  <span className="field-type">VARCHAR(50)</span>
                </div>
                <div className="db-field">
                  <span></span>
                  <span className="field-name">email</span>
                  <span className="field-type">VARCHAR(100)</span>
                </div>
                <div className="db-field">
                  <span></span>
                  <span className="field-name">password_hash</span>
                  <span className="field-type">VARCHAR(255)</span>
                </div>
                <div className="db-field">
                  <span></span>
                  <span className="field-name">is_active</span>
                  <span className="field-type">BOOLEAN</span>
                </div>
                <div className="db-field">
                  <span></span>
                  <span className="field-name">role</span>
                  <span className="field-type">VARCHAR(20)</span>
                </div>
                <div className="db-field">
                  <span></span>
                  <span className="field-name">created_at</span>
                  <span className="field-type">DATETIME</span>
                </div>
                <div className="db-field">
                  <span></span>
                  <span className="field-name">updated_at</span>
                  <span className="field-type">DATETIME</span>
                </div>
              </div>
            </div>

            <div className="db-relation">
              <div className="rel-line"></div>
              <span>1 : N</span>
              <span style={{fontSize: "9px"}}>has many</span>
            </div>

            <div className="db-table">
              <div className="db-table-header" style={{background: "linear-gradient(135deg,#0A0A0F,#1A1A24)"}}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                items · 数据表
              </div>
              <div className="db-table-body">
                <div className="db-field">
                  <span className="pk-icon">◆</span>
                  <span className="field-name">id</span>
                  <span className="field-type">INT PK</span>
                </div>
                <div className="db-field">
                  <span></span>
                  <span className="field-name">title</span>
                  <span className="field-type">VARCHAR(200)</span>
                </div>
                <div className="db-field">
                  <span></span>
                  <span className="field-name">description</span>
                  <span className="field-type">TEXT</span>
                </div>
                <div className="db-field">
                  <span style={{color: "var(--warning)"}}>◆</span>
                  <span className="field-name">owner_id</span>
                  <span className="field-type">INT FK</span>
                </div>
                <div className="db-field">
                  <span></span>
                  <span className="field-name">status</span>
                  <span className="field-type">VARCHAR(20)</span>
                </div>
                <div className="db-field">
                  <span></span>
                  <span className="field-name">created_at</span>
                  <span className="field-type">DATETIME</span>
                </div>
                <div className="db-field">
                  <span></span>
                  <span className="field-name">updated_at</span>
                  <span className="field-type">DATETIME</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="two-col">
          <div className="schema-card">
            <div className="schema-title">
              users 表
              <span className="schema-badge">Table</span>
            </div>
            <div className="schema-fields">
              <div className="schema-field">
                <span className="field-pk"></span>
                <span className="field-name">id</span>
                <span className="field-type">INT · AUTO_INCREMENT</span>
              </div>
              <div className="schema-field">
                <span></span>
                <span className="field-name">username</span>
                <span className="field-type">VARCHAR(50) · UNIQUE</span>
              </div>
              <div className="schema-field">
                <span></span>
                <span className="field-name">email</span>
                <span className="field-type">VARCHAR(100) · UNIQUE</span>
              </div>
              <div className="schema-field">
                <span></span>
                <span className="field-name">password_hash</span>
                <span className="field-type">VARCHAR(255)</span>
              </div>
              <div className="schema-field">
                <span></span>
                <span className="field-name">is_active</span>
                <span className="field-type">BOOLEAN · DEFAULT true</span>
              </div>
              <div className="schema-field">
                <span></span>
                <span className="field-name">role</span>
                <span className="field-type">VARCHAR(20) · DEFAULT 'user'</span>
              </div>
              <div className="schema-field">
                <span></span>
                <span className="field-name">created_at</span>
                <span className="field-type">DATETIME</span>
              </div>
              <div className="schema-field">
                <span></span>
                <span className="field-name">updated_at</span>
                <span className="field-type">DATETIME</span>
              </div>
            </div>
          </div>

          <div className="schema-card">
            <div className="schema-title">
              items 表
              <span className="schema-badge">Table</span>
            </div>
            <div className="schema-fields">
              <div className="schema-field">
                <span className="field-pk"></span>
                <span className="field-name">id</span>
                <span className="field-type">INT · AUTO_INCREMENT</span>
              </div>
              <div className="schema-field">
                <span></span>
                <span className="field-name">title</span>
                <span className="field-type">VARCHAR(200)</span>
              </div>
              <div className="schema-field">
                <span></span>
                <span className="field-name">description</span>
                <span className="field-type">TEXT · NULLABLE</span>
              </div>
              <div className="schema-field">
                <span style={{background: "var(--warning)"}}></span>
                <span className="field-name">owner_id</span>
                <span className="field-type">INT · FK → users.id</span>
              </div>
              <div className="schema-field">
                <span></span>
                <span className="field-name">status</span>
                <span className="field-type">VARCHAR(20) · DEFAULT 'active'</span>
              </div>
              <div className="schema-field">
                <span></span>
                <span className="field-name">created_at</span>
                <span className="field-type">DATETIME</span>
              </div>
              <div className="schema-field">
                <span></span>
                <span className="field-name">updated_at</span>
                <span className="field-type">DATETIME</span>
              </div>
            </div>
          </div>
        </div>

        <div className="schema-card">
          <div className="schema-title">
            索引设计 · Indexes
            <span className="schema-badge">Performance</span>
          </div>
          <table className="params-table" style={{marginTop: "12px"}}>
            <thead>
              <tr><th>表名 · Table</th><th>索引名 · Index</th><th>字段 · Columns</th><th>类型 · Type</th><th>说明 · Description</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><code style={{fontFamily: "'JetBrainsMono',monospace", color: "var(--accent-dark)"}}>users</code></td>
                <td><span className="param-name">idx_username</span></td>
                <td>username</td>
                <td>UNIQUE</td>
                <td>用户名唯一索引</td>
              </tr>
              <tr>
                <td><code style={{fontFamily: "'JetBrainsMono',monospace", color: "var(--accent-dark)"}}>users</code></td>
                <td><span className="param-name">idx_email</span></td>
                <td>email</td>
                <td>UNIQUE</td>
                <td>邮箱唯一索引</td>
              </tr>
              <tr>
                <td><code style={{fontFamily: "'JetBrainsMono',monospace", color: "var(--accent-dark)"}}>items</code></td>
                <td><span className="param-name">idx_owner_id</span></td>
                <td>owner_id</td>
                <td>INDEX</td>
                <td>外键索引，加速关联查询</td>
              </tr>
              <tr>
                <td><code style={{fontFamily: "'JetBrainsMono',monospace", color: "var(--accent-dark)"}}>items</code></td>
                <td><span className="param-name">idx_status</span></td>
                <td>status</td>
                <td>INDEX</td>
                <td>状态筛选索引</td>
              </tr>
              <tr>
                <td><code style={{fontFamily: "'JetBrainsMono',monospace", color: "var(--accent-dark)"}}>items</code></td>
                <td><span className="param-name">idx_created_at</span></td>
                <td>created_at</td>
                <td>INDEX</td>
                <td>时间排序索引</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    
    <footer className="footer">
      <div className="footer-left">
        <span>© 2024 NEXUS Platform</span>
        <span>·</span>
        <span>Basic Edition · 基础版</span>
      </div>
      <div className="footer-right">
        <span><span className="dot-online"></span>System Online</span>
        <span>v1.0.0</span>
      </div>
    </footer>
  </main>
</div>


  )
}

export default App