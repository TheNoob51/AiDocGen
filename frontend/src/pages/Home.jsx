import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import smartGenImg from '../assets/smart_generation.png';
import easyCustImg from '../assets/easy_customization.png';
import instantExpImg from '../assets/instant_export.png';
import secureImg from '../assets/secure_logo.png';
import realTimeImg from '../assets/real_time.png';

import bg1 from '../assets/bg_1.png';

export default function Home() {
    const { currentUser } = useAuth();

    return (
        <>
            <div className="fade-in" style={{ width: '100%', height: '60vh', position: 'relative', overflow: 'hidden' }}>


                <img src={bg1} alt="Background" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div className="container fade-in" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                marginTop: '-4.5rem',
                position: 'relative',
                zIndex: 10
            }}>
                <div style={{ maxWidth: '800px' }}>
                    <div style={{ maxWidth: '800px', position: 'relative', zIndex: 1 }}>
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
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: '2rem',
                        width: '100%',
                        paddingBottom: '6rem'
                    }}>
                        <div className="card" style={{ flex: '1 1 300px', maxWidth: '400px', padding: '0', overflow: 'hidden' }}>
                            <img src={smartGenImg} alt="Smart Generation" className="feature-card-img" />
                            <div style={{ padding: '2rem' }}>
                                <h3 style={{ marginBottom: '1rem', color: 'var(--accent-cyan)' }}>Smart Generation</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>
                                    Describe your topic and let our AI generate comprehensive outlines and content tailored to your needs.
                                </p>
                            </div>
                        </div>

                        <div className="card" style={{ flex: '1 1 300px', maxWidth: '400px', padding: '0', overflow: 'hidden' }}>
                            <img src={easyCustImg} alt="Easy Customization" className="feature-card-img" />
                            <div style={{ padding: '2rem' }}>
                                <h3 style={{ marginBottom: '1rem', color: 'var(--accent-pink)' }}>Easy Customization</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>
                                    Refine and edit generated content with an intuitive interface designed for productivity.
                                </p>
                            </div>
                        </div>

                        <div className="card" style={{ flex: '1 1 300px', maxWidth: '400px', padding: '0', overflow: 'hidden' }}>
                            <img src={instantExpImg} alt="Instant Export" className="feature-card-img" />
                            <div style={{ padding: '2rem' }}>
                                <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>Instant Export</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>
                                    Download your work in popular formats like Word and PowerPoint, ready for presentation.
                                </p>
                            </div>
                        </div>

                        <div className="card" style={{ flex: '1 1 300px', maxWidth: '400px', padding: '0', overflow: 'hidden' }}>
                            <img src={secureImg} alt="Secure & Private" className="feature-card-img" />
                            <div style={{ padding: '2rem' }}>
                                <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>Secure & Private</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>
                                    Your data is encrypted and stored securely. You retain full ownership of your generated documents.
                                </p>
                            </div>
                        </div>

                        <div className="card" style={{ flex: '1 1 300px', maxWidth: '400px', padding: '0', overflow: 'hidden' }}>
                            <img src={realTimeImg} alt="Real-time Preview" className="feature-card-img" />
                            <div style={{ padding: '2rem' }}>
                                <h3 style={{ marginBottom: '1rem', color: '#f59e0b' }}>Real-time Preview</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>
                                    See your document take shape as you edit. Instant feedback ensures your content looks perfect.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Workflow Section */}
            <div style={{
                width: '100%',
                background: 'rgba(17, 24, 39, 0.5)',
                padding: '6rem 0',
                borderTop: '1px solid var(--border-color)',
                borderBottom: '1px solid var(--border-color)'
            }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '4rem' }}>How It Works</h2>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '3rem',
                        position: 'relative'
                    }}>
                        {/* Step 1 */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                            <div className="workflow-step-icon" style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: 'var(--bg-card)',
                                border: '1px solid var(--primary-color)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1.5rem',
                                boxShadow: '0 0 20px rgba(99, 102, 241, 0.2)'
                            }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                </svg>
                            </div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>1. Define Topic</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                Simply enter a topic or title for your document or presentation.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                            <div className="workflow-step-icon" style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: 'var(--bg-card)',
                                border: '1px solid var(--accent-pink)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1.5rem',
                                boxShadow: '0 0 20px rgba(236, 72, 153, 0.2)'
                            }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-pink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="8" y1="6" x2="21" y2="6"></line>
                                    <line x1="8" y1="12" x2="21" y2="12"></line>
                                    <line x1="8" y1="18" x2="21" y2="18"></line>
                                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                                </svg>
                            </div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>2. Review Outline</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                AI suggests a structure. Customize it to fit your exact needs.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                            <div className="workflow-step-icon" style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: 'var(--bg-card)',
                                border: '1px solid var(--accent-cyan)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1.5rem',
                                boxShadow: '0 0 20px rgba(6, 182, 212, 0.2)'
                            }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
                                </svg>
                            </div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>3. Generate</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                Watch as AI writes professional content for each section instantly.
                            </p>
                        </div>

                        {/* Step 4 */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                            <div className="workflow-step-icon" style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: 'var(--bg-card)',
                                border: '1px solid #10b981',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1.5rem',
                                boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)'
                            }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                            </div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>4. Export</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                Download your finalized document as a Word file or PowerPoint.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer style={{
                width: '100%',
                padding: '4rem 0 2rem',
                borderTop: '1px solid var(--border-color)',
                background: 'var(--bg-dark)'
            }}>
                <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <img src="/assets/logo_main.png" alt="AI DocGen Logo" style={{ height: '32px', width: 'auto' }} />
                        <span style={{ fontSize: '1.5rem', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>AI DocGen</span>
                    </div>

                    <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                        <Link to="/" style={{ color: 'var(--text-secondary)' }}>Home</Link>
                        <Link to="/login" style={{ color: 'var(--text-secondary)' }}>Login</Link>
                        <Link to="/register" style={{ color: 'var(--text-secondary)' }}>Sign Up</Link>
                        <a href="#" style={{ color: 'var(--text-secondary)' }}>Privacy</a>
                        <a href="#" style={{ color: 'var(--text-secondary)' }}>Terms</a>
                    </div>

                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        © {new Date().getFullYear()} AI DocGen. All rights reserved.
                    </p>
                </div>
            </footer>
        </>
    );
}
