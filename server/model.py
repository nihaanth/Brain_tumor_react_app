from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import pymongo
from pymongo import MongoClient
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the pre-trained TensorFlow model
model = tf.keras.models.load_model('/Users/nihaanthreddy/devl/others/mern/crud copy 2/server/brain_tumor_model/BrainTumor10Epochs.h5')

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['brain_tumor_db']
collection = db['images']

# Define the labels
labels = ['no tumor','glioma','meningioma', 'pituitary']

def preprocess_image(image):
    """Preprocess the image to fit the model input requirements."""
    image = image.resize((240, 240))  # Adjust to your model's expected input size
    image = image.convert('RGB')      # Ensure the image has 3 channels (RGB)
    image = np.array(image)
    image = image / 255.0             # Normalize to [0, 1]
    image = np.expand_dims(image, axis=0)  # Add batch dimension
    return image

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    try:
        image = Image.open(io.BytesIO(file.read()))
        processed_image = preprocess_image(image)
        
        # Debugging: Print the shape and type of the processed image
        print(f"Processed image shape: {processed_image.shape}")
        print(f"Processed image array: {processed_image}")

        prediction = model.predict(processed_image)
        print(f"Prediction probabilities: {prediction}")

        prediction_label = np.argmax(prediction, axis=1)[0]
        return jsonify({'prediction': int(prediction_label)})
    except Exception as e:
        return jsonify({'error': str(e)})
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)