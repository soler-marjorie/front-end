// components/UnivariateFunction/MathFieldComponent.jsx
import React from 'react';
import 'mathlive';
import './MathFieldComponent.css'; 

export default function MathFieldComponent() {


  return (
    <math-field
        className="
            w-[342px] h-[100px] 
            md:w-[590px]
            rounded-xl                 
            border border-blue-200    
            shadow-sm 
        "
        virtualkeyboardmode="manual"
        smartmode
    >
        {`\\displaystyle x={\\frac {-b\\pm {\\sqrt {b^{2}-4ac}}}{2a}}`}
    </math-field>
  );
}
