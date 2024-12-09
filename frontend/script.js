const predictionDivs = Array.from(document.querySelectorAll(".res_el"));
let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
let isDrawing = false;
let predicted = false;
let timeoutId = null;

// Initialize canvas
function initializeCanvas() {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#000000";
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
    // Cái này t thử dùng google colab nên có cái link này nma cũng chưa được
    axios.post("https://021e-34-85-225-116.ngrok-free.app", { image }).then(response => {
        const { predictions } = response.data;
        predictions.forEach((prob, index) => {
            predictionDivs[index].textContent = `${(prob * 100).toFixed(2)}%`;
        });
    }).catch(error => {
        console.error('Error predicting digit:', error);
    });
    console.log("ok"); // Check

    // Event handlers for drawing
    canvas.addEventListener("mousedown", () => {
        if (predicted == true) {
            clearCanvas();
        }
        isDrawing = true;
        context.beginPath();
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
