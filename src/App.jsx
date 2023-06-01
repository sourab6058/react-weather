import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./pages/Home";

const router = createBrowserRouter([
  {
    path: "/react-weather/",
    element: <Home />,
  },
]);

function App() {
  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
