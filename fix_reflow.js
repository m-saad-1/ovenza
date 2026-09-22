const fs = require('fs');
const path = require('path');

const jsPath = path.join(__dirname, 'assets', 'js', 'script.bundle.js');
let content = fs.readFileSync(jsPath, 'utf8');

const targetStr = `updateUI() {
      let e = window.innerWidth,
        t = this.getTotalItems(),
        o = this.getSubtotal(),
        i = \`Rs \${H(o)}\`;
      document.querySelectorAll('a[href*="cart.html"] .badge').forEach((y) => {
        ((y.textContent = t), (y.style.display = t > 0 ? "flex" : "none"));
      });
      let r = document.querySelector(".floating-cart-bar"),
        n = document.querySelector(".chatbot-widget");
      if (r)
        if (
          t > 0 &&
          !window.location.pathname.includes("cart.html") &&
          !window.location.pathname.includes("checkout.html")
        ) {
          ((r.style.display = "flex"),
            document.documentElement.style.setProperty(
              "--cart-offset",
              "75px",
            ));
          let y = r.querySelector(".cart-count"),
            l = r.querySelector(".cart-total");
          (y && (y.textContent = \`\${t} item\${t > 1 ? "s" : ""}\`),
            l && (l.textContent = i),
            n && e <= 768 && (n.style.bottom = "85px"));
        } else
          ((r.style.display = "none"),
            document.documentElement.style.setProperty("--cart-offset", "0px"),
            n && (n.style.bottom = "20px"));
    }`;

const replacementStr = `updateUI() {
      let e = window.innerWidth,
        t = this.getTotalItems(),
        o = this.getSubtotal(),
        i = \`Rs \${H(o)}\`;
      requestAnimationFrame(() => {
        document.querySelectorAll('a[href*="cart.html"] .badge').forEach((y) => {
          ((y.textContent = t), (y.style.display = t > 0 ? "flex" : "none"));
        });
        let r = document.querySelector(".floating-cart-bar"),
          n = document.querySelector(".chatbot-widget");
        if (r)
          if (
            t > 0 &&
            !window.location.pathname.includes("cart.html") &&
            !window.location.pathname.includes("checkout.html")
          ) {
            ((r.style.display = "flex"),
              document.documentElement.style.setProperty(
                "--cart-offset",
                "75px",
              ));
            let y = r.querySelector(".cart-count"),
              l = r.querySelector(".cart-total");
            (y && (y.textContent = \`\${t} item\${t > 1 ? "s" : ""}\`),
              l && (l.textContent = i),
              n && e <= 768 && (n.style.bottom = "85px"));
          } else
            ((r.style.display = "none"),
              document.documentElement.style.setProperty("--cart-offset", "0px"),
              n && (n.style.bottom = "20px"));
      });
    }`;

content = content.replace(targetStr, replacementStr);

fs.writeFileSync(jsPath, content, 'utf8');
console.log('Fixed reflow in updateUI in script.bundle.js');
