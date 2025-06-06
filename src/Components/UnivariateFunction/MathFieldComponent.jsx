// components/UnivariateFunction/MathFieldComponent.jsx
import React, { Component } from "react";
import 'mathlive';
import './MathFieldComponent.css'; 

export class MathFieldComponent extends Component {
  
  render() {
    return (
      <math-field
          className="
              w-full 
              h-[140px]
              rounded-xl                 
              border border-primary   
              shadow-sm 
          "
          virtualkeyboardmode="manual"
          smartmode
      >
          {`\\displaystyle x={\\frac {-b\\pm {\\sqrt {b^{2}-4ac}}}{2a}}`}
      </math-field>
    );  
  }
}
