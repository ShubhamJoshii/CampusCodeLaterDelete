const OTPMail = (userName, otp) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Confirm Your Email</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link
      href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
      rel="stylesheet"
    />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <style>
      body {
        font-family: "Montserrat", sans-serif;
        font-weight: 600;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
      }
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #fff;
        border-radius: 10px;
        overflow: hidden;
      }
      .header {
        background-color: white;
        padding: 20px;
        text-align: center;
      }
      .content {
        padding: 20px;
        text-align: center;
      }
      .content h1 {
        font-size: 30px;
        color: #333;
      }
      .content p {
        font-size: 20px;
        color: #666;
        line-height: 1.5;
      }
      .cta-button {
        display: inline-block;
        padding: 15px 30px;
        background-color: #007bff;
        color: #fff !important;
        font-size: 20px;
        text-decoration: none;
        border-radius: 5px;
        margin-top: 20px;
      }
      .cta-button:hover {
        background-color: #0056b3;
      }
      .footer {
        background-color: #ffffff;
        padding: 20px;
        text-align: center;
        font-size: 14px;
        color: #666;
      }
      .social-icons {
        margin-top: 20px;
      }
      .social-icons img {
        width: 36px;
        margin: 0 10px;
      }
      .footer p {
        margin-top: 20px;
        font-size: 12px;
        color: #888;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <img
          src="https://res.cloudinary.com/dhwyjphl6/image/upload/v1726142212/Email%20Images/zxnxohqdmdwgenqsobcf.png"
          alt="Company Logo"
        />
      </div>

      <!-- Main Content Section -->
      <div class="content">
        <h1>Hey, thanks for Contacting Us!</h1>
        <img
        src="https://res.cloudinary.com/dhwyjphl6/image/upload/v1726142213/Email%20Images/tj1eattsf76flvilnlgw.png"
        alt="Illustration"
        style="width: 100%; max-width: 300px; margin-top: 20px"
        />
        <div style="margin-top: 30px; font-weight: bold; letter-spacing: 1px;">
          <p >Dear ${userName},</p>
          <p style=" margin: 4px;">Here is your One Time Password</p>
          <h1 style="letter-spacing: 10px;font-size: 60px; margin: 8px;">${otp}</h1>
          <span style="color: rgba(255, 0, 0, 0.692);font-size: 14px;">Valid for 10 minutes only</span>
        </div>

      </div>

      <div class="footer">
        <div class="social-icons">
          <a href="https://x.com/ShubhamJoshii03?t=TD1fIUJ3pUi-YhabSztJwA&s=09"
            ><img
              src="https://res.cloudinary.com/dhwyjphl6/image/upload/v1726142212/Email%20Images/j3mdz0espbkxc4wf4vtf.png"
              alt="twitter"
          /></a>
          <a
            href="https://www.instagram.com/invites/contact/?i=1k3g7gxwflgz0&utm_content=2of27u2"
            ><img
              src="https://res.cloudinary.com/dhwyjphl6/image/upload/v1726142211/Email%20Images/iv0xznfgvnr8wisporqr.png"
              alt="Instagram"
          /></a>
          <a href="https://www.linkedin.com/in/shubham-joshi-86aaa6232"
            ><img
              src="https://res.cloudinary.com/dhwyjphl6/image/upload/v1726142212/Email%20Images/z9cwszpric54o8jx52ua.png"
              alt="LinkedIn"
          /></a>
        </div>

        <!-- Footer Text -->
        <p>
          Want to change how you receive these emails? <br />
          You can update your preferences or unsubscribe from this list.
        </p>
        <p>&copy; 2024 Company. All Rights Reserved.</p>
      </div>
    </div>
  </body>
</html>
`

module.exports = OTPMail;

module.exports = OTPMail;