import React, { useState } from "react";

function MeuComponente() {

    const [receba, setreceba] = useState(1)
    return (
      <div>
        <h1>Olá, este é o meu componente!{receba}</h1>
        <button onClick={() => setreceba(receba + 1)}>Incrementar</button>

      </div>
    );
  }