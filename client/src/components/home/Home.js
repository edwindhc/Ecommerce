import React, { Component } from 'react';

import PanelCategory from '../layout/PanelCategory';
import axios from 'axios';
import ProductList from '../layout/ProductList';
import CreateProduct from '../product/CreateProduct';
import CategoryList from '../category/CategoryList'

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			toggle: false,
			success: false,
			error: false,
			categories: [],
			products: [],
			count: 0,
			show: false,
			search: '',
			perPageCategory: 5,
			total: 20,
			perPage: 20,
			currentPage: 1,
			selected: [],
			page: 1
		};
	}

	toggle() {
		this.setState({ toggle: !this.state.toggle })
	}

	async getProductsByCategories(text, category) {
		if (category != null) await this.setState(state => state.categories[category].selected = !state.categories[category].selected);
		const transform = this.state.categories.filter((p) => p.selected === true)
		const data = transform.map((r, category) => {
			let total = '';
			total += category === 0 ? `CategoryId=${r.id}` : `&CategoryId=${r.id}`;
			return total;
		})
		let products;
		if (text) {
			products = await axios.get(`/products?${data.join('')}&title=${text}`);
		} else {
			products = await axios.get(`/products?${data.join('')}`);
		}
		const convert = products.data.rows.map(p => {
			p.selected = false;
			return p
		})
		this.setState({ products: convert, count: products.data.rows, selected: [] })
	}

	filterByCategory(category) {
		this.getProductsByCategories(this.state.search, category)
	}
	deselectAll() {
		const { categories } = this.state;
		const deselect = categories.map(r => {
			r.selected = false
			return r;
		});
		this.setState({ categories: deselect })
		this.getProductsByCategories();
	}

	async selectProduct(id, key, selected) {
		const selection = []
		let product = await this.state.selected.filter(r => r.id === id)
		this.setState(state => state.products[key].selected = !selected)
		if (product.length === 0) {
			this.setState(state => state.selected.push(state.products[key]))
		} else {
			const transform = this.state.selected.filter(r => r.id !== id)
			selection.push(transform)
			this.setState({ selected: transform })
		}
	}

	async componentDidMount() {
		const products = await axios.get(`/products`);
		const convert = products.data.rows.map(p => {
			p.selected = false;
			return p
		})
		this.setState({ products: convert, count: products.data.count })

	}

	handleChange(e) {
		if (e.target.name === 'search') {
			this.setState({ [e.target.name]: e.target.value.toLowerCase() })
			if (e.target.value === '') return this.getProductsByCategories();
			this.getProductsByCategories(e.target.value)
		} else {
			this.setState({ [e.target.name]: e.target.value })
		}
	}

	async setCategory(categories) {
		this.setState({ categories })
	}
	async sendPDF() {
		let pdf = await axios.post('/products/pdf', this.state.selected, {
			responseType: 'blob',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/pdf'
			}
		});
		const file = new Blob([pdf.data], {
			type: "application/pdf"
		});
		const fileURL = window.URL.createObjectURL(file);
		window.open(fileURL);
	}
	async getCategories(perPage = this.state.perPageCategory, page = this.state.page) {
		this.setState({ perPageCategory: perPage, page })
		const categories = await axios.get(`/categories?perPage=${perPage}&page=${page}`);
		this.setState({ categories: categories.data.rows, count: categories.data.count })
	}

	render() {
		const { products, categories } = this.state
		return (
			<div className="home d-flex container-fluid flex-wrap">
				<div className="col-sm-3 mt-3 panel-categories">
					<div className="row">
						<PanelCategory
							categories={this.state.categories}
							perPage={this.state.perPageCategory}
							getCategories={this.getCategories.bind(this)}
							setCategory={this.setCategory.bind(this)}
							deselectect={this.deselectAll.bind(this)}
							filterByCategory={this.filterByCategory.bind(this)}
							getProductsByCategories={this.getProductsByCategories.bind(this)} />
						<div className="col-sm-12 text-center mt-3">
							<CategoryList categories={this.state.categories} getCategories={this.getCategories.bind(this)} />
						</div>
						<div className="col-sm-12 text-center">
							<button disabled={!this.state.selected.length} className="mt-3 button-default" onClick={() => this.sendPDF()}>Descargar PDF</button>
						</div>
					</div>
				</div>
				<ProductList products={products}
					search={this.state.search}
					getCategories={this.getCategories.bind(this)}
					toggle={this.toggle.bind(this)}
					handleChange={this.handleChange.bind(this)}
					selectProduct={this.selectProduct.bind(this)} />

				<CreateProduct
					categories={categories}
					toggle={this.state.toggle}
					changeToggle={this.toggle.bind(this)}
					getProductsByCategories={this.getProductsByCategories.bind(this)} />

			</div>
		)
	}
}

export default Home;