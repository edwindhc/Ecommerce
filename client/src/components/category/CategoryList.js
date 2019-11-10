import React, { Component } from 'react';
import axios from 'axios';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, ListGroup, ListGroupItem, Input } from 'reactstrap';
import { SweetAlertSuccess, SweetAlertWarning } from '../layout/SweetAlertComponent'
export default class ProductDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            nestedModal: false,
            categories: [],
            count: 0,
            category: {},
            name: '',
            success: false,
            drop: false,
            id: 0
        }
    }

    async componentDidMount() {
        this.getCategory()
    }

    async getCategory() {
        const categories = await axios.get(`/categories`)
        this.setState({ categories: categories.data.rows, count: categories.data.count })
    }

    toggle() {
        this.setState({ modal: !this.state.modal })
    }

    async toggleNested(id) {
        this.setState({ nestedModal: !this.state.nestedModal })
        if (id) {
            let category = await axios.get(`/categories/${id}`)
            this.setState({ category: category.data })
        }
    }

    async updateCategory(e) {
        this.toggleNested();
        const update = await axios.patch(`/categories/${this.state.category.id}`, { name: this.state.name })
        if (update.status === 200) {
            this.successfull();
            this.getCategory()
        }
    }
    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    successfull() {
        this.setState({ success: true, name: '' })
        setTimeout(() => this.setState({ success: false }), 3000);
    }

    onConfirm(id) {
        this.setState({ success: false, id })
    }

    dropCategory(id) {
        this.setState({ drop: true, id })
    }
    async confirmDropCategory(id) {
        const drop = await axios.delete(`/categories/${this.state.id}`)
        if (drop.status === 200) {
            this.setState({ drop: false, success: true, modal: false })
            setTimeout(() => this.setState({ drop: false }), 3000);
            this.getCategory()
            this.props.getCategories()
        }

    }
    dopCancel() {
        this.setState({ drop: false })
    }
    render() {
        const { categories } = this.props;
        return (
            <div className="container">
                <div>
                    <Button color="danger" className="button-default" onClick={() => this.toggle()}>Lista de Categorias</Button>
                    <Modal isOpen={this.state.modal} toggle={this.toggle.bind(this)} className=''>
                        <ModalHeader toggle={this.toggle.bind(this)}>Lista de Categorias</ModalHeader>
                        <ModalBody className="p-0">
                            <ListGroup>
                                {categories.map((c, key) => {
                                    return (
                                        <ListGroupItem key={key} className="d-flex justify-content-between">
                                            <span>{c.name}</span>
                                            <span>
                                                <i className="fa fa-pencil mr-4 pointer" onClick={() => this.toggleNested(c.id)}></i>
                                                <i className="fa fa-trash pointer" onClick={() => this.dropCategory(c.id)}></i>
                                            </span>
                                        </ListGroupItem>
                                    )
                                })}

                            </ListGroup>
                            <Modal isOpen={this.state.nestedModal} toggle={this.toggleNested.bind(this)}>
                                <ModalHeader>Actualizar Categoria</ModalHeader>
                                <ModalBody><Input type="text" name="name" placeholder={this.state.category.name} onChange={(e) => this.handleChange(e)} value={this.state.name} /></ModalBody>
                                <ModalFooter>
                                    <Button color="primary" disabled={!this.state.name} onClick={() => this.updateCategory()}>Actualizar</Button>{' '}
                                    <Button color="secondary">Cancelar</Button>
                                </ModalFooter>
                            </Modal>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={() => { this.toggle() }}>Aceptar</Button>{' '}
                            <Button color="secondary" onClick={() => this.toggle()}>Cancelar</Button>
                        </ModalFooter>
                    </Modal>
                </div>
                <SweetAlertSuccess onConfirm={this.onConfirm.bind(this)} message="Tu Categoria ha sido actualizada" show={this.state.success} />
                <SweetAlertWarning onCancel={this.dopCancel.bind(this)} title="¿Estas seguro?" message="Estas a Punto de eliminar una categoria ¿Deseas continuar?" onConfirm={this.confirmDropCategory.bind(this)} show={this.state.drop} />
            </div>
        )
    }

}