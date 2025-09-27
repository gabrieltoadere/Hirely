import '../App.css';


const Login = () => {
    return (
        <div className='login-main'>
            <div className='credentials'>
                <h2>Login Page</h2>
                <strong className='input-text'>Username:</strong>
                <input className='login-input' type='text' id='username'></input>
                <strong className='input-text'>Password:</strong>
                <input className='login-input' type='text' id='password'></input>


                <div className='redirect-buttons'>
                    <button className='signup-button'></button>
                    <button className='forgot-pass'></button>
                </div>
            </div>
        </div>
    );
};

export default Login;