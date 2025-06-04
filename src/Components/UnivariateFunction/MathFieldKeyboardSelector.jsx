// components/UnivariateFunction/MathFieldKeyboardSelector.jsx
import React from 'react';

export default function MathFieldKeyboardSelector({ value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Choisir le clavier :
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded px-2 py-1"
      >
        <option value="math">Math</option>
        <option value="latex">LaTeX</option>
        <option value="qwerty">Texte (QWERTY)</option>
        <option value="numeric">Numérique</option>
      </select>
    </div>
  );
}
