import { useState } from 'react'
import { Card } from '@repo/ui/card'
import { TurborepoLogo } from '@repo/ui/turborepo-logo'
import { Gradient } from '@repo/ui/gradient'
import '@repo/ui/styles.css'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-neutral-900 text-white/90 flex flex-col items-center justify-center p-8">
      <div className="relative">
        <Gradient className="top-[-500px] opacity-[0.15] w-[1000px] h-[1000px]" conic />
      </div>
      <div>
        <TurborepoLogo />
      </div>
      <h1 className="text-5xl font-bold leading-tight mt-4">Cosmic Garden Write</h1>
      <p className="text-gray-500 mt-2">Built with Vite + React + Turborepo</p>
      
      <div className="flex gap-4 mt-6">
        <a href="https://vite.dev" target="_blank" rel="noreferrer" className="group">
          <img src={viteLogo} className="h-24 p-6 transition-all duration-300 group-hover:drop-shadow-[0_0_2em_#646cffaa]" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer" className="group">
          <img src={reactLogo} className="h-24 p-6 transition-all duration-300 group-hover:drop-shadow-[0_0_2em_#61dafbaa] animate-spin-slow" alt="React logo" />
        </a>
      </div>
      
      <div className="p-8">
        <button 
          onClick={() => setCount((count) => count + 1)}
          className="rounded-lg border border-transparent bg-neutral-800 px-5 py-3 font-medium cursor-pointer transition-colors hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          count is {count}
        </button>
        <p className="mt-4">
          Edit <code className="bg-neutral-800 px-2 py-1 rounded">src/App.tsx</code> and save to test HMR
        </p>
      </div>
      
      <div className="flex gap-4 mt-8">
        <Card title="Documentation" href="https://turbo.build/repo/docs">
          Find in-depth information about Turborepo features and API.
        </Card>
        <Card title="Learn" href="https://turbo.build/repo/docs/getting-started">
          Learn more about Turborepo in an interactive course.
        </Card>
      </div>
    </div>
  )
}

export default App
