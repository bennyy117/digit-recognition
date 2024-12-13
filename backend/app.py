from flask import Flask, request, jsonify
from flask_cors import CORS  # để link port 5500 từ front-end sang 5000 back-end
import numpy as np
import tensorflow as tf
from io import BytesIO
from PIL import Image
import base64
import os
import cv2

app = Flask(__name__)

CORS(app)

path = os.path.dirname(os.path.realpath(__file__))

# Load the pre-trained model
model = tf.keras.models.load_model(f"{path}/digit_model.h5")
model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# Predict
def predict_digit(image_data):
    # Decode image
    img_data = base64.b64decode(image_data.split(',')[1])
    img = Image.open(BytesIO(img_data)).convert('L')
    img = img.resize((28, 28))
    img = np.array(img) / 255.0
    img = img.reshape(1, 28, 28, 1)  # Reshape for model input

    # Model prediction
    prediction = model.predict(img)
    return prediction[0].tolist()

# Endpoint
@app.route('/predict', methods=['POST'])
def predict():
    image_data = request.form['image']
    predictions = predict_digit(image_data)
    return jsonify(predictions=predictions) # Prediction dưới dạng json

if __name__ == '__main__':
    app.run(debug=True, port=5000)  # Run flask port 5000
