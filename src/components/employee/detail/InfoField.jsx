import React from 'react';

export default function InfoField({ label, value, className = '' }) {
  return (
    <div className={className}>
      <p className="text-gray-500 mx-2 py-3 font-semibold">{label}</p>
      <p style={{ borderBottom: '1px solid #d9d9d9' }} className="rounded py-1">
        <span className="mx-2">{value || ''}</span>
      </p>
    </div>
  );
}
