import React, { Component } from 'react';
import {Row, Col} from 'react-bootstrap';

export default class PortfoliosPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			model_portfolios: [],
			loaded: false
		}
	}

	componentWillMount() {
		var model_portfolios = [
			{
				id: 1,
				name: 'HONGKONG TECHNOLOGY',
				volatility: '26.8%',
				mean_return: '2.96%',
				currency: 'SGD',
				image: 'https://images.arcadis.com/media/8/2/B/%7B82B21355-850C-4060-AC44-2B8107C0A9FE%7DHong%20Kong_websitesize-2000x995.jpg?width=400&height=0&mode=crop&anchor=top'
			}
		];
		this.setState({ model_portfolios, loaded: true });
	}

	exploreInvestment(portfolioId) {
		window.location.pathname = '/portfolio/' + portfolioId + '/constituents';
	}

	render() {
		return (
			<Col md={12} className="portfolios-page-container">
				<Col md={12} className="header-container">
					<img className="directions-image-icon" src="https://www.shareicon.net/download/2016/04/06/745668_orientation_512x512.png" />
					<span className="header-title">Here are a few recommendations for you to choose from</span>
					<span className="header-subtitle">Use the filters to further zone in on a portfolio depending on your preferences</span>
					<Col md={12} className="filters-container">
						<Col xs={12} md={5} className="filter-container">
							<label>Risk Level</label>
							<select>
								<option>All</option>
							</select>
						</Col>
						<Col xs={12} md={5} mdOffset={2} className="filter-container">
							<label>Region</label>
							<select>
								<option>All</option>
							</select>
						</Col>
					</Col>
				</Col>
				<Col md={12} className="content-container">
					<div className="tabs">
						<div className="tab active">
							{this.state.model_portfolios.length + ' Portfolio recommendations based on your preferences'}
						</div>
						<div className="tab">
						</div>
					</div>
					<Col md={12} className="tab-content portfolio-recommendations-container mt20 mb20">
						{this.state.loaded ? (
							<Col md={12} className="portfolio-recommendations p0">
								{this.state.model_portfolios.map(function(portfolio, index) {
									return (
										<Col xs={12} md={4} className="portfolio-recommendation-card" key={portfolio.id}>
											<div className="card-top-container" style={{backgroundImage: 'url(' + portfolio.image + ')'}}>
												<div className="title-container">{portfolio.name}</div>
											</div>
											<div className="portfolio-details">
												<div className="portfolio-detail-items">
													<div className="portfolio-detail-item">
														<span className="title">Volatility</span>
														<span className="value">{portfolio.volatility}</span>
													</div>
													<div className="portfolio-detail-item">
														<span className="title">Mean Return</span>
														<span className="value">{portfolio.mean_return}</span>
													</div>
													<div className="portfolio-detail-item">
														<span className="title">Currency</span>
														<span className="value">{portfolio.currency}</span>
													</div>
													<div className="portfolio-detail-item">
														<span className="title">Eligibility</span>
														<span className="value">Available for all investors</span>
													</div>
												</div>
											</div>
											<div className="portfolio-button-container">
												<button className="btn btn-default explore-investment-btn" onClick={this.exploreInvestment.bind(this, portfolio.id)}>Explore Investment Idea</button>
											</div>
										</Col>
									)
								}.bind(this))}
								{this.state.model_portfolios.length === 0 ? (
									<Col md={12} className="no-portfolio-recommendations">
										<span>There are no portfolio recommendations currently</span>
									</Col>
								) : (null)}
							</Col>
						) : (
							<div className="portfolio-recommendations-loading">
								<i className="fa fa-spin fa-spinner fa-3x"></i>
							</div>
						)}
					</Col>
				</Col>
			</Col>
		);
	}
}