import React from 'react';
// OLd code for DoubleRangeSlider
// const DoubleRangeSlider = () => {

//   const [minInput, setMinInput] = useState("500");
//   const [maxInput, setMaxInput] = useState("1000");
//   const [minValue, setMinValue] = useState(500);
//   const [maxValue, setMaxValue] = useState(1000);

//   const range = useRef(null);

//   const parsedMin = parseFloat(minInput.replace(',', '.'));
//   const parsedMax = parseFloat(maxInput.replace(',', '.'));

//   const step = (parsedMax - parsedMin) / 100 || 1;

//   useEffect(() => {
//     const getPercent = (value) =>
//       ((value - parsedMin) / (parsedMax - parsedMin)) * 100;

//     const minPercent = getPercent(minValue);
//     const maxPercent = getPercent(maxValue);

//     if (range.current) {
//       range.current.style.left = `${minPercent}%`;
//       range.current.style.width = `${maxPercent - minPercent}%`;
//     }
//   }, [minValue, maxValue, parsedMin, parsedMax]);

//   useEffect(() => {
//     if (!isNaN(parsedMin)) setMinValue(parsedMin);
//     if (!isNaN(parsedMax)) setMaxValue(parsedMax);
//   }, [parsedMin, parsedMax]);

//   return (
//     <div className="w-full max-w-xl mx-auto p-4">
//       <div className="flex gap-4 mb-6">
//         <div>
//           <label className="text-sm text-gray-600">Min</label>
//           <input
//             type="text"
//             inputMode="decimal"
//             pattern="^-?\d*([.,]?\d*)?$"
//             value={minInput}
//             onChange={(e) => setMinInput(e.target.value)}
//             className="border rounded p-1 w-24"
//           />
//         </div>
//         <div>
//           <label className="text-sm text-gray-600">Max</label>
//           <input
//             type="text"
//             inputMode="decimal"
//             pattern="^-?\d*([.,]?\d*)?$"
//             value={maxInput}
//             onChange={(e) => setMaxInput(e.target.value)}
//             className="border rounded p-1 w-24"
//           />
//         </div>
//       </div>

//       <div className="relative h-10">
//         <div className="absolute top-1/2 w-full h-1 bg-gray-300 rounded-full transform -translate-y-1/2 z-0" />

//         <div
//           ref={range}
//           className="absolute h-1 bg-blue-500 rounded-full top-1/2 transform -translate-y-1/2 z-10"
//         />

//         <input
//           className="thumb w-full bg-transparent appearance-none pointer-events-auto"
//           type="range"
//           min={parsedMin}
//           max={parsedMax}
//           step={step}
//           value={minValue}
//           onChange={(e) =>
//             setMinValue(Math.min(Number(e.target.value), maxValue - step))
//           }
//         />
//         <input
//           className="thumb w-full bg-transparent appearance-none pointer-events-auto"
//           type="range"
//           min={parsedMin}
//           max={parsedMax}
//           step={step}
//           value={maxValue}
//           onChange={(e) =>
//             setMaxValue(Math.max(Number(e.target.value), minValue + step))
//           }
//         />
//       </div>

//       <div className="flex justify-between text-sm mt-4 text-gray-700">
//         <span>{minValue}</span>
//         <span>{maxValue}</span>
//       </div>

//       <style>{`
//         .thumb::-webkit-slider-thumb {
//           appearance: none;
//           height: 16px;
//           width: 16px;
//           border-radius: 50%;
//           background: #2563eb;
//           border: 2px solid white;
//           cursor: pointer;
//           margin-top: -7px;
//           z-index: 50;
//           position: relative;
//         }
//         .thumb::-moz-range-thumb {
//           height: 16px;
//           width: 16px;
//           border-radius: 50%;
//           background: #2563eb;
//           border: 2px solid white;
//           cursor: pointer;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default DoubleRangeSlider;

// /components/DoubleRangeSlider.jsx


// /components/DoubleRangeSlider.jsx


class DoubleRangeSlider extends React.Component {
  // Pas de state interne pour les valeurs, tout vient des props.
  // C'est ce qui en fait un composant contrôlé.

  handleMinChange = (e) => {
    const { symbol, maxVal, onValuesChange } = this.props;
    const newMin = Math.min(Number(e.target.value), maxVal - 1);
    onValuesChange(symbol, newMin, maxVal);
  };

  handleMaxChange = (e) => {
    const { symbol, minVal, onValuesChange } = this.props;
    const newMax = Math.max(Number(e.target.value), minVal + 1);
    onValuesChange(symbol, minVal, newMax);
  };

  render() {
    const { minVal, maxVal } = this.props;
    
    // On suppose une plage de base pour le calcul du pourcentage.
    const rangeMin = 0;
    const rangeMax = 1000;

    const getPercent = (value) => ((value - rangeMin) / (rangeMax - rangeMin)) * 100;
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxVal);

    return (
      <div className="w-full">
        <div className="relative h-8 flex items-center">
          {/* Track */}
          <div className="absolute w-full h-1 bg-gray-200 rounded-full z-0" />
          {/* Range */}
          <div
            className="absolute h-1 bg-blue-500 rounded-full z-10"
            style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
          />
          {/* Sliders */}
          <input
            type="range"
            min={rangeMin}
            max={rangeMax}
            value={minVal}
            onChange={this.handleMinChange}
            className="thumb absolute w-full h-1 appearance-none bg-transparent pointer-events-auto z-20"
          />
          <input
            type="range"
            min={rangeMin}
            max={rangeMax}
            value={maxVal}
            onChange={this.handleMaxChange}
            className="thumb absolute w-full h-1 appearance-none bg-transparent pointer-events-auto z-20"
          />
        </div>
        <div className="flex justify-between text-xs mt-2 text-gray-600">
          <span>{minVal}</span>
          <span>{maxVal}</span>
        </div>
      </div>
    );
  }
}

export default DoubleRangeSlider;