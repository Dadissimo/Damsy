$(document).ready(function(){
    $('#submit-file').on("click",function(e){
        e.preventDefault();
        $('#files').parse({
            config: {
                delimiter: ";",
                complete: displayHTMLTable,
            },
            before: function(file, inputElem)
            {
                console.log("Parsing file...", file);
            },
            error: function(err, file)
            {
                console.log("ERROR:", err, file);
            },
            complete: function()
            {
                // console.log("Done with all files");
            }
        });
    });
});

function displayHTMLTable(results) {
    const data = results.data;

    const namingRow = data[0];
    const topics = namingRow.filter(topic => topic);
    topics.splice(0, 1) // remove name
    topics.splice(topics.length - 2, 2); // remove finale grading & total score

    console.log(topics);

    data.splice(0, 2); // remove header
    const studentData = data.filter(d => d[0]);

    const students = studentData.map(student => {
        const name = student[0];

        const gradings = topics.map((topic, i) => {
            const assignmentGrade = student[i * 3 + 1];
            const difficulty = student[i * 3 + 2];
            const percentage = student[i * 3 + 3];
            const abbreviation = topic.charAt(0);

            return {topic, abbreviation, assignmentGrade, difficulty, percentage};
        })

        const assignmentAvarage = getGradeAvarage(gradings.map(grade => grade.assignmentGrade));
        const difficultyAvarage = getGradeAvarage(gradings.map(grade => grade.difficulty));
        const percentageAvarage = getGradeAvarage(gradings.map(grade => grade.percentage));
        
        const avarages = {assignmentGrade: assignmentAvarage, difficulty: difficultyAvarage, percentage: percentageAvarage};

        return {name, gradings, avarages};
    })

    console.log(students);

    const generateReportForStudent = (student) => {
        const assignments = ['Assignments'].concat(
            student.gradings.map(grade => grade.topic)
        ).concat({text: 'Ø', alignment: 'center'});
        const execution = ['Ausführung'].concat(
            student.gradings.map(grade => grade.assignmentGrade)
        ).concat(student.avarages.assignmentGrade);
        const stars = ['Sterne'].concat(
            student.gradings.map(grade => convertToStars(grade.difficulty))
        ).concat(student.avarages.difficulty);
        const score = ['Prüfung in %'].concat(
            student.gradings.map(grade => ({text: grade.percentage, fillColor: getFillColor(grade.percentage)}))
        ).concat({text: student.avarages.percentage, fillColor: getFillColor(student.avarages.percentage)});

        const content = [
            {
                pageBreak: 'before',
                table: {
                    headerRows: 1,
                    widths: ['*', 200],
                    body: [
                        [
                            {text: 'Leistungsnachweis Mathematik', style: 'header', fillColor: '#eeeeee'}, 
                            {text: '1 Trimester 2019/20', style: 'header', fillColor: '#eeeeee', alignment: 'right'}
                        ]
                    ]
                },
                layout: 'lightHorizontalLines',
                style: 'table'
            },
            {text: 'Name: ' + student.name},
            {
                style: 'table',
                table: {
                    body: [
                        assignments,
                        execution,
                        stars,
                        score
                    ]
                }
            },
            {
                svg: createSVG(student, student.name === 'A'),
                alignment: 'center'
            }
        ];

        return content;
    }

    const contents = students.map(student => generateReportForStudent(student));

    const docDefinition = {
        pageOrientation: 'landscape',
        content: contents,
        styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 10]
                },
                table: {
                    margin: [0, 5, 0, 15]
                }
        }
    };

    pdfMake.createPdf(docDefinition).download();
}

function convertToStars(value) {
    if (isSpecialRemark(value)) return value;
    let str = '';
    for (let index = 0; index < value; index++) {
        str += '*';                
    }
    return str;
}

function getFillColor(percentage) {
    const colors = ["#32a852", "#32a852", "#34a751", "#35a651", "#37a550", "#38a350", "#3aa24f", "#3ba14f", "#3da04e", "#3e9f4e", "#409e4d", "#419d4d", "#439b4c", "#449a4c", "#46994b", "#47984b", "#49974a", "#4a964a", "#4c9549", "#4d9349", "#4f9248", "#509147", "#529047", "#538f46", "#558e46", "#568d45", "#588b45", "#598a44", "#5b8944", "#5c8843", "#5e8743", "#5f8642", "#618542", "#628341", "#648241", "#658140", "#678040", "#687f3f", "#6a7e3f", "#6b7d3e", "#6d7b3e", "#6e7a3d", "#70793c", "#71783c", "#73773b", "#74763b", "#76753a", "#77733a", "#797239", "#7a7139", "#7c7038", "#7d6f38", "#7f6e37", "#806d37", "#826c36", "#836a36", "#856935", "#866835", "#886734", "#896634", "#8b6533", "#8c6432", "#8e6232", "#8f6131", "#916031", "#925f30", "#945e30", "#955d2f", "#975c2f", "#985a2e", "#9a592e", "#9b582d", "#9d572d", "#9e562c", "#a0552c", "#a1542b", "#a3522b", "#a4512a", "#a6502a", "#a74f29", "#a94e29", "#aa4d28", "#ac4c27", "#ad4a27", "#af4926", "#b04826", "#b24725", "#b34625", "#b54524", "#b64424", "#b84223", "#b94123", "#bb4022", "#bc3f22", "#be3e21", "#bf3d21", "#c13c20", "#c23a20", "#c4391f", "#c5381f", "#c7371e"];
    return colors[100 - Math.round(percentage)];
    // function pickRGB(color1, color2, weight) {
    //     var w1 = weight;
    //     var w2 = 1 - w1;
    //     var rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
    //         Math.round(color1[1] * w1 + color2[1] * w2),
    //         Math.round(color1[2] * w1 + color2[2] * w2)];
    //     return rgb;
    // }

    // const rgb = pickRGB([0,0,150], [150,0,0], percentage);
    // return rgbToHex(rgb[0], rgb[1], rgb[2]);
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
  
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function convertSpecialRemarksToGrades(value) {
    if (value === 'f') return 0;
    if (value === 'k') return null;
    return +(value);
}

function isSpecialRemark(value) {
    if (value === 'f' || value === 'k') return true;
    return false;
}

function getGradeAvarage(grades) {
    let avarage = 0;
    grades.map(grade => {
        avarage += convertSpecialRemarksToGrades(grade);
    })
    const len = grades.filter(grade => grade !== 'k').length;
    return (avarage / len).toFixed(2);
}