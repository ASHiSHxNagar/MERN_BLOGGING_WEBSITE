import { Routes, Route } from 'react-router-dom';
import '../src/index.css'
import Navbar from './components/navbar';
import UserAuthForm from './pages/UserAuthForm';
const App = () => {
    return (

        <Routes>
            {/* home router navbar to show on all pages  */}
            <Route path="/" element={<Navbar />}>
                <Route path="signin" element={<UserAuthForm type="sign-in" />} />
                <Route path="signup" element={<UserAuthForm type="sign-up" />} />
            </Route>
        </Routes>



    )
}

export default App;