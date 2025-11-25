import React, { useState } from "react";
import api from "../services/api";

export default function OutlineEditor({ initialOutline, onSave, projectId }) {
    const [outline, setOutline] = useState(initialOutline || ["Introduction", "Body Paragraph 1", "Conclusion"]);
    const [newItem, setNewItem] = useState("");
    const [recommendations, setRecommendations] = useState([]);
    const [loadingRecs, setLoadingRecs] = useState(false);

    function handleAdd(itemToAdd = newItem) {
        if (itemToAdd.trim()) {
            setOutline([...outline, itemToAdd.trim()]);
            if (itemToAdd === newItem) {
                setNewItem("");
            } else {
                // Remove from recommendations if added
                setRecommendations(recommendations.filter(r => r !== itemToAdd));
            }
        }
    }

    function handleRemove(index) {
        const newOutline = [...outline];
        newOutline.splice(index, 1);
        setOutline(newOutline);
    }

    function handleMove(index, direction) {
        if ((direction === -1 && index === 0) || (direction === 1 && index === outline.length - 1)) return;
        const newOutline = [...outline];
        const temp = newOutline[index];
        newOutline[index] = newOutline[index + direction];
        newOutline[index + direction] = temp;
        setOutline(newOutline);
    }

    async function fetchRecommendations() {
        if (!projectId) return;
        setLoadingRecs(true);
        try {
            const response = await api.post(`/projects/${projectId}/recommend-outline`, {
                current_outline: outline
            });
            setRecommendations(response.data.recommendations);
        } catch (error) {
            console.error("Failed to fetch recommendations:", error);
        } finally {
            setLoadingRecs(false);
        }
    }

    return (
        <div className="card">
            <h3>Document Outline</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Define the sections of your document.</p>

            <div style={{ marginBottom: '1rem' }}>
                {outline.map((item, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', padding: '0.5rem', backgroundColor: 'var(--background-dark)', borderRadius: '0.25rem' }}>
                        <span style={{ flex: 1 }}>{index + 1}. {item}</span>
                        <button onClick={() => handleMove(index, -1)} className="btn" style={{ padding: '0.25rem 0.5rem' }}>↑</button>
                        <button onClick={() => handleMove(index, 1)} className="btn" style={{ padding: '0.25rem 0.5rem' }}>↓</button>
                        <button onClick={() => handleRemove(index)} className="btn" style={{ padding: '0.25rem 0.5rem', color: '#ef4444' }}>✕</button>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    className="input-field"
                    placeholder="New Section Title"
                    style={{ marginBottom: 0 }}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
                <button onClick={() => handleAdd()} className="btn btn-primary">Add</button>
            </div>

            {/* AI Recommendations Section */}
            <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--primary-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ margin: 0, color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>✨</span> AI Suggestions
                    </h4>
                    <button
                        onClick={fetchRecommendations}
                        disabled={loadingRecs}
                        className="btn btn-sm"
                        style={{ fontSize: '0.85rem', padding: '0.25rem 0.75rem' }}
                    >
                        {loadingRecs ? 'Generating...' : 'Get Recommendations'}
                    </button>
                </div>

                {recommendations.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {recommendations.map((rec, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAdd(rec)}
                                className="btn"
                                style={{
                                    backgroundColor: 'var(--background-paper)',
                                    border: '1px solid var(--border-color)',
                                    fontSize: '0.9rem',
                                    padding: '0.25rem 0.75rem',
                                    height: 'auto'
                                }}
                            >
                                + {rec}
                            </button>
                        ))}
                    </div>
                ) : (
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                        Click the button above to get AI-powered section suggestions based on your topic.
                    </p>
                )}
            </div>

            <button onClick={() => onSave(outline)} className="btn btn-primary" style={{ width: '100%' }}>
                Save & Generate Content
            </button>
        </div>
    );
}
