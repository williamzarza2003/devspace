import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <section className="counter-panel">
      <h2>Mi primer contador</h2>
      <p>Interacciones realizadas:</p>
      <div className="number">{count}</div>

      <div className="actions">
        <button onClick={() => setCount(count + 1)}>
          Incrementar
        </button>

        <button className="secondary" onClick={() => setCount(0)}>
          Reiniciar
        </button>
      </div>
    </section>
  )
}

export default Counter
