import React, { Component } from 'react';
import { Pagination, PaginationItem, PaginationLink, ListGroupItem } from 'reactstrap'

export class Paginator extends Component {
    constructor(props) {
        super(props);

        this.state = {
            paginateNumbers: 0
        };
    }
    render() {
        const calculatePaginateNumbers = Math.ceil(this.props.totals / this.props.perPage);
        let num = []
        const paginate = () => {
            for (let i = 1; i < calculatePaginateNumbers + 1; i++) num.push(i)
        }
        paginate()
        return (
            <div>
                {
                    calculatePaginateNumbers ? (
                        <ListGroupItem>
                            <Pagination className="paginator d-flex justify-content-center" size="sm" aria-label="Page navigation example">
                                <PaginationItem disabled={this.props.page === 1}>
                                    <PaginationLink first href="#" onClick={() => this.props.paginate(this.props.perPage, 1)} />
                                </PaginationItem>

                                <PaginationItem disabled={this.props.page === 1}>
                                    <PaginationLink previous href="#" onClick={() => this.props.paginate(this.props.perPage, this.props.page - 1)} />
                                </PaginationItem>

                                {
                                    num.map(v => (
                                        <PaginationItem key={v} active={v === this.props.page} onClick={() => this.props.paginate(this.props.perPage, v)}>
                                            <PaginationLink>
                                                {v}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))
                                }

                                <PaginationItem disabled={this.props.page === num.slice(-1).pop()}>
                                    <PaginationLink next href="#" onClick={() => this.props.paginate(this.props.perPage, this.props.page + 1)} />
                                </PaginationItem>

                                <PaginationItem disabled={this.props.page === num.slice(-1).pop()}>
                                    <PaginationLink last href="#" onClick={() => this.props.paginate(this.props.perPage, num.slice(-1).pop())} />
                                </PaginationItem>
                            </Pagination>
                        </ListGroupItem>

                    ) : ''
                }

            </div>
        );
    }
}