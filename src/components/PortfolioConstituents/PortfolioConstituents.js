import React, { Component } from 'react';
import {Row, Col} from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class PortfolioConstituents extends Component {
	constructor(props) {
		super(props);
		this.state = {
			constituentsObj: null,
			constituentsTypes: [],
			loaded: false
		}
	}

	componentWillMount() {
		var constituentsObj = {}, constituentsTypes = [];

		var portfolioConstituents = localStorage.getItem('portfolioConstituents-' + this.props.match.params.portfolioId);
		if(portfolioConstituents !== null) {
			constituentsObj = JSON.parse(portfolioConstituents);
			constituentsTypes = Object.keys(constituentsObj);
		} else {
			var constituents = [
				{
					weight: '3%',
					instrument: { id: 1, name: 'CSX corp', type: 'Equity' }
				}, {
					weight: '17%',
					instrument: { id: 2, name: 'cummins Inc', type: 'Equity' }
				}, {
					weight: '10%',
					instrument: { id: 3, name: 'Eaton Corp PLC', type: 'Equity' }
				}, {
					weight: '10%',
					instrument: { id: 4, name: 'Fedx corp', type: 'Equity' }
				}, {
					weight: '10%',
					instrument: { id: 5, name: 'Haris corp', type: 'Equity' }
				}, {
					weight: '10%',
					instrument: { id: 6, name: 'Norfolk Southern Corp', type: 'Bond' }
				}, {
					weight: '5%',
					instrument: { id: 7, name: 'General Dynamics', type: 'Bond' }
				}, {
					weight: '15%',
					instrument: { id: 8, name: 'hal', type: 'Bond' }
				}, {
					weight: '20%',
					instrument: { id: 10, name: 'USD CASH', type: 'CASH' }
				}
			];

			for(var i = 0; i < constituents.length; i++) {
				var type = constituents[i]['instrument']['type'];
				if(Object.keys(constituentsObj).indexOf(type) > -1) {
					var totalModelWeight = constituentsObj[type]['totalModelWeight'];
					var constituent = constituents[i];
					constituent['weight'] = parseFloat(Number(constituent['weight'].split('%')[0]).toFixed(2));
					constituent['modelWeight'] = constituent['weight'];
					constituentsObj[type]['constituents'].push(constituent);

					totalModelWeight += constituent['modelWeight'];
					constituentsObj[type]['totalModelWeight'] = totalModelWeight;
					constituentsObj[type]['totalWeight'] = totalModelWeight;
				} else {
					var constituentsOfSameType = [], constituentsObjType = {}, totalModelWeight;
					var constituent = constituents[i];
					constituent['weight'] = parseFloat(Number(constituent['weight'].split('%')[0]).toFixed(2));
					constituent['modelWeight'] = constituent['weight'];
					constituentsOfSameType.push(constituent);

					constituentsTypes.push(type);
					totalModelWeight = constituent['modelWeight'];
					constituentsObjType['constituents'] = constituentsOfSameType;
					constituentsObjType['totalModelWeight'] = totalModelWeight;
					constituentsObjType['totalWeight'] = totalModelWeight;
					constituentsObj[type] = constituentsObjType;
				}
			};
		}

		this.setState({ constituentsObj, constituentsTypes, loaded: true });
	}

	reduceWeight(constituentType, constituentIndex) {
		var constituentsObj = this.state.constituentsObj;
		var constituent = constituentsObj[constituentType].constituents[constituentIndex];
		if(constituent.hasOwnProperty('updatedWeight')) {
			if((constituent['updatedWeight'] - 1) > 0) constituent['updatedWeight'] = constituent['updatedWeight'] - 1;
		} else {
			if((constituent['weight'] - 1) > 0) constituent['updatedWeight'] = constituent['weight'] - 1;
		}
		constituentsObj[constituentType].constituents[constituentIndex] = constituent;
		this.setState({ constituentsObj });
	}

	increaseWeight(constituentType, constituentIndex) {
		var constituentsObj = this.state.constituentsObj;
		var constituent = constituentsObj[constituentType].constituents[constituentIndex];
		if(constituent.hasOwnProperty('updatedWeight')) {
			if((constituent['updatedWeight'] + 1) < 100) constituent['updatedWeight'] = constituent['updatedWeight'] + 1;
		} else {
			if((constituent['weight'] + 1) < 100) constituent['updatedWeight'] = constituent['weight'] + 1;
		}
		constituentsObj[constituentType].constituents[constituentIndex] = constituent;
		this.setState({ constituentsObj });
	}

	updateWeight(constituentType, constituentIndex, e) {
		var updatedWeight = parseFloat(Number(e.target.value).toFixed(2));
		var constituentsObj = this.state.constituentsObj;
		var constituent = constituentsObj[constituentType].constituents[constituentIndex];
		if(updatedWeight <= 100 && updatedWeight >= 0) constituent['updatedWeight'] = updatedWeight;
		constituentsObj[constituentType].constituents[constituentIndex] = constituent;
		this.setState({ constituentsObj });
	}

	changeLock(constituentType, constituentIndex) {
		var constituentsObj = this.state.constituentsObj;
		var constituent = constituentsObj[constituentType].constituents[constituentIndex];
		if(constituent.hasOwnProperty('locked')) constituent['locked'] = !constituent['locked'];
		else constituent['locked'] = true;
		constituentsObj[constituentType].constituents[constituentIndex] = constituent;
		this.setState({ constituentsObj });
	}

	deleteConstituent(constituentType, constituentIndex) {
		var constituentsObj = this.state.constituentsObj;
		var constituent = constituentsObj[constituentType].constituents[constituentIndex];
		constituent['isDeleted'] = true;
		constituent['updatedWeight'] = 0;
		constituentsObj[constituentType].constituents[constituentIndex] = constituent;
		this.setState({ constituentsObj });
	}

	resetChanges() {
		var constituentsObj, constituentsTypes = this.state.constituentsTypes;
		var portfolioConstituents = localStorage.getItem('portfolioConstituents-' + this.props.match.params.portfolioId);
		if(portfolioConstituents !== null) {
			constituentsObj = JSON.parse(portfolioConstituents);
		} else {
			constituentsObj = this.state.constituentsObj;
			for(var i = 0; i < constituentsTypes.length; i++) {
				for(var j = 0; j < constituentsObj[constituentsTypes[i]].constituents.length; j++) {
					if(constituentsObj[constituentsTypes[i]].constituents[j].hasOwnProperty('isDeleted')) delete constituentsObj[constituentsTypes[i]].constituents[j].isDeleted;
					if(constituentsObj[constituentsTypes[i]].constituents[j].hasOwnProperty('updatedWeight')) delete constituentsObj[constituentsTypes[i]].constituents[j].updatedWeight;
					if(constituentsObj[constituentsTypes[i]].constituents[j].hasOwnProperty('locked')) delete constituentsObj[constituentsTypes[i]].constituents[j].locked;
				}
				if(constituentsObj[constituentsTypes[i]].hasOwnProperty('totalUpdatedWeight')) delete constituentsObj[constituentsTypes[i]].totalUpdatedWeight;
			}
		}
		this.setState({ constituentsObj }, function() {
			toast.success("Successfully reseted the constituents!");
		});
	}

	rebalanceWeights() {
		var totalWeightChange = 0, totalUnchangedWeight = 0;
		var constituentsObj = this.state.constituentsObj, constituentsTypes = this.state.constituentsTypes;
		for(var i = 0; i < constituentsTypes.length; i++) {
			for(var j = 0; j < constituentsObj[constituentsTypes[i]].constituents.length; j++) {
				if(constituentsObj[constituentsTypes[i]].constituents[j].hasOwnProperty('updatedWeight')) {
					totalWeightChange += constituentsObj[constituentsTypes[i]].constituents[j].weight - constituentsObj[constituentsTypes[i]].constituents[j].updatedWeight;
				} else {
					totalUnchangedWeight += constituentsObj[constituentsTypes[i]].constituents[j].weight;
				}
			}
		}

		for(var i = 0; i < constituentsTypes.length; i++) {
			var totalUpdatedWeight = 0;
			for(var j = 0; j < constituentsObj[constituentsTypes[i]].constituents.length; j++) {
				var constituent = constituentsObj[constituentsTypes[i]].constituents[j];
				if((!constituent.hasOwnProperty('locked') || !constituent.locked) && !constituent.hasOwnProperty('updatedWeight')) {
					var weightDiff = parseFloat(Number((totalWeightChange * constituent.weight) / totalUnchangedWeight).toFixed(2));
					constituent.updatedWeight = constituent.weight + weightDiff;
					constituentsObj[constituentsTypes[i]].constituents[j] = constituent;
				}
				if(constituent.hasOwnProperty('updatedWeight')) totalUpdatedWeight += constituent.updatedWeight;
				else totalUpdatedWeight += constituent.weight;
			}
			constituentsObj[constituentsTypes[i]]['totalUpdatedWeight'] = totalUpdatedWeight;
		}
		this.setState({ constituentsObj }, function() {
			toast.success("Successfully rebalanced the constituents!");
		});
	}

	saveChanges() {
		var constituentsObj = this.state.constituentsObj, constituentsTypes = this.state.constituentsTypes;
		for(var i = 0; i < constituentsTypes.length; i++) {
			var totalWeight = 0, constituentsObj;
			for(var j = 0; j < constituentsObj[constituentsTypes[i]].constituents.length; j++) {
				var constituent = constituentsObj[constituentsTypes[i]].constituents[j];
				if(constituent.hasOwnProperty('isDeleted')) {
					constituentsObj[constituentsTypes[i]].constituents.splice(j, 1);
				} else {
					if(constituent.hasOwnProperty('updatedWeight')) {
						constituent.weight = constituent.updatedWeight;
						delete constituent.updatedWeight;
					}
					constituentsObj[constituentsTypes[i]].constituents[j] = constituent;
					totalWeight += constituent.weight;
				}
			}
			constituentsObj[constituentsTypes[i]].totalWeight = totalWeight;
		}
		localStorage.setItem('portfolioConstituents-' + this.props.match.params.portfolioId, JSON.stringify(constituentsObj));
		this.setState({ constituentsObj }, function() {
			toast.success("Successfully saved the constituents!");
		});
	}

	goBack() {
		window.location.pathname = '/portfolios';
	}

	render() {
		return (
			<Col md={12} className="portfolio-constituents-page-container">
				<ToastContainer position="bottom-center" autoClose={4000} hideProgressBar={true} closeOnClick={false} newestOnTop={false} pauseOnHover={true} />
				<Col md={12} className="header-container">
					<span className="header-title">
						<i className="fa fa-chevron-left" onClick={this.goBack.bind(this)}></i>
						Portfolio Constituents
					</span>
					<div className="header-buttons">
						<button className="btn btn-default reset-btn" onClick={this.resetChanges.bind(this)}>Reset</button>
						<button className="btn btn-default reset-btn" onClick={this.rebalanceWeights.bind(this)}>Rebalance</button>
						<button className="btn btn-default reset-btn" onClick={this.saveChanges.bind(this)}>Save & Continue</button>
					</div>
				</Col>
				<Col md={12} className="constituents-container">
					<div className="constituents-header-container">
						<div className="type-col-header">Category/Stock</div>
						<div className="model-weight-col-header">Model Weight(%)</div>
						<div className="weight-col-header">Weight(%)</div>
					</div>
					{this.state.constituentsObj !== null ? (
						<div className="all-constituents-content-container">
							{this.state.constituentsTypes.map(function(constituentType, index) {
								return (
									<div className={constituentType.toLowerCase() + "-constituents-content-container"} key={index}>
										<div className="constituents-type-row-container">
											<div className="constituents-type-container">
												<span className="constituents-type">{constituentType}</span>
												<button className="add-constituent">
													<i className="fa fa-plus"></i>{'Add ' + constituentType}
												</button>
											</div>
											<div className="constituents-model-weight-container">
												{this.state.constituentsObj[constituentType].totalModelWeight + '%'}
											</div>
											<div className="constituents-weight-container">
												{this.state.constituentsObj[constituentType].hasOwnProperty('totalUpdatedWeight') ? (
													this.state.constituentsObj[constituentType].totalUpdatedWeight + '%'
												) : (
													this.state.constituentsObj[constituentType].totalWeight + '%'
												)}
											</div>
										</div>
										{this.state.constituentsObj[constituentType].constituents.map(function(constituent, constituentIndex) {
											if(!constituent.isDeleted) {
												return (
													<div className="constituent-row-container" key={constituentIndex}>
														<div className="constituent-name-container">
															{constituent.hasOwnProperty('locked') && constituent.locked ? (
																<i className="fa fa-lock constituent-lock-icon" onClick={this.changeLock.bind(this, constituentType, constituentIndex)}></i>
															) : (
																<i className="fa fa-unlock-alt constituent-lock-icon" onClick={this.changeLock.bind(this, constituentType, constituentIndex)}></i>
															)}
															<i className="fa fa-trash delete-constituent" onClick={this.deleteConstituent.bind(this, constituentType, constituentIndex)}></i>
															<span >{constituent.instrument.name}</span>
														</div>
														<div className="constituent-model-weight">{constituent.modelWeight + '%'}</div>
														<div className="constituent-weight-container">
															<i className="fa fa-minus-circle" onClick={this.reduceWeight.bind(this, constituentType, constituentIndex)}></i>
															{constituent.hasOwnProperty('updatedWeight') ? (
																<input className="constituent-weight-input" type="number" onChange={this.updateWeight.bind(this, constituentType, constituentIndex)} value={constituent.updatedWeight} />
															) : (
																<input className="constituent-weight-input" type="number" onChange={this.updateWeight.bind(this, constituentType, constituentIndex)} value={constituent.weight} />
															)}
															<i className="fa fa-plus-circle" onClick={this.increaseWeight.bind(this, constituentType, constituentIndex)}></i>
														</div>
													</div>
												)
											} else return null;
										}.bind(this))}
									</div>
								)
							}.bind(this))}
						</div>
					) : (null)}
				</Col>
			</Col>
		);
	}
}