import AppHeader from './components/AppHeader'
import LegacySimulation from './components/LegacySimulation'
import './react.css'

export default function App() {
  return (
    <>
      <AppHeader />
      <main className="react-page">
        <section className="react-intro">
          <div className="react-intro__icon">🧬</div>
          <div>
            <h2>Симуляция эволюции</h2>
            <p>Оригинальная физика и генетический алгоритм сохранены; интерфейс запускается как React-приложение.</p>
          </div>
        </section>
        <LegacySimulation />
      </main>
    </>
  )
}
