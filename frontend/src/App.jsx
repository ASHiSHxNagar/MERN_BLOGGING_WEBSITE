import { Routes, Route } from 'react-router-dom';
import '../src/index.css'
import Navbar from './components/navbar';
const App = () => {
    return (

        <Routes>
            {/* home router navbar to show on all pages  */}
            <Route path="/" element={<Navbar />}>
                <Route path="signin" element={<h1>hello signin</h1>} />
                <Route path="signup" element={<h1>hello signup</h1>} />
            </Route>
        </Routes>



    )
}

export default App;