import React from 'react';
import readXlsxFile from 'read-excel-file';

import Grade from '../entity/Grade';
import Student from '../entity/Student';
import Topic from '../entity/Topic';
import TopicDefinition from '../entity/TopicDefinition';

import './Import.css';

const METADATA_POS = 0;
const TOPIC_NAMES_POS = 1;
const CLASS_IDENTIFIER = '_Klasse';

const Import = ({onChange, onClear}) => {
    const inputRef = React.useRef();

    const handleClear = () => {
        inputRef.current.value = null;
        onClear();
    }

    const onParsingComplete = (sheets, file) => {
        const data = sheets[0];

        const metaData = extractMetaData(data);
        const topicsData = extractTopicData(data);
        const classData = extractClassesData(data);
        console.log(classData);
        const studentData = classData[0].data;

        const topicDefinitions = createTopicDefinitions(topicsData);
        const students = createStudents(topicDefinitions, studentData);

        const classes = classData.map(c => {
            const students = createStudents(topicDefinitions, c.data);
            return {name: c.name, students};
        });

        onChange({classes, students, file, metaData});
    }
    
    const onChangeHandler = event => {
        const file = event.target.files[0];
        if (!file) return null;

        readXlsxFile(file, { getSheets: true}).then(sheets => {
            const promises = [];
            sheets.forEach(sheet => {
                promises.push(readXlsxFile(file, { sheet: sheet.name }));
            });
            Promise.all(promises).then(sheets => {
                onParsingComplete(sheets, file);
            });
        })
    };

    return (
        <div className="d-flex flex-column w-100">
            {inputRef.current?.value && <button onClick={ handleClear } className="btn btn-info mb-1">{'Clear Data'}</button>}
            <button className="btn btn-info">
                <input ref={ inputRef } onChange={ onChangeHandler } className="fileUploadButton" type="file" id='fileUpload' name='fileUpload' />
                <label htmlFor='fileUpload' className="d-flex align-items-center justify-content-center w-100 mb-0">
                    {'Upload XLSX'}
                </label>
            </button>
        </div>
    );
}

const createTopicDefinitions = topicsData => {
    return topicsData.map(name => new TopicDefinition(name, {name: 'Mathematic'}, 1));
};

const createStudents = (topicDefinitions, studentData) => {
    return studentData.map(student => {
        const name = student[0];

        const topics = topicDefinitions.map((def, i) => {
            const assignmentGrade = student[i * 3 + 1];
            const difficulty = student[i * 3 + 2];
            const testScore = student[i * 3 + 3];

            const grade = new Grade(assignmentGrade, difficulty, testScore);
            return new Topic(def, grade);
        })

        return new Student(name, topics);
    })
}

const extractClassesData = initData => {
    const data = [...initData];
    data.splice(0, 3); // skip metadata & topics & header

    if (!data[0][0].includes(CLASS_IDENTIFIER)) throw Error('Invalid excel file!');

    let currentClassName;
    const classData = {};
    data.forEach(row => {
        if (row[0]?.includes(CLASS_IDENTIFIER)) {
            currentClassName = row[0];
        } else {
            if (!classData[currentClassName]) classData[currentClassName] = [];
            classData[currentClassName].push(row)
        }
    })

    const classesData = Object.keys(classData).map(key => {
        const element = classData[key];
        return {name: key.replace(CLASS_IDENTIFIER + ' ', ''), data: element};
    })

    const classes = classesData.map(currentClassData => extractStudentData(currentClassData));

    return classes;
}

const extractMetaData = data => {
    const metaData = data[METADATA_POS];
    const [teacher, subject, level, year, trimester] = metaData;
    return {teacher, subject, level, year, trimester};
}

const extractStudentData = currentClass => {
    const {data, name} = currentClass;
    const filteredData = data.filter(d => d[0]);
    return {data: filteredData, name};
}

const extractTopicData = data => {
    const namingRow = data[TOPIC_NAMES_POS];
    const topicsData = namingRow.filter(topic => topic);
    topicsData.splice(0, 1) // remove name
    topicsData.splice(topicsData.length - 2, 2); // remove finale grading & total score
    return topicsData;
}

export default Import;