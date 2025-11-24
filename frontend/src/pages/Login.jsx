import React, { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { login } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError("");
            setLoading(true);
            await login(emailRef.current.value, passwordRef.current.value);
            navigate("/");
        } catch (err) {
            console.error(err);
            setError("Failed to log in: " + err.message);
        }

        setLoading(false);
    }

    return (
        <div className="container fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="card" style={{ width: '100%', maxWidth: '420px', position: 'relative', overflow: 'hidden' }}>
                {/* Decorative glow */}
                <div style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 50%)',
                    pointerEvents: 'none'
                }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '2rem' }}>Welcome Back</h2>
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
                        Sign in to continue to AI DocGen
                    </p>

                    {error && <div style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: '#fca5a5',
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '1.5rem',
                        fontSize: '0.9rem'
                    }}>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label>Email Address</label>
                            <input type="email" ref={emailRef} required className="input-field" placeholder="name@company.com" />
                        </div>
                        <div style={{ marginBottom: '2rem' }}>
                            <label>Password</label>
                            <input type="password" ref={passwordRef} required className="input-field" placeholder="••••••••" />
                        </div>
                        <button disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '1rem' }} type="submit">
                            Log In
                        </button>
                    </form>
                    <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        Don't have an account? <Link to="/register" style={{ fontWeight: '500' }}>Sign Up</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
