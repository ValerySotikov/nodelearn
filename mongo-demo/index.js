const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [ String ],
    date: { type: Date, default: Date.now },
    isPublished: Boolean
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
    const course = Course({
        name: 'Angular course',
        author: 'Mosh',
        tags: ['angular', 'frontend'],
        published: true
    });

    const result = await course.save();
    console.log(result);
}

async function getCourses() {
    //  comparision operators
    //  eq (equal)
    //  ne (not equal)
    //  gt (greater than)
    //  gte (greater than or equal to)
    //  lt (less than)
    //  lte (less than or equal to)
    //  in
    //  nin (not in)

    //  logical operators
    //  or
    //  and

    const pageNumber = 2;
    const pageSize = 10;
    // /api/courses?pageNumber=2&pageSize=10

    const courses = await Course
        .find({ author: 'Mosh', isPublished: true })
        .skip(((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort({name: 1})
        .count();
    console.log(courses);
}

getCourses();

// createCourse();


