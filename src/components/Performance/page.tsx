// components/ScoreGauge.js

import React from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Performance = ({ score }: any) => {

    return (
        <div style={{ width: 150, height: 150 }}>
            <CircularProgressbar value={score} text={score}/>
        </div>
    );
};

export default Performance;
