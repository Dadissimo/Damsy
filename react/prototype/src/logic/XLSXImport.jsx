import readXlsxFile from 'read-excel-file';

import Grade from '../entity/Grade';
import Student from '../entity/Student';
import Topic from '../entity/Topic';
import TopicDefinition from '../entity/TopicDefinition';

const METADATA_POS = 0;
const TOPIC_NAMES_POS = 1;
const CLASS_IDENTIFIER = '_Klasse';

class XLSXImport {
    constructor(config) {
        const {metadataPosition, topicPosition, classIdentifier} = config;
        this.metadataPosition = metadataPosition;
        this.topicPosition = topicPosition;
        this.classIdentifier = classIdentifier;
    }

    parse = file => {
        const promise = new Promise((resolve, reject) => {
            readXlsxFile(file, { getSheets: true}).then(sheets => {
                const promises = [];
                sheets.forEach(sheet => {
                    promises.push(readXlsxFile(file, { sheet: sheet.name }));
                });
                Promise.all(promises).then(sheets => {
                    resolve(this.onParsingComplete(sheets, file));
                }).catch(err => reject(err));
            }).catch(err => reject(err));
        })

        return promise;
    }

    onParsingComplete = (sheets, file) => {
        return sheets.map(sheet => {
            const metaData = this.extractMetaData(sheet);
            const topicsData = this.extractTopicData(sheet);
            const classData = this.extractClassesData(sheet);

            const topicDefinitions = this.createTopicDefinitions(topicsData);

            const classes = classData.map(c => {
                const students = this.createStudents(topicDefinitions, c.data);
                return {name: c.name, students};
            });

            return {classes, file: file, metaData, topics: topicsData.map(t => t.name)};
        })
    }

    createTopicDefinitions = topicsData => {
        return topicsData.map(topic => new TopicDefinition(topic.name, {name: 'Mathematic'}, 1, topic.col));
    };

    createStudents = (topicDefinitions, studentData) => {
        const gradeDef = topicDefinitions.splice(topicDefinitions.length - 1, 1)[0];

        return studentData.map(student => {
            const name = student[0];
    
            const topics = topicDefinitions.map((def, i) => {
                const assignmentGrade = student[i * 3 + 1];
                const difficulty = student[i * 3 + 2];
                const testScore = student[i * 3 + 3];
    
                const grade = new Grade(assignmentGrade, difficulty, testScore);
                return new Topic(def, grade);
            })

            const grade = student[gradeDef.column];
    
            return new Student(name, topics, grade);
        })
    }
    
    extractClassesData = initData => {
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
    
        const classes = classesData.map(currentClassData => this.extractStudentData(currentClassData));
    
        return classes;
    }
    
    extractMetaData = data => {
        const metaData = data[METADATA_POS];
        const [teacher, subject, level, year, trimester] = metaData;
        return {teacher, subject, level, year, trimester};
    }
    
    extractStudentData = currentClass => {
        const {data, name} = currentClass;
        const filteredData = data.filter(d => d[0]);
        return {data: filteredData, name};
    }
    
    extractTopicData = data => {
        const namingRow = data[TOPIC_NAMES_POS];
        const topicsData = namingRow
            .map((topic, col) => ({name: topic, col }))
            .filter(topic => topic.name);
        topicsData.splice(0, 1) // remove name
        topicsData.splice(topicsData.length - 1, 1); // remove finale grading & total score
        return topicsData;
    }
}

export default XLSXImport;