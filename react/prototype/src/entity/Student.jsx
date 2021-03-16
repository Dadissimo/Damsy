class Student {
    constructor(name, topics, grade, agreements) {
        this.name = name;
        this.topics = topics;
        this.grade = grade;
        this.agreements = agreements;

        const assignmentAvarage = this.getAvarage(topics.map(topic => topic.grade.assignmentGrade));
        const difficultyAvarage = this.getAvarage(topics.map(topic => topic.grade.difficulty));
        const testScoreAvarage = this.getAvarage(topics.map(topic => topic.grade.testScore));
        
        this.avarage = {assignmentGrade: assignmentAvarage, difficulty: difficultyAvarage, testScore: testScoreAvarage};
    }

    getAvarage = grades => {
        let avarage = 0;
        grades.forEach(grade => {
            avarage += this.convertSpecialRemarksToGrades(grade);
        })
        const len = grades.filter(grade => grade !== 'k').length;
        return (avarage / len).toFixed(2);
    }

    convertSpecialRemarksToGrades = value => {
        if (value === 'f') return 0;
        if (value === 'k') return null;
        return +(value);
    }
}

export default Student;