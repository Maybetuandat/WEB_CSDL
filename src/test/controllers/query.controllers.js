const {
  executeQueryTest,
  executeUserQuery,
} = require("../services/query.services");

module.exports.executeQuery = async (req, res) => {
  try {
    const result = await executeQueryTest();
    // console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.postUserQuery = async (req, res) => {
  try {
    const query = req.body;
    console.log(JSON.stringify(query.chitiet));
    const result = await executeUserQuery(query.chitiet);
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
