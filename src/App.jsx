import { useMemo, useState } from 'react'
import { Cpu, HardDrive, MemoryStick, MonitorPlay, Sparkles } from 'lucide-react'
import './App.css'

const TASKS = [
  {
    id: 'kernel',
    title: 'Load Kernel',
    cost: 10,
    description: 'Initialize the bootloader and wake the system core.',
    unlockedLabel: 'Kernel Online',
  },
  {
    id: 'memory',
    title: 'Initialize Memory',
    cost: 25,
    description: 'Allocate a stack of RAM and clear the volatile buffer.',
    unlockedLabel: 'Memory Initialized',
  },
  {
    id: 'filesystem',
    title: 'Mount Filesystem',
    cost: 40,
    description: 'Attach the root partition and expose the home directory.',
    unlockedLabel: 'Filesystem Mounted',
  },
]

function App() {
  const [cpuCycles, setCpuCycles] = useState(0)
  const [completedTasks, setCompletedTasks] = useState([])
  const [message, setMessage] = useState('Boot sequence ready. Start by generating CPU cycles.')

  const progress = useMemo(() => {
    return Math.round((completedTasks.length / TASKS.length) * 100)
  }, [completedTasks.length])

  const handleMine = () => {
    setCpuCycles((prev) => prev + 1)
    setMessage('Cycle generated. The processor is humming.')
  }

  const handleUnlock = (task) => {
    if (completedTasks.includes(task.id) || cpuCycles < task.cost) {
      return
    }

    setCpuCycles((prev) => prev - task.cost)
    setCompletedTasks((prev) => [...prev, task.id])
    setMessage(`${task.unlockedLabel}. ${task.description}`)
  }

  const completedSet = new Set(completedTasks)

  return (
    <main className="app-shell">
      <section className="hero-card">
        <div className="hero-top">
          <div>
            <p className="eyebrow">Deep-night dev bootloop</p>
            <h1>OS Boot Clicker</h1>
            <p className="hero-copy">
              Mine CPU cycles, unlock the boot stages, and build a tiny operating system one click at a time.
            </p>
          </div>
          <div className="badge">
            <Sparkles size={16} />
            <span>Prototype mode</span>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <Cpu size={20} />
            <span className="stat-label">CPU Cycles</span>
            <strong data-testid="cpu-cycles">{cpuCycles}</strong>
          </div>
          <div className="stat-card">
            <MonitorPlay size={20} />
            <span className="stat-label">Boot Progress</span>
            <strong>{progress}%</strong>
          </div>
          <div className="stat-card">
            <HardDrive size={20} />
            <span className="stat-label">Tasks Unlocked</span>
            <strong>{completedTasks.length}/{TASKS.length}</strong>
          </div>
        </div>

        <div className="action-panel">
          <button type="button" className="primary-button" onClick={handleMine}>
            Generate Cycle
          </button>
          <div className="status-box" role="status">
            <p>{message}</p>
          </div>
        </div>
      </section>

      <section className="task-list">
        {TASKS.map((task) => {
          const isUnlocked = completedSet.has(task.id)
          const isDisabled = cpuCycles < task.cost || isUnlocked

          return (
            <article key={task.id} className={`task-card ${isUnlocked ? 'unlocked' : ''}`}>
              <div className="task-title-row">
                <div>
                  <h2>{task.title}</h2>
                  <p>{task.description}</p>
                </div>
                <span className="cost-pill">{task.cost} cycles</span>
              </div>
              <button
                type="button"
                className="secondary-button"
                onClick={() => handleUnlock(task)}
                disabled={isDisabled}
              >
                {isUnlocked ? task.unlockedLabel : task.title}
              </button>
            </article>
          )
        })}
      </section>

      <footer className="footer-note">
        <MemoryStick size={16} />
        <span>Next step: add a memory allocator, then mount the filesystem.</span>
      </footer>
    </main>
  )
}

export default App
