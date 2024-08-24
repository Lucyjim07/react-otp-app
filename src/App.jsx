/* eslint-disable react/prop-types */

import { useState } from "react";

const App = ({ fieldCount }) => {
  const [otpInputs] = useState(() => {
    const tempArray = [];

    for (let i = 0; i < fieldCount; i++) {
      tempArray.push({ id: `input_${i}`, name: `input_${i}` });
    }

    return tempArray;
  });

  const [finalValue, setFinalValue] = useState([]);

  // función para pegar el contenido en los inputs
  const pasteMainLogic = (e) => {
    // obtener data del clipboard
    const copiedOtp = e.clipboardData.getData("text");

    // validar cantidad de caracteres y tipo de datos solo number
    if (copiedOtp.length === fieldCount && !isNaN(parseInt(copiedOtp, 10))) {
      const inputFields = document.getElementsByTagName("input");
      for (let i = 0; i < inputFields.length; i++) {
        inputFields[i].value = copiedOtp[i];
      }

      inputFields[inputFields.length - 1].focus();
      setFinalValue(Array.from(copiedOtp));
    }
  };

  // para manejo del input y salto al siguiente input
  const handleInput = (e) => {
    // se usa el método parseInt porque isNaN considera " " y "" como numero
    const isNotANumber = isNaN(parseInt(e.target.value, 10));
    if (isNotANumber) e.target.value = "";

    // se agrega el elemento al arreglo
    setFinalValue((prev) => {
      const tempArray = [...prev];
      tempArray[e.target.dataset.index] = e.target.value;
      return tempArray;
    });

    // se salta al siguiente elemento input
    if (e.target.value.length === 1) {
      const nextSibling = e.target.nextElementSibling;
      if (nextSibling) nextSibling.focus();
    }
  };

  // para manejo del borrado y regresar al input anterior
  const handleKeyUp = (e) => {
    if (e.code === "Backspace" || e.which === 8) {
      if (e.target.value.length === 0) {
        const prevSibling = e.target.previousElementSibling;
        if (prevSibling) {
          prevSibling.focus();
          prevSibling.select();
        }
      }
    }
  };

  // para cuando se pega el OTP
  const handlePaste = (e) => {
    e.preventDefault();
    pasteMainLogic(e);
  };

  console.log(
    finalValue,
    "array_length: " + finalValue.length,
    "string_length: " + finalValue.join("").length
  );

  return (
    <main>
      <div className="otp_container">
        {otpInputs.map((item, index) => {
          return (
            <input
              key={item.id}
              data-index={index}
              id={item.id}
              name={item.name}
              type="text"
              autoFocus={item.id === otpInputs[0].id}
              maxLength={1}
              inputMode="numeric"
              onInput={handleInput}
              onKeyUp={handleKeyUp}
              onPaste={handlePaste}
            ></input>
          );
        })}
      </div>
      <button>Validar OTP</button>
    </main>
  );
};

export default App;
