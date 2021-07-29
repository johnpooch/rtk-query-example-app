import React, { useState } from "react";
import VariantsList from "./components/VariantsList";
import CreateGameForm from "./components/CreateGameForm";

const App = () => {
  const [variantsListOpen, setVariantsListOpen] = useState(false);
  const [createGameFormOpen, setCreateGameFormOpen] = useState(false);
  return (
    <div className="App">
      <div>
        <button type="button" onClick={() => setVariantsListOpen(true)}>
          Load variants
        </button>
        {variantsListOpen && <VariantsList />}
      </div>
      <div>
        <button type="button" onClick={() => setCreateGameFormOpen(true)}>
          Create a game
        </button>
        {createGameFormOpen && <CreateGameForm />}
      </div>
    </div>
  );
};

export default App;
