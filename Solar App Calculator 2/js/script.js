const startApp = ((e)=>{
//grab all elements
const deviceName = document.querySelector("#title");//from device name field
const wattsInput = document.querySelector("#input");//from wwatts field
const hourSpan = document.querySelector(".hourSpan");
const wattSpan = document.querySelector(".wattSpan");
const result = document.querySelector(".result");
const hoursUsed = document.querySelector("#hours");
const calc = document.querySelector('#calculate')
let addBtn = document.querySelector('#addBtn');
let listItemHolder = document.querySelector('#list-parent-container');

//lloading appliamces list
const applianceList = document.querySelector("#appliances");
const loadApplianceList = () => {
  let xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      let txtVal = xmlhttp.responseText;
      let jsonVal = JSON.parse(txtVal).sort();
      let dlist = '';
      for(let a=0; a < jsonVal.length; a++){
        dlist += `<option value="${jsonVal[a]}">`;
        applianceList.innerHTML = dlist;
      }
    }
  }
  xmlhttp.open("GET", "appliances.txt", true);
  xmlhttp.send();
};
loadApplianceList();


//arrays to be used
const namesArray = [];
const wattQtyArray = [];
const hoursArray = [];
const powersArray = [];
let power;
let sumOfHours;
let sumOfWatts;

deviceName.value = '';
wattsInput.value = '';
hoursUsed.value = '';
//--------------FUNCTIONS WILL BE DECALRED FROM HERE-------------------
function totalHoursFromInput(array) { //calculate sum of hours
    return array.reduce((a, b) => {
    return a + b;
}, 0);
};//end of total hours from input

function totalWattsFromInput(array) { //calculate sum of hours
    return array.reduce((a, b) => {
    return a + b;
}, 0);
};//end of total watts from input
function totalPower(array) { //calculate sum of hours
    return array.reduce((a, b) => {
    return a + b;
}, 0);
};//end of total power

function calcTotalPower(watts, timeInHours){
    return ((watts / 1000) * timeInHours);
};//end of calculate total power

const addListItems = (nameOfDevice, wattsOfDevice, hoursInUse, sumOfHours, sumOfWatts, power)=>{ 
    //add to list- first collect in arrays
    let powerCalc = (wattsOfDevice/1000)*hoursInUse;
    let li = document.createElement('li');
    let liTextNode = document.createTextNode(`${nameOfDevice} - ${wattsOfDevice}watts for ${hoursInUse}hours = ${powerCalc}kwh `);
    let deleteBtn = document.createElement('i');
    li.appendChild(liTextNode);
    listItemHolder.appendChild(li);   
    powersArray.push(powerCalc);
    let sumOfPower = totalPower(powersArray).toFixed(2);

    
    hourSpan.textContent = sumOfHours+'hours';
    wattSpan.textContent = sumOfWatts+'watts';

    deleteBtn.innerHTML = `<i style = "cursor: pointer; color: red;"><small>DELETE</small></i>`;
    li.appendChild(deleteBtn);
showPowerRecommendation(sumOfPower);

    deleteBtn.addEventListener('click', ()=>{
        deleteBtn.parentNode.parentNode.removeChild(deleteBtn.parentElement); 
        namesArray.splice(namesArray.indexOf(`${nameOfDevice}`), 1);
        wattQtyArray.splice(wattQtyArray.indexOf(`${wattsOfDevice}`), 1);
        hoursArray.splice(hoursArray.indexOf(`${hoursInUse}`), 1);

        powersArray.splice(powersArray.indexOf(`${powerCalc}`), 1);
        sumOfWatts = totalWattsFromInput(wattQtyArray);
        sumOfHours = totalHoursFromInput(hoursArray);
        hourSpan.textContent = sumOfHours+'hours';
        wattSpan.textContent = sumOfWatts+'watts';
        sumOfPower = totalPower(powersArray).toFixed(2);
         showPowerRecommendation(sumOfPower);
    }); 

};//end of add list item function

const collectAndProcessValues = e => {
    e.preventDefault();
    if (wattsInput.value === '' || hoursUsed.value === '' || deviceName.value === '') {
      alert('Fields cannot be empty!');
    } else {
    const wattsValue = wattsInput.value;
    const hoursValue = hoursUsed.value;
    const names = deviceName.value;
    //push values into arrays
    namesArray.push(names);
    wattQtyArray.push(parseInt(wattsValue));
    hoursArray.push(parseInt(hoursValue));
    sumOfWatts = totalWattsFromInput(wattQtyArray);
    sumOfHours = totalHoursFromInput(hoursArray);
    power = calcTotalPower(sumOfWatts, sumOfHours).toFixed(2);
    const lastNameInArray = namesArray[namesArray.length -1];
    const lastWattInArray = wattQtyArray[wattQtyArray.length -1];
    const lastHourInArray = hoursArray[hoursArray.length -1];
    addListItems(lastNameInArray, lastWattInArray, lastHourInArray, sumOfHours, sumOfWatts, power);
    addBtn.addEventListener('click', collectAndProcessValues);
  };
};
  const showPowerRecommendation = (power) =>{
  result.textContent =`Total solar power required is ${power}kwh.`;
    };

    function displayRecommendation(e){
        e.preventDefault();
        if (wattsInput.value === '' || hoursUsed.value === '' || deviceName.value === '') {
            alert('Fields cannot be empty!');
          } else {
        result.classList.add('show-results');
          }
    }

addBtn.addEventListener('click', collectAndProcessValues);
 calc.addEventListener('click', displayRecommendation);
})();

const restart = document.querySelector('#cancel');
restart.addEventListener('click', startApp);