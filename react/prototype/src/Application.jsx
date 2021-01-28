import React from 'react';
import axios from 'axios';

import Import from './component/Import';
import Preview from './component/Preview';
import Report from './component/ReportHtml2pdf';

import 'bootstrap/dist/css/bootstrap.min.css';

const defaultSelection = {trimester: 0, class: 0};

const Application = () => {
    const [data, setData] = React.useState(undefined);
    const [selected, setSelected] = React.useState(defaultSelection);

    const handleImportChange = result => setData(result);
    const handleClear = () => {
        setData(undefined);
        setSelected(defaultSelection);
    };
    const handlePreviewChange = (property, value) => {
        setSelected({...selected, [property]: value});
    };

    if (data) console.log(data);

    React.useEffect(() => {
        axios.get("http://127.0.0.1:8000/subject/")
            .then(res => console.log(res))
            .catch(err => console.log(err));
    })

    return (
        <div>
            <h1 className="d-flex justify-content-center border-bottom pb-1">{'Prototype v0.1'}</h1>
            <div className="d-flex justify-content-center">
                <div className="row w-100">
                    <div className="col-3">
                        <div className="bg-light p-4 d-flex flex-column justify-content-between" style={{height: '90vh'}}>
                            <Import onChange={ handleImportChange } onClear={ handleClear } />
                            <Report data={ data } selected={ selected } />
                        </div>
                    </div>
                    <div className="col">
                        <Preview data={ data } selected={ selected } onChange={ handlePreviewChange } />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Application;
