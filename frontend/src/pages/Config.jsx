import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

export default function Config() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [docType, setDocType] = useState("docx");
    const titleRef = useRef();
    const descriptionRef = useRef();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await api.post("/projects/", {
                title: titleRef.current.value,
                description: descriptionRef.current.value,
                document_type: docType,
                user_id: currentUser.uid
            });

            // Redirect to the editor/refinement page (or outline config step)
            // For now, let's assume we go to a project setup step or directly to editor if we skip outline
            // But requirements say: 1. Choose type, 2. Topic, 3. Outline/Slides
            // So maybe this creates the project and then we go to /project/:id/configure
            navigate(`/project/${response.data.id}/configure`);
        } catch (err) {
            console.error("Project creation error:", err);
            const errorMessage = err.response?.data?.detail || err.message || "Failed to create project";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container fade-in" style={{ maxWidth: '800px', marginTop: '3rem' }}>
            <div className="card">
                <div style={{ textAlign: 'center', marginBottom: '3rem', position: 'relative' }}>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="btn btn-outline"
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            padding: '0.5rem',
                            border: 'none'
                        }}
                        title="Back to Dashboard"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h2 style={{ marginBottom: '0.5rem' }}>Create New Project</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Define your document requirements to get started</p>
                </div>

                {error && <div style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#fca5a5',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '2rem'
                }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '2.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '1rem', fontSize: '1rem' }}>Select Document Type</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <button
                                type="button"
                                className="btn"
                                style={{
                                    height: 'auto',
                                    padding: '2rem',
                                    flexDirection: 'column',
                                    gap: '1rem',
                                    border: docType === 'docx' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                                    backgroundColor: docType === 'docx' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(17, 24, 39, 0.4)',
                                    color: docType === 'docx' ? 'white' : 'var(--text-secondary)',
                                    transition: 'all 0.2s ease'
                                }}
                                onClick={() => setDocType('docx')}
                            >
                                <span style={{ fontSize: '2.5rem' }}>📝</span>
                                <div>
                                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Word Document</div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Best for reports, essays, and articles</div>
                                </div>
                            </button>
                            <button
                                type="button"
                                className="btn"
                                style={{
                                    height: 'auto',
                                    padding: '2rem',
                                    flexDirection: 'column',
                                    gap: '1rem',
                                    border: docType === 'pptx' ? '2px solid var(--accent-pink)' : '1px solid var(--border-color)',
                                    backgroundColor: docType === 'pptx' ? 'rgba(236, 72, 153, 0.1)' : 'rgba(17, 24, 39, 0.4)',
                                    color: docType === 'pptx' ? 'white' : 'var(--text-secondary)',
                                    transition: 'all 0.2s ease'
                                }}
                                onClick={() => setDocType('pptx')}
                            >
                                <span style={{ fontSize: '2.5rem' }}>📊</span>
                                <div>
                                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>PowerPoint Presentation</div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Best for slides, pitches, and lectures</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label>Project Title / Topic</label>
                        <input type="text" ref={titleRef} required className="input-field" placeholder="e.g. Market Analysis of EV Industry" style={{ fontSize: '1.1rem', padding: '1rem' }} />
                    </div>

                    <div style={{ marginBottom: '2.5rem' }}>
                        <label>Description (Optional)</label>
                        <textarea
                            ref={descriptionRef}
                            className="input-field"
                            rows="4"
                            placeholder="Brief description of the project context, target audience, or specific requirements..."
                            style={{ resize: 'vertical', minHeight: '100px' }}
                        ></textarea>
                    </div>

                    <button disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }} type="submit">
                        Start Configuration →
                    </button>
                </form>
            </div>
        </div>
    );
}
