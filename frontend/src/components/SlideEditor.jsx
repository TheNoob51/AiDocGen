import React, { useState } from "react";

export default function SlideEditor({ initialSlides, onSave }) {
    const [slides, setSlides] = useState(initialSlides || [{ title: "Title Slide" }, { title: "Agenda" }]);

    function handleAdd() {
        setSlides([...slides, { title: `Slide ${slides.length + 1}` }]);
    }

    function handleRemove(index) {
        const newSlides = [...slides];
        newSlides.splice(index, 1);
        setSlides(newSlides);
    }

    function handleChange(index, value) {
        const newSlides = [...slides];
        newSlides[index].title = value;
        setSlides(newSlides);
    }

    return (
        <div className="card">
            <h3>Presentation Slides</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Define the slides for your presentation.</p>

            <div style={{ marginBottom: '1rem' }}>
                {slides.map((slide, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ width: '2rem', textAlign: 'right', color: 'var(--text-secondary)' }}>{index + 1}.</span>
                        <input
                            type="text"
                            value={slide.title}
                            onChange={(e) => handleChange(index, e.target.value)}
                            className="input-field"
                            style={{ marginBottom: 0 }}
                        />
                        <button onClick={() => handleRemove(index)} className="btn" style={{ padding: '0.25rem 0.5rem', color: '#ef4444' }}>✕</button>
                    </div>
                ))}
            </div>

            <button onClick={handleAdd} className="btn" style={{ width: '100%', marginBottom: '2rem', border: '1px dashed var(--border-color)', color: 'var(--text-secondary)' }}>
                + Add Slide
            </button>

            <button onClick={() => onSave(slides)} className="btn btn-primary" style={{ width: '100%' }}>
                Save & Generate Content
            </button>
        </div>
    );
}
