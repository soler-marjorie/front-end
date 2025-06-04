import { Component } from "react";
import "https://esm.run/mathlive";
import MathFieldComponent from '../Components/UnivariateFunction/MathFieldComponent';

export class UnivariateFunction extends Component {

  render() {

    return (
      <>
      <main>
        <h1>Univariate function</h1>

        {/* Function editing panel */}
        <section className="bg-primary/23 rounded-[15px]">
          
          {/* MathML editor */}
          {/* <h2>Presentation MathML editor</h2> */}


          {/* MathLive editor */}
          <section className="p-4 w-3/4 md:w-1/2 mx-auto flex flex-col items-center">
            <h2 className="pb-2">MathLive editor</h2>

            {/* MathField component */}
            <MathFieldComponent />
          </section>
          

        </section>
      </main>
      </>
    );
  }
}