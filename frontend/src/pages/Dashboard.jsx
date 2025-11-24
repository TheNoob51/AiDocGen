import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

export default function Dashboard() {
    const { currentUser } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchProjects() {
            if (!currentUser) return;
            try {
                const response = await api.get(`/projects/?user_id=${currentUser.uid}`);
                setProjects(response.data);
            } catch (error) {
                console.error("Failed to fetch projects", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProjects();
    }, [currentUser]);

    const handleDelete = async (e, projectId) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this project?")) {
            try {
                await api.delete(`/projects/${projectId}`);
                setProjects(projects.filter(p => p.id !== projectId));
            } catch (error) {
                console.error("Failed to delete project", error);
                alert("Failed to delete project");
            }
        }
    };

    const handleEdit = (e, projectId) => {
        e.stopPropagation();
        navigate(`/project/${projectId}/configure`);
    };

    return (
        <div className="container fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ marginBottom: '0.5rem' }}>My Projects</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage and edit your AI-generated documents</p>
                </div>
                <Link to="/create-project" className="btn btn-primary">
                    <span style={{ marginRight: '0.5rem', fontSize: '1.2rem' }}>+</span> New Project
                </Link>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                    Loading your projects...
                </div>
            ) : projects.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '6rem 2rem', borderStyle: 'dashed', borderColor: 'var(--border-color)', background: 'transparent' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No projects yet</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
                        Create your first AI-assisted document to get started. We'll help you generate content in seconds.
                    </p>
                    <Link to="/create-project" className="btn btn-primary">
                        Create Project
                    </Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                    {projects.map((project) => (
                        <div key={project.id} className="card" style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden' }} onClick={() => navigate(project.status === 'draft' ? `/project/${project.id}/configure` : `/project/${project.id}/editor`)}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                <span style={{
                                    display: 'inline-block',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '2rem',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    backgroundColor: project.document_type === 'docx' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(236, 72, 153, 0.1)',
                                    color: project.document_type === 'docx' ? '#818cf8' : '#f472b6',
                                    border: `1px solid ${project.document_type === 'docx' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(236, 72, 153, 0.2)'}`
                                }}>
                                    {project.document_type === 'docx' ? 'DOCX' : 'PPTX'}
                                </span>
                                <span style={{
                                    display: 'inline-block',
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    backgroundColor: project.status === 'completed' ? '#10b981' : '#f59e0b',
                                    boxShadow: `0 0 8px ${project.status === 'completed' ? '#10b981' : '#f59e0b'}`
                                }}></span>
                            </div>

                            <h3 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '1.25rem', lineHeight: '1.4' }}>{project.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {project.description || "No description provided."}
                            </p>

                            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={(e) => handleEdit(e, project.id)}
                                        className="btn btn-outline"
                                        style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={(e) => handleDelete(e, project.id)}
                                        className="btn"
                                        style={{
                                            fontSize: '0.8rem',
                                            padding: '0.4rem 0.8rem',
                                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                            color: '#ef4444',
                                            border: '1px solid rgba(239, 68, 68, 0.2)'
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                                <span style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: '500' }}>
                                    Open →
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
