import { Component } from "react";
import "https://esm.run/mathlive";
import MathFieldKeyboardSelector from '../Components/UnivariateFunction/MathFieldKeyboardSelector';
import MathFieldComponent from '../Components/UnivariateFunction/MathFieldComponent';

export class UnivariateFunction extends Component {

  constructor(props) {
    super(props);
    this.state = {
      keyboardLayout: 'math',
    };
  }

  handleLayoutChange = (newLayout) => {
    this.setState({ keyboardLayout: newLayout });
  };

  render() {

    const { keyboardLayout } = this.state;

    return (
      <>
      <main>
        <h1>Univariate function</h1>

        {/* Function editing panel */}
        <section className="bg-primary/23 rounded-[15px]">
          
          {/* MathML editor */}
          {/* <h2>Presentation MathML editor</h2> */}


          {/* MathLive editor */}
          <section>
            <h2>MathLive editor</h2>
              {/* Keyboard parameters */}
              <MathFieldKeyboardSelector
                value={keyboardLayout}
                onChange={this.handleLayoutChange}
              />

            {/* MathField component */}
              <MathFieldComponent keyboardLayout={keyboardLayout} />
          </section>
          

        </section>
      </main>
      </>
    );
  }
}