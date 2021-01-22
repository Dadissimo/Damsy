class Topic {
    constructor(definition, grade) {
        this.name = definition.name;
        this.subject = definition.subject;
        this.trimester = definition.trimester;
        this.grade = grade;
    }
}

export default Topic;