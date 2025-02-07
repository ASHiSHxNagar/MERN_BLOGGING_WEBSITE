import { Routes, Route } from 'react-router-dom';
import '../src/index.css'
import Navbar from './components/Navbar';
import UserAuthForm from './pages/UserAuthForm';
import { createContext, useEffect, useState } from 'react';
import { lookInSession } from './common/Session';


export const UserContext = createContext({})


const App = () => {
    const [userAuth, setUserAuth] = useState({})

    useEffect(() => {
        let userInSession = lookInSession("user")

        userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({ access_token: null })
    }, [])

    return (
        <UserContext.Provider value={{ userAuth, setUserAuth }}>
            <Routes>
                {/* home router navbar to show on all pages  */}
                <Route path="/" element={<Navbar />}>
                    <Route path="signin" element={<UserAuthForm type="sign-in" />} />
                    <Route path="signup" element={<UserAuthForm type="sign-up" />} />
                </Route>
            </Routes>
        </UserContext.Provider>


    )
}

export default App;