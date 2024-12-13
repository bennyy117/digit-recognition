const predictionDivs = Array.from(document.querySelectorAll(".res_el"));
let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
let isDrawing = false;
let predicted = false;
let timeoutId = null;

// Initialize canvas
function initializeCanvas() {
    context.fillStyle = "#00000";
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
        
        predictions.forEach((prediction, index) => {
            let percentage = (prediction * 100).toFixed(0); 
            predictionDivs[index].textContent = `${percentage}%`;
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });

    console.log("check ok");
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
