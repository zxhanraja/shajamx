import React, { useRef, useState } from 'react';

export default function AccordionItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef();

  return (
    <div style={{ borderBottom: '1px solid #1e1e2e', padding: '1.5rem 0', cursor: 'pointer' }} onClick={() => setOpen(!open)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.2rem', fontWeight: 700 }}>
        <span>{question}</span>
        <span style={{ color: '#00e5ff', transform: open ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>+</span>
      </div>
      <div 
        ref={contentRef}
        style={{ 
          maxHeight: open ? '200px' : '0px', 
          overflow: 'hidden', 
          transition: 'max-height 0.3s ease',
          color: '#f0f0f0',
          opacity: 0.8,
          marginTop: open ? '1rem' : '0'
        }}
      >
        {answer}
      </div>
    </div>
  );
}
