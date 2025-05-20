const nodemailer = require('nodemailer');

class MailSending {
    NewReceptionMail(personMail, personName, company, fillial_city, fillial_adress, employee_name, serviceList, date, time, endTime){
        const transporter = nodemailer.createTransport({
            host: 'smtp.mail.ru',
            port: 465,
            secure: true,
            auth: {
                user: "hello@clycon.com",
                pass: "ZycfJTcsXXJLswJfzEnL"
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
        
        const options = {
            from: `${company} <hello@clycon.com>`,
            to: personMail,
            subject: "Вы записаны на приём!",
            text: "Отлично, вы записаны на приём в 12:22",
            html: `
            <!doctype html>
<html lang="ru" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
    xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <title></title>
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!--<![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style type="text/css">
        #outlook a {
            padding: 0;
        }

        body {
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        table,
        td {
            border-collapse: collapse;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }

        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
        }

        p {
            display: block;
            margin: 0;
        }
    </style>
    <!--[if mso]> <noscript><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
<![endif]-->
    <!--[if lte mso 11]>
<style type="text/css">
.ogf{width:100% !important;}
</style>
<![endif]-->
    <!--[if !mso]><!-->
    <link href="https://fonts.googleapis.com/css?family=Inter:700,400" rel="stylesheet" type="text/css">

    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <!--[if gte mso 9]>
<style>a:link,span.MsoHyperlink{mso-style-priority:99;color:inherit;text-decoration:none;}a:visited,span.MsoHyperlinkFollowed{mso-style-priority:99;color:inherit;text-decoration:none;}li{text-indent:-1em;}table,td,p,div,span,ul,ol,li,a{mso-hyphenate:none;}
</style>
<![endif]-->
</head>

<body lang="en" link="#DD0000" vlink="#DD0000" class="emailify"
    style="mso-line-height-rule:exactly;mso-hyphenate:none;word-spacing:normal;background-color:#fff;">
    <div class="bg" style="background-color:#fff;" lang="en">
        <!--[if mso | IE]>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="r-outlook -outlook pr-16-outlook pl-16-outlook -outlook" role="presentation" style="width:600px;" width="600"><tr><td style="line-height:0;font-size:0;mso-line-height-rule:exactly;">
<![endif]-->

        <!--[if mso | IE]>
</td></tr></table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="r-outlook -outlook pt-0-outlook pr-0-outlook pb-0-outlook pl-0-outlook -outlook" role="presentation" style="width:600px;" width="600"><tr><td style="line-height:0;font-size:0;mso-line-height-rule:exactly;">
<![endif]-->
        <div class="r  pt-0 pr-0 pb-0 pl-0"
            style="background:#fff;background-color:#fff;margin:0px auto;">
            <table align="left" border="0" cellpadding="0" cellspacing="0" role="presentation"
                style="background:#fff;background-color:#fff;width:100%;">
                <tbody>
                    <tr>
                        <td align="center" valign="top" class="mob_bg_mr_css_attr" bgcolor="#fff" style="background-position: center top;background-repeat: no-repeat;background-position: center top;">
				
                            <table cellpadding="0" cellspacing="0" border="0" width="600" class="table600_mr_css_attr" style="width: 100%;max-width: 600px;min-width: 320px;">
                                
                                <tbody><tr>
                                    <td align="center" valign="top">
                                        <table class="mob_90_mr_css_attr" cellpadding="0" cellspacing="0" width="96%" border="0" style="max-width: 576px;min-width: 288px;">
                                            <tbody><tr>
                                                <td align="left">
                                                    <div class="mob_h32_mr_css_attr" style="height: 22px;line-height: 36px;font-size: 8px;">&nbsp;</div>
                                                    <a href="/" target="_blank" style="display: block;max-width: 160px;" rel=" noopener noreferrer">
                                                        <img src="https://i.postimg.cc/J0YpCL6r/logo-zoo.png" width="85" border="0" alt="" style="display: block;width: 100%;max-width: 160px;">
                                                    </a>
                                                    <div class="mob_h36_mr_css_attr" style="height: 22px;line-height: 48px;font-size: 8px;">&nbsp;</div>
                                                </td>
                                            </tr>
                                        </tbody></table>
                                    </td>
                                </tr>

                                <tr>
                                    <td align="center" valign="top">
                                        <table class="mob_br24_mr_css_attr mob_90_mr_css_attr" cellpadding="0" cellspacing="0" width="96%" border="0" style="max-width: 576px;min-width: 288px;background: #F5F5F5;border-radius: 32px;overflow: hidden;">
                                            <tbody><tr>
                                                <td align="center">
                                                    <table class="mob_75_mr_css_attr" cellpadding="0" cellspacing="0" width="84%" border="0" style="max-width: 480px;min-width: 216px;">
                                                        <tbody><tr>
                                                            <td align="left" valign="middle">
                                                                <div class="mob_h36_mr_css_attr" style="height: 48px;line-height: 48px;font-size: 8px;">&nbsp;</div>
                                                                <div class="mob_txt32_mr_css_attr" style="font-family: 'MailSans', Helvetica, Arial, sans-serif;color: #2C2D2E;font-size: 40px;line-height: 46px;">Уведомление о записи</div>
                                                                <div class="mob_h16_mr_css_attr" style="height: 24px;line-height: 24px;font-size: 8px;">&nbsp;</div>
                                                                <div class="mob_txt16_mr_css_attr" style="font-family: Arial, sans-serif;color: #2C2D2E;font-size: 20px;line-height: 28px;">Здравствуйте, ${personName}! Уведомляем вас о записи в "${company}", вот информация о ней:</div>
                                                                <div class="mob_h36_mr_css_attr" style="height: 48px;line-height: 48px;font-size: 8px;">&nbsp;</div>
                                                            </td>
                                                        </tr>
                                                    </tbody></table>
                                                </td>
                                            </tr>
                                        </tbody></table>
                                        <div class="mob_h36_mr_css_attr" style="height: 12px;line-height: 48px;font-size: 8px;">&nbsp;</div>
                                    </td>
                                </tr>
                                
                                
                                <tr>
                                    <td align="center" valign="top">
                                        <table class="mob_br24_mr_css_attr mob_90_mr_css_attr" cellpadding="0" cellspacing="0" width="96%" border="0" style="max-width: 576px;min-width: 288px;background: #FEA135;border-radius: 32px;overflow: hidden;">
                                            <tbody><tr>
                                                <td align="center">
                                                    <table class="mob_75_mr_css_attr" cellpadding="0" cellspacing="0" width="84%" border="0" style="max-width: 480px;min-width: 216px;">
                                                        <tbody><tr>
                                                            <td align="left" valign="middle">
                                                                <div class="mob_h36_mr_css_attr" style="height: 48px;line-height: 48px;font-size: 8px;">&nbsp;</div>
                                                                <div class="mob_txt24_mr_css_attr" style="font-family: 'MailSans', Helvetica, Arial, sans-serif;color: #000000;font-size: 36px;line-height: 46px;">О записи</div> 
                                                                <div class="mob_h8_mr_css_attr" style="height: 14px;line-height: 14px;font-size: 8px;">&nbsp;</div>
                                                                <div class="mob_txt16_mr_css_attr" style="font-family: 'MailSans', Helvetica, Arial, sans-serif;color: #000000;font-size: 20px;line-height: 28px; text-align: start;">Дата: ${date}</div>
                                                                <div class="mob_txt16_mr_css_attr" style="font-family: 'MailSans', Helvetica, Arial, sans-serif;color: #000000;font-size: 20px;line-height: 28px; text-align: start;">Время: ${time} - ${endTime}</div>
                                                                <div class="mob_txt16_mr_css_attr" style="font-family: 'MailSans', Helvetica, Arial, sans-serif;color: #000000;font-size: 20px;line-height: 28px; text-align: start; margin-top: 8px;">${serviceList.length === 1 ? `Услуга: ${serviceList[0]}` :  `Услуги: ${serviceList.map((service) => {return(`  ${service}`)})}`}</div>
                                                                <div class="mob_txt16_mr_css_attr" style="font-family: 'MailSans', Helvetica, Arial, sans-serif;color: #000000;font-size: 20px;line-height: 28px; text-align: start; margin-top: 8px;">Адрес: ${fillial_city}, ${fillial_adress}</div> 
                                                                <div class="mob_txt16_mr_css_attr" style="font-family: 'MailSans', Helvetica, Arial, sans-serif;color: #000000;font-size: 20px;line-height: 28px; text-align: start; margin-top: 8px;">Вас примет: ${employee_name}</div>
                                        
                                                                <div class="mob_h8_mr_css_attr" style="height: 14px;line-height: 14px;font-size: 8px; ">&nbsp;</div>
                                                                <div class="mob_h8_mr_css_attr" style="height: 14px;line-height: 14px;font-size: 8px;">&nbsp;</div>
                                                                <table cellpadding="0" cellspacing="0" width="55%" border="0" style="max-width: 235px;min-width: 235px;">
                                                                    <tbody><tr>
                                                                        <td class="mob_btn1_mr_css_attr" align="center" valign="middle" height="60" style="height: 60px;background: #1F1F1F;border-radius: 12px;">
                                                                            <a href="https://www.google.ru/maps/search/${fillial_city},+${fillial_adress},+${company}" class="mob_btn2_mr_css_attr" target="_blank" style="display: block;width: 100%;height: 60px;font-family: 'MailSans', Helvetica, Arial, sans-serif;color: #ffffff;font-size: 20px;line-height: 60px;text-decoration: none;" rel=" noopener noreferrer">Адрес на карте</a>
                                                                        </td>
                                                                    </tr>
                                                                </tbody></table>
                                                                <div class="mob_h36_mr_css_attr" style="height: 48px;line-height: 48px;font-size: 8px;">&nbsp;</div>
                                                            </td>
                                                        </tr>
                                                    </tbody></table>
                                                </td>
                                            </tr>
                                        </tbody></table>
                                        <div class="mob_h36_mr_css_attr" style="height: 48px;line-height: 48px;font-size: 8px;">&nbsp;</div>
                                    </td>
                                </tr>
                                
                                <tr>
                                    <td align="center" valign="top">
                                        <table class="mob_75_mr_css_attr" cellpadding="0" cellspacing="0" width="96%" border="0" style="max-width: 576px;min-width: 248px;">
                                            <tbody><tr>
                                                <td align="left">
                                                    <div class="mob_txt20_mr_css_attr" style="font-family: 'MailSans', Helvetica, Arial, sans-serif;color: #2C2D2E;font-size: 28px;line-height: 36px;">С заботой о вас, команда Зоостиль59</span></div>
                                                    <div class="mob_h16_mr_css_attr" style="height: 20px;line-height: 20px;font-size: 8px;">&nbsp;</div>                                
                                                    <div class="mob_h36_mr_css_attr" style="height: 48px;line-height: 48px;font-size: 8px;">&nbsp;</div>
                                                </td>
                                            </tr>
                                        </tbody></table>
                                    </td>
                                </tr>
                                
                            </tbody></table>
                            
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!--[if mso | IE]>
</td></tr></table>
<![endif]-->
    </div>
</body>

</html>
            `,
        }
        
        transporter.sendMail(options, function(err, info) {
            if(err){
                console.log('\n\n\n', err, '\n\n\n');
                return;
            }
            console.log('\n\n\n', info.response, '\n\n\n');
        })
    }
}

module.exports = new MailSending()
