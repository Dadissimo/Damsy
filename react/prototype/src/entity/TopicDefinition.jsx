class TopicDefinition {
    constructor(name, subject, trimester, column) {
        this.name = name;
        this.subject = subject;
        this.trimester = trimester;
        this.abbreviation = name.charAt(0);
        this.column = column;
    }
}

export default TopicDefinition;