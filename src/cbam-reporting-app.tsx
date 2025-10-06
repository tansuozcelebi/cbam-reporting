import { useState } from 'react'
import './App.css'

function CBAMReportingApp() {
  const [count, setCount] = useState(0)
  const version = "1.0.0"
  const buildNumber = new Date().toISOString().slice(0, 10).replace(/-/g, '') + "." + Date.now().toString().slice(-4)

  return (
    <>
      <div className="app-container">
        <header className="app-header">
          <div className="logo-container">
            <img src="/logo.png" className="krea-logo" alt="KREA Logo" />
          </div>
          <h1>CBAM Reporting System</h1>
          <p className="subtitle">Carbon Border Adjustment Mechanism</p>
        </header>
        
        <main className="main-content">
          <div className="card">
            <h2>Welcome to CBAM Reporting</h2>
            <p>Start managing your carbon border adjustment mechanism reports.</p>
            <button onClick={() => setCount((count) => count + 1)}>
              Click count: {count}
            </button>
          </div>
        </main>
        
        <div className="version-info">
          <span>Version: {version}</span>
          <span>Build: {buildNumber}</span>
        </div>
      </div>
    </>
  )
}

export default CBAMReportingApp