class TopicDefinition {
    constructor(name, subject, trimester) {
        this.name = name;
        this.subject = subject;
        this.trimester = trimester;
        this.abbreviation = name.charAt(0);
    }
}

export default TopicDefinition;