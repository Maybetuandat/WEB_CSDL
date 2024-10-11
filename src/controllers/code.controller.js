var request = require("request");
require("dotenv").config();
const { createSubmitCode } = require("../services/result.services");
// define access parameters
var accessToken = process.env.TOKEN_PROBLEM;
var endpoint = process.env.ENDPOINT_API;

// define request parameters
// var submissionId = 66439554;

// send request

const codeSubmit = async (req, res) => {
  let submissionId = req.body.submissionid;
  let msv = req.jwtDecoded.data.id;

  request(
    {
      url:
        "https://" +
        endpoint +
        "/api/v4/submissions/" +
        submissionId +
        "?access_token=" +
        accessToken,
      method: "GET",
    },
    async (error, response, body) => {
      if (error) {
      }

      // process response
      if (response) {
        if (response.statusCode === 200) {
          var responseData = JSON.parse(response.body);
          var output = responseData.result.testcases;
          let namestatus = responseData.result.status.name;

          await createSubmitCode(
            msv,
            submissionId,
            responseData.problem.name,
            namestatus,
            responseData.result.streams.source.uri
          );
        } else {
          if (response.statusCode === 401) {
          } else if (response.statusCode === 403) {
          } else if (response.statusCode === 404) {
          }
        }
      }
    }
  );

  // await createSubmitCode(msv, submissionId)
};

module.exports = { codeSubmit };
