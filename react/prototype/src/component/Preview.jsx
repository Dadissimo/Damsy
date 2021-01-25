const Preview = ({data, selected, onChange}) => {
    if (!data) return null;

    const renderTrimesterButtons = data.map((d, i) => {
        const handleClick = () => onChange('trimester', i);
        const buttonClass = 'd-flex flex-grow-1 btn m-1 ' + (selected.trimester === i ? 'btn-success' : 'btn-secondary'); 
        return (
            <button key={ d.metaData.trimester } onClick={ handleClick } className={ buttonClass }>{'Trimester ' + d.metaData.trimester}</button>
        );
    });

    const {file, classes, topics, metaData} = data[selected.trimester];

    const renderTopics = topics.map((topic, i) => {
        return (
            <h6 key={ topic + i} className="p-1 col border" >{topic}</h6>
        );
    });

    const renterClassButtons = classes.map((currentClass, i) => {
        const handleClick = () => onChange('class', i);
        const buttonClass = 'd-flex flex-grow-1 btn m-1 ' + (selected.class === i ? 'btn-success' : 'btn-secondary'); 
        return (
            <button key={ currentClass.name } onClick={ handleClick } className={ buttonClass }>{'Class ' + currentClass.name}</button>
        );
    })

    const selectedClass = classes[selected.class];

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
            <div className="d-flex justify-content-between">
                {renterClassButtons}
            </div>
            <ClassPreview data={ selectedClass } />
        </div>
    );
}

const ClassPreview = ({data}) => {
    const {name, students} = data;

    const renderStudents = students.map(student => {
        return (
            <div key={ student.name } className="d-flex row">
                <div className="d-flex col-3">
                    {student.name}
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
            {renderStudents}
        </div>
    )
}

export default Preview;