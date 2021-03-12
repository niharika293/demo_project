// Queue -> Group of similar tasks.
// For each job, you can create a separate worker so that code remains clean.

const queue = require('../config/kue');
const commentsMailer = require('../mailers/comments_mailer');

// Every mailer must have to have a process(), it tells the worker that whenever a new task is being added into 
// the queue, you need to run the code inide the process().
// job -> what the () needs to do - 
// 1. () that needs to be executed inside of this, i.e the mailer which needs to be called.
// 2. data - i.e the comment with which i'm filling in the email.

queue.process('emails',function(job,done){
    console.log('emails worker is processing a job', job.data);
    commentsMailer.newComment(job.data);
    done();
});

// the above worker should be called from the controller 