import fs from "fs";

import test from "ava";
import { getHtml } from "../newsletter";

test("newsletter", async t => {
  t.notThrows(() => {
    const str = getHtml({
      unsubscribeUrl: "https://vitamart.io",
      content: `<p>bbbbb</p>`
    });
    // tslint:disable-next-line:non-literal-fs-path prefer-template
    fs.writeFileSync(__dirname + "/newsletter.html", str);
  });
});
