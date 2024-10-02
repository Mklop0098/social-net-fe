import { Fragment } from "react/jsx-runtime";
import { publicRoutes } from "./components/route";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

export default function App() {
  return (

    <Router>
      <div className="App">
        <Routes>
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            const Layout = route.layout ? route.layout : Fragment
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>

                }
              />
            );
          })}
        </Routes>
      </div>
    </Router>
  )
}