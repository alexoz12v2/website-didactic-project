import React, { useState } from 'react';
import './LoginForm.css'; // Importa il file di stile

const LoginForm = () => {
  const [isRegistered, setIsRegistered] = useState(true);

  const handleSignUpClick = () => {
    setIsRegistered(true);
  };

  const handleSignInClick = () => {
    setIsRegistered(false);
  };
//Alessio ti piace il dollaro?
  return (
    <div className="wrapper">
      <div className={`form-wrapper ${isRegistered? 'sign-up' : 'sign-in'}`}>
        <form action="">
          <h2>{isRegistered? 'Accedi' : 'Registrati'}</h2>
          <div className="input-group">
            <input type="text" required />
            <label htmlFor="">Username</label>
          </div>
         {/*{isSignUp && (
            <div className="input-group">
              <input type="email" required />
              <label htmlFor="">Email</label>
            </div>
         )}*/}
          <div className="input-group">
            <input type="password" required />
            <label htmlFor="">Password</label>
          </div>
          <button type="submit" className="btn">
            {isRegistered ? 'Accedi' : 'Registrati'}
          </button>
          <div className="sign-link">
          <p>
  {isRegistered
    ? "Already have an account? Hai già un account? "
    : "Don't have an account? Non hai ancora un account?"}
  <button
    className={isRegistered ? 'signIn-link' : 'signUp-link'}
    onClick={isRegistered ? handleSignInClick : handleSignUpClick}
  >
    {isRegistered ? 'Accedi' : 'Registrati'}
  </button>
</p>
          
          
           {/* <p>
              {isRegistered
                ? "Already have an account? Hai già un account? "
                : "Don't have an account? Non hai ancora un account?"}
              
              <a
                href="#"
                className={isRegistered ? 'signIn-link' : 'signUp-link'}
                onClick={isRegistered? handleSignInClick : handleSignUpClick}
              >
                {isRegistered? 'Accedi' : 'Registrati'}
              </a>
              </p>*/}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
