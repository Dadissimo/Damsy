import React from 'react';
import {select} from 'd3';

import Plot from '../logic/Plot'

const TAB = {
    SUMMARY: 0,
    PREVIEW: 1
};

const Preview = ({data, selected, onChange, plotRef}) => {
    const [activeTab, setActiveTab] = React.useState(TAB.SUMMARY);
    const svgRef = React.useRef(null);

    if (!data) return null;

    const handleTabChange = newTabId => setActiveTab(newTabId);

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
        <div ref={ plotRef } className="m-1">
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
            <ul className="nav nav-tabs">
                <li className="nav-item" onClick={ () => handleTabChange(TAB.SUMMARY) }>
                    <div style={{cursor: 'pointer'}} className={'nav-link ' + (activeTab === TAB.SUMMARY ? 'active' : '')}>{'Summary'}</div>
                </li>
                <li className="nav-item" onClick={ () => handleTabChange(TAB.PREVIEW) }>
                    <div style={{cursor: 'pointer'}} className={'nav-link ' + (activeTab === TAB.PREVIEW ? 'active' : '')}>{'Preview'}</div>
                </li>
            </ul>
            {activeTab === TAB.SUMMARY && <ClassPreview data={ selectedClass } />}
            {activeTab === TAB.PREVIEW && <ChartPreview canvas={ svgRef } data={ selectedClass } />}
            <div ref={svgRef} />
        </div>
    );
}

const ChartPreview = ({data, canvas}) => {
    const firstStudent = data.students[0];

    React.useEffect(() => {
        const svgString = Plot.createSVG(firstStudent, {width: 800, height: 500});
        const node = select(canvas.current).append('div').html(svgString);

        return () => node.remove();
    }, [data, canvas])

    return (
        <h3>
            {firstStudent.name}
        </h3>
    );
}

const ClassPreview = ({data}) => {
    const {students} = data;

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
        <div className="border-right border-left border-bottom p-2">
            {renderStudents}
        </div>
    )
}

export default Preview;