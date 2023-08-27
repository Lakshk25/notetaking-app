import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
const Login = (props) => {
    let navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: "", password: "" })
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:5000/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({email:credentials.email, password:credentials.password})
          });
           
          const json = await response.json()
        //   console.log(json)
          console.log("token is " , json.authToken)
        if (json.success) {
            localStorage.setItem('token', json.authToken);
            props.showAlert("Login Successfully", "success")
            navigate('/');
        }
        else {
            props.showAlert("Invalid Credentials", "danger")
        }
    }
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    return (
        <div className='mt-3'>
            <h2>Login to continue to Notebook</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name='email' onChange={onChange} aria-describedby="emailHelp" value={credentials.email} />
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name='password' onChange={onChange} value={credentials.password} />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Login