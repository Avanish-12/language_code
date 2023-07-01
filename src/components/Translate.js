import React, { useEffect } from "react";
import countries from "../data";
const Translate = () => {
  useEffect(() => {
    const fromText = document.querySelector(".from-text");
    const toText = document.querySelector(".to-text");
    const exchageIcon = document.querySelector(".exchange");
    const selectTag = document.querySelectorAll("select");//^ this selected
    const icons = document.querySelectorAll(".row i");  //all icon 
    const translateBtn = document.querySelector("button");//select btn

    // code for inserting all country code in select tag
    selectTag.forEach((tag, id) => {
      // here 1st id should be 0 we take for loop
      for (let country_code in countries) {

        // for selecting all the tag <select></select>

        let selected = 
          id == 0
            ? country_code == "en-GB" //if id=0 call it
              ? "selected"
              : ""// for empty
            : country_code == "hi-IN"   // if id=1
            ? "selected"
            : "";
        let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option); //for inserting all country code in select tag
      }
    });
 // code for exchanger icon  
    exchageIcon.addEventListener("click", () => {
      //console.log("helo");
      let tempText = fromText.value;// copy text from left box and store in temptext
      let tempLang = selectTag[0].value; // store each countrycode which have 0 id
      //console.log(tempText);
     // console.log(tempLang);
      fromText.value = toText.value; // left text move to right box
      toText.value = tempText; //   left text move to right box
      selectTag[0].value = selectTag[1].value; // change language also
      selectTag[1].value = tempLang;     // change language after clicking exchange icon
    });
//  to claer both the box if u clear left box
    fromText.addEventListener("keyup", () => {
      if (!fromText.value) {
        toText.value = "";
      }
    });
         //code for trnslation 
    translateBtn.addEventListener("click", () => {
      let text = fromText.value.trim(); // trim extra space from left to right 
      let translateFrom = selectTag[0].value; // to take language which is on 0 index
      let translateTo = selectTag[1].value;  // translate those lunguage which come on 1 index
      if (!text) return;
      toText.setAttribute("placeholder", "Translating..."); // on right side box showing tanslating during clicking button
      let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
      fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          toText.value = data.responseData.translatedText;
          data.matches.forEach((data) => {
            if (data.id === 0) {
              toText.value = data.translation;
            }
          });
          toText.setAttribute("placeholder", "Translation");
        });
    });
    // code for icon(copy & sound icons)
    icons.forEach((icon) => {
      icon.addEventListener("click", ({ target }) => {
        if (!fromText.value || !toText.value) return;
        if (target.classList.contains("fa-copy")) {
          if (target.id == "from") {
            navigator.clipboard.writeText(fromText.value); //for copy text
          } else {
            navigator.clipboard.writeText(toText.value);
          }
        } else {
          let utterance;
          if (target.id == "from") {
            utterance = new SpeechSynthesisUtterance(fromText.value); // selecting text to convert into sound
            utterance.lang = selectTag[0].value;
          } else {
            utterance = new SpeechSynthesisUtterance(toText.value);
            utterance.lang = selectTag[1].value;
          }
          speechSynthesis.speak(utterance); // for converting text into sound
        }
      });
    });
  }, []);
  return (
    <>
      <div className="container">
        <div className="wrapper">
          <div className="text-input">
            <textarea
              spellcheck="false"     //if u done mistake than it does't check
              className="from-text"
              placeholder="Enter text"
            ></textarea>
            <textarea
              spellcheck="false"  
              readOnly  // only for read not for read
              disabled   //only for read
              className="to-text"
              placeholder="Translation"
            ></textarea>
          </div>
          <ul className="controls">
            <li className="row from">
              <div className="icons" >
                <i id="from" className="fas fa-volume-up" ></i>  
                <i id="from" className="fas fa-copy"></i>  
              </div>
              <select></select>
            </li>
            <li className="exchange">
            <i className="fas fa-exchange-alt"></i> 
            </li>
            <li className="row to">
              <select></select>
              <div className="icons">
                <i id="to" className="fas fa-volume-up"></i>
                <i id="to" className="fas fa-copy"></i>
              </div>
            </li>
          </ul>
        </div>
        <button>Translate Text</button>
      </div>
    </>
  );
};

export default Translate;
  