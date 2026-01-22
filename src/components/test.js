import axios from "axios";

const { data } = await axios.post("http://host.docker.internal:3000/api/chat", { prompt: "hi" });

console.log(data)