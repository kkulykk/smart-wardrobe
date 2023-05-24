import axios from "axios";
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Heading, Button} from "gestalt";
import {FilePond, registerPlugin} from 'react-filepond'

import CategoryModal from "./CategoryModal";

import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import styles from "./UploadItem.module.css"

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

const UploadItem = () => {
    const navigate = useNavigate();
    const [files, setFiles] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [category, setCategory] = useState(null)
    const [isCategoryModalOpen, setCategoryModalOpen] = useState(false)

    const handleRecognize = async () => {
        if (!files) return

        setIsLoading(true)
        setCategoryModalOpen(true)

        const formData = new FormData();
        formData.append('file', files[0].file);

        try {
            const response = await axios.post('http://localhost:8000/classify', formData, {
                headers: {
                    'Content-Type': files[0].file.type,
                },
            });

            setCategory(response.data)
        } catch (error) {
            console.error(error);
        }

        setIsLoading(false)
    }

    const handleSave = async () => {
        if (!files) return

        setIsLoading(true)

        const formData = new FormData();
        formData.append('file', files[0].file);
        formData.append('category', category.value);

        try {
            await axios.post('http://localhost:8000/save', formData, {
                headers: {
                    'Content-Type': files[0].file.type,
                },
            });
        } catch (error) {
            console.error(error);
        }

        setIsLoading(false)
        setCategoryModalOpen(false)
        setFiles([])
        setCategory(null)
    }

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <Heading align={"center"} size={600}>Upload clothing item</Heading>
                <div className={styles.filepond}>
                    <FilePond
                        files={files}
                        allowMultiple={false}
                        onupdatefiles={setFiles}
                        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                    />
                </div>
                <div className={styles.buttons}>
                    <Button disabled={!files.length} onClick={() => handleRecognize()} color="red" size="lg" text="Recognize"/>
                    <Button onClick={() => navigate('/')} size="lg" text="Back"/>
                </div>
                <CategoryModal category={category} setCategory={setCategory} isLoading={isLoading}
                               isModalVisible={isCategoryModalOpen}
                               handleSave={handleSave}
                               setModalVisible={setCategoryModalOpen}/>
            </div>
        </div>
    )
}

export default UploadItem;