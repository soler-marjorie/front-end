// /components/SymbolEditor.jsx
import React from 'react';
import DoubleRangeSlider from './DoubleRangeSlider';

const DEFAULT_SLIDER_VALUES = { min: 500, max: 1000 };

class SymbolEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sliderStates: {},
      variableSymbol: null,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { symbols = [] } = nextProps;
    const newStates = { ...prevState.sliderStates };
    let hasChanged = false;

    // Initialise les états pour les nouveaux symboles
    symbols.forEach(symbol => {
      if (!newStates[symbol]) {
        newStates[symbol] = { ...DEFAULT_SLIDER_VALUES };
        hasChanged = true;
      }
    });

    let newVariableSymbol = prevState.variableSymbol;
    // Définit un symbole variable par défaut si nécessaire
    if (symbols.length > 0 && (!prevState.variableSymbol || !symbols.includes(prevState.variableSymbol))) {
      newVariableSymbol = symbols[0];
    } else if (symbols.length === 0) {
      newVariableSymbol = null;
    }

    if (hasChanged || newVariableSymbol !== prevState.variableSymbol) {
      return {
        sliderStates: newStates,
        variableSymbol: newVariableSymbol,
      };
    }

    return null; // Pas de changement d'état
  }

  handleValuesChangeForSymbol = (symbol, newMin, newMax) => {
    this.setState(prevState => ({
      sliderStates: {
        ...prevState.sliderStates,
        [symbol]: { min: newMin, max: newMax },
      },
    }));
  };

  handleSetVariableSymbol = (symbol) => {
    this.setState({ variableSymbol: symbol });
  };

  render() {
    const { symbols = [] } = this.props;
    const { sliderStates, variableSymbol } = this.state;

    if (!symbols || symbols.length === 0) {
      return (
        <div className="w-full max-w-xl mx-auto p-4 text-center text-gray-500">
          Aucun symbole variable à configurer.
        </div>
      );
    }

    return (
      <div className="w-full max-w-xl mx-auto p-2 sm:p-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Configuration des variables</h2>
        {symbols.map(symbol => {
          const currentSymbolState = sliderStates[symbol] || DEFAULT_SLIDER_VALUES;
          const isCurrentVariable = variableSymbol === symbol;

          return (
            <div key={symbol} className="mb-6 p-3 border border-gray-200 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-md font-medium text-gray-800">Symbole : {symbol}</h3>
                <button
                  onClick={() => this.handleSetVariableSymbol(symbol)}
                  disabled={isCurrentVariable}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    isCurrentVariable
                      ? 'bg-green-500 text-white cursor-not-allowed opacity-75'
                      : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                  }`}
                >
                  {isCurrentVariable ? 'Variable Actuelle' : 'Définir comme variable'}
                </button>
              </div>
              <DoubleRangeSlider
                symbol={symbol}
                minVal={currentSymbolState.min}
                maxVal={currentSymbolState.max}
                onValuesChange={this.handleValuesChangeForSymbol}
              />
            </div>
          );
        })}
        {/* Styles globaux pour les sliders */}
        <style>{`
          .thumb::-webkit-slider-thumb { appearance: none; height: 16px; width: 16px; border-radius: 50%; background: #4f46e5; border: 2px solid white; cursor: pointer; margin-top: -7px; position: relative; }
          .thumb::-moz-range-thumb { height: 16px; width: 16px; border-radius: 50%; background: #4f46e5; border: 2px solid white; cursor: pointer; }
        `}</style>
      </div>
    );
  }
}

export default SymbolEditor;