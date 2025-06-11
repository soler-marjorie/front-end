// components/UnivariateFunction/MathFieldComponent.jsx
import React, { Component } from "react";
import 'mathlive';
import './MathFieldComponent.css'; 

export class MathFieldComponent extends Component {
  render() {

    return (
      <math-field
          ref={this.props.forwardedRef} 
          className="
              w-full 
              h-[140px]
              rounded-xl                 
              border border-primary   
          "
          virtualkeyboardmode="manual"
          smartmode
      >
      </math-field>
    );  
  }
}