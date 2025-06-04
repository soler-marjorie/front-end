// components/UnivariateFunction/MathFieldComponent.jsx
import React, { useRef, useEffect } from 'react';
import 'mathlive';

export default function MathFieldComponent({ keyboardLayout }) {
  const mathFieldRef = useRef(null);

  useEffect(() => {
    if (mathFieldRef.current) {
      // Appliquer la config du clavier virtuel
      mathFieldRef.current.virtualKeyboardLayout = keyboardLayout;

    }
  }, [keyboardLayout]);

  return (
    <math-field
        className="
            w-[342px] h-[50px] 
            md:w-[590px] md:h-[100px]
            rounded-xl                 
            border border-blue-200    
            shadow-sm 
            p-2
        "
        ref={mathFieldRef}
        virtualkeyboardmode="manual"
        smartmode
    >
        {`\\displaystyle x={\\frac {-b\\pm {\\sqrt {b^{2}-4ac}}}{2a}}`}
    </math-field>
  );
}
