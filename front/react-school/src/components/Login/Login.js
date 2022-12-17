import React, { useState } from 'react';
import './Login.css';
import PropTypes from 'prop-types';

async function loginUser(credentials, setError) {
    return fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(res => {
        if (res.status === 404) {
            console.log("error")
            setError({ hasError: true })
            return {};
        }
        setError({ hasError: false })
        return res.json()
    });
}

function Login({ setToken }) {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState();

    const handleSubmit = async e => {
        e.preventDefault();
        const res = await loginUser({
            username,
            password
        }, setError);
        if ("token" in res) {
            setToken(res["token"]);
        }
    }

    return (
        <div className="login-wrapper">
            <h1>Вход в систему</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <input type="text" className="login-input" placeholder="username" onChange={e => setUserName(e.target.value)} />
                </label>
                <label>
                    <input type="password" className="login-input" placeholder="password" onChange={e => setPassword(e.target.value)} />
                </label>
                <div>
                    <button type="submit" className="login-button">Войти</button>
                </div>
                <div>
                    {error && error["hasError"] && <p>
                        Ошибка входа!
                    </p>}
                </div>
            </form>
        </div>
    )
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
}

export default Login;   