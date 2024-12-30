# Digit Recognition Model

## Summary

This project implements a digit recognition system using a Convolutional Neural Network (CNN). The process involves two main parts: **Data Preparation** and **Model Explanation**.

**Data Preparation:**

*   **Key Concept:** The goal is to prepare the MNIST dataset for training the CNN model.
*   **Mathematical Operations:**
    *   **Normalization:** Pixel values are scaled to the range [0, 1] by dividing each pixel value by 255. 
        *Formula:* `Normalized Pixel Value = Original Pixel Value / 255`
    *   **Reshaping:** The 28x28 grayscale images are reshaped to include a channel dimension, resulting in a shape of (28, 28, 1). This adds a depth of 1 to represent the single grayscale channel.

**Model Explanation:**

The CNN architecture consists of the following layers:

*   **Layer 1: Conv2D:** 
    *   **Mathematical Operations:** 2D convolution with 32 filters of size 3x3. Element-wise multiplication between the kernel and input patch, followed by summation and addition of a bias. ReLU activation is applied: `ReLU(x) = max(0, x)`.
    *   **Input/Output Shapes:** Input: (None, 28, 28, 1), Output: (None, 26, 26, 32). The spatial dimensions are reduced due to 'valid' padding: `Output Size = (Input Size - Kernel Size + 1) / Stride`.
*   **Layer 2: MaxPooling2D:**
    *   **Mathematical Operations:** Max pooling over 2x2 regions. Selects the maximum value within each window.
    *   **Input/Output Shapes:** Input: (None, 26, 26, 32), Output: (None, 13, 13, 32). Spatial dimensions are halved: `Output Size = floor(Input Size / Pool Size)`.
*   **Layer 3: Conv2D:**
    *   **Mathematical Operations:** 2D convolution with 64 filters of size 3x3. Similar to Layer 1 but operates on 32 input channels. ReLU activation is applied.
    *   **Input/Output Shapes:** Input: (None, 13, 13, 32), Output: (None, 11, 11, 64). Spatial dimensions reduced due to 'valid' padding.
*   **Layer 4: MaxPooling2D:**
    *   **Mathematical Operations:** Max pooling over 2x2 regions.
    *   **Input/Output Shapes:** Input: (None, 11, 11, 64), Output: (None, 5, 5, 64). Spatial dimensions are halved.
*   **Layer 5: Conv2D:**
    *   **Mathematical Operations:** 2D convolution with 64 filters of size 3x3. ReLU activation is applied.
    *   **Input/Output Shapes:** Input: (None, 5, 5, 64), Output: (None, 3, 3, 64). Spatial dimensions reduced due to 'valid' padding.
*   **Layer 6: Flatten:**
    *   **Mathematical Operations:** Reshapes the multi-dimensional tensor into a 1D vector.
    *   **Input/Output Shapes:** Input: (None, 3, 3, 64), Output: (None, 576). The output size is calculated as 3 * 3 * 64.
*   **Layer 7: Dense:**
    *   **Mathematical Operations:** Linear transformation followed by ReLU activation. `Output(i) = ReLU(bias(i) + ∑[j=0 to N-1] Input(j) * Weight(j, i))`
    *   **Input/Output Shapes:** Input: (None, 576), Output: (None, 64).
*   **Layer 8: Dense:**
    *   **Mathematical Operations:** Linear transformation followed by softmax activation. `softmax(z)_i = exp(z_i) / ∑[j=1 to K] exp(z_j)`.
    *   **Input/Output Shapes:** Input: (None, 64), Output: (None, 10). The output represents the probability distribution over the 10 digit classes.

## How to Run the Application

1. **Install Dependencies:** Ensure you have Python and `pip` installed. Install the required libraries:
    ```bash
    pip install flask flask-cors numpy tensorflow pillow opencv-python
    ```
2. **Save Files:** Save the provided Python code as a file named `app.py`, the HTML code as `index.html` inside a `frontend` folder, the CSS code as `style.css` inside the same `frontend` folder, and the Javascript code as `script.js` inside the same `frontend` folder. Make sure the pre-trained model file `digit_model.h5` is in the same directory as `app.py`.

3. **Run the Flask Backend:** Open a terminal, navigate to the directory containing `app.py`, and run:
    ```bash
    python app.py
    ```
    This will start the Flask development server, typically on `http://127.0.0.1:5000/`.

4. **Open the Frontend:** Open the `frontend/index.html` file in your web browser.

5. **Draw Digits:** Use your mouse to draw a digit in the black canvas area.

6. **View Predictions:** After you stop drawing for a short period (2 seconds), the model will predict the digit, and the probabilities for each digit (0-9) will be displayed in the "predictRes" section. The predicted digit with the highest probability will have a green background.