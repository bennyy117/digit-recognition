from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import base64
from PIL import Image
from io import BytesIO
from flask_ngrok import run_with_ngrok
import os

app = Flask(__name__)
run_with_ngrok(app) 

path = os.path.dirname(os.path.realpath(__file__))
# path = os.path.dirname(os.path.realpath("testing.ipynb"))

model = tf.keras.models.load_model(f"{path}/my_model.h5")
model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

@app.route('/predict-digit', methods=['POST'])
def predict_digit():
    try:
        data = request.json['image']
        image_data = base64.b64decode(data.split(',')[1])
        image = Image.open(BytesIO(image_data)).convert('L')  # chuyển sang ảnh
        image = image.resize((28, 28))  
        image_array = np.array(image) / 255.0  # Normalize
        image_array = image_array.reshape(1, 28, 28, 1)

        predictions = model.predict(image_array)
        predictions = predictions[0]  
        return jsonify({'predictions': predictions.tolist()})

    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run()
