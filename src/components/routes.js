import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';

import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import PortfolioHeader from './PortfolioHeader/PortfolioHeader';
import PortfoliosPage from './PortfoliosPage/PortfoliosPage';
import PortfolioConstituents from './PortfolioConstituents/PortfolioConstituents';

const DefaultPortfolioLayout = ({ component: Component, ...rest }) => {
	return (
		<Route {...rest} render={matchProps => (
			<div className="page-container">
				<DocumentTitle title='Portfolio Model' />
				<PortfolioHeader />
				<Component {...matchProps} admin={rest.admin} />
			</div>
		)} />
	)
};

export default class Routes extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	componentWillMount() {
	}

	render() {
		return (
			<Router>
				<Switch>
					<Redirect exact from="/" to="/portfolios" />
					<DefaultPortfolioLayout exact path="/portfolios" component={PortfoliosPage} />
					<DefaultPortfolioLayout exact path="/portfolio/:portfolioId/constituents" component={PortfolioConstituents} />
				</Switch>
			</Router>
		)
	}
}