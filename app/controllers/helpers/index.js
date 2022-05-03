// const config = require("../config/auth.config");

const db = require("../../models");
const Email = db.email;
const Elist = db.elist;


var nodemailer = require('nodemailer');
var Imap = require('imap'),
inspect = require('util').inspect;
var fs = require('fs'), fileStream;
const {simpleParser} = require('mailparser');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;


var imap = new Imap({
  user: process.env.IMAP_USER,
  password: process.env.IMAP_PWD,
  host: process.env.IMAP_HOST,
  port: process.env.IMAP_PORT,
  StartTls: true,
  // tlsOptions: { rejectUnauthorized: false },
  debug: console.log
          
});

// function openInbox(cb) {
//   imap.openBox('INBOX', true, cb);
// }

exports.sendMail = (toAddress) => {
    console.log(process.env.SMTP_PORT+'---'+toAddress);
        // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      port: process.env.SMTP_PORT,               // true for 465, false for other ports
      host: process.env.SMTP_HOST,
         auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PWD,
           },
      secure: true,
      });
    
      const mailData = {
        from: process.env.SMTP_FROM,  // sender address
          to: toAddress,   // list of receivers
          subject: 'Ticket System - Signup message',
          // text: 'That was easy!'
          html: '<p><b>Welcome !</p><br> <p>Thank you for signup</p><br/>',
        };
    
        transporter.sendMail(mailData, (error, info) => {
          if (error) {
              return console.log(error);
          }
          res.status(200).send({ message: "Mail send", data: info });
      });
    
    };


    exports.imapEmail = (req,res) => {
     var arr = [];
      try {

        imap.once('ready', () => {
          imap.openBox('INBOX', false, () => {
            imap.search(['UNSEEN', ['SINCE', new Date().toISOString().slice(0, 10)]], (err, results) => {

              if (!results || !results.length) {
                console.log("No mails");
               res.status(200).json({error:"No mails"});

                imap.end(); return;
            }

              const f = imap.fetch(results, {bodies: ''});
              f.on('message', msg => {
                msg.on('body', stream => {
                  simpleParser(stream, async (err, parsed) => {
                    const {from, subject, textAsHtml, text,to,date,messageId,inReplyTo,references} = parsed;

                    console.log(parsed);
                     
                    if(inReplyTo !== 'undefined' && inReplyTo ){
                       var inRplyTo = inReplyTo.slice(1,-1);
                     }

                     if(messageId !== 'undefined' && messageId ){
                       var msgId = messageId.slice(1,-1);
                       var conversionId = msgId;
                     }

                     if(references !== 'undefined' && references ){
                       var refId = references[0].slice(1,-1);
                      var conversionId = refId;

                     }else{
                       var ticketId = Math.floor(Math.random() * 1000000000);
                     }

     
              

                    const data = new Email({                   
                      from: from.value[0].address,
                      subject: subject,
                      msg: textAsHtml,
                      to: to.value[0].address,
                      date: date,
                      messageId:msgId,
                      inReplyTo:inRplyTo,
                      conversionId:conversionId,
                      ticketId:ticketId

                  
                    });

                    data.save(function(err,result){
                      if (err){ console.log(err); }
                      else{ console.log(result) }
                   });

                   
                   Elist.findOne({from:from.value[0].address}, function(err, data){
                    if(err) console.log(err);
                    if(data){
                    console.log('This has already been saved');
                    } else {
                    var eData = new Elist({
                      from: from.value[0].address,
                      subject: subject,
                      msg: textAsHtml,
                      to: to.value[0].address,
                      date: date,
                      messageId:msgId,
                      inReplyTo:inRplyTo,
                      conversionId:conversionId,
                      ticketId:ticketId
                    });
                    eData.save(function(err, example) {
                    if(err) console.log(err);
                    console.log('New data created');
                    
                    });
                    }
                    });


                  });
                });
                msg.once('attributes', attrs => {
                  const {uid} = attrs;
                  imap.addFlags(uid, ['\\Seen'], () => {
                    // Mark the email as read after reading it
                    console.log('Marked as read!');

                  });
                });
              });
              f.once('error', ex => {
                return Promise.reject(ex);
              });
              f.once('end', () => {
                console.log('Done fetching all messages!');
                imap.end();
              });
            });
          });
        });
    
        imap.once('error', err => {
          console.log(err);
        });
    
        imap.once('end', () => {
          console.log('Connection ended');
        });
    
        imap.connect();

      } catch (err) {
        console.log('an error occurred');
       
      }

    
      
      };