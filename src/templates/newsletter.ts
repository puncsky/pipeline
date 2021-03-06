// tslint:disable-next-line:max-func-body-length
export const getHtml = ({
  content,
  unsubscribeUrl,
  siteUrl = "https://vitamart.io",
  siteBrand = "brand",
  brandColor = "#fbb03b"
}: {
  content: string;
  unsubscribeUrl?: string;
  siteUrl?: string;
  siteBrand?: string;
  brandColor?: string;
}) => {
  return `
<!DOCTYPE html><html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml"><head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
      <!--[if !mso]><!-->
      <meta http-equiv="X-UA-Compatible" content="IE=Edge">
      <!--<![endif]-->
      <!--[if (gte mso 9)|(IE)]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
      <![endif]-->
      <!--[if (gte mso 9)|(IE)]>
      <style type="text/css">
        body {width: 600px;margin: 0 auto;}
        table {border-collapse: collapse;}
        table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
        img {-ms-interpolation-mode: bicubic;}
      </style>
      <![endif]-->
      <style type="text/css">
        body, p, div {
          font-family: arial,helvetica,sans-serif;
          font-size: 14px;
        }
        body {
          color: #000000;
        }
        body a {
          color: #1188E6;
          text-decoration: none;
        }
        p { margin: 0; padding: 0; }
        table.wrapper {
          width:100% !important;
          table-layout: fixed;
          -webkit-font-smoothing: antialiased;
          -webkit-text-size-adjust: 100%;
          -moz-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
        img.max-width {
          max-width: 100% !important;
        }
        .column.of-2 {
          width: 50%;
        }
        .column.of-3 {
          width: 33.333%;
        }
        .column.of-4 {
          width: 25%;
        }
        @media screen and (max-width:480px) {
          .preheader .rightColumnContent,
          .footer .rightColumnContent {
            text-align: left !important;
          }
          .preheader .rightColumnContent div,
          .preheader .rightColumnContent span,
          .footer .rightColumnContent div,
          .footer .rightColumnContent span {
            text-align: left !important;
          }
          .preheader .rightColumnContent,
          .preheader .leftColumnContent {
            font-size: 80% !important;
            padding: 5px 0;
          }
          table.wrapper-mobile {
            width: 100% !important;
            table-layout: fixed;
          }
          img.max-width {
            height: auto !important;
            max-width: 480px !important;
          }
          a.bulletproof-button {
            display: block !important;
            width: auto !important;
            font-size: 80%;
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          .columns {
            width: 100% !important;
          }
          .column {
            display: block !important;
            width: 100% !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
        }
      </style>
    </head>
    <body>
      <center class="wrapper" data-link-color="#1188E6" data-body-style="font-size:14px;font-family:arial,helvetica,sans-serif;color:#000000;background-color:#FFFFFF;">
        <div class="webkit">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#FFFFFF">
            <tbody><tr>
              <td valign="top" bgcolor="#FFFFFF" width="100%">
                <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
                  <tbody><tr>
                    <td width="100%">
<div style="color:#000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';line-height:18px">

    <div>
  <table border="0" cellpadding="0" cellspacing="0" width="100%" height="100%" bgcolor="#f9f9f9">
    <tbody><tr>
      <td>
        <div style="margin:0 auto;max-width:600px;padding:20px 10px">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" height="100%">
            <tbody><tr>
              <td>
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tbody><tr>
                    <td>
                      <a href="${siteUrl}" title="${siteBrand}" style="color:${brandColor}!important;display:block;margin-bottom:10px;text-align:left!important;text-decoration:none;width:100%" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://gmzr.mjt.lu/lnk/BAAAAGqn3PoAAAAAAAAAAKhAiVwAAVNI2qYAAAAAAAcXzQBdlSB4HsXO_E_1Qo64za9sk_w4gwAF1QU/1/qF5n9rX6Y3b7BopicFATmg/aHR0cHM6Ly93d3cucHJvZHVjdGh1bnQuY29t&amp;source=gmail&amp;ust=1571955691912000&amp;usg=AFQjCNEcJt3DZnzSG2MNyT22v2GLI2SEkw">
  <img alt="" src="https://luckydraw.vitamart.io/favicon.png" style="height:30px;width:30px" class="CToWUd">
  <span style="color:${brandColor};font-family:'Helvetica Neue',Helvetica,Arial,'Lucida Grande',sans-serif;font-size:18px;font-weight:bold;line-height:30px;margin-left:5px;vertical-align:top"><span class="il">Vitamart.io</span></span>
</a>

                    </td>
                    <td style="color:#6f6f6f;font-size:13px;text-align:right" align="right">
                      ${new Date()}
                    </td>
                  </tr>
                </tbody></table>
              </td>
            </tr>
            <tr>
              <td height="20"></td>
            </tr>
            <tr>
              <td>
                
  <div style="background:#fff;border-radius:3px;margin-bottom:20px;padding:25px">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#ffffff">
    <tbody><tr>
      <td style="font-size:16px;line-height:22px">
        


${content}


      </td>
    </tr>
  </tbody></table>
</div>

                <div style="color:#6f6f6f;font-size:12px;text-align:center" align="center">
  
                  <p>If you have any questions, feedback, ideas or problems don't hesitate to contact us!</p>
                  <p>68 Willow Road, Menlo Park, CA 94102</p>
                  <p><a style="color:#88888f" href="${unsubscribeUrl}">Unsubscribe</a></p>
</div>
              </td>
            </tr>
          </tbody></table>
        </div>
      </td>
    </tr>
  </tbody></table>
</div>

  
</div>

                        </td></tr></tbody></table>
                    </td>
                  </tr>
                </tbody></table>
              
            
          
        </div>
      </center>
    
  
</body></html>
`;
};
