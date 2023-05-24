import axios from "axios";
import React, {useEffect, useState} from 'react';
import {
    Button,
    CompositeZIndex,
    FixedZIndex,
    Flex,
    Layer,
    Modal,
    SelectList,
} from 'gestalt';
import styles from "./Wardrobe.module.css";

export default function WardrobeItemModal(props) {
    const {isOpen, setIsOpen, image} = props
    const [isLoading, setIsLoading] = useState(false)
    const [matchedImages, setMatchedImages] = useState(null)
    const [matchingCategory, setMatchingCategory] = useState({label: 'Dress', value: 'dress'})
    const HEADER_ZINDEX = new FixedZIndex(10);
    const zIndex = new CompositeZIndex([HEADER_ZINDEX]);

    useEffect(() => {
        setMatchedImages(null)
    }, [isOpen]);

    const handleMatch = async () => {
        setIsLoading(true)

        const body = {"path": image.image, "imageCategory": image.category, "matchingCategory": matchingCategory.value}

        try {
            const response = await axios.post('http://localhost:8000/match', JSON.stringify(body), {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            setMatchedImages(response.data)
        } catch (error) {
            console.error(error);
        }

        setIsLoading(false)
    }


    const getTitle = () => {
        if (isLoading) return "Give us a second"

        if (matchedImages) return "Here is your match"

        return "Item preview"
    }

    const getSubTitle = () => {
        if (isLoading) return "We are matching the best outfit"

        if (matchedImages) return "Check out the outfit the AI generated for you"

        return "Review the image and generate outfit if necessary"
    }


    return (
        isOpen ? (
            <Layer zIndex={zIndex}>
                <Modal
                    heading={getTitle()}
                    subHeading={getSubTitle()}
                    align="start"
                    onDismiss={() => setIsOpen(false)}
                    footer={
                        <Flex justifyContent="end" gap={2}>
                            <Button onClick={() => setIsOpen(false)} color="gray" text="Back"/>
                            {!matchedImages ?
                                <Button onClick={() => handleMatch()} disabled={isLoading} color="red"
                                        text="Generate outfit"/> : null}
                        </Flex>
                    }
                    size="sm"
                    accessibilityModalLabel={""}>
                    {matchedImages ? <Flex justifyContent="center" alignItems={"center"} direction={"column"} gap={2}>
                            <div className={styles.imageGrid} style={{justifyContent: "center"}}>
                                {matchedImages.map((image) =>
                                    <img className={styles.image}
                                         key={image}
                                         src={require(`../../${image}`)}
                                         alt={image}/>
                                )}
                            </div>
                        </Flex>
                        :
                        <Flex justifyContent="center" alignItems={"center"} direction={"column"} gap={2}>
                            {image ? <img key={image.image} style={{maxHeight: "400px", objectFit: "cover"}}
                                          src={require(`../../${image.image}`)}
                                          alt=""/> : null
                            }
                            <SelectList
                                id="selectlistexample"
                                label="Match with"
                                onChange={(e) => {
                                    setMatchingCategory(e)
                                }}
                                size="lg"
                            >
                                {[
                                    {label: 'Dress', value: 'dress'},
                                    {label: 'Hat', value: 'hat'},
                                    {label: 'Jumpsuit', value: 'jumpsuit'},
                                    {label: 'Legwear', value: 'legwear'},
                                    {label: 'Outwear', value: 'outwear'},
                                    {label: 'Pants', value: 'pants'},
                                    {label: 'Shoes', value: 'shoes'},
                                    {label: 'Skirt', value: 'skirt'},
                                    {label: 'Top', value: 'top'}
                                ].map(({label, value}) => (
                                    <SelectList.Option key={label} label={label} value={value}/>
                                ))}
                            </SelectList>
                        </Flex>}
                </Modal>
            </Layer>
        ) : null
    );
}
