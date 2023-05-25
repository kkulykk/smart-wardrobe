import React from 'react';
import {
    Button,
    CompositeZIndex,
    FixedZIndex,
    Flex,
    Spinner,
    Layer,
    Modal,
    SelectList,
} from 'gestalt';

export default function CategoryModal(props) {
    const {isModalVisible, setModalVisible, isLoading, category, setCategory, handleSave} = props

    const HEADER_ZINDEX = new FixedZIndex(10);
    const zIndex = new CompositeZIndex([HEADER_ZINDEX]);

    const handleClose = () => {
        setModalVisible(false)
        setCategory(null)
    }

    return (
        isModalVisible ? (
            <Layer zIndex={zIndex}>
                <Modal
                    heading={isLoading ? "Give us a second" : "Did we get it right?"}
                    subHeading={isLoading ? "We are processing your request": "Change the item category if needed"}
                    align="start"
                    onDismiss={() => handleClose()}
                    footer={
                        <Flex justifyContent="end" gap={2}>
                            <Button onClick={() => handleClose()} color="gray" text="Back"/>
                            <Button onClick={() => handleSave()} disabled={isLoading} color="red"
                                    text="Save"/>
                        </Flex>
                    }
                    size="sm"
                    accessibilityModalLabel={""}>
                    {isLoading ? <Spinner show={isLoading} accessibilityLabel="Example spinner"/> :
                        <SelectList
                            id="selectlistexample1"
                            disabled={isLoading}
                            label="Category"
                            value={category?.value}
                            onChange={(e) => {
                                setCategory(e)
                            }}
                            size="lg"
                        >
                            {[
                                {label: 'Dress', value: 'dress'},
                                {label: 'Hat', value: 'hat'},
                                {label: 'Outwear', value: 'outwear'},
                                {label: 'Pants', value: 'pants'},
                                {label: 'Shoes', value: 'shoes'},
                                {label: 'Skirt', value: 'skirt'},
                                {label: 'Top', value: 'top'},
                            ].map(({label, value}) => (
                                <SelectList.Option key={label} label={label} value={value}/>
                            ))}
                        </SelectList>}
                </Modal>
            </Layer>
        ) : null
    );
}
