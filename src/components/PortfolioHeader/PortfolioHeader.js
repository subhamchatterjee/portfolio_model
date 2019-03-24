import React, { Component } from 'react';
import {Row, Col} from 'react-bootstrap';

export default class PortfolioHeader extends Component {
	render() {
		return (
			<Col md={12} className="portfolio-header-container">
				<img className="portfolio-header-logo-image" src="https://images.glints.com/unsafe/1024x0/glints-dashboard.s3.amazonaws.com/company-logo/a79dfedd4a4b086397bf6f48d4bd2dfa.jpg" title="CGS CIMB" alt="CGS CIMB" />
			</Col>
		);
	}
}