import React from 'react'
import { Button, Dropdown, Form, Modal, ModalTitle } from 'react-bootstrap';
import {Hoop, hoopCoords} from './App'



interface HIMprops{
    showModal: boolean,
    hoop: Hoop,
    toggleShow: Function
}


export default function HoopInfoModal(props: HIMprops){
    return(<Modal show={props.showModal} onHide={props.toggleShow}>
        <Modal.Header closeButton >
          <Modal.Title>{props.hoop.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group>
                    <Form.Label>Rim Type</Form.Label>
                    <Form.Control type="text" value={props.hoop.rimType} disabled ></Form.Control>
                    <Form.Label>Court Size</Form.Label>
                    <Form.Control type="text" value={props.hoop.courtSize} disabled>
                    </Form.Control> 
                    <Form.Label>Hoop Height</Form.Label>
                    <Form.Control type="text" value={props.hoop.height} disabled>
                    </Form.Control> 
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>)
}