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
        grades = grades.filter(grade => grade !== null);

        let avarage = 0;
        grades.forEach(grade => {
            avarage += this.convertSpecialRemarksToGrades(grade);
        })
        const len = grades.filter(grade => grade !== 'k' && grade !== 'K' && grade !== '-' && grade !== '').length;
        const grade = (avarage / len).toFixed(2);
        return grade;
    }

    convertSpecialRemarksToGrades = value => {
        if (value === 'f' || value === 'F') return 0;
        if (value === 'k' || value === 'K') return null;
        if (value === '-') return null;

        return +(value);
    }
}

export default Student;