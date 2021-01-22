import Papa from 'papaparse';
import Grade from '../entity/Grade';
import Student from '../entity/Student';
import Topic from '../entity/Topic';
import TopicDefinition from '../entity/TopicDefinition';

const Import = ({onChange}) => {
    const onParsingComplete = result => {
        const {data} = result;

        const topicsData = extractTopicData(data);
        const studentData = extractStudentData(data);

        const topicDefinitions = createTopicDefinitions(topicsData);
        const students = createStudents(topicDefinitions, studentData);

        onChange(students);
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
        <input type="file" name="file" onChange={ onChangeHandler }/>
    );
}

const createTopicDefinitions = topicsData => {
    return topicsData.map(name => new TopicDefinition(name, {name: 'Mathematic'}, 1));
};

const createStudents = (topicDefinitions, studentData) => {
    return studentData.map(student => {
        const name = student[0];

        const topics = topicDefinitions.map((def, i) => {
            const assignmentGrade = +student[i * 3 + 1];
            const difficulty = +student[i * 3 + 2];
            const testScore = +student[i * 3 + 3];

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