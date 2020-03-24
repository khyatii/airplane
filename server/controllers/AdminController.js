const Claim = require("../models/claim");
const User = require('../models/user');
const getCompensation = require('../utilities/get-compensation');
const nodemailer = require('nodemailer');
const transporter = require('../config/mailconfig');
const cron = require("node-cron");
const clientUrl = require('../config/url').clientUrl;

module.exports = {
  isAdmin: (req, res, next) => {
    if (req.isAuthenticated() && req.user.password == process.env.ADMIN_PASSWORD_HASH && req.user.role == 'ADMIN') next();
    else return res.status(401).json({ message: 'Unauthorized admin' });
  },
  listClaim: (req, res, next) => {
    Claim.find({})
      .populate('username')
      .populate('airline')
      .populate('airports')
      .populate('collaborator.promoCode')
      .exec(
        (err, docs) => {
          if (err) return res.status(400).json(err);
          else return res.status(200).json(docs);
        });
  },
  updateStatus: (req, res, next) => {
    Claim.find({ _id: req.body.claimId })
      .populate('username')
      .populate('airline')
      .exec(function (err, result) {
        Claim.update({
          _id: req.body.claimId
        }, {
            $set: {
              status: req.body.status
            }
          },
          (err, docs) => {
            if (err) return res.status(400).json(err);

            else {
              if (req.body.status == 'Pending') {
                let collaboratorMoney;
                if (result[0].collaborator.money !== undefined) collaboratorMoney = result[0].collaborator.money;
                else collaboratorMoney = 0
                const sum = result[0].userMoney + collaboratorMoney + result[0].companyMoney;
                const subject = 'COMPLETE YOUR ' + sum + '€ CLAIM AT FLYANDCLAIM.COM';
                const text = ` <p>Hello ${result[0].username.firstName},</p>
                <p style="line-height: 1.2">
                You have initiated your claim for a ${result[0].claimType} on our website.
                So that we can start processing your ${sum}€ compensation in Fly & Claim,
                we need you to complete the corresponding form. Do it by clicking below:</p><br>
                <center><a href= ${clientUrl}/claim><button style="background-color: #0052CC;font-family: Montserrat;color: white;cursor: pointer;font-weight: 700;margin: 0 2% 0 0;height: auto;border-radius: 4px;border: none;font-size: 17.5px; padding: 7px 15px;">
                Complete Claim</button></a></center>`
                mailTouser(result, subject, text, function (status) { if (status) { return res.status(200).json(docs); } else { return res.status(404).json({ message: 'error' }); } });
              }
              else if (req.body.status == 'ClaimCompany' && result[0].airline.name != 'Ryanair') {
                let collaboratorMoney;
                if (result[0].collaborator.money !== undefined) collaboratorMoney = result[0].collaborator.money;
                else collaboratorMoney = 0
                const sum = result[0].userMoney + collaboratorMoney + result[0].companyMoney;
                const subject = 'CLAIM OF ' + sum + '€ RECEIVED';
                const text = `<p>Hello ${result[0].username.firstName},</p>
                <p style="line-height: 1.2">
                We have received the claim and have successfully processed your ${sum}€ compensation.
                To speed up the process, we have requested ${result[0].airline.name} directly; however,
                if within a month, the airline decides not to pay your compensation, 
                we will proceed to act through the administrative channel.<br><br>

                If any other passenger was traveling with you and wants to make a claim with us, it is the right time to share your promotional code.
                 For each person who uses it you will get € 10. In addition,
                anyone who introduces it, will also get € 10 more when receiving compensation for the delay of your flight.</p><br>
                <center><a href= ${clientUrl}/earnmoney><button style="background-color: #0052CC;font-family: Montserrat;color: white;cursor: pointer;font-weight: 700;margin: 0 2% 0 0;height: auto;border-radius: 4px;border: none;font-size: 17.5px; padding: 7px 15px;">
                See my promotional code</button></a></center>`
                mailTouser(result, subject, text, function (status) { if (status) { return res.status(200).json(docs); } else { return res.status(404).json({ message: 'error' }); } });
              }
              else if (req.body.status == 'ClaimCompany' && result[0].airline.name == 'Ryanair') {
                let collaboratorMoney;
                if (result[0].collaborator.money !== undefined) collaboratorMoney = result[0].collaborator.money;
                else collaboratorMoney = 0
                const sum = result[0].userMoney + collaboratorMoney + result[0].companyMoney;
                const vat = result[0].companyMoney * 1.21;
                const subject = 'COMPENSATION PAYMENT OBTAINED BY YOUR RYANAIR FLIGHT';
                const text = `<p>Hello ${result[0].username.firstName},</p>
                <p style="line-height: 1.2">
                We have completed your claim satisfactorily. In order to continue successfully managing your ${sum}€ compensation, we need you to send us your IBAN to the email address info@flyandclaim.com.<br><br>
                Once we receive it, Ryanair will proceed to pay your compensation within 45 days. So that we can finish this process efficiently, we ask you to notify us, as soon as possible, the reception of said bank transfer; If not received within the stipulated period of time, we will resume the claim through another way.<br><br>
                Lastly, we want to remind you that once you have received the ${sum}€ of your compensation, you will have to transfer the commission of 25% + VAT for our services. This amount would mean a total of ${result[0].companyMoney}€ + VAT; that is, ${vat}€.
                </p><br>`
                mailTouser(result, subject, text, function (status) { if (status) { return res.status(200).json(docs); } else { return res.status(404).json({ message: 'error' }); } });
              }
              else if (req.body.status == 'WaitingPayment1') {
                let collaboratorMoney;
                if (result[0].collaborator.money !== undefined) collaboratorMoney = result[0].collaborator.money;
                else collaboratorMoney = 0
                const sum = result[0].userMoney + collaboratorMoney + result[0].companyMoney;
                const subject = 'POSITIVE INFORMATION ABOUT YOUR ' + sum + '€ CLAIM AT FLYANDCLAIM.COM, RECEIPT RECEIVED';
                const text = `<p>Hello ${result[0].username.firstName},</p>
                <p style="line-height: 1.2">
                We inform you that we have received a positive opinion from the State Aviation Safety Agency about your compensation in relation to the 3-hour delay suffered in Madrid. This opinion grants power to our claim as it is proof in favor of the compensation of ${sum}€ that corresponds to you. Therefore, we proceed to require the airline ${result[0].airline.name} to pay your compensation. This second requirement has a high effectiveness since, at this point, 90% of the airlines decide to pay the corresponding compensation.<br><br>
                The claim process in which we currently find ourselves has to be completed within a month. After the same, in case you have not received a positive response regarding the payment of your compensation, we will inform you about the following procedures to obtain it.<br><br>
                If any other passenger was traveling with you and wants to make a claim with us, it is the right time to share your promotional code. For each person who uses it you will get € 10. In addition, anyone who introduces it, will also get € 10 more when receiving compensation for the delay of your flight.
                </p><br>
                <center><a href= ${clientUrl}/earnmoney><button style="background-color: #0052CC;font-family: Montserrat;color: white;cursor: pointer;font-weight: 700;margin: 0 2% 0 0;height: auto;border-radius: 4px;border: none;font-size: 17.5px; padding: 7px 15px;">
                See my promotional code</button></a></center>`
                mailTouser(result, subject, text, function (status) { if (status) { return res.status(200).json(docs); } else { return res.status(404).json({ message: 'error' }); } });
              }
              else if (req.body.status == 'Rejected') {
                let collaboratorMoney;
                if (result[0].collaborator.money !== undefined) collaboratorMoney = result[0].collaborator.money;
                else collaboratorMoney = 0
                const sum = result[0].userMoney + collaboratorMoney + result[0].companyMoney;
                const subject = 'SORRY, YOUR CLAIM HAS NO RIGHT TO COMPENSATION. FLYANDCLAIM TEAM';
                const text = `<p>Hello ${result[0].username.firstName},</p>
                <p style="line-height: 1.2">
                We thank you for trusting us to make your claim. Unfortunately we have received a negative opinion from the State Aviation Safety Agency in which, after studying your case, it is concluded that it did not deserve the compensation. For this reason, in this case,
                 you do not have the compensation of ${sum}€ stipulated in Regulation 261/2004.<br><br>
                As you know, in this case, our service is completely free, so, despite the unfortunate verdict of the opinion, we are gratified to have achieved the resolution of the process without having assumed any cost to you.<br><br>
                We hope you can continue to count on us in the future for other claims.
                </p><br>`
                mailTouser(result, subject, text, function (status) { if (status) { return res.status(200).json(docs); } else { return res.status(404).json({ message: 'error' }); } });
              }
              else if (req.body.status == 'PaymentDone') {
                const sum = result[0].userMoney - (result[0].companyMoney * 1.21);
                const subject = 'TRANSFER OF ' + sum + '€.”ISSUED CORRECTLY. FLYANDCLAIM TEAM';
                const text = `<p>Hello ${result[0].username.firstName},</p>
                <p style="line-height: 1.2">
                We have successfully transferred ${sum}€ to your bank account; You will receive the payment in the next days.<br><br>
                We would also like to inform you that it is possible to obtain compensation of up to € 600 for any flight that has suffered a delay of more than 3 hours, cancellation or overbooking in the last 5 years. Therefore, we hope that, in case you have been involved in incidents with any of the characteristics described above, do not hesitate to contact us again to claim your compensation.<br><br>
                Remember that, in case of not getting any compensation, our service is free, so you only have to find that old flight; we take care of the rest.<br><br>
                We hope that our services have met your expectations and, if so, we would like to remind you that, if any other passenger was traveling with you and wants to make a claim with us, it is the right time to share your promotional code. For each person who uses it you will get € 10. In addition, anyone who introduces it, will also get € 10 more when receiving compensation for the delay of your flight.
                </p><br>`
                mailTouser(result, subject, text, function (status) { if (status) { return res.status(200).json(docs); } else { return res.status(404).json({ message: 'error' }); } });
              }
              else if (req.body.status == 'PaymentReceived') {
                let collaboratorMoney;
                if (result[0].collaborator.money !== undefined) collaboratorMoney = result[0].collaborator.money;
                else collaboratorMoney = 0
                const sum = result[0].userMoney + collaboratorMoney + result[0].companyMoney;
                const subject = 'CONGRATULATIONS! WE HAVE RECEIVED YOUR ' + sum + '€ COMPENSATION, WE NEED YOUR BANK DATA';
                const text = `<p>Hello ${result[0].username.firstName},</p>
                <p style="line-height: 1.2">
                We have received your compensation of ${sum}€ in a satisfactory manner. In order to transfer this amount, once discounted our fees of 25% + VAT, we need you to send us your IBAN to the email info@flyandclaim.com.<br><br>
                At the moment we receive this last information, we proceed to pay your compensation within a maximum period of one week.<br><br>
                We would also like to inform you that it is possible to obtain compensation of up to € 600 for any flight that has suffered a delay of more than 3 hours, cancellation or overbooking in the last 5 years. Therefore, we hope that, in case you have been involved in incidents with any of the characteristics described above, do not hesitate to contact us again to claim your compensation. Remember that, in case of not getting any compensation, our service is free, so you only have to find that old flight; we take care of the rest.<br><br>
                We hope that our services have met your expectations and, if so, we would like to remind you that, if any other passenger was traveling with you and wants to make a claim with us, it is the right time to share your promotional code. For each person who uses it you will get € 10. In addition, anyone who introduces it, will also get € 10 more when receiving compensation for the delay of your flight.
                </p><br>`
                mailTouser(result, subject, text, function (status) { if (status) { return res.status(200).json(docs); } else { return res.status(404).json({ message: 'error' }); } });
              }
              else if (req.body.status == 'PendingClaimAdmin') {
                let collaboratorMoney;
                if (result[0].collaborator.money !== undefined) collaboratorMoney = result[0].collaborator.money;
                else collaboratorMoney = 0
                const sum = result[0].userMoney + collaboratorMoney + result[0].companyMoney;
                const subject = sum + ' €  CLAIM RECEIVED';
                const text = `<p>Hello ${result[0].username.firstName},</p>
                <p style="line-height: 1.2">
                We have received the claim and have successfully processed your ${sum}€ compensation. To do this, through the administrative channel; Through which we successfully obtained 95% of compensation. This procedure usually lasts about 3 or 4 months and in the unlikely event that the airline decided not to pay their compensation, we would appeal to the courts.<br><br>
                At Fly & Claim we take care of all the development and evolution of the recovery in the way that is as simple as possible. In 99% of cases, we get the compensation stipulated in favor of our clients.<br><br>
                As you know, we assume all the costs of the recovery process, so you do not have to worry; This service will have no cost.<br><br>
                If another passenger traveled with you and wants to make a claim with us, it is the right time to share your promotional code. For each person you will get € 10. In addition, everything you can, you will also get € 10 more to receive compensation for the delay of your flight.
                </p><br>
                <center><a href= ${clientUrl}/earnmoney><button style="background-color: #0052CC;font-family: Montserrat;color: white;cursor: pointer;font-weight: 700;margin: 0 2% 0 0;height: auto;border-radius: 4px;border: none;font-size: 17.5px; padding: 7px 15px;">
                See my promotional code</button></a></center>`
                mailTouser(result, subject, text, function (status) { if (status) { return res.status(200).json(docs); } else { return res.status(404).json({ message: 'error' }); } });
              }
              else if (req.body.status == 'ClaimAdmin1') {
                let collaboratorMoney;
                if (result[0].collaborator.money !== undefined) collaboratorMoney = result[0].collaborator.money;
                else collaboratorMoney = 0
                const sum = result[0].userMoney + collaboratorMoney + result[0].companyMoney;
                const subject = 'INFORMATION ABOUT YOUR ' + sum + '€ CLAIM AT FLYANDCLAIM.COM';
                const text = `<p>Hello ${result[0].username.firstName},</p>
                <p style="line-height: 1.2">
                We inform you that, after having tried to resolve your claim by contacting the company directly, ${result[0].airline.name}  has decided not to respond to our request of ${sum}€ in compensation for you.<br><br>
                However, you do not have to worry about it, after this procedure, we proceed to act through the administrative channel; through which, we satisfactorily conclude 95% of the claims that have not been reached through the direct route. This procedure usually lasts about 3 or 4 months and in the unlikely event that the airline decided not to pay your compensation, we would appeal to the courts.<br><br>
                At Fly & Claim we take care of all the development and evolution of the claim so that this process is as simple as possible. We only ask for a bit of patience in order to obtain results because, in 99% of cases, we get the compensation stipulated in favor of our clients.<br><br>
                As you know, we assume all the costs of the claim process, so, in the remote case of not getting any compensation, our service would be completely free.<br><br>
                If any other passenger was traveling with you and wants to make a claim with us, it is the right time to share your promotional code. For each person who uses it you will get € 10. In addition, anyone who introduces it, will also get € 10 more when receiving compensation for the delay of your flight.
                </p><br>
                <center><a href= ${clientUrl}/earnmoney><button style="background-color: #0052CC;font-family: Montserrat;color: white;cursor: pointer;font-weight: 700;margin: 0 2% 0 0;height: auto;border-radius: 4px;border: none;font-size: 17.5px; padding: 7px 15px;">
                See my promotional code</button></a></center>`
                mailTouser(result, subject, text, function (status) { if (status) { return res.status(200).json(docs); } else { return res.status(404).json({ message: 'error' }); } });

              }
              else if (req.body.status == 'ClaimAdmin2') {
                let collaboratorMoney;
                if (result[0].collaborator.money !== undefined) collaboratorMoney = result[0].collaborator.money;
                else collaboratorMoney = 0
                const sum = result[0].userMoney + collaboratorMoney + result[0].companyMoney;
                const subject = 'INFORMATION ABOUT YOUR ' + sum + '€ CLAIM AT FLYANDCLAIM.COM, SECOND REQUIREMENT AESA';
                const text = `<p>Hello ${result[0].username.firstName},</p>
                <p style="line-height: 1.2">
                We inform you that ${result[0].airline.name} has not fulfilled its obligation to pay within a maximum period of one stipulated month. Before proceeding to process the claim through the courts to be able to recover your rights, it is necessary to inform the State Aviation Safety Agency of the non-payment so that they are the ones who require ${result[0].airline.name} to pay the corresponding compensation of ${sum}€.<br><br>
                If, again, within a month, ${result[0].airline.name} decides not to pay your compensation, it will be necessary to appeal to the courts. Although the process may seem difficult, you have nothing to worry about; Some airlines decide to postpone the payment of the compensation until this point. However, there are few who go on to prolong it until they reach the courts.
                </p><br>`

                mailTouser(result, subject, text, function (status) { if (status) { return res.status(200).json(docs); } else { return res.status(404).json({ message: 'error' }); } });
              }
              else {
                return res.status(200).json(docs);
              }
            }
          });
        var currentDate = new Date();
        var date = currentDate.getDate();
        cron.schedule("0 0 " + date + " * *", function () { /* mail send on every month */
          Claim.find({ _id: req.body.claimId }, function (err, claimDoc) {
            if (err) return res.status(404).json({ message: 'error' });
            else {
              if (claimDoc[0].status === 'ClaimAdmin1' || claimDoc[0].status == 'PendingClaimAdmin') {
                let collaboratorMoney;
                if (result[0].collaborator.money !== undefined) collaboratorMoney = result[0].collaborator.money;
                else collaboratorMoney = 0
                const sum = result[0].userMoney + collaboratorMoney + result[0].companyMoney;
                let mailOptions = {
                  from: '"Fly&Claim " <rxzone@gmail.com>',
                  to: result[0].username.email,
                  subject: "INFORMATION ABOUT YOUR " + sum + "€ CLAIM IN FLYANDCLAIM, IT'S LESS!",
                  attachments: [{
                    filename: 'fly.png',
                    path: clientUrl + '/assets/web-icons/fly.png',
                    cid: 'abcdse@gm.com' //same cid value as in the html img src
                  }],
                  html: `<div class="container" style="font-family: Montserrat;color: #727c8f;font-size: 17px;">
                            <div class="row" style="margin-top:1em;width: calc(50% + 150px); margin: auto">
                                <div class="col-lg-2 col-sm-1 col-xs-1"></div>
                                <div class="col-lg-8 col-sm-10 col-xs-10" style="">
                                  <center><a href="https://www.flyandclaim.com"><img src="cid:abcdse@gm.com" style="width: 90px;margin-top:1em;;"></a></center>
                                  <hr style="margin-top:1em;border: 0.4px solid #727c8f;">
                                  <div>
                                    <p>Hello ${result[0].username.firstName},</p>
                                    <p style="line-height: 1.2">
                                    We inform you that there is not much left so that you can collect your compensation. A month ago we contacted the State Aviation Safety Agency to study your case and provide a response, in this regard, in a maximum time of 4 months. If, after this period of time, 
                                    you conclude positively that the ${result[0].claimType}, which you suffered in Madrid, you are entitled to compensation of ${sum}€, we will be about to collect such compensation.<br><br>
                                    At Fly & Claim we take care of all the development and evolution of the claim so that this process is as simple as possible. We only ask for a bit of patience in order to obtain results because, in 99% of cases, we get the compensation stipulated in favor of our clients.<br><br>
                                    As you know, we assume all the costs of the claim process, so you do not have to worry about it; In the remote case of not getting any compensation, our service would be totally free.<br><br>
                                    In the meantime, we would like to inform you that it is possible to obtain compensation of up to € 600 for any flight that has suffered a delay of more than 3 hours, cancellation or overbooking in the last 5 years. Therefore, we hope that, in case you have been involved in incidents with any of the characteristics described above, do not hesitate to contact us again to claim your compensation. Remember that, in case of not getting any compensation, our service is free, so you only have to find that old flight; we take care of the rest.<br><br>
                                    If any other passenger was traveling with you and wants to make a claim with us, it is the right time to share your promotional code. For each person who uses it you will get € 10. In addition, anyone who introduces it, will also get € 10 more when receiving compensation for the delay of your flight.
                                    </p><br>
                                    <p style="margin-top: 1em;">We remain at your disposal.<br>Thank you,</p>
                                    <p>The Fly&Claim Team</p>
                                  </div>
                                  <hr style="margin-top:1em;border: 0.4px solid #727c8f;">
                                  <center style="margin-top:2em; line-height: 1.2;font-size:13px">
                                  <p style="margin:0"><span style="display:inline-flex;padding-right:140px;"><a style="text-decoration: none;color: #727c8f" href="https://www.flyandclaim.com/contact">Contact</a></span>
                                  <span><a style="text-decoration: none;color: #727c8f" href="https://www.flyandclaim.com/privacy">Privacy Policy</a></span></p>
                                  <p>Copyright &copy; FLYANDCLAIM SLU 2018</p>
                                  <p>This message was sent by Fly&Claim</p>
                                  <a href="https://www.flyandclaim.com"><img src="cid:abcdse@gm.com" style="width: 50px;"></a>
                                </center>
                              </div>
                              <div class="col-lg-2 col-sm-1 col-xs-1"></div>
                            </div>
                          </div>`
                };
                transporter.sendMail(mailOptions, function (error, info) {
                  if (error) {
                    return res.status(404).json(error);
                  } else { }
                });
              }
            }
          })
        });
      });
  },
  listUser: (req, res, next) => {
    User.find({}, (err, users) => {
      if (err) return res.status(400).json(err);
      return res.status(200).json(users);
    });
  },
  deleteClaim: (req, res, next) => {
    if (req.body.deletePassword === process.env.ADMIN_PASSWORD) {
      Claim.findByIdAndRemove({ _id: req.body.id })
        .exec(
          (err, docs) => {
            if (err) return res.status(400).json(err);
            else return res.status(200).json(docs);
          });
    } else return res.status(401).json({ message: 'Incorrect password to delete this document' });
  },
};


function mailTouser(result, subject, text, callback) {

  nodemailer.createTestAccount((err, account) => {
    var mailOptions = {
      from: '"Fly&Claim " <rxzone@gmail.com>',
      to: result[0].username.email,
      subject: subject,
      attachments: [{
        filename: 'fly.png',
        path: clientUrl + '/assets/web-icons/fly.png',
        cid: 'abcdse@gm.com' //same cid value as in the html img src
      }],
      html: `<div class="container" style="font-family: Montserrat;color: #727c8f;font-size: 17px;">
              <div class="row" style="margin-top:1em;width: calc(50% + 150px); margin: auto">
                <div class="col-lg-2 col-sm-1 col-xs-1"></div>
                <div class="col-lg-8 col-sm-10 col-xs-10" style="">
                  <center><a href="https://www.flyandclaim.com"><img src="cid:abcdse@gm.com" style="width: 90px;margin-top:1em;;"></a></center>
                  <hr style="margin-top:1em;border: 0.4px solid #727c8f;">
                  <div>
                    ${text}
                    <p style="margin-top: 1em;">We remain at your disposal.<br>Thank you,</p>
                    <p>The Fly&Claim Team</p>
                  </div>
                  <hr style="margin-top:1em;border: 0.4px solid #727c8f;">
                  <center style="margin-top:2em; line-height: 1.2;font-size:13px">
                  <p style="margin:0"><span style="display:inline-flex;padding-right:140px;"><a style="text-decoration: none;color: #727c8f" href="https://www.flyandclaim.com/contact">Contact</a></span>
                  <span><a style="text-decoration: none;color: #727c8f" href="https://www.flyandclaim.com/privacy">Privacy Policy</a></span></p>
                  <p>Copyright &copy; FLYANDCLAIM SLU 2018</p>
                  <p>This message was sent by Fly&Claim</p>
                    <a href="https://www.flyandclaim.com"><img src="cid:abcdse@gm.com" style="width: 50px;"></a>
                  </center>
                </div>
                <div class="col-lg-2 col-sm-1 col-xs-1"></div>
              </div>
              </div>`
    };
    transporter.sendMail(mailOptions, function (err, information) {
      if (err) callback(false);
      else {
        callback(true);
      }
    })
  });
}