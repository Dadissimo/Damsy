class Grade {
    constructor(assignmentGrade, difficulty, testScore) {
        this.assignmentGrade = assignmentGrade === '' ? null : assignmentGrade;

        this.difficulty = (difficulty === '') ? null : difficulty;
        
        this.testScore = this.getScore(testScore);
    }

    getScore = score => {
        if (score === '' || score === null) return null;
        if (isNaN(score)) return score;
        return Math.round(score);
    }
}

export default Grade;