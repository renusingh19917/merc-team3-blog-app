import { useState } from "react";
import { useNavigate } from "react-router";
import AppUser from "../models/AppUser";
import { login } from "../services/UserService";
import '../styles/Login.css'; 

const Login = () => {

    const [loginData, setLoginData] = useState(new AppUser());
    const [failedLogin, setFailedLogin] = useState('');
    const navigate = useNavigate();

    const handleLogin = (evt) => {
        console.log(evt.target);
        setLoginData({
            ...loginData,
            [evt.target.name]: evt.target.value
        });
    };

    const submitLogin = (evt) => {
        console.log(loginData);
        login(loginData)
            .then((resp) => {
                if (resp.data[0].username === loginData.username) {
                    localStorage.setItem('currentUser', JSON.stringify(resp.data[0]));
                    setLoginData('');
                    setFailedLogin('');
                    alert(`Hi ${JSON.parse(localStorage.getItem('currentUser')).username}! You've logged in successfully. Redirecting you to home...`);
                    navigate('/home');
                }
            })
            .catch((err) => {
                console.log(err);
                setLoginData({ username: '', password: '' });
                setFailedLogin('Invalid credentials!');
                localStorage.removeItem('currentUser');
            });
        evt.preventDefault();
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
            <div >
                <form onSubmit={submitLogin}>
                    <h3> Username </h3>
                    <input type="text" placeholder="Your username" name="username" value={loginData.username} onChange={handleLogin} />
                    <h3> Password </h3>
                    <input type="password" placeholder= "Your password" name="password" value={loginData.password} onChange={handleLogin} />
                    <input type="submit" name="login" value="Login" />
                </form>
            </div>
            <p>{failedLogin}</p>
        </div>
    );
};

export default Login;

