import React, { useState } from "react";

export default function OutlineEditor({ initialOutline, onSave }) {
    const [outline, setOutline] = useState(initialOutline || ["Introduction", "Body Paragraph 1", "Conclusion"]);
    const [newItem, setNewItem] = useState("");

    function handleAdd() {
        if (newItem.trim()) {
            setOutline([...outline, newItem.trim()]);
            setNewItem("");
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

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    className="input-field"
                    placeholder="New Section Title"
                    style={{ marginBottom: 0 }}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
                <button onClick={handleAdd} className="btn btn-primary">Add</button>
            </div>

            <button onClick={() => onSave(outline)} className="btn btn-primary" style={{ width: '100%' }}>
                Save & Generate Content
            </button>
        </div>
    );
}
