import React, { Component } from 'react';
import {
    ListGroup, ListGroupItem, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label,
    Input
} from 'reactstrap'
import axios from 'axios'
import { Paginator } from '../layout/Paginator'
import { SweetAlertSuccess } from '../layout/SweetAlertComponent'

export default class PanelCategory extends Component {
    constructor(props) {
        super(props);

        this.state = {
            categories: [],
            count: 0,
            perPage: 5,
            page: 1,
            show: false,
            name: '',
            success: false
        };
    }



    async componentDidMount() {
        this.getCategories()
    }
    deselectAll() {
        this.props.deselectect()
    }
    async getCategories(perPage = this.state.perPage, page = this.state.page) {
        this.setState({ perPage, page })
        const categories = await axios.get(`/categories?perPage=${perPage}&page=${page}`);
        this.setState({ categories: categories.data.rows, count: categories.data.count })
        this.props.getCategories(perPage = this.state.perPage, page = this.state.page)
    }
    toggle() {
        this.setState({ show: !this.state.show })
    }
    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }
    async addCategory() {
        const category = await axios.post(`/categories/`, { name: this.state.name })
        if (category.status === 200) {
            this.setState({ success: true, show: false })
            setTimeout(() => this.setState({ success: false, name: '' }), 3000);
            this.props.getCategories()
        }
    }

    onConfirm() {
        this.setState({ success: false })
    }
    render() {
        const { count, perPage, page } = this.state;
        const { categories } = this.props
        return (
            <div className="col-sm-12">
                <ListGroup>
                    <ListGroupItem className="bg-default">Categorias</ListGroupItem>
                    <ListGroupItem className="d-flex justify-content-between align-items-center">
                        <button className="button-default" onClick={() => this.deselectAll()}>Desmarcar todo</button>
                        <i className="fa fa-plus color-default pointer" onClick={() => this.toggle()}></i>
                    </ListGroupItem>
                    {
                        categories.map((c, key) => {
                            return <ListGroupItem className={`pointer ${c.selected ? 'bg-default' : ''}`} key={key} onClick={() => this.props.filterByCategory(key)}>{c.name}</ListGroupItem>
                        })
                    }

                    <Paginator
                        paginate={this.getCategories.bind(this)}
                        totals={count}
                        perPage={perPage}
                        page={page} />
                </ListGroup>

                <Modal isOpen={this.state.show}>
                    <ModalHeader>Agregar Categoria</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label for="category">Nombre</Label>
                                <Input type="text" name="name" id="name" value={this.state.name} onChange={(e) => this.handleChange(e)} placeholder="Nombre de la categoria" />
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" disabled={!this.state.name} onClick={() => this.addCategory()}>Agregar</Button>{' '}
                        <Button color="secondary" onClick={() => this.toggle()}>Cancelar</Button>
                    </ModalFooter>
                </Modal>

                <SweetAlertSuccess onConfirm={this.onConfirm.bind(this)} message="Nueva Categoria agregada exitosamente" show={this.state.success} />
            </div>
        );
    }
}