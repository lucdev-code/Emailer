export const studentsData = [
    { name: 'Lucero', score: 99},
    { name: 'Natalia', score: 100},
    { name: 'Kevin', score: 80},
    { name: 'Eduardo', score: 88},
    { name: 'Gera', score: 65},
    { name: 'Gustavo', score: 84},
    { name: 'Isaac', score: 95}
]

const emailsStudents = studentsData.map(student => `${student.name.toLowerCase()}@gmail.com`)

export const studentsEmail = emailsStudents



