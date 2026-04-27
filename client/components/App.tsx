import { Outlet } from 'react-router'

function App() {
  return (
    <>
      <header className="bg-kiwi text-white py-10 px-4 shadow-lg">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          KiwiCart
        </h1>
        <p className="mt-3 text-lg text-kiwi-light/90">
          Your ultimate NZ supermarket price comparison tool
        </p>
      </header>
      <main className="max-w-7xl mx-auto py-10">
        <Outlet />
      </main>
    </>
  )
}

export default App
