import React, { Component } from 'react';
//import SweetAlert from 'react-bootstrap-sweetalert';
import { Modal, ModalHeader, Form, ModalBody, FormGroup, Label, Input, ModalFooter, Button } from 'reactstrap';
import axios from 'axios';
import { SweetAlertSuccess, SweetAlertError } from '../layout/SweetAlertComponent'

export default class CreateProduct extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            model: '',
            sku: '',
            price: '',
            category: "0",
            description: '',
            show: false,
            error: false,
            categories: []
        };
    }
    async createProduct() {
        const { title, model, sku, price, category, description } = this.state;
        const format = {
            title,
            model,
            sku,
            price,
            CategoryId: category
        }
        if (description) format.description = description;
        const products = await axios.post(`/products`, format);
        if (products.status === 200) {
            this.props.getProductsByCategories();
            this.setState({ show: true, title: '', model: '', sku: '', price: '', category: '', description: '' })
            this.props.changeToggle()
        }
        else if (products.status === 400) {
            this.setState({ error: true, title: '', model: '', sku: '', price: '', category: '', description: '' })
            this.props.changeToggle()
        }
        setTimeout(() => this.setState({ show: false }), 3000);
    }

    resetSweetAlert() {
        this.setState({ show: false, error: false })
    }

    handleChange(e) {
        if (e.target.name === 'search') {
            this.setState({ [e.target.name]: e.target.value })
            if (e.target.value === '') return this.props.getProductsByCategories();
            this.props.getProductsByCategories(e.target.value)
        } else {
            this.setState({ [e.target.name]: e.target.value })
        }
    }

    async componentDidMount() {
        const categories = await axios.get('/categories?perPage=0')
        this.setState({ categories: categories.data.rows })
    }
    render() {
        const { categories } = this.state;
        return (
            <div className="add-product">
                <Modal isOpen={this.props.toggle} toggle={() => this.props.changeToggle()} className=''>
                    <ModalHeader toggle={() => this.props.changeToggle()}>Agregar Producto</ModalHeader>
                    <Form>
                        <ModalBody>
                            <FormGroup>
                                <Label for="title">Titulo</Label>
                                <Input type="text" name="title" id="title" value={this.state.title.toLowerCase()}
                                    onChange={(e) => { this.handleChange(e) }}
                                    placeholder="Titulo" />
                            </FormGroup>
                            <FormGroup>
                                <Label for="model">Modelo</Label>
                                <Input type="text" name="model" id="model" value={this.state.model}
                                    onChange={(e) => { this.handleChange(e) }}
                                    placeholder="Modelo" />
                            </FormGroup>
                            <FormGroup>
                                <Label for="sku">Sku (Codigo de Articulo)</Label>
                                <Input type="text" name="sku" id="sku" value={this.state.sku}
                                    onChange={(e) => { this.handleChange(e) }}
                                    placeholder="Sku (Codigo de Articulo)" />
                            </FormGroup>
                            <FormGroup>
                                <Label for="price">Precio</Label>
                                <Input type="number" name="price" id="price" value={this.state.price}
                                    onChange={(e) => { this.handleChange(e) }}
                                    placeholder="Precio" />
                            </FormGroup>
                            <FormGroup>
                                <Label for="category">Categoria</Label>
                                <Input type="select" name="category" id="category" value={this.state.category}
                                    onChange={(e) => { this.handleChange(e) }}>
                                    <option value={0}>Seleccionar</option>
                                    {categories.map((c, key) => <option value={c.id} key={key}>{c.name}</option>
                                    )}
                                </Input>
                            </FormGroup>
                            <FormGroup>
                                <Label for="description">Descripción</Label>
                                <Input type="textarea" name="description" id="description" />
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary"
                                disabled={!this.state.title || !this.state.model || !this.state.sku || !this.state.price || !this.state.category || this.state.category === "0"}
                                onClick={() => this.createProduct()}>Guardar</Button>
                            <Button color="secondary" onClick={() => this.props.changeToggle()}>Cancel</Button>
                        </ModalFooter>
                    </Form>
                </Modal>
                <SweetAlertSuccess show={this.state.show} onConfirm={this.resetSweetAlert.bind(this)} />
                <SweetAlertError show={this.state.error} onConfirm={this.resetSweetAlert.bind(this)} />
            </div>
        );
    }
}