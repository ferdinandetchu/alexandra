import React from 'react';
import './Timeline.css';
import TimeLineItem from './TimeLineItem';
import timelineData from './timelineData';
import { v4 as uuidv4 } from 'uuid';

const Timeline = () => {
  return (
    timelineData.length > 0 && (
      <div className='timeline-container'>
        {timelineData.map((data, index) => (
          <TimeLineItem data={data} key={uuidv4()} />
        ))}
      </div>
    )
  );
};

export default Timeline;
