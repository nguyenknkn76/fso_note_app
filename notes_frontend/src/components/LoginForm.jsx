const LoginForm = ({handleLogin,username,password,handleUsernameChange, handlePasswordChange}) => {
    return(
        <form onSubmit={handleLogin}>
            <div>
            username: <input type="text" value={username} name="Username" onChange={handleUsernameChange}/>
            </div>
            <div>
            password: <input type="password" value={password} name="Password" onChange={handlePasswordChange}/>
            </div>
            <button type="submit">Login</button>
        </form>
    )
}
export default LoginForm
