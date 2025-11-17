import React from 'react'

export default function NewsletterEmbed() {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `
        <div id="mc_embed_shell">
          <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600&display=swap" rel="stylesheet">
          <link href="//cdn-images.mailchimp.com/embedcode/classic-061523.css" rel="stylesheet" type="text/css">
          <style type="text/css">
            /* Styling default Mailchimp */
            #mc_embed_signup {
              font-family: 'Open Sans', sans-serif !important;
              font-size: 14px;
              width: 700px;
              margin: 0 auto; /* posisi form di tengah */
              text-align: center;
            }

            /* Styling h2 */
            #mc_embed_signup h2 {
              font-weight: 300 !important;
              color: white !important;
              font-family: 'Open Sans', sans-serif !important;
              font-size: 16px;
              color: white !important;
              margin-bottom: 20px;
              line-height: 1.4;
              text-transform: uppercase;
              letter-spacing: 2px; 
            }

            /* Input email */
            #mc_embed_signup input[type="email"] {
              display: block;
              margin: 0.5rem auto;
              width: 80%;
              max-width: 400px;
              text-align: left;
              border: 1px solid #ccc;
              padding: 8px;
              border-radius: 4px;
              transition: all 0.3s ease;
            }

            /* Border hover/focus */
            #mc_embed_signup input[type="email"]:hover,
            #mc_embed_signup input[type="email"]:focus {
              border-color: #4cbab2 !important;
              outline: none !important;
              box-shadow: 0 0 5px rgba(76, 186, 178, 0.5);
            }

            /* Tombol */
            #mc_embed_signup input[type="submit"] {
              display: block;
              margin: 0.5rem auto;
              background: transparent;
              border: 1px solid #ffffff;
              border-radius: 4px;
              font-family: 'Open Sans', sans-serif !important;
              font-size: 14px;
              letter-spacing: 1px; 
            }

            /* Responsif hanya untuk posisi di mobile */
            @media (max-width: 600px) {
              #mc_embed_signup {
                width: 100% !important;
                padding: 0 10px; /* beri ruang di kiri kanan */
              }
              #mc_embed_signup input[type="email"] {
                width: 100%;
                max-width: 100%;
              }
              #mc_embed_signup input[type="submit"] {
                width: auto;
              }
            }
          </style>
          
          <div id="mc_embed_signup">
            <form 
              action="https://destinasian.us5.list-manage.com/subscribe/post?u=d0b8ea5071a02b22d0fe3fca1&amp;id=43730c25f6&amp;f_id=00b499e3f0" 
              method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" 
              class="validate" target="_blank"
            >
              <div id="mc_embed_signup_scroll">
                <h2>Stay inspired with our DestinAsian Indonesia newsletters</h2>
                
                <div class="mc-field-group">
                  <input 
                    type="email" 
                    name="EMAIL" 
                    class="required email" 
                    id="mce-EMAIL" 
                    required 
                    placeholder="Email Address *"
                    value=""
                  >
                </div>
                
                <div id="mce-responses" class="clear">
                  <div class="response" id="mce-error-response" style="display:none"></div>
                  <div class="response" id="mce-success-response" style="display:none"></div>
                </div>
                
                <div aria-hidden="true" style="position:absolute; left:-5000px;">
                  <input type="text" name="b_d0b8ea5071a02b22d0fe3fca1_43730c25f6" tabindex="-1" value="">
                </div>
                
                <div class="clear">
                  <input type="submit" name="subscribe" id="mc-embedded-subscribe" class="button" value="Subscribe">
                </div>
              </div>
            </form>
          </div>

          <script type="text/javascript" src="//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js"></script>
          <script type="text/javascript">
            (function($) {
              window.fnames = new Array(); 
              window.ftypes = new Array();
              fnames[0] = 'EMAIL'; ftypes[0] = 'email';
              fnames[1] = 'FNAME'; ftypes[1] = 'text';
              fnames[2] = 'LNAME'; ftypes[2] = 'text';
              fnames[3] = 'ADDRESS'; ftypes[3] = 'address';
              fnames[4] = 'PHONE'; ftypes[4] = 'phone';
            }(jQuery));
            var $mcj = jQuery.noConflict(true);
          </script>
        </div>
        `,
      }}
    />
  )
}
