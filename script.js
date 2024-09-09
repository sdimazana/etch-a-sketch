let grayscaleMode;
let randomColorsMode;

const modeAnnouncer = document.querySelector("#modeAnnouncer");
let currentMode = "Select either grayscale or random color mode";

// Create 16 initial divs in the DOM before user presses
// "New Grid" button
const container = document.querySelector("#container");
for(let i=0; i<256; i++){ 
    const div = document.createElement("div");
    container.appendChild(div);
}

function resetGrid(){
    while(container.firstChild){
        container.removeChild(container.lastChild);
    }
}

function promptGridSize(){
    let gridSizePrompt = prompt("Please enter the number of squares you would like for both sides of the grid: ", 16);
    while(gridSizePrompt > 100){
        gridSizePrompt = prompt("Please enter a number less than or equal to 100: ", 16);
    }
    return gridSizePrompt;
}

function createGrid(size){
    let sizeSquared = size*size;
    for(let i=0; i<sizeSquared; i++){
        const div = document.createElement("div");
        container.appendChild(div);
    }
    let oneOverSize = 1/size * 100;
    for(const child of container.children){
        child.style["flex"] = `1 0 ${oneOverSize}%`;
    }
}   

const newGridbutton = document.querySelector("#newGrid");
newGridbutton.addEventListener("click", () => {
    let size = promptGridSize();
    console.log(size);
    resetGrid();
    createGrid(size);
    if(randomColorsMode) currentMode = "Random color mode selected";
    if(grayscaleMode) currentMode = "Grayscale mode selected";
    modeAnnouncer.textContent = currentMode;
    for(const child of container.children){
        let rgb = "";
        child.addEventListener("mouseenter", ()=>{
            let divInlineStyling = child.getAttribute("style");
            let backgroundColorPresent = divInlineStyling.search("background-color");
            if(backgroundColorPresent < 0){
                if(grayscaleMode){
                    rgb = "rgb(0, 0, 0, 0.1)";
                }else{
                    rgb = randomColorGenerator();
                }
            }else{
                let currentOpacity = getOpacity(divInlineStyling);
                if(currentOpacity < 1){
                    rgb = increaseOpacityTenPercent(divInlineStyling, currentOpacity);
                }
            }
            child.style.backgroundColor = rgb;
        });
    }
});

const randomizeColorsButton = document.querySelector("#randomColors");
randomizeColorsButton.addEventListener("click", () => {
    randomColorsMode = true;
    grayscaleMode = false;
    currentMode = "Random color mode selected";
    modeAnnouncer.textContent = currentMode;
});

function randomColorGenerator(){
    let red = Math.floor(Math.random() * 258);
    let green = Math.floor(Math.random() * 258);
    let blue = Math.floor(Math.random() * 258);
    let colorInput = `rgb(${red}, ${green}, ${blue}, 0.1)`;
    return colorInput;
}

const grayscaleButton = document.querySelector("#grayscale");
grayscaleButton.addEventListener("click", () => {
    grayscaleMode = true;
    randomColorsMode = false;
    currentMode = "Grayscale mode selected";
    modeAnnouncer.textContent = currentMode;
});

// inlineStyling will be a string in the format "background-color: rgba(X, Y, Z, J)"
function getOpacity(inlineStyling){
    // Grab everything after the last comma and whitespace
    // in "background-color: rgba(X, Y, Z, J)" and everything
    // before the final parenthesis. It should simply be J.
    let indexOfLastComma = inlineStyling.lastIndexOf(",");
    let opacity = +inlineStyling.slice(indexOfLastComma+1, inlineStyling.length-2);
    return opacity;
}

function increaseOpacityTenPercent(inlineStyling, opacity){
    opacity += 0.1; 
    opacity = opacity.toFixed(1); // Otherwise it defaults to many decimal points
    // Grab "(X, Y, Z, " in "rgba(X, Y, Z, J)"
    let firstParenthesis = inlineStyling.indexOf("(");
    let indexOfLastComma = inlineStyling.lastIndexOf(",");
    let rgbaValues = inlineStyling.substring(firstParenthesis, indexOfLastComma);
    // Concatenate "rgb" + "(X, Y, Z", + " J)"
    return `rgb${rgbaValues}, ${opacity})`;
}

/*
    "Grayscale palette"
    Listen for hover
    If inline style exists, check whether opacity < 100. 
         If opacity less < 100, increase opacity by 10%
         Else, do nothing
    If inline style does not exist, apply inline style of : rgba(0, 0, 0, 0.1)
 */

function getRgbaValues(divInlineStyling){
    let firstParenthesis = divInlineStyling.indexOf("(");
    let rgbaValues = inlineStyling.substring(firstParenthesis, divInlineStyling.length-1);
    // Concatenate "rgb" + "(X, Y, Z, J)"
    return `rgb${rgbaValues}`;
}
   
for(const child of container.children){
    let rgb = "";
    child.addEventListener("mouseenter", ()=>{
        let divInlineStyling = child.getAttribute("style");
        if(divInlineStyling){
            let currentOpacity = getOpacity(divInlineStyling);
            if(currentOpacity < 1){
                rgb = increaseOpacityTenPercent(divInlineStyling, currentOpacity);
            }
        }else{
            if(grayscaleMode){
                rgb = "rgb(0, 0, 0, 0.1)";
            }else if(randomColorsMode){
                rgb = randomColorGenerator();
            }
        }
        child.style.backgroundColor = rgb;
    });
}
    