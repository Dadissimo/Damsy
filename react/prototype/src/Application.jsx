import React from 'react';

import Import from './component/Import';
import Preview from './component/Preview';
import Report from './component/Report';

import 'bootstrap/dist/css/bootstrap.min.css';

const Application = () => {
    const [data, setData] = React.useState(undefined);
    const [selectedTrimester, setSelectedTrimester] = React.useState(0);

    const handleChange = result => setData(result);
    const handleClear = () => {
        setData(undefined);
        setSelectedTrimester(0);
    };
    const handleTrimesterChange = index => setSelectedTrimester(index);

    if (data) console.log(data);

    return (
        <div>
            <h1 className="d-flex justify-content-center border-bottom pb-1  m-4">{'Prototype v0.1'}</h1>
            <div className="d-flex justify-content-center">
                <div className="bg-light p-4 d-flex flex-column w-50">
                    <Import onChange={ handleChange } onClear={ handleClear } />
                    <Preview data={ data } selectedTrimester={ selectedTrimester } onTrimesterChange={ handleTrimesterChange } />
                    <Report data={ data } selectedTrimester={ selectedTrimester } />
                </div>
            </div>
        </div>
    );
}

export default Application;
