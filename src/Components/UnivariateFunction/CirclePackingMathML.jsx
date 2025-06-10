// src/Components/UnivariateFunction/CirclePackingMathML.jsx
import React from 'react';
import { ResponsiveCirclePacking } from '@nivo/circle-packing';
import { parseMathMLToTree } from './Utils/parseMathMLToTree';
//import DoubleRangeSlider from '../Utils/DoubleRangeSlider'; 

class CirclePackingMathML extends React.Component {
  constructor(props) {
    super(props);
    
    const initialData = parseMathMLToTree(this.props.mathml);

    this.state = {
      data: initialData,
      zoomedId: initialData ? initialData.name : null,
      profondeurNode: 0,
    };
  }


  static getDerivedStateFromProps(props, state) {
    if (props.mathml !== state.prevMathml) {
      const newData = parseMathMLToTree(props.mathml);
      return {
        data: newData,
        zoomedId: newData ? newData.name : null,
        profondeurNode: 0,
        prevMathml: props.mathml, 
      };
    }
    return null; 
  }


  handleClick = (node) => {
    const rootId = this.state.data ? this.state.data.name : null;
    this.setState((prevState) => ({
      zoomedId: prevState.zoomedId === node.id ? rootId : node.id,
      profondeurNode:
        prevState.zoomedId === node.id ? 0 : node.depth,
    }));
  };


  
  gaga = node => {
    return node.data.color || '#cccccc';
  }

  render() {
    const { data, zoomedId } = this.state;

    if (!data) {
      return null;
    }


    return (
      <section className="flex flex-col gap-4 h-screen lg:flex-row lg:gap-4">
        <section className="w-full lg:basis-[65%] bg-white rounded-lg border border-gray-300 shadow-lg overflow-hidden">
          <ResponsiveCirclePacking
            data={data}
            zoomedId={zoomedId}
            onClick={this.handleClick}
            // ...
          />
        </section>
        <section className="w-full lg:basis-[35%] bg-white p-4 sm:p-6 rounded-lg overflow-y-auto">
          <h2 className="block font-medium text-gray-700 mb-2">Bulle sélectionnée :</h2>
          <output className="block w-full min-h-[4rem] text-gray-800 bg-gray-100 border border-gray-300 shadow-inner p-2 rounded-md text-sm sm:text-base">
            <div className='overflow-x-auto' dangerouslySetInnerHTML={{ __html: zoomedId }} />
          </output>
          <div className="mt-4 w-full">
            {/* <DoubleRangeSlider /> */}
          </div>
        </section>
      </section>
    );
  }
}

// Le fichier utilise bien un export par défaut, donc la correction dans l'import est la bonne.
export default CirclePackingMathML;