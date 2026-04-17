import { Outlet } from 'react-router'

function App() {
  return (
    <>
      <header className="header">
        <h1>KiwiCart</h1>
        <p>Your ultimate NZ supermarket price comparison tool</p>
      </header>
      <main className="main">
        <Outlet />
      </main>
    </>
  )
}

export default App
