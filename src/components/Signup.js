import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";

const Signup = (props) => {
  let navigate = useNavigate();
  const [credentials, setCredentials] = useState({name:"", email: "", password: "", cpassword: "" })

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {name, email, password} = credentials;
    const response = await fetch(`http://localhost:5000/api/auth/createuser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRjYjdmYjIwMDFiM2M0M2MwMmEwZjQ0In0sImlhdCI6MTY5MTA1ODA5OH0.az_ogeMMqy_q9jLvLRCwfDjFdo7bYgi7vflmaddI5T0"
      },
      body: JSON.stringify({ name, email, password })
    });

    const json = await response.json()
    console.log(json)
      if (json.success) {
        localStorage.setItem('token', json.authToken);
        navigate('/');
        props.showAlert("Account Created Successfully", "success")
    }
    else {
        props.showAlert("Invalid Details", "danger")
    }

  }
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }
  return (
    <div className='mt-3'>
    <h2>Create an account in Notebook</h2>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Your Name</label>
            <input type="text" className="form-control" id="name" name='name' onChange={onChange} minLength={3} required/>
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" name='email' onChange={onChange} required/>
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" name='password' onChange={onChange} minLength={5} required/>
          </div>
          <div className="mb-3">
            <label htmlFor="cpassword" className="form-label">Confirm Password</label>
            <input type="password" className="form-control" id="cpassword" name='cpassword' onChange={onChange} minLength={5} required />
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  )
}

export default Signup