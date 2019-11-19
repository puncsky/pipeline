const concat = require("concat-stream");
const fd = new FormData();

fd.append("hello", "world");
fd.append("file", new Blob(["test payload"], { type: "text/csv" }));
fd.pipe(
  concat(data => {
    axios.post("/hello", data, {
      headers: fd.getHeaders()
    });
  })
);

const data = new FormData();

data.append("action", "ADD");
data.append("param", 0);
data.append("secondParam", 0);
data.append("file", new Blob(["test payload"], { type: "text/csv" }));

axios.post("http://httpbin.org/post", data);
