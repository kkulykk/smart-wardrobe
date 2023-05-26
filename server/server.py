from fastapi import FastAPI, UploadFile, File, Form, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from transparent_background import Remover
import uvicorn
import numpy as np
import io
import os
import uuid
import tensorflow as tf
from tensorflow.keras import metrics
from tensorflow.keras.applications import resnet
import numpy as np
from PIL import Image

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
remover = Remover()
classification_model = tf.keras.models.load_model('../models/model_AlexNet_amateur.h5')
siamese_embedding = tf.keras.models.load_model('../models/siameese_embedding_new.h5')

classes = [
    {"label": 'Dress', "value": 'dress'},
    {"label": 'Hat', "value": 'hat'},
    {"label": 'Outwear', "value": 'outwear'},
    {"label": 'Pants', "value": 'pants'},
    {"label": 'Shoes', "value": 'shoes'},
    {"label": 'Skirt', "value": 'skirt'},
    {"label": 'Top', "value": 'top'},
]

SAVE_DIRECTORY = "../src/wardrobe/"
TARGET_SHAPE = (200, 200)

def preprocess_image(filename):
    """
    Load the specified file as a JPEG image, preprocess it and
    resize it to the target shape.
    """
    image_string = tf.io.read_file(filename)
    image = tf.image.decode_jpeg(image_string, channels=3)
    image = tf.image.convert_image_dtype(image, tf.float32)
    image = tf.image.resize(image, TARGET_SHAPE)
    return image


def euclidean_distance(vects):
    """Find the Euclidean distance between two vectors.

    Arguments:
        vects: List containing two tensors of same length.

    Returns:
        Tensor containing euclidean distance
        (as floating point value) between vectors.
    """

    x, y = vects
    sum_square = tf.math.reduce_sum(tf.math.square(x - y), axis=1, keepdims=True)
    return tf.math.sqrt(tf.math.maximum(sum_square, tf.keras.backend.epsilon()))


@app.post('/classify')
async def predict(file: UploadFile = File(...)):
    img = await file.read()
    image = io.BytesIO(img)
    out = remover.process(Image.open(image))
    Image.fromarray(out).save('output.png')
    image = tf.keras.preprocessing.image.load_img(
        "output.png", color_mode="grayscale", target_size=(200, 200))
    image = tf.keras.preprocessing.image.img_to_array(image)
    prediction = classification_model.predict(tf.expand_dims(image, 0))[0]
    os.remove("output.png")

    return classes[np.argmax(prediction)]


@app.post('/save')
async def save(file: UploadFile = File(...), category: str = Form(...)):
    unique_filename = str(uuid.uuid4())

    class_directory = os.path.join(SAVE_DIRECTORY, category)
    os.makedirs(class_directory, exist_ok=True)

    file_path = os.path.join(class_directory, unique_filename)
    contents = await file.read()
    image = io.BytesIO(contents)
    out = remover.process(Image.open(image))
    Image.fromarray(out).save(f"{file_path}.png")

    return "OK"


@app.get('/wardrobe')
async def wardrobe():
    image_categories = []
    directory_path = "../src/wardrobe"

    for root, _, files in os.walk(directory_path):
        if root != directory_path:
            category = {
                'title': os.path.basename(root),
                'images': []
            }

            for file in files:
                if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                    image_path = os.path.join(root, file).replace('\\', '/')
                    category['images'].append(image_path[7:])

            image_categories.append(category)

    return image_categories


@app.post('/match')
async def match(path: str = Body(), matchingCategory: str = Body()):
    directory_path = f"../src/wardrobe/{matchingCategory}"
    sim_paths = []
    image = preprocess_image("../src/"+path)
    image_embedding = siamese_embedding(resnet.preprocess_input(np.array([image])))
    print(image_embedding)
    cosine_similarity = metrics.CosineSimilarity(axis=1)

    for file_name in os.listdir(directory_path):
        full_path = directory_path+'/'+file_name
        match_image = preprocess_image(full_path)
        match_embedding = siamese_embedding(resnet.preprocess_input(np.array([match_image])))
        print(match_embedding)
        similarity = euclidean_distance((image_embedding, match_embedding))
        sim_paths.append(tuple((similarity, full_path)))

    sim_paths.sort(key = lambda x: x[0])
    paths = list(sim_path[1][7:] for sim_path in sim_paths)
    paths.insert(0, path)

    return paths[:min(3, len(paths))]


@app.post('/delete-item')
async def delete_item(path: str = Body()):
    try:
        image_path = f"../src/{path}"

        if not os.path.exists(image_path):
            raise HTTPException(status_code=404, detail="File not found")

        os.remove(image_path)
        parent_folder = os.path.dirname(image_path)

        if not os.listdir(parent_folder):
            os.rmdir(parent_folder)

        return "OK"
    except Exception as e:
        error_message = str(e)
        error_response = {"detail": error_message}
        return error_response

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000)
