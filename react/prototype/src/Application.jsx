import React from 'react';

import Import from './component/Import';

const Application = () => {
    const [data, setData] = React.useState(undefined);

    const onChangeHandler = result => setData(result);

    if (data) console.log(data);

    return (
        <div className="App">
            <Import onChange={ onChangeHandler } />
        </div>
    );
}

export default Application;
