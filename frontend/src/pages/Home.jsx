import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
    const { currentUser } = useAuth();

    return (
        <div className="container fade-in" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80vh',
            textAlign: 'center'
        }}>
            <div style={{ maxWidth: '800px' }}>
                <h1 style={{
                    fontSize: '4rem',
                    marginBottom: '1.5rem',
                    background: 'linear-gradient(to right, #fff, #9ca3af)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    Generate Professional Documents with AI
                </h1>

                <p style={{
                    fontSize: '1.25rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '3rem',
                    lineHeight: '1.6'
                }}>
                    Transform your ideas into structured business documents, presentations, and reports in seconds.
                    Powered by advanced AI to save you time and effort.
                </p>

                <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                    <Link to={currentUser ? "/dashboard" : "/login"} className="btn btn-primary" style={{
                        padding: '1rem 2.5rem',
                        fontSize: '1.1rem',
                        borderRadius: 'var(--radius-xl)'
                    }}>
                        {currentUser ? "Go to Dashboard" : "Use Now"}
                    </Link>

                    {!currentUser && (
                        <Link to="/register" className="btn btn-outline" style={{
                            padding: '1rem 2.5rem',
                            fontSize: '1.1rem',
                            borderRadius: 'var(--radius-xl)'
                        }}>
                            Sign Up Free
                        </Link>
                    )}
                </div>
            </div>

            <div style={{
                marginTop: '6rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                width: '100%'
            }}>
                <div className="card">
                    <h3 style={{ marginBottom: '1rem', color: 'var(--accent-cyan)' }}>Smart Generation</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Describe your topic and let our AI generate comprehensive outlines and content tailored to your needs.
                    </p>
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '1rem', color: 'var(--accent-pink)' }}>Easy Customization</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Refine and edit generated content with an intuitive interface designed for productivity.
                    </p>
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>Instant Export</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Download your work in popular formats like Word and PowerPoint, ready for presentation.
                    </p>
                </div>
            </div>
        </div>
    );
}
