from fastapi import FastAPI, UploadFile, File, Form, Body
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
import io
import os
import uuid
import tensorflow as tf
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
classification_model = tf.keras.models.load_model('../models/model_AlexNet.h5')

classes = [
    {"label": 'Dress', "value": 'dress'},
    {"label": 'Hat', "value": 'hat'},
    {"label": 'Jumpsuit', "value": 'jumpsuit'},
    {"label": 'Legwear', "value": 'legwear'},
    {"label": 'Outwear', "value": 'outwear'},
    {"label": 'Pants', "value": 'pants'},
    {"label": 'Shoes', "value": 'shoes'},
    {"label": 'Skirt', "value": 'skirt'},
    {"label": 'Top', "value": 'top'},
]

SAVE_DIRECTORY = "../src/wardrobe/"


@app.post('/classify')
async def predict(file: UploadFile = File(...)):
    img = await file.read()
    image = io.BytesIO(img)
    image = tf.keras.preprocessing.image.load_img(
        image, target_size=(200, 200))
    image = tf.keras.preprocessing.image.img_to_array(image)
    prediction = classification_model.predict(tf.expand_dims(image, 0))[0]

    return classes[np.argmax(prediction)]


@app.post('/save')
async def save(file: UploadFile = File(...), category: str = Form(...)):
    unique_filename = str(uuid.uuid4())

    class_directory = os.path.join(SAVE_DIRECTORY, category)
    os.makedirs(class_directory, exist_ok=True)

    file_path = os.path.join(class_directory, unique_filename)
    with open(file_path + file.filename, 'wb') as f:
        contents = await file.read()
        f.write(contents)

    return "OK"


@app.get('/wardrobe')
async def wardrobe():
    image_categories = []
    directory_path = "../src/wardrobe"

    for root, dirs, files in os.walk(directory_path):
        if root != directory_path:
            category = {
                'title': os.path.basename(root),
                'images': []
            }

            for file in files:
                if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                    image_path = os.path.join(root, file)
                    category['images'].append(image_path[7:])

            image_categories.append(category)

    return image_categories


@app.post('/match')
async def match(path: str = Body(), imageCategory: str = Body(), matchingCategory: str = Body()):
    # TODO: add method handler, return the image itself first and then the best matches

    return [path, "wardrobe/top/0c82bd1f-734e-4887-be18-332c906914dff2368692-5695-415e-aa9c-e3d510fdd5aa.jpg", "wardrobe/top/0c82bd1f-734e-4887-be18-332c906914dff2368692-5695-415e-aa9c-e3d510fdd5aa.jpg", "wardrobe/top/0c82bd1f-734e-4887-be18-332c906914dff2368692-5695-415e-aa9c-e3d510fdd5aa.jpg"]


if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000)
