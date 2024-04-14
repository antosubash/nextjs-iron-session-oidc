"use client";
const Login = () => {
    return (
        <button className="bg-white text-black" onClick={() => {
            window.location.href = "/auth/api";
        }}>
            Login
        </button>
    );
}

export default Login;