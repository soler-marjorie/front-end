import React, { Component } from "react";
import 'mathlive';
import { MathFieldComponent } from '../Components/UnivariateFunction/MathFieldComponent';
import { MathMLEditorComponent } from '../Components/UnivariateFunction/MathMLEditorComponent';

export class UnivariateFunction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMathMLEditorVisible: false,
      mathMLContent: "",
    };
  }

  toggleMathMLEditorVisibility = () => {
    this.setState(prevState => ({
      isMathMLEditorVisible: !prevState.isMathMLEditorVisible,
    }));
  };

  handleMathMLChange = (event) => {
    this.setState({ mathMLContent: event.target.value });
  };


  render() {
    const { isMathMLEditorVisible, mathMLContent } = this.state;

    const mainGridClasses = `bg-primary/23 rounded-[15px] shadow-xl grid grid-cols-1 ${
      isMathMLEditorVisible ? 'md:grid-cols-2' : 'md:grid-cols-3'
    } p-4 gap-4`;

    const mathMLTitleContainerClasses = `mb-2 w-full flex ${
      isMathMLEditorVisible 
        ? 'justify-center'
        : 'justify-center md:justify-start'
    }`;

    return (
      <>
      <main className="p-1">
        <h1>Univariate function</h1>

        <section className={mainGridClasses}>

          {/* MathML editor */}
          <section className="flex flex-col md:col-span-1">
            <div className={mathMLTitleContainerClasses}>
              <h2>MathML editor</h2>
            </div>

            <MathMLEditorComponent
              isVisible={isMathMLEditorVisible}
              onToggleVisibility={this.toggleMathMLEditorVisibility}
              content={mathMLContent}
              onChangeContent={this.handleMathMLChange}
            />
          </section>

          {/* MathLive editor */}
          <section className="w-full flex flex-col items-center md:items-start gap-2 md:col-span-1">
            <h2 className="text-center w-full">
              MathLive editor
            </h2>
           
            <MathFieldComponent />
          </section>

          {!isMathMLEditorVisible && (
            <div className="hidden md:block md:col-span-1"></div>
          )}

        </section>
      </main>
      </>
    );
  }
}