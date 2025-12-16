import { useState } from 'react'
import { Card } from '@repo/ui/card'
import { TurborepoLogo } from '@repo/ui/turborepo-logo'
import { Gradient } from '@repo/ui/gradient'
import '@repo/ui/styles.css'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="relative">
        <Gradient className="top-[-500px] opacity-[0.15] w-[1000px] h-[1000px]" conic />
      </div>
      <div>
        <TurborepoLogo />
      </div>
      <h1>Cosmic Garden Write</h1>
      <p className="read-the-docs">Built with Vite + React + Turborepo</p>
      
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <Card title="Documentation" href="https://turbo.build/repo/docs">
          Find in-depth information about Turborepo features and API.
        </Card>
        <Card title="Learn" href="https://turbo.build/repo/docs/getting-started">
          Learn more about Turborepo in an interactive course.
        </Card>
      </div>
    </>
  )
}

export default App
