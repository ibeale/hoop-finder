import React from 'react'
import { Button, Dropdown, Form, Modal, ModalTitle } from 'react-bootstrap';
import {Hoop, HoopContainer, hoopCoords} from './App'
import { FirebaseAccess } from './FirebaseAccess';



interface HIMprops{
    showModal: boolean,
    hoop: HoopContainer,
    toggleShow: Function
}


export default function HoopInfoModal(props: HIMprops){
    return(<Modal show={props.showModal} onHide={props.toggleShow}>
        <Modal.Header closeButton >
          <Modal.Title>{props.hoop.hoop.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group>
                    <Form.Label>Rim Type</Form.Label>
                    <Form.Control type="text" value={props.hoop.hoop.rimType} disabled ></Form.Control>
                    <Form.Label>Court Size</Form.Label>
                    <Form.Control type="text" value={props.hoop.hoop.courtSize} disabled>
                    </Form.Control> 
                    <Form.Label>Hoop Height</Form.Label>
                    <Form.Control type="text" value={props.hoop.hoop.height} disabled>
                    </Form.Control> 
                </Form.Group>
            </Form>
            <button className={"btn btn-danger"} onClick={() => FirebaseAccess.getInstance().deleteHoop(props.hoop, props.toggleShow)}>Delete this Hoop</button>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>)
}