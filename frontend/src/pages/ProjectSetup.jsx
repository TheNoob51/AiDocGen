import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import OutlineEditor from "../components/OutlineEditor";
import SlideEditor from "../components/SlideEditor";

export default function ProjectSetup() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchProject() {
            try {
                const response = await api.get(`/projects/${id}`);
                setProject(response.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load project");
            } finally {
                setLoading(false);
            }
        }
        fetchProject();
    }, [id]);

    async function handleSave(configData) {
        try {
            setLoading(true);
            const configPayload = {
                topic: project.title,
                outline: project.document_type === 'docx' ? configData : null,
                slides: project.document_type === 'pptx' ? configData : null
            };

            await api.put(`/projects/${id}/config`, configPayload);

            // Trigger generation
            await api.post(`/projects/${id}/generate`);

            navigate(`/project/${id}/editor`);
        } catch (err) {
            console.error(err);
            setError("Failed to save configuration");
            setLoading(false);
        }
    }

    if (loading) return <div className="container">Loading...</div>;
    if (error) return <div className="container" style={{ color: 'red' }}>{error}</div>;
    if (!project) return <div className="container">Project not found</div>;

    return (
        <div className="container" style={{ maxWidth: '800px', marginTop: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ marginBottom: '0.5rem' }}>{project.title}</h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    {project.document_type === 'docx' ? 'Word Document' : 'PowerPoint Presentation'} Configuration
                </p>
            </div>

            {project.document_type === 'docx' ? (
                <OutlineEditor projectId={id} onSave={handleSave} initialOutline={project.configuration?.outline} />
            ) : (
                <SlideEditor onSave={handleSave} initialSlides={project.configuration?.slides} />
            )}
        </div>
    );
}
