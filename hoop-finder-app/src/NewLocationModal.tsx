import React from 'react'
import { Button, Dropdown, Form, Modal, ModalTitle } from 'react-bootstrap';
import {Hoop, hoopCoords} from './App'
import { FirebaseAccess } from './FirebaseAccess';



interface NLMProps{
    showModal: boolean,
    locationToAdd: hoopCoords,
    toggleShow: Function,
}

function createHoopAndHideModal(hoop:Hoop|undefined, props:NLMProps){
    if(hoop !== undefined && hoop.name !== undefined){
        hoop = {...hoop, lat: props.locationToAdd.lat, lng: props.locationToAdd.lng}
        FirebaseAccess.getInstance().createHoop(hoop);
        props.toggleShow();
    }
    if(hoop !== undefined && hoop.name === undefined){
        let textField = document.getElementById("new-hoop-name-field");
        if(textField !== null){
            textField.style.borderColor = "red";
            let label = document.createElement("LABEL");
            label.innerHTML = "Please enter a hoop name";
            label.style.color = "red";
            textField.parentElement?.appendChild(label);
        }
    }
}

export default function NewLocationModal(props: NLMProps){
    const [hoop, setHoop] = React.useState<Hoop>({name: undefined, height: "10ft", rimType: "Single Rim", courtSize: "Full Court"});
    return(<Modal show={props.showModal} onHide={props.toggleShow}>
        <Modal.Header closeButton >
          <Modal.Title>Add a new hoop</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" id="new-hoop-name-field" placeholder="Enter a name for this hoop" onChange={(event) => setHoop({...hoop, name: event.target.value})}></Form.Control>
                    <Form.Label>Rim Type</Form.Label>
                    <Form.Control id="rim-select" as="select" onChange={(event) => setHoop({...hoop, rimType: event.target.value})} custom>
                        <option>Single Rim</option>    
                        <option>Double Rim</option>
                    </Form.Control>
                    <Form.Label>Court Size</Form.Label>
                    <Form.Control as="select" onChange={(event) => setHoop({...hoop, courtSize: event.target.value})} custom>
                        <option>Full Court</option>    
                        <option>Half Court</option>
                        <option>Other</option>
                    </Form.Control> 
                    <Form.Label>Hoop Height</Form.Label>
                    <Form.Control as="select" onChange={(event) => setHoop({...hoop, height: event.target.value})} custom>
                        <option>10ft</option>    
                        <option>Less than 10ft</option>
                        <option>Greater than 10ft</option>
                    </Form.Control> 
                </Form.Group>
                <Button variant="primary" onClick={() => createHoopAndHideModal(hoop, props)}> Submit</Button>
            </Form>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>)
}