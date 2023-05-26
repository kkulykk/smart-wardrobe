# Smart Wardrobe
This project aims to provide an intelligent solution for managing your wardrobe and generating outfits based on the clothes you own. By leveraging computer vision and machine learning, the Smart Wardrobe system can analyze uploaded clothing items, identify their characteristics, and store them in a digital wardrobe. It also utilizes an AI model to generate fashionable outfits using the available clothes.

## Features
* **Clothing Detection**: The Smart Wardrobe system uses computer vision techniques to identify various types of clothing items from images or uploaded photos.
* **Digital Wardrobe**: Once a clothing item is detected, it is saved in the digital wardrobe, which serves as a centralized inventory of your clothes.
* **Outfit Generation**: By leveraging an AI model, the Smart Wardrobe system can generate stylish outfits based on the available clothes in your digital wardrobe.

## Jupyter notebooks
* **Item classification**: [Link](https://colab.research.google.com/drive/1rBoMSQz3JSipRs9IQRFEHFFgR_rb_uhx?usp=sharing)
*  **Siamese network data preparation**: [Link](https://colab.research.google.com/drive/1VG9TsyyLwghVEmNTNt2e0lSv1n6BZhT6?usp=share_link)
*  **Siamese network**: [Link](https://colab.research.google.com/drive/1suMfgb-5VG7dK852z-YcrP5ZYUHPKYlB?usp=sharing)

## Usage

To set up the Smart Wardrobe system locally, follow these steps:

1. Download the [models](https://drive.google.com/file/d/1iR8BF3As2roXZdprnVHAXmc3TuRHzq18/view?usp=share_link) and move to the root directory

2. Clone the repository:
```
git clone https://github.com/your-username/smart-wardrobe.git
```
3. Install the required dependencies. You may use a virtual environment to keep your dependencies isolated:
```
cd smart-wardrobe
npm i
cd ./server
pip install -r requirements.txt
```
4. Launch the application:
```
python server.py
cd ..
npm start
```
5. Access the Smart Wardrobe system by visiting http://localhost:3000 in your web browser.

## Demo

![smart-wardrobe-demo](https://github.com/kkulykk/smart-wardrobe/assets/72144618/ff8f6b8f-71ac-4dd7-a357-f8d0e085d6b4)


## Contributing
Contributions to the Smart Wardrobe project are welcome! If you have any ideas, improvements, or bug fixes, feel free to submit a pull request. Please ensure that your contributions adhere to the project's coding standards and guidelines.

## License
The Smart Wardrobe project is licensed under the [MIT License](LICENSE "target=_new").

## Acknowledgments
We would like to thank the open-source community for their valuable contributions to the technologies used in this project.

## Contact
For any inquiries or questions, please contact [Roman Kulyk](https://github.com/kkulykk "target=_new") or [Oleksandra Tsepilova](https://github.com/sasha-tsepilova "target=_new")
