/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import Big from 'big.js';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

const marginGap = 10;
const itemSpace = 2;
const itemHeight = 80;
const radius = 4;
const screenWidth = Dimensions.get('window').width;
const maxLength = 10;

const div = "÷";
const mutip = "x";
const sub = "-";
const add = "+";

const dot = ".";
const plusMinus = "⁺⧸₋";
const equalSymbol = "=";
const clearSymbol = "AC";
const deleteSymbol = "←";
const percentageSymbol = "%";
const error = "Error";

let performingMath = false
let canOperation = false
let operation = ""
let numberOnScreen = 0.0
let previousNumber = 0.0

Big.DP = maxLength - 1;
Big.NE = -maxLength;
Big.PE = maxLength;

function CalculatorButton({title, titleColor, bgColor, onClick}): JSX.Element {
  return (
    <TouchableHighlight 
      onPress={() => {onClick(title);}}
      underlayColor={bgColor}
      activeOpacity={0.6}
      style={{backgroundColor: bgColor, height: itemHeight, flex: 1, marginHorizontal: itemSpace, justifyContent: "center", alignItems: "center", borderRadius: radius}}
      >
        <Text style={{color: titleColor, fontSize: 30, fontWeight: "bold"}}>{title}</Text>
    </TouchableHighlight>
  );
}

function App(): JSX.Element {  
  // const [performingMath, setPerformingMath] = useState(false);  //正在输入操作符
  // const [canOperation, setCanOperation] = useState(false); //是否可以计算
  // const [numberOnScreen, setNumberOnScreen] = useState("0"); //屏幕显示的数字
  // const [previousNumber, setPreviousNumber] = useState(0.0); //参与计算的前一个数字
  // const [operation, setOperation] = useState(''); //操作符

  const [result, setResult] = useState(numberOnScreen.toString());

  function handleClickEvent(title) {
    switch (title) {
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        handleClickNumber(title);
        break;
      
      case clearSymbol:
        handleClickClear();
        break;
      
      case deleteSymbol:
        handleClickDelete();
        break;

      case percentageSymbol:
        handleClickPercentage();
        break;

      case plusMinus:
        handleClickPlusMinus();
        break;
      
      case dot:
        handleClickDemical();
        break;
      
      case equalSymbol:
        handleClickEqual();
      
      case add:
      case sub:
      case mutip:
      case div:
        handleClickOperation(title);
        break;
    }
  }
  
  function handleClickNumber(numberStr) {
    let textStr = result;
    
    if (textStr === error) {
      textStr = numberStr;
      numberOnScreen = parseFloat(textStr);
      setResult(textStr);
      return;
    }

    if (performingMath) {
        textStr = "";
        performingMath = false;
    }

    if (textStr === "0") {
      textStr = numberStr;
    } else if (textStr === "-0") {
      textStr = "-" + numberStr;
    } else {
      let count = maxLength;
      if (textStr.includes("-")) {
        count += 1;
      }
      if (textStr.includes(dot)) {
        count += 1;
      }

      if ((textStr.length + numberStr.length) <= count) {
        textStr = textStr + numberStr;
      }
    }

    canOperation = true;
    let number = new Big(textStr);
    numberOnScreen = number.toNumber();
    setResult(number.toString());

  }

  function handleClickOperation(op) {
    if (result === error) {
      return;
    }

    operation = op;
    performingMath = true;
    canOperation = false;
    previousNumber = parseFloat(result);
  }
  
  function handleClickEqual() {
    if (canOperation && result !== error) {
        let number = new Big(previousNumber);
        switch (operation) {
          case add:
          {
            let resultNumStr = number.plus(result).toString();
            let count = maxLength;
            if (resultNumStr.includes(dot)) {
                count += 1;
              }
            if (resultNumStr.includes(sub)) {
                count += 1;
              }
            if (resultNumStr.length > count) {
              numberOnScreen = 0.0;
              setResult(error);
            } else {
              numberOnScreen = number.plus(result).toNumber();
              setResult(resultNumStr);
            }
          }
            break;

          case sub:
            let resultNumStr = number.minus(result).toString();
            let count = maxLength;
            if (resultNumStr.includes(dot)) {
                count += 1;
              }
            if (resultNumStr.includes(sub)) {
                count += 1;
              }

            if (resultNumStr.length > count) {
              numberOnScreen = 0.0;
              setResult(error);
            } else {
              numberOnScreen = number.minus(result).toNumber();
              setResult(resultNumStr);
            }
            break;

          case mutip:
          {
            let resultNumStr = number.times(result).toString();
            let count = maxLength;
            if (resultNumStr.includes(dot)) {
                count += 1;
              }
            if (resultNumStr.includes(sub)) {
                count += 1;
              }
            if (resultNumStr.length > count) {
              numberOnScreen = 0.0;
              setResult(error);
            } else {
              numberOnScreen = number.times(result).toNumber();
              setResult(resultNumStr);
            }
          }
            break;

          case div:
          {
            if (result !== "0") {
              let resultNumStr = number.div(result).toString();
              let count = maxLength;
              if (resultNumStr.includes(dot)) {
                count += 1;
              }
              if (resultNumStr.includes(sub)) {
                count += 1;
              }
              if (resultNumStr.length > count) {
                numberOnScreen = 0.0;
                setResult(error);
              } else {
                numberOnScreen = number.div(result).toNumber();
                setResult(resultNumStr);
              }
            } else {
              numberOnScreen = 0.0;
              setResult(error);
            }
          }
            break;

          default:
            break;
        }
        performingMath = false;
        canOperation = false;
    }
  }

  function handleNumberStr(numberStr) {

  }

  function handleClickDemical() {
    if (result === error || result.includes(dot)) {  //error || .
      return;
    }
    
    let count = maxLength;
    if (result.includes("-")) {
      count = count + 1;
    }

    if (result.length < count) {
      setResult(result + dot);
    }
  }
  
  function handleClickPercentage() {
    if (result === error) {  //error
      return;
    }

    if (result === "-0") {  //-0
      numberOnScreen = 0.0;
      setResult("0");
      return;
    }

    let number = new Big(result);
    numberOnScreen = number.div(100).toNumber();  //解决浮点数精度不准确的问题
    setResult(number.div(100).toString());
  }
  
  function handleClickPlusMinus() {
    if (result === error) {  //error
      return;
    }

    if (result === "-0") {  //-0
      setResult("0");
      return;
    }

    if (result === "0") {  //0
      setResult("-0");
      return;
    }

    let number = new Big(result);
    numberOnScreen = number.neg().toNumber();
    setResult(number.neg().toString());
  }
    
  function handleClickClear() {
    performingMath = false
    canOperation = false
    numberOnScreen = 0.0
    previousNumber = 0.0
    operation = ""
    setResult("0");
  }
  
  function handleClickDelete() {
    if (result.length > 1 && result !== error) {
      if (result.length == 2 && result.includes("-")) {
        setResult("0");
      } else {
        setResult(result.substring(0, result.length-1));
      }
    } else {
      setResult("0");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
     { <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.lighter}
      />} 

      <View style={styles.buttonContainer}>
        <CalculatorButton 
          title={plusMinus}
          titleColor="white"
          bgColor="black"
          onClick={handleClickEvent}
        ></CalculatorButton>
                <CalculatorButton 
          title="0"
          titleColor="white"
          bgColor="black"
          onClick={handleClickEvent}
        ></CalculatorButton>
                <CalculatorButton 
          title={dot}
          titleColor="white"
          bgColor="black"
          onClick={handleClickEvent}
        ></CalculatorButton>
                <CalculatorButton 
          title={equalSymbol}
          titleColor="white"
          bgColor="#f99e0a"
          onClick={handleClickEvent}
        ></CalculatorButton>
      </View>

      <View style={styles.buttonContainer}>
        <CalculatorButton 
          title="1"
          titleColor="white"
          bgColor="black"
          onClick={handleClickEvent}
        ></CalculatorButton>
                <CalculatorButton 
          title="2"
          titleColor="white"
          bgColor="black"
          onClick={handleClickEvent}
        ></CalculatorButton>
                <CalculatorButton 
          title="3"
          titleColor="white"
          bgColor="black"
          onClick={handleClickEvent}
        ></CalculatorButton>
                <CalculatorButton 
          title={add}
          titleColor="white"
          bgColor="#f99e0a"
          onClick={handleClickEvent}
        ></CalculatorButton>
      </View>

      <View style={styles.buttonContainer}>
        <CalculatorButton 
          title="4"
          titleColor="white"
          bgColor="black"
          onClick={handleClickEvent}
        ></CalculatorButton>
                <CalculatorButton 
          title="5"
          titleColor="white"
          bgColor="black"
          onClick={handleClickEvent}
        ></CalculatorButton>
                <CalculatorButton 
          title="6"
          titleColor="white"
          bgColor="black"
          onClick={handleClickEvent}
        ></CalculatorButton>
                <CalculatorButton 
          title={sub}
          titleColor="white"
          bgColor="#f99e0a"
          onClick={handleClickEvent}
        ></CalculatorButton>
      </View>

      <View style={styles.buttonContainer}>
        <CalculatorButton 
          title="7"
          titleColor="white"
          bgColor="black"
          onClick={handleClickEvent}
        ></CalculatorButton>
                <CalculatorButton 
          title="8"
          titleColor="white"
          bgColor="black"
          onClick={handleClickEvent}
        ></CalculatorButton>
                <CalculatorButton 
          title="9"
          titleColor="white"
          bgColor="black"
          onClick={handleClickEvent}
        ></CalculatorButton>
                <CalculatorButton 
          title={mutip}
          titleColor="white"
          bgColor="#f99e0a"
          onClick={handleClickEvent}
        ></CalculatorButton>
      </View>

      <View style={styles.buttonContainer}>
        <CalculatorButton 
          title={clearSymbol}
          titleColor="black"
          bgColor="#bcf7ba"
          onClick={handleClickEvent}
        ></CalculatorButton>
                <CalculatorButton 
          title={deleteSymbol}
          titleColor="black"
          bgColor="#ebf5fa"
          onClick={handleClickEvent}
        ></CalculatorButton>
                <CalculatorButton 
          title={percentageSymbol}
          titleColor="black"
          bgColor="#ebf5fa"
          onClick={handleClickEvent}
        ></CalculatorButton>
                <CalculatorButton 
          title={div}
          titleColor="white"
          bgColor="#f99e0a"
          onClick={handleClickEvent}
        ></CalculatorButton>
      </View>

      <Text style={styles.textStyle} numberOfLines={1}>{result}</Text>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column-reverse",
    backgroundColor: "white",
    marginBottom: marginGap,
  },
  buttonContainer: {
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginHorizontal: marginGap,
    marginTop: itemSpace,
  },
  textStyle: {
    color: "black",
    textAlign: "right",
    fontSize: 50,
    fontWeight: "bold",
    marginLeft: marginGap,
    marginRight: marginGap,
  }
});

export default App;
