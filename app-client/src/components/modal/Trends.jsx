import React, { useContext } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar } from '@fortawesome/free-solid-svg-icons';

import TrendsContext from '../App/TrendsContext';
import TrendBox from './TrendBox';
import { TrendPanelStyle } from '../__styles__/styles';
import TrendRow from './TrendRow';

const Trends = (props) => {
    const trendDisplay = useContext(TrendsContext);
    return (
        <div>
            {trendDisplay && (
            <TrendPanelStyle>
                <div style ={{padding: "1%",textAlign: "center", fontSize: "2em"}}>{props.title}</div>
                <TrendRow>
                    <TrendBox title = "Waiting on MongoDB trends to go here" size = "large"></TrendBox>
                </TrendRow>
                <TrendRow>
                    <TrendBox title = "Waiting on MongoDB trends to go here" size = "small"></TrendBox>
                    <TrendBox title = "Waiting on MongoDB trends to go here" size = "small"></TrendBox>
                </TrendRow>
            </TrendPanelStyle>)}
        </div>
    );
};

export default Trends;