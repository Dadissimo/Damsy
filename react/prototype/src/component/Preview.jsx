const Preview = ({data}) => {
    if (!data) return null;
    const {file, students} = data;

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
        <div className="m-1">
            <h6 className="border-bottom pb-1">{'Imported from: ' + file.name}</h6>
            {renderStundets}
        </div>
    );
}

export default Preview;