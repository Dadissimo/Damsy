import React from 'react';

import XLSXImport from '../logic/XLSXImport';

import './Import.css';

const Import = ({onChange, onClear}) => {
    const inputRef = React.useRef();

    const handleClear = () => {
        inputRef.current.value = null;
        onClear();
    }
    
    const onChangeHandler = event => {
        const file = event.target.files[0];
        if (!file) return null;

        const importer = new XLSXImport({
            metadataPosition: 0, topicPosition: 1, classIdentifier: '_Klasse'
        });

        importer.parse(file).then(data => {
            onChange(data);
        });
    };

    return (
        <div className="d-flex flex-column w-100">
            <button disabled={ !inputRef.current?.value } onClick={ handleClear } className="btn btn-danger mb-1">{'Clear Data'}</button>
            <button className="btn btn-primary">
                <input ref={ inputRef } onChange={ onChangeHandler } className="fileUploadButton" type="file" id='fileUpload' name='fileUpload' />
                <label htmlFor='fileUpload' className="d-flex align-items-center justify-content-center w-100 mb-0">
                    {'Upload XLSX'}
                </label>
            </button>
        </div>
    );
}

export default Import;