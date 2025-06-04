import './App.css'
import { Outlet } from 'react-router-dom';
import Navbar from './Components/Layout/Navbar'

function App() {

  return (
    <>
      <Navbar/>
      <hr />
      <Outlet />
    </>
  )
}

export default App
