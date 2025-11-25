import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function Editor() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refining, setRefining] = useState(null); // Key of section being refined
    const [refineInstruction, setRefineInstruction] = useState("");
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        let interval;
        async function fetchProject() {
            try {
                const response = await api.get(`/projects/${id}`);
                setProject(response.data);

                // Stop loading if we have content or if status is not generating
                if (response.data.status !== 'generating') {
                    setLoading(false);
                    if (interval) clearInterval(interval);
                }
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        }

        fetchProject();
        // Poll if generating
        interval = setInterval(fetchProject, 3000);
        return () => clearInterval(interval);
    }, [id]);

    async function handleRefine(sectionKey) {
        if (!refineInstruction.trim()) return;

        try {
            setRefining(sectionKey);
            await api.post(`/projects/${id}/refine`, null, {
                params: {
                    section_key: sectionKey,
                    instruction: refineInstruction
                }
            });

            // Refresh project to get new content
            const response = await api.get(`/projects/${id}`);
            setProject(response.data);

            setRefineInstruction("");
            setRefining(null);
        } catch (err) {
            console.error(err);
            setRefining(null);
        }
    }

    async function handleExport() {
        try {
            const response = await api.get(`/projects/${id}/export`, {
                responseType: 'blob',
            });

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const extension = project.document_type === 'docx' ? 'docx' : 'pptx';
            link.setAttribute('download', `${project.title.replace(/\s+/g, '_')}.${extension}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error("Export failed", err);
            alert("Failed to export document");
        }
    }

    if (loading && !project) return <div className="container">Loading...</div>;
    if (!project) return <div className="container">Project not found</div>;

    const isGenerating = project.status === 'generating';

    return (
        <div className="container" style={{ maxWidth: '1000px', marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        onClick={() => window.location.href = '/dashboard'}
                        className="btn btn-outline"
                        style={{ padding: '0.5rem', border: 'none' }}
                        title="Back to Dashboard"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <h1 style={{ marginBottom: '0.5rem', lineHeight: 1 }}>{project.title}</h1>
                        <span style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.875rem',
                            backgroundColor: isGenerating ? '#f59e0b' : '#10b981',
                            color: 'white'
                        }}>
                            {isGenerating ? 'Generating Content...' : 'Ready for Refinement'}
                        </span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-outline" onClick={() => setShowHistory(true)}>
                        History
                    </button>
                    <button className="btn btn-primary" disabled={isGenerating} onClick={handleExport}>
                        Export Document
                    </button>
                </div>
            </div>

            <div className="editor-content">
                {project.document_type === 'docx' && project.configuration?.outline?.map((section, index) => (
                    <div key={section} className="card" style={{ marginBottom: '2rem' }}>
                        <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                            {section}
                        </h3>
                        <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                            {project.content?.[section] || (isGenerating ? <em style={{ color: 'var(--text-secondary)' }}>Generating...</em> : "No content")}
                        </div>

                        {!isGenerating && (
                            <div style={{ backgroundColor: 'var(--background-dark)', padding: '1rem', borderRadius: '0.5rem' }}>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <input
                                        type="text"
                                        className="input-field"
                                        style={{ marginBottom: 0 }}
                                        placeholder="Refine this section (e.g., 'Make it shorter')"
                                        value={refining === section ? refineInstruction : ""}
                                        onChange={(e) => {
                                            setRefining(section);
                                            setRefineInstruction(e.target.value);
                                        }}
                                    />
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleRefine(section)}
                                        disabled={refining === section && !refineInstruction}
                                    >
                                        {refining === section && refineInstruction ? "Refine" : "Refine"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {project.document_type === 'pptx' && project.configuration?.slides?.map((slide, index) => {
                    const slideKey = `slide_${index}`;
                    const slideContent = project.content?.[slideKey];

                    return (
                        <div key={index} className="card" style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                                <h3 style={{ margin: 0 }}>Slide {index + 1}: {slide.title}</h3>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <h4 style={{ color: 'var(--text-secondary)', marginTop: 0 }}>Content</h4>
                                <ul style={{ paddingLeft: '1.5rem' }}>
                                    {slideContent?.content?.bullets?.map((bullet, i) => (
                                        <li key={i} style={{ marginBottom: '0.5rem' }}>{bullet}</li>
                                    )) || (isGenerating ? <li><em>Generating...</em></li> : <li>No content</li>)}
                                </ul>

                                {slideContent?.content?.notes && (
                                    <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--background-dark)', borderRadius: '0.5rem' }}>
                                        <strong>Speaker Notes:</strong>
                                        <p style={{ margin: '0.5rem 0 0' }}>{slideContent.content.notes}</p>
                                    </div>
                                )}
                            </div>

                            {!isGenerating && (
                                <div style={{ backgroundColor: 'var(--background-dark)', padding: '1rem', borderRadius: '0.5rem' }}>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <input
                                            type="text"
                                            className="input-field"
                                            style={{ marginBottom: 0 }}
                                            placeholder="Refine this slide"
                                            value={refining === slideKey ? refineInstruction : ""}
                                            onChange={(e) => {
                                                setRefining(slideKey);
                                                setRefineInstruction(e.target.value);
                                            }}
                                        />
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleRefine(slideKey)}
                                            disabled={refining === slideKey && !refineInstruction}
                                        >
                                            Refine
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>


            {
                showHistory && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                        backdropFilter: 'blur(5px)'
                    }}>
                        <div className="card" style={{
                            width: '600px',
                            maxHeight: '80vh',
                            overflowY: 'auto',
                            padding: '2rem',
                            position: 'relative'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Edit History</h2>
                                <button
                                    onClick={() => setShowHistory(false)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        fontSize: '1.5rem',
                                        padding: '0.5rem',
                                        lineHeight: 1
                                    }}
                                >
                                    &times;
                                </button>
                            </div>

                            {project.history && project.history.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {project.history.slice().reverse().map((item, index) => (
                                        <div key={index} style={{
                                            padding: '1rem',
                                            backgroundColor: 'rgba(255,255,255,0.05)',
                                            borderRadius: '0.5rem',
                                            border: '1px solid var(--border-color)'
                                        }}>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                {new Date(item.timestamp).toLocaleString()}
                                            </div>
                                            <div style={{ color: 'var(--text-primary)' }}>{item.description}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                                    No history available yet. Refine your document to create history.
                                </div>
                            )}
                        </div>
                    </div>
                )
            }
        </div >
    );
}
