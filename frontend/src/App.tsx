import { useState } from 'react'

console.log('API URL:', import.meta.env.VITE_API_URL);
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <div>count is {count}</div>
      <div>
        <button onClick={() => setCount((count) => count + 1)}>
          +
        </button>
      </div>


    </div>
  )
}

export default App
