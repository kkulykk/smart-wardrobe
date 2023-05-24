import React from "react";
import {useNavigate} from "react-router-dom";
import {Heading, Button} from "gestalt";

import styles from "./Main.module.css"

export default function Main() {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <Heading align={"center"} size={"600"}>Smart wardrobe</Heading>
                <div className={styles.buttons}>
                    <Button onClick={() => navigate('/upload')} size="lg" text="Upload clothing item"/>
                    <Button color="red" onClick={() => navigate('/wardrobe')} size="lg" text="Wardrobe"/>
                </div>
            </div>
        </div>
    )
}