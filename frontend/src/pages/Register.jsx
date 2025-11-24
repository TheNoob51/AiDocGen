import React, { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { signup } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Passwords do not match");
        }

        try {
            setError("");
            setLoading(true);
            await signup(emailRef.current.value, passwordRef.current.value);
            navigate("/");
        } catch (err) {
            console.error(err);
            setError("Failed to create an account: " + err.message);
        }

        setLoading(false);
    }

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Sign Up</h2>
                {error && <div style={{ backgroundColor: '#ef4444', color: 'white', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Email</label>
                        <input type="email" ref={emailRef} required className="input-field" />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Password</label>
                        <input type="password" ref={passwordRef} required className="input-field" />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Password Confirmation</label>
                        <input type="password" ref={passwordConfirmRef} required className="input-field" />
                    </div>
                    <button disabled={loading} className="btn btn-primary" style={{ width: '100%' }} type="submit">
                        Sign Up
                    </button>
                </form>
                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                    Already have an account? <Link to="/login">Log In</Link>
                </div>
            </div>
        </div>
    );
}
