import React, { useContext, useRef } from 'react'
import Input from '../components/Input'
import googleicon from "../imgs/google.png"
import { Link, Navigate } from 'react-router-dom'
import PageAnimation from '../common/PageAnimation'
import { Toaster, toast } from 'react-hot-toast'
import axios from 'axios'
import { storeInSession } from '../common/Session'
import { UserContext } from '../App'
import { authWithGoogle } from '../common/Firebase'


const UserAuthForm = ({ type }) => {

    const { userAuth: { access_token }, setUserAuth } = useContext(UserContext)


    const formRef = useRef(); //creating a reference 

    const userAuthThroughServer = (serverRoute, formData) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
            .then(({ data }) => {
                storeInSession("user", JSON.stringify(data)) // Store user data in session
                setUserAuth(data)
            })
            .catch((error) => {
                console.error("Axios error:", error); // Log full error for debugging

                if (error.response) {
                    toast.error(error.response.data.error); // Show error message if response exists
                } else {
                    toast.error("An unknown error occurred!"); // Handle unexpected cases
                }
            })
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        let serverRoute = type == "sign-in" ? "/signin" : "/signup";

        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

        let form = new FormData(formRef.current);
        let formData = {};

        //fromdata
        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        //form validation
        let { fullname, email, password } = formData;

        if (fullname) {
            if (fullname.length < 3) {
                return toast.error("Fullname must be 3 letters long");
            }
        }
        if (!email.length) {
            return toast.error("Enter Email");
        }
        if (!emailRegex.test(email)) {
            return toast.error(" Email is Invalid");
        }
        if (!passwordRegex.test(password)) {
            return toast.error("Password should be 6 to 20 characters long with numeric, 1 lowercase and 1 uppercase letters");
        }

        userAuthThroughServer(serverRoute, formData);
    };

    const handleGoogleAuth = async (e) => {
        e.preventDefault();

        authWithGoogle().then((user) => {
            let serverRoute = "/google-auth";
            let formData = {
                access_token: user.accessToken
            };

            userAuthThroughServer(serverRoute, formData);
        }).catch((error) => {
            toast.error('Trouble logging in through Google');
            console.log(error);
        });
    };

    return (
        access_token ?
            <Navigate to="/" />
            :
            <PageAnimation>
                <section className='h-cover flex items-center justify-center '>
                    <Toaster />
                    <form ref={formRef} className='w-[80%] max-w-[400px] '>
                        <h1 className='text-4xl font-gelasio  capitalize text-center mb-24 '>
                            {type == "sign-in" ? "welcome back" : "Join us Today "}
                        </h1>

                        {
                            type != "sign-in" ?
                                <Input
                                    name="fullname"
                                    type="text"
                                    placeholder="Full Name"
                                    icon="fi-rr-user" />
                                : ""
                        }
                        <Input
                            name="email"
                            type="email"
                            placeholder="Email"
                            icon="fi-rr-envelope" />
                        <Input
                            name="password"
                            type="password"
                            placeholder="Password"
                            icon="fi-rr-key" />

                        <button className='btn-dark center mt-14'
                            type="submit"
                            onClick={handleSubmit}>
                            {type.replace("-", " ")}
                        </button>

                        <div className='relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold'>
                            <hr className='w-1/2 border-black' />
                            <p>or</p>
                            <hr className='w-1/2 border-black' />
                        </div>

                        <button className='btn-dark flex items-center justify-center gap-4 w-[90%] center'
                            onClick={handleGoogleAuth}>
                            <img src={googleicon} className='w-5 ' />
                            continue with google
                        </button>

                        {
                            type == "sign-in" ?
                                <p className='mt-6 text-dark-grey text-xl text-center'>Don't have an account?
                                    <Link to="/signup" className='underline text-black text-xl ml-1 '>
                                        Join Us Today</Link>
                                </p>
                                :
                                <p className='mt-6 text-dark-grey text-xl text-center'>Already a member?
                                    <Link to="/signin" className='underline text-black text-xl ml-1 '> Sign in here</Link>
                                </p>
                        }
                    </form>
                </section>
            </PageAnimation>
    )
}

export default UserAuthForm