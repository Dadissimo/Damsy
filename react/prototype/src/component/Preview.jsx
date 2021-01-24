const Preview = ({data, selectedTrimester, onTrimesterChange}) => {
    if (!data) return null;
    const {file, classes, topics, metaData} = data[selectedTrimester];

    const renderTopics = topics.map((topic, i) => {
        return (
            <input value={ topic } key={ topic + i} className="p-1 col border" />
        );
    })
    
    const renderTrimesterButtons = data.map((d, i) => {
        const handleTrimesterChange = () => onTrimesterChange(i);
        const buttonClass = 'd-flex flex-grow-1 btn m-1 ' + (selectedTrimester === i ? 'btn-success' : 'btn-info'); 
        return (
            <button onClick={ handleTrimesterChange } className={ buttonClass }>{'Trimester ' + (i + 1)}</button>
        );
    });
        
    const renderClasses = classes.map(currentClass => {
        return <ClassPreview key={ currentClass.name } data={ currentClass }/>
    });

    return (
        <div className="m-1">
            <h6 className="border-bottom pb-1 mt-2">{'Imported from: ' + file.name}</h6>
            <h6 className="d-flex justify-content-around">
                <p className="mb-0">Teacher: {metaData.teacher}</p>
                <p className="mb-0">Subject: {metaData.subject}</p>
                <p className="mb-0">School level: {metaData.level}</p>
                <p className="mb-0">Year: {metaData.year}</p>
            </h6>
            <div className="d-flex justify-content-between">
                {renderTrimesterButtons}
            </div>
            <h6>{'Trimester Topics: '}</h6>
            <div className="row mx-1 mb-2">
                {renderTopics}
            </div>
            {renderClasses}
        </div>
    );
}

const ClassPreview = ({data}) => {
    const {name, students} = data;

    const renderStundets = students.map(student => {
        return (
            <div key={ student.name } className="d-flex row">
                <div className="d-flex col-3">
                    {'Schüler: ' + student.name}
                </div>
                <div className="d-flex col">
                    {'Ø: [' + student.avarage.assignmentGrade + ' , ' + student.avarage.difficulty + ' , ' + student.avarage.testScore + ']'}
                </div>
            </div>
        )
    })

    return (
        <div>
            <h6 className="border-bottom pb-1">{'Class: ' + name}</h6>
            {renderStundets}
        </div>
    )
}

export default Preview;