import axios from "axios";
// async function getSampleData() {
//   try {
//     return response;
//   } catch (error) {
//     return error;
//   }
// }

module.exports = async (req, res) => {
  const response = await axios("https://www.json.org/example.html");
  res.json({ name: "John", email: "john@example.com", data: response.data });
};
