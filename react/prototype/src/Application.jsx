import React from 'react';

import Import from './component/Import';
import Preview from './component/Preview';
import Report from './component/Report';

import 'bootstrap/dist/css/bootstrap.min.css';

const Application = () => {
    const [data, setData] = React.useState(undefined);

    const handleChange = result => setData(result);
    const handleClear = () => setData(undefined);

    if (data) console.log(data);

    return (
        <div>
            <h1 className="d-flex justify-content-center border-bottom pb-1  m-4">{'Prototype v0.1'}</h1>
            <div className="d-flex justify-content-center">
                <div className="bg-light p-4 d-flex flex-column w-50">
                    <Import onChange={ handleChange } onClear={ handleClear } />
                    <Preview data={ data } />
                    <Report data={ data } />
                </div>
            </div>
        </div>
    );
}

export default Application;
