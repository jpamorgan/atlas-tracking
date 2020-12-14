// const setup = require("../_lib/setup.html");

module.exports = async (req, res) => {
  try {
    const ADMIN_SECRET = process.env.ADMIN_SECRET || "superSecretKey";
    if (req.query.secret !== ADMIN_SECRET)
      throw new Error("Missing auth param");

    // const ENDPOINT_HEADER =
    //   req.headers["x-vercel-deployment-url"] &&
    //   `https://${req.headers["x-vercel-deployment-url"]}`;

    const ENDPOINT_URL = process.env.ENDPOINT_URL;

    const snippet = [
      `&lt;script&gt;!function(e,n){var o=e.atlas=e.atlas||{};o.invoked?e.console&&console.error&&console.error("Atlas tracking snippet included twice"):(o.invoked=!0,o.load=function(e){var t=n.createElement("script");t.type="text/javascript",t.async=!0;var a=n.getElementsByTagName("script")[0];t.src=e + "/snippet.js",a.parentNode.insertBefore(t,a)},`,
      `o.load("${ENDPOINT_URL}")`,
      // eslint-disable-next-line no-useless-escape
      ")}(window,document);&lt;/script&gt;",
    ].join("");

    res.send(`
    <html>
  <head>
    <link
      href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css"
      rel="stylesheet"
    />
    <style>
      html {
        font-size: 14px;

        /* Font Smoothing */
        font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
        -moz-osx-font-smoothing: grayscale;
        -webkit-font-smoothing: antialiased;
        font-feature-settings: "kern" 1, "dlig" 1, "opbd" 1, "ss01" 1;
        text-shadow: rgba(0, 0, 0, 0.01) 0 0 1px;
      }
    </style>
  </head>
  <body class="bg-gradient-to-r from-gray-50 to-gray-200">
    <div class="relative py-3 my-20 mx-auto max-w-3xl">
      <h1 class="mb-12 text-5xl font-bold tracking-tight text-gray-700">
        Atlas analytics setup
      </h1>
      <div
      class="relative px-4 py-10 bg-white mb-6 shadow-2xl sm:rounded-3xl sm:p-12"
    >
      <div class="max-w-3xl mx-auto">
        <div>
          <h2 class="mb-2 text-3xl font-bold tracking-tight text-gray-700">
            Frontend tracking
          </h2>
          <p class="mb-6 text-lg leading-7 text-gray-600">
            Track events from the frontend of your marketing site or web application. Copy and paste this asynchronous tracking snippet into the <code
            class="inline-block px-1 font-semibold text-gray-600 bg-gray-100 rounded"
            >&lt;head&gt;</code
          > section of all your pages.
          </p>
          <div>
            <input id="snippet" type="text" class="py-2 block w-full px-3 rounded-md text-gray-500 border border-gray-200 shadow-sm mb-3" value='${snippet}'>
              
            </input>
            <button
              data-clipboard-target="#snippet"
              class="relative inline-flex items-center justify-center font-semibold transition duration-150 ease-in-out border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 px-4 py-2 text-base leading-6 text-white bg-green-500 border-transparent shadow-sm hover:bg-green-400 focus:ring-green-400 active:bg-green-600"
            >
              <span class="inline-flex items-center"
                ><div>
                  <svg
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    class="w-5 h-5"
                  >
                    <path
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    ></path>
                  </svg>
                </div>
                <div class="ml-2">Copy snippet</div></span
              >
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="relative px-4 py-10 bg-white shadow-2xl sm:rounded-3xl sm:p-12"
    >
      <div class="max-w-3xl mx-auto">
        <div>
          <h2 class="mb-2 text-3xl font-bold tracking-tight text-gray-700">
            Stripe webhooks
          </h2>
          <p class="mb-6 text-lg leading-7 text-gray-600">
            Paste into the bottom of your page as close to the closing
            <code
              class="inline-block px-1 font-semibold text-gray-600 bg-gray-100 rounded"
              >&lt;/body&gt;</code
            >
            tag as possible or into your Google Tag Manager account.
          </p>
          <div>
            <input id="stripeEndpoint" type="text" class="py-2 block w-full px-3 text-lg font-medium rounded-md text-gray-700 border border-gray-200 shadow-sm mb-3" value="${ENDPOINT_URL}/api/stripe">
            
            </input>
            <button
              data-clipboard-target="#stripeEndpoint"
              class="relative inline-flex items-center justify-center font-semibold transition duration-150 ease-in-out border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 px-4 py-2 text-base leading-6 text-white bg-blue-500 border-transparent shadow-sm hover:bg-blue-400 focus:ring-blue-400 active:bg-blue-600"
            >
              <span class="inline-flex items-center"
                ><div>
                  <svg
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    class="w-5 h-5"
                  >
                    <path
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    ></path>
                  </svg>
                </div>
                <div class="ml-2">Copy webhook endpoint</div></span
              >
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.6/clipboard.min.js"></script>
    <script>
      var btns = document.querySelectorAll('button');
      console.log(btns)
      var clipboard = new ClipboardJS(btns);

      clipboard.on('success', function(e) {
          console.log('Copied to clipboard');
      });

      clipboard.on('error', function(e) {
          alert('There was a problem copying the value to your clipboard.  Try selecting it manually.')
      });
    </script>
  </body>
</html>

    `);
  } catch (err) {
    res.status(404).json({
      message: err.message || "There was an error processing this request",
    });
  }
};
