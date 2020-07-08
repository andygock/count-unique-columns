/* eslint-disable no-unused-vars */
import pullAt from "lodash/pullAt";
import data from "./data";
import "./styles.css";

// global vars

// set initial demo conditions
let _unique = {
  "3": true,
  "4": true
};

// generate options
const updateOptions = inputValue => {
  // find max field count
  const lines = inputValue.split(/\r?\n/);
  const maxFields = Math.max(...lines.map(line => line.split("\t").length));

  // update input checkboxes for unique columns selection
  const inputUnique = document.getElementById("input-unique");
  const chkUnique = [...Array(maxFields).keys()].map(
    n =>
      `<label class="checkbox"><input type="checkbox" class="unique" data-value="${n}" />${n +
        1}</label>`
  );
  inputUnique.innerHTML = chkUnique.join("\n");

  // add event listeners for unique checkboes
  [...document.getElementsByClassName("unique")].forEach(chk => {
    chk.addEventListener("change", e => {
      // console.log("unique", e.target.dataset.value, chk.checked);
      _unique[e.target.dataset.value] = chk.checked;
      process(inputValue);
    });
  });
};

// needed on first page load only
const updateOptionsState = () => {
  [...document.getElementsByClassName("unique")].forEach(chk => {
    if (_unique[chk.dataset.value]) chk.checked = true;
  });
};

const process = inputValue => {
  const lines = inputValue.split(/\r?\n/);

  // get use selected unique columns
  const uniqueColumns = Object.keys(_unique).filter(
    col => _unique[col] === true
  );

  // count appearances of unique columns, store in uniqueCount
  const uniqueCount = {};
  lines.forEach(line => {
    const fields = line.split("\t");
    const sel = pullAt(fields, uniqueColumns.map(v => parseInt(v, 10)));
    if (!uniqueCount[sel.join("\t")]) uniqueCount[sel.join("\t")] = 0;
    uniqueCount[sel.join("\t")] += 1;
  });

  // write output to DOM
  const output = document.getElementById("output");
  output.innerHTML =
    `<pre>` +
    Object.entries(uniqueCount)
      .map(([key, count]) => `${count}\t${key}`)
      .join("\n") +
    `</pre>`;
};

// listen to changes to textarea input
const input = document.getElementById("input");
const handleInputChange = e => {
  updateOptions(e.target.value);
  updateOptionsState();
  process(e.target.value);
};
input.addEventListener("change", handleInputChange);
input.addEventListener("keyup", handleInputChange);

// set initial sample input
input.value = data;
updateOptions(data);
updateOptionsState();
process(data);
