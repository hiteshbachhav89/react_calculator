import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton"
import "./styles.css"

export const ACTIONS ={
  ADD_DIGIT: 'add_digit',
  CHOOSE_OPERATION: 'choose_operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delet_digit',
  EVALUATE: 'evaluate'
}
function reducer(state,{type, payload}){
  switch(type){ 
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite){
        return{
          ...state,
          overwrite: false,
          currentOperand: payload.digit
        }
      }
      // if(payload.digit==="." && state.currentOperand== '') return state
      if(payload.digit==="0" && state.currentOperand ==="0") return state
      if(state.currentOperand!= null){
        if(payload.digit==="." && state.currentOperand.includes(".")) return state
      }
      return {
        ...state,
        currentOperand: `${ state.currentOperand || ""}${payload.digit}`
    }
    case ACTIONS.CHOOSE_OPERATION:
      if(state.currentOperand == null && state.previousOperand ==null){
        return state
      }

      if(state.currentOperand== null){
        return{
          ...state,
          operation: payload.operation
        }
      }
      if(state.currentOperand.includes(".")){
        const decimal = state.currentOperand.split('.')[1]
        if(decimal==="") {
          return {
            ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand.slice(0,-1),
          currentOperand: null
          }
        }
      }
      if(state.previousOperand == null){
        return{
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
      }

      return{
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
    }
    case ACTIONS.CLEAR:
      return{}
    case ACTIONS.DELETE_DIGIT:
      if(state.overwrite){
        return{
          ...state,
          overwrite: false,
          currentOperand: null
        }
      }
      
      if(state.currentOperand== null && state.previousOperand!= null){
        return{
          ...state,
          previousOperand: null,
          operation: null,
          currentOperand: state.previousOperand
        }
      }
      
      if(state.currentOperand== null) return state

      if(state.currentOperand.length===1){
        return{
          ...state,
          currentOperand: null
        }
      }

      return{
        ...state,
        currentOperand: state.currentOperand.slice(0,-1)
      }
    case ACTIONS.EVALUATE:
      if(state.currentOperand== null || state.previousOperand== null || state.operation== null){
        return state
      }
      return{
        ...state,
        overwrite: true,
        currentOperand: evaluate(state),
        previousOperand: null,
        operation: null
    }

  }
}

function evaluate({ currentOperand, previousOperand, operation}){
  const prev= parseFloat(previousOperand)
  const curr= parseFloat(currentOperand)

  if(isNaN(prev) || isNaN(curr)) return ""

  let Computation=''
  switch(operation){
    case "+":
      Computation= prev + curr
      break
    case "-":
      Computation= prev - curr
      break
    case "*":
      Computation= prev * curr
      break
    case "÷":
      Computation= prev / curr
      break
  }

  return Computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us",{maximumFractionDigits:0})

function FormatNumber(Number){
  if(Number== null)return

  const[integer, decimal] = Number.split('.')

  if(decimal== null) return INTEGER_FORMATTER.format(integer)

  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer, 
    {}
  )

  // dispatch({type:ACTIONS.ADD_DIGIT, payload:{ digit:1 }})

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{FormatNumber(previousOperand)} {operation}</div>
        <div className="current-operand">{FormatNumber(currentOperand)}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR})}>AC</button>
      <button  onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE})}>=</button>
    </div>
  )
}

export default App;
