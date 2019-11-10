import React, { Component } from 'react';
import axios from 'axios';
import {
    ListGroup, ListGroupItem, Modal, ModalHeader, Form, ModalBody,
    FormGroup, Label, Input, ModalFooter, Button, Breadcrumb, BreadcrumbItem
} from 'reactstrap';
import { SweetAlertSuccess, SweetAlertWarning } from '../layout/SweetAlertComponent'
import { withRouter, Link } from 'react-router-dom';

class ProductDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            product: {},
            categories: [],
            toggle: false,
            title: '',
            model: '',
            sku: '',
            category: '',
            price: '',
            description: '',
            show: false,
            drop: false,
            dialogTitle: 'Actualización Exitosa',
            dialogMessage: 'El producto ha sido actualizado correctamente'
        }
    }
    async getProduct() {
        const product = await axios.get(`/products/${this.props.match.params.id}`)
        const categories = await axios.get(`/categories?perPage=0`)
        this.setState({
            product: product.data, categories: categories.data.rows,
            title: product.data.title, model: product.data.model, sku: product.data.sku,
            price: product.data.price, description: product.data.description, category: product.data.CategoryId
        })
    }
    async componentDidMount() {
        this.getProduct()
    }
    changeToggle() {
        this.setState({ toggle: !this.state.toggle })
    }
    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }
    resetSweetAlert() {
        this.setState({ show: false })
    }
    async updateProduct() {
        const { title, sku, model, category, description, price } = this.state;
        const update = await axios.patch(`/products/${this.state.product.id}`, {
            title,
            model,
            sku,
            price,
            description,
            CategoryId: `${category}`
        })
        if (update.status === 200) {
            this.setState({ toggle: false, show: true })
            setTimeout(() => this.setState({ show: false }), 3000);
            this.getProduct()
        }
    }
    async dropProduct() {
        this.setState({ drop: true })
    }
    async onConfirmDrop() {
        const drop = await axios.delete(`/products/${this.state.product.id}`)
        if (drop.status === 200) {
            this.setState({ dialogTitle: "Producto Eliminado", dialogMessage: "El producto ha sido eliminado correctamente", show: true, drop: false })
            setTimeout(() => {
                this.setState({
                    show: false, dialogTitle: 'Actualización Exitosa',
                    dialogMessage: 'El producto ha sido actualizado correctamente'
                })
                this.props.history.push('/');
            }, 1500);

        }
    }

    dropCancel() {
        this.setState({ drop: false })
    }
    render() {
        const { title, description, model, sku, price } = this.state.product;
        const { categories } = this.state
        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-12 mt-3">
                        <Breadcrumb>
                            <BreadcrumbItem><Link to="/">Productos</Link></BreadcrumbItem>
                            <BreadcrumbItem active className="text-capitalize">{title}</BreadcrumbItem>
                        </Breadcrumb>
                        <ListGroup>
                            <ListGroupItem className="text-capitalize bg-default d-flex justify-content-between align-items-center">
                                <i className="fa fa-pencil pointer" onClick={() => this.changeToggle()}></i>
                                {title}
                                <i className="fa fa-trash pointer" onClick={() => this.dropProduct()}></i>
                            </ListGroupItem>
                            <ListGroupItem className="d-flex justify-content-sm-between align-items-center">
                                Modelo: {model}
                            </ListGroupItem>
                            <ListGroupItem className="d-flex justify-content-sm-between align-items-center">
                                Sku: {sku}
                            </ListGroupItem>
                            <ListGroupItem className="d-flex justify-content-sm-between align-items-center">
                                Categoria: {this.state.product['Category.name']}
                            </ListGroupItem>
                            <ListGroupItem className="text-right">
                                Precio: <span>$</span>{Number(price).toLocaleString("es-CO", { minimumFractionDigits: 2 })}
                            </ListGroupItem>
                            {description ? (
                                <ListGroupItem className="font-weight-bold">
                                    <p className="font-weight-bold">{description}</p>
                                </ListGroupItem>
                            ) : ''}
                        </ListGroup>
                    </div>
                </div>
                <Modal isOpen={this.state.toggle} toggle={() => this.state.changeToggle()} className=''>
                    <ModalHeader toggle={() => this.state.changeToggle()}>Actualizar Producto</ModalHeader>
                    <Form>
                        <ModalBody>
                            <FormGroup>
                                <Label for="title">Titulo</Label>
                                <Input type="text" name="title" id="title" value={this.state.title}
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
                                <Input onChange={(e) => { this.handleChange(e) }}
                                    value={this.state.description}
                                    type="textarea" name="description" id="description" />
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary"
                                disabled={!this.state.title || !this.state.model || !this.state.sku || !this.state.price || !this.state.category || this.state.category === "0"}
                                onClick={() => this.updateProduct()}>Guardar</Button>
                            <Button color="secondary" onClick={() => this.changeToggle()}>Cancelar</Button>
                        </ModalFooter>
                    </Form>
                </Modal>
                <SweetAlertSuccess title={this.state.dialogTitle} message={this.state.dialogMessage} show={this.state.show} onConfirm={this.resetSweetAlert.bind(this)} />
                <SweetAlertWarning onCancel={this.dropCancel.bind(this)} title="¿Estas seguro?" message="Estas a Punto de eliminar este producto ¿Deseas continuar?" onConfirm={this.onConfirmDrop.bind(this)} show={this.state.drop} />
            </div>
        )
    }

}

export default withRouter(ProductDetail);