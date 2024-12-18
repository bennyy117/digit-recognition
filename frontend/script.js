const labelDivs = Array.from(document.querySelectorAll(".label_el"));
const predictionDivs = Array.from(document.querySelectorAll(".res_el"));
let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
let isDrawing = false;
let predicted = false;
let timeoutId = null;

// Initialize canvas
function initializeCanvas() {
    context.fillStyle = "#000000";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#ffffff";
    context.lineJoin = "round";
    context.lineWidth = 50;

    // Event handlers for drawing
    canvas.addEventListener("mousedown", () => {
        isDrawing = true;
        context.beginPath();
    });
}

// Get mouse position
function getPosition(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

// Clear canvas
function clearCanvas() {
    labelDivs.forEach((div) => {
        div.style.backgroundColor = '#ffebee';
    });
    predictionDivs.forEach((div) => {
        div.style.backgroundColor = '#fdf4f6';
    });
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(0, 0, canvas.width, canvas.height);
    predictionDivs.forEach(div => (div.textContent = "0%"));// Reset predictions
    predicted = false;
}

// Predict digit
function predictDigit() {
    predicted = true;
    const image = canvas.toDataURL("image/png");

    // FormData object to send image data
    let formData = new FormData();
    formData.append("image", image); 

    fetch('http://127.0.0.1:5000/predict', { 
        method: 'POST',
        body: formData
    })
    .then(response => response.json()) 
    .then(data => {
        let predictions = data.predictions;

        let sortResOrigin = []; let Res = []; let j = 0; let k = 0; // Array to sort results
        
        predictions.forEach((prediction, index) => {
            let percentageOrigin = prediction * 100; 
            let percentage = (prediction * 100).toFixed(0); 
            sortResOrigin[j] = percentageOrigin; j++; 
            Res[k] = percentage; k++; 
            predictionDivs[index].textContent = `${percentage}%`;
        });

        sortResOrigin.sort((a, b) => b - a);
        console.log(sortResOrigin);
        let maxRes = sortResOrigin[0].toFixed(0);
        console.log(maxRes);
        Res.forEach((percentage, index) => {
            if (percentage == maxRes) {
                // Change background color to green for max result
                labelDivs[index].style.backgroundColor = '#16796F';
                predictionDivs[index].style.backgroundColor = '#7CB7AF';
            }
        })
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Event handlers for drawing
canvas.addEventListener("mousedown", () => {
    if (predicted) {
        clearCanvas();
    }
    if (timeoutId) {
        clearTimeout(timeoutId); // Delete setTimeout cũ if có mousedown mới
    }
    isDrawing = true;
    context.beginPath();
});

canvas.addEventListener("mousemove", event => {
    if (isDrawing) {
        const position = getPosition(event);
        context.lineTo(position.x, position.y);
        context.stroke();
    }
});


canvas.addEventListener("mouseup", () => {
    isDrawing = false;
    timeoutId = setTimeout(() => {
        predictDigit();
    }, 2000);
});

canvas.addEventListener("mouseout", () => {
    isDrawing = false;
});

initializeCanvas();
