import axios from "axios";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Heading, Button, Text, Spinner} from "gestalt";

import WardrobeItemModal from "./WardrobeItemModal";

import styles from "./Wardrobe.module.css"

const Wardrobe = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false)
    const [images, setImages] = useState([])
    const [item, setItem] = useState(null)
    const [isGenerateOpen, setGenerateOpen] = useState(false)

    const getWardrobe = async () => {
        setIsLoading(true)

        try {
            const response = await axios.get('http://localhost:8000/wardrobe');

            setImages(response.data)
        } catch (error) {
            console.error(error);
        }

        setIsLoading(false)
    }

    const handleImageClick = (image, category) => {
        setItem({image, category});
        setGenerateOpen(true)
    };

    useEffect(() => {
        getWardrobe()
    }, []);


    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <Heading align={"center"} size={"600"}>Wardrobe</Heading>
                <div className={styles.items}>
                    {isLoading ?
                        <Spinner show={isLoading} accessibilityLabel="Example spinner"/> : images.map((category) => (
                            <div key={category.title}>
                                <div className={styles.heading}>
                                    <Text className={styles.title} color="subtle" align={"start"}
                                          size={"400"}>{category.title}</Text>
                                </div>
                                <div className={styles.imageGrid}>
                                    {category.images.map((image) =>
                                        <img onClick={() => handleImageClick(image, category.title)}
                                             className={styles.image}
                                             key={image}
                                             src={require(`../../${image}`)}
                                             alt={category}/>
                                    )}
                                </div>
                            </div>
                        ))}
                </div>
                <div className={styles.buttons}>
                    <Button onClick={() => navigate('/')} size="lg" text="Back"/>
                </div>
            </div>
            <WardrobeItemModal image={item} isOpen={isGenerateOpen} setIsOpen={setGenerateOpen}/>
        </div>
    )
}

export default Wardrobe;