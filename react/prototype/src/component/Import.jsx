import React from 'react';

import Papa from 'papaparse';
import Grade from '../entity/Grade';
import Student from '../entity/Student';
import Topic from '../entity/Topic';
import TopicDefinition from '../entity/TopicDefinition';

import './Import.css';

const Import = ({onChange, onClear}) => {
    const inputRef = React.useRef();

    const handleClear = () => {
        inputRef.current.value = null;
        onClear();
    }

    const onParsingComplete = (result, file) => {
        const {data} = result;

        const topicsData = extractTopicData(data);
        const studentData = extractStudentData(data);

        const topicDefinitions = createTopicDefinitions(topicsData);
        const students = createStudents(topicDefinitions, studentData);

        onChange({students, file});
    }
    
    const onChangeHandler = event => {
        const file = event.target.files[0];
        if (!file) return null;

        Papa.parse(file, {
            config: {
                delimiter: ";",
            },
            complete: onParsingComplete
        });
    };

    return (
        <div className="d-flex flex-column w-100">
            {inputRef.current?.value && <button onClick={ handleClear } className="btn btn-info mb-1">{'Clear Data'}</button>}
            <button className="btn btn-info">
                <input ref={ inputRef } onChange={ onChangeHandler } className="fileUploadButton" type="file" id='fileUpload' name='fileUpload' />
                <label htmlFor='fileUpload' className="d-flex align-items-center justify-content-center w-100 mb-0">
                    {'Upload CSV'}
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

const extractStudentData = initData => {
    const data = [...initData];
    data.splice(0, 2); // remove header
    return data.filter(d => d[0]);
}

const extractTopicData = data => {
    const namingRow = data[0];
    const topicsData = namingRow.filter(topic => topic);
    topicsData.splice(0, 1) // remove name
    topicsData.splice(topicsData.length - 2, 2); // remove finale grading & total score
    return topicsData;
}

export default Import;