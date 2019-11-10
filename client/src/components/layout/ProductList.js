import React, { Component } from 'react';
import axios from 'axios'
import { Input, Card, CardBody, CardTitle, CardSubtitle, CardText } from 'reactstrap';
import { Link } from 'react-router-dom'
export default class ProductList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: true
        };
    }

    async componentDidMount() {
        const categories = await axios.get(`/categories`);
        this.setState({ categories: categories.data })
    }
    deselectAll() {
        this.props.deselectect()
    }
    select(p, key) {
        this.setState(state => state.products[key].selected = !state.products[key].selected)
    }
    test(e) {

    }
    render() {
        const { products } = this.props;
        return (
            <div className="col-sm-9 mt-3">
                <div className="d-flex justify-content-center align-items-center">
                    <Input type="text" name="search" id="search" placeholder="Buscar productos" onChange={(e) => { this.props.handleChange(e) }}
                        value={this.props.search} />
                    <button className="button-icon" onClick={() => this.props.toggle()}><i className="fa fa-plus"></i>Agregar</button>
                </div>
                <div>{this.state.search}</div>

                <div className="row">
                    <div className="col-sm-12">
                        <div className="row d-flex">
                            {products.length ? (
                                products.map((p, key) => {
                                    return <div className="col-sm-4 mt-3" key={key}>
                                        <Card>
                                            <CardBody className={`pt-0 px-0 ${p.selected ? 'bg-default' : ''}`}>
                                                <Link to={`/products/${p.id}`}><CardTitle className="py-1 bg-default text-uppercase pointer">{p.title}</CardTitle></Link>
                                                <CardSubtitle className="text-left px-3"><span>Modelo:</span> {p.model}</CardSubtitle>
                                                <CardSubtitle className="text-left px-3"><span>Sku:</span> {p.sku}</CardSubtitle>
                                                <CardSubtitle className="text-left px-3"><span>Categoria:</span> {p['Category.name']}</CardSubtitle>
                                                <CardText className={`text-right px-3 ${!p.selected ? 'color-default' : ''}`}><span>$</span>{Number(p.price).toLocaleString("es-CO", { minimumFractionDigits: 2 })}</CardText>
                                                <div className="custom-control custom-checkbox ">
                                                    <input type="checkbox" className="pointer custom-control-input" id={key} onClick={() => this.props.selectProduct(p.id, key, p.selected)}
                                                        checked={p.selected} onChange={(e) => this.test(e)} />

                                                    <label className="pointer custom-control-label" htmlFor={key} >Seleccionar {p.selected}</label>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </div>
                                })
                            ) : <div className="col-sm-12 mt-3"><p>No existen productos disponibles</p></div>}
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}