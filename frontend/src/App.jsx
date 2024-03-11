import { BrowserRouter, Route, Routes } from "react-router-dom"
import Signup from "./pages/Signup"
import Signin from "./pages/Signin"
import Dashboard from "./pages/Dashboard"
import Send from "./pages/Send"

function App() {

  return (
    <div>
        <BrowserRouter>
        <Routes>
        <Route path="/signup" Component={ Signup }></Route>           { /*<Route path="/signup" element={<Signup />} /> */} {/* sir did like this */}
        <Route path="/signin" Component={ Signin }></Route>          { /* <Route path="/signin" element={<Signin />} /> */}
        <Route path="/dashboard" Component={ Dashboard }></Route>    { /* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/send" Component={ Send }></Route>              { /* <Route path="/send" element={<SendMoney />} /> */}
        
       
        
        </Routes>
        </BrowserRouter>
    </div>
  )
}

export default App
