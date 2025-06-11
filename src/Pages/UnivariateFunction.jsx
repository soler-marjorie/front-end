// src/pages/UnivariateFunction.jsx
import React, { Component } from "react";
import 'mathlive';
import DOMPurify from 'dompurify';

/* Components */
import { MathEditor } from '../components/UnivariateFunction/MathEditor'; 
import CirclePackingMathML from '../components/UnivariateFunction/CirclePackingMathML'; 

/* Utils */
import { convertPresentationToContent } from '../Utils/convertPresentationToContent';



export class UnivariateFunction extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      isMathMLEditorVisible: false,
      presentation: '',
      Content: '',
      k: 0
    };
  }

  // Open or close MathML editor 
  toggleMathMLEditorVisibility = () => {
    this.setState(prevState => ({
      isMathMLEditorVisible: !prevState.isMathMLEditorVisible,
    }));
  };

  // Handle content change in MathML editor
  handleClick = async(input) => {
        const docHeader = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"

        const cleanPresentation = DOMPurify.sanitize(input);
        
        this.setState({ presentation: cleanPresentation });
        const presentationMathMLDoc = docHeader.concat(cleanPresentation);
        try {
            const contentMathMLDoc = await convertPresentationToContent(presentationMathMLDoc);
            const contentMathML = contentMathMLDoc.replace(docHeader, "");
            this.setState({ content: contentMathML });
            console.log(contentMathML);

        } catch (error) {
            console.error("Erreur de transformation XSLT :", error);
        }
        
        this.state.k += 1;
        
    }

  // Clear the content of the MathML editor and MathLive editor
  handleClear = () => {
    this.setState({ content: '' });
  }
  
  render() {
    const {
      isMathMLEditorVisible,
      presentation
    } = this.state;

    const mainGridClasses = `bg-primary/23 rounded-[15px] shadow-xl grid grid-cols-1 ${
      isMathMLEditorVisible ? 'md:grid-cols-2' : 'md:grid-cols-3'
    } p-4 gap-4`;

    const mathMLTitleContainerClasses = `mb-2 w-full flex ${
      isMathMLEditorVisible ? 'justify-center' : 'justify-center md:justify-start'
    }`;

    return (
      <>
        <main className="p-1">
          <h1>Univariate function</h1>

          <MathEditor
            isMathMLEditorVisible={isMathMLEditorVisible}
            onToggleVisibility={this.toggleMathMLEditorVisibility}
            onContentChange={this.handleContentChange}
            onClear={this.handleClear} 
            mainGridClasses={mainGridClasses}
            mathMLTitleContainerClasses={mathMLTitleContainerClasses}
          />

          <section className="p-8">
            {presentation &&
              <CirclePackingMathML
                key={this.state.k}
                mathml={presentation}
              />
            }
          </section>
        </main>
      </>
    );
  }
}