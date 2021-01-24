const Preview = ({data}) => {
    if (!data) return null;
    const {file, classes} = data;

    const renderClasses = classes.map(currentClass => {
        return <ClassPreview data={ currentClass }/>
    })

    return (
        <div className="m-1">
            <h6 className="border-bottom pb-1">{'Imported from: ' + file.name}</h6>
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
        <div key={ name }>
            <h6 className="border-bottom pb-1">{'Class: ' + name}</h6>
            {renderStundets}
        </div>
    )
}

export default Preview;