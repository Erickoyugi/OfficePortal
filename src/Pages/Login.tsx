import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Login.css';



function Login() {

const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const navigate = useNavigate();
const [isLoading, setIsLoading] = useState(false);

const handleLogin = async (event : any) => {
    event.preventDefault(); 
    setIsLoading(true);

    try {
      const response = await fetch('https://testapidevops.creditbank.co.ke:3011/creditbank/api/v1/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uname: email, pass: password }),
      });

      const result = await response.json();
      console.log(result);
      console.log(response.ok);

      const { token, role, user, mail } = result; // Use `result` since `response.json()` resolves to this

   const userToStore = {
          username: user.sAMAccountName, // Or user.displayName, depending on what you want to show
          role: role ,// This should be the role string (e.g., "admin", "simswap"),
          mail : user.mail
        };

      // Save the JWT token in localStorage
      const expiryTime = new Date().getTime() + 5 * 60 * 1000;
      localStorage.setItem('token', token);
      localStorage.setItem('tokenExpiry', expiryTime.toString());
      localStorage.setItem("user", JSON.stringify(userToStore));
      // The 'success' property might not always be standard in response objects
      // console.log(response.success);

      if (response.ok) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `Welcome ${email}, ${result.message}`,
          showConfirmButton: false,
          timer: 6000,
          width: 400,
        }).then(() => {
          setIsLoading(false);
          navigate('/home'); // Use navigate for routing in React Router
        });
      } else {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: `Failed To Authenticate ${email}, ${result.message || 'Invalid credentials'}`,
          showConfirmButton: false,
          timer: 6000,
          width: 400,
        }).then(() => {
          setIsLoading(false);
          navigate('/'); // Use navigate for routing in React Router
        });
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'An unexpected error occurred. Please try again later.',
        showConfirmButton: false,
        timer: 6000,
        width: 400,
      }).then(() => {
        setIsLoading(false);
        navigate('/'); // Use navigate for routing in React Router
      });
    }
  };

    return(
        <section className="ftco-section">
        <div className="container"> 
             <div className="row justify-content-center">
                 <div className="col-md-6 text-center mb-5">
              </div>
        </div>

           <div className="row justify-content-center">
                   <div className="col-md-12 col-lg-10">
                         <div className="wrap d-md-flex">
                         <div
                           className="img"
                           style={{ backgroundImage: `url('https://creditbank.co.ke/wp-content/uploads/2023/05/5-removebg-preview.webp')` }}
                         ></div>
                             
                          <div className="login-wrap p-4 p-md-5">
                               <div className="d-flex">
                                     <div className="w-100">
                                        <div className="container text-center">
                                          <img src="data:image/png;base64,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"/>
                                    </div>

                              </div>
<div className="w-100">
<p className="social-media d-flex justify-content-end">
<a href="#" className="social-icon d-flex align-items-center justify-content-center"><span className="fa fa-facebook"></span></a>
<a href="#" className="social-icon d-flex align-items-center justify-content-center"><span className="fa fa-twitter"></span></a>
</p>
</div>
</div>
<form action="#" className="signin-form">
<div className="form-group mb-3">
<label className="label">Username</label>
<input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
</div>
<div className="form-group mb-3">
<label className="label">Password</label>
<input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
</div>
<div className="form-group">
<button onClick={handleLogin}
 type="submit" className="green form-control btn rounded submit px-3  ${isLoading ? 'loading' : ''}`}
 " disabled={isLoading} >
               
                  {isLoading ? (
                    <div className="spinner-border text-light" role="status">
                      {/* <span className="visually-hidden">Loading...</span> */}
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
</div>
<div className="form-group d-md-flex">
<div className="w-50 text-left">
</div>
<div className="w-50 text-md-right">

</div>
</div>
</form>
</div>
</div>
</div>
</div>
</div>
</section>

    )
}

export default Login 
