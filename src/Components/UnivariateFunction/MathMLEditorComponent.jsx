// src/Components/UnivariateFunction/MathMLEditorComponent.js
import React, { Component } from 'react';

export class MathMLEditorComponent extends Component {
  render() {
    // Props destructuring for better readability
    // isVisible: Boolean to check if the editor is open or closed
    const { isVisible, onToggleVisibility, content, onChangeContent } = this.props;

    if (!isVisible) {
      // Satus: MathML Editor is closed
      return (
        <>
            <div className="w-full md:w-12 md:h-[140px] rounded-[5px] border border-primary bg-white p-1 flex items-center justify-center">
                <button
                    type="button"
                    onClick={onToggleVisibility}
                    className="block md:hidden p-2 text-primary"
                    aria-label="Ouvrir l'éditeur MathML"
                >
                    <i className="fa fa-angle-double-down fa-lg"></i>
                </button>
                <button
                    type="button"
                    onClick={onToggleVisibility}
                    className="hidden md:flex items-center justify-center h-full w-full text-primary"
                    aria-label="Ouvrir l'éditeur MathML"
                >
                    <i className="fa fa-angle-double-right fa-lg"></i>
                </button>
            </div>
        </>
      );
    } else {
      // OPEN Status: Full MathML Editor
      return (
        <>
            <div className="w-full min-h-[140px] p-3 rounded-[5px] border border-primary bg-yellow-50 flex flex-col">

                <div className="flex justify-between items-center mb-1 flex-shrink-0">
                    <p className="text-xs text-gray-600">
                    Exemple : <code>{'<math><mi>x</mi><mo>=</mo><mn>5</mn></math>'}</code>
                    </p>
                    {/* Closure button */}
                    <button
                        type="button"
                        onClick={onToggleVisibility}
                        className="hidden md:block text-primary hover:text-primary-dark p-1 flex-shrink-0"
                        aria-label="Fermer l'éditeur MathML"
                    >
                        <i className="fa fa-angle-double-left fa-lg"></i>
                    </button>
                    <button
                        type="button"
                        onClick={onToggleVisibility}
                        className="block md:hidden text-primary hover:text-primary-dark p-1 flex-shrink-0"
                        aria-label="Fermer l'éditeur MathML"
                    >
                        <i className="fa fa-angle-double-up fa-lg"></i>
                    </button>
                </div>

                {/* MathML Input Box*/}
                <textarea
                    value={content}
                    onChange={onChangeContent}
                    className="w-full flex-grow p-2 border border-gray-300 rounded font-mono text-sm focus:ring-primary focus:border-primary shadow-inner"
                    style={{ resize: 'vertical', minHeight: '60px' }} // Valeur fixe pour minHeight, ex: 60px ou 4rem
                    aria-label="Input for MathML expression"
                />
            </div>
        </>
      );
    }
  }
}