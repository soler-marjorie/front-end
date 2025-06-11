// src/Components/UnivariateFunction/MathEditor.js
import React, { Component } from "react";
import 'mathlive';
import { MathMLToLaTeX } from "mathml-to-latex";

/* Utils */
import { formatMathML } from '../../Utils/formatMathml';

/* Editors */
import { MathFieldComponent } from './Editors/MathFieldComponent';
import { MathMLEditorComponent } from './Editors/MathMLEditorComponent';

//old code
// export class MathEditor extends Component {
//   constructor(props) {
//     super(props);
//     this.mathFieldRef = React.createRef();
//     const {value} = this.props;
//     this.state = {
//         input : value
//     }
//   }

//   componentDidMount() {
//     const mathField = this.mathFieldRef.current;

//     if (mathField) {
//     mathField.addEventListener("input", this.handleInput);
//     }

//     // Customize the MathField's shadow DOM styles
//     requestAnimationFrame(() => {
//         const shadow = mathField.shadowRoot;
//         if (shadow) {
//           const style = document.createElement("style");
//           style.textContent = `
//             .ML__container {
//               display: flex !important;
//               align-items: center !important;
//               justify-content: center;
//               height: 100%;
//             }
//           `;
//           shadow.appendChild(style);
//         }
//       });
//     }

//      componentWillUnmount() {
//         const mathField = this.mathFieldRef.current;
//         if (mathField) {
//             mathField.removeEventListener("input", this.handleInput);
//         }
//     }
    
//     handleInput = () => {
//         const mathField = this.mathFieldRef.current;
//         if (mathField) {
//             const mathml = mathField.getValue("math-ml");
//             const formatted = FormatMathML(mathml); 
//             this.setState({ input: formatted });
//         }
//     }

//     handleInputChange = (event) => {
//         const newInput = event.target.value;
//         // if (!newInput.includes("<math")) return;
//         this.setState({ input: newInput });
    
//         try {
//             const preparedMathML = newInput.replace(/<mo>&InvisibleTimes;<\/mo>/g, '<mo>&#x22C5;</mo>').replace(/&PlusMinus;/g, '&#x00B1;');
//             const latex = MathMLToLaTeX.convert(preparedMathML);
//             this.mathFieldRef.current.setValue(latex);
//         } catch (error) {
//             console.error("Erreur lors de la conversion MathML → LaTeX :", error);
//         }
//     }
    

//     handleClick = () => {
//         const formattedinput = FormatMathML(this.state.input);
//         this.setState({ input: formattedinput });
//         this.props.onClick(formattedinput);
//     }

//     handleClear = () => {
//         this.setState({ input: '' });
//         this.mathFieldRef.current.setValue("");
//         this.props.onClear();
//     }

//     handleChange = (event) => {
//         const newValue = event.target.input;
//         this.setState({ input: newValue });
//     }
  


//   render() {
//     const {
//       isMathMLEditorVisible,
//       onToggleVisibility,
//       input, 
//       mainGridClasses,
//       mathMLTitleContainerClasses,
//     } = this.props;

//     return (
//       <section className={mainGridClasses}>
//         <section className="flex flex-col md:col-span-1">
//           <div className={mathMLTitleContainerClasses}>
//             <h2>MathML editor</h2>
//           </div>
//           <MathMLEditorComponent
//             isVisible={isMathMLEditorVisible}
//             onToggleVisibility={onToggleVisibility}
//             content={input}
//             onChangeContent={this.handleTextareaChange} 
//             onChange={this.handleInputChange}
//           />
//         </section>

//         <section className="w-full flex flex-col items-center md:items-start md:col-span-1">
//           <h2 className="text-center w-full">MathLive editor</h2>
//           <MathFieldComponent forwardedRef={this.mathFieldRef} />
//         </section>

//         {!isMathMLEditorVisible && (
//           <div className="hidden md:block md:col-span-1"></div>
//         )}

//         <section className="md:col-span-full flex flex-col items-center gap-4 py-4 lg:flex-row lg:justify-center lg:gap-x-4">
//           <button
//             type="button"
//             className="px-8 py-3 bg-gray-500 text-white text-sm sm:text-base rounded-lg hover:bg-blue-900 transition duration-200 shadow-md"
//             onClick={this.handleClear}
//           >
//             Clear
//           </button>
//         </section>
//       </section>
//     );
//   }
// }


export class MathEditor extends Component {
  constructor(props) {
    super(props);
    this.mathFieldRef = React.createRef();
    this.state = {
      input: props.value || '', 
      prevValue: props.value 
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.value !== prevState.prevValue) {
      return {
        input: nextProps.value,
        prevValue: nextProps.value,
      };
    }
    return null;
  }

  componentDidMount() {
    const mathField = this.mathFieldRef.current;

    if (mathField) {
      mathField.addEventListener("input", this.handleMathFieldInput);

      this.updateMathFieldFromState();

      // Customize the MathField's shadow DOM styles
      requestAnimationFrame(() => {
        const shadow = mathField.shadowRoot;
        if (shadow) {
          const style = document.createElement("style");
          style.textContent = `
            .ML__container {
              display: flex !important;
              align-items: center !important;
              justify-content: center;
              height: 100%;
            }
          `;
          shadow.appendChild(style);
        }
      });
    }
  }

  componentWillUnmount() {
    const mathField = this.mathFieldRef.current;
    if (mathField) {
      mathField.removeEventListener("input", this.handleMathFieldInput);
    }
  }
  
  handleMathFieldInput = () => {
    const mathField = this.mathFieldRef.current;
    if (mathField) {
      const mathml = mathField.getValue("math-ml");
      const formatted = formatMathML(mathml);
      this.setState({ input: formatted });
      if (this.props.onChange) {
        this.props.onChange(formatted);
      }
    }
  }

  handleTextareaChange = (event) => {
    const newInput = event.target.value;
    this.setState({ input: newInput }, () => {
      this.updateMathFieldFromState();
    });
    if (this.props.onChange) {
      this.props.onChange(newInput);
    }
  }

  updateMathFieldFromState = () => {
    try {
      const { input } = this.state;
      // if (!input.includes("<math")) return; // Ce garde peut être trop strict

      const preparedMathML = input
        .replace(/<mo>⁢<\/mo>/g, '<mo>⋅</mo>')
        .replace(/±/g, '±');
        
      if (preparedMathML.trim()) {
        const latex = MathMLToLaTeX.convert(preparedMathML);
        this.mathFieldRef.current.setValue(latex, { suppressChangeNotifications: true });
      } else {
        this.mathFieldRef.current.setValue("", { suppressChangeNotifications: true });
      }

    } catch (error) {
      console.error("Erreur lors de la conversion MathML → LaTeX :", error);
    }
  }

  handleClear = () => {
    this.setState({ input: '' });
    if(this.mathFieldRef.current) {
        this.mathFieldRef.current.setValue("");
    }
    if(this.props.onClear) {
        this.props.onClear();
    }
    if (this.props.onChange) {
      this.props.onChange('');
    }
  }
  

  render() {
    const {
      isMathMLEditorVisible,
      onToggleVisibility,
      mainGridClasses,
      mathMLTitleContainerClasses,
    } = this.props;

    return (
      <section className={mainGridClasses}>
        <section className="flex flex-col md:col-span-1">
          <div className={mathMLTitleContainerClasses}>
            <h2>MathML editor</h2>
          </div>
          <MathMLEditorComponent
            isVisible={isMathMLEditorVisible}
            onToggleVisibility={onToggleVisibility}
            content={this.state.input}
            onChangeContent={this.handleTextareaChange} 
          />
        </section>

        <section className="w-full flex flex-col items-center md:items-start gap-2 md:col-span-1">
          <h2 className="text-center w-full">MathLive editor</h2>
          <MathFieldComponent forwardedRef={this.mathFieldRef} />
        </section>

        {!isMathMLEditorVisible && (
          <div className="hidden md:block md:col-span-1"></div>
        )}

        <section className="md:col-span-full flex flex-col items-center gap-4 py-4 lg:flex-row lg:justify-center lg:gap-x-4">
          <button
            type="button"
            className="px-8 py-3 bg-gray-500 text-white text-sm sm:text-base rounded-lg hover:bg-blue-900 transition duration-200 shadow-md"
            onClick={this.handleClear}
          >
            Clear
          </button>
        </section>
      </section>
    );
  }
}